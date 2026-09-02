import { Button, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import React from "react";
import type { AnalyticsColumn, AnalyticsRow } from "../../analytics/types";
import { optionTokens, type OptionSets } from "../../analytics/value-format";
import { useTableScrollHeight } from "../../hooks/useTableScrollHeight";

const ACTIONS_COLUMN_KEY = "__actions";

export interface LineListLinks {
    /** Same destination as the sync-error-fixing flow: opens the client editor. */
    onOpenTrackedEntity?: (trackedEntity: string) => void;
    /** Same destination as the sync-error-fixing flow: opens that event. */
    onOpenEvent?: (trackedEntity: string, event: string) => void;
}

/** The column filters + single active sort, in antd's own shapes — kept
 * controlled so callers can persist and restore them across a remount. */
export interface LineListTableState {
    filteredInfo: Record<string, FilterValue | null>;
    sortedColumnKey?: string;
    sortedOrder?: "ascend" | "descend" | null;
}

export const EMPTY_LINE_LIST_TABLE_STATE: LineListTableState = {
    filteredInfo: {},
};

export function LineListTable({
    columns,
    rows,
    visibleColumnKeys,
    optionSets = new Map(),
    tableState = EMPTY_LINE_LIST_TABLE_STATE,
    onFilteredRowsChange,
    onTableStateChange,
    onOpenTrackedEntity,
    onOpenEvent,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    visibleColumnKeys: string[];
    optionSets?: OptionSets;
    /** Controlled column filters/sort — omit to leave the table uncontrolled. */
    tableState?: LineListTableState;
    /**
     * Fired whenever the user's column filters (or sort) change the set of
     * rows actually shown, so callers driving the Pivot tab / exports from
     * the same rows can stay in sync with what's on screen.
     */
    onFilteredRowsChange?: (rows: AnalyticsRow[]) => void;
    /** Fired whenever the user changes a column filter or the sort column/order. */
    onTableStateChange?: (state: LineListTableState) => void;
} & LineListLinks) {
    const visible = columns.filter((column) =>
        visibleColumnKeys.includes(column.key),
    );
    const { containerRef, scrollY } = useTableScrollHeight();
    return (
        <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
            <style>{`
                .line-list-table .ant-table-thead > tr > th,
                .line-list-table .ant-table-tbody > tr > td {
                    white-space: nowrap;
                }
                /* Below the app's mobile breakpoint (<992px), give the
                   filter/sort trigger icons a bigger touch target — antd's
                   default is comfortable for a mouse pointer but cramped
                   for a finger. */
                @media (max-width: 991px) {
                    .line-list-table .ant-table-filter-trigger,
                    .line-list-table .ant-table-column-sorters {
                        padding: 6px;
                    }
                }
            `}</style>
            <Table
                className="line-list-table"
                bordered
                size="small"
                rowKey="id"
                virtual
                pagination={false}
                scroll={{ x: "max-content", y: scrollY }}
                dataSource={rows}
                columns={withActionsColumn(
                    toTableColumns(visible, rows, optionSets, tableState),
                    { onOpenTrackedEntity, onOpenEvent },
                )}
                onChange={(_pagination, filters, sorter, extra) => {
                    onFilteredRowsChange?.(
                        extra.currentDataSource as AnalyticsRow[],
                    );
                    const single = (
                        Array.isArray(sorter) ? sorter[0] : sorter
                    ) as SorterResult<AnalyticsRow> | undefined;
                    onTableStateChange?.({
                        filteredInfo: filters,
                        sortedColumnKey: single?.columnKey as
                            | string
                            | undefined,
                        sortedOrder: single?.order ?? null,
                    });
                }}
            />
        </div>
    );
}

const MIN_COLUMN_WIDTH = 80;
const CHAR_WIDTH = 8;
const CELL_CHROME_WIDTH = 56; // cell padding/border + filter icon

/**
 * No column truncates (see the `white-space: nowrap` rules above, and
 * `ellipsis` is never set on a column below) — the full header label and
 * cell values always render on one line, so the table just grows wider and
 * relies on `scroll: { x: "max-content" }` for horizontal scrolling.
 * Estimate a per-column width from its longest content (header label vs. a
 * sample of row values) so columns still start close to their real size
 * instead of everything defaulting to the same width.
 */
function estimateColumnWidth(
    label: string,
    key: string,
    rows: AnalyticsRow[],
): number {
    let maxChars = label.length;
    const sampleSize = Math.min(rows.length, 200);
    for (let i = 0; i < sampleSize; i++) {
        const display = rows[i].values[key]?.display;
        if (display && display.length > maxChars) {
            maxChars = display.length;
        }
    }
    const width = maxChars * CHAR_WIDTH + CELL_CHROME_WIDTH;
    return Math.max(MIN_COLUMN_WIDTH, width);
}

export function toTableColumns(
    columns: AnalyticsColumn[],
    rows: AnalyticsRow[] = [],
    optionSets: OptionSets = new Map(),
    tableState: LineListTableState = EMPTY_LINE_LIST_TABLE_STATE,
): ColumnsType<AnalyticsRow> {
    return columns.map((column) => {
        const filter = buildColumnFilter(column, rows, optionSets);
        return {
            title: column.label,
            dataIndex: ["values", column.key, "display"],
            key: column.key,
            width: estimateColumnWidth(column.label, column.key, rows),
            // Computed columns keep their matched range's numeric value as
            // `raw`, so sorting orders by range rather than alphabetically by
            // the displayed label (e.g. "5-17" before "18+").
            ...(column.isComputed
                ? {
                      sorter: (a: AnalyticsRow, b: AnalyticsRow) => {
                          const left = a.values[column.key]?.raw;
                          const right = b.values[column.key]?.raw;
                          return (
                              (typeof left === "number" ? left : -Infinity) -
                              (typeof right === "number" ? right : -Infinity)
                          );
                      },
                      sortOrder:
                          tableState.sortedColumnKey === column.key
                              ? tableState.sortedOrder
                              : null,
                  }
                : {}),
            ...filter,
            ...(filter.filters
                ? {
                      filteredValue:
                          tableState.filteredInfo[column.key] ?? null,
                  }
                : {}),
        };
    });
}

/**
 * Appends a fixed-to-the-right "Actions" column with "View Visit" / "View
 * Profile" buttons — the replacement for the old clickable Tracked Entity
 * ID / Main Event ID cells. Returns `tableColumns` unchanged when neither
 * callback is wired up (there'd be nothing to put in the column).
 */
export function withActionsColumn(
    tableColumns: ColumnsType<AnalyticsRow>,
    links: LineListLinks,
): ColumnsType<AnalyticsRow> {
    if (!links.onOpenTrackedEntity && !links.onOpenEvent) return tableColumns;
    const actionsColumn: ColumnType<AnalyticsRow> = {
        title: "Actions",
        key: ACTIONS_COLUMN_KEY,
        fixed: "right",
        width: 200,
        render: (_value, record) => (
            <Space size={4}>
                {links.onOpenEvent && (
                    <Button
                        size="small"
                        onClick={() =>
                            links.onOpenEvent?.(
                                record.trackedEntity.trackedEntity,
                                record.parentEvent.event,
                            )
                        }
                    >
                        View Visit
                    </Button>
                )}
                {links.onOpenTrackedEntity && (
                    <Button
                        size="small"
                        onClick={() =>
                            links.onOpenTrackedEntity?.(
                                record.trackedEntity.trackedEntity,
                            )
                        }
                    >
                        View Profile
                    </Button>
                )}
            </Space>
        ),
    };
    return [...tableColumns, actionsColumn];
}

/**
 * Every column gets a filter dropdown. Option-set columns (including
 * multi-select ones, whose raw value is a comma-separated list of option
 * ids/codes) list the option set's own options rather than only the
 * values seen in the loaded rows, and match a row if any of its selected
 * options is checked. Other columns fall back to the distinct display
 * values present in the rows.
 */
function buildColumnFilter(
    column: AnalyticsColumn,
    rows: AnalyticsRow[],
    optionSets: OptionSets,
): Partial<ColumnType<AnalyticsRow>> {
    if (column.optionSetId) {
        const options = optionSets.get(column.optionSetId) ?? [];
        if (options.length === 0) return {};
        const sorted = [...options].sort(
            (a, b) => a.sortOrder - b.sortOrder,
        );
        return {
            filters: sorted.map((option) => ({
                text: option.name,
                value: option.id,
            })),
            filterMultiple: true,
            filterSearch: true,
            onFilter: (value, record) => {
                const option = sorted.find((candidate) => candidate.id === value);
                if (!option) return false;
                const tokens = optionTokens(record.values[column.key]?.raw);
                return tokens.includes(option.id) || tokens.includes(option.code);
            },
        };
    }

    const distinctValues = [
        ...new Set(
            rows
                .map((row) => row.values[column.key]?.display)
                .filter((value): value is string => Boolean(value)),
        ),
    ].sort((a, b) => a.localeCompare(b));

    if (distinctValues.length === 0) return {};

    return {
        filters: distinctValues.map((value) => ({ text: value, value })),
        filterMultiple: true,
        filterSearch: true,
        onFilter: (value, record) =>
            record.values[column.key]?.display === value,
    };
}
