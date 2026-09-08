import Dexie from "dexie";
import type { HmisDraft } from "../hmis-drafts";
import { db as mohRegisterDb } from "../index";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import type { DexieMigrationSource } from "./migrate-from-dexie";

/**
 * Real, browser-only `DexieMigrationSource` implementation. Untestable
 * under `node:sqlite` (real IndexedDB/Dexie needed) — kept deliberately
 * small and separate from `migrate-from-dexie.ts`'s orchestration logic,
 * which is what actually needs unit-test coverage.
 *
 * The 5 known Dexie database names, per `src/db/index.ts` and the (now
 * dead but still accurate) `src/collections/*.ts` definitions.
 */
const DEXIE_DATABASE_NAMES = [
    "MOHRegisterDB",
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

    async readHmisDrafts(): Promise<HmisDraft[]> {
        // MOHRegisterDB's real schema is already known (src/db/index.ts),
        // so this reuses the app's own Dexie definition directly instead
        // of a schema-less open — but only after confirming the database
        // actually exists, since merely importing `db` doesn't touch
        // IndexedDB (Dexie opens lazily on first real query) and we must
        // not be the ones to trigger that on a device that never had it.
        if (!(await Dexie.exists("MOHRegisterDB"))) return [];
        return mohRegisterDb.hmisDrafts.toArray();
    },

    async dropAll(): Promise<void> {
        await Promise.all(
            DEXIE_DATABASE_NAMES.map((name) => Dexie.delete(name)),
        );
    },
};
