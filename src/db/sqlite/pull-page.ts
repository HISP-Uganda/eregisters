import type { TrackedEntity } from "../../schemas";
import {
    mergeBulkEnrollments,
    mergeBulkEvents,
    mergeBulkTrackedEntities,
} from "../merge-utils";
import { flattenEnrollment, flattenEvent, flattenTrackedEntity } from "../../utils/utils";
import type {
    createEnrollmentsSqliteCollection,
    createEventsSqliteCollection,
    createTrackedEntitiesSqliteCollection,
} from "./collections";
import type { SqlDriver } from "./driver-types";
import { getEnrollmentById } from "./row-adapters/enrollments";
import { getEventById } from "./row-adapters/events";
import { getTrackedEntityById } from "./row-adapters/tracked-entities";

/**
 * Mirrors `src/machines/sync.ts`'s `pullData` instance-slicing + merge +
 * write (~lines 709-772) against the SQLite collections instead of Dexie —
 * this is wayfinder ticket "How Does src/machines/sync.ts's Pull/Push Logic
 * Get Restructured for the New SQLite Adapter?" decisions #1/#2, the last
 * unbuilt piece of that ticket. Standalone and independently tested — not
 * wired into sync.ts itself.
 *
 * Reuses the REAL `flattenTrackedEntity`/`flattenEnrollment`/`flattenEvent`
 * (`src/utils/utils.ts`) and `mergeBulk*` (`src/db/merge-utils.ts`)
 * functions unchanged — both are pure/storage-agnostic (per decision #2,
 * "merge logic stays in JS"), so this only needs to supply SQLite-backed
 * `getLocal*` lookups and the server-origin write step.
 */
export type PulledTrackedEntityPageCollections = {
    trackedEntities: ReturnType<typeof createTrackedEntitiesSqliteCollection>;
    enrollments: ReturnType<typeof createEnrollmentsSqliteCollection>;
    events: ReturnType<typeof createEventsSqliteCollection>;
};

export async function writePulledTrackedEntityPage(
    db: SqlDriver,
    instances: TrackedEntity[],
    collections: PulledTrackedEntityPageCollections,
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
        (id) => getTrackedEntityById(db, id),
    );
    const mergedEnrollments = await mergeBulkEnrollments(
        serverEnrollments,
        (id) => getEnrollmentById(db, id),
    );
    const mergedEvents = await mergeBulkEvents(serverEvents, (id) =>
        getEventById(db, id),
    );

    // Order matters: enrollments/events reference tracked_entities/
    // enrollments via FK, so parents must be written first.
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
