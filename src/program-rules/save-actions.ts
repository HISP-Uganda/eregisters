import type { FlattenedEvent, ProgramRuleResult } from "@/schemas";
import { executeProgramRules } from "./execute-program-rules";

export type RuleSaveMetadata = Pick<Parameters<typeof executeProgramRules>[0], "programRules" | "programRuleVariables" | "ruleEnvironment">;

/** Apply the same assignment and hidden-field clearing policy as mounted forms. */
export function applyRuleValues(values: Record<string, any>, result?: ProgramRuleResult | null) {
    const next = { ...values, ...result?.assignments };
    for (const id of result?.hiddenFields ?? []) next[id] = undefined;
    return next;
}

/** Reevaluate drafts at the final parent save, including child forms no longer mounted. */
export function evaluateEventForSave(event: FlattenedEvent, metadata: RuleSaveMetadata,
    attributes: Record<string, any>, events: FlattenedEvent[]) {
    return executeProgramRules({ ...metadata, program: event.program, programStage: event.programStage,
        enrollment: event.enrollment, orgUnit: event.orgUnit, currentEventId: event.event,
        currentEventCreatedAt: event.createdAt, dataValues: event.dataValues, attributeValues: attributes,
        allEnrollmentEvents: events,
    });
}

/** Called by save actions as well as UI gates, so inline saves cannot bypass errors. */
export function assertRuleSaveAllowed(result?: ProgramRuleResult | null, complete = false) {
    const errors = [...(result?.errors ?? []), ...(complete ? result?.completionErrors ?? [] : [])];
    if (errors.length) throw new Error(errors.map((error) => error.content).join("; "));
}

export function captureEventStatus(status: string, values: Record<string, unknown>, complete = false): string {
    if (complete) return "COMPLETED";
    return status === "SCHEDULE" && values.occurredAt ? "ACTIVE" : status;
}

/** A scheduled form inherits the containing visit's explicit date when capture begins. */
export function eventForCapture<T extends { status: string; occurredAt: string; dataValues: Record<string, any> }>(event: T, visitDate?: string): T {
    if (event.status !== "SCHEDULE" || !visitDate) return event;
    return { ...event, occurredAt: visitDate, dataValues: { ...event.dataValues, occurredAt: visitDate } };
}
