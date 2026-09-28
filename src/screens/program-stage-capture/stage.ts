import type { FormInstance } from "antd";
import type { useMetadata } from "../../hooks/useMetadata";
import type { EventForRules } from "../../program-rules/execute-program-rules";
import type {
    DataElement,
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    ProgramStage,
} from "../../schemas";

const PROGRAM = "ueBhWkWll5v";

/**
 * How a stage's events are entered: in a popup form ("modal"), in a form
 * that opens under the row ("inline-expand"), or straight in the table's
 * cells ("inline-row").
 */
export type CaptureMode = "modal" | "inline-expand" | "inline-row";

/** What every event form of one stage, in one visit, needs. */
export type StageFormContext = {
    programStage: ProgramStage;
    enrollment: FlattenedEnrollment;
    trackedEntity: FlattenedTrackedEntity;
    stageDataElements: Set<string>;
    programRules: ReturnType<typeof useMetadata>["programRules"];
    programRuleVariables: ReturnType<typeof useMetadata>["programRuleVariables"];
    allEnrollmentEvents: EventForRules[];
};

/** The event form machine's input for one event of the stage. */
export function eventFormInput(
    context: StageFormContext,
    event: FlattenedEvent,
    form: FormInstance,
) {
    return {
        programRules: context.programRules,
        programRuleVariables: context.programRuleVariables,
        enrollment: context.enrollment,
        event,
        program: PROGRAM,
        programStage: context.programStage.id,
        trackedEntity: context.trackedEntity,
        validDataElements: context.stageDataElements,
        form,
        allEnrollmentEvents: context.allEnrollmentEvents,
    };
}

/** An event's date: the form's `occurredAt` when set, else the stored one. */
export function eventDate(event: Pick<FlattenedEvent, "dataValues" | "occurredAt">): string {
    return (event.dataValues?.["occurredAt"] as string | undefined) || event.occurredAt;
}

/** The enrollment's events as program rules read them. */
export function toRuleEvents(events: FlattenedEvent[]): EventForRules[] {
    return events.map((e) => ({
        event: e.event,
        programStage: e.programStage,
        occurredAt: e.occurredAt,
        dataValues: e.dataValues,
    }));
}

export function stageDataElementIds(stage: ProgramStage): Set<string> {
    return new Set(stage.programStageDataElements.map((psde) => psde.dataElement.id));
}

export function stageMandatoryIds(stage: ProgramStage): string[] {
    return stage.programStageDataElements
        .filter((psde) => psde.compulsory)
        .map((psde) => psde.dataElement.id);
}

/** The stage's data elements' labels, by id. */
export function stageLabels(
    stage: ProgramStage,
    dataElements: Map<string, DataElement>,
): Map<string, string> {
    const labels = new Map<string, string>();
    for (const psde of stage.programStageDataElements) {
        const de = dataElements.get(psde.dataElement.id);
        if (de) labels.set(de.id, de.formName || de.name);
    }
    return labels;
}

/** The stage's events whose date differs from their visit's. */
export function eventsOffVisitDate(
    events: FlattenedEvent[],
    visitDate: string | undefined,
): FlattenedEvent[] {
    if (!visitDate) return [];
    return events.filter((e) => eventDate(e) !== visitDate);
}
