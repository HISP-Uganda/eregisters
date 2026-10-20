import dayjs from "dayjs";
import { resolveVariableHistory } from "./history";
import { ProgramRuleVariable } from "@/schemas";

export type EventForRules = {
	enrollment?: string;
	createdAt?: string;
	status?: string;
	event: string;
	programStage: string;
	occurredAt: string;
	dataValues: Record<string, any>;
};

/** Program rule variable values by name, plus the `V{…}` system variables. */
export type VariableValues = Record<string, any>;

export type RuleContext = {
	currentEventCreatedAt?: string;
	dataValues?: Record<string, any>;
	attributeValues?: Record<string, any>;
	programStage?: string;
	allEnrollmentEvents?: EventForRules[];
	currentEventId?: string;
};

/** Any other source type reads the form being filled. */
function currentValue(
	variable: ProgramRuleVariable,
	{ dataValues, attributeValues }: RuleContext,
) {
	if (
		variable.dataElement &&
		dataValues?.hasOwnProperty(variable.dataElement.id)
	) {
		return dataValues[variable.dataElement.id];
	}
	if (
		variable.trackedEntityAttribute &&
		attributeValues?.hasOwnProperty(variable.trackedEntityAttribute.id)
	) {
		return attributeValues[variable.trackedEntityAttribute.id];
	}
	return null;
}

export function resolveVariableValues(
	programRuleVariables: ProgramRuleVariable[],
	context: RuleContext,
): VariableValues {
	const values: VariableValues = {
		current_date: dayjs().format("YYYY-MM-DD"),
		event_date: context.dataValues?.occurredAt,
		enrollment_date: context.attributeValues?.enrolledAt,
		event_count: 1,
	};
	const history = resolveVariableHistory(programRuleVariables, context);
	for (const variable of programRuleVariables) {
		const historical = ["DATAELEMENT_PREVIOUS_EVENT", "DATAELEMENT_NEWEST_EVENT_PROGRAM", "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE"].includes(variable.programRuleVariableSourceType);
		values[variable.name] = (historical ? history[variable.name]?.at(-1)?.value : currentValue(variable, context)) ?? null;
	}
	return values;
}
