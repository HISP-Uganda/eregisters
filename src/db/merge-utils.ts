import {
    FlattenedEvent,
    FlattenedTrackedEntity,
    FlattenedEnrollment,
} from "../schemas";

function mergeEvent(
    serverEvent: FlattenedEvent,
    localEvent: FlattenedEvent | undefined,
): FlattenedEvent {
    if (!localEvent) {
        return serverEvent;
    }
    return {
        ...localEvent,
        // Read-only DHIS2 audit fields — never set by anything local, so
        // the server's value always wins instead of being stuck at
        // whatever an older pull (before these fields were requested)
        // last stored, or missing entirely.
        createdBy: serverEvent.createdBy ?? localEvent.createdBy,
        updatedBy: serverEvent.updatedBy ?? localEvent.updatedBy,
        dataValues: {
            ...serverEvent.dataValues,
            ...localEvent.dataValues,
        },
    };
}

function mergeTrackedEntity(
    serverEntity: FlattenedTrackedEntity,
    localEntity: FlattenedTrackedEntity | undefined,
): FlattenedTrackedEntity {
    if (!localEntity) {
        return serverEntity;
    }
    return {
        ...localEntity,
        createdBy: serverEntity.createdBy ?? localEntity.createdBy,
        updatedBy: serverEntity.updatedBy ?? localEntity.updatedBy,
        attributes: {
            ...serverEntity.attributes,
            ...localEntity.attributes,
        },
    };
}

function mergeEnrollment(
    serverEnrollment: FlattenedEnrollment,
    localEnrollment: FlattenedEnrollment | undefined,
): FlattenedEnrollment {
    if (!localEnrollment) {
        return serverEnrollment;
    }
    return {
        ...localEnrollment,
        createdBy: serverEnrollment.createdBy ?? localEnrollment.createdBy,
        updatedBy: serverEnrollment.updatedBy ?? localEnrollment.updatedBy,
        attributes: {
            ...serverEnrollment.attributes,
            ...localEnrollment.attributes,
        },
    };
}

export async function mergeBulkEvents(
    serverEvents: FlattenedEvent[],
    getLocalEvent: (eventId: string) => Promise<FlattenedEvent | undefined>,
): Promise<FlattenedEvent[]> {
    return Promise.all(
        serverEvents.map(async (serverEvent) => {
            const localEvent = await getLocalEvent(serverEvent.event);
            return mergeEvent(serverEvent, localEvent);
        }),
    );
}

export async function mergeBulkTrackedEntities(
    serverEntities: FlattenedTrackedEntity[],
    getLocalEntity: (id: string) => Promise<FlattenedTrackedEntity | undefined>,
): Promise<FlattenedTrackedEntity[]> {
    return Promise.all(
        serverEntities.map(async (serverEntity) => {
            const localEntity = await getLocalEntity(
                serverEntity.trackedEntity,
            );
            return mergeTrackedEntity(serverEntity, localEntity);
        }),
    );
}

export async function mergeBulkEnrollments(
    serverEnrollments: FlattenedEnrollment[],
    getLocalEnrollment: (
        id: string,
    ) => Promise<FlattenedEnrollment | undefined>,
): Promise<FlattenedEnrollment[]> {
    return Promise.all(
        serverEnrollments.map(async (serverEnrollment) => {
            const localEnrollment = await getLocalEnrollment(
                serverEnrollment.enrollment,
            );
            return mergeEnrollment(serverEnrollment, localEnrollment);
        }),
    );
}
