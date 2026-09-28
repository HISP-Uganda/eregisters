import { describe, expect, it } from "vitest";
import type { UIConfig } from "../../../schemas";
import {
    afterGroup,
    layoutGroups,
    layoutToSubsections,
    savedLayout,
    sectionBounds,
    subsectionsToLayout,
    withElementAdded,
    withElementMoved,
    withoutItem,
    withSectionInserted,
    withSectionMoved,
    withSectionRenamed,
    withSectionStyle,
    type Layout,
} from "../layout";

const S = (id: string) => ({ kind: "section" as const, id, name: id.toUpperCase() });
const E = (id: string) => ({ kind: "element" as const, id });
const ids = (layout: Layout) => layout.map((s) => (s.kind === "section" ? `#${s.id}` : s.id));

// root: r1 | #a: a1 a2 | #b: b1
const layout: Layout = [E("r1"), S("a"), E("a1"), E("a2"), S("b"), E("b1")];

describe("converting to and from subsections", () => {
    it("round-trips headers and their elements (root elements are dropped)", () => {
        const subs = layoutToSubsections(layout);
        expect(subs).toEqual([
            { id: "a", name: "A", dataElementIds: ["a1", "a2"] },
            { id: "b", name: "B", dataElementIds: ["b1"] },
        ]);
        expect(ids(subsectionsToLayout(subs))).toEqual(["#a", "a1", "a2", "#b", "b1"]);
    });

    it("loads formLayouts first, else subsections, else nothing", () => {
        const config = {
            formLayouts: { x: [S("f"), E("f1")] },
            subsections: { x: [{ id: "s", name: "S", dataElementIds: ["s1"] }], y: [{ id: "s", name: "S", dataElementIds: ["s1"] }] },
        } as unknown as UIConfig;
        expect(ids(savedLayout(config, "x"))).toEqual(["#f", "f1"]);
        expect(ids(savedLayout(config, "y"))).toEqual(["#s", "s1"]);
        expect(savedLayout(config, "z")).toEqual([]);
        expect(savedLayout(config, null)).toEqual([]);
    });
});

describe("groups", () => {
    it("groups elements under their header, with a root group first", () => {
        const groups = layoutGroups(layout);
        expect(groups.map((g) => [g.sectionId, g.sectionIndex, g.elements.map((e) => e.index)])).toEqual([
            [null, null, [0]],
            ["a", 1, [2, 3]],
            ["b", 4, [5]],
        ]);
        expect(sectionBounds(groups)).toEqual({ first: 1, last: 2 });
        expect(afterGroup(layout, groups[0])).toBe(1);
        expect(afterGroup(layout, groups[1])).toBe(4);
        expect(afterGroup(layout, groups[2])).toBe(6);
    });
});

describe("editing", () => {
    it("adds an element to the end of the active section, or before the first", () => {
        expect(ids(withElementAdded(layout, "n", "a"))).toEqual(["r1", "#a", "a1", "a2", "n", "#b", "b1"]);
        expect(ids(withElementAdded(layout, "n", null))).toEqual(["r1", "n", "#a", "a1", "a2", "#b", "b1"]);
        expect(ids(withElementAdded(layout, "n", "gone"))).toEqual([...ids(layout), "n"]);
    });

    it("moves an element within its section only", () => {
        expect(ids(withElementMoved(layout, 2, 1))).toEqual(["r1", "#a", "a2", "a1", "#b", "b1"]);
        expect(withElementMoved(layout, 3, 1)).toBe(layout); // next is a header
        expect(withElementMoved(layout, 0, -1)).toBe(layout);
    });

    it("swaps whole sections", () => {
        expect(ids(withSectionMoved(layout, 1, 1))).toEqual(["r1", "#b", "b1", "#a", "a1", "a2"]);
        expect(ids(withSectionMoved(layout, 4, -1))).toEqual(["r1", "#b", "b1", "#a", "a1", "a2"]);
        expect(withSectionMoved(layout, 1, -1)).toBe(layout);
        expect(withSectionMoved(layout, 4, 1)).toBe(layout);
    });

    it("removing a header keeps its elements in the group before", () => {
        expect(ids(withoutItem(layout, 4))).toEqual(["r1", "#a", "a1", "a2", "b1"]);
    });

    it("inserts, renames and colours headers", () => {
        expect(ids(withSectionInserted(layout, 1, "n", "New"))).toEqual(["r1", "#n", "#a", "a1", "a2", "#b", "b1"]);
        expect(withSectionRenamed(layout, 1, "Renamed")[1]).toEqual({ kind: "section", id: "a", name: "Renamed" });
        expect(withSectionRenamed(layout, 2, "x")[2]).toEqual(E("a1"));
        expect(withSectionStyle(layout, 1, { titleColor: "#f00" })[1]).toMatchObject({ titleColor: "#f00" });
    });
});
