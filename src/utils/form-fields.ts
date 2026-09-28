import { FormItemProps } from "antd";
import dayjs from "dayjs";
import { Program, ProgramStage } from "../schemas";

const GRID_TOTAL = 24;

export const isDate = (valueType: string | undefined) => {
    return ["DATE", "DATETIME", "TIME"].includes(valueType || "");
};

export const createNormalize = (valueType: string | undefined) => {
    const normalize: FormItemProps["normalize"] = (value) => {
        if (valueType === "DATETIME" && dayjs.isDayjs(value)) {
            return value.format("YYYY-MM-DDTHH:mm:ss");
        } else if (valueType === "DATE" && dayjs.isDayjs(value)) {
            return value.format("YYYY-MM-DD");
        } else if (valueType === "TIME" && dayjs.isDayjs(value)) {
            return value.format("HH:mm:ss");
        } else if (valueType === "AGE" && dayjs.isDayjs(value)) {
            return value.format("YYYY-MM-DD");
        } else if (value && valueType === "MULTI_TEXT") {
            return Array.isArray(value) ? value.join(",") : value;
        }
        return value;
    };
    return normalize;
};

export const createGetValueProps = (valueType: string | undefined) => {
    const getValueProps: FormItemProps["getValueProps"] = (value) => {
        if (isDate(valueType)) {
            return {
                value: value ? dayjs(value) : null,
            };
        }
        if (valueType === "AGE") {
            return {
                value: value ? dayjs(value) : null,
            };
        }
        if (valueType === "MULTI_TEXT") {
            if (typeof value === "string") {
                return {
                    value: value ? value.split(",").filter(Boolean) : [],
                };
            }
            if (Array.isArray(value)) {
                return { value };
            }
            return { value: [] };
        }
        return { value };
    };
    return getValueProps;
};

export function calculateColSpan(
    fieldCount: number,
    preferredColSpan: number,
): number {
    if (fieldCount <= 0) return preferredColSpan;
    const maxColsByPreference = GRID_TOTAL / preferredColSpan;
    const actualCols = Math.min(fieldCount, maxColsByPreference);
    return Math.floor(GRID_TOTAL / actualCols);
}

/** Single source of truth for the vertical/horizontal gap between form
 * field rows (antd `Row`'s `gutter` prop) — used by subsection-groups.tsx,
 * main-event-capture.tsx, and tracker-registration.tsx so all capture
 * forms stay visually consistent and the spacing only needs changing in
 * one place. */
export const FORM_ROW_GUTTER: [number, number] = [16, 16];

export const spans = new Map<string, number>([
    ["XjgpfkoxffK", 5],
    ["W87HAtUHJjB", 5],
    ["PKuyTiVCR89", 5],
    ["oTI0DLitzFY", 9],
]);

export function buildCurrentDataElements(programStage: ProgramStage) {
    return new Map(
        programStage.programStageDataElements.map((psde) => [
            psde.dataElement.id,
            {
                allowFutureDate: psde.allowFutureDate,
                renderOptionsAsRadio: psde.renderType !== undefined,
                compulsory: psde.compulsory,
                desktopRenderType: psde.renderType?.DESKTOP?.type,
            },
        ]),
    );
}

export function buildCurrentAttributes(program: Program) {
    return new Map(
        program.programTrackedEntityAttributes.map((ptea) => [
            ptea.trackedEntityAttribute.id,
            {
                allowFutureDate: ptea.allowFutureDate,
                renderOptionsAsRadio: ptea.renderType !== undefined,
                compulsory: ptea.mandatory,
                desktopRenderType: ptea.renderType?.DESKTOP?.type,
            },
        ]),
    );
}
