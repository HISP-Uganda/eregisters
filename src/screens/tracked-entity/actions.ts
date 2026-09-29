import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "@/db/collections";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "@/schemas";
import { collectParentSaveCascade } from "@/utils/parent-save-cascade";
import {
    deleteEventWithChildren,
    deleteTrackedEntityWithChildren,
    resendEventWithChildren,
} from "@/utils/record-cascades";
import { createEmptyEvent } from "@/utils/record-factories";
import { MAIN_STAGE } from "./client";

/** What the client page writes. `pushData` starts a push to DHIS2. */

export async function createVisit(
    trackedEntity: FlattenedTrackedEntity,
    enrollment: FlattenedEnrollment,
): Promise<FlattenedEvent> {
    const newEvent = createEmptyEvent({
        trackedEntity: trackedEntity.trackedEntity,
        program: enrollment.program,
        orgUnit: enrollment.orgUnit,
        enrollment: enrollment.enrollment,
        programStage: MAIN_STAGE,
    });
    const tx = getEventsCollection().insert(newEvent);
    await tx.isPersisted.promise;
    return newEvent;
}

/**
 * Saves a visit and marks it, with the child events, children and their
 * enrollments that go with it (`collectParentSaveCascade`), as pending.
 */
export async function saveVisit(
    visit: FlattenedEvent,
    values: Record<string, any>,
    trackedEntity: FlattenedTrackedEntity,
) {
    const trackedEntitiesCollection = getTrackedEntitiesCollection();
    const enrollmentsCollection = getEnrollmentsCollection();
    const eventsCollection = getEventsCollection();

    // Backend-agnostic local lookups — both backends' collections already
    // hold this device's full local dataset in memory for their live
    // queries, so filtering `.toArray` here needs no SQL-only row-adapter
    // (same pattern as record-cascades.ts).
    const candidateTrackedEntities = trackedEntitiesCollection.toArray.filter(
        (te) => te.parentEntity === trackedEntity.trackedEntity,
    );
    const candidateChildTrackedEntityIds = candidateTrackedEntities.map(
        (te) => te.trackedEntity,
    );
    const eventsByParent = eventsCollection.toArray.filter(
        (event) => event.parentEvent === visit.event,
    );
    const eventsByChildTE = eventsCollection.toArray.filter((event) =>
        candidateChildTrackedEntityIds.includes(event.trackedEntity),
    );
    const candidateEvents = [
        ...new Map(
            [...eventsByParent, ...eventsByChildTE].map((event) => [
                event.event,
                event,
            ]),
        ).values(),
    ];
    const candidateEnrollments = enrollmentsCollection.toArray.filter(
        (enrollmentRow) =>
            candidateChildTrackedEntityIds.includes(enrollmentRow.trackedEntity),
    );

    const {
        events: relatedEvents,
        trackedEntities: relatedTrackedEntities,
        enrollments: relatedEnrollments,
    } = collectParentSaveCascade({
        parentEvent: visit,
        parentTrackedEntity: trackedEntity,
        events: candidateEvents,
        trackedEntities: candidateTrackedEntities,
        enrollments: candidateEnrollments,
    });

    const entities: Array<
        FlattenedEvent | FlattenedTrackedEntity | FlattenedEnrollment
    > = [
        { ...visit, dataValues: { ...visit.dataValues, ...values } },
        ...relatedEvents,
        ...relatedTrackedEntities,
        ...relatedEnrollments,
    ].map((a) => ({ ...a, syncStatus: "pending" }));

    await Promise.all(
        entities.flatMap((a) => {
            if ("trackedEntityType" in a) {
                return trackedEntitiesCollection.update(a.trackedEntity, (draft) => {
                    draft.syncStatus = a.syncStatus;
                }).isPersisted.promise;
            } else if ("enrolledAt" in a) {
                return enrollmentsCollection.update(a.enrollment, (draft) => {
                    draft.syncStatus = a.syncStatus;
                }).isPersisted.promise;
            } else if ("event" in a) {
                return eventsCollection.update(a.event, (draft) => {
                    draft.syncStatus = a.syncStatus;
                }).isPersisted.promise;
            }
            return [];
        }),
    );
}

/** Saves the client's attributes, and the enrollment date when it was edited. */
export async function saveClient(
    client: FlattenedTrackedEntity,
    values: Record<string, any>,
    enrollment: FlattenedEnrollment,
) {
    const { enrolledAt, ...attributeValues } = values;
    const attributes = { ...client.attributes, ...attributeValues };

    await getTrackedEntitiesCollection().update(client.trackedEntity, (draft) => {
        draft.attributes = attributes;
        draft.syncStatus = "pending";
    }).isPersisted.promise;

    if (enrolledAt) {
        await getEnrollmentsCollection().update(enrollment.enrollment, (draft) => {
            draft.enrolledAt = enrolledAt;
            draft.occurredAt = enrolledAt;
            draft.syncStatus = "pending";
            draft.attributes = attributes;
        }).isPersisted.promise;
    }
}

export async function resendVisit(event: string, pushData: () => void) {
    try {
        const { resent } = await resendEventWithChildren(event);
        if (resent.length > 0) pushData();
    } catch (error) {
        console.error("Failed to resend event:", error);
    }
}

export async function deleteVisit(event: string, pushData: () => void) {
    try {
        const { markedDeleted } = await deleteEventWithChildren(event);
        if (markedDeleted.length > 0) pushData();
    } catch (error) {
        console.error("Failed to delete event:", error);
    }
}

/** Resolves true once the client is deleted locally. */
export async function deleteClient(
    trackedEntity: string,
    pushData: () => void,
): Promise<boolean> {
    try {
        const { needsSync } = await deleteTrackedEntityWithChildren(trackedEntity);
        if (needsSync) pushData();
        return true;
    } catch (error) {
        console.error("Failed to delete client:", error);
        return false;
    }
}
