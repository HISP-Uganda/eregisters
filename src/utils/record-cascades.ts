import { eq, queryOnce } from "@tanstack/react-db";
import { Event, FlattenedEnrollment, FlattenedEvent, FlattenedTrackedEntity, TrackedEntity } from "@/schemas";
import { getEnrollmentsCollection, getEventsCollection, getTrackedEntitiesCollection } from "@/db/collections";

/**
 * Backend-agnostic local lookups for the cascade-delete/resend walks below.
 * Each runs a one-off query, which also loads the rows it finds into the
 * collection (the SQLite collections load on demand, so a row is only in
 * memory once something queried it) — the walks then update or delete them
 * through the collection.
 */
function findEventsByParentEvent(parentEvent: string): Promise<FlattenedEvent[]> {
    return queryOnce((q) =>
        q.from({ e: getEventsCollection() }).where(({ e }) => eq(e.parentEvent, parentEvent)),
    );
}

function findEventsByTrackedEntity(trackedEntity: string): Promise<FlattenedEvent[]> {
    return queryOnce((q) =>
        q.from({ e: getEventsCollection() }).where(({ e }) => eq(e.trackedEntity, trackedEntity)),
    );
}

async function getEventById(eventId: string): Promise<FlattenedEvent | undefined> {
    const [event] = await queryOnce((q) =>
        q.from({ e: getEventsCollection() }).where(({ e }) => eq(e.event, eventId)),
    );
    return event;
}

function findTrackedEntitiesByParentEntity(parentEntity: string): Promise<FlattenedTrackedEntity[]> {
    return queryOnce((q) =>
        q.from({ te: getTrackedEntitiesCollection() }).where(({ te }) => eq(te.parentEntity, parentEntity)),
    );
}

async function getTrackedEntityById(trackedEntity: string): Promise<FlattenedTrackedEntity | undefined> {
    const [te] = await queryOnce((q) =>
        q.from({ te: getTrackedEntitiesCollection() }).where(({ te }) => eq(te.trackedEntity, trackedEntity)),
    );
    return te;
}

function findEnrollmentsByTrackedEntity(trackedEntity: string): Promise<FlattenedEnrollment[]> {
    return queryOnce((q) =>
        q.from({ en: getEnrollmentsCollection() }).where(({ en }) => eq(en.trackedEntity, trackedEntity)),
    );
}

/**
 * Recursively deletes all draft descendants of a given event or tracked entity.
 * Deletes children only — does NOT delete the root node itself (caller's responsibility).
 * Uses depth-first order: children are deleted before their parent.
 */
async function deleteRecursiveDraftSubtree(
    eventId: string | undefined,
    trackedEntityId: string | undefined,
): Promise<void> {
    if (eventId) {
        const childEvents = (await findEventsByParentEvent(eventId)).filter(
            (e) => e.syncStatus === "draft",
        );
        for (const child of childEvents) {
            await deleteRecursiveDraftSubtree(child.event, undefined);
            const tx = getEventsCollection().delete(child.event);
            await tx.isPersisted.promise;
        }
    }

    if (trackedEntityId) {
        const childTEs = (
            await findTrackedEntitiesByParentEntity(trackedEntityId)
        ).filter((te) => te.syncStatus === "draft");
        for (const childTE of childTEs) {
            // Delete enrollments for this child TE
            const childEnrollments = await findEnrollmentsByTrackedEntity(
                childTE.trackedEntity,
            );
            for (const enrollment of childEnrollments) {
                const tx = getEnrollmentsCollection().delete(
                    enrollment.enrollment,
                );
                await tx.isPersisted.promise;
            }
            // Delete events for this child TE (recurse into their children first)
            const childEvents = (
                await findEventsByTrackedEntity(childTE.trackedEntity)
            ).filter((e) => e.syncStatus === "draft");
            for (const event of childEvents) {
                await deleteRecursiveDraftSubtree(event.event, undefined);
                const tx = getEventsCollection().delete(event.event);
                await tx.isPersisted.promise;
            }
            // Recurse into child TE's own children, then delete the child TE
            await deleteRecursiveDraftSubtree(undefined, childTE.trackedEntity);
            const tx = getTrackedEntitiesCollection().delete(
                childTE.trackedEntity,
            );
            await tx.isPersisted.promise;
        }
    }
}

/**
 * Deletes an event and its full subtree (both parentEvent and parentEntity dimensions).
 * - Draft/pending events are hard-deleted locally immediately.
 * - Synced/failed events are marked syncStatus="deleted" for DHIS2 deletion.
 * Returns the list of non-draft events marked for deletion so callers can trigger sync.
 */
export async function deleteEventWithChildren(
    eventId: string,
): Promise<{ markedDeleted: FlattenedEvent[] }> {
    const markedDeleted: FlattenedEvent[] = [];

    // Get the root event to know its trackedEntity (needed for TE-children dimension)
    const rootEvent = await getEventById(eventId);
    if (!rootEvent) return { markedDeleted };

    // --- Recursive helper ---
    async function processEvent(event: FlattenedEvent): Promise<void> {
        // 1. Event-children dimension: events whose parentEvent === this event
        const directChildEvents = await findEventsByParentEvent(event.event);
        for (const child of directChildEvents) {
            await processEvent(child);
        }

        // 2. TE-children dimension: TEs whose parentEntity === this event's trackedEntity
        //    then process all events belonging to those child TEs
        const childTEs = await findTrackedEntitiesByParentEntity(
            event.trackedEntity,
        );
        for (const childTE of childTEs) {
            // Find all events for this child TE
            const childTEEvents = await findEventsByTrackedEntity(
                childTE.trackedEntity,
            );
            for (const childTEEvent of childTEEvents) {
                await processEvent(childTEEvent);
            }
            // Clean up the child TE's enrollments
            const childEnrollments = await findEnrollmentsByTrackedEntity(
                childTE.trackedEntity,
            );
            for (const enrollment of childEnrollments) {
                if (
                    enrollment.syncStatus === "draft" ||
                    enrollment.syncStatus === "pending"
                ) {
                    const tx = getEnrollmentsCollection().delete(
                        enrollment.enrollment,
                    );
                    await tx.isPersisted.promise;
                } else {
                    const tx = getEnrollmentsCollection().update(
                        enrollment.enrollment,
                        (d) => {
                            d.syncStatus = "deleted";
                        },
                    );
                    await tx.isPersisted.promise;
                }
            }
            // Clean up the child TE itself
            if (
                childTE.syncStatus === "draft" ||
                childTE.syncStatus === "pending"
            ) {
                const tx = getTrackedEntitiesCollection().delete(
                    childTE.trackedEntity,
                );
                await tx.isPersisted.promise;
            } else {
                const tx = getTrackedEntitiesCollection().update(
                    childTE.trackedEntity,
                    (d) => {
                        d.syncStatus = "deleted";
                    },
                );
                await tx.isPersisted.promise;
            }
        }

        // 3. Now handle this event itself (after its children are processed).
        // indicator_evaluations cleanup happens automatically inside
        // eventsRowAdapter.deleteRow — no separate call needed here.
        if (event.syncStatus === "draft" || event.syncStatus === "pending") {
            const tx = getEventsCollection().delete(event.event);
            await tx.isPersisted.promise;
        } else {
            const tx = getEventsCollection().update(event.event, (d) => {
                d.syncStatus = "deleted";
            });
            await tx.isPersisted.promise;
            markedDeleted.push({ ...event, syncStatus: "deleted" });
        }
    }

    await processEvent(rootEvent);
    return { markedDeleted };
}

/**
 * Resends a visit (main event) together with every non-deleted child event
 * under it (recursively, via `parentEvent`) — flips each already-`synced`
 * or `failed` event's `syncStatus` back to `pending` with its values
 * otherwise unchanged, so the next `processBatchSync` sweep re-POSTs the
 * same payload. `draft`/`pending`/`editing` events are left alone (either
 * mid-edit, not ready to submit, or already queued).
 */
export async function resendEventWithChildren(
    eventId: string,
): Promise<{ resent: FlattenedEvent[] }> {
    const resent: FlattenedEvent[] = [];

    const rootEvent = await getEventById(eventId);
    if (!rootEvent) return { resent };

    async function processEvent(event: FlattenedEvent): Promise<void> {
        const directChildEvents = await findEventsByParentEvent(event.event);
        for (const child of directChildEvents) {
            await processEvent(child);
        }

        if (event.syncStatus === "deleted" || event.deleted) return;
        if (event.syncStatus === "synced" || event.syncStatus === "failed") {
            const tx = getEventsCollection().update(event.event, (d) => {
                d.syncStatus = "pending";
            });
            await tx.isPersisted.promise;
            resent.push({ ...event, syncStatus: "pending" });
        }
    }

    await processEvent(rootEvent);
    return { resent };
}

export async function deleteTrackedEntityWithChildren(
    trackedEntityId: string,
): Promise<{ needsSync: boolean }> {
    const rootTE = await getTrackedEntityById(trackedEntityId);
    if (!rootTE) return { needsSync: false };

    let needsSync = false;

    const allEvents = await findEventsByTrackedEntity(trackedEntityId);

    for (const event of allEvents) {
        if (event.syncStatus === "draft" || event.syncStatus === "pending") {
            // indicator_evaluations cleanup happens automatically inside
            // eventsRowAdapter.deleteRow.
            await getEventsCollection().delete(event.event).isPersisted
                .promise;
        } else {
            await getEventsCollection().update(event.event, (d) => {
                d.syncStatus = "deleted";
            }).isPersisted.promise;
            needsSync = true;
        }
    }

    const enrollments = await findEnrollmentsByTrackedEntity(trackedEntityId);

    for (const enrollment of enrollments) {
        if (
            enrollment.syncStatus === "draft" ||
            enrollment.syncStatus === "pending"
        ) {
            await getEnrollmentsCollection().delete(enrollment.enrollment)
                .isPersisted.promise;
        } else {
            await getEnrollmentsCollection().update(
                enrollment.enrollment,
                (d) => {
                    d.syncStatus = "deleted";
                },
            ).isPersisted.promise;
            needsSync = true;
        }
    }

    if (rootTE.syncStatus === "draft" || rootTE.syncStatus === "pending") {
        await getTrackedEntitiesCollection().delete(trackedEntityId)
            .isPersisted.promise;
    } else {
        await getTrackedEntitiesCollection().update(trackedEntityId, (d) => {
            d.syncStatus = "deleted";
        }).isPersisted.promise;
        needsSync = true;
    }

    return { needsSync };
}

/**
 * Handles cancel for a DataModal.
 *
 * New record (syncStatus === "draft"):
 *   - Deletes the root record (and its enrollment if it's a TrackedEntity)
 *   - Recursively deletes all draft children
 *
 * Existing record (syncStatus !== "draft"):
 *   - Restores the record to its pre-edit snapshot via insertLocally
 *   - Recursively deletes any draft children created during the session
 *
 * The `data` argument must be the snapshot captured at openModal() time
 * (i.e. the value stored in useModalState's React state).
 */
export async function cancelDataModal(
    data: FlattenedEvent | FlattenedTrackedEntity,
): Promise<void> {
    if ("event" in data) {
        // FlattenedEvent branch
        if (data.syncStatus === "draft") {
            // Loads it, if no query has: the collection deletes loaded rows.
            if (await getEventById(data.event)) {
                const tx = getEventsCollection().delete(data.event);
                await tx.isPersisted.promise;
            }
        } else {
            await getEventsCollection().utils.insertLocally(data);
        }
        await deleteRecursiveDraftSubtree(data.event, undefined);
    } else if ("trackedEntityType" in data) {
        // FlattenedTrackedEntity branch
        if (data.syncStatus === "draft") {
            // Loads it, if no query has: the collection deletes loaded rows.
            if (await getTrackedEntityById(data.trackedEntity)) {
                const tx = getTrackedEntitiesCollection().delete(
                    data.trackedEntity,
                );
                await tx.isPersisted.promise;
            }
            // Delete the linked enrollment (guard: enrollment may not exist)
            const [enrollment] = await findEnrollmentsByTrackedEntity(
                data.trackedEntity,
            );
            if (enrollment) {
                const etx = getEnrollmentsCollection().delete(
                    enrollment.enrollment,
                );
                await etx.isPersisted.promise;
            }
        } else {
            await getTrackedEntitiesCollection().utils.insertLocally(data);
        }
        await deleteRecursiveDraftSubtree(undefined, data.trackedEntity);
    }
}
