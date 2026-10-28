import { describe, expect, it } from "vitest";
import type { FlattenedTrackedEntity } from "@/schemas";
import { clientColumns } from "@/screens/client-search/client-columns";
import { filledTerms } from "@/screens/client-search/use-client-search";

describe("filledTerms", () => {
    it("keeps only the terms that were filled in", () => {
        expect(filledTerms({ a: "Jane", b: "", c: "07" })).toEqual({ a: "Jane", c: "07" });
        expect(filledTerms(undefined)).toEqual({});
    });
});

describe("clientColumns", () => {
    const program = {
        programTrackedEntityAttributes: [
            { trackedEntityAttribute: { id: "first" }, displayInList: true },
            { trackedEntityAttribute: { id: "hidden" }, displayInList: false },
            { trackedEntityAttribute: { id: "oTI0DLitzFY" }, displayInList: true },
        ],
    };
    const trackedEntityAttributes = new Map([
        ["first", { id: "first", name: "first name", displayFormName: "First name" }],
        ["hidden", { id: "hidden", name: "Hidden" }],
        ["oTI0DLitzFY", { id: "oTI0DLitzFY", name: "Village" }],
    ]);
    const columns = clientColumns({
        program,
        trackedEntityAttributes,
        orgUnit: "ou1",
        orgUnitName: "Kisugu HC III",
    } as never, new Map([["seen", { at: 0, date: "2026-10-27T09:30:00.000" }]])) as Array<{ key: string; title: string; render?: (...args: any[]) => unknown }>;

    it("lists Last Visit, the program's list attributes, then the registering facility", () => {
        expect(columns.map((c) => [c.key, c.title])).toEqual([
            ["lastVisit", "Last Visit"],
            ["first", "First name"],
            ["oTI0DLitzFY", "Village"],
            ["registeringFacility", "Registering Facility"],
        ]);
    });

    it("shows the village's bracketed part and whether this facility registered the client", () => {
        expect(columns[2].render!("Kisugu (Kisugu A)")).toBe("Kisugu A");
        const facility = columns[3].render!;
        expect(facility({ orgUnit: "ou1" } as FlattenedTrackedEntity)).toBe("Kisugu HC III");
        expect(facility({ orgUnit: "other" } as FlattenedTrackedEntity)).toBe("N/A");
    });

    it("shows the Last Visit date and time, or a dash for a client never visited", () => {
        const lastVisit = columns[0].render!;
        expect(lastVisit({ trackedEntity: "seen" } as FlattenedTrackedEntity)).toBe("2026-10-27 09:30");
        expect(lastVisit({ trackedEntity: "never" } as FlattenedTrackedEntity)).toBe("—");
    });

    it("colours Last Visit only when it is today", () => {
        const today = { at: Date.now(), date: new Date().toISOString() };
        const old = { at: Date.parse("2020-01-01T10:00:00"), date: "2020-01-01T10:00:00" };
        const [lastVisit] = clientColumns(
            { program, trackedEntityAttributes, orgUnit: "ou1", orgUnitName: "x" } as never,
            new Map([["today", today], ["old", old]]),
        ) as Array<{ onCell: (r: FlattenedTrackedEntity) => { style?: { color?: string } } }>;
        expect(lastVisit.onCell({ trackedEntity: "today" } as FlattenedTrackedEntity).style?.color).toBeDefined();
        expect(lastVisit.onCell({ trackedEntity: "old" } as FlattenedTrackedEntity).style).toBeUndefined();
        expect(lastVisit.onCell({ trackedEntity: "never" } as FlattenedTrackedEntity).style).toBeUndefined();
    });
});
