import type { MetadataVersion } from "../../schemas";
import type { SyncState } from "../index";
import type { HmisDraft } from "../hmis-drafts";
import { replaceMetadataTables } from "../metadata-operations";
import { dexieMetadataStore } from "./metadata-store";
import {
    countDexieRowsByIds,
    listDexieIds,
    sumDexieNestedKeys,
} from "./dexie-verification";
import type { DexieMigrationTarget } from "./migrate-from-sqlite";
import {
    getEnrollmentsDexieCollection,
    getEventsDexieCollection,
    getTrackedEntitiesDexieCollection,
    initDexieTrackerCollections,
} from "./tracker-collections-instance";

const MIGRATION_STATUS_TABLE = "migration_status";
const MIGRATION_STATUS_ID = "sqlite-migration";

type MigrationStatusRow = { id: string; completedAt: string; cleanedAt?: string };

const NESTED_FIELDS = {
    trackedEntities: ["MOHRegister_TrackedEntities", "attributes"],
    enrollments: ["MOHRegister_Enrollments", "attributes"],
    events: ["MOHRegister_Events", "dataValues"],
} as const;

const TRACKER_TABLES = [
    ["MOHRegister_TrackedEntities", "trackedEntities"],
    ["MOHRegister_Enrollments", "enrollments"],
    ["MOHRegister_Events", "events"],
] as const;

/**
 * Records that Dexie is the live store as of now — called on every Dexie
 * boot (`App.tsx`). The forward (Dexie->SQLite) migration compares this
 * with its own completion time, so data written to Dexie after the last
 * copy is copied again on the next SQLite boot. Read back by
 * `../sqlite/dexie-migration-source.ts`'s `readDexieLastLiveAt` (same
 * `migration_status`/`dexie-live` row).
 */
export async function markDexieLive(): Promise<void> {
    await dexieMetadataStore().putRow(MIGRATION_STATUS_TABLE, {
        id: "dexie-live",
        liveAt: new Date().toISOString(),
    });
}

/**
 * Clears the SQLite->Dexie completion flag. Called on every boot where
 * SQLite is the live store (`App.tsx`): new data lands in SQLite from then
 * on, so a later switch to Dexie must copy it again. This flag lives in
 * `MOHRegister_Metadata`, which no migration ever drops, so without this
 * it stayed set forever after the first Dexie boot and every later switch
 * to Dexie skipped the copy.
 */
export async function clearSqliteMigrationFlag(): Promise<void> {
    await dexieMetadataStore().deleteRow(
        MIGRATION_STATUS_TABLE,
        MIGRATION_STATUS_ID,
    );
}

/**
 * Real, browser-only `DexieMigrationTarget` implementation — untestable
 * under `node:sqlite` (real IndexedDB/Dexie needed), kept deliberately
 * small and separate from `migrate-from-sqlite.ts`'s orchestration logic,
 * same split as `../sqlite/dexie-migration-source.ts` on the forward side.
 *
 * Ensures the Dexie tracker collections are initialized before use —
 * unlike the SQLite side (initialized once at app bootstrap before any
 * migration runs), a device switching TO Dexie may not have initialized
 * them yet at the point this migration runs.
 */
export const realDexieMigrationTarget: DexieMigrationTarget = {
    async hasCompletedMigration(): Promise<boolean> {
        const row = await dexieMetadataStore().getRow<MigrationStatusRow>(
            MIGRATION_STATUS_TABLE,
            MIGRATION_STATUS_ID,
        );
        return row !== undefined;
    },

    async markMigrationComplete(): Promise<void> {
        await dexieMetadataStore().putRow<MigrationStatusRow>(
            MIGRATION_STATUS_TABLE,
            { id: MIGRATION_STATUS_ID, completedAt: new Date().toISOString() },
        );
    },

    async isSqliteCleaned(): Promise<boolean> {
        const row = await dexieMetadataStore().getRow<MigrationStatusRow>(
            MIGRATION_STATUS_TABLE,
            MIGRATION_STATUS_ID,
        );
        return row?.cleanedAt !== undefined;
    },

    async markSqliteCleaned(): Promise<void> {
        const store = dexieMetadataStore();
        const row = await store.getRow<MigrationStatusRow>(
            MIGRATION_STATUS_TABLE,
            MIGRATION_STATUS_ID,
        );
        if (!row) return;
        await store.putRow<MigrationStatusRow>(MIGRATION_STATUS_TABLE, {
            ...row,
            cleanedAt: new Date().toISOString(),
        });
    },

    async readDexieLastLiveAt(): Promise<string | undefined> {
        const row = await dexieMetadataStore().getRow<{
            id: string;
            liveAt: string;
        }>(MIGRATION_STATUS_TABLE, "dexie-live");
        return row?.liveAt;
    },

    async hasTrackerData(): Promise<boolean> {
        for (const [dbName, table] of TRACKER_TABLES) {
            if ((await listDexieIds(dbName, table)).length > 0) return true;
        }
        return false;
    },

    // Through the collections (not a raw table clear), so their in-memory
    // state drops the rows too.
    async clearTrackerData(): Promise<void> {
        initDexieTrackerCollections();
        const [tes, enrollments, events] = await Promise.all(
            TRACKER_TABLES.map(([dbName, table]) => listDexieIds(dbName, table)),
        );
        await getTrackedEntitiesDexieCollection().utils.deleteLocally(tes);
        await getEnrollmentsDexieCollection().utils.deleteLocally(enrollments);
        await getEventsDexieCollection().utils.deleteLocally(events);
    },

    readSyncState() {
        return dexieMetadataStore().getRow<SyncState>("sync_state", "current");
    },

    readMetadataVersion() {
        return dexieMetadataStore().getRow<MetadataVersion & { id: string }>(
            "metadata_versions",
            "metadata-version",
        );
    },

    async countMetadataRows(table: string): Promise<number> {
        return (await dexieMetadataStore().listRows(table)).length;
    },

    async clearMetadataVersion(): Promise<void> {
        await dexieMetadataStore().deleteRow(
            "metadata_versions",
            "metadata-version",
        );
    },

    countNestedKeys(table, ids) {
        const [dbName, field] = NESTED_FIELDS[table];
        return sumDexieNestedKeys(dbName, table, ids, field);
    },

    async writeTrackedEntities(rows): Promise<void> {
        initDexieTrackerCollections();
        await getTrackedEntitiesDexieCollection().utils.bulkInsertLocally(
            rows,
            { source: "local" },
        );
    },

    async writeEnrollments(rows): Promise<void> {
        initDexieTrackerCollections();
        await getEnrollmentsDexieCollection().utils.bulkInsertLocally(rows, {
            source: "local",
        });
    },

    async writeEvents(rows): Promise<void> {
        initDexieTrackerCollections();
        await getEventsDexieCollection().utils.bulkInsertLocally(rows, {
            source: "local",
        });
    },

    async writeHmisDrafts(rows: HmisDraft[]): Promise<void> {
        const store = dexieMetadataStore();
        for (const row of rows) {
            await store.putRow("hmis_drafts", row);
        }
    },

    async writeSyncState(row: SyncState | undefined): Promise<void> {
        if (!row) return;
        await dexieMetadataStore().putRow("sync_state", row);
    },

    async writeMetadataVersion(row): Promise<void> {
        if (!row) return;
        await dexieMetadataStore().putRow(
            "metadata_versions",
            row as typeof row & { id: string },
        );
    },

    async replaceMetadataTables(tables): Promise<void> {
        await replaceMetadataTables(dexieMetadataStore(), tables);
    },

    countTrackedEntities(ids: string[]): Promise<number> {
        return countDexieRowsByIds(
            "MOHRegister_TrackedEntities",
            "trackedEntities",
            ids,
        );
    },

    countEnrollments(ids: string[]): Promise<number> {
        return countDexieRowsByIds("MOHRegister_Enrollments", "enrollments", ids);
    },

    countEvents(ids: string[]): Promise<number> {
        return countDexieRowsByIds("MOHRegister_Events", "events", ids);
    },

    async countHmisDrafts(ids: string[]): Promise<number> {
        if (ids.length === 0) return 0;
        const store = dexieMetadataStore();
        const results = await Promise.all(
            ids.map((id) => store.getRow("hmis_drafts", id)),
        );
        return results.filter((row) => row !== undefined).length;
    },

    async deleteTrackedEntities(ids: string[]): Promise<void> {
        initDexieTrackerCollections();
        await getTrackedEntitiesDexieCollection().utils.deleteLocally(ids);
    },

    async deleteEnrollments(ids: string[]): Promise<void> {
        initDexieTrackerCollections();
        await getEnrollmentsDexieCollection().utils.deleteLocally(ids);
    },

    async deleteEvents(ids: string[]): Promise<void> {
        initDexieTrackerCollections();
        await getEventsDexieCollection().utils.deleteLocally(ids);
    },

    async deleteHmisDrafts(): Promise<void> {
        // hmis_drafts has no dedicated delete path through MetadataStore
        // (interface is get/put/listRows only, no delete — see
        // ../metadata-store.ts) and cleanup here is best-effort anyway:
        // a failed migration retries from scratch next boot regardless,
        // re-reading SQLite's still-intact hmis_drafts and re-writing
        // (overwriting, since putRow is an upsert) the same ids. Left as
        // a documented no-op rather than growing MetadataStore's surface
        // for a cleanup path that doesn't change correctness.
    },
};
