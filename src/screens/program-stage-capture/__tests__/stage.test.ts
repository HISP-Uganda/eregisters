import { describe, expect, it } from "vitest";
import type { DataElement, FlattenedEvent, ProgramStage } from "../../../schemas";
import {
    eventDate,
    eventsOffVisitDate,
    stageDataElementIds,
    stageLabels,
    stageMandatoryIds,
    toRuleEvents,
} from "../stage";

const event = (id: string, occurredAt: string, dataValues: Record<string, any> = {}) =>
    ({ event: id, programStage: "ps", occurredAt, dataValues }) as unknown as FlattenedEvent;

const stage = {
    programStageDataElements: [
        { dataElement: { id: "a" }, compulsory: true },
        { dataElement: { id: "b" }, compulsory: false },
        { dataElement: { id: "c" }, compulsory: true },
    ],
} as unknown as ProgramStage;

describe("eventDate", () => {
    it("prefers the form's occurredAt over the stored one", () => {
        expect(eventDate(event("e", "2026-01-01", { occurredAt: "2026-02-02" }))).toBe("2026-02-02");
        expect(eventDate(event("e", "2026-01-01"))).toBe("2026-01-01");
    });
});

describe("eventsOffVisitDate", () => {
    it("lists the events dated differently from the visit", () => {
        const events = [event("same", "2026-01-01"), event("off", "2026-01-05")];
        expect(eventsOffVisitDate(events, "2026-01-01").map((e) => e.event)).toEqual(["off"]);
    });
    it("lists none without a visit date", () => {
        expect(eventsOffVisitDate([event("e", "2026-01-01")], undefined)).toEqual([]);
    });
});

describe("the stage's fields", () => {
    it("ids, mandatory ids and labels", () => {
        expect([...stageDataElementIds(stage)]).toEqual(["a", "b", "c"]);
        expect(stageMandatoryIds(stage)).toEqual(["a", "c"]);
        const dataElements = new Map([
            ["a", { id: "a", name: "A name", formName: "A form" }],
            ["b", { id: "b", name: "B name" }],
        ]) as unknown as Map<string, DataElement>;
        expect(stageLabels(stage, dataElements)).toEqual(
            new Map([
                ["a", "A form"],
                ["b", "B name"],
            ]),
        );
    });
});

describe("toRuleEvents", () => {
    it("keeps what program rules read", () => {
        const e = { ...event("e", "2026-01-01", { x: 1 }), syncStatus: "draft" } as FlattenedEvent;
        expect(toRuleEvents([e])).toEqual([
            { event: "e", programStage: "ps", occurredAt: "2026-01-01", dataValues: { x: 1 } },
        ]);
    });
});
