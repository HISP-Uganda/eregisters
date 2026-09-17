import type { SyncState } from "../index";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import type { HmisDraft } from "../hmis-drafts";
import { dropAllSqliteData } from "../sqlite/drop-all-data";
import type { SqlDriver } from "../sqlite/driver-types";
import { getConfigRow } from "../sqlite/config-rows";
import { getAllRows } from "../sqlite/metadata-info";
import {
    publishMigrationProgress,
    type MigrationProgress,
} from "../sqlite/migration-progress";
import { enrollmentsRowAdapter } from "../sqlite/row-adapters/enrollments";
import { eventsRowAdapter } from "../sqlite/row-adapters/events";
import { trackedEntitiesRowAdapter } from "../sqlite/row-adapters/tracked-entities";

/**
 * One-time copy of a device's EXISTING local SQLite data into Dexie, when
 * that device switches from the SQLite/OPFS backend to Dexie — the mirror
 * image of `../sqlite/migrate-from-dexie.ts`, per wayfinder ticket
 * "Reverse migration design: SQLite -> Dexie"
 * (`docs/wayfinder/opfs-dexie-dual-backend/tickets/003-reverse-migration-design.md`).
 * Read that ticket's "## Answer" for the full design reasoning; this file
 * implements it close to verbatim.
 *
 * `DexieMigrationTarget` abstracts the actual Dexie writes/verification
 * (real implementation: `real-dexie-migration-target.ts`, browser-only,
 * untestable under `node:sqlite` — no `fake-indexeddb` dependency in this
 * repo) so this orchestration logic is unit-testable against a fake, same
 * split as the forward direction's `DexieMigrationSource`. The SQLite
 * *read* side doesn't need the same treatment — real SQL reads work fine
 * under `node:sqlite`, so this function takes a real `SqlDriver` directly,
 * exactly like the forward direction takes one for its (SQLite) target.
 */
export interface DexieMigrationTarget {
    hasCompletedMigration(): Promise<boolean>;
    markMigrationComplete(): Promise<void>;
    writeTrackedEntities(rows: FlattenedTrackedEntity[]): Promise<void>;
    writeEnrollments(rows: FlattenedEnrollment[]): Promise<void>;
    writeEvents(rows: FlattenedEvent[]): Promise<void>;
    writeHmisDrafts(rows: HmisDraft[]): Promise<void>;
    writeSyncState(row: SyncState | undefined): Promise<void>;
    countTrackedEntities(ids: string[]): Promise<number>;
    countEnrollments(ids: string[]): Promise<number>;
    countEvents(ids: string[]): Promise<number>;
    countHmisDrafts(ids: string[]): Promise<number>;
    deleteTrackedEntities(ids: string[]): Promise<void>;
    deleteEnrollments(ids: string[]): Promise<void>;
    deleteEvents(ids: string[]): Promise<void>;
    deleteHmisDrafts(ids: string[]): Promise<void>;
}

/**
 * Mirrors migrate-from-dexie.ts's `existsAnyDexieData()` — but that one
 * checks `Dexie.exists()` per *database*, which covers its hmisDrafts
 * store "for free". This side has no equivalent single check (SQLite is
 * one database, not five), so hmis_drafts needs its own explicit check:
 * a device that filled an HMIS aggregate form but never touched tracker
 * data would otherwise take the fresh-install shortcut below and silently
 * never copy (or drop) its hmis_drafts rows — a real data-loss bug this
 * fixes.
 */
async function hasAnySqliteDataToMigrate(db: SqlDriver): Promise<boolean> {
    const [tes, enrollments, events, hmisDrafts] = await Promise.all([
        trackedEntitiesRowAdapter.loadAll(db),
        enrollmentsRowAdapter.loadAll(db),
        eventsRowAdapter.loadAll(db),
        getAllRows(db, "hmis_drafts"),
    ]);
    return (
        tes.length > 0 ||
        enrollments.length > 0 ||
        events.length > 0 ||
        hmisDrafts.length > 0
    );
}

type WrittenKeys = {
    trackedEntities: string[];
    enrollments: string[];
    events: string[];
    hmisDrafts: string[];
};

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
    target: DexieMigrationTarget,
    written: WrittenKeys,
): Promise<void> {
    // Trivial per-id deletes — no cascade needed, unlike the forward
    // direction's cleanup: Dexie's flat rows have no child tables to
    // cascade through (ticket 003's decision 5, enabled by ticket 001's
    // decision to keep Dexie's rows flattened rather than normalized).
    await target.deleteTrackedEntities(written.trackedEntities);
    await target.deleteEnrollments(written.enrollments);
    await target.deleteEvents(written.events);
    await target.deleteHmisDrafts(written.hmisDrafts);
}

export async function runSqliteMigrationIfNeeded(
    db: SqlDriver,
    target: DexieMigrationTarget,
): Promise<void> {
    if (await target.hasCompletedMigration()) {
        publishMigrationProgress({ phase: "done" });
        return;
    }

    publishMigrationProgress({ phase: "checking" });
    const hasSqliteData = await hasAnySqliteDataToMigrate(db);
    if (!hasSqliteData) {
        // Device was set/detected to Dexie with no prior SQL data ever
        // written (e.g. a fresh install) — nothing to copy, don't scan
        // for it again next boot. Mirrors existsAnyDexieData()'s
        // fresh-install shortcut in the forward direction.
        await target.markMigrationComplete();
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
        written.trackedEntities = await copyTable({
            label: "trackedEntities",
            read: () => trackedEntitiesRowAdapter.loadAll(db),
            write: (rows) => target.writeTrackedEntities(rows),
            idOf: (r) => r.trackedEntity,
        });

        written.enrollments = await copyTable({
            label: "enrollments",
            read: () => enrollmentsRowAdapter.loadAll(db),
            write: (rows) => target.writeEnrollments(rows),
            idOf: (r) => r.enrollment,
        });

        written.events = await copyTable({
            label: "events",
            read: () => eventsRowAdapter.loadAll(db),
            write: (rows) => target.writeEvents(rows),
            idOf: (r) => r.event,
        });

        written.hmisDrafts = await copyTable({
            label: "hmisDrafts",
            read: () => getAllRows<HmisDraft>(db, "hmis_drafts"),
            write: (rows) => target.writeHmisDrafts(rows),
            idOf: (r) => r.id,
        });

        // Single config row, not an id-keyed table — travels through
        // MetadataStore like any other metadata row (ticket 003 decision
        // 2), no separate copy-progress/verification entry needed.
        const syncState = await getConfigRow<SyncState>(db, "sync_state", "current");
        await target.writeSyncState(syncState);

        publishMigrationProgress({ phase: "verifying" });
        const [teCount, enrCount, evtCount, draftCount] = await Promise.all([
            target.countTrackedEntities(written.trackedEntities),
            target.countEnrollments(written.enrollments),
            target.countEvents(written.events),
            target.countHmisDrafts(written.hmisDrafts),
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

        await target.markMigrationComplete();
        // Destructive on success (ticket 003 decision 6) — a future
        // switch back to SQLite always re-copies fresh from whichever
        // backend (Dexie, by then) is live, so retaining this data would
        // only cost storage, never save real work.
        await dropAllSqliteData(db);
        publishMigrationProgress({ phase: "done" });
    } catch (error) {
        // Restart from scratch on next boot, same as the forward
        // direction — no partial-resume logic. The completion flag is
        // never written on this path, so hasAnySqliteDataToMigrate() (SQL
        // data untouched — cleanup below only touched the Dexie side)
        // drives a full retry next time this runs.
        await cleanUpPartialWrite(target, written);
        const progress: MigrationProgress = {
            phase: "failed",
            error: error instanceof Error ? error.message : String(error),
        };
        publishMigrationProgress(progress);
    }
}
