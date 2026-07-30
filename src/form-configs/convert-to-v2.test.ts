import { describe, expect, it } from "vitest";
import { convertLegacyForm } from "./convert-to-v2";
import type { HmisFormConfig } from "./types";

const legacy: HmisFormConfig = {
    id: "test-form",
    title: "Test form",
    editableScope: { mode: "all" },
    tabs: [
        {
            key: "t1",
            label: "Tab 1",
            sections: [
                {
                    key: "s1",
                    title: "Section 1",
                    columnCount: 2,
                    columns: [
                        { key: "c0", index: 0 },
                        { key: "c1", index: 1 },
                    ],
                    rows: [
                        {
                            key: "r1",
                            cells: [
                                { key: "r1c0", kind: "label", text: "Male" },
                                {
                                    key: "r1c1",
                                    kind: "field",
                                    dataElement: "DE1",
                                    categoryOptionCombo: "COC1",
                                    colSpan: 2,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

describe("convertLegacyForm", () => {
    it("keys cells by column key and preserves colSpan", () => {
        const v2 = convertLegacyForm(legacy);
        expect(v2.id).toBe("test-form");
        expect(v2.editableScope).toEqual({ mode: "all" });
        const slot = v2.tabs[0].sections[0];
        expect(slot.kind).toBe("inline");
        if (slot.kind !== "inline") throw new Error();
        expect(slot.section.columns.map((c) => c.key)).toEqual(["c0", "c1"]);
        expect(slot.section.rows[0].cells.c0).toEqual({
            kind: "label",
            text: "Male",
            dataElement: undefined,
            categoryOptionCombo: undefined,
            attributeOptionCombo: undefined,
            disabled: undefined,
            total: undefined,
            rowSpan: undefined,
            colSpan: undefined,
            style: undefined,
        });
        expect(slot.section.rows[0].cells.c1.colSpan).toBe(2);
    });

    it("drops blank cells (no text, no dataElement, no title)", () => {
        const withBlank: HmisFormConfig = {
            ...legacy,
            tabs: [
                {
                    ...legacy.tabs[0],
                    sections: [
                        {
                            ...legacy.tabs[0].sections[0],
                            rows: [
                                {
                                    key: "r1",
                                    cells: [
                                        { key: "r1c0", kind: "label" },
                                        {
                                            key: "r1c1",
                                            kind: "field",
                                            dataElement: "DE1",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const v2 = convertLegacyForm(withBlank);
        const slot = v2.tabs[0].sections[0];
        if (slot.kind !== "inline") throw new Error();
        expect(Object.keys(slot.section.rows[0].cells)).toEqual(["c1"]);
    });
});
