import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    MetadataVersion,
} from "../../schemas";
import type { SyncState } from "../index";
import { replaceMetadataTables } from "../metadata-operations";
import { getConfigRow, putConfigRow } from "./config-rows";
import {
    deleteEnrollmentCascade,
    deleteEventCascade,
    deleteTrackedEntityCascade,
} from "./delete-cascade";
import type { SqlDriver } from "./driver-types";
import { sqliteMetadataStore } from "./metadata-store";
import { publishMigrationProgress } from "./migration-progress";
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
 * pending tracker records) that only exists on the device —
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
    /**
     * When Dexie was last booted as the live store (ISO timestamp), or
     * undefined if never. Dexie writes this on every boot as the live
     * store (`markDexieLive` in `../dexie/real-dexie-migration-target.ts`).
     */
    readDexieLastLiveAt(): Promise<string | undefined>;
    readTrackedEntities(): Promise<FlattenedTrackedEntity[]>;
    readEnrollments(): Promise<FlattenedEnrollment[]>;
    readEvents(): Promise<FlattenedEvent[]>;
    /** `sync_state`/id `"current"` — carries `lastPullAt`/`lastPushAt` (lastDataPull/lastDataPush). */
    readSyncState(): Promise<SyncState | undefined>;
    /** `metadata_versions`/id `"metadata-version"` — carries `lastSync` (lastMetadataPull). */
    readMetadataVersion(): Promise<MetadataVersion | undefined>;
    /**
     * Every row of every other live metadata table in `MOHRegister_Metadata`
     * (see `MIGRATED_METADATA_TABLES` in `../metadata-operations.ts`),
     * grouped by table name. Empty object when the database doesn't exist.
     */
    readMetadataTables(): Promise<Record<string, unknown[]>>;
    /** Drops the old Dexie tracker databases (never `MOHRegisterDB` — HMIS drafts live there). */
    dropAll(): Promise<void>;
}

const MIGRATION_STATUS_TABLE = "migration_status";
const MIGRATION_STATUS_ID = "dexie-migration";

type MigrationStatusRow = { id: string; completedAt: string };

/**
 * The completion flag only counts if Dexie hasn't been the live store
 * since. Otherwise data written to Dexie after the last copy would never
 * reach SQLite — e.g. a device on "auto" whose SQLite failed to open for a
 * while, fell back to Dexie, then recovered: SQLite never opened during the
 * Dexie period, so nothing on the Dexie branch could clear this flag.
 */
async function isMigrationCurrent(
    db: SqlDriver,
    source: DexieMigrationSource,
): Promise<boolean> {
    const existing = await getConfigRow<MigrationStatusRow>(
        db,
        MIGRATION_STATUS_TABLE,
        MIGRATION_STATUS_ID,
    );
    if (!existing) return false;
    const dexieLastLiveAt = await source.readDexieLastLiveAt();
    return !dexieLastLiveAt || dexieLastLiveAt <= existing.completedAt;
}

/**
 * Clears this migration's completion flag, so the NEXT boot on SQLite
 * copies Dexie's data again. Called whenever Dexie becomes the live store
 * (see `migrate-from-sqlite.ts`): from then on new data lands in Dexie,
 * and a stale flag here would make a later switch back to SQLite skip
 * copying it.
 */
export async function clearDexieMigrationFlag(db: SqlDriver): Promise<void> {
    await db.execute(`DELETE FROM ${MIGRATION_STATUS_TABLE} WHERE id = ?`, [
        MIGRATION_STATUS_ID,
    ]);
}

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

async function forEachIdChunk(
    ids: string[],
    fn: (idsChunk: string[], placeholders: string) => Promise<void>,
): Promise<void> {
    for (const idsChunk of chunk(ids, ID_CHUNK_SIZE)) {
        if (idsChunk.length === 0) continue;
        await fn(idsChunk, idsChunk.map(() => "?").join(", "));
    }
}

async function countMatchingIds(
    db: SqlDriver,
    table: string,
    idColumn: string,
    ids: string[],
): Promise<number> {
    let total = 0;
    await forEachIdChunk(ids, async (idsChunk, placeholders) => {
        const result = await db.execute<{ count: number }>(
            `SELECT COUNT(*) as count FROM ${table} WHERE ${idColumn} IN (${placeholders})`,
            idsChunk,
        );
        total += result.rows[0]?.count ?? 0;
    });
    return total;
}

type WrittenKeys = {
    trackedEntities: string[];
    enrollments: string[];
    events: string[];
};

/**
 * Reads one table's rows, publishes before/after progress, writes them
 * (skipped entirely for an empty table — nothing to insert), and returns
 * the ids actually written, for `WrittenKeys`/verification/cleanup. All
 * three tables in `runDexieMigrationIfNeeded` follow exactly this shape;
 * this is the one place that shape is spelled out.
 */
async function copyTable<T>(descriptor: {
    label: string;
    read: () => Promise<T[]>;
    write: (rows: T[]) => Promise<void>;
    idOf: (row: T) => string;
}): Promise<string[]> {
    const rows = await descriptor.read();
    publishMigrationProgress({
        phase: "copying",
        table: descriptor.label,
        copied: 0,
        total: rows.length,
    });
    if (rows.length > 0) {
        await descriptor.write(rows);
    }
    publishMigrationProgress({
        phase: "copying",
        table: descriptor.label,
        copied: rows.length,
        total: rows.length,
    });
    return rows.map(descriptor.idOf);
}

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
}

/**
 * HMIS drafts are deliberately NOT copied: `src/db/hmis-drafts.ts` reads
 * and writes them in Dexie's `MOHRegisterDB` on both backends, so they
 * never need to move, and that database is never dropped here.
 */
export async function runDexieMigrationIfNeeded(
    db: SqlDriver,
    source: DexieMigrationSource,
): Promise<void> {
    if (await isMigrationCurrent(db, source)) {
        publishMigrationProgress({ phase: "done" });
        return;
    }

    publishMigrationProgress({ phase: "checking" });
    // Metadata counts too (a metadata sync ran on Dexie), mirroring the
    // reverse direction's hasAnySqliteDataToMigrate — otherwise a Dexie
    // store holding metadata but no tracker database would take the
    // fresh-install shortcut and never copy it.
    const hasDexieData =
        (await source.existsAnyDexieData()) ||
        (await source.readMetadataVersion()) !== undefined;
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
    };

    try {
        written.trackedEntities = await copyTable({
            label: "trackedEntities",
            read: () => source.readTrackedEntities(),
            write: (rows) =>
                getTrackedEntitiesCollection().utils.bulkInsertLocally(rows, {
                    source: "local",
                }),
            idOf: (r) => r.trackedEntity,
        });

        written.enrollments = await copyTable({
            label: "enrollments",
            read: () => source.readEnrollments(),
            write: (rows) =>
                getEnrollmentsCollection().utils.bulkInsertLocally(rows, {
                    source: "local",
                }),
            idOf: (r) => r.enrollment,
        });

        written.events = await copyTable({
            label: "events",
            read: () => source.readEvents(),
            write: (rows) =>
                getEventsCollection().utils.bulkInsertLocally(rows, {
                    source: "local",
                }),
            idOf: (r) => r.event,
        });

        // Single-row config, not tracker data: no verification-count step
        // needed (one row per table), and nothing to roll back on failure
        // elsewhere in this function's catch block — a missing/stale
        // sync-state row just means the app re-derives it from the next
        // sync cycle, same as a fresh install.
        const [syncState, metadataVersion] = await Promise.all([
            source.readSyncState(),
            source.readMetadataVersion(),
        ]);
        if (syncState) {
            await putConfigRow(db, "sync_state", syncState);
        }
        if (metadataVersion) {
            await putConfigRow(db, "metadata_versions", metadataVersion);
        }

        await replaceMetadataTables(
            sqliteMetadataStore(db),
            await source.readMetadataTables(),
        );

        publishMigrationProgress({ phase: "verifying" });
        const [teCount, enrCount, evtCount] = await Promise.all([
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
        ]);
        if (
            teCount !== written.trackedEntities.length ||
            enrCount !== written.enrollments.length ||
            evtCount !== written.events.length
        ) {
            throw new Error(
                `Migration verification failed: expected ${written.trackedEntities.length}/${written.enrollments.length}/${written.events.length} tracked entities/enrollments/events, found ${teCount}/${enrCount}/${evtCount}`,
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
