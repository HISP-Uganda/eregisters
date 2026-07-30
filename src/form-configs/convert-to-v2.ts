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
        title: legacy.title,
        inputId: legacy.inputId,
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

// Legacy configs may repeat the same column.key across multiple positions
// (they treat position, not key, as identity). To make round-trip lossless we
// uniquify by index: "<originalKey>#<index>". Back-converter strips the suffix.
function uniqueColumnKey(legacy: HmisColumnConfig, index: number): string {
    return `${legacy.key}#${index}`;
}

function convertColumn(legacy: HmisColumnConfig, index: number): ColumnV2 {
    return {
        key: uniqueColumnKey(legacy, index),
        title: undefined,
        width: legacy.width,
    };
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
        cells[uniqueColumnKey(col, index)] = convertCell(cell);
    });
    return { key: legacy.key, type: legacy.type, cells };
}

function convertSection(legacy: HmisSectionConfig): SectionV2 {
    const columns = legacy.columns ?? [];
    return {
        key: legacy.key,
        title: legacy.title,
        frozenColumns: legacy.frozenColumns,
        columns: columns.map((c, i) => convertColumn(c, i)),
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
