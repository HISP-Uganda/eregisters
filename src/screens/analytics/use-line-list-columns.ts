import { useEffect, useMemo, useState } from "react";
import { applyComputedColumns, computedColumnKey } from "../../analytics/computed-columns";
import type { ComputedColumnDefinition } from "../../analytics/computed-columns";
import type { AnalyticsDataset, AnalyticsRow } from "../../analytics/types";
import { useComputedColumns } from "../../hooks/useComputedColumns";

/**
 * The line list's columns — the dataset's plus this program's computed
 * columns — which of them are shown, and the rows left after the table's
 * own column filters (the pivot and both exports use those).
 */
export function useLineListColumns(
    dataset: AnalyticsDataset,
    programId: string,
    restoredVisibleKeys: string[] | undefined,
) {
    const { definitions, save, remove } = useComputedColumns(programId);
    const { columns, rows } = useMemo(
        () => applyComputedColumns(dataset.columns, dataset.rows, definitions),
        [dataset.columns, dataset.rows, definitions],
    );
    const numericSourceColumns = useMemo(
        () => dataset.columns.filter((column) => column.valueKind === "number"),
        [dataset.columns],
    );

    const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
        () =>
            restoredVisibleKeys ??
            columns.filter((column) => column.defaultVisible).map((column) => column.key),
    );
    const visibleColumns = useMemo(
        () => columns.filter((column) => visibleColumnKeys.includes(column.key)),
        [columns, visibleColumnKeys],
    );
    const exportableVisibleColumns = useMemo(
        () => visibleColumns.filter((column) => !column.isComputed),
        [visibleColumns],
    );

    const [filteredRows, setFilteredRows] = useState<AnalyticsRow[]>(rows);
    useEffect(() => {
        setFilteredRows(rows);
    }, [rows]);

    /** Saves a computed column and shows it. */
    const saveComputedColumn = (definition: ComputedColumnDefinition) => {
        save(definition);
        const key = computedColumnKey(definition.id);
        setVisibleColumnKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
    };

    return {
        columns,
        rows,
        numericSourceColumns,
        computedColumnDefinitions: definitions,
        saveComputedColumn,
        removeComputedColumn: remove,
        visibleColumnKeys,
        setVisibleColumnKeys,
        visibleColumns,
        exportableVisibleColumns,
        filteredRows,
        setFilteredRows,
    };
}
