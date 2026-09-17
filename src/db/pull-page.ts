import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    TrackedEntity,
} from "../schemas";
import {
    mergeBulkEnrollments,
    mergeBulkEvents,
    mergeBulkTrackedEntities,
} from "./merge-utils";
import { flattenEnrollment, flattenEvent, flattenTrackedEntity } from "../utils/utils";
import type {
    createEnrollmentsDexieCollection,
    createEventsDexieCollection,
    createTrackedEntitiesDexieCollection,
} from "./dexie/collections";
import type {
    createEnrollmentsSqliteCollection,
    createEventsSqliteCollection,
    createTrackedEntitiesSqliteCollection,
} from "./sqlite/collections";

/**
 * Mirrors `src/machines/sync.ts`'s `pullData` instance-slicing + merge +
 * write (~lines 709-772) — backend-agnostic since the dual-backend wiring
 * (`docs/wayfinder/opfs-dexie-dual-backend/`): the collections param only
 * needs `TrackerCollectionUtils`, and the local-row lookups (needed for
 * `mergeBulk*`'s local-wins-per-field merge) are supplied by the caller as
 * `LocalLookups` — SQL's `getTrackedEntityById`/etc for the SQLite
 * backend, or a Dexie collection's own synchronous `.get()` for the Dexie
 * backend. Previously SQL-only (`src/db/sqlite/pull-page.ts`, took a raw
 * `SqlDriver`) — moved and generalized here, not a rewrite of the merge
 * logic itself.
 *
 * Reuses the REAL `flattenTrackedEntity`/`flattenEnrollment`/`flattenEvent`
 * (`src/utils/utils.ts`) and `mergeBulk*` (`src/db/merge-utils.ts`)
 * functions unchanged — both are pure/storage-agnostic.
 */
// Unioned against both backends' real factory return types (not a
// hand-rolled duck type) — `createCollection`'s generic inference widens
// `.utils` to a less specific shape when checked structurally against an
// interface declared elsewhere, so this file, like the original SQL-only
// version it replaces, types against the concrete collection types the
// dispatcher (`src/db/collections.ts`) actually returns.
export type PulledTrackedEntityPageCollections = {
    trackedEntities:
        | ReturnType<typeof createTrackedEntitiesSqliteCollection>
        | ReturnType<typeof createTrackedEntitiesDexieCollection>;
    enrollments:
        | ReturnType<typeof createEnrollmentsSqliteCollection>
        | ReturnType<typeof createEnrollmentsDexieCollection>;
    events:
        | ReturnType<typeof createEventsSqliteCollection>
        | ReturnType<typeof createEventsDexieCollection>;
};

export type LocalLookups = {
    getTrackedEntity: (
        id: string,
    ) => Promise<FlattenedTrackedEntity | undefined>;
    getEnrollment: (id: string) => Promise<FlattenedEnrollment | undefined>;
    getEvent: (id: string) => Promise<FlattenedEvent | undefined>;
};

export async function writePulledTrackedEntityPage(
    instances: TrackedEntity[],
    collections: PulledTrackedEntityPageCollections,
    getLocal: LocalLookups,
): Promise<void> {
    // Identical slicing to sync.ts:724-736.
    const serverTrackedEntities = instances.map(flattenTrackedEntity);
    const serverEvents = instances.flatMap(({ enrollments }) =>
        (enrollments ?? []).flatMap(({ events }) =>
            (events ?? [])
                .filter((event) => event.occurredAt)
                .map(flattenEvent),
        ),
    );
    const serverEnrollments = instances.flatMap(({ enrollments }) =>
        (enrollments ?? []).map(flattenEnrollment),
    );

    const mergedTrackedEntities = await mergeBulkTrackedEntities(
        serverTrackedEntities,
        getLocal.getTrackedEntity,
    );
    const mergedEnrollments = await mergeBulkEnrollments(
        serverEnrollments,
        getLocal.getEnrollment,
    );
    const mergedEvents = await mergeBulkEvents(
        serverEvents,
        getLocal.getEvent,
    );

    // Order matters: enrollments/events reference tracked_entities/
    // enrollments via FK on the SQLite backend, so parents must be written
    // first (Dexie's flat rows have no such constraint, but the same order
    // is harmless and keeps behavior identical across backends).
    await collections.trackedEntities.utils.bulkInsertLocally(
        mergedTrackedEntities,
        { source: "server" },
    );
    await collections.enrollments.utils.bulkInsertLocally(mergedEnrollments, {
        source: "server",
    });
    await collections.events.utils.bulkInsertLocally(mergedEvents, {
        source: "server",
    });
}
