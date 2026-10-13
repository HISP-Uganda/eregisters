import { describe, expect, it } from "vitest";
import type { FlattenedTrackedEntity } from "@/schemas";
import { clientColumns } from "@/screens/client-search/client-columns";
import { afterFailure, filledTerms, searchState } from "@/screens/client-search/use-client-search";

describe("filledTerms", () => {
    it("keeps only the terms that were filled in", () => {
        expect(filledTerms({ a: "Jane", b: "", c: "07" })).toEqual({ a: "Jane", c: "07" });
        expect(filledTerms(undefined)).toEqual({});
    });
});

describe("search state", () => {
    const page = { total: 7, clients: [{ trackedEntity: "a" }] as FlattenedTrackedEntity[] };

    it("is loading until this search's answer arrives, showing the previous page meanwhile", () => {
        expect(searchState(null, "s1")).toEqual({ clients: [], total: 0, loading: true, failed: false });
        expect(searchState({ key: "s1", page }, "s2")).toEqual({ ...page, loading: true, failed: false });
        expect(searchState({ key: "s2", page }, "s2")).toEqual({ ...page, loading: false, failed: false });
    });

    it("stops loading and shows the failure when a search fails", () => {
        const failed = afterFailure({ key: "s1", page }, "s2");
        expect(searchState(failed, "s2")).toEqual({ clients: [], total: 0, loading: false, failed: true });
        expect(searchState(afterFailure(null, "s1"), "s1").failed).toBe(true);
    });

    it("keeps the shown page when a reload of it fails", () => {
        const shown = { key: "s1", page };
        expect(afterFailure(shown, "s1")).toBe(shown);
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
