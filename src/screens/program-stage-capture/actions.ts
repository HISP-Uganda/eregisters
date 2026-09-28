import { message } from "antd";
import { getEventsCollection } from "../../db/collections";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import { deleteEventWithChildren } from "../../utils/record-cascades";
import { createEmptyEvent } from "../../utils/record-factories";

/** What a visit's stage table writes. `pushData` starts a push to DHIS2. */

/** A new draft event of `programStage` under the visit, dated like it. */
export async function createStageEvent({
    trackedEntity,
    enrollment,
    programStage,
    visit,
}: {
    trackedEntity: FlattenedTrackedEntity;
    enrollment: FlattenedEnrollment;
    programStage: string;
    visit: FlattenedEvent;
}): Promise<FlattenedEvent> {
    const occurredAt = visit.dataValues["occurredAt"] || visit.occurredAt;
    const newEvent = createEmptyEvent({
        trackedEntity: trackedEntity.trackedEntity,
        program: enrollment.program,
        orgUnit: enrollment.orgUnit,
        enrollment: enrollment.enrollment,
        programStage,
        occurredAt,
        dataValues: { occurredAt },
        parentEvent: visit.event,
    });
    await getEventsCollection().insert(newEvent).isPersisted.promise;
    return newEvent;
}

/** Saves a whole event form (modal or inline-expand) as a draft under the visit. */
export async function saveStageEvent(
    event: string,
    values: Record<string, any>,
    visit: string,
) {
    await getEventsCollection().update(event, (draft) => {
        draft.dataValues = values;
        draft.syncStatus = "draft";
        draft.parentEvent = visit;
    }).isPersisted.promise;
}

/** Saves one cell of an inline-row event. */
export async function saveStageEventValue(
    event: string,
    dataElement: string,
    value: unknown,
) {
    await getEventsCollection().update(event, (draft) => {
        draft.dataValues[dataElement] = value;
        draft.syncStatus = "draft";
    }).isPersisted.promise;
}

/** Saves an inline-row event's date. */
export async function saveStageEventDate(event: string, value: unknown) {
    await getEventsCollection().update(event, (draft) => {
        draft.occurredAt = (value as string) ?? draft.occurredAt;
        draft.dataValues.occurredAt = value;
        draft.syncStatus = "draft";
    }).isPersisted.promise;
}

export async function deleteStageEvent(event: string, pushData: () => void) {
    try {
        const { markedDeleted } = await deleteEventWithChildren(event);
        if (markedDeleted.length > 0) pushData();
        message.success("Event deleted");
    } catch (error) {
        console.error("Failed to delete event:", error);
        message.error("Failed to delete event");
    }
}

/**
 * Re-dates events to their visit's date (after the visit date was edited),
 * so the table and the DHIS2 push agree with the visit. A synced event
 * goes back to draft.
 */
export function moveEventsToVisitDate(events: FlattenedEvent[], visitDate: string) {
    const eventsCollection = getEventsCollection();
    for (const event of events) {
        // Skip rows not yet committed to the collection — a live-query
        // result can briefly include an optimistic row before the write
        // lands. The caller's effect re-runs once the row is persisted.
        if (!eventsCollection.has(event.event)) continue;
        void eventsCollection
            .update(event.event, (draft) => {
                draft.occurredAt = visitDate;
                draft.dataValues.occurredAt = visitDate;
                if (draft.syncStatus === "synced") {
                    draft.syncStatus = "draft";
                }
            })
            .isPersisted.promise.catch((err) => {
                const text = err instanceof Error ? err.message : String(err);
                if (text.includes("not found in the collection")) return;
                console.error("Failed to cascade visit date to child event", event.event, err);
            });
    }
}
