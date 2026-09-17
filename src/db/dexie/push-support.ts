import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";

/**
 * Dexie-backend equivalents of the SQL-only push-side helpers
 * (`src/db/sqlite/row-adapters/{enrollments,events,tracked-entities}.ts`'s
 * `findXBySyncStatusIn`, `src/db/sqlite/delete-cascade.ts`, `src/db/sqlite/
 * push-results.ts`), used by `sync-tracker-actors.ts`'s
 * `processBatchSync` on the Dexie backend. Operates directly on each
 * TanStack DB collection (its own in-memory synced state + `.utils`),
 * since Dexie's flat rows have no FK-enforced child tables to cascade
 * through (wayfinder ticket 003's decision 5) — the logical cascade shape
 * below mirrors `delete-cascade.ts` exactly, just without a transaction.
 */

/**
 * TanStack DB's `Collection` type exposes `.utils` as a generic
 * `UtilsRecord` at the type level, not narrowed to the concrete
 * `TrackerCollectionUtils` shape each adapter actually returns (checked
 * via `satisfies TrackerCollectionUtils<...>` where the adapters are
 * built — `src/db/dexie/dexie-collection-adapter.ts`). Rather than cast
 * at every call site in `sync-tracker-actors.ts`, each helper below
 * accepts `utils` as `unknown` and narrows it once, locally, via
 * `usableUtils`.
 */
type UtilsOf<TRow> = {
    updateLocally: (rows: TRow[]) => Promise<void>;
    deleteLocally: (keys: string[]) => Promise<void>;
};
function usableUtils<TRow>(utils: unknown): UtilsOf<TRow> {
    return utils as UtilsOf<TRow>;
}

type TrackedEntitiesCollection = {
    toArray: FlattenedTrackedEntity[];
    get: (id: string) => FlattenedTrackedEntity | undefined;
    utils: unknown;
};
type EnrollmentsCollection = {
    toArray: FlattenedEnrollment[];
    get: (id: string) => FlattenedEnrollment | undefined;
    utils: unknown;
};
type EventsCollection = {
    toArray: FlattenedEvent[];
    get: (id: string) => FlattenedEvent | undefined;
    utils: unknown;
};

export function findTrackedEntitiesBySyncStatusInDexie(
    collection: TrackedEntitiesCollection,
    statuses: ReadonlyArray<string>,
): FlattenedTrackedEntity[] {
    return collection.toArray.filter((row) =>
        statuses.includes(row.syncStatus),
    );
}

export function findEnrollmentsBySyncStatusInDexie(
    collection: EnrollmentsCollection,
    statuses: ReadonlyArray<string>,
): FlattenedEnrollment[] {
    return collection.toArray.filter((row) => statuses.includes(row.syncStatus));
}

export function findEventsBySyncStatusInDexie(
    collection: EventsCollection,
    statuses: ReadonlyArray<string>,
): FlattenedEvent[] {
    return collection.toArray.filter((row) => statuses.includes(row.syncStatus));
}

/** Mirrors `deleteTrackedEntityCascade` — deletes the TE, its enrollments, and their events. */
export async function deleteTrackedEntityCascadeDexie(
    collections: {
        trackedEntities: TrackedEntitiesCollection;
        enrollments: EnrollmentsCollection;
        events: EventsCollection;
    },
    trackedEntityId: string,
): Promise<void> {
    const enrollments = collections.enrollments.toArray.filter(
        (row) => row.trackedEntity === trackedEntityId,
    );
    const events = collections.events.toArray.filter(
        (row) => row.trackedEntity === trackedEntityId,
    );
    if (events.length > 0) {
        await usableUtils<FlattenedEvent>(collections.events.utils).deleteLocally(
            events.map((e) => e.event),
        );
    }
    if (enrollments.length > 0) {
        await usableUtils<FlattenedEnrollment>(
            collections.enrollments.utils,
        ).deleteLocally(enrollments.map((e) => e.enrollment));
    }
    await usableUtils<FlattenedTrackedEntity>(
        collections.trackedEntities.utils,
    ).deleteLocally([trackedEntityId]);
}

/** Mirrors `deleteEnrollmentCascade` — deletes the enrollment and its events. */
export async function deleteEnrollmentCascadeDexie(
    collections: { enrollments: EnrollmentsCollection; events: EventsCollection },
    enrollmentId: string,
): Promise<void> {
    const events = collections.events.toArray.filter(
        (row) => row.enrollment === enrollmentId,
    );
    if (events.length > 0) {
        await usableUtils<FlattenedEvent>(collections.events.utils).deleteLocally(
            events.map((e) => e.event),
        );
    }
    await usableUtils<FlattenedEnrollment>(
        collections.enrollments.utils,
    ).deleteLocally([enrollmentId]);
}

/** Mirrors `deleteEventCascade` — deletes the event itself. */
export async function deleteEventCascadeDexie(
    collections: { events: EventsCollection },
    eventId: string,
): Promise<void> {
    await usableUtils<FlattenedEvent>(collections.events.utils).deleteLocally([
        eventId,
    ]);
}

export type PushResultUpdate = {
    key: string;
    syncStatus: "synced" | "failed";
    syncError: string | null;
};

/**
 * Mirrors `applyPushResults` — writes back server-assigned sync status via
 * each collection's own `.utils.updateLocally`, the Dexie write path's
 * natural equivalent of the SQL side's one-transaction raw write (Dexie
 * has no separate bypass-and-refresh step; `updateLocally` already
 * persists and updates the collection's live state directly).
 */
export async function applyPushResultsDexie(
    collections: {
        trackedEntities: TrackedEntitiesCollection;
        enrollments: EnrollmentsCollection;
        events: EventsCollection;
    },
    results: {
        trackedEntities: PushResultUpdate[];
        enrollments: PushResultUpdate[];
        events: PushResultUpdate[];
    },
): Promise<void> {
    const lastSynced = new Date().toISOString();

    const updated = <T extends { syncStatus: string; syncError?: string | null; lastSynced?: string }>(
        current: T,
        update: PushResultUpdate,
    ): T => ({
        ...current,
        syncStatus: update.syncStatus,
        syncError: update.syncError,
        lastSynced,
    });

    const trackedEntities = results.trackedEntities.flatMap((update) => {
        const current = collections.trackedEntities.get(update.key);
        return current ? [updated(current, update)] : [];
    });
    const enrollments = results.enrollments.flatMap((update) => {
        const current = collections.enrollments.get(update.key);
        return current ? [updated(current, update)] : [];
    });
    const events = results.events.flatMap((update) => {
        const current = collections.events.get(update.key);
        return current ? [updated(current, update)] : [];
    });

    if (trackedEntities.length > 0) {
        await usableUtils<FlattenedTrackedEntity>(
            collections.trackedEntities.utils,
        ).updateLocally(trackedEntities);
    }
    if (enrollments.length > 0) {
        await usableUtils<FlattenedEnrollment>(
            collections.enrollments.utils,
        ).updateLocally(enrollments);
    }
    if (events.length > 0) {
        await usableUtils<FlattenedEvent>(collections.events.utils).updateLocally(
            events,
        );
    }
}
