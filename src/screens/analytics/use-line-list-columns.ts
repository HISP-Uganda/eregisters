import { useMemo, useState } from "react";
import { applyComputedColumns, computedColumnKey } from "@/analytics/computed-columns";
import type { ComputedColumnDefinition } from "@/analytics/computed-columns";
import type { AnalyticsDataset } from "@/analytics/types";
import { useComputedColumns } from "@/hooks/useComputedColumns";

/**
 * The line list's columns — the dataset's plus this program's computed
 * columns — which of them are shown, and the rows left after the table's
 * own column filters are evaluated by the indexed result hook.
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
    const visibleColumns = useMemo(() => {
        const visible = new Set(visibleColumnKeys);
        const chosen = new Set(visibleColumnKeys.map(slotlessKey));
        return columns.filter((column) =>
            visible.has(column.key) || (column.chooserKey !== undefined && chosen.has(column.chooserKey)));
    }, [columns, visibleColumnKeys]);
    /**
     * The keys tables show: `visibleColumnKeys` plus every slot of a chosen
     * related-stage field, as the slots that exist follow the period filter.
     */
    const shownColumnKeys = useMemo(
        () => visibleColumns.map((column) => column.key),
        [visibleColumns],
    );
    const exportableVisibleColumns = useMemo(
        () => visibleColumns.filter((column) => !column.isComputed),
        [visibleColumns],
    );

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
        shownColumnKeys,
        exportableVisibleColumns,
    };
}

/** `childEvent.<stage>.<slot>.<field>` → its chooser key, `childEvent.<stage>.<field>`. */
function slotlessKey(key: string) {
    const parts = key.split(".");
    return parts[0] === "childEvent" && /^\d+$/.test(parts[2] ?? "")
        ? [parts[0], parts[1], ...parts.slice(3)].join(".")
        : key;
}
