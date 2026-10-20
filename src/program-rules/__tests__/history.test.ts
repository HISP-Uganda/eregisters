import { describe, expect, it } from "vitest";
import { resolveVariableHistory } from "../history";
import { resolveVariableValues, type RuleContext } from "../variables";
import type { ProgramRuleVariable } from "@/schemas";

const variables = [
    ["current", "DATAELEMENT_CURRENT_EVENT"], ["previous", "DATAELEMENT_PREVIOUS_EVENT"],
    ["program", "DATAELEMENT_NEWEST_EVENT_PROGRAM"], ["stage", "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE"],
].map(([name, programRuleVariableSourceType]) => ({ name, programRuleVariableSourceType, dataElement: { id: "de" } })) as ProgramRuleVariable[];
const context: RuleContext = {
    currentEventId: "current", currentEventCreatedAt: "2026-01-02T12:00:00Z", programStage: "s",
    dataValues: { occurredAt: "2026-01-02", de: 4 },
    allEnrollmentEvents: [
        { event: "first", programStage: "s", occurredAt: "2026-01-01", dataValues: { de: 1 } },
        { event: "other", programStage: "other", occurredAt: "2026-01-02", createdAt: "2026-01-02T11:00:00Z", dataValues: { de: 2 } },
        { event: "after", programStage: "s", occurredAt: "2026-01-02", createdAt: "2026-01-02T13:00:00Z", dataValues: { de: 3 } },
        { event: "scheduled", status: "SCHEDULE", programStage: "s", occurredAt: "2026-01-04", dataValues: { de: 99 } },
        { event: "undated", programStage: "s", occurredAt: "", dataValues: { de: 100 } },
        { event: "empty", programStage: "s", occurredAt: "2026-01-05", dataValues: { de: "" } },
    ],
};

describe("source-specific history", () => {
    it("uses current only, prior enrollment events, or the full program/stage history", () => {
        const histories = resolveVariableHistory(variables, context);
        expect(histories.current.map((entry) => entry.value)).toEqual([4]);
        expect(histories.previous.map((entry) => entry.value)).toEqual([1, 2]);
        expect(histories.program.map((entry) => entry.value)).toEqual([1, 2, 4, 3]);
        expect(histories.stage.map((entry) => entry.value)).toEqual([1, 4, 3]);
    });
    it("uses the same selected values for expressions and lastEventDate", () => {
        expect(resolveVariableValues(variables, context)).toMatchObject({ current: 4, previous: 2, program: 3, stage: 3, event_date: "2026-01-02" });
    });
});
