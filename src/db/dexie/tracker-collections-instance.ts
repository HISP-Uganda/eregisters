import {
    createEnrollmentsDexieCollection,
    createEventsDexieCollection,
    createTrackedEntitiesDexieCollection,
} from "./collections";

/**
 * Module-level singletons for the Dexie-backed tracker collections,
 * mirroring `src/db/sqlite/tracker-collections-instance.ts` exactly — same
 * one-instance-per-app-load lifecycle, same getter shape. Not wired into
 * the rest of the app yet: there is no backend-dispatching module today
 * that picks between this file's getters and the SQL side's — that
 * wiring (and the `App.tsx`/`sync.ts` bootstrap work it depends on) is
 * deferred, per wayfinder ticket 001's "Not yet specified" note on
 * `src/machines/sync.ts`'s 52 direct `SqlDriver` references. This module
 * is independently correct and ready for that later wiring, not yet in
 * the live call path.
 *
 * No `ruleResults` getter, matching the SQL side: `createRuleResultsSqliteCollection`
 * exists in `src/db/sqlite/collections.ts` but nothing actually wires it
 * into a getter/consumer today — `createRuleResultsDexieCollection`
 * (`./collections.ts`) exists for the same not-yet-used parity, not
 * wired in here either.
 */

type TrackedEntitiesCollection = ReturnType<
    typeof createTrackedEntitiesDexieCollection
>;
type EnrollmentsCollection = ReturnType<
    typeof createEnrollmentsDexieCollection
>;
type EventsCollection = ReturnType<typeof createEventsDexieCollection>;

let trackedEntitiesCollection: TrackedEntitiesCollection | null = null;
let enrollmentsCollection: EnrollmentsCollection | null = null;
let eventsCollection: EventsCollection | null = null;

export function initDexieTrackerCollections(): void {
    if (trackedEntitiesCollection) return;
    trackedEntitiesCollection = createTrackedEntitiesDexieCollection();
    enrollmentsCollection = createEnrollmentsDexieCollection();
    eventsCollection = createEventsDexieCollection();
}

function requireInitialized<T>(value: T | null, name: string): T {
    if (!value) {
        throw new Error(
            `${name} not initialized — call initDexieTrackerCollections() before getting it`,
        );
    }
    return value;
}

export function getTrackedEntitiesDexieCollection(): TrackedEntitiesCollection {
    return requireInitialized(
        trackedEntitiesCollection,
        "trackedEntitiesCollection",
    );
}

export function getEnrollmentsDexieCollection(): EnrollmentsCollection {
    return requireInitialized(enrollmentsCollection, "enrollmentsCollection");
}

export function getEventsDexieCollection(): EventsCollection {
    return requireInitialized(eventsCollection, "eventsCollection");
}

/** Test-only escape hatch — see the SQL side's identical helper for why. */
export function resetDexieTrackerCollectionsForTests(): void {
    trackedEntitiesCollection = null;
    enrollmentsCollection = null;
    eventsCollection = null;
}
