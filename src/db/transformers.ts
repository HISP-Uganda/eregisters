import type {
    DataElement,
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedOptionSet,
    FlattenedTrackedEntity,
    TrackedEntityAttribute,
} from "../schemas";

/**
 * Shared DHIS2 transformation utilities
 *
 * These functions convert flattened local data structures into DHIS2 API format.
 * Used by both sync systems to ensure consistent data transformation.
 */

/**
 * Filters a (possibly multi-select, comma-joined) value down to just its
 * valid option codes, dropping any that no longer exist in the field's
 * optionSet — rather than discarding the whole value over one bad code.
 *
 * Looks the field up directly in the metadata maps already loaded into
 * sync context (`context.metadata.dataElements` / `.trackedEntityAttributes`
 * / `.optionSets`) rather than a separately-derived cache: the program's own
 * `programStageDataElements[].dataElement` / `programTrackedEntityAttributes[].trackedEntityAttribute`
 * references are id-only stubs (the metadata pull only fetches `dataElement[id]`
 * for them), so they never carry a real `optionSetValue`/`optionSet`.
 *
 * - Field not found, or not optionSet-backed: nothing to validate, `value`
 *   passes through unchanged.
 * - optionSet-backed but every code is invalid: returns `undefined`,
 *   telling the caller to drop the field entirely (no valid value left).
 * - Otherwise: returns just the valid codes, rejoined with commas.
 */
function filterValidOptionCodes(
    fieldId: string,
    value: string,
    fieldsById:
        | Map<
              string,
              Pick<
                  DataElement | TrackedEntityAttribute,
                  "optionSetValue" | "optionSet"
              >
          >
        | undefined,
    optionSets: Map<string, FlattenedOptionSet[]> | undefined,
): string | undefined {
    const field = fieldsById?.get(fieldId);
    if (!field?.optionSetValue || !field.optionSet) return value;

    const options = optionSets?.get(field.optionSet.id) ?? [];
    const validCodes = new Set(options.map((o) => o.code));
    const validTokens = value
        .split(",")
        .map((code) => code.trim())
        .filter((code) => code.length > 0 && validCodes.has(code));
    return validTokens.length > 0 ? validTokens.join(",") : undefined;
}

/**
 * Who made the record and when, as the tracker importer can take them —
 * wayfinder tickets "Which author fields does DHIS2 2.42's tracker importer
 * take from the payload?" / "Should records created on the device record
 * their author, and how is it sent to DHIS2?":
 *
 * - `storedBy`: the local author's username. DHIS2 2.42.0–2.42.5.x keep it
 *   on create (the eRegistry build is 2.42.5.1); 2.42.6+ replace it with
 *   the session user. Omitted for records with no known author — never
 *   guessed.
 * - `createdAtClient` / `updatedAtClient`: the record's own times. The
 *   importer rewrites both on every write and nulls any left out.
 *
 * `createdBy` / `updatedBy` are sent too (spread from the row) but the
 * importer always overwrites them with the session user.
 */
function authorFields(row: {
    createdBy?: { username?: string };
    createdAt?: string;
    updatedAt?: string;
}): { storedBy?: string; createdAtClient?: string; updatedAtClient?: string } {
    return {
        ...(row.createdBy?.username ? { storedBy: row.createdBy.username } : {}),
        ...(row.createdAt ? { createdAtClient: row.createdAt } : {}),
        ...(row.updatedAt ? { updatedAtClient: row.updatedAt } : {}),
    };
}

export function transformTrackedEntity(
    te: FlattenedTrackedEntity,
    validAttributeIds?: Set<string>,
    trackedEntityAttributes?: Map<string, TrackedEntityAttribute>,
    optionSets?: Map<string, FlattenedOptionSet[]>,
) {
    const { attributes, ...rest } = te;
    const { enrolledAt, ...teAttributes } = attributes;

    const finalAttributes = te.parentEntity
        ? { ...teAttributes, FhyNxUVOpjh: te.parentEntity }
        : teAttributes;

    return {
        ...rest,
        ...authorFields(te),
        attributes: Object.entries(finalAttributes).flatMap(
            ([attribute, value]: [string, any]) => {
                if (
                    validAttributeIds?.size &&
                    !validAttributeIds.has(attribute)
                )
                    return [];
                if (value !== undefined && value !== null && value !== "") {
                    const filtered = filterValidOptionCodes(
                        attribute,
                        String(value),
                        trackedEntityAttributes,
                        optionSets,
                    );
                    if (filtered === undefined) return [];
                    return { attribute, value: filtered };
                }
                return [];
            },
        ),
    };
}
export function transformEnrollment(
    enrollment: FlattenedEnrollment,
    validAttributeIds?: Set<string>,
    trackedEntityAttributes?: Map<string, TrackedEntityAttribute>,
    optionSets?: Map<string, FlattenedOptionSet[]>,
) {
    const { attributes, ...rest } = enrollment;
    const { enrolledAt, ...enrollmentAttributes } = attributes;

    return {
        ...rest,
        ...authorFields(enrollment),
        enrolledAt: enrolledAt || rest.enrolledAt,
        attributes: Object.entries(enrollmentAttributes).flatMap(
            ([attribute, value]: [string, any]) => {
                if (
                    validAttributeIds?.size &&
                    !validAttributeIds.has(attribute)
                )
                    return [];
                if (value !== undefined && value !== null && value !== "") {
                    const filtered = filterValidOptionCodes(
                        attribute,
                        String(value),
                        trackedEntityAttributes,
                        optionSets,
                    );
                    if (filtered === undefined) return [];
                    return { attribute, value: filtered };
                }
                return [];
            },
        ),
    };
}

export function transformEvent(
    event: FlattenedEvent,
    validDataElementIds?: Set<string>,
    dataElements?: Map<string, DataElement>,
    optionSets?: Map<string, FlattenedOptionSet[]>,
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
        ...authorFields(event),
        dataValues: Object.entries(finalDataValues).flatMap(
            ([dataElement, value]: [string, any]) => {
                if (
                    validDataElementIds?.size &&
                    !validDataElementIds.has(dataElement)
                )
                    return [];
                const isEmptyValue =
                    value === undefined ||
                    value === null ||
                    value === "" ||
                    (Array.isArray(value) && value.length === 0);
                if (!isEmptyValue) {
                    const outValue = Array.isArray(value)
                        ? value.join(",")
                        : value;
                    const filtered = filterValidOptionCodes(
                        dataElement,
                        String(outValue),
                        dataElements,
                        optionSets,
                    );
                    if (filtered === undefined) return [];
                    return { dataElement, value: filtered };
                }
                return [];
            },
        ),
        occurredAt: occurredAt || eventRest.occurredAt,
    };
}
