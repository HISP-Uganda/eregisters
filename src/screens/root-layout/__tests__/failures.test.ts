import { describe, expect, it } from "vitest";
import type { FlattenedEnrollment, FlattenedEvent, FlattenedTrackedEntity } from "@/schemas";
import { failurePreview, firstErrorLine, shortId } from "@/screens/root-layout/failures";

const ev = (id: string, error = "boom") =>
    ({ event: id, programStage: "ps1", syncError: error }) as unknown as FlattenedEvent;
const en = (id: string) =>
    ({ enrollment: id, trackedEntity: "teLongId123", syncError: "enrollment failed" }) as unknown as FlattenedEnrollment;
const te = (id: string) => ({ trackedEntity: id, syncError: null }) as unknown as FlattenedTrackedEntity;

describe("failurePreview", () => {
    it("lists events, then enrollments, then clients, with stage names and short ids", () => {
        const { items, remaining } = failurePreview(
            { events: [ev("eventId12345")], enrollments: [en("enrollId99")], trackedEntities: [te("te1")] },
            new Map([["ps1", "Laboratory Tests"]]),
        );
        expect(items).toEqual([
            { key: "event-eventId12345", typeLabel: "EVENT", typeColor: "#7c3aed", title: "Laboratory Tests", subtitle: "eventId1…", error: "boom" },
            { key: "enrollment-enrollId99", typeLabel: "ENROLL", typeColor: "#0891b2", title: "enrollId…", subtitle: "client teLongId…", error: "enrollment failed" },
            { key: "te-te1", typeLabel: "CLIENT", typeColor: "#ea580c", title: "te1", error: "" },
        ]);
        expect(remaining).toBe(0);
    });

    it("shows at most six and counts the rest", () => {
        const events = Array.from({ length: 9 }, (_, i) => ev(`e${i}`));
        const { items, remaining } = failurePreview({ events, enrollments: [], trackedEntities: [] }, new Map());
        expect(items).toHaveLength(6);
        expect(items[0].title).toBe("ps1");
        expect(remaining).toBe(3);
    });
});

describe("error text", () => {
    it("keeps the first line, cut at 90 characters", () => {
        expect(firstErrorLine("  first  \nsecond")).toBe("first");
        expect(firstErrorLine("x".repeat(100))).toBe(`${"x".repeat(90)}…`);
        expect(firstErrorLine(undefined)).toBe("");
        expect(shortId("")).toBe("");
    });
});
