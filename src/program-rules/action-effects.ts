import type { FlattenedEvent } from "@/schemas";

export type EventActionCommand = {
    actionId: string;
    type: "CREATEEVENT" | "SCHEDULEEVENT";
    programStage: string;
    /** Evaluated scheduled date (SCHEDULEEVENT), or explicit occurrence date. */
    date?: string;
    dataValues?: Record<string, unknown>;
};

export type MaterializedActionEvent = FlattenedEvent & {
    ruleActionKey: string;
    scheduledAt?: string;
};

/**
 * CREATEEVENT metadata uses comma-separated data-element UID:expression pairs.
 * https://docs.dhis2.org/en/full/develop/dhis-core-version-237/developer-manual.html
 */
export function parseCreateEventData(
    text: string | null | undefined,
    evaluateExpression: (expression: string) => unknown,
): Record<string, unknown> {
    if (!text?.trim()) return {};
    const parts: string[] = [];
    let start = 0;
    let depth = 0;
    let quote = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (quote) {
            if (char === "\\") i++;
            else if (char === quote) quote = "";
        } else if (char === "'" || char === '"') quote = char;
        else if (char === "(") depth++;
        else if (char === ")") { if (--depth < 0) throw new Error("Invalid CREATEEVENT data"); }
        else if (char === "," && depth === 0) {
            parts.push(text.slice(start, i)); start = i + 1;
        }
    }
    if (quote || depth) throw new Error("Invalid CREATEEVENT data");
    parts.push(text.slice(start));
    return Object.fromEntries(parts.map((part) => {
        const match = part.trim().match(/^([A-Za-z][A-Za-z0-9]{10})\s*:\s*(.+)$/s);
        if (!match || !match[2].trim()) throw new Error("Invalid CREATEEVENT data assignment");
        const value = evaluateExpression(match[2].trim());
        if (value === undefined || value === null) throw new Error("Invalid CREATEEVENT value expression");
        return [match[1], value];
    }));
}

function validDate(value: unknown): value is string {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/**
 * Materialize only at an explicit save boundary; this function performs no writes.
 * Schedule duplicate scope follows the server: any event in the enrollment/stage.
 * https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-tracker/src/main/java/org/hisp/dhis/tracker/imports/programrule/executor/ScheduleEventHelper.java
 * CREATEEVENT is deduplicated by source/action so repeatable stages can receive later events.
 */
export function materializeEventActions(
    commands: EventActionCommand[],
    source: FlattenedEvent,
    existing: Array<Partial<FlattenedEvent> & { ruleActionKey?: string }>,
    options: { generateUid: () => string; now: string },
): MaterializedActionEvent[] {
    const created: MaterializedActionEvent[] = [];
    for (const command of commands) {
        if (!source.enrollment || !command.programStage || !command.actionId) continue;
        const ruleActionKey = `${source.event}:${command.actionId}:${command.programStage}`;
        if ([...existing, ...created].some((event) =>
            event.ruleActionKey === ruleActionKey ||
            (command.type === "SCHEDULEEVENT" && event.enrollment === source.enrollment && event.programStage === command.programStage),
        )) continue;
        const scheduled = command.type === "SCHEDULEEVENT";
        const date = command.date ?? (scheduled ? undefined : source.dataValues?.occurredAt);
        if (!validDate(date)) continue;
        const dataValues = { ...command.dataValues };
        // A scheduled event has no actual occurrence date, even if supplied in dataValues.
        delete dataValues.occurredAt;
        if (!scheduled) dataValues.occurredAt = date;
        created.push({
            event: options.generateUid(),
            program: source.program,
            programStage: command.programStage,
            enrollment: source.enrollment,
            orgUnit: source.orgUnit,
            trackedEntity: source.trackedEntity,
            parentEvent: source.event,
            ...(source.attributeOptionCombo ? { attributeOptionCombo: source.attributeOptionCombo } : {}),
            status: scheduled ? "SCHEDULE" : "ACTIVE",
            occurredAt: scheduled ? "" : date,
            ...(scheduled ? { scheduledAt: date } : {}),
            dataValues,
            followUp: false,
            deleted: false,
            createdAt: options.now,
            updatedAt: options.now,
            syncStatus: "draft",
            lastSynced: "",
            syncError: "",
            version: 1,
            ruleActionKey,
        });
    }
    return created;
}
