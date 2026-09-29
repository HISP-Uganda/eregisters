import { Enrollment, Event, FlattenedEnrollment, FlattenedEvent, FlattenedTrackedEntity, TrackedEntity } from "@/schemas";

export const flattenEnrollment = ({
    attributes,
    events,
    ...otherDetails
}: Enrollment): FlattenedEnrollment => {
    const enrollmentAttrs = attributes.reduce<Record<string, any>>(
        (acc, attr) => {
            acc[attr.attribute] = attr.value;
            return acc;
        },
        {},
    );
    return {
        ...otherDetails,
        syncStatus: "synced",
        version: 1,
        lastSynced: new Date().toISOString(),
        syncError: "",
        attributes: enrollmentAttrs,
    };
};

export const flattenEvent = ({
    dataValues,
    occurredAt,
    ...otherEventDetails
}: Event): FlattenedEvent => {
    const eventAttrs = [
        ...dataValues,
        { dataElement: "occurredAt", value: occurredAt },
    ].reduce<Record<string, string>>((acc, dv) => {
        acc[dv.dataElement] = dv.value;
        return acc;
    }, {});
    return {
        ...otherEventDetails,
        dataValues: eventAttrs,
        syncStatus: "synced",
        version: 1,
        lastSynced: new Date().toISOString(),
        syncError: "",
        parentEvent: eventAttrs["Wx7x4sMAa62"],
        occurredAt,
    };
};

export const flattenTrackedEntity = ({
    attributes,
    enrollments,
    ...rest
}: TrackedEntity): FlattenedTrackedEntity => {
    const trackedEntityAttributes = attributes.reduce<Record<string, string>>(
        (acc, attr) => {
            acc[attr.attribute] = attr.value;
            return acc;
        },
        {},
    );

    return {
        ...rest,
        syncStatus: "synced",
        version: 1,
        lastSynced: new Date().toISOString(),
        syncError: "",
        parentEntity: trackedEntityAttributes["FhyNxUVOpjh"],
        attributes: trackedEntityAttributes,
    };
};
