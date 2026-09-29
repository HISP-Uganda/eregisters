import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { zScoreBMIFA, zScoreHFA, zScoreWFA, zScoreWFH } from "@/utils/who-zscore";
import { VariableValues } from "./variables";

/** Arguments these functions take as a variable's name, not its value. */
export const TAKES_VARIABLE_NAME = [
    "hasValue",
    "count",
    "countIfValue",
    "countIfZeroPos",
];

const isSet = (value: unknown) =>
    value !== null && value !== undefined && value !== "";

const hasSetValue = (values: Record<string, any> | undefined, id: string) =>
    !isEmpty(values) && values!.hasOwnProperty(id) && isSet(values![id]);

/** The `d2:` functions rule expressions call, bound to one form's values. */
export function createD2Functions(
    variableValues: VariableValues,
    dataValues: Record<string, any> | undefined,
    attributeValues: Record<string, any> | undefined,
) {
    return {
        hasValue: (varName: string): boolean => isSet(variableValues[varName]),

        contains: (text: string, substring: string): boolean => {
            if (text === null || text === undefined) return false;
            return String(text).includes(String(substring));
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
            variableValues[varName] === valueToCompare ? 1 : 0,

        countIfZeroPos: (varName: string): number => {
            const num = Number(variableValues[varName]);
            return !isNaN(num) && num >= 0 ? 1 : 0;
        },

        validatePattern: (value: string, pattern: string): boolean => {
            try {
                const anchoredPattern =
                    pattern.startsWith("^") && pattern.endsWith("$")
                        ? pattern
                        : `^${pattern}$`;
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
                if (!isNaN(num) && num > 0) {
                    sum += num;
                }
            }
            return sum;
        },

        condition: (condition: boolean, trueValue: any, falseValue: any): any =>
            condition ? trueValue : falseValue,

        count: (varName: string): number =>
            isSet(variableValues[varName]) ? 1 : 0,

        countIfCondition: (condition: boolean): number => (condition ? 1 : 0),

        hasDataValue: (dataElementId: string): boolean =>
            hasSetValue(dataValues, dataElementId) ||
            hasSetValue(attributeValues, dataElementId),

        /** Not supported offline: always false. */
        inOrgUnitGroup: (_groupId: string): boolean => false,

        // WHO z-scores
        zScoreWFA: (ageMonths: number, weightKg: number, sex: any): number | null =>
            zScoreWFA(ageMonths, weightKg, sex),

        zScoreHFA: (ageMonths: number, heightCm: number, sex: any): number | null =>
            zScoreHFA(ageMonths, heightCm, sex),

        zScoreWFH: (heightCm: number, weightKg: number, sex: any): number | null =>
            zScoreWFH(heightCm, weightKg, sex),

        zScoreBMIFA: (ageMonths: number, bmi: number, sex: any): number | null =>
            zScoreBMIFA(ageMonths, bmi, sex),
    };
}

export type D2Functions = ReturnType<typeof createD2Functions>;
