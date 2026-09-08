import type { HmisDraft } from "../hmis-drafts";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import { getConfigRow, putConfigRow } from "./config-rows";
import {
    deleteEnrollmentCascade,
    deleteEventCascade,
    deleteTrackedEntityCascade,
} from "./delete-cascade";
import type { SqlDriver } from "./driver-types";
import { publishMigrationProgress } from "./migration-progress";
import { saveMetadataTable } from "./save-metadata";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "./tracker-collections-instance";

/**
 * One-time copy of a device's EXISTING local Dexie data into the SQLite
 * schema, per wayfinder ticket "Migration and Cutover Procedure Design"
 * (docs/wayfinder/dexie-to-opfs-sqlite/tickets/006-migration-cutover-procedure.md).
 * This exists because 3000+ devices already have real local data (draft/
 * pending tracker records, HMIS drafts) that only exists on the device —
 * re-deriving it from DHIS2 after cutover isn't just slow, it's impossible
 * for anything not yet pushed to the server.
 *
 * `DexieMigrationSource` abstracts the actual Dexie reads (real
 * implementation: `dexie-migration-source.ts`, browser-only, untestable
 * under `node:sqlite`) so this orchestration logic — the part that
 * actually matters to get right (what gets copied, in what order, how
 * failure is handled) — is unit-testable against a fake.
 */
export interface DexieMigrationSource {
    /** Presence check only — must not create a database that isn't there. */
    existsAnyDexieData(): Promise<boolean>;
    readTrackedEntities(): Promise<FlattenedTrackedEntity[]>;
    readEnrollments(): Promise<FlattenedEnrollment[]>;
    readEvents(): Promise<FlattenedEvent[]>;
    readHmisDrafts(): Promise<HmisDraft[]>;
    /** Drops all 5 old Dexie databases, including the always-empty RuleResults one. */
    dropAll(): Promise<void>;
}

const MIGRATION_STATUS_TABLE = "migration_status";
const MIGRATION_STATUS_ID = "dexie-migration";

type MigrationStatusRow = { id: string; completedAt: string };

async function markComplete(db: SqlDriver): Promise<void> {
    await putConfigRow<MigrationStatusRow>(db, MIGRATION_STATUS_TABLE, {
        id: MIGRATION_STATUS_ID,
        completedAt: new Date().toISOString(),
    });
}

/** Chunked so a device with a very large local dataset doesn't exceed a driver's per-query parameter limit. */
const ID_CHUNK_SIZE = 500;

function chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

async function countMatchingIds(
    db: SqlDriver,
    table: string,
    idColumn: string,
    ids: string[],
): Promise<number> {
    let total = 0;
    for (const idsChunk of chunk(ids, ID_CHUNK_SIZE)) {
        if (idsChunk.length === 0) continue;
        const placeholders = idsChunk.map(() => "?").join(", ");
        const result = await db.execute<{ count: number }>(
            `SELECT COUNT(*) as count FROM ${table} WHERE ${idColumn} IN (${placeholders})`,
            idsChunk,
        );
        total += result.rows[0]?.count ?? 0;
    }
    return total;
}

async function deleteMatchingIds(
    db: SqlDriver,
    table: string,
    idColumn: string,
    ids: string[],
): Promise<void> {
    for (const idsChunk of chunk(ids, ID_CHUNK_SIZE)) {
        if (idsChunk.length === 0) continue;
        const placeholders = idsChunk.map(() => "?").join(", ");
        await db.execute(
            `DELETE FROM ${table} WHERE ${idColumn} IN (${placeholders})`,
            idsChunk,
        );
    }
}

type WrittenKeys = {
    trackedEntities: string[];
    enrollments: string[];
    events: string[];
    hmisDrafts: string[];
};

async function cleanUpPartialWrite(
    db: SqlDriver,
    written: WrittenKeys,
): Promise<void> {
    // Use the real cascade functions (delete-cascade.ts), not a raw
    // DELETE FROM these tables directly — a tracked entity's attributes,
    // and any enrollments/events written under it, must go too, in FK
    // order, or this would trip the schema's REFERENCES constraints (or
    // silently orphan child rows). deleteTrackedEntityCascade already
    // cascades to that TE's own enrollments/events, so it runs first;
    // the enrollment/event cascades below are for anything written that
    // wasn't already covered by a TE in this same batch. All three are
    // no-ops on an already-deleted id.
    for (const id of written.trackedEntities) {
        await deleteTrackedEntityCascade(db, id);
    }
    for (const id of written.enrollments) {
        await deleteEnrollmentCascade(db, id);
    }
    for (const id of written.events) {
        await deleteEventCascade(db, id);
    }
    await deleteMatchingIds(db, "hmis_drafts", "id", written.hmisDrafts);
}

export async function runDexieMigrationIfNeeded(
    db: SqlDriver,
    source: DexieMigrationSource,
): Promise<void> {
    const existing = await getConfigRow<MigrationStatusRow>(
        db,
        MIGRATION_STATUS_TABLE,
        MIGRATION_STATUS_ID,
    );
    if (existing) {
        publishMigrationProgress({ phase: "done" });
        return;
    }

    publishMigrationProgress({ phase: "checking" });
    const hasDexieData = await source.existsAnyDexieData();
    if (!hasDexieData) {
        // Fresh install — nothing to copy, don't scan for it again next boot.
        await markComplete(db);
        publishMigrationProgress({ phase: "done" });
        return;
    }

    const written: WrittenKeys = {
        trackedEntities: [],
        enrollments: [],
        events: [],
        hmisDrafts: [],
    };

    try {
        const trackedEntities = await source.readTrackedEntities();
        publishMigrationProgress({
            phase: "copying",
            table: "trackedEntities",
            copied: 0,
            total: trackedEntities.length,
        });
        if (trackedEntities.length > 0) {
            await getTrackedEntitiesCollection().utils.bulkInsertLocally(
                trackedEntities,
                { source: "local" },
            );
        }
        written.trackedEntities = trackedEntities.map(
            (r) => r.trackedEntity,
        );
        publishMigrationProgress({
            phase: "copying",
            table: "trackedEntities",
            copied: trackedEntities.length,
            total: trackedEntities.length,
        });

        const enrollments = await source.readEnrollments();
        publishMigrationProgress({
            phase: "copying",
            table: "enrollments",
            copied: 0,
            total: enrollments.length,
        });
        if (enrollments.length > 0) {
            await getEnrollmentsCollection().utils.bulkInsertLocally(
                enrollments,
                { source: "local" },
            );
        }
        written.enrollments = enrollments.map((r) => r.enrollment);
        publishMigrationProgress({
            phase: "copying",
            table: "enrollments",
            copied: enrollments.length,
            total: enrollments.length,
        });

        const events = await source.readEvents();
        publishMigrationProgress({
            phase: "copying",
            table: "events",
            copied: 0,
            total: events.length,
        });
        if (events.length > 0) {
            await getEventsCollection().utils.bulkInsertLocally(events, {
                source: "local",
            });
        }
        written.events = events.map((r) => r.event);
        publishMigrationProgress({
            phase: "copying",
            table: "events",
            copied: events.length,
            total: events.length,
        });

        const hmisDrafts = await source.readHmisDrafts();
        publishMigrationProgress({
            phase: "copying",
            table: "hmisDrafts",
            copied: 0,
            total: hmisDrafts.length,
        });
        if (hmisDrafts.length > 0) {
            await saveMetadataTable(
                db,
                "hmis_drafts",
                hmisDrafts,
                (r) => r.id,
            );
        }
        written.hmisDrafts = hmisDrafts.map((r) => r.id);
        publishMigrationProgress({
            phase: "copying",
            table: "hmisDrafts",
            copied: hmisDrafts.length,
            total: hmisDrafts.length,
        });

        publishMigrationProgress({ phase: "verifying" });
        const [teCount, enrCount, evtCount, draftCount] = await Promise.all([
            countMatchingIds(
                db,
                "tracked_entities",
                "tracked_entity",
                written.trackedEntities,
            ),
            countMatchingIds(
                db,
                "enrollments",
                "enrollment",
                written.enrollments,
            ),
            countMatchingIds(db, "events", "event", written.events),
            countMatchingIds(db, "hmis_drafts", "id", written.hmisDrafts),
        ]);
        if (
            teCount !== written.trackedEntities.length ||
            enrCount !== written.enrollments.length ||
            evtCount !== written.events.length ||
            draftCount !== written.hmisDrafts.length
        ) {
            throw new Error(
                `Migration verification failed: expected ${written.trackedEntities.length}/${written.enrollments.length}/${written.events.length}/${written.hmisDrafts.length} tracked entities/enrollments/events/hmisDrafts, found ${teCount}/${enrCount}/${evtCount}/${draftCount}`,
            );
        }

        await markComplete(db);
        await source.dropAll();
        publishMigrationProgress({ phase: "done" });
    } catch (error) {
        // Restart from scratch on next boot (decision 5) — don't attempt
        // partial resume. The migration-complete flag is never written on
        // this path, so `existsAnyDexieData()` (Dexie untouched) drives a
        // full retry next time this runs.
        await cleanUpPartialWrite(db, written);
        publishMigrationProgress({
            phase: "failed",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
