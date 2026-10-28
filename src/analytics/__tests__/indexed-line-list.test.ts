import { describe, expect, it } from "vitest";
import { buildLineListIndex, IndexedLineListEngine } from "@/analytics/indexed-line-list";
import { DATE_RANGE_PREFIX, EMPTY_FILTER_VALUE, NUMBER_RANGE_PREFIX, TEXT_SEARCH_PREFIX } from "@/analytics/line-list-filters";
import type { AnalyticsColumn, AnalyticsRow } from "@/analytics/types";

const column = (key: string, valueKind: AnalyticsColumn["valueKind"] = "string"): AnalyticsColumn => ({
    key, label: key, source: "parentEvent", sourceFieldId: key, valueKind,
    groupPath: [], defaultVisible: true,
    pivot: { canUseAsDimension: true, canUseAsMeasure: false, canUseForDistinctCount: true },
});

describe("IndexedLineListEngine", () => {
    it("discards stale dataset builds and filter requests", async () => {
        const columns = [column("name")];
        const older = [row("old", { name: { raw: "Old", display: "Old" } })];
        const current = [row("new", { name: { raw: "New", display: "New" } })];
        const engine = new IndexedLineListEngine({ yieldToMain: async () => {}, rowsPerTask: 1 });
        const firstLoad = engine.loadDataset(older, columns, new Map());
        const secondLoad = engine.loadDataset(current, columns, new Map());
        expect(await firstLoad).toBe(false);
        expect(await secondLoad).toBe(true);

        const firstRequest = engine.request({
            filteredInfo: { name: [`${TEXT_SEARCH_PREFIX}old`] }, visibleColumnKeys: ["name"],
        });
        const secondRequest = engine.request({
            filteredInfo: { name: [`${TEXT_SEARCH_PREFIX}new`] }, visibleColumnKeys: ["name"],
        });
        expect(await firstRequest).toBeNull();
        expect((await secondRequest)?.count).toBe(1);
        expect(engine.getCommitted()?.count).toBe(1);
    });

    it("invalidates pending work when the dataset is cleared", async () => {
        const columns = [column("name")];
        const engine = new IndexedLineListEngine({ yieldToMain: async () => {} });
        await engine.loadDataset([row("one", { name: { raw: "One", display: "One" } })], columns, new Map());
        const pending = engine.request({ filteredInfo: {}, visibleColumnKeys: ["name"] });
        engine.clear();
        expect(await pending).toBeNull();
        expect(engine.getCommitted()).toBeNull();
    });
});

const row = (id: string, values: AnalyticsRow["values"]): AnalyticsRow => ({
    id, values, trackedEntity: {} as AnalyticsRow["trackedEntity"],
    parentEvent: {} as AnalyticsRow["parentEvent"], enrollment: undefined,
    childEventsByStage: {}, linkedParentByStage: {},
});

describe("buildLineListIndex", () => {
    it("filters numeric raw values by inclusive or open ranges and preserves legacy searches", async () => {
        const columns = [column("amount", "number")];
        const rows = [
            row("negative", { amount: { raw: "-2.5", display: "-2.5" } }),
            row("zero", { amount: { raw: 0, display: "0" } }),
            row("upper", { amount: { raw: 10, display: "10" } }),
            row("large", { amount: { raw: 1234, display: "1234" } }),
            row("empty", { amount: { raw: null, display: "" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const ids = (selected: string[]) => Array.from(index.evaluate({
            filteredInfo: { amount: selected }, visibleColumnKeys: ["amount"],
        }).indices, (position) => rows[position].id);
        expect(ids([`${NUMBER_RANGE_PREFIX}-2.5:10`, EMPTY_FILTER_VALUE]))
            .toEqual(["negative", "zero", "upper", "empty"]);
        expect(ids([`${NUMBER_RANGE_PREFIX}:0`])).toEqual(["negative", "zero"]);
        expect(ids([`${NUMBER_RANGE_PREFIX}10:`])).toEqual(["upper", "large"]);
        expect(ids([`${TEXT_SEARCH_PREFIX}234`])).toEqual(["large"]);
        expect(ids(["10"])).toEqual(["upper"]);
    });
    it("matches a case-insensitive substring or an empty text cell in source order", async () => {
        const columns = [column("name")];
        const rows = [
            row("one", { name: { raw: "Alpha", display: "Alpha" } }),
            row("two", { name: { raw: "Beta", display: "Beta" } }),
            row("three", { name: { raw: "", display: " " } }),
            row("four", { name: { raw: "ALPHABET", display: "ALPHABET" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const result = index.evaluate({
            filteredInfo: { name: [`${TEXT_SEARCH_PREFIX}alp`, EMPTY_FILTER_VALUE] },
            visibleColumnKeys: ["name"],
        });
        expect(Array.from(result.indices, (position) => rows[position].id)).toEqual(["one", "three", "four"]);
        expect(result.count).toBe(3);
    });

    it("includes both date range endpoints and empty cells", async () => {
        const columns = [column("birthDate", "date")];
        const rows = [
            row("start", { birthDate: { raw: "2024-01-01", display: "2024-01-01" } }),
            row("end", { birthDate: { raw: "2024-12-31", display: "2024-12-31" } }),
            row("after", { birthDate: { raw: "2025-01-01", display: "2025-01-01" } }),
            row("empty", { birthDate: { raw: "", display: "" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const result = index.evaluate({
            filteredInfo: { birthDate: [`${DATE_RANGE_PREFIX}2024-01-01:2024-12-31`, EMPTY_FILTER_VALUE] },
            visibleColumnKeys: ["birthDate"],
        });
        expect(Array.from(result.indices, (position) => rows[position].id)).toEqual(["start", "end", "empty"]);
    });

    it("matches selected option IDs against raw codes and multi-select tokens", async () => {
        const columns = [{ ...column("choice"), optionSetId: "set" }];
        const options = new Map([["set", [
            { id: "a", code: "ALPHA", name: "Alpha", optionSet: "set", sortOrder: 1 },
            { id: "b", code: "BETA", name: "Beta", optionSet: "set", sortOrder: 2 },
        ]]]);
        const rows = [
            row("code", { choice: { raw: "ALPHA", display: "Alpha" } }),
            row("multi", { choice: { raw: "BETA, a", display: "Beta, Alpha" } }),
            row("empty", { choice: { raw: "", display: "" } }),
            row("other", { choice: { raw: "BETA", display: "Beta" } }),
        ];
        const index = await buildLineListIndex(rows, columns, options, { yieldToMain: async () => {} });
        const result = index.evaluate({
            filteredInfo: { choice: ["a", EMPTY_FILTER_VALUE] },
            visibleColumnKeys: ["choice"],
        });
        expect(Array.from(result.indices, (position) => rows[position].id)).toEqual(["code", "multi", "empty"]);
    });

    it("ANDs visible columns while keeping hidden filters dormant and computed values exact", async () => {
        const columns = [column("name"), { ...column("group", "number"), isComputed: true }];
        const rows = [
            row("first", { name: { raw: "Alpha", display: "Alpha" }, group: { raw: 1, display: "A" } }),
            row("second", { name: { raw: "Alpha", display: "Alpha" }, group: { raw: 2, display: "B" } }),
            row("third", { name: { raw: "Beta", display: "Beta" }, group: { raw: 1, display: "A" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const filteredInfo = { name: [`${TEXT_SEARCH_PREFIX}alp`], group: ["A"] };
        const both = index.evaluate({ filteredInfo, visibleColumnKeys: ["name", "group"] });
        expect(Array.from(both.indices, (position) => rows[position].id)).toEqual(["first"]);
        const hidden = index.evaluate({ filteredInfo, visibleColumnKeys: ["name"] });
        expect(Array.from(hidden.indices, (position) => rows[position].id)).toEqual(["first", "second"]);
        const exact = index.evaluate({
            filteredInfo: { group: [`${TEXT_SEARCH_PREFIX}A`] }, visibleColumnKeys: ["group"],
        });
        expect(exact.count).toBe(0);
    });

    it("sorts every matching row by computed raw value with stable ties", async () => {
        const columns = [{ ...column("ageGroup", "number"), isComputed: true }];
        const rows = [
            row("two", { ageGroup: { raw: 2, display: "Two" } }),
            row("one-a", { ageGroup: { raw: 1, display: "One" } }),
            row("missing", { ageGroup: { raw: undefined, display: "" } }),
            row("one-b", { ageGroup: { raw: 1, display: "One" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const base = { filteredInfo: {}, visibleColumnKeys: ["ageGroup"], sortedColumnKey: "ageGroup" };
        const ascending = index.evaluate({ ...base, sortedOrder: "ascend" });
        const descending = index.evaluate({ ...base, sortedOrder: "descend" });
        expect(Array.from(ascending.indices, (position) => rows[position].id)).toEqual(["one-a", "one-b", "two", "missing"]);
        expect(Array.from(descending.indices, (position) => rows[position].id)).toEqual(["two", "one-a", "one-b", "missing"]);
        const hiddenSort = index.evaluate({ ...base, visibleColumnKeys: [], sortedOrder: "ascend" });
        expect(Array.from(hiddenSort.indices, (position) => rows[position].id)).toEqual(["two", "one-a", "missing", "one-b"]);
    });

    it("sorts a non-finite computed value with the empty cells, last", async () => {
        const columns = [{ ...column("score", "number"), isComputed: true }];
        const rows = [
            row("two", { score: { raw: 2, display: "Two" } }),
            row("nan", { score: { raw: Number.NaN, display: "NaN" } }),
            row("one", { score: { raw: 1, display: "One" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const result = index.evaluate({ filteredInfo: {}, visibleColumnKeys: ["score"], sortedColumnKey: "score", sortedOrder: "ascend" });
        expect(Array.from(result.indices, (position) => rows[position].id)).toEqual(["one", "two", "nan"]);
    });

    it("sorts text naturally, ignoring case, with empty cells last both ways", async () => {
        const columns = [column("ward")];
        const rows = [
            row("w10", { ward: { raw: "Ward 10", display: "Ward 10" } }),
            row("none", { ward: { raw: "", display: "" } }),
            row("w2", { ward: { raw: "ward 2", display: "ward 2" } }),
            row("a", { ward: { raw: "Annex", display: "Annex" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const sorted = (sortedOrder: "ascend" | "descend") => Array.from(index.evaluate({
            filteredInfo: {}, visibleColumnKeys: ["ward"], sortedColumnKey: "ward", sortedOrder,
        }).indices, (position) => rows[position].id);
        expect(sorted("ascend")).toEqual(["a", "w2", "w10", "none"]);
        expect(sorted("descend")).toEqual(["w10", "w2", "a", "none"]);
    });

    it("sorts numbers by value and date-times by time", async () => {
        const columns = [column("weight", "number"), column("seen", "datetime")];
        const rows = [
            row("heavy", { weight: { raw: "100", display: "100" }, seen: { raw: "2026-08-26T10:30:00.000Z", display: "26 Aug 10:30" } }),
            row("light", { weight: { raw: "9", display: "9" }, seen: { raw: "2026-08-26T09:15:00.000Z", display: "26 Aug 09:15" } }),
            row("blank", { weight: { raw: "", display: "" }, seen: { raw: "2026-08-25T23:00:00.000Z", display: "25 Aug 23:00" } }),
        ];
        const index = await buildLineListIndex(rows, columns, new Map(), { yieldToMain: async () => {} });
        const sorted = (key: string) => Array.from(index.evaluate({
            filteredInfo: {}, visibleColumnKeys: [key], sortedColumnKey: key, sortedOrder: "ascend",
        }).indices, (position) => rows[position].id);
        expect(sorted("weight")).toEqual(["light", "heavy", "blank"]);
        expect(sorted("seen")).toEqual(["blank", "light", "heavy"]);
    });

    it("sorts option-set values in the option set's order, not alphabetically", async () => {
        const columns = [{ ...column("severity"), optionSetId: "sev" }];
        const option = (code: string, sortOrder: number) =>
            ({ id: `${code}-id`, code, name: code, optionSet: "sev", sortOrder });
        const optionSets = new Map([["sev", [option("Mild", 1), option("Moderate", 2), option("Severe", 3)]]]);
        const rows = [
            row("severe", { severity: { raw: "Severe", display: "Severe" } }),
            row("mild", { severity: { raw: "Mild", display: "Mild" } }),
            row("moderate", { severity: { raw: "Moderate", display: "Moderate" } }),
        ];
        const index = await buildLineListIndex(rows, columns, optionSets, { yieldToMain: async () => {} });
        const result = index.evaluate({ filteredInfo: {}, visibleColumnKeys: ["severity"], sortedColumnKey: "severity", sortedOrder: "ascend" });
        expect(Array.from(result.indices, (position) => rows[position].id)).toEqual(["mild", "moderate", "severe"]);
    });
});
