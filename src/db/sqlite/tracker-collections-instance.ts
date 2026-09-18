import {
    createEnrollmentsSqliteCollection,
    createEventsSqliteCollection,
    createTrackedEntitiesSqliteCollection,
} from "./collections";
import type { SqlDriver } from "./driver-types";

/**
 * Module-level singletons for the three tracker collections — necessary
 * because `createXSqliteCollection(db)` (`collections.ts`) is a factory,
 * not a ready-made value: it needs an already-created `SqlDriver`, which
 * only exists after `App.tsx`'s async `createWaSqliteDriver()` resolves.
 * Unlike the Dexie-backed `src/collections/*.ts` exports these replace
 * (synchronous module singletons, importable anywhere at load time),
 * every consumer of these three collections must go through the
 * `getX Collection()` getters below rather than a plain import.
 *
 * All three share the SAME `SqlDriver`/database as the metadata tables —
 * `schema.ts`'s `createSchema` (called once, inside `createWaSqliteDriver`
 * itself) creates both the tracker and metadata tables in one pass, so
 * there is only ever one SQL database for this app, not two.
 */

type TrackedEntitiesCollection = ReturnType<
    typeof createTrackedEntitiesSqliteCollection
>;
type EnrollmentsCollection = ReturnType<
    typeof createEnrollmentsSqliteCollection
>;
type EventsCollection = ReturnType<typeof createEventsSqliteCollection>;

let trackedEntitiesCollection: TrackedEntitiesCollection | null = null;
let enrollmentsCollection: EnrollmentsCollection | null = null;
let eventsCollection: EventsCollection | null = null;

export function initTrackerCollections(driver: SqlDriver): void {
    if (trackedEntitiesCollection) return;
    trackedEntitiesCollection = createTrackedEntitiesSqliteCollection(driver);
    enrollmentsCollection = createEnrollmentsSqliteCollection(driver);
    eventsCollection = createEventsSqliteCollection(driver);
}

function requireInitialized<T>(value: T | null, name: string): T {
    if (!value) {
        throw new Error(
            `${name} not initialized — call initTrackerCollections() before getting it`,
        );
    }
    return value;
}

export function getTrackedEntitiesCollection(): TrackedEntitiesCollection {
    return requireInitialized(
        trackedEntitiesCollection,
        "trackedEntitiesCollection",
    );
}

export function getEnrollmentsCollection(): EnrollmentsCollection {
    return requireInitialized(enrollmentsCollection, "enrollmentsCollection");
}

export function getEventsCollection(): EventsCollection {
    return requireInitialized(eventsCollection, "eventsCollection");
}

/**
 * Test-only escape hatch: clears the singletons so a test file can call
 * `initTrackerCollections(freshDriver)` again against a different driver.
 * Never called from application code (`App.tsx` initializes exactly once
 * per page load) — only from tests that need multiple independent
 * driver/collection sets within one process (e.g. exercising a
 * once-per-device flag's first-run vs. already-run behavior).
 */
export function resetTrackerCollectionsForTests(): void {
    trackedEntitiesCollection = null;
    enrollmentsCollection = null;
    eventsCollection = null;
}
