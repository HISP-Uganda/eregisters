import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import {
    createEmptyEnrollment,
    createEmptyEvent,
    createEmptyTrackedEntity,
} from "../../utils/record-factories";

/**
 * A newborn registered from the mother's visit ("Live birth" answered):
 * which of the mother's attributes and visit values pre-fill the child.
 */

/** The visit's date of birth becomes the child's. */
const FROM_VISIT: Record<string, string> = {
    KJ2V2JlOxFi: "Y3DE5CZWySr",
};

/** Address attributes the child shares with the mother. */
const COPIED_FROM_MOTHER = ["XjgpfkoxffK", "W87HAtUHJjB", "PKuyTiVCR89", "oTI0DLitzFY"];

/** Child attributes built from the mother's (her name as next of kin, …). */
const JOINED_FROM_MOTHER: Record<string, string[]> = {
    P6Kp91wfCWy: ["KSq9EyZ8ZFi", "TWPNbc9O2nK"],
    ACgDjRCyX8r: ["hPGgzWsb14m"],
    b2cMfkY6M3h: ["b2x4gA14JsP"],
    lpAaZa1cKCB: ["XjgpfkoxffK"],
    lqbqW3iYmKl: ["PKuyTiVCR89"],
    BiergDUeQra: ["W87HAtUHJjB"],
    pixScollYA6: ["oTI0DLitzFY"],
    sOBCVNIm1kX: ["XjgpfkoxffK"],
    qbxJxuZCyKu: ["PKuyTiVCR89"],
    SjvgaRn8m7Y: ["W87HAtUHJjB"],
    YoteNDkoIwM: ["oTI0DLitzFY"],
};

/** The child's starting attributes, from the mother and her visit's values. */
export function newbornAttributes(
    mother: FlattenedTrackedEntity,
    visitValues: Record<string, any>,
): Record<string, any> {
    const attributes: Record<string, any> = {};
    const motherAttributes = mother.attributes ?? {};
    for (const id of COPIED_FROM_MOTHER) {
        if (motherAttributes[id]) attributes[id] = motherAttributes[id];
    }
    for (const [dataElement, attribute] of Object.entries(FROM_VISIT)) {
        let value = visitValues[dataElement];
        if (!value) continue;
        if (typeof value === "object" && "format" in value) {
            value = value.format("YYYY-MM-DD");
        }
        attributes[attribute] = value;
    }
    for (const [target, sources] of Object.entries(JOINED_FROM_MOTHER)) {
        const parts = sources.map((id) => motherAttributes[id] || "").filter((v) => v);
        if (parts.length > 0) attributes[target] = parts.join(" ");
    }
    return { ...attributes, enrolledAt: visitValues["occurredAt"] };
}

/** A new child and enrollment, linked to the mother, not yet saved. */
export function newbornFromMother(
    mother: FlattenedTrackedEntity,
    visitValues: Record<string, any>,
): { client: FlattenedTrackedEntity; enrollment: FlattenedEnrollment } {
    const client = createEmptyTrackedEntity({
        orgUnit: mother.orgUnit,
        attributes: newbornAttributes(mother, visitValues),
        parentEntity: mother.trackedEntity,
    });
    const enrollment = createEmptyEnrollment({
        orgUnit: mother.orgUnit,
        trackedEntity: client.trackedEntity,
    });
    return { client, enrollment };
}

/** The child's first visit: a newborn's child-health visit under the mother's. */
export function newbornFirstVisit(
    enrollment: FlattenedEnrollment,
    values: Record<string, any>,
    motherVisit: string,
): FlattenedEvent {
    return createEmptyEvent({
        trackedEntity: enrollment.trackedEntity,
        program: enrollment.program,
        orgUnit: enrollment.orgUnit,
        enrollment: enrollment.enrollment,
        programStage: "K2nxbE9ubSs",
        dataValues: {
            occurredAt: values["enrolledAt"] || values["occurredAt"],
            UuxHHVp5CnF: "Newborn",
            mrKZWf2WMIC: "Child Health Services",
        },
        parentEvent: motherVisit,
    });
}
