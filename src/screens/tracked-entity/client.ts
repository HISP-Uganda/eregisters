import dayjs, { Dayjs } from "dayjs";
import { isEmpty } from "lodash";
import { FlattenedEnrollment, FlattenedTrackedEntity } from "@/schemas";

/** The Medical Registers program and its main (visit) stage. */
export const PROGRAM = "ueBhWkWll5v";
export const MAIN_STAGE = "K2nxbE9ubSs";

const ATTRIBUTE = {
    firstName: "KSq9EyZ8ZFi",
    surname: "TWPNbc9O2nK",
    sex: "bqliZKdUGMX",
    dateOfBirth: "Y3DE5CZWySr",
};

/** What the page header shows about a client. */
export function clientSummary(trackedEntity: FlattenedTrackedEntity, today: Dayjs = dayjs()) {
    const attributes = trackedEntity.attributes ?? {};
    const dob = attributes[ATTRIBUTE.dateOfBirth];
    return {
        firstName: String(attributes[ATTRIBUTE.firstName] ?? ""),
        surname: String(attributes[ATTRIBUTE.surname] ?? ""),
        sex: String(attributes[ATTRIBUTE.sex] ?? ""),
        age: dob ? today.diff(dayjs(String(dob)), "year") : null,
    };
}

/**
 * The client as the edit form loads it: enrollment and client attributes
 * together (the client's win), plus the enrollment date.
 */
export function clientForEditing(
    trackedEntity: FlattenedTrackedEntity,
    enrollment: FlattenedEnrollment,
): FlattenedTrackedEntity {
    return {
        ...trackedEntity,
        attributes: {
            ...enrollment.attributes,
            ...trackedEntity.attributes,
            enrolledAt: enrollment.enrolledAt,
        },
    };
}

/** The profile panel's rows: every attribute with a value, labelled. */
export function profileEntries(
    trackedEntity: FlattenedTrackedEntity,
    enrollment: FlattenedEnrollment,
    labels: Map<string, string>,
) {
    return Object.entries({
        ...enrollment.attributes,
        ...trackedEntity.attributes,
    }).flatMap(([key, value]) =>
        isEmpty(value)
            ? []
            : [{ key, label: labels.get(key) || key, value: String(value) }],
    );
}
