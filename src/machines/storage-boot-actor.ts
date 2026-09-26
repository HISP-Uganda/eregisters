import { createActor, type Actor } from "xstate";
import {
    clearCachedOpfsFailure,
    getBackendSetting,
    markSqliteUsed,
    resolveBackend,
    setCachedOpfsFailure,
    shouldAttemptSqliteToDexieCopy,
} from "../db/backend";
import { initCollections } from "../db/collections";
import { dexieMetadataStore } from "../db/dexie/metadata-store";
import { reverseCopySteps } from "../db/dexie/migrate-from-sqlite";
import {
    clearSqliteMigrationFlag,
    markDexieLive,
    realDexieMigrationTarget,
} from "../db/dexie/real-dexie-migration-target";
import { realDexieMigrationSource } from "../db/sqlite/dexie-migration-source";
import type { SqlDriver } from "../db/sqlite/driver-types";
import { sqliteMetadataStore } from "../db/sqlite/metadata-store";
import { forwardCopySteps } from "../db/sqlite/migrate-from-dexie";
import { createWaSqliteDriver } from "../db/sqlite/wa-sqlite-driver";
import {
    clearStoreCopyFailures,
    readStoreCopyFailures,
    recordStoreCopyFailure,
} from "../db/store-copy-failures";
import { storageBootMachine, type StorageBootDeps } from "./storage-boot";

const SQLITE_DB_NAME = "eregisters-metadata";
const STORE_COPY_LOCK = "eregisters-store-copy";

/**
 * Holds `STORE_COPY_LOCK` until the returned function is called. wa-sqlite
 * lets several tabs open the database at once, so without this two tabs
 * booting together could each run a copy — and one's rollback could
 * delete rows the other just verified. Browsers without Web Locks run
 * unlocked, as before.
 */
function acquireCopyLock(): Promise<() => void> {
    const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
    if (!locks) return Promise.resolve(() => undefined);
    return new Promise((resolveAcquired, reject) => {
        locks
            .request(
                STORE_COPY_LOCK,
                () =>
                    new Promise<void>((release) => {
                        resolveAcquired(() => release());
                    }),
            )
            .catch(reject);
    });
}

export const realStorageBootDeps: StorageBootDeps = {
    async resolveBackend(setting) {
        let liveDriver: SqlDriver | undefined;
        const backend = await resolveBackend(setting, async () => {
            liveDriver = await createWaSqliteDriver(SQLITE_DB_NAME);
        });
        return { backend, liveDriver: backend === "sqlite" ? liveDriver : undefined };
    },

    initCollections,

    /**
     * The reverse copy runs on a Dexie boot, where `resolveBackend` opened
     * no SQLite driver — so it opens its own, used only to read from and
     * closed when the copy is over. `hasCompletedMigration()` is cheap and
     * Dexie-only, so it gates the (costly) Worker start. Reuses
     * `backend.ts`'s OPFS-failure cache so a device structurally incapable
     * of OPFS pays the failed attempt only once — see
     * `shouldAttemptSqliteToDexieCopy` for when that cache is ignored.
     */
    async prepareReverseCopy(setting) {
        // Complete AND known clean: nothing to copy or clean up. Complete
        // but not known clean still opens SQLite, so a failed cleanup (or
        // one from before cleanup was retried) gets another go.
        if (
            (await realDexieMigrationTarget.hasCompletedMigration()) &&
            (await realDexieMigrationTarget.isSqliteCleaned())
        ) {
            return undefined;
        }
        if (!shouldAttemptSqliteToDexieCopy(setting)) return undefined;
        try {
            const driver = await createWaSqliteDriver(SQLITE_DB_NAME);
            clearCachedOpfsFailure();
            return driver;
        } catch {
            setCachedOpfsFailure();
            return undefined;
        }
    },

    forwardCopySteps: (liveDriver) =>
        forwardCopySteps(liveDriver, realDexieMigrationSource),

    reverseCopySteps: (copyDriver) =>
        reverseCopySteps(copyDriver, realDexieMigrationTarget),

    acquireCopyLock,

    async commitLiveStore(backend) {
        if (backend === "sqlite") {
            markSqliteUsed();
            // SQLite is live now, so a later switch to Dexie must copy its
            // data back — see clearSqliteMigrationFlag's doc comment.
            await clearSqliteMigrationFlag().catch(() => undefined);
        } else {
            // Lets the next SQLite boot see that Dexie data may be newer
            // than its last copy — see markDexieLive's doc comment.
            await markDexieLive().catch(() => undefined);
        }
    },

    readCopyFailures: readStoreCopyFailures,
    recordCopyFailure: recordStoreCopyFailure,
    clearCopyFailures: clearStoreCopyFailures,

    metadataStoreFor: (backend, driver) =>
        backend === "sqlite" && driver
            ? sqliteMetadataStore(driver)
            : dexieMetadataStore(),
};

let bootActor: Actor<typeof storageBootMachine> | undefined;

/**
 * The one storage-boot actor for this page, created and started on first
 * call. `start()` is idempotent and nothing ever stops it, so React
 * remounts can't re-run a copy step (research: stopping a promise actor
 * doesn't stop its promise, and @xstate/react's hooks restart it).
 */
export function getStorageBootActor(): Actor<typeof storageBootMachine> {
    if (!bootActor) {
        bootActor = createActor(storageBootMachine, {
            input: { setting: getBackendSetting(), deps: realStorageBootDeps },
        });
        bootActor.start();
    }
    return bootActor;
}
