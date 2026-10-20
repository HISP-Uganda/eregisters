import type { ProgramRuleVariable } from "@/schemas";
import type { RuleContext } from "./variables";

export type HistoryValue = { value: unknown; occurredAt?: string; event?: string };
export type VariableHistory = Record<string, HistoryValue[]>;
const isSet = (value: unknown) => value !== undefined && value !== null && value !== "";

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
			result[variable.name] = isSet(value) ? [{ value }] : [];
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
			value: event.dataValues[id], event: event.event, occurredAt: event.occurredAt,
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
