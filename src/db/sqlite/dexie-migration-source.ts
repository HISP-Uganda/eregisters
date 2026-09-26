import Dexie from "dexie";
import type { SyncState } from "../index";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    MetadataVersion,
} from "../../schemas";
import type { DexieMigrationSource } from "./migrate-from-dexie";

/**
 * `dexieMetadataStore()`'s own database (`src/db/dexie/metadata-store.ts`)
 * — a single `rows` table keyed by `[table+id]`, holding `sync_state`,
 * `metadata_versions`, `programs`, `data_elements`, `ui_config`,
 * `stage_hierarchy`, etc. `readMetadataTables()` (below) copies all of
 * it into sqlite (via `MIGRATED_METADATA_TABLES` in
 * `../metadata-operations.ts`) so a device doesn't start on wa-sqlite
 * with empty metadata tables. This database is still deliberately NOT in
 * `DEXIE_DATABASE_NAMES`/`dropAll()` below, though: unlike the tracker databases
 * that are dropped, nothing here verifies row counts after copying (it's
 * re-derivable from DHIS2 either way), so leaving the Dexie copy in place
 * is the safer failure mode if a row was silently missed.
 */
async function readMetadataRow<T>(
    table: string,
    id: string,
): Promise<T | undefined> {
    if (!(await Dexie.exists("MOHRegister_Metadata"))) return undefined;
    const handle = new Dexie("MOHRegister_Metadata");
    try {
        await handle.open();
        const row = await handle
            .table<{ table: string; id: string; data: T }, [string, string]>(
                "rows",
            )
            .get([table, id]);
        return row?.data;
    } finally {
        handle.close();
    }
}

/**
 * Real, browser-only `DexieMigrationSource` implementation. Untestable
 * under `node:sqlite` (real IndexedDB/Dexie needed) — kept deliberately
 * small and separate from `migrate-from-dexie.ts`'s orchestration logic,
 * which is what actually needs unit-test coverage.
 *
 * The Dexie tracker databases this migration copies from and then drops
 * (`src/db/dexie/collections.ts`). `MOHRegisterDB` is deliberately NOT
 * here: `src/db/hmis-drafts.ts` keeps HMIS drafts in it on BOTH backends,
 * so dropping it would silently lose every unsent draft on the device.
 */
const DEXIE_DATABASE_NAMES = [
    "MOHRegister_TrackedEntities",
    "MOHRegister_Enrollments",
    "MOHRegister_Events",
    "MOHRegister_RuleResults",
] as const;

/**
 * Opens an existing Dexie database WITHOUT declaring `.version().stores()`
 * — Dexie infers the schema already on disk. Only ever called after
 * `Dexie.exists(dbName)` has confirmed the database is really there, so
 * this never creates a database that didn't already exist (the whole
 * point of the presence check: a fresh install must not end up with a
 * phantom empty Dexie database from mere probing). Avoids having to
 * reverse-engineer the exact index string `tanstack-dexie-db-collection`
 * set up internally for the 3 tracker databases.
 */
async function readAllRows<T>(
    dbName: string,
    tableName: string,
): Promise<T[]> {
    if (!(await Dexie.exists(dbName))) return [];
    const handle = new Dexie(dbName);
    try {
        await handle.open();
        return await handle.table<T, string>(tableName).toArray();
    } finally {
        handle.close();
    }
}

export const realDexieMigrationSource: DexieMigrationSource = {
    async existsAnyDexieData(): Promise<boolean> {
        const results = await Promise.all(
            DEXIE_DATABASE_NAMES.map((name) => Dexie.exists(name)),
        );
        return results.some(Boolean);
    },

    async readReverseCopyCompletedAt(): Promise<string | undefined> {
        // Written by `realDexieMigrationTarget.markMigrationComplete`.
        const row = await readMetadataRow<{ completedAt: string }>(
            "migration_status",
            "sqlite-migration",
        );
        return row?.completedAt;
    },

    async readDexieLastLiveAt(): Promise<string | undefined> {
        // Written by `markDexieLive` (`../dexie/real-dexie-migration-target.ts`).
        const row = await readMetadataRow<{ liveAt: string }>(
            "migration_status",
            "dexie-live",
        );
        return row?.liveAt;
    },

    readTrackedEntities(): Promise<FlattenedTrackedEntity[]> {
        return readAllRows<FlattenedTrackedEntity>(
            "MOHRegister_TrackedEntities",
            "trackedEntities",
        );
    },

    readEnrollments(): Promise<FlattenedEnrollment[]> {
        return readAllRows<FlattenedEnrollment>(
            "MOHRegister_Enrollments",
            "enrollments",
        );
    },

    readEvents(): Promise<FlattenedEvent[]> {
        return readAllRows<FlattenedEvent>("MOHRegister_Events", "events");
    },

    readSyncState(): Promise<SyncState | undefined> {
        return readMetadataRow<SyncState>("sync_state", "current");
    },

    readMetadataVersion(): Promise<MetadataVersion | undefined> {
        return readMetadataRow<MetadataVersion>(
            "metadata_versions",
            "metadata-version",
        );
    },

    async readMetadataTables(): Promise<Record<string, unknown[]>> {
        if (!(await Dexie.exists("MOHRegister_Metadata"))) return {};
        const handle = new Dexie("MOHRegister_Metadata");
        try {
            await handle.open();
            const allRows = await handle
                .table<
                    { table: string; id: string; data: unknown },
                    [string, string]
                >("rows")
                .toArray();
            const byTable: Record<string, unknown[]> = {};
            for (const row of allRows) {
                (byTable[row.table] ??= []).push(row.data);
            }
            return byTable;
        } finally {
            handle.close();
        }
    },

    async dropAll(): Promise<void> {
        await Promise.all(
            DEXIE_DATABASE_NAMES.map((name) => Dexie.delete(name)),
        );
    },
};
