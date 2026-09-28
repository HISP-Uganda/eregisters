import { describe, expect, it } from "vitest";
import type { FlattenedTrackedEntity } from "../../../schemas";
import { clientColumns } from "../client-columns";
import { filledTerms } from "../use-client-search";

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
    } as never) as Array<{ key: string; title: string; render?: (...args: any[]) => unknown }>;

    it("lists the program's list attributes, then the registering facility", () => {
        expect(columns.map((c) => [c.key, c.title])).toEqual([
            ["first", "First name"],
            ["oTI0DLitzFY", "Village"],
            ["registeringFacility", "Registering Facility"],
        ]);
    });

    it("shows the village's bracketed part and whether this facility registered the client", () => {
        expect(columns[1].render!("Kisugu (Kisugu A)")).toBe("Kisugu A");
        const facility = columns[2].render!;
        expect(facility({ orgUnit: "ou1" } as FlattenedTrackedEntity)).toBe("Kisugu HC III");
        expect(facility({ orgUnit: "other" } as FlattenedTrackedEntity)).toBe("N/A");
    });
});
