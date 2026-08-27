import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../schemas";

export interface ParentSaveCascadeInput {
    parentEvent: FlattenedEvent;
    parentTrackedEntity: FlattenedTrackedEntity;
    events: FlattenedEvent[];
    trackedEntities: FlattenedTrackedEntity[];
    enrollments: FlattenedEnrollment[];
}

export interface ParentSaveCascade {
    events: FlattenedEvent[];
    trackedEntities: FlattenedTrackedEntity[];
    enrollments: FlattenedEnrollment[];
}

function notSynced<T extends { syncStatus: string }>(row: T): boolean {
    return row.syncStatus !== "synced";
}

export function collectParentSaveCascade({
    parentEvent,
    parentTrackedEntity,
    events,
    trackedEntities,
    enrollments,
}: ParentSaveCascadeInput): ParentSaveCascade {
    const childTrackedEntities = trackedEntities.filter(
        (te) =>
            te.parentEntity === parentTrackedEntity.trackedEntity &&
            notSynced(te),
    );
    const childTrackedEntityIds = new Set(
        childTrackedEntities.map((te) => te.trackedEntity),
    );

    return {
        events: events.filter(
            (event) =>
                event.event !== parentEvent.event &&
                notSynced(event) &&
                (event.parentEvent === parentEvent.event ||
                    childTrackedEntityIds.has(event.trackedEntity)),
        ),
        trackedEntities: childTrackedEntities,
        enrollments: enrollments.filter(
            (enrollment) =>
                childTrackedEntityIds.has(enrollment.trackedEntity) &&
                notSynced(enrollment),
        ),
    };
}
