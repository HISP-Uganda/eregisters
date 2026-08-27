import { Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import React from "react";
import type { AnalyticsColumn, AnalyticsRow } from "../../analytics/types";
import { optionTokens, type OptionSets } from "../../analytics/value-format";
import { useTableScrollHeight } from "../../hooks/useTableScrollHeight";

export function LineListTable({
    columns,
    rows,
    visibleColumnKeys,
    optionSets = new Map(),
    onFilteredRowsChange,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    visibleColumnKeys: string[];
    optionSets?: OptionSets;
    /**
     * Fired whenever the user's column filters (or sort) change the set of
     * rows actually shown, so callers driving the Pivot tab / exports from
     * the same rows can stay in sync with what's on screen.
     */
    onFilteredRowsChange?: (rows: AnalyticsRow[]) => void;
}) {
    const visible = columns.filter((column) =>
        visibleColumnKeys.includes(column.key),
    );
    const { containerRef, scrollY } = useTableScrollHeight();
    return (
        <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
            <style>{`
                .line-list-table .ant-table-thead > tr > th {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
                columns={toTableColumns(visible, rows, optionSets)}
                onChange={(_pagination, _filters, _sorter, extra) =>
                    onFilteredRowsChange?.(
                        extra.currentDataSource as AnalyticsRow[],
                    )
                }
            />
        </div>
    );
}

const MIN_COLUMN_WIDTH = 80;
const MAX_COLUMN_WIDTH = 320;
const CHAR_WIDTH = 8;
const CELL_CHROME_WIDTH = 56; // cell padding/border + filter icon

/**
 * `ellipsis: true` forces antd into `table-layout: fixed`, which makes
 * every column without an explicit width share space equally. Estimate a
 * per-column width from its longest content (header label vs. a sample of
 * row values) instead, so columns still shrink/grow to fit what they hold.
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
    return Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, width));
}

export function toTableColumns(
    columns: AnalyticsColumn[],
    rows: AnalyticsRow[] = [],
    optionSets: OptionSets = new Map(),
): ColumnsType<AnalyticsRow> {
    return columns.map((column) => ({
        title: column.label,
        dataIndex: ["values", column.key, "display"],
        key: column.key,
        ellipsis: true,
        width: estimateColumnWidth(column.label, column.key, rows),
        ...buildColumnFilter(column, rows, optionSets),
    }));
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
