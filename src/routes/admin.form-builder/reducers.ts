import type {
    CellV2,
    FormConfigDoc,
    FormV2,
    SectionSlot,
    SectionV2,
    TabV2,
} from "../../form-configs/v2-types";

const uid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `k${Math.random().toString(36).slice(2, 10)}`;

function withForm(
    doc: FormConfigDoc,
    formId: string,
    fn: (f: FormV2) => FormV2,
): FormConfigDoc {
    const form = doc.forms[formId];
    if (!form) return doc;
    return { ...doc, forms: { ...doc.forms, [formId]: fn(form) } };
}

function withTab(
    form: FormV2,
    tabKey: string,
    fn: (t: TabV2) => TabV2,
): FormV2 {
    return {
        ...form,
        tabs: form.tabs.map((t) => (t.key === tabKey ? fn(t) : t)),
    };
}

function withSection(
    tab: TabV2,
    index: number,
    fn: (s: SectionV2) => SectionV2,
): TabV2 {
    return {
        ...tab,
        sections: tab.sections.map((slot, i) => {
            if (i !== index) return slot;
            if (slot.kind === "inline")
                return { kind: "inline", section: fn(slot.section) };
            return slot;
        }),
    };
}

export function addTab(
    doc: FormConfigDoc,
    formId: string,
    label: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) => ({
        ...f,
        tabs: [...f.tabs, { key: uid(), label, sections: [] }],
    }));
}

export function renameTab(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    label: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => ({ ...t, label })),
    );
}

export function moveTab(
    doc: FormConfigDoc,
    formId: string,
    index: number,
    delta: -1 | 1,
): FormConfigDoc {
    return withForm(doc, formId, (f) => {
        const tabs = [...f.tabs];
        const target = index + delta;
        if (target < 0 || target >= tabs.length) return f;
        [tabs[index], tabs[target]] = [tabs[target], tabs[index]];
        return { ...f, tabs };
    });
}

export function deleteTab(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) => ({
        ...f,
        tabs: f.tabs.filter((t) => t.key !== tabKey),
    }));
}

export function addSection(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    title: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => ({
            ...t,
            sections: [
                ...t.sections,
                {
                    kind: "inline",
                    section: { key: uid(), title, columns: [], rows: [] },
                },
            ],
        })),
    );
}

export function insertColumn(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    title: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => ({
                ...s,
                columns: [...s.columns, { key: uid(), title }],
            })),
        ),
    );
}

export function renameColumn(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    columnKey: string,
    title: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => ({
                ...s,
                columns: s.columns.map((c) =>
                    c.key === columnKey ? { ...c, title } : c,
                ),
            })),
        ),
    );
}

export function moveColumn(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    index: number,
    delta: -1 | 1,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => {
                const columns = [...s.columns];
                const target = index + delta;
                if (target < 0 || target >= columns.length) return s;
                [columns[index], columns[target]] = [
                    columns[target],
                    columns[index],
                ];
                return { ...s, columns };
            }),
        ),
    );
}

export function deleteColumn(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    columnKey: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => ({
                ...s,
                columns: s.columns.filter((c) => c.key !== columnKey),
                rows: s.rows.map((r) => {
                    const cells = { ...r.cells };
                    delete cells[columnKey];
                    return { ...r, cells };
                }),
            })),
        ),
    );
}

export function insertRow(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => ({
                ...s,
                rows: [...s.rows, { key: uid(), cells: {} }],
            })),
        ),
    );
}

export function setCell(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    rowKey: string,
    columnKey: string,
    cell: CellV2 | null,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => ({
                ...s,
                rows: s.rows.map((r) => {
                    if (r.key !== rowKey) return r;
                    const cells = { ...r.cells };
                    if (cell === null) delete cells[columnKey];
                    else cells[columnKey] = cell;
                    return { ...r, cells };
                }),
            })),
        ),
    );
}

function withTemplate(
    doc: FormConfigDoc,
    templateId: string,
    fn: (s: SectionV2) => SectionV2,
): FormConfigDoc {
    const tpl = doc.templates[templateId];
    if (!tpl) return doc;
    return {
        ...doc,
        templates: { ...doc.templates, [templateId]: fn(tpl) },
    };
}

export function insertColumnInTemplate(
    doc: FormConfigDoc,
    templateId: string,
    title: string,
): FormConfigDoc {
    return withTemplate(doc, templateId, (s) => ({
        ...s,
        columns: [...s.columns, { key: uid(), title }],
    }));
}

export function renameColumnInTemplate(
    doc: FormConfigDoc,
    templateId: string,
    columnKey: string,
    title: string,
): FormConfigDoc {
    return withTemplate(doc, templateId, (s) => ({
        ...s,
        columns: s.columns.map((c) =>
            c.key === columnKey ? { ...c, title } : c,
        ),
    }));
}

export function moveColumnInTemplate(
    doc: FormConfigDoc,
    templateId: string,
    index: number,
    delta: -1 | 1,
): FormConfigDoc {
    return withTemplate(doc, templateId, (s) => {
        const columns = [...s.columns];
        const target = index + delta;
        if (target < 0 || target >= columns.length) return s;
        [columns[index], columns[target]] = [columns[target], columns[index]];
        return { ...s, columns };
    });
}

export function deleteColumnInTemplate(
    doc: FormConfigDoc,
    templateId: string,
    columnKey: string,
): FormConfigDoc {
    return withTemplate(doc, templateId, (s) => ({
        ...s,
        columns: s.columns.filter((c) => c.key !== columnKey),
        rows: s.rows.map((r) => {
            const cells = { ...r.cells };
            delete cells[columnKey];
            return { ...r, cells };
        }),
    }));
}

export function insertRowInTemplate(
    doc: FormConfigDoc,
    templateId: string,
): FormConfigDoc {
    return withTemplate(doc, templateId, (s) => ({
        ...s,
        rows: [...s.rows, { key: uid(), cells: {} }],
    }));
}

export function setCellInTemplate(
    doc: FormConfigDoc,
    templateId: string,
    rowKey: string,
    columnKey: string,
    cell: CellV2 | null,
): FormConfigDoc {
    return withTemplate(doc, templateId, (s) => ({
        ...s,
        rows: s.rows.map((r) => {
            if (r.key !== rowKey) return r;
            const cells = { ...r.cells };
            if (cell === null) delete cells[columnKey];
            else cells[columnKey] = cell;
            return { ...r, cells };
        }),
    }));
}

export function renameTemplate(
    doc: FormConfigDoc,
    templateId: string,
    title: string,
): FormConfigDoc {
    return withTemplate(doc, templateId, (s) => ({ ...s, title }));
}

export function deleteTemplate(
    doc: FormConfigDoc,
    templateId: string,
): FormConfigDoc {
    const templates = { ...doc.templates };
    delete templates[templateId];
    return { ...doc, templates };
}

export function extractTemplate(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    templateId: string,
): FormConfigDoc {
    const form = doc.forms[formId];
    if (!form) return doc;
    const tab = form.tabs.find((t) => t.key === tabKey);
    if (!tab) return doc;
    const slot = tab.sections[sectionIndex];
    if (!slot || slot.kind !== "inline") return doc;
    const templates = { ...doc.templates, [templateId]: slot.section };
    return withForm({ ...doc, templates }, formId, (f) =>
        withTab(f, tabKey, (t) => ({
            ...t,
            sections: t.sections.map((s, i) =>
                i === sectionIndex
                    ? ({ kind: "ref", templateId } as SectionSlot)
                    : s,
            ),
        })),
    );
}

export function attachTemplate(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    templateId: string,
): FormConfigDoc {
    if (!doc.templates[templateId]) return doc;
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => ({
            ...t,
            sections: [...t.sections, { kind: "ref", templateId }],
        })),
    );
}

export function detachTemplate(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => {
            const slot = t.sections[sectionIndex];
            if (!slot || slot.kind !== "ref") return t;
            const tpl = doc.templates[slot.templateId];
            if (!tpl) return t;
            const section: SectionV2 = { ...tpl, ...slot.overrides };
            return {
                ...t,
                sections: t.sections.map((s, i) =>
                    i === sectionIndex ? { kind: "inline", section } : s,
                ),
            };
        }),
    );
}
