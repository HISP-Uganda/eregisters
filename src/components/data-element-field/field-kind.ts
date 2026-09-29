import type { InputNumberProps } from "antd";
import { DataElement, RenderType, TrackedEntityAttribute } from "@/schemas";
import { isDate } from "@/utils/form-fields";

/** Which input a data element or attribute is entered with. */
export type FieldKind =
    | "village"
    | "multiSelect"
    | "radio"
    | "select"
    | "boolean"
    | "datetime"
    | "date"
    | "longText"
    | "number"
    | "text";

/** The village pickers (client, next of kin, …) — see `VILLAGE_FIELDS`. */
const VILLAGE_FIELD_IDS = ["oTI0DLitzFY", "pixScollYA6", "YoteNDkoIwM"];

/** Filled in by a village picker's cascade — not edited by hand. */
export const VILLAGE_CASCADED_FIELDS = new Set([
    "XjgpfkoxffK",
    "lpAaZa1cKCB",
    "sOBCVNIm1kX", // District
    "PKuyTiVCR89",
    "lqbqW3iYmKl",
    "qbxJxuZCyKu", // Subcounty
    "W87HAtUHJjB",
    "BiergDUeQra",
    "SjvgaRn8m7Y", // Parish
]);

const RADIO_RENDER_TYPES = ["VERTICAL_RADIOBUTTONS", "HORIZONTAL_RADIOBUTTONS"];

const zeroParser = (displayValue: string | undefined) => Number(displayValue?.replace(/[^0-9]/g, "")) || 0;

/** Numeric value types and their input's limits. */
export const NUMBER_INPUT_PROPS: Record<string, InputNumberProps> = {
    NUMBER: {},
    INTEGER: { precision: 0, parser: zeroParser },
    INTEGER_POSITIVE: { precision: 0, min: 1, parser: zeroParser },
    UNIT_INTERVAL: { min: 0, max: 1, step: 0.01 },
    INTEGER_ZERO_OR_POSITIVE: { min: 0, precision: 0 },
    PERCENTAGE: { min: 0, precision: 1, max: 100 },
};

export function fieldKind(
    dataElement: DataElement | TrackedEntityAttribute,
    desktopRenderType?: RenderType["type"],
): FieldKind {
    if (VILLAGE_FIELD_IDS.includes(dataElement.id)) return "village";
    if (dataElement.optionSetValue && dataElement.optionSet) {
        if (dataElement.valueType === "MULTI_TEXT") return "multiSelect";
        if (desktopRenderType && RADIO_RENDER_TYPES.includes(desktopRenderType)) return "radio";
        return "select";
    }
    if (dataElement.valueType === "BOOLEAN") return "boolean";
    if (dataElement.valueType === "DATETIME") return "datetime";
    if (isDate(dataElement.valueType)) return "date";
    if (dataElement.valueType === "LONG_TEXT") return "longText";
    if (dataElement.valueType in NUMBER_INPUT_PROPS) return "number";
    return "text";
}

/**
 * Whether the field takes the whole row: a radio group with more than 4
 * options wraps onto a second line in a shared-row column, and its extra
 * height leaves blank space under the fields beside it.
 */
export function takesFullRow(kind: FieldKind, optionCount: number): boolean {
    return kind === "radio" && optionCount > 4;
}
