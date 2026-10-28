import { describe, expect, it } from "vitest";
import type { FlattenedEvent } from "@/schemas";
import { materializeEventActions, parseCreateEventData } from "../action-effects";
const source = { event: "source", enrollment: "enroll", program: "program", programStage: "parent", orgUnit: "unit", trackedEntity: "person", occurredAt: "2026-01-01", dataValues: { occurredAt: "2026-02-01" } } as unknown as FlattenedEvent;
const options = { generateUid: () => "new-event", now: "2026-03-01T10:00:00Z" };

describe("event action effects", () => {
    it("parses official uid:value pairs without splitting strings or functions", () => {
        const seen: string[] = [];
        const parsed = parseCreateEventData("AcMrnleqHqc:100,AqK1IHqCkEE:'A,B:C',Abcdefghijk:d2:concatenate('a','b')", (expression) => { seen.push(expression); return expression; });
        expect(parsed).toEqual({ AcMrnleqHqc: "100", AqK1IHqCkEE: "'A,B:C'", Abcdefghijk: "d2:concatenate('a','b')" });
        expect(seen).toHaveLength(3);
    });
    it("rejects malformed assignments instead of partially creating an event", () => {
        expect(() => parseCreateEventData("bad:1", () => 1)).toThrow();
        expect(() => parseCreateEventData("AcMrnleqHqc:'unclosed", () => 1)).toThrow();
        expect(() => parseCreateEventData("AcMrnleqHqc:", () => 1)).toThrow();
    });
    it("creates active rows from parent dataValues date only", () => {
        const [event] = materializeEventActions([{ actionId: "action", type: "CREATEEVENT", programStage: "child", dataValues: { AcMrnleqHqc: 100 } }], source, [], options);
        expect(event).toMatchObject({ event: "new-event", parentEvent: "source", status: "ACTIVE", occurredAt: "2026-02-01", dataValues: { occurredAt: "2026-02-01", AcMrnleqHqc: 100 }, ruleActionKey: "source:action:child", syncStatus: "draft" });
    });
    it("never falls back to today or top-level parent occurredAt", () => {
        expect(materializeEventActions([{ actionId: "a", type: "CREATEEVENT", programStage: "child" }], { ...source, dataValues: {} }, [], options)).toEqual([]);
    });
    it("schedules with no actual occurrence date", () => {
        const [event] = materializeEventActions([{ actionId: "a", type: "SCHEDULEEVENT", programStage: "child", date: "2026-04-01" }], source, [], options);
        expect(event).toMatchObject({ status: "SCHEDULE", occurredAt: "", scheduledAt: "2026-04-01", dataValues: {} });
    });
    it("skips invalid calendar dates", () => {
        expect(materializeEventActions([{ actionId: "a", type: "SCHEDULEEVENT", programStage: "child", date: "2026-02-30" }], source, [], options)).toEqual([]);
    });
    it("deduplicates scheduling by enrollment and stage across existing events and commands", () => {
        const command = { actionId: "a", type: "SCHEDULEEVENT" as const, programStage: "child", date: "2026-04-01" };
        expect(materializeEventActions([command], source, [{ enrollment: "enroll", programStage: "child" }], options)).toEqual([]);
        expect(materializeEventActions([command, { ...command, actionId: "b" }], source, [], options)).toHaveLength(1);
        expect(materializeEventActions([command], source, [{ enrollment: "other", programStage: "child" }], options)).toHaveLength(1);
    });
    it("creates once per source/action while allowing later repeatable-stage events", () => {
        const command = { actionId: "a", type: "CREATEEVENT" as const, programStage: "child" };
        const [created] = materializeEventActions([command, command], source, [], options);
        expect(materializeEventActions([command], source, [created], options)).toEqual([]);
        expect(materializeEventActions([command], { ...source, event: "later" }, [created], options)).toHaveLength(1);
    });
    it("stamps each event from one save with its own creation time, in action order", () => {
        const events = materializeEventActions([
            { actionId: "a", type: "CREATEEVENT", programStage: "child" },
            { actionId: "b", type: "CREATEEVENT", programStage: "other" },
        ], source, [], options);
        expect(events.map((event) => [event.createdAt, event.updatedAt])).toEqual([
            ["2026-03-01T10:00:00.000Z", "2026-03-01T10:00:00.000Z"],
            ["2026-03-01T10:00:00.001Z", "2026-03-01T10:00:00.001Z"],
        ]);
    });
    it("does not mutate source values or existing rows", () => {
        const original = JSON.stringify(source);
        materializeEventActions([{ actionId: "a", type: "CREATEEVENT", programStage: "child" }], source, [], options);
        expect(JSON.stringify(source)).toBe(original);
    });
});
