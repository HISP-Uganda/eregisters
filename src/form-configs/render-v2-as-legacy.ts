import type {
    HmisCellConfig,
    HmisColumnConfig,
    HmisFormConfig,
    HmisRowConfig,
    HmisSectionConfig,
} from "./types";
import type {
    CellV2,
    ColumnV2,
    FormV2,
    RowV2,
    SectionSlot,
    SectionV2,
    TabV2,
} from "./v2-types";

function backCell(v2: CellV2, key: string): HmisCellConfig {
    return {
        key,
        kind: v2.kind,
        text: v2.text,
        title: v2.title,
        inputId: v2.inputId,
        dataElement: v2.dataElement,
        categoryOptionCombo: v2.categoryOptionCombo,
        attributeOptionCombo: v2.attributeOptionCombo,
        disabled: v2.disabled,
        total: v2.total,
        rowSpan: v2.rowSpan,
        colSpan: v2.colSpan,
        style: v2.style,
    };
}

function placeholderCell(key: string): HmisCellConfig {
    return { key, kind: "label" };
}

function backColumn(v2: ColumnV2, index: number): HmisColumnConfig {
    return { key: v2.key, index, width: v2.width };
}

function backRow(
    v2: RowV2,
    columns: ColumnV2[],
    sectionKey: string,
): HmisRowConfig {
    return {
        key: v2.key,
        type: v2.type,
        cells: columns.map((c) => {
            const cell = v2.cells[c.key];
            return cell
                ? backCell(cell, `${sectionKey}-${v2.key}-${c.key}`)
                : placeholderCell(`${sectionKey}-${v2.key}-${c.key}`);
        }),
    };
}

function backSection(v2: SectionV2): HmisSectionConfig {
    return {
        key: v2.key,
        title: v2.title,
        columnCount: v2.columns.length,
        frozenColumns: v2.frozenColumns,
        columns: v2.columns.map(backColumn),
        rows: v2.rows.map((r) => backRow(r, v2.columns, v2.key)),
    };
}

function resolveSlot(
    slot: SectionSlot,
    templates: Record<string, SectionV2>,
): SectionV2 | null {
    if (slot.kind === "inline") return slot.section;
    const tpl = templates[slot.templateId];
    if (!tpl) return null;
    return { ...tpl, ...slot.overrides };
}

export function renderV2AsLegacy(
    form: FormV2,
    templates: Record<string, SectionV2>,
): HmisFormConfig {
    return {
        id: form.id,
        title: form.title,
        editableScope: form.editableScope,
        tabs: form.tabs.map((t: TabV2) => ({
            key: t.key,
            label: t.label,
            sections: t.sections
                .map((slot) => resolveSlot(slot, templates))
                .filter((s): s is SectionV2 => s !== null)
                .map(backSection),
        })),
    };
}
