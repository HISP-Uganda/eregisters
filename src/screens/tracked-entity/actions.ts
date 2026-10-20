import { applyRuleValues, assertRuleSaveAllowed, captureEventStatus, evaluateEventForSave, type RuleSaveMetadata } from "@/program-rules/save-actions";
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
import type { ProgramRuleResult } from "@/schemas";
import { commitEnrollmentRuleActions, commitRuleEventActions } from "@/program-rules/commit-actions";
import { MAIN_STAGE } from "./client";

/** What the client page writes. `pushData` starts a push to DHIS2. */

export async function createVisit(
    trackedEntity: FlattenedTrackedEntity,
    enrollment: FlattenedEnrollment,
    blockedStages: string[] = [],
): Promise<FlattenedEvent> {
    if (blockedStages.includes(MAIN_STAGE)) throw new Error("Program rules prevent adding visits.");
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
    ruleResult?: ProgramRuleResult | null,
    complete = false,
    ruleMetadata?: RuleSaveMetadata,
) {
    assertRuleSaveAllowed(ruleResult, complete);
    const trackedEntitiesCollection = getTrackedEntitiesCollection();
    const enrollmentsCollection = getEnrollmentsCollection();
    const eventsCollection = getEventsCollection();
    const currentVisit = { ...visit, dataValues: { ...visit.dataValues, ...values } };
    const childIds = new Set(trackedEntitiesCollection.toArray.filter((tei) => tei.parentEntity === trackedEntity.trackedEntity).map((tei) => tei.trackedEntity));
    const pending = [currentVisit, ...eventsCollection.toArray.filter((event) => event.event !== visit.event && event.syncStatus !== "synced" && event.syncStatus !== "deleted" && !event.deleted && (event.parentEvent === visit.event || childIds.has(event.trackedEntity))).map((event) => ({ ...event, dataValues: { ...event.dataValues } }))];
    const evaluated = new Map<string, ProgramRuleResult>();
    const history = new Map<string, FlattenedEvent>(eventsCollection.toArray.map((event) => [event.event, event]));
    history.set(currentVisit.event, currentVisit);
    if (ruleMetadata) {
        for (const event of pending) {
            if (event.status === "SCHEDULE" && !event.dataValues.occurredAt) continue;
            const attributes = event.trackedEntity === trackedEntity.trackedEntity ? trackedEntity.attributes : trackedEntitiesCollection.get(event.trackedEntity)?.attributes ?? {};
            const result = evaluateEventForSave(event, ruleMetadata, attributes, [...history.values()]);
            assertRuleSaveAllowed(result, event.event === visit.event ? complete : event.status === "COMPLETED");
            evaluated.set(event.event, result);
            event.dataValues = applyRuleValues(event.dataValues, result);
            history.set(event.event, event);
        }
    }
    await eventsCollection.update(visit.event, (draft) => {
        draft.dataValues = applyRuleValues(currentVisit.dataValues, evaluated.get(visit.event) ?? ruleResult);
        draft.status = captureEventStatus(draft.status, draft.dataValues, complete);
        if (draft.dataValues.occurredAt) draft.occurredAt = draft.dataValues.occurredAt;
        if (complete) {
            draft.status = "COMPLETED";
            draft.completedAt = new Date().toISOString();
        }
    }).isPersisted.promise;
    await commitRuleEventActions(currentVisit, evaluated.get(visit.event) ?? ruleResult);
    for (const event of pending.filter((event) => event.event !== visit.event)) {
        if (evaluated.has(event.event)) {
            await eventsCollection.update(event.event, (draft) => {
                draft.dataValues = event.dataValues;
                draft.status = captureEventStatus(draft.status, draft.dataValues);
                if (draft.dataValues.occurredAt) draft.occurredAt = draft.dataValues.occurredAt;
            }).isPersisted.promise;
        }
        await commitRuleEventActions(event, evaluated.get(event.event));
    }

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
    ruleResult?: ProgramRuleResult | null,
    complete = false,
) {
    assertRuleSaveAllowed(ruleResult, complete);
    const { enrolledAt, ...attributeValues } = values;
    const attributes = { ...client.attributes, ...attributeValues };

    await getTrackedEntitiesCollection().update(client.trackedEntity, (draft) => {
        draft.attributes = attributes;
        draft.syncStatus = "pending";
    }).isPersisted.promise;

    if (enrolledAt || complete) {
        await getEnrollmentsCollection().update(enrollment.enrollment, (draft) => {
            if (enrolledAt) { draft.enrolledAt = enrolledAt; draft.occurredAt = enrolledAt; }
            if (complete) draft.status = "COMPLETED";
            draft.syncStatus = "pending";
            draft.attributes = attributes;
        }).isPersisted.promise;
    }
    await commitEnrollmentRuleActions(enrollment, { enrolledAt: enrollment.attributes.enrolledAt ?? enrollment.enrolledAt, ...values }, ruleResult);
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
