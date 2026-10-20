import { describe, expect, it, vi } from "vitest";
import type { FlattenedEvent, FlattenedTrackedEntity, ProgramRule, ProgramRuleVariable } from "@/schemas";
import { saveVisit } from "../actions";

const state = vi.hoisted(() => ({ events: [] as any[] }));
vi.mock("@/db/collections", () => ({
    getEventsCollection: () => ({
        get toArray() { return state.events; },
        update: (id: string, update: (draft: any) => void) => {
            const row = state.events.find(event => event.event === id);
            const draft = structuredClone(row);
            update(draft);
            state.events = state.events.map(event => event.event === id ? draft : event);
            return { isPersisted: { promise: Promise.resolve() } };
        },
    }),
    getTrackedEntitiesCollection: () => ({ toArray: [], get: () => undefined }),
    getEnrollmentsCollection: () => ({ toArray: [] }),
}));
vi.mock("@/program-rules/commit-actions", () => ({ commitRuleEventActions: vi.fn(), commitEnrollmentRuleActions: vi.fn() }));
vi.mock("@/utils/record-cascades", () => ({ deleteEventWithChildren: vi.fn(), deleteTrackedEntityWithChildren: vi.fn(), resendEventWithChildren: vi.fn() }));

describe("final parent save", () => {
    it("uses edited parent history and persists assignments on a closed child form", async () => {
        const parent: FlattenedEvent = { orgUnit: "ou", followUp: false, deleted: false, createdAt: "2026-10-20", updatedAt: "2026-10-20", version: 1, lastSynced: "", syncError: "", event: "parent", programStage: "main", program: "p", enrollment: "en", trackedEntity: "tei", occurredAt: "2026-10-20", dataValues: { occurredAt: "2026-10-20", source: 1 }, syncStatus: "draft", status: "ACTIVE" };
        const child = { ...parent, event: "child", parentEvent: "parent", programStage: "child", dataValues: { occurredAt: "2026-10-20", calculated: 1, hidden: "old" } };
        state.events = [Object.freeze(parent), Object.freeze(child)];
        await saveVisit(parent, { source: 5 }, { trackedEntity: "tei", attributes: {} } as FlattenedTrackedEntity, undefined, false, {
            programRuleVariables: [{ name: "source", dataElement: { id: "source" }, programStage: { id: "main" }, programRuleVariableSourceType: "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" }] as ProgramRuleVariable[],
            programRules: [{ id: "assign", programStage: { id: "child" }, condition: "true", programRuleActions: [
                { programRuleActionType: "ASSIGN", dataElement: { id: "calculated" }, data: "#{source}" },
                { programRuleActionType: "HIDEFIELD", dataElement: { id: "hidden" } },
            ] }] as ProgramRule[],
        });
        expect(state.events.find(event => event.event === "child")).toMatchObject({ syncStatus: "pending", dataValues: { calculated: 5, hidden: undefined } });
        expect(child.dataValues).toEqual({ occurredAt: "2026-10-20", calculated: 1, hidden: "old" });
    });
});
