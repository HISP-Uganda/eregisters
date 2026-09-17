import type { LocalLookups } from "../pull-page";
import type { SqlDriver } from "./driver-types";
import { getEnrollmentById } from "./row-adapters/enrollments";
import { getEventById } from "./row-adapters/events";
import { getTrackedEntityById } from "./row-adapters/tracked-entities";

/** Builds `pull-page.ts`'s `LocalLookups` against the SQLite backend. */
export function sqlLocalLookups(db: SqlDriver): LocalLookups {
    return {
        getTrackedEntity: async (id) =>
            (await getTrackedEntityById(db, id)) ?? undefined,
        getEnrollment: async (id) =>
            (await getEnrollmentById(db, id)) ?? undefined,
        getEvent: async (id) => (await getEventById(db, id)) ?? undefined,
    };
}
