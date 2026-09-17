import {
    getEnrollmentsCollection as getSqliteEnrollmentsCollection,
    getEventsCollection as getSqliteEventsCollection,
    getTrackedEntitiesCollection as getSqliteTrackedEntitiesCollection,
    initTrackerCollections,
} from "./sqlite/tracker-collections-instance";
import type { SqlDriver } from "./sqlite/driver-types";
import {
    getEnrollmentsDexieCollection,
    getEventsDexieCollection,
    getTrackedEntitiesDexieCollection,
    initDexieTrackerCollections,
} from "./dexie/tracker-collections-instance";
import type { StorageBackend } from "./backend";

/**
 * Backend-dispatching collection getters — the single place every non-test
 * call site (16 of them, per wayfinder's dual-backend map) gets its
 * tracked-entities/enrollments/events collection from, instead of
 * importing the SQL-only or Dexie-only getters directly. `initCollections`
 * is called once at `App.tsx` bootstrap after the resolved backend is
 * known; every getter below delegates to whichever backend's real getter
 * is active, recorded in this module's own state (not re-derived per
 * call — collections are singletons for the app's lifetime, matching both
 * underlying instance modules' lifecycle).
 */

let activeBackend: StorageBackend | null = null;

export function initCollections(
    backend: StorageBackend,
    sqlDriver?: SqlDriver,
): void {
    if (backend === "sqlite") {
        if (!sqlDriver) {
            throw new Error("initCollections(\"sqlite\", ...) requires a sqlDriver");
        }
        initTrackerCollections(sqlDriver);
    } else {
        initDexieTrackerCollections();
    }
    activeBackend = backend;
}

function requireBackend(): StorageBackend {
    if (!activeBackend) {
        throw new Error(
            "initCollections() not called yet — call it at app bootstrap before getting a collection",
        );
    }
    return activeBackend;
}

export function getTrackedEntitiesCollection() {
    return requireBackend() === "sqlite"
        ? getSqliteTrackedEntitiesCollection()
        : getTrackedEntitiesDexieCollection();
}

export function getEnrollmentsCollection() {
    return requireBackend() === "sqlite"
        ? getSqliteEnrollmentsCollection()
        : getEnrollmentsDexieCollection();
}

export function getEventsCollection() {
    return requireBackend() === "sqlite"
        ? getSqliteEventsCollection()
        : getEventsDexieCollection();
}

/** Test-only escape hatch, mirroring both underlying instance modules'. */
export function resetCollectionsForTests(): void {
    activeBackend = null;
}
