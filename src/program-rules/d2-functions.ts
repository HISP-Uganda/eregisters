import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { zScoreBMIFA, zScoreHFA, zScoreWFA, zScoreWFH } from "@/utils/who-zscore";
import { VariableValues } from "./variables";
import type { HistoryValue, RuleEnvironment, VariableHistory } from "./history";
import { extractDataMatrixValue } from "./data-matrix";

/** Arguments these functions take as a variable's name, not its value. */
export const TAKES_VARIABLE_NAME = [
    "hasValue",
    "count",
    "countIfValue",
    "countIfZeroPos",
    "maxValue", "minValue", "lastEventDate", "countIfCondition",
];

const isSet = (value: unknown) =>
    value !== null && value !== undefined && value !== "";

const dhis2Sex = (sex: unknown): "Male" | "Female" =>
    sex === 0 || sex === false || ["male", "ma", "m", "boy"].includes(String(sex).toLowerCase())
        ? "Male" : "Female";

const hasSetValue = (values: Record<string, any> | undefined, id: string) =>
    !isEmpty(values) && values!.hasOwnProperty(id) && isSet(values![id]);

/** The `d2:` functions rule expressions call, bound to one form's values. */
export function createD2Functions(
    variableValues: VariableValues,
    dataValues: Record<string, any> | undefined,
    attributeValues: Record<string, any> | undefined,
    context: RuleEnvironment & { variableHistory?: VariableHistory; enrollmentVariableHistory?: VariableHistory; currentEventId?: string; orgUnit?: string } = {},
) {
    const history = (name: string): HistoryValue[] => context.variableHistory?.[name] ??
        (isSet(variableValues[name]) ? [{ value: variableValues[name] }] : []);
    const numbers = (entries: HistoryValue[]) => entries.map(({ value }) => value)
        .filter((value) => isSet(value) && typeof value !== "boolean" && Number.isFinite(Number(value)))
        .map(Number);
    const numeric = (name: string) => numbers(history(name));
    const extrema = (name: string) => numbers(context.enrollmentVariableHistory?.[name] ?? history(name));
    return {
        extractDataMatrixValue,
        hasUserRole: (id: string): boolean => context.userRoleIds?.includes(id) ?? false,
        inUserGroup: (id: string): boolean => context.userGroupIds?.includes(id) ?? false,
        maxValue: (name: string): number | null => extrema(name).length ? Math.max(...extrema(name)) : null,
        minValue: (name: string): number | null => extrema(name).length ? Math.min(...extrema(name)) : null,
        lastEventDate: (name: string): string => history(name)
            .filter((entry) => entry.occurredAt).at(-1)?.occurredAt ?? "",
        hasValue: (varName: string): boolean => isSet(variableValues[varName]),

        contains: (text: string, ...substrings: string[]): boolean => {
            if (text === null || text === undefined) return false;
            return substrings.every((substring) => String(text).includes(String(substring)));
        },

        /** Every requested item must exactly match a comma-separated value. */
        containsItems: (text: string | null | undefined, ...items: string[]): boolean => {
            if (text === null || text === undefined || text === "") return false;
            const values = String(text).split(",");
            return items.length > 0 && items.every((item) => values.includes(item));
        },

        startsWith: (text: string, prefix: string): boolean => {
            if (text === null || text === undefined) return false;
            return String(text).startsWith(String(prefix));
        },

        endsWith: (text: string, suffix: string): boolean => {
            if (text === null || text === undefined) return false;
            return String(text).endsWith(String(suffix));
        },

        countIfValue: (varName: string, valueToCompare: any): number =>
            history(varName).filter(({ value }) => value === valueToCompare).length,

        countIfZeroPos: (varName: string): number => {
            return numeric(varName).filter((value) => value >= 0).length;
        },

        validatePattern: (value: string, pattern: string): boolean => {
            try {
                const anchoredPattern = `^(?:${pattern})$`;
                return new RegExp(anchoredPattern).test(String(value));
            } catch {
                return false;
            }
        },

        left: (text: string, numChars: number): string =>
            String(text).substring(0, numChars),

        right: (text: string, numChars: number): string => {
            const str = String(text);
            return str.substring(str.length - numChars);
        },

        substring: (text: string, start: number, end: number): string =>
            String(text).substring(start, end),

        split: (text: string, delimiter: string, index: number): string =>
            String(text).split(delimiter)[index] || "",

        length: (text: string): number => String(text).length,

        concatenate: (...args: any[]): string =>
            args.map((a) => String(a)).join(""),

        daysBetween: (date1: string, date2: string): number =>
            dayjs(date2).diff(dayjs(date1), "days"),

        weeksBetween: (date1: string, date2: string): number =>
            dayjs(date2).diff(dayjs(date1), "weeks"),

        monthsBetween: (date1: string, date2: string): number =>
            dayjs(date2).diff(dayjs(date1), "months"),

        yearsBetween: (date1: string, date2: string): number =>
            dayjs(date2).diff(dayjs(date1), "years"),

        addDays: (date: string, days: number): string =>
            dayjs(date).add(days, "days").format("YYYY-MM-DD"),

        floor: (value: number): number => Math.floor(Number(value)),

        ceil: (value: number): number => Math.ceil(Number(value)),

        round: (value: number, decimals?: number): number => {
            const num = Number(value);
            if (decimals === undefined || decimals === 0) {
                return Math.round(num);
            }
            const multiplier = Math.pow(10, decimals);
            return Math.round(num * multiplier) / multiplier;
        },

        modulus: (dividend: number, divisor: number): number =>
            Number(dividend) % Number(divisor),

        zing: (value: number): number => Math.max(0, Number(value)),

        oizp: (value: number): number => (Number(value) >= 0 ? 1 : 0),

        zpvc: (...values: number[]): number => {
            let sum = 0;
            for (const val of values) {
                const num = Number(val);
                if (isSet(val) && typeof val !== "boolean" && !isNaN(num) && num >= 0) {
                    sum++;
                }
            }
            return sum;
        },

        condition: (condition: boolean, trueValue: any, falseValue: any): any =>
            condition ? trueValue : falseValue,

        count: (varName: string): number =>
            history(varName).length,

        countIfCondition: (name: string | boolean, condition?: string): number => {
            if (typeof name === "boolean") return name ? 1 : 0;
            const match = condition?.match(/^\s*(<=|>=|==|!=|<|>)\s*(-?\d+(?:\.\d+)?)\s*$/);
            if (!match) return 0;
            const target = Number(match[2]);
            return numeric(name).filter((value) => {
                switch (match[1]) {
                    case "<": return value < target;
                    case ">": return value > target;
                    case "<=": return value <= target;
                    case ">=": return value >= target;
                    case "==": return value === target;
                    default: return value !== target;
                }
            }).length;
        },

        hasDataValue: (dataElementId: string): boolean =>
            hasSetValue(dataValues, dataElementId) ||
            hasSetValue(attributeValues, dataElementId),

        inOrgUnitGroup: (group: string): boolean =>
            (context.organisationUnitGroups?.[context.orgUnit ?? ""] ?? [])
                .some(({ id, code }) => id === group || code === group),

        // WHO z-scores
        zScoreWFA: (ageMonths: number, weightKg: number, sex: any): number | null =>
            zScoreWFA(ageMonths, weightKg, dhis2Sex(sex)),

        zScoreHFA: (ageMonths: number, heightCm: number, sex: any): number | null =>
            zScoreHFA(ageMonths, heightCm, dhis2Sex(sex)),

        zScoreWFH: (heightCm: number, weightKg: number, sex: any): number | null =>
            zScoreWFH(heightCm, weightKg, dhis2Sex(sex)),

        zScoreBMIFA: (ageMonths: number, bmi: number, sex: any): number | null =>
            zScoreBMIFA(ageMonths, bmi, dhis2Sex(sex)),
    };
}

export type D2Functions = ReturnType<typeof createD2Functions>;
