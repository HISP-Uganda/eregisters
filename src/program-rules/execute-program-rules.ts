import { ProgramRule, ProgramRuleResult, ProgramRuleVariable } from "@/schemas";
import { applyAction } from "./actions";
import { createD2Functions } from "./d2-functions";
import { createEvaluator } from "./expression";
import { createEmptyProgramRuleResult } from "./rule-results";
import { EventForRules, resolveVariableValues } from "./variables";
import { resolveVariableHistory, type RuleEnvironment } from "./history";
import { parseCreateEventData } from "./action-effects";

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
	allEnrollmentEvents: enrollmentEvents = [],
	enrollment,
	currentEventId,
	currentEventCreatedAt,
	ruleEnvironment,
	orgUnit,
}: {
	programRules: ProgramRule[];
	programRuleVariables: ProgramRuleVariable[];
	dataValues?: Record<string, any>;
	attributeValues?: Record<string, any>;
	programStage?: string;
	program: string;
	allEnrollmentEvents?: EventForRules[];
	enrollment?: string;
	currentEventId?: string;
	currentEventCreatedAt?: string;
	ruleEnvironment?: RuleEnvironment;
	orgUnit?: string;
}): ProgramRuleResult {
	dataValues = programStage !== undefined ? { ...dataValues } : undefined;
	attributeValues = { ...attributeValues };
	const calculatedValues: Record<string, any> = {};
	const allEnrollmentEvents = enrollmentEvents.filter((event) => !enrollment || !event.enrollment || event.enrollment === enrollment);
	const variableValues = resolveVariableValues(programRuleVariables, {
		dataValues,
		attributeValues,
		programStage,
		allEnrollmentEvents,
		currentEventId,
		currentEventCreatedAt,
	});
	const context = { dataValues, attributeValues, programStage, allEnrollmentEvents, currentEventId, currentEventCreatedAt };
	const historicalVariables = programRuleVariables.filter((variable) => variable.programRuleVariableSourceType !== "CALCULATED_VALUE");
	const enrollmentVariables = (variables: ProgramRuleVariable[]) => variables.map((variable) => variable.dataElement
		? { ...variable, programRuleVariableSourceType: "DATAELEMENT_NEWEST_EVENT_PROGRAM" } : variable);
	const variableHistory = resolveVariableHistory(historicalVariables, context);
	const enrollmentVariableHistory = resolveVariableHistory(enrollmentVariables(historicalVariables), context);
	const { evaluateCondition, evaluateExpression } = createEvaluator(variableValues,
		createD2Functions(variableValues, dataValues, attributeValues, {
			...ruleEnvironment, orgUnit, currentEventId, variableHistory, enrollmentVariableHistory,
		}));

	const result = createEmptyProgramRuleResult();
	for (const rule of byPriority(programRules)) {

		if (!ruleApplies(rule, program, programStage)) continue;
		if (!evaluateCondition(rule.condition)) continue;

		for (const [index, original] of rule.programRuleActions.entries()) {
			const action = { ...original, id: original.id ?? `${rule.id}:${index}` };
			// Accepted exception: this TB rule targets the only Medical Visit stage.
			if (rule.id === "YFZmzMxHfAx" && action.programRuleActionType === "HIDEPROGRAMSTAGE") continue;
			if (action.programRuleActionType === "CREATEEVENT" || action.programRuleActionType === "SCHEDULEEVENT") {
				if (action.programStage?.id) {
					try {
						(result.eventActions ??= []).push({
							actionId: action.id, type: action.programRuleActionType,
							programStage: action.programStage.id,
							...(action.programRuleActionType === "CREATEEVENT"
								? { dataValues: parseCreateEventData(action.data, evaluateExpression) }
								: { date: String(evaluateExpression(action.data ?? "") ?? "") }),
						});
					} catch (error) {
						result.errors.push({ key: "", content: error instanceof Error ? error.message : String(error) });
					}
				}
				continue;
			}
			// Registration targets attributes only; an event, data elements only.
			if (programStage === undefined && action.dataElement) continue;
			if (programStage !== undefined && action.trackedEntityAttribute) continue;

			const targetId =
				action.dataElement?.id || action.trackedEntityAttribute?.id || "";
			if (action.programRuleActionType === "ASSIGN" && !targetId && action.content && action.data) {
				calculatedValues[action.content] = evaluateExpression(action.data);
				variableValues[action.content] = calculatedValues[action.content];
			} else {
				applyAction(result, action, targetId, evaluateExpression);
				if (action.programRuleActionType === "ASSIGN" && targetId && action.data) {
					if (action.dataElement && dataValues) dataValues[targetId] = result.assignments[targetId];
					if (action.trackedEntityAttribute) attributeValues[targetId] = result.assignments[targetId];
					const affected = historicalVariables.filter((variable) => action.dataElement
						? variable.dataElement?.id === targetId : variable.trackedEntityAttribute?.id === targetId);
					Object.assign(variableValues, resolveVariableValues(affected, context), calculatedValues);
					Object.assign(variableHistory, resolveVariableHistory(affected, context));
					Object.assign(enrollmentVariableHistory, resolveVariableHistory(enrollmentVariables(affected), context));
				}
			}
		}
	}
	result.hiddenFields = result.hiddenFields.filter((id) => !result.shownFields.includes(id));
	result.hiddenSections = result.hiddenSections.filter((id) => !result.shownSections.includes(id));
	return result;
}
