import { describe, expect, it } from "vitest";
import type { FormConfigDoc } from "../../form-configs/v2-types";
import {
    addSection,
    addTab,
    attachTemplate,
    deleteColumn,
    deleteTab,
    detachTemplate,
    extractTemplate,
    insertColumn,
    insertRow,
    moveColumn,
    moveTab,
    renameColumn,
    renameTab,
    setCell,
} from "./reducers";

function baseDoc(): FormConfigDoc {
    return {
        version: 2,
        forms: {
            f1: {
                id: "f1",
                title: "Form 1",
                tabs: [
                    {
                        key: "t1",
                        label: "Tab 1",
                        sections: [
                            {
                                kind: "inline",
                                section: {
                                    key: "s1",
                                    title: "Section 1",
                                    columns: [{ key: "c0" }],
                                    rows: [
                                        {
                                            key: "r1",
                                            cells: {
                                                c0: {
                                                    kind: "label",
                                                    text: "a",
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        },
        templates: {},
    };
}

describe("editor reducers", () => {
    it("addTab appends a new tab", () => {
        const next = addTab(baseDoc(), "f1", "New Tab");
        expect(next.forms.f1.tabs).toHaveLength(2);
        expect(next.forms.f1.tabs[1].label).toBe("New Tab");
    });

    it("renameTab updates label", () => {
        const next = renameTab(baseDoc(), "f1", "t1", "Renamed");
        expect(next.forms.f1.tabs[0].label).toBe("Renamed");
    });

    it("moveTab swaps neighbours", () => {
        const withTwo = addTab(baseDoc(), "f1", "Second");
        const moved = moveTab(withTwo, "f1", 1, -1);
        expect(moved.forms.f1.tabs[0].label).toBe("Second");
    });

    it("deleteTab removes the tab", () => {
        const next = deleteTab(baseDoc(), "f1", "t1");
        expect(next.forms.f1.tabs).toHaveLength(0);
    });

    it("addSection appends an inline section to a tab", () => {
        const next = addSection(baseDoc(), "f1", "t1", "New Section");
        const t = next.forms.f1.tabs[0];
        expect(t.sections).toHaveLength(2);
        const s = t.sections[1];
        if (s.kind !== "inline") throw new Error("expected inline");
        expect(s.section.title).toBe("New Section");
    });

    it("insertRow adds a row to a section", () => {
        const next = insertRow(baseDoc(), "f1", "t1", 0);
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.rows).toHaveLength(2);
    });

    it("setCell writes into a cell", () => {
        const next = setCell(baseDoc(), "f1", "t1", 0, "r1", "c0", {
            kind: "field",
            dataElement: "DE1",
        });
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.rows[0].cells.c0).toEqual({
            kind: "field",
            dataElement: "DE1",
        });
    });

    it("setCell with null clears the cell", () => {
        const next = setCell(baseDoc(), "f1", "t1", 0, "r1", "c0", null);
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.rows[0].cells.c0).toBeUndefined();
    });

    it("insertColumn appends a column", () => {
        const next = insertColumn(baseDoc(), "f1", "t1", 0, "New");
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.columns).toHaveLength(2);
        expect(s.section.columns[1].title).toBe("New");
    });

    it("renameColumn changes the title", () => {
        const next = renameColumn(baseDoc(), "f1", "t1", 0, "c0", "Male");
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.columns[0].title).toBe("Male");
    });

    it("moveColumn swaps neighbours", () => {
        const withTwo = insertColumn(baseDoc(), "f1", "t1", 0, "New");
        const moved = moveColumn(withTwo, "f1", "t1", 0, 1, -1);
        const s = moved.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.columns[0].title).toBe("New");
    });

    it("deleteColumn drops the column and its cells", () => {
        const next = deleteColumn(baseDoc(), "f1", "t1", 0, "c0");
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.columns).toHaveLength(0);
        expect(s.section.rows[0].cells.c0).toBeUndefined();
    });

    it("extractTemplate + attachTemplate + detachTemplate round-trip", () => {
        const extracted = extractTemplate(
            baseDoc(),
            "f1",
            "t1",
            0,
            "shared-1",
        );
        expect(extracted.templates["shared-1"].key).toBe("s1");
        const slot = extracted.forms.f1.tabs[0].sections[0];
        expect(slot.kind).toBe("ref");

        const attached = attachTemplate(extracted, "f1", "t1", "shared-1");
        expect(attached.forms.f1.tabs[0].sections).toHaveLength(2);
        const newSlot = attached.forms.f1.tabs[0].sections[1];
        expect(newSlot.kind).toBe("ref");

        const detached = detachTemplate(attached, "f1", "t1", 1);
        const detachedSlot = detached.forms.f1.tabs[0].sections[1];
        expect(detachedSlot.kind).toBe("inline");
    });
});
