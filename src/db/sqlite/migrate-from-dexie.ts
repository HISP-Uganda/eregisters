import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    MetadataVersion,
} from "../../schemas";
import type { SyncState } from "../index";
import {
    distinctMetadataKeys,
    replaceMetadataTables,
} from "../metadata-operations";
import { getConfigRow, putConfigRow } from "./config-rows";
import {
    deleteEnrollmentCascade,
    deleteEventCascade,
    deleteTrackedEntityCascade,
} from "./delete-cascade";
import type { SqlDriver } from "./driver-types";
import type { RowAdapter } from "./row-adapter";
import { enrollmentsRowAdapter } from "./row-adapters/enrollments";
import { eventsRowAdapter } from "./row-adapters/events";
import { trackedEntitiesRowAdapter } from "./row-adapters/tracked-entities";
import { sqliteMetadataStore } from "./metadata-store";
import { hasAnySqliteData } from "../dexie/migrate-from-sqlite";
import { dropAllSqliteData } from "./drop-all-data";
import { createSchema } from "./schema";
import {
    assertCheckpoint,
    assertNestedRows,
    copyTable,
    countNestedKeys,
    metadataShortfalls,
    type CopiedCheckpoint,
    type StoreCopySteps,
} from "../store-copy";
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
    /**
     * When the reverse (SQLite -> Dexie) copy completed, or undefined if it
     * hasn't / its flag was cleared. Every SQLite boot clears that flag, so
     * a value here means SQLite hasn't been live since that copy.
     */
    readReverseCopyCompletedAt(): Promise<string | undefined>;
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

async function existingIds(
    db: SqlDriver,
    table: string,
    idColumn: string,
    ids: string[],
): Promise<Set<string>> {
    const found = new Set<string>();
    await forEachIdChunk(ids, async (idsChunk, placeholders) => {
        const result = await db.execute<{ id: string }>(
            `SELECT ${idColumn} as id FROM ${table} WHERE ${idColumn} IN (${placeholders})`,
            idsChunk,
        );
        for (const row of result.rows) found.add(row.id);
    });
    return found;
}

/**
 * Upsert against the DATABASE, not the collection: `bulkInsertLocally`
 * picks insert vs update from the collection's in-memory snapshot, which
 * is empty at boot (nothing has subscribed yet). A copy interrupted after
 * committing a table (tab closed mid-copy — no rollback runs, no
 * copy-complete flag) then failed every later boot on a duplicate key.
 * One transaction per table, as before; the collection is refreshed
 * afterwards in case something is subscribed.
 */
async function upsertRows<T extends object>(
    db: SqlDriver,
    adapter: RowAdapter<T, string>,
    target: { table: string; idColumn: string },
    rows: T[],
    idOf: (row: T) => string,
    refresh: () => Promise<void>,
): Promise<void> {
    const existing = await existingIds(
        db,
        target.table,
        target.idColumn,
        rows.map(idOf),
    );
    await db.transaction(async (tx) => {
        for (const row of rows) {
            if (existing.has(idOf(row))) {
                await adapter.updateRow(tx, row, { source: "local" });
            } else {
                await adapter.insertRow(tx, row, { source: "local" });
            }
        }
    });
    await refresh();
}

type WrittenKeys = {
    trackedEntities: string[];
    enrollments: string[];
    events: string[];
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
}

/**
 * The forward (Dexie -> SQLite) store copy as steps — see `../store-copy.ts`.
 *
 * HMIS drafts are deliberately NOT copied: `src/db/hmis-drafts.ts` reads
 * and writes them in Dexie's `MOHRegisterDB` on both backends, so they
 * never need to move, and that database is never dropped here.
 */
export function forwardCopySteps(
    db: SqlDriver,
    source: DexieMigrationSource,
): StoreCopySteps {
    // What `verify` must find, gathered as the copy reads its source.
    const expectedNested = { teAttributes: 0, enrAttributes: 0, dataValues: 0 };
    let copiedCheckpoint: CopiedCheckpoint = {};
    let expectedMetadata: Record<string, number> = {};

    return {
        tables: ["trackedEntities", "enrollments", "events"],

        async detect() {
            if (await isMigrationCurrent(db, source)) {
                // Current means Dexie hasn't been live since the copy, and
                // nothing else creates its tracker databases — so any that
                // exist are a failed cleanup's leftovers.
                return (await source.existsAnyDexieData())
                    ? "cleanup-owed"
                    : "current";
            }
            // Metadata counts too (a metadata sync ran on Dexie), mirroring
            // the reverse direction's hasAnySqliteDataToMigrate — otherwise
            // a Dexie store holding metadata but no tracker database would
            // take the fresh-install shortcut and never copy it.
            const hasDexieData =
                (await source.existsAnyDexieData()) ||
                (await source.readMetadataVersion()) !== undefined;
            return hasDexieData ? "needs-copy" : "fresh";
        },

        async prepareTarget() {
            if ((await source.readReverseCopyCompletedAt()) === undefined) {
                return;
            }
            if (!(await hasAnySqliteData(db))) return;
            await dropAllSqliteData(db);
            await createSchema(db);
        },

        async copyTracker(report, onWritten) {
            onWritten(
                "trackedEntities",
                await copyTable(report, {
                    label: "trackedEntities",
                    read: async () => {
                        const rows = await source.readTrackedEntities();
                        expectedNested.teAttributes = countNestedKeys(rows, "attributes");
                        return rows;
                    },
                    write: (rows) =>
                        upsertRows(
                            db,
                            trackedEntitiesRowAdapter,
                            { table: "tracked_entities", idColumn: "tracked_entity" },
                            rows,
                            (r) => r.trackedEntity,
                            () => getTrackedEntitiesCollection().utils.refresh(),
                        ),
                    idOf: (r) => r.trackedEntity,
                }),
            );
            onWritten(
                "enrollments",
                await copyTable(report, {
                    label: "enrollments",
                    read: async () => {
                        const rows = await source.readEnrollments();
                        expectedNested.enrAttributes = countNestedKeys(rows, "attributes");
                        return rows;
                    },
                    write: (rows) =>
                        upsertRows(
                            db,
                            enrollmentsRowAdapter,
                            { table: "enrollments", idColumn: "enrollment" },
                            rows,
                            (r) => r.enrollment,
                            () => getEnrollmentsCollection().utils.refresh(),
                        ),
                    idOf: (r) => r.enrollment,
                    required: ["trackedEntity"],
                }),
            );
            onWritten(
                "events",
                await copyTable(report, {
                    label: "events",
                    read: async () => {
                        const rows = await source.readEvents();
                        expectedNested.dataValues = countNestedKeys(rows, "dataValues");
                        return rows;
                    },
                    write: (rows) =>
                        upsertRows(
                            db,
                            eventsRowAdapter,
                            { table: "events", idColumn: "event" },
                            rows,
                            (r) => r.event,
                            () => getEventsCollection().utils.refresh(),
                        ),
                    idOf: (r) => r.event,
                    required: ["enrollment", "trackedEntity"],
                }),
            );
        },

        async copyConfig() {
            // Single-row config, not tracker data: no verification-count
            // step needed (one row per table) and nothing to roll back — a
            // missing/stale sync-state row just means the app re-derives it
            // from the next sync cycle, same as a fresh install.
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
            copiedCheckpoint = {
                lastPullAt: syncState?.lastPullAt,
                lastPushAt: syncState?.lastPushAt,
                lastMetadataSync: metadataVersion?.lastSync,
            };
            return copiedCheckpoint;
        },

        async copyMetadata() {
            const tables = await source.readMetadataTables();
            expectedMetadata = distinctMetadataKeys(tables);
            await replaceMetadataTables(sqliteMetadataStore(db), tables);
        },

        async verify(written) {
            const expected = toWrittenKeys(written);
            const [teCount, enrCount, evtCount] = await Promise.all([
                countMatchingIds(
                    db,
                    "tracked_entities",
                    "tracked_entity",
                    expected.trackedEntities,
                ),
                countMatchingIds(
                    db,
                    "enrollments",
                    "enrollment",
                    expected.enrollments,
                ),
                countMatchingIds(db, "events", "event", expected.events),
            ]);
            if (
                teCount !== expected.trackedEntities.length ||
                enrCount !== expected.enrollments.length ||
                evtCount !== expected.events.length
            ) {
                throw new Error(
                    `Migration verification failed: expected ${expected.trackedEntities.length}/${expected.enrollments.length}/${expected.events.length} tracked entities/enrollments/events, found ${teCount}/${enrCount}/${evtCount}`,
                );
            }

            // One child row per nested key (attributes / dataValues), so
            // the expected count is exact.
            const [teAttrs, enrAttrs, dataValues] = await Promise.all([
                countMatchingIds(db, "tracked_entity_attributes", "tracked_entity", expected.trackedEntities),
                countMatchingIds(db, "enrollment_attributes", "enrollment", expected.enrollments),
                countMatchingIds(db, "event_data_values", "event", expected.events),
            ]);
            assertNestedRows("tracked entity attributes", expectedNested.teAttributes, teAttrs);
            assertNestedRows("enrollment attributes", expectedNested.enrAttributes, enrAttrs);
            assertNestedRows("event data values", expectedNested.dataValues, dataValues);

            const [syncState, metadataVersion] = await Promise.all([
                getConfigRow<SyncState>(db, "sync_state", "current"),
                getConfigRow<MetadataVersion>(db, "metadata_versions", "metadata-version"),
            ]);
            assertCheckpoint(copiedCheckpoint, {
                lastPullAt: syncState?.lastPullAt,
                lastPushAt: syncState?.lastPushAt,
                lastMetadataSync: metadataVersion?.lastSync,
            });

            const store = sqliteMetadataStore(db);
            const found: Record<string, number> = {};
            for (const table of Object.keys(expectedMetadata)) {
                found[table] = (await store.listRows(table)).length;
            }
            const short = metadataShortfalls(expectedMetadata, found);
            if (short.length === 0) return { metadataRepull: false };
            console.warn("Store copy: metadata short in", short, "— clearing lastMetadataSync for a full metadata pull");
            await store.deleteRow("metadata_versions", "metadata-version");
            return { metadataRepull: true };
        },

        markComplete: () => markComplete(db),

        cleanup: () => source.dropAll(),

        rollback: (written) => cleanUpPartialWrite(db, toWrittenKeys(written)),
    };
}

function toWrittenKeys(written: Record<string, string[]>): WrittenKeys {
    return {
        trackedEntities: written.trackedEntities ?? [],
        enrollments: written.enrollments ?? [],
        events: written.events ?? [],
    };
}
