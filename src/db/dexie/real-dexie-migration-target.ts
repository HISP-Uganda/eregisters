import type { SyncState } from "../index";
import type { HmisDraft } from "../hmis-drafts";
import { dexieMetadataStore } from "./metadata-store";
import { countDexieRowsByIds } from "./dexie-verification";
import type { DexieMigrationTarget } from "./migrate-from-sqlite";
import {
    getEnrollmentsDexieCollection,
    getEventsDexieCollection,
    getTrackedEntitiesDexieCollection,
    initDexieTrackerCollections,
} from "./tracker-collections-instance";

const MIGRATION_STATUS_TABLE = "migration_status";
const MIGRATION_STATUS_ID = "sqlite-migration";

type MigrationStatusRow = { id: string; completedAt: string };

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
