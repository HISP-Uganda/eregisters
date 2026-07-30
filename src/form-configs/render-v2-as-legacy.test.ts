import { describe, expect, it } from "vitest";
import { BUNDLED } from "./bundled";
import { convertLegacyForm } from "./convert-to-v2";
import { renderV2AsLegacy } from "./render-v2-as-legacy";
import type { HmisCellConfig, HmisFormConfig } from "./types";

function normaliseCell(c: HmisCellConfig | undefined) {
    if (!c) return null;
    if (!c.text && !c.dataElement && !c.title) return null;
    return {
        kind: c.kind,
        text: c.text,
        dataElement: c.dataElement,
        categoryOptionCombo: c.categoryOptionCombo,
        colSpan: c.colSpan,
        rowSpan: c.rowSpan,
    };
}

function normalise(config: HmisFormConfig) {
    return config.tabs.map((t) =>
        t.sections.map((s) =>
            s.rows.map((r) =>
                (s.columns ?? []).map((_col, i) => normaliseCell(r.cells[i])),
            ),
        ),
    );
}

describe("renderV2AsLegacy round-trip", () => {
    it.each(Object.keys(BUNDLED))(
        "%s: convert then back preserves cell data",
        (id) => {
            const legacy = BUNDLED[id];
            const v2 = convertLegacyForm(legacy);
            const back = renderV2AsLegacy(v2, {});
            expect(normalise(back)).toEqual(normalise(legacy));
        },
    );

    it("inlines a ref against templates with overrides", () => {
        const back = renderV2AsLegacy(
            {
                id: "f",
                title: "f",
                tabs: [
                    {
                        key: "t",
                        label: "t",
                        sections: [
                            {
                                kind: "ref",
                                templateId: "tpl1",
                                overrides: { title: "Overridden" },
                            },
                        ],
                    },
                ],
            },
            {
                tpl1: {
                    key: "tpl1",
                    title: "Original",
                    columns: [{ key: "c0" }],
                    rows: [
                        {
                            key: "r0",
                            cells: { c0: { kind: "label", text: "hi" } },
                        },
                    ],
                },
            },
        );
        expect(back.tabs[0].sections[0].title).toBe("Overridden");
        expect(back.tabs[0].sections[0].rows[0].cells[0].text).toBe("hi");
    });

    it("drops refs whose template is missing", () => {
        const back = renderV2AsLegacy(
            {
                id: "f",
                title: "f",
                tabs: [
                    {
                        key: "t",
                        label: "t",
                        sections: [
                            { kind: "ref", templateId: "missing" },
                        ],
                    },
                ],
            },
            {},
        );
        expect(back.tabs[0].sections).toHaveLength(0);
    });
});
