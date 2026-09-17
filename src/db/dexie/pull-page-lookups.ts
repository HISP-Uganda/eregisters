import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import type { LocalLookups } from "../pull-page";

type GettableCollection<TRow> = { get: (id: string) => TRow | undefined };

/**
 * Builds `pull-page.ts`'s `LocalLookups` against the Dexie backend, using
 * each TanStack DB collection's own synchronous `.get(key)` (its
 * currently-synced in-memory state) rather than a raw Dexie query — the
 * collection is already the source of truth for "what does this device
 * currently have locally", matching what the SQL lookups read via
 * `row-adapters/*.ts`.
 */
export function dexieLocalLookups(collections: {
    trackedEntities: GettableCollection<FlattenedTrackedEntity>;
    enrollments: GettableCollection<FlattenedEnrollment>;
    events: GettableCollection<FlattenedEvent>;
}): LocalLookups {
    return {
        getTrackedEntity: async (id) => collections.trackedEntities.get(id),
        getEnrollment: async (id) => collections.enrollments.get(id),
        getEvent: async (id) => collections.events.get(id),
    };
}
