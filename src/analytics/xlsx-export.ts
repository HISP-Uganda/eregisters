import * as XLSX from "xlsx";
import type {
    AnalyticsColumn,
    AnalyticsRow,
    PivotMeasure,
    PivotResult,
} from "./types";

export function exportLineListWorkbook({
    columns,
    rows,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
}) {
    const data = [
        columns.map((column) => column.label),
        ...rows.map((row) =>
            columns.map((column) => row.values[column.key]?.display ?? ""),
        ),
    ];
    return workbookFromRows("Line List", data);
}

export function exportPivotWorkbook({
    result,
    measures,
}: {
    result: PivotResult;
    measures: PivotMeasure[];
}) {
    const header = [
        ...result.rowHeaders,
        ...result.columnKeys.flatMap((columnKey) =>
            measures.map((measure) =>
                [...columnKey, measure.label].filter(Boolean).join(" / "),
            ),
        ),
    ];
    const rows = result.rowKeys.map((rowKey) => [
        ...rowKey,
        ...result.columnKeys.flatMap((columnKey) => {
            const cell = result.cells[`${rowKey.join("\u001f")}||${columnKey.join("\u001f")}`];
            return measures.map((measure) => cell?.values[measure.id] ?? 0);
        }),
    ]);

    return workbookFromRows("Pivot", [header, ...rows]);
}

export function writeWorkbookFile(workbook: XLSX.WorkBook, fileName: string) {
    XLSX.writeFile(workbook, fileName);
}

function workbookFromRows(name: string, rows: unknown[][]) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
    return workbook;
}
