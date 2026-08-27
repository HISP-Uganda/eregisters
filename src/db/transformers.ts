import type {
    FlattenedEvent,
    FlattenedEnrollment,
    FlattenedTrackedEntity,
} from "../schemas";

/**
 * Shared DHIS2 transformation utilities
 *
 * These functions convert flattened local data structures into DHIS2 API format.
 * Used by both sync systems to ensure consistent data transformation.
 */

/**
 * Transform a tracked entity from local format to DHIS2 API format
 * Converts flat attributes object to array of {attribute, value} objects
 * Handles parent entity relationship via FhyNxUVOpjh attribute
 */
/**
 * A value passes optionSet validation when the field has no registered
 * optionSet (nothing to check against), or every code in the value matches
 * one of the optionSet's option codes.
 */
function hasValidOptionCodes(
    fieldId: string,
    value: string,
    optionCodesByField?: Map<string, Set<string>>,
): boolean {
    const validCodes = optionCodesByField?.get(fieldId);
    if (!validCodes) return true;
    return value.split(",").every((code) => validCodes.has(code));
}

export function transformTrackedEntity(
    te: FlattenedTrackedEntity,
    validAttributeIds?: Set<string>,
    optionCodesByAttribute?: Map<string, Set<string>>,
) {
    const { attributes, ...rest } = te;
    const { enrolledAt, ...teAttributes } = attributes;

    const finalAttributes = te.parentEntity
        ? { ...teAttributes, FhyNxUVOpjh: te.parentEntity }
        : teAttributes;

    return {
        ...rest,
        attributes: Object.entries(finalAttributes).flatMap(
            ([attribute, value]: [string, any]) => {
                if (validAttributeIds?.size && !validAttributeIds.has(attribute))
                    return [];
                if (value !== undefined && value !== null && value !== "") {
                    const stringValue = String(value);
                    if (
                        !hasValidOptionCodes(
                            attribute,
                            stringValue,
                            optionCodesByAttribute,
                        )
                    )
                        return [];
                    return { attribute, value: stringValue };
                }
                return [];
            },
        ),
    };
}
export function transformEnrollment(
    enrollment: FlattenedEnrollment,
    validAttributeIds?: Set<string>,
    optionCodesByAttribute?: Map<string, Set<string>>,
) {
    const { attributes, ...rest } = enrollment;
    const { enrolledAt, ...enrollmentAttributes } = attributes;

    return {
        ...rest,
        enrolledAt: enrolledAt || rest.enrolledAt,
        attributes: Object.entries(enrollmentAttributes).flatMap(
            ([attribute, value]: [string, any]) => {
                if (validAttributeIds?.size && !validAttributeIds.has(attribute))
                    return [];
                if (value !== undefined && value !== null && value !== "") {
                    const stringValue = String(value);
                    if (
                        !hasValidOptionCodes(
                            attribute,
                            stringValue,
                            optionCodesByAttribute,
                        )
                    )
                        return [];
                    return { attribute, value: stringValue };
                }
                return [];
            },
        ),
    };
}

export function transformEvent(
    event: FlattenedEvent,
    validDataElementIds?: Set<string>,
    optionCodesByDataElement?: Map<string, Set<string>>,
) {
    const { dataValues, ...eventRest } = event;
    const { occurredAt, ...otherDataElements } = dataValues;

    let finalDataValues: Record<string, any> = otherDataElements;

    if (event.parentEvent) {
        finalDataValues = {
            ...finalDataValues,
            Wx7x4sMAa62: event.parentEvent,
        };
    }

    return {
        ...eventRest,
        dataValues: Object.entries(finalDataValues).flatMap(
            ([dataElement, value]: [string, any]) => {
                if (validDataElementIds?.size && !validDataElementIds.has(dataElement))
                    return [];
                if (value !== undefined && value !== null && value !== "") {
                    const outValue = Array.isArray(value)
                        ? value.join(",")
                        : value;
                    if (
                        !hasValidOptionCodes(
                            dataElement,
                            String(outValue),
                            optionCodesByDataElement,
                        )
                    )
                        return [];
                    return { dataElement, value: outValue };
                }
                return [];
            },
        ),
        occurredAt: occurredAt || eventRest.occurredAt,
    };
}
