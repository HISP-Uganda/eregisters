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

function convertCell(legacy: HmisCellConfig): CellV2 {
    return {
        kind: legacy.kind,
        text: legacy.text,
        dataElement: legacy.dataElement,
        categoryOptionCombo: legacy.categoryOptionCombo,
        attributeOptionCombo: legacy.attributeOptionCombo,
        disabled: legacy.disabled,
        total: legacy.total,
        rowSpan: legacy.rowSpan,
        colSpan: legacy.colSpan,
        style: legacy.style
            ? {
                  background: legacy.style.background,
                  align: legacy.style.align as CellV2["style"] extends
                      | infer S
                      | undefined
                      ? S extends { align?: infer A }
                          ? A
                          : never
                      : never,
                  verticalAlign: legacy.style.verticalAlign,
              }
            : undefined,
    };
}

function isBlankCell(cell: HmisCellConfig): boolean {
    return !cell.text && !cell.dataElement && !cell.title;
}

function convertColumn(legacy: HmisColumnConfig): ColumnV2 {
    return { key: legacy.key, title: undefined, width: legacy.width };
}

function convertRow(
    legacy: HmisRowConfig,
    columns: HmisColumnConfig[],
): RowV2 {
    const cells: Record<string, CellV2> = {};
    legacy.cells.forEach((cell, index) => {
        if (isBlankCell(cell)) return;
        const col = columns[index];
        if (!col) return;
        cells[col.key] = convertCell(cell);
    });
    return { key: legacy.key, type: legacy.type, cells };
}

function convertSection(legacy: HmisSectionConfig): SectionV2 {
    const columns = legacy.columns ?? [];
    return {
        key: legacy.key,
        title: legacy.title,
        frozenColumns: legacy.frozenColumns,
        columns: columns.map(convertColumn),
        rows: legacy.rows.map((r) => convertRow(r, columns)),
    };
}

function convertTab(legacy: HmisFormConfig["tabs"][number]): TabV2 {
    return {
        key: legacy.key,
        label: legacy.label,
        sections: legacy.sections.map(
            (s): SectionSlot => ({
                kind: "inline",
                section: convertSection(s),
            }),
        ),
    };
}

export function convertLegacyForm(legacy: HmisFormConfig): FormV2 {
    return {
        id: legacy.id,
        title: legacy.title,
        editableScope: legacy.editableScope,
        tabs: legacy.tabs.map(convertTab),
    };
}
