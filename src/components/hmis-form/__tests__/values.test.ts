import { describe, expect, it } from "vitest";
import type { HmisRowConfig } from "@/form-configs/types";
import {
    cleanNumericValue,
    dataValueKey,
    formatVerifiedAt,
    isCellEditable,
    placeCells,
    toDataValues,
} from "@/components/hmis-form/values";

const row = (...cells: Array<{ colSpan?: number; rowSpan?: number }>) =>
    ({ key: "r", cells: cells.map((c, i) => ({ key: `c${i}`, kind: "text", ...c })) }) as unknown as HmisRowConfig;

describe("values", () => {
    it("keys a value by its ids and splits them back for submission", () => {
        const key = dataValueKey("de1", "coc1", "aoc1");
        const values = new Map([
            [key, "12"],
            [dataValueKey("de2", "coc1", "aoc1"), ""],
        ]);
        expect(toDataValues(values)).toEqual([
            { dataElement: "de1", categoryOptionCombo: "coc1", attributeOptionCombo: "aoc1", value: "12" },
        ]);
    });

    it("keeps only digits, and formats a verification date", () => {
        expect(cleanNumericValue("1,2a3")).toBe("123");
        expect(cleanNumericValue(null)).toBe("");
        expect(formatVerifiedAt("2026-03-05T10:00:00")).toBe("2026-03-05");
        expect(formatVerifiedAt("not a date")).toBe("not a date");
    });

    it("lets a scope allow cells by title", () => {
        const cell = { title: "OPD attendance", kind: "field" } as never;
        expect(isCellEditable(cell, undefined)).toBe(true);
        expect(isCellEditable(cell, { mode: "none" } as never)).toBe(false);
        expect(isCellEditable(cell, { mode: "some", allow: [/OPD/] } as never)).toBe(true);
        expect(isCellEditable(cell, { mode: "some", allow: [/IPD/] } as never)).toBe(false);
        expect(isCellEditable({ kind: "field" } as never, { mode: "some", allow: [/.*/] } as never)).toBe(false);
    });
});

describe("placeCells", () => {
    it("places cells after column spans", () => {
        expect(placeCells(row({ colSpan: 2 }, {}, {}), new Map()).startColumns).toEqual([0, 2, 3]);
    });

    it("skips a column still covered from above", () => {
        const first = placeCells(row({ rowSpan: 3 }, {}), new Map());
        expect(first.next).toEqual(new Map([[0, 1]]));
        expect(placeCells(row({}, {}), first.next).startColumns).toEqual([1, 2]);
    });

    it("as it was: a rowSpan of 2 doesn't cover its column in the next row", () => {
        const first = placeCells(row({ rowSpan: 2 }, {}), new Map());
        expect(first.next.size).toBe(0);
        expect(placeCells(row({}), first.next).startColumns).toEqual([0]);
    });
});
