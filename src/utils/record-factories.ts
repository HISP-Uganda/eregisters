import dayjs from "dayjs";
import { FlattenedEnrollment, FlattenedEvent, FlattenedTrackedEntity } from "@/schemas";
import { generateUid } from "./id";
import { getLocalAuthor } from "@/db/local-author";

/**
 * The signed-in user as the new record's author — kept locally and sent as
 * `storedBy` (see `db/local-author.ts`). Omitted when unknown.
 */
function localAuthorship() {
    const author = getLocalAuthor();
    return author ? { createdBy: author, updatedBy: author } : {};
}

export const createEmptyTrackedEntity = ({
    orgUnit,
    attributes = {},
    parentEntity,
}: {
    orgUnit: string;
    attributes?: Record<string, any>;
    parentEntity?: string;
}): FlattenedTrackedEntity => {
    const trackedEntity = generateUid();
    return {
        orgUnit,
        attributes,
        trackedEntityType: "QG9qZrGHLzV",
        createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        updatedAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        deleted: false,
        inactive: false,
        potentialDuplicate: false,
        trackedEntity,
        lastSynced: "",
        syncError: "",
        syncStatus: "draft",
        version: 1,
        parentEntity,
        ...localAuthorship(),
    };
};

export const createEmptyEnrollment = ({
    orgUnit,
    trackedEntity,
    attributes = {},
}: {
    orgUnit: string;
    trackedEntity: string;
    attributes?: Record<string, string>;
}): FlattenedEnrollment => {
    return {
        createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        program: "ueBhWkWll5v",
        deleted: false,
        orgUnit,
        trackedEntity,
        enrollment: generateUid(),
        enrolledAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        occurredAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        status: "ACTIVE",
        updatedAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        followUp: false,
        lastSynced: "",
        syncError: "",
        syncStatus: "draft",
        version: 1,
        attributes,
        ...localAuthorship(),
    };
};

export const createEmptyEvent = ({
    orgUnit,
    program,
    trackedEntity,
    enrollment,
    programStage,
    parentEvent,
    dataValues = {},
    occurredAt,
}: {
    orgUnit: string;
    program: string;
    trackedEntity: string;
    enrollment: string;
    programStage: string;
    parentEvent?: string;
    dataValues?: Record<string, any>;
    occurredAt?: string;
}): FlattenedEvent => {
    const eventId = generateUid();
    const now = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    return {
        event: eventId,
        program,
        programStage,
        orgUnit,
        trackedEntity,
        enrollment,
        dataValues,
        status: "ACTIVE",
        occurredAt: dayjs(occurredAt).format("YYYY-MM-DD"),
        followUp: false,
        deleted: false,
        createdAt: now,
        updatedAt: now,
        lastSynced: "",
        syncError: "",
        syncStatus: "draft",
        version: 1,
        parentEvent,
        ...localAuthorship(),
    };
};
