import type { FlattenedEvent } from "@/schemas";
import type { EventForRules } from "./execute-program-rules";

/** Keep only event fields consumed by program-rule history evaluation. */
export function toRuleEvents(events: readonly FlattenedEvent[]): EventForRules[] {
    return events.map((event) => ({
        event: event.event,
        ...(event.enrollment ? { enrollment: event.enrollment } : {}),
        ...(event.createdAt ? { createdAt: event.createdAt } : {}),
        ...(event.status ? { status: event.status } : {}),
        programStage: event.programStage,
        occurredAt: event.occurredAt,
        dataValues: event.dataValues,
    }));
}
