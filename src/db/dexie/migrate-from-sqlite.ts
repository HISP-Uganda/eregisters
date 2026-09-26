import type { SyncState } from "../index";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    MetadataVersion,
} from "../../schemas";
import {
    distinctMetadataKeys,
    MIGRATED_METADATA_TABLES,
} from "../metadata-operations";
import { sqliteMetadataStore } from "../sqlite/metadata-store";
import type { HmisDraft } from "../hmis-drafts";
import { dropAllSqliteData } from "../sqlite/drop-all-data";
import { createSchema } from "../sqlite/schema";
import type { SqlDriver } from "../sqlite/driver-types";
import { getConfigRow } from "../sqlite/config-rows";
import { clearDexieMigrationFlag } from "../sqlite/migrate-from-dexie";
import { getAllRows } from "../sqlite/metadata-info";
import {
    assertCheckpoint,
    assertNestedRows,
    copyTable,
    countNestedKeys,
    metadataShortfalls,
    type CopiedCheckpoint,
    type StoreCopySteps,
} from "../store-copy";
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
    /**
     * Whether SQLite is known to hold nothing since the last completed
     * reverse copy — a cache that spares Dexie boots a Worker start just
     * to re-check. Reset by `markMigrationComplete`.
     */
    isSqliteCleaned(): Promise<boolean>;
    markSqliteCleaned(): Promise<void>;
    /** When Dexie was last booted as the live store (`markDexieLive`). */
    readDexieLastLiveAt(): Promise<string | undefined>;
    hasTrackerData(): Promise<boolean>;
    /** Deletes every tracked entity/enrollment/event row in Dexie. */
    clearTrackerData(): Promise<void>;
    /** Read-back for `verify` — what the copy actually left in Dexie. */
    readSyncState(): Promise<SyncState | undefined>;
    readMetadataVersion(): Promise<MetadataVersion | undefined>;
    countMetadataRows(table: string): Promise<number>;
    /** Forces the next metadata sync to be a full pull. */
    clearMetadataVersion(): Promise<void>;
    /** Total keys of the nested `attributes` / `dataValues` field across these rows. */
    countNestedKeys(
        table: "trackedEntities" | "enrollments" | "events",
        ids: string[],
    ): Promise<number>;
    writeTrackedEntities(rows: FlattenedTrackedEntity[]): Promise<void>;
    writeEnrollments(rows: FlattenedEnrollment[]): Promise<void>;
    writeEvents(rows: FlattenedEvent[]): Promise<void>;
    writeHmisDrafts(rows: HmisDraft[]): Promise<void>;
    writeSyncState(row: SyncState | undefined): Promise<void>;
    /** `metadata_versions`/`metadata-version` — carries `lastSync` (lastMetadataPull). */
    writeMetadataVersion(row: MetadataVersion | undefined): Promise<void>;
    /** Replaces Dexie's copy of every `MIGRATED_METADATA_TABLES` table. */
    replaceMetadataTables(tables: Record<string, unknown[]>): Promise<void>;
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
export async function hasAnySqliteData(db: SqlDriver): Promise<boolean> {
    const [tes, enrollments, events, hmisDrafts, metadataVersion] =
        await Promise.all([
            trackedEntitiesRowAdapter.loadAll(db),
            enrollmentsRowAdapter.loadAll(db),
            eventsRowAdapter.loadAll(db),
            getAllRows(db, "hmis_drafts"),
            getConfigRow(db, "metadata_versions", METADATA_VERSION_ID),
        ]);
    // A metadata sync on SQLite counts too: a device that pulled metadata
    // but has no tracker data yet must still carry that metadata (and its
    // lastMetadataPull) across, instead of taking the fresh-install
    // shortcut.
    return (
        tes.length > 0 ||
        enrollments.length > 0 ||
        events.length > 0 ||
        hmisDrafts.length > 0 ||
        metadataVersion !== undefined
    );
}

const METADATA_VERSION_ID = "metadata-version";

async function readSqliteMetadataTables(
    db: SqlDriver,
): Promise<Record<string, unknown[]>> {
    const store = sqliteMetadataStore(db);
    const tables: Record<string, unknown[]> = {};
    for (const table of MIGRATED_METADATA_TABLES) {
        tables[table] = await store.listRows(table);
    }
    return tables;
}

type WrittenKeys = {
    trackedEntities: string[];
    enrollments: string[];
    events: string[];
    hmisDrafts: string[];
};

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

/**
 * The reverse (SQLite -> Dexie) store copy as steps — see `../store-copy.ts`.
 */
export function reverseCopySteps(
    db: SqlDriver,
    target: DexieMigrationTarget,
): StoreCopySteps {
    // What `verify` must find, gathered as the copy reads its source.
    const expectedNested = { teAttributes: 0, enrAttributes: 0, dataValues: 0 };
    let copiedCheckpoint: CopiedCheckpoint = {};
    let expectedMetadata: Record<string, number> = {};

    return {
        tables: ["trackedEntities", "enrollments", "events", "hmisDrafts"],

        async detect() {
            if (await target.hasCompletedMigration()) {
                // Complete means SQLite hasn't been live since (every
                // SQLite boot clears the flag), so any SQLite data left is
                // a failed cleanup's leftovers.
                if (await hasAnySqliteData(db)) return "cleanup-owed";
                await target.markSqliteCleaned();
                return "current";
            }
            // Device was set/detected to Dexie with no prior SQL data ever
            // written (e.g. a fresh install) — nothing to copy.
            return (await hasAnySqliteData(db)) ? "needs-copy" : "fresh";
        },

        async prepareTarget() {
            const forward = await getConfigRow<{ completedAt: string }>(
                db,
                "migration_status",
                "dexie-migration",
            );
            if (!forward) return;
            const dexieLiveAt = await target.readDexieLastLiveAt();
            // Dexie live since the forward copy: its data is real, not leftovers.
            if (dexieLiveAt && dexieLiveAt > forward.completedAt) return;
            if (!(await target.hasTrackerData())) return;
            await target.clearTrackerData();
        },

        async copyTracker(report, onWritten) {
            onWritten(
                "trackedEntities",
                await copyTable(report, {
                    label: "trackedEntities",
                    read: async () => {
                        const rows = await trackedEntitiesRowAdapter.loadAll(db);
                        expectedNested.teAttributes = countNestedKeys(rows, "attributes");
                        return rows;
                    },
                    write: (rows) => target.writeTrackedEntities(rows),
                    idOf: (r) => r.trackedEntity,
                }),
            );
            onWritten(
                "enrollments",
                await copyTable(report, {
                    label: "enrollments",
                    read: async () => {
                        const rows = await enrollmentsRowAdapter.loadAll(db);
                        expectedNested.enrAttributes = countNestedKeys(rows, "attributes");
                        return rows;
                    },
                    write: (rows) => target.writeEnrollments(rows),
                    idOf: (r) => r.enrollment,
                }),
            );
            onWritten(
                "events",
                await copyTable(report, {
                    label: "events",
                    read: async () => {
                        const rows = await eventsRowAdapter.loadAll(db);
                        expectedNested.dataValues = countNestedKeys(rows, "dataValues");
                        return rows;
                    },
                    write: (rows) => target.writeEvents(rows),
                    idOf: (r) => r.event,
                }),
            );
            onWritten(
                "hmisDrafts",
                await copyTable(report, {
                    label: "hmisDrafts",
                    read: () => getAllRows<HmisDraft>(db, "hmis_drafts"),
                    write: (rows) => target.writeHmisDrafts(rows),
                    idOf: (r) => r.id,
                }),
            );
        },

        async copyConfig() {
            // Single config row, not an id-keyed table — travels through
            // MetadataStore like any other metadata row (ticket 003
            // decision 2), no separate copy-progress/verification entry.
            const syncState = await getConfigRow<SyncState>(
                db,
                "sync_state",
                "current",
            );
            await target.writeSyncState(syncState);
            // lastMetadataPull and the metadata itself — without these
            // Dexie kept whatever it had from before (empty, or stale rows
            // paired with a stale lastMetadataPull) next to SQLite's newer
            // lastDataPull.
            const metadataVersion = await getConfigRow<MetadataVersion>(
                db,
                "metadata_versions",
                METADATA_VERSION_ID,
            );
            await target.writeMetadataVersion(metadataVersion);
            copiedCheckpoint = {
                lastPullAt: syncState?.lastPullAt,
                lastPushAt: syncState?.lastPushAt,
                lastMetadataSync: metadataVersion?.lastSync,
            };
            return copiedCheckpoint;
        },

        async copyMetadata() {
            const tables = await readSqliteMetadataTables(db);
            expectedMetadata = distinctMetadataKeys(tables);
            await target.replaceMetadataTables(tables);
        },

        async verify(written) {
            const expected = toWrittenKeys(written);
            const [teCount, enrCount, evtCount, draftCount] =
                await Promise.all([
                    target.countTrackedEntities(expected.trackedEntities),
                    target.countEnrollments(expected.enrollments),
                    target.countEvents(expected.events),
                    target.countHmisDrafts(expected.hmisDrafts),
                ]);
            if (
                teCount !== expected.trackedEntities.length ||
                enrCount !== expected.enrollments.length ||
                evtCount !== expected.events.length ||
                draftCount !== expected.hmisDrafts.length
            ) {
                throw new Error(
                    `Migration verification failed: expected ${expected.trackedEntities.length}/${expected.enrollments.length}/${expected.events.length}/${expected.hmisDrafts.length} tracked entities/enrollments/events/hmisDrafts, found ${teCount}/${enrCount}/${evtCount}/${draftCount}`,
                );
            }

            const [teAttrs, enrAttrs, dataValues] = await Promise.all([
                target.countNestedKeys("trackedEntities", expected.trackedEntities),
                target.countNestedKeys("enrollments", expected.enrollments),
                target.countNestedKeys("events", expected.events),
            ]);
            assertNestedRows("tracked entity attributes", expectedNested.teAttributes, teAttrs);
            assertNestedRows("enrollment attributes", expectedNested.enrAttributes, enrAttrs);
            assertNestedRows("event data values", expectedNested.dataValues, dataValues);

            const [syncState, metadataVersion] = await Promise.all([
                target.readSyncState(),
                target.readMetadataVersion(),
            ]);
            assertCheckpoint(copiedCheckpoint, {
                lastPullAt: syncState?.lastPullAt,
                lastPushAt: syncState?.lastPushAt,
                lastMetadataSync: metadataVersion?.lastSync,
            });

            const found: Record<string, number> = {};
            for (const table of Object.keys(expectedMetadata)) {
                found[table] = await target.countMetadataRows(table);
            }
            const short = metadataShortfalls(expectedMetadata, found);
            if (short.length === 0) return { metadataRepull: false };
            console.warn("Store copy: metadata short in", short, "— clearing lastMetadataSync for a full metadata pull");
            await target.clearMetadataVersion();
            return { metadataRepull: true };
        },

        async markComplete() {
            // Dexie is now the live store, so SQLite's own Dexie->SQLite
            // flag must go too — otherwise a later switch back to SQLite
            // would skip copying whatever gets written to Dexie from here
            // on. (After a real copy, cleanup's dropAllSqliteData drops
            // the flag's whole table anyway; this matters for "fresh".)
            await clearDexieMigrationFlag(db);
            await target.markMigrationComplete();
        },

        // Destructive on success (ticket 003 decision 6) — a future switch
        // back to SQLite always re-copies fresh from whichever backend
        // (Dexie, by then) is live, so retaining this data would only cost
        // storage, never save real work.
        // Schema recreated empty so this driver stays usable, and the
        // next detect reads "no SQLite data" instead of missing tables.
        async cleanup() {
            await dropAllSqliteData(db);
            await createSchema(db);
            await target.markSqliteCleaned();
        },

        rollback: (written) =>
            cleanUpPartialWrite(target, toWrittenKeys(written)),
    };
}

function toWrittenKeys(written: Record<string, string[]>): WrittenKeys {
    return {
        trackedEntities: written.trackedEntities ?? [],
        enrollments: written.enrollments ?? [],
        events: written.events ?? [],
        hmisDrafts: written.hmisDrafts ?? [],
    };
}
