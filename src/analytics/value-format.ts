import type { AnalyticsValueKind } from "./types";

type OptionSets = Map<
    string,
    Array<{
        id: string;
        name: string;
        code: string;
        optionSet: string;
        optionSetName?: string;
        sortOrder: number;
    }>
>;

export function valueKindFromDhis2(
    valueType: string | undefined,
): AnalyticsValueKind {
    switch (valueType) {
        case "NUMBER":
        case "INTEGER":
        case "INTEGER_POSITIVE":
        case "INTEGER_NEGATIVE":
        case "INTEGER_ZERO_OR_POSITIVE":
        case "PERCENTAGE":
        case "UNIT_INTERVAL":
            return "number";
        case "BOOLEAN":
        case "TRUE_ONLY":
            return "boolean";
        case "DATE":
            return "date";
        case "DATETIME":
            return "datetime";
        case "TIME":
            return "time";
        case "TEXT":
        case "LONG_TEXT":
        case "LETTER":
        case "PHONE_NUMBER":
        case "EMAIL":
        case "URL":
            return "string";
        default:
            return "unknown";
    }
}

export function displayValue(
    raw: unknown,
    optionSetId: string | undefined,
    optionSets: OptionSets,
): string {
    if (raw === undefined || raw === null || raw === "") return "Missing";

    const text = String(raw);
    if (!optionSetId) return text;

    const options = optionSets.get(optionSetId) ?? [];
    const byIdOrCode = new Map<string, string>();
    for (const option of options) {
        byIdOrCode.set(option.id, option.name);
        byIdOrCode.set(option.code, option.name);
    }

    return text
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => byIdOrCode.get(part) ?? part)
        .join(", ");
}

export function numericValue(raw: unknown): number | undefined {
    if (raw === undefined || raw === null || raw === "") return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
}
