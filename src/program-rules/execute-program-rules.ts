import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { Event, ProgramRule, ProgramRuleResult, ProgramRuleVariable } from "../schemas";
import { zScoreBMIFA, zScoreHFA, zScoreWFA, zScoreWFH } from "../utils/who-zscore";

export type EventForRules = {
    event: string;
    programStage: string;
    occurredAt: string;
    dataValues: Record<string, any>;
};


export function executeProgramRules({
    programRules,
    programRuleVariables,
    dataValues,
    attributeValues = {},
    program,
    programStage,
    allEnrollmentEvents = [],
    currentEventId,
}: {
    programRules: ProgramRule[];
    programRuleVariables: ProgramRuleVariable[];
    dataValues?: Record<string, any>;
    attributeValues?: Record<string, any>;
    programStage?: string;
    program: string;
    allEnrollmentEvents?: EventForRules[];
    currentEventId?: string;
}): ProgramRuleResult {
    const variableValues: Record<string, any> = {};
    variableValues["current_date"] = dayjs().format("YYYY-MM-DD");
    variableValues["event_date"] = dataValues?.occurredAt;
    variableValues["enrollment_date"] = attributeValues?.enrolledAt;
    variableValues["event_count"] = 1;
    for (const variable of programRuleVariables) {
        let value: any = null;
        if (
            variable.programRuleVariableSourceType ===
            "DATAELEMENT_PREVIOUS_EVENT"
        ) {
            if (variable.dataElement) {
                const deId = variable.dataElement.id;
                const currentOccurredAt = dataValues?.occurredAt ?? "";
                const sameStage = allEnrollmentEvents
                    .filter(
                        (e) =>
                            e.programStage === programStage &&
                            e.event !== currentEventId &&
                            e.occurredAt <= currentOccurredAt,
                    )
                    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
                const prev = sameStage[sameStage.length - 1];
                value = prev?.dataValues[deId] ?? null;
            }
        } else if (
            variable.programRuleVariableSourceType ===
            "DATAELEMENT_NEWEST_EVENT_PROGRAM"
        ) {
            if (variable.dataElement) {
                const deId = variable.dataElement.id;
                const sorted = [...allEnrollmentEvents]
                    .filter((e) => e.event !== currentEventId)
                    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
                const found = sorted.find(
                    (e) =>
                        e.dataValues[deId] !== null &&
                        e.dataValues[deId] !== undefined,
                );
                value = found?.dataValues[deId] ?? null;
            }
        } else if (
            variable.dataElement &&
            dataValues?.hasOwnProperty(variable.dataElement.id)
        ) {
            value = dataValues[variable.dataElement.id];
        } else if (
            variable.trackedEntityAttribute &&
            attributeValues?.hasOwnProperty(variable.trackedEntityAttribute.id)
        ) {
            value = attributeValues[variable.trackedEntityAttribute.id];
        }
        variableValues[variable.name] = value ?? null;
    }
    const d2Functions = {
        hasValue: (varName: string): boolean => {
            const val = variableValues[varName];
            return val !== null && val !== undefined && val !== "";
        },

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

        countIfValue: (varName: string, valueToCompare: any): number => {
            const val = variableValues[varName];
            return val === valueToCompare ? 1 : 0;
        },

        countIfZeroPos: (varName: string): number => {
            const val = variableValues[varName];
            const num = Number(val);
            return !isNaN(num) && num >= 0 ? 1 : 0;
        },

        validatePattern: (value: string, pattern: string): boolean => {
            try {
                const anchoredPattern =
                    pattern.startsWith("^") && pattern.endsWith("$")
                        ? pattern
                        : `^${pattern}$`;

                const regex = new RegExp(anchoredPattern);
                const test = regex.test(String(value));
                return test;
            } catch {
                return false;
            }
        },

        left: (text: string, numChars: number): string => {
            return String(text).substring(0, numChars);
        },

        right: (text: string, numChars: number): string => {
            const str = String(text);
            return str.substring(str.length - numChars);
        },

        substring: (text: string, start: number, end: number): string => {
            return String(text).substring(start, end);
        },

        split: (text: string, delimiter: string, index: number): string => {
            const parts = String(text).split(delimiter);
            return parts[index] || "";
        },

        length: (text: string): number => {
            return String(text).length;
        },

        concatenate: (...args: any[]): string => {
            return args.map((a) => String(a)).join("");
        },

        daysBetween: (date1: string, date2: string): number => {
            const d1 = dayjs(date1);
            const d2 = dayjs(date2);
            return d2.diff(d1, "days");
        },

        weeksBetween: (date1: string, date2: string): number => {
            const d1 = dayjs(date1);
            const d2 = dayjs(date2);
            return d2.diff(d1, "weeks");
        },

        monthsBetween: (date1: string, date2: string): number => {
            const d1 = dayjs(date1);
            const d2 = dayjs(date2);
            return d2.diff(d1, "months");
        },

        yearsBetween: (date1: string, date2: string): number => {
            const d1 = dayjs(date1);
            const d2 = dayjs(date2);
            return d2.diff(d1, "years");
        },

        addDays: (date: string, days: number): string => {
            const d = dayjs(date);
            return d.add(days, "days").format("YYYY-MM-DD");
        },

        floor: (value: number): number => {
            return Math.floor(Number(value));
        },

        ceil: (value: number): number => {
            return Math.ceil(Number(value));
        },

        round: (value: number, decimals?: number): number => {
            const num = Number(value);
            if (decimals === undefined || decimals === 0) {
                return Math.round(num);
            }
            const multiplier = Math.pow(10, decimals);
            return Math.round(num * multiplier) / multiplier;
        },

        modulus: (dividend: number, divisor: number): number => {
            return Number(dividend) % Number(divisor);
        },

        zing: (value: number): number => {
            return Math.max(0, Number(value));
        },

        oizp: (value: number): number => {
            return Number(value) >= 0 ? 1 : 0;
        },

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

        condition: (
            condition: boolean,
            trueValue: any,
            falseValue: any,
        ): any => {
            return condition ? trueValue : falseValue;
        },

        count: (varName: string): number => {
            const val = variableValues[varName];
            if (val === null || val === undefined || val === "") return 0;
            return 1;
        },

        countIfCondition: (condition: boolean): number => {
            return condition ? 1 : 0;
        },

        hasDataValue: (dataElementId: string): boolean => {
            return (
                (!isEmpty(dataValues) &&
                    dataValues.hasOwnProperty(dataElementId) &&
                    dataValues[dataElementId] !== null &&
                    dataValues[dataElementId] !== undefined &&
                    dataValues[dataElementId] !== "") ||
                (!isEmpty(attributeValues) &&
                    attributeValues.hasOwnProperty(dataElementId) &&
                    attributeValues[dataElementId] !== null &&
                    attributeValues[dataElementId] !== undefined &&
                    attributeValues[dataElementId] !== "")
            );
        },

        inOrgUnitGroup: (groupId: string): boolean => {
            return false;
        },

        // WHO Z-Score Functions
        zScoreWFA: (
            ageMonths: number,
            weightKg: number,
            sex: any,
        ): number | null => {
            return zScoreWFA(ageMonths, weightKg, sex);
        },

        zScoreHFA: (
            ageMonths: number,
            heightCm: number,
            sex: any,
        ): number | null => {
            return zScoreHFA(ageMonths, heightCm, sex);
        },
        zScoreWFH: (
            heightCm: number,
            weightKg: number,
            sex: any,
        ): number | null => {
            return zScoreWFH(heightCm, weightKg, sex);
        },

        zScoreBMIFA: (
            ageMonths: number,
            bmi: number,
            sex: any,
        ): number | null => {
            return zScoreBMIFA(ageMonths, bmi, sex);
        },
    };

    const getFormattedValue = (
        name: string,
        skipQuotes: boolean = false,
    ): string => {
        const val = variableValues[name];
        if (val === null || val === undefined) {
            return skipQuotes ? "" : "''";
        }
        if (typeof val === "boolean") {
            return String(val);
        }
        if (typeof val === "number") {
            return String(val);
        }
        const stringVal = String(val);
        if (skipQuotes) {
            return stringVal;
        }
        const escaped = stringVal.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        return `'${escaped}'`;
    };

    const findClosingParen = (str: string, startPos: number): number => {
        let depth = 1;
        for (let i = startPos; i < str.length; i++) {
            if (str[i] === "(") depth++;
            else if (str[i] === ")") {
                depth--;
                if (depth === 0) return i;
            }
        }
        return -1;
    };

    const evaluateExpression = (expression: string): any => {
        if (!expression) return null;

        let processedExpression = expression;

        let maxIterations = 10;
        while (processedExpression.includes("d2:") && maxIterations-- > 0) {
            const d2Match = processedExpression.match(/d2:(\w+)\s*\(/);
            if (!d2Match) break;

            const funcName = d2Match[1];
            const startPos = d2Match.index!;
            const openParenPos = startPos + d2Match[0].length - 1;
            const closeParenPos = findClosingParen(
                processedExpression,
                openParenPos + 1,
            );

            if (closeParenPos === -1) {
                console.warn(
                    "Could not find closing parenthesis for",
                    d2Match[0],
                );
                break;
            }

            const argsStr = processedExpression.substring(
                openParenPos + 1,
                closeParenPos,
            );

            const args = argsStr.split(",");

            const processedArgs = args
                .map((arg: string) => {
                    arg = arg.trim();

                    const needsVarName = [
                        "hasValue",
                        "count",
                        "countIfValue",
                        "countIfZeroPos",
                    ].includes(funcName);

                    const varMatch = arg.match(/^[#AV]\{([^}]+)\}$/);
                    if (varMatch) {
                        const varName = varMatch[1];
                        if (needsVarName) {
                            return `'${varName}'`;
                        } else {
                            const val = variableValues[varName];
                            if (val === null || val === undefined)
                                return "null";
                            if (typeof val === "number") return String(val);
                            if (typeof val === "boolean") return String(val);
                            const stringVal = String(val);
                            const escaped = stringVal
                                .replace(/\\/g, "\\\\")
                                .replace(/'/g, "\\'");
                            return `'${escaped}'`;
                        }
                    }

                    if (arg.match(/^['"].*['"]$/)) {
                        return arg;
                    }
                    if (!isNaN(Number(arg)) && arg !== "") {
                        return arg;
                    }
                    if (arg === "true" || arg === "false") {
                        return arg;
                    }
                    return arg;
                })
                .join(", ");

            const replacement = `d2Functions.${funcName}(${processedArgs})`;
            processedExpression =
                processedExpression.substring(0, startPos) +
                replacement +
                processedExpression.substring(closeParenPos + 1);
        }

        processedExpression = processedExpression.replace(
            /[#AV]\{([^}]+)\}/g,
            (_, name) => {
                const val = variableValues[name];
                if (val === null || val === undefined) return "null";
                if (typeof val === "number") return String(val);
                return getFormattedValue(name);
            },
        );

        try {
            const func = new Function(
                "d2Functions",
                "variableValues",
                `return (${processedExpression})`,
            );
            const value = func(d2Functions, variableValues);
            return value;
        } catch (err) {
            console.warn(
                `Invalid expression: ${expression}`,
                processedExpression,
                err,
            );
            return null;
        }
    };

    const evaluateCondition = (condition: string, log = false): boolean => {
        let processedCondition = condition ?? "";
        let maxIterations = 10;
        while (processedCondition.includes("d2:") && maxIterations-- > 0) {
            const d2Match = processedCondition.match(/d2:(\w+)\s*\(/);
            if (!d2Match) break;

            const funcName = d2Match[1];
            const startPos = d2Match.index!;
            const openParenPos = startPos + d2Match[0].length - 1;
            const closeParenPos = findClosingParen(
                processedCondition,
                openParenPos + 1,
            );

            if (closeParenPos === -1) {
                break;
            }

            const argsStr = processedCondition.substring(
                openParenPos + 1,
                closeParenPos,
            );
            const args = argsStr.split(",");

            const processedArgs = args
                .map((arg: string) => {
                    arg = arg.trim();
                    // Functions that need variable name instead of value
                    const needsVarName = [
                        "hasValue",
                        "count",
                        "countIfValue",
                        "countIfZeroPos",
                    ].includes(funcName);

                    // Handle variable references #{varName} or A{attributeName} or V{systemVar}
                    const varMatch = arg.match(/^[#AV]\{([^}]+)\}$/);
                    if (varMatch) {
                        const varName = varMatch[1];
                        if (needsVarName) {
                            return `'${varName}'`;
                        } else {
                            // Get the raw value and wrap it properly
                            const val = variableValues[varName];
                            if (val === null || val === undefined)
                                return "null";
                            if (typeof val === "number") return String(val);
                            if (typeof val === "boolean") return String(val);
                            // For strings, escape and quote
                            const stringVal = String(val);
                            const escaped = stringVal
                                .replace(/\\/g, "\\\\")
                                .replace(/'/g, "\\'");
                            return `'${escaped}'`;
                        }
                    }

                    // If it's already quoted, keep as is
                    if (arg.match(/^['"].*['"]$/)) {
                        return arg;
                    }
                    // If it's a number, keep as is
                    if (!isNaN(Number(arg)) && arg !== "") {
                        return arg;
                    }
                    // If it's a boolean
                    if (arg === "true" || arg === "false") {
                        return arg;
                    }
                    // Otherwise leave as is (might be an expression)
                    return arg;
                })
                .join(", ");

            // Replace this one function call
            const replacement = `d2Functions.${funcName}(${processedArgs})`;
            processedCondition =
                processedCondition.substring(0, startPos) +
                replacement +
                processedCondition.substring(closeParenPos + 1);
        }

        processedCondition = processedCondition.replace(
            /[#AV]\{([^}]+)\}/g,
            (_, name) => getFormattedValue(name),
        );

        try {
            // Normalize comparison operators
            if (!isEmpty(processedCondition)) {
                let parts = processedCondition.split("'");
                for (let i = 0; i < parts.length; i += 2) {
                    parts[i] = parts[i]
                        .replace(/!=/g, "!==")
                        .replace(/([^!<>=])={2}(?!=)/g, "$1===")
                        .replace(/([^!<>=])=(?!=)/g, "$1===");
                }
                const normalizedCond = parts.join("'");
                const func = new Function(
                    "d2Functions",
                    "variableValues",
                    `return (${normalizedCond})`,
                );
                const value = func(d2Functions, variableValues);
                return value;
            }
            return false;
        } catch (err) {
            console.warn(
                `Invalid condition: ${condition}`,
                processedCondition,
                err,
            );
            return false;
        }
    };

    // Step 3: Run through rules and collect actions
    const result: ProgramRuleResult = {
        assignments: {},
        hiddenFields: [],
        shownFields: [],
        mandatoryFields: [],
        errors: [],
        hiddenSections: [],
        shownSections: [],
        hiddenOptions: {},
        shownOptions: {},
        hiddenOptionGroups: {},
        shownOptionGroups: {},
        messages: [],
        warnings: [],
    };

    for (const rule of programRules) {
        // Skip rules for different programs
        if (rule.program && rule.program.id !== program) {
            continue;
        }

        if (programStage === undefined) {
            if (rule.programStage) {
                continue;
            }
        } else {
            if (rule.programStage && rule.programStage.id !== programStage) {
                continue;
            }
        }
        let isTrue = evaluateCondition(
            rule.condition,
            rule.id === "aMBmnUCxRce",
        );
        if (!isTrue) {
            continue;
        }

        for (const action of rule.programRuleActions) {
            const isDataElement = !!action.dataElement;
            const isAttribute = !!action.trackedEntityAttribute;
            const targetId =
                action.dataElement?.id ||
                action.trackedEntityAttribute?.id ||
                "";

            // Skip if target type doesn't match context
            if (programStage === undefined && isDataElement) {
                // Registration context: skip dataElement targets
                continue;
            }
            if (programStage !== undefined && isAttribute) {
                // Event context: skip trackedEntityAttribute targets
                continue;
            }

            switch (action.programRuleActionType) {
                case "ASSIGN":
                    if (targetId && action.data) {
                        const evaluatedValue = evaluateExpression(action.data);
                        result.assignments[targetId] = evaluatedValue;
                    }
                    break;

                case "HIDEFIELD":
                    if (targetId) {
                        if (!result.hiddenFields.includes(targetId)) {
                            result.hiddenFields.push(targetId);
                        }
                    }
                    break;

                case "SHOWFIELD":
                    if (targetId) {
                        if (!result.shownFields.includes(targetId)) {
                            result.shownFields.push(targetId);
                        }
                    }
                    break;

                case "SETMANDATORYFIELD":
                    if (targetId) {
                        if (!result.mandatoryFields.includes(targetId)) {
                            result.mandatoryFields.push(targetId);
                        }
                    }
                    break;

                case "HIDESECTION":
                    if (action.programStageSection) {
                        const sectionId = action.programStageSection.id;
                        if (!result.hiddenSections.includes(sectionId)) {
                            result.hiddenSections.push(sectionId);
                        }
                    }
                    break;

                case "SHOWSECTION":
                    if (action.programStageSection) {
                        const sectionId = action.programStageSection.id;
                        if (!result.shownSections.includes(sectionId)) {
                            result.shownSections.push(sectionId);
                        }
                    }
                    break;

                case "HIDEOPTION":
                    if (targetId && action.option) {
                        if (!result.hiddenOptions[targetId]) {
                            result.hiddenOptions[targetId] = [];
                        }
                        if (
                            !result.hiddenOptions[targetId].includes(
                                action.option.id,
                            )
                        ) {
                            result.hiddenOptions[targetId].push(
                                action.option.id,
                            );
                        }
                    }
                    break;

                case "SHOWOPTION":
                    if (targetId && action.option) {
                        if (!result.shownOptions[targetId]) {
                            result.shownOptions[targetId] = [];
                        }
                        if (
                            !result.shownOptions[targetId].includes(
                                action.option.id,
                            )
                        ) {
                            result.shownOptions[targetId].push(
                                action.option.id,
                            );
                        }
                    }
                    break;

                case "HIDEOPTIONGROUP":
                    if (targetId && action.optionGroup) {
                        if (!result.hiddenOptionGroups[targetId]) {
                            result.hiddenOptionGroups[targetId] = [];
                        }
                        if (
                            !result.hiddenOptionGroups[targetId].includes(
                                action.optionGroup.id,
                            )
                        ) {
                            result.hiddenOptionGroups[targetId].push(
                                action.optionGroup.id,
                            );
                        }
                    }

                    break;

                case "SHOWOPTIONGROUP":
                    if (targetId && action.optionGroup) {
                        if (!result.shownOptionGroups[targetId]) {
                            result.shownOptionGroups[targetId] = [];
                        }
                        if (
                            !result.shownOptionGroups[targetId].includes(
                                action.optionGroup.id,
                            )
                        ) {
                            result.shownOptionGroups[targetId].push(
                                action.optionGroup.id,
                            );
                        }
                    }
                    break;

                case "DISPLAYTEXT":
                    if (targetId && action.content) {
                        if (targetId && action.content) {
                            result.messages.push({
                                key: targetId,
                                content: action.content ?? "",
                            });
                        }
                    }
                    break;

                case "ERROR":
                    if (targetId && action.content) {
                        if (targetId && action.content) {
                            result.errors.push({
                                key: targetId,
                                content: action.content ?? "",
                            });
                        }
                    }
                    break;
                case "SHOWERROR":
                    if (targetId && action.content) {
                        if (targetId && action.content) {
                            result.errors.push({
                                key: targetId,
                                content: action.content ?? "",
                            });
                        }
                    }
                    break;

                case "SHOWWARNING":
                    {
                        if (targetId && action.content) {
                            result.warnings.push({
                                key: targetId,
                                content: action.content ?? "",
                            });
                        }
                    }
                    break;
            }
        }
    }

    return result;
}
