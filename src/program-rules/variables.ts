import dayjs from "dayjs";
import { ProgramRuleVariable } from "../schemas";

export type EventForRules = {
    event: string;
    programStage: string;
    occurredAt: string;
    dataValues: Record<string, any>;
};

/** Program rule variable values by name, plus the `V{…}` system variables. */
export type VariableValues = Record<string, any>;

export type RuleContext = {
    dataValues?: Record<string, any>;
    attributeValues?: Record<string, any>;
    programStage?: string;
    allEnrollmentEvents?: EventForRules[];
    currentEventId?: string;
};

/** The latest same-stage event on or before this one, this one excluded. */
function previousEventValue(
    dataElement: string,
    { dataValues, programStage, allEnrollmentEvents = [], currentEventId }: RuleContext,
) {
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
    return prev?.dataValues[dataElement] ?? null;
}

/**
 * The newest event with a value — the one being filled included, as in
 * DHIS2 — among the enrollment's events, or only those of `stage`.
 */
function newestEventValue(
    dataElement: string,
    { dataValues, programStage, allEnrollmentEvents = [], currentEventId }: RuleContext,
    stage?: string,
) {
    const current: EventForRules[] = dataValues
        ? [
              {
                  event: currentEventId ?? "",
                  programStage: programStage ?? "",
                  occurredAt: dataValues.occurredAt ?? "",
                  dataValues,
              },
          ]
        : [];
    const found = [
        ...allEnrollmentEvents.filter((e) => e.event !== currentEventId),
        ...current,
    ]
        .filter((e) => stage === undefined || e.programStage === stage)
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
        .find(
            (e) =>
                e.dataValues[dataElement] !== null &&
                e.dataValues[dataElement] !== undefined,
        );
    return found?.dataValues[dataElement] ?? null;
}

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

function variableValue(variable: ProgramRuleVariable, context: RuleContext) {
    switch (variable.programRuleVariableSourceType) {
        case "DATAELEMENT_PREVIOUS_EVENT":
            return variable.dataElement
                ? previousEventValue(variable.dataElement.id, context)
                : null;
        case "DATAELEMENT_NEWEST_EVENT_PROGRAM":
            return variable.dataElement
                ? newestEventValue(variable.dataElement.id, context)
                : null;
        case "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE":
            return variable.dataElement
                ? newestEventValue(
                      variable.dataElement.id,
                      context,
                      variable.programStage?.id ?? context.programStage,
                  )
                : null;
        default:
            return currentValue(variable, context);
    }
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
    for (const variable of programRuleVariables) {
        values[variable.name] = variableValue(variable, context) ?? null;
    }
    return values;
}
