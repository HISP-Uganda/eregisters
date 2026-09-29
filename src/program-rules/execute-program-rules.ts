import { ProgramRule, ProgramRuleResult, ProgramRuleVariable } from "@/schemas";
import { applyAction } from "./actions";
import { createD2Functions } from "./d2-functions";
import { createEvaluator } from "./expression";
import { createEmptyProgramRuleResult } from "./rule-results";
import { EventForRules, resolveVariableValues } from "./variables";

export type { EventForRules } from "./variables";

/** Whether a rule belongs to this program and to this stage (or to registration). */
function ruleApplies(rule: ProgramRule, program: string, programStage?: string) {
    if (rule.program && rule.program.id !== program) return false;
    if (programStage === undefined) return !rule.programStage;
    return !rule.programStage || rule.programStage.id === programStage;
}

/**
 * Rules by `priority`, lowest first, then those without one in their given
 * order — as DHIS2 runs them.
 */
function byPriority(rules: ProgramRule[]): ProgramRule[] {
    const rank = (rule: ProgramRule) => rule.priority ?? Number.POSITIVE_INFINITY;
    return [...rules].sort((a, b) =>
        rank(a) === rank(b) ? 0 : rank(a) - rank(b),
    );
}

/**
 * Runs a program's rules against one form — the registration form when
 * `programStage` is undefined, otherwise an event of that stage — and
 * collects what they do: assignments, hidden and mandatory fields, messages.
 * Rules run by priority (see `byPriority`); a later ASSIGN to the same
 * field wins.
 */
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
    const variableValues = resolveVariableValues(programRuleVariables, {
        dataValues,
        attributeValues,
        programStage,
        allEnrollmentEvents,
        currentEventId,
    });
    const { evaluateCondition, evaluateExpression } = createEvaluator(
        variableValues,
        createD2Functions(variableValues, dataValues, attributeValues),
    );

    const result = createEmptyProgramRuleResult();
    for (const rule of byPriority(programRules)) {
        if (!ruleApplies(rule, program, programStage)) continue;
        if (!evaluateCondition(rule.condition)) continue;

        for (const action of rule.programRuleActions) {
            // Registration targets attributes only; an event, data elements only.
            if (programStage === undefined && action.dataElement) continue;
            if (programStage !== undefined && action.trackedEntityAttribute) continue;

            const targetId =
                action.dataElement?.id || action.trackedEntityAttribute?.id || "";
            applyAction(result, action, targetId, evaluateExpression);
        }
    }
    return result;
}
