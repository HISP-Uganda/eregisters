import { isEmpty } from "lodash";
import { D2Functions, TAKES_VARIABLE_NAME } from "./d2-functions";
import { VariableValues } from "./variables";

/**
 * Turns a DHIS2 rule expression into JavaScript and runs it: `d2:fn(…)`
 * calls become `d2Functions.fn(…)` and `#{…}`, `A{…}` and `V{…}` become
 * literal values. Conditions and ASSIGN expressions share this, with two
 * differences kept from when they were separate copies: a missing variable
 * is `''` in a condition but `null` in an expression, and only conditions
 * rewrite DHIS2's `=`/`==`/`!=` to `===`/`!==`.
 */

const VARIABLE = /[#AV]\{([^}]+)\}/g;
const WHOLE_VARIABLE = /^[#AV]\{([^}]+)\}$/;

/** A value as a JavaScript literal; `missing` stands in for null/undefined. */
function literal(val: unknown, missing: string): string {
    if (val === null || val === undefined) return missing;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    const escaped = String(val).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `'${escaped}'`;
}

function findClosingParen(str: string, startPos: number): number {
    let depth = 1;
    for (let i = startPos; i < str.length; i++) {
        if (str[i] === "(") depth++;
        else if (str[i] === ")") {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

function translateArgument(
    arg: string,
    funcName: string,
    variableValues: VariableValues,
): string {
    arg = arg.trim();
    const variable = arg.match(WHOLE_VARIABLE);
    if (!variable) return arg; // a literal, or an expression left for later
    return TAKES_VARIABLE_NAME.includes(funcName)
        ? `'${variable[1]}'`
        : literal(variableValues[variable[1]], "null");
}

/**
 * Rewrites up to ten `d2:` calls, outermost first; an inner call is left in
 * its outer call's arguments and rewritten on a later pass.
 */
function translateD2Calls(
    text: string,
    variableValues: VariableValues,
    warnUnclosed: boolean,
): string {
    let maxIterations = 10;
    while (text.includes("d2:") && maxIterations-- > 0) {
        const d2Match = text.match(/d2:(\w+)\s*\(/);
        if (!d2Match) break;

        const funcName = d2Match[1];
        const startPos = d2Match.index!;
        const openParenPos = startPos + d2Match[0].length - 1;
        const closeParenPos = findClosingParen(text, openParenPos + 1);
        if (closeParenPos === -1) {
            if (warnUnclosed) {
                console.warn("Could not find closing parenthesis for", d2Match[0]);
            }
            break;
        }

        const args = text
            .substring(openParenPos + 1, closeParenPos)
            .split(",")
            .map((arg) => translateArgument(arg, funcName, variableValues))
            .join(", ");
        text =
            text.substring(0, startPos) +
            `d2Functions.${funcName}(${args})` +
            text.substring(closeParenPos + 1);
    }
    return text;
}

/** DHIS2's `=`, `==` and `!=` as strict JavaScript comparisons, outside quotes. */
function strictComparisons(code: string): string {
    const parts = code.split("'");
    for (let i = 0; i < parts.length; i += 2) {
        parts[i] = parts[i]
            .replace(/!=/g, "!==")
            .replace(/([^!<>=])={2}(?!=)/g, "$1===")
            .replace(/([^!<>=])=(?!=)/g, "$1===");
    }
    return parts.join("'");
}

function run(code: string, d2Functions: D2Functions, variableValues: VariableValues) {
    const func = new Function(
        "d2Functions",
        "variableValues",
        `return (${code})`,
    );
    return func(d2Functions, variableValues);
}

export function createEvaluator(
    variableValues: VariableValues,
    d2Functions: D2Functions,
) {
    const substitute = (text: string, missing: string) =>
        text.replace(VARIABLE, (_, name) => literal(variableValues[name], missing));

    /** An ASSIGN expression's value; null when it's empty or invalid. */
    const evaluateExpression = (expression: string): any => {
        if (!expression) return null;
        const code = substitute(
            translateD2Calls(expression, variableValues, true),
            "null",
        );
        try {
            return run(code, d2Functions, variableValues);
        } catch (err) {
            console.warn(`Invalid expression: ${expression}`, code, err);
            return null;
        }
    };

    /** A rule condition's value (truthy fires the rule); false when empty or invalid. */
    const evaluateCondition = (condition: string): any => {
        const code = substitute(
            translateD2Calls(condition ?? "", variableValues, false),
            "''",
        );
        try {
            if (isEmpty(code)) return false;
            return run(strictComparisons(code), d2Functions, variableValues);
        } catch (err) {
            console.warn(`Invalid condition: ${condition}`, code, err);
            return false;
        }
    };

    return { evaluateExpression, evaluateCondition };
}
