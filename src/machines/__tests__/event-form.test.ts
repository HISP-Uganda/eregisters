import { createActor, fromPromise, waitFor } from "xstate";
import type { InputFrom } from "xstate";
import { describe, expect, it, vi } from "vitest";
import type { FormInstance } from "antd";
import type { FlattenedEvent } from "@/schemas";
import { eventFormMachine } from "../event-form";

vi.mock("@/db/collections", () => ({ getEventsCollection: vi.fn() }));

describe("event date rules during persistence", () => {
    it.each([
        [undefined, "2026-01-02"],
        ["2026-01-02", undefined],
        ["2026-01-02", ""],
    ])("updates rules and queues a save when the date changes from %s to %s", async (initialDate, nextDate) => {
        let finishSave!: () => void;
        const pendingSave = new Promise<void>((resolve) => { finishSave = resolve; });
        const persist = vi.fn(({ input }: { input: { event: FlattenedEvent; formData: Record<string, any> } }) => {
            return pendingSave;
        });
        const machine = eventFormMachine.provide({
            actors: { persist: fromPromise(persist) },
        });
        const values: Record<string, any> = {};
        const form = {
            setFieldsValue: (updates: Record<string, any>) => Object.assign(values, updates),
            getFieldsValue: () => ({ ...values }),
            getFieldValue: (key: string) => values[key],
        } as unknown as FormInstance;
        const input = {
            event: { event: "e", occurredAt: "2026-10-20", dataValues: { occurredAt: initialDate } },
            program: "p",
            programStage: "s",
            programRules: [{
                id: "date-required",
                condition: "d2:hasValue(V{event_date})",
                program: { id: "p" },
                programRuleActions: [{ programRuleActionType: "HIDEFIELD", dataElement: { id: "target" } }],
            }],
            programRuleVariables: [],
            enrollment: {},
            trackedEntity: { attributes: {} },
            validDataElements: new Set<string>(),
            allEnrollmentEvents: [],
            form,
        } as unknown as InputFrom<typeof machine>;
        const actor = createActor(machine, { input }).start();
        try {
            expect(actor.getSnapshot().context.ruleResult.hiddenFields).toEqual(initialDate ? ["target"] : []);
            actor.send({ type: "FIELD_CHANGED", formData: { other: "value" } });
            expect(actor.getSnapshot().matches("persisting")).toBe(true);
            form.setFieldsValue({ occurredAt: nextDate });
            actor.send({ type: "FIELD_CHANGED", formData: { occurredAt: nextDate } });
            expect(actor.getSnapshot().context.ruleResult.hiddenFields).toEqual(nextDate ? ["target"] : []);
            expect(persist).toHaveBeenCalledTimes(1);
            finishSave();
            await waitFor(actor, (snapshot) => snapshot.matches("editing"));
            expect(actor.getSnapshot().context.formData.occurredAt).toBe(nextDate);
            expect(actor.getSnapshot().context.ruleResult.hiddenFields).toEqual(nextDate ? ["target"] : []);
            expect(persist).toHaveBeenCalledTimes(2);
            expect(persist.mock.calls[1][0].input.formData.occurredAt).toBe(nextDate);
        } finally {
            actor.stop();
        }
    });
});
