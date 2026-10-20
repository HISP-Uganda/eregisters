import { describe, expect, it } from "vitest";
import { filterRuleOptions } from "../option-filter";

const options = [{ id: "a", sortOrder: 3 }, { id: "b", sortOrder: 1 }, { id: "c", sortOrder: 2 }, { id: "d", sortOrder: 4 }];
const groups = new Map([["one", [{ id: "a" }, { id: "b" }]], ["two", [{ id: "b" }, { id: "c" }]]]);
describe("filterRuleOptions", () => {
    it("unions all shown groups and sorts without duplicates", () => {
        expect(filterRuleOptions(options, groups, { shownOptionGroups: ["one", "two"] }).map(o => o.id)).toEqual(["b", "c", "a"]);
    });
    it("applies hidden options and groups after all show actions", () => {
        expect(filterRuleOptions(options, groups, { shownOptionGroups: ["one", "two"], shownOptions: ["d", "a"], hiddenOptionGroups: ["one"], hiddenOptions: ["c"] }).map(o => o.id)).toEqual(["d"]);
    });
    it("uses explicit shown options as an allowlist and never invents options", () => {
        expect(filterRuleOptions(options, groups, { shownOptions: ["c", "missing"] }).map(o => o.id)).toEqual(["c"]);
    });
    it("keeps ordinary options when no show action applies", () => {
        expect(filterRuleOptions(options, groups, { hiddenOptionGroups: ["two"] }).map(o => o.id)).toEqual(["a", "d"]);
    });
});
