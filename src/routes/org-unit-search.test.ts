import { describe, expect, it } from "vitest";
import { buildOrgUnitSearchIndex, matchOrgUnit } from "./org-unit-search";

const fixture = [
    { id: "root", name: "Uganda", path: "/root" },
    {
        id: "kampala",
        name: "Kampala District",
        path: "/root/kampala",
        parent: { id: "root" },
    },
    {
        id: "kawempe",
        name: "Kawempe HC IV",
        path: "/root/kampala/kawempe",
        parent: { id: "kampala" },
    },
    {
        id: "gulu",
        name: "Gulu District",
        path: "/root/gulu",
        parent: { id: "root" },
    },
];

describe("matchOrgUnit", () => {
    const index = buildOrgUnitSearchIndex(fixture);

    it("matches own name case-insensitively", () => {
        expect(matchOrgUnit(index, "kawempe", "KAWEMPE")).toBe(true);
        expect(matchOrgUnit(index, "kawempe", "kawempe")).toBe(true);
    });

    it("matches an ancestor's name (district query surfaces child facility)", () => {
        expect(matchOrgUnit(index, "kawempe", "kampala")).toBe(true);
    });

    it("does not match unrelated names", () => {
        expect(matchOrgUnit(index, "kawempe", "gulu")).toBe(false);
    });

    it("tolerates extra whitespace", () => {
        expect(matchOrgUnit(index, "kawempe", "  kampala   district  ")).toBe(
            true,
        );
    });

    it("returns true for empty/whitespace-only query", () => {
        expect(matchOrgUnit(index, "kawempe", "")).toBe(true);
        expect(matchOrgUnit(index, "kawempe", "   ")).toBe(true);
    });

    it("returns false for an unknown node id", () => {
        expect(matchOrgUnit(index, "nonexistent", "kampala")).toBe(false);
    });
});
