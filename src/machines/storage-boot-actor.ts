import { createActor, type Actor } from "xstate";
import { resolveBackend } from "@/db/backend";
import { initCollections } from "@/db/collections";
import { dexieMetadataStore } from "@/db/dexie/metadata-store";
import { markDexieLive } from "@/db/dexie/dexie-live";
import { realDexieMigrationSource } from "@/db/sqlite/dexie-migration-source";
import type { SqlDriver } from "@/db/sqlite/driver-types";
import { sqliteMetadataStore } from "@/db/sqlite/metadata-store";
import { forwardCopySteps } from "@/db/sqlite/migrate-from-dexie";
import { createWaSqliteDriver } from "@/db/sqlite/wa-sqlite-driver";
import {
    clearStoreCopyFailures,
    readStoreCopyFailures,
    recordStoreCopyFailure,
} from "@/db/store-copy-failures";
import { storageBootMachine, type StorageBootDeps } from "./storage-boot";
import { storeName } from "@/db/store-names";

/** Base name; `storeName` adds the facility suffix — see store-names.ts. */
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
    const locks =
        typeof navigator !== "undefined" ? navigator.locks : undefined;
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

const realStorageBootDeps: StorageBootDeps = {
    async resolveBackend() {
        let liveDriver: SqlDriver | undefined;
        const backend = await resolveBackend(async () => {
            liveDriver = await createWaSqliteDriver(storeName(SQLITE_DB_NAME));
        });
        return {
            backend,
            liveDriver: backend === "sqlite" ? liveDriver : undefined,
        };
    },

    initCollections,

    forwardCopySteps: (liveDriver) =>
        forwardCopySteps(liveDriver, realDexieMigrationSource),

    acquireCopyLock,

    async commitLiveStore(backend) {
        // A Dexie boot (fallback where OPFS fails) lets the next SQLite boot
        // see that Dexie data may be newer than its last copy — see
        // markDexieLive's doc comment.
        if (backend === "dexie") await markDexieLive().catch(() => undefined);
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
            input: { deps: realStorageBootDeps },
        });
        bootActor.start();
    }
    return bootActor;
}
