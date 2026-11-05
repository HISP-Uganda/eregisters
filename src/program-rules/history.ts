import type { ProgramRuleVariable } from "@/schemas";
import type { RuleContext } from "./variables";

export type HistoryValue = { value: unknown; occurredAt?: string; event?: string };
export type VariableHistory = Record<string, HistoryValue[]>;
const isSet = (value: unknown) => value !== undefined && value !== null && value !== "";

const NUMERIC_VALUE_TYPES = new Set([
	"NUMBER", "INTEGER", "INTEGER_POSITIVE", "INTEGER_NEGATIVE",
	"INTEGER_ZERO_OR_POSITIVE", "PERCENTAGE", "UNIT_INTERVAL",
]);

const BOOLEAN_VALUE_TYPES = new Set(["BOOLEAN", "TRUE_ONLY"]);

/**
 * A variable's value as rules should see it: DHIS2 stores numbers and
 * booleans as text, so a numeric variable's value becomes a number and a
 * BOOLEAN/TRUE_ONLY one a boolean, or comparisons like `#{parity} > #{gravida}`
 * and `#{flag} == true` would compare strings. Empty values stay empty (not
 * DHIS2's default of 0/false) so conditions like `#{x} == ''` keep working.
 */
export function typedValue(variable: Pick<ProgramRuleVariable, "valueType">, value: unknown): unknown {
	if (!isSet(value) || typeof value === "number" || typeof value === "boolean") return value;
	const text = String(value).trim();
	if (BOOLEAN_VALUE_TYPES.has(variable.valueType ?? "")) {
		return text === "true" ? true : text === "false" ? false : value;
	}
	if (!NUMERIC_VALUE_TYPES.has(variable.valueType ?? "")) return value;
	const number = Number(text);
	return text !== "" && Number.isFinite(number) ? number : value;
}

/** Keep source occurrences, not just the scalar selected for #{variable}. */
export function resolveVariableHistory(variables: ProgramRuleVariable[], context: RuleContext): VariableHistory {
	const result: VariableHistory = {};
	const events = [
		...(context.allEnrollmentEvents ?? []).filter((event) => event.event !== context.currentEventId && event.occurredAt &&
			(!event.status || event.status === "ACTIVE" || event.status === "COMPLETED")),
		...(context.dataValues ? [{
			event: context.currentEventId,
			programStage: context.programStage,
			occurredAt: context.dataValues.occurredAt,
			dataValues: context.dataValues,
			createdAt: context.currentEventCreatedAt ?? context.allEnrollmentEvents?.find((event) => event.event === context.currentEventId)?.createdAt,
		}] : []),
	].sort((a, b) => String(a.occurredAt ?? "").localeCompare(String(b.occurredAt ?? "")) ||
		String(a.createdAt ?? "").localeCompare(String(b.createdAt ?? "")));
	const currentIndex = events.findIndex((event) => event.dataValues === context.dataValues);
	for (const variable of variables) {
		const source = variable.programRuleVariableSourceType;
		if (!variable.dataElement) {
			const value = variable.trackedEntityAttribute && context.attributeValues?.[variable.trackedEntityAttribute.id];
			result[variable.name] = isSet(value) ? [{ value: typedValue(variable, value) }] : [];
			continue;
		}
		const id = variable.dataElement.id;
		const stage = variable.programStage?.id ?? context.programStage;
		result[variable.name] = events.filter((event, index) => {
			if (source === "DATAELEMENT_NEWEST_EVENT_PROGRAM") return true;
			if (source === "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE") return event.programStage === stage;
			if (source === "DATAELEMENT_PREVIOUS_EVENT") {
				return currentIndex >= 0 && index < currentIndex;
			}
			return event.event === context.currentEventId && event.dataValues === context.dataValues;
		}).filter((event) => isSet(event.dataValues[id])).map((event) => ({
			value: typedValue(variable, event.dataValues[id]), event: event.event, occurredAt: event.occurredAt,
		}));
	}
	return result;
}

export type RuleEnvironment = {
	userRoleIds?: string[];
	userGroupIds?: string[];
	organisationUnitGroups?: Record<string, Array<{ id: string; code?: string }>>;
};

export function buildRuleEnvironment(
	user: { userRoles?: { id: string }[]; userCredentials?: { userRoles?: { id: string }[] }; userGroups?: { id: string }[]; organisationUnits: { id: string; organisationUnitGroups?: { id: string; code?: string }[] }[] },
	units: { id: string; organisationUnitGroups?: { id: string; code?: string }[] }[],
): RuleEnvironment {
	return {
		userRoleIds: [...(user.userRoles ?? []), ...(user.userCredentials?.userRoles ?? [])].map(({ id }) => id),
		userGroupIds: (user.userGroups ?? []).map(({ id }) => id),
		organisationUnitGroups: Object.fromEntries([...user.organisationUnits, ...units]
			.filter((unit) => unit.organisationUnitGroups !== undefined)
			.map((unit) => [unit.id, unit.organisationUnitGroups ?? []])),
	};
}
