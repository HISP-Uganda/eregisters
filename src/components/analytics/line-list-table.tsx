import { Button, Checkbox, DatePicker, Flex, Input, InputNumber, Space, Table, theme } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { TableRef } from "antd/es/table";
import type { FilterDropdownProps, FilterValue, SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import React from "react";
import { DATE_RANGE_PREFIX, EMPTY_FILTER_VALUE, NUMBER_RANGE_PREFIX, TEXT_SEARCH_PREFIX, makeColumnFilterMatcher, parseDateSelection, parseNumberSelection, usesTextSearch } from "@/analytics/line-list-filters";
import type { AnalyticsColumn, AnalyticsRow } from "@/analytics/types";
import type { OptionSets } from "@/analytics/value-format";
import { useTableScrollHeight } from "@/hooks/useTableScrollHeight";
import { LINE_LIST_ROW_HEIGHT, lineListWindow } from "./line-list-window";

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
    filteredRows,
    rowCount,
    rowAt,
    resultGeneration,
    visibleColumnKeys,
    optionSets = new Map(),
    tableState = EMPTY_LINE_LIST_TABLE_STATE,
    onTableStateChange,
    onOpenTrackedEntity,
    onOpenEvent,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    filteredRows: AnalyticsRow[];
    /** Indexed result access: only rows in the viewport are read. */
    rowCount?: number;
    rowAt?: (position: number) => AnalyticsRow | undefined;
    resultGeneration?: number;
    visibleColumnKeys: string[];
    optionSets?: OptionSets;
    /** Controlled column filters/sort — omit to leave the table uncontrolled. */
    tableState?: LineListTableState;
    /** Fired whenever the user changes a column filter or the sort column/order. */
    onTableStateChange?: (state: LineListTableState) => void;
} & LineListLinks) {
    const visible = React.useMemo(
        () =>
            columns.filter((column) => visibleColumnKeys.includes(column.key)),
        [columns, visibleColumnKeys],
    );
    const { token } = theme.useToken();
    const { containerRef, scrollY } = useTableScrollHeight();
    const tableRef = React.useRef<TableRef>(null);
    const windowed = rowAt !== undefined && rowCount !== undefined;
    const count = rowCount ?? 0;
    const scroll = React.useRef({ top: 0, height: scrollY });
    scroll.current.height = scrollY;
    const [windowRange, setWindowRange] = React.useState(() => lineListWindow(count, 0, scrollY));
    // A window that no longer fits the result (or viewport) is recomputed
    // during render rather than after a blank commit.
    const currentWindow = lineListWindow(count, scroll.current.top, scrollY, windowRange);
    if (currentWindow !== windowRange) setWindowRange(currentWindow);
    React.useEffect(() => {
        if (!windowed) return;
        scroll.current.top = 0;
        tableRef.current?.scrollTo({ top: 0 });
        setWindowRange(lineListWindow(count, 0, scroll.current.height));
    }, [windowed ? resultGeneration : null]);
    const visibleRows = React.useMemo(() => {
        if (!windowed) return filteredRows;
        const result: AnalyticsRow[] = [];
        for (let position = currentWindow.start; position < currentWindow.end; position++) {
            const row = rowAt(position);
            if (row) result.push(row);
        }
        return result;
        // rowAt is a fresh closure each render; the generation identifies its result.
    }, [windowed, resultGeneration, currentWindow.start, currentWindow.end, filteredRows]);
    // The few category menus that need distinct values are memoized apart
    // from filter state, so applying a filter never rebuilds their lists.
    const baseTableColumns = React.useMemo(
        () => toTableColumns(visible, rows, optionSets),
        [visible, rows, optionSets],
    );
    const tableColumns = React.useMemo(
        () => applyTableState(baseTableColumns, tableState),
        [baseTableColumns, tableState],
    );
    // Callers pass fresh arrow functions each render; keep the Actions column
    // (and so every header cell) stable across scroll re-renders.
    const links = React.useRef<LineListLinks>({});
    links.current = { onOpenTrackedEntity, onOpenEvent };
    const hasVisitLink = Boolean(onOpenEvent);
    const hasProfileLink = Boolean(onOpenTrackedEntity);
    // The shared filter engine has already selected the dataSource. Keep
    // antd's filter UI and state, but do not make Table scan the rows again.
    const displayColumns = React.useMemo(() => withActionsColumn(withoutNativeFiltering(tableColumns), {
        onOpenEvent: hasVisitLink ? (trackedEntity, event) => links.current.onOpenEvent?.(trackedEntity, event) : undefined,
        onOpenTrackedEntity: hasProfileLink ? (trackedEntity) => links.current.onOpenTrackedEntity?.(trackedEntity) : undefined,
    }), [tableColumns, hasVisitLink, hasProfileLink]);
    const spacers = React.useMemo(() => ({
        top: currentWindow.start * LINE_LIST_ROW_HEIGHT,
        bottom: (count - currentWindow.end) * LINE_LIST_ROW_HEIGHT,
        colSpan: displayColumns.length,
    }), [currentWindow.start, currentWindow.end, count, displayColumns.length]);
    // Rows sliding under a still pointer would fire hover on every step;
    // suspend row pointer events until scrolling settles.
    const scrollingTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    React.useEffect(() => () => clearTimeout(scrollingTimer.current), []);
    const onScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (container) {
            container.classList.add("line-list-scrolling");
            clearTimeout(scrollingTimer.current);
            scrollingTimer.current = setTimeout(() => container.classList.remove("line-list-scrolling"), 150);
        }
        const top = event.currentTarget.scrollTop;
        if (top === scroll.current.top) return; // horizontal scroll
        scroll.current.top = top;
        // Re-window as a transition: React renders the new rows in short
        // slices while the overscan rows cover the scroll, instead of one
        // long task that stalls scrolling.
        React.startTransition(() => {
            setWindowRange((current) => lineListWindow(count, top, scroll.current.height, current));
        });
    }, [count, containerRef]);
    return (
        <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
            <style>{`
                .line-list-table .ant-table-thead > tr > th,
                .line-list-table .ant-table-tbody > tr > td {
                    white-space: nowrap;
                }
                .line-list-windowed .ant-table-tbody > tr {
                    height: ${LINE_LIST_ROW_HEIGHT}px;
                }
                /* Every row is exactly LINE_LIST_ROW_HEIGHT (border included)
                   so the spacer heights match the rows they stand in for. */
                .ant-table-wrapper.line-list-windowed .ant-table.ant-table-small .ant-table-tbody > tr > td {
                    box-sizing: border-box;
                    height: ${LINE_LIST_ROW_HEIGHT}px;
                    padding-top: 0;
                    padding-bottom: 0;
                    transition: none;
                }
                .line-list-scrolling .line-list-windowed .ant-table-tbody {
                    pointer-events: none;
                }
                .line-list-windowed .ant-table-tbody > tr.line-list-spacer > td {
                    padding: 0;
                    border: 0;
                }
                .line-list-actions {
                    display: inline-flex;
                    gap: 4px;
                }
                .line-list-action {
                    height: ${token.controlHeightSM}px;
                    padding: 0 7px;
                    border: 0;
                    border-radius: ${token.borderRadiusSM}px;
                    background: ${token.colorPrimary};
                    color: ${token.colorTextLightSolid};
                    font: inherit;
                    font-size: ${token.fontSize}px;
                    cursor: pointer;
                }
                .line-list-action:hover {
                    background: ${token.colorPrimaryHover};
                }
                .line-list-action:active {
                    background: ${token.colorPrimaryActive};
                }
                .line-list-action:focus-visible {
                    outline: ${token.lineWidthFocus}px solid ${token.colorPrimaryBorder};
                    outline-offset: 1px;
                }
                /* Sort arrows before the column name; the filter trigger,
                   outside this box, stays after it. */
                .line-list-table .ant-table-column-sorters {
                    flex-direction: row-reverse;
                    justify-content: flex-end;
                    gap: 4px;
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
            <LineListSpacers.Provider value={spacers}>
            <Table
                ref={tableRef}
                className={`line-list-table${windowed ? " line-list-windowed" : ""}`}
                bordered
                size="small"
                rowKey="id"
                virtual={!windowed}
                pagination={false}
                scroll={{ x: "max-content", y: scrollY }}
                components={windowed ? WINDOWED_COMPONENTS : undefined}
                onScroll={windowed ? onScroll : undefined}
                dataSource={visibleRows}
                columns={displayColumns}
                onChange={(_pagination, filters, sorter) => {
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
            </LineListSpacers.Provider>
        </div>
    );
}

/** Heights standing in for the rows outside the rendered window. */
const LineListSpacers = React.createContext({ top: 0, bottom: 0, colSpan: 1 });

/** tbody with spacer rows, so the natively scrolled body keeps its full height. */
function SpacedBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    const { top, bottom, colSpan } = React.useContext(LineListSpacers);
    return <tbody {...props}>
        {top > 0 && <tr className="line-list-spacer" aria-hidden><td colSpan={colSpan} style={{ height: top }} /></tr>}
        {children}
        {bottom > 0 && <tr className="line-list-spacer" aria-hidden><td colSpan={colSpan} style={{ height: bottom }} /></tr>}
    </tbody>;
}

const WINDOWED_COMPONENTS = { body: { wrapper: SpacedBody } };

/** The shared filteredRows prop is Table's data source, so keep only filter controls. */
export function withoutNativeFiltering(columns: ColumnsType<AnalyticsRow>): ColumnsType<AnalyticsRow> {
    return columns.map((column) => {
        const { onFilter: _onFilter, ...displayColumn } = column as ColumnType<AnalyticsRow>;
        return displayColumn.sorter ? { ...displayColumn, sorter: true } : displayColumn;
    });
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

/**
 * Builds the antd column defs, including the per-column filter UI
 * and the estimated width. Does
 * NOT depend on `tableState` — see `applyTableState` — so callers can
 * memoize this on just [columns, rows, optionSets] and cheaply re-apply the
 * active filter/sort selection on every interaction.
 */
export function toTableColumns(
    columns: AnalyticsColumn[],
    rows: AnalyticsRow[] = [],
    optionSets: OptionSets = new Map(),
): ColumnsType<AnalyticsRow> {
    return columns.map((column) => {
        const filter = buildColumnFilter(column, rows, optionSets);
        return {
            title: column.label,
            dataIndex: ["values", column.key, "display"],
            key: column.key,
            width: estimateColumnWidth(column.label, column.key, rows),
            // Every column sorts; the shared line-list index does the
            // ordering (see buildSortRank), so antd only tracks the choice.
            sorter: true,
            ...filter,
        };
    });
}

/**
 * Overlays the currently active filter/sort selection onto columns already
 * built by `toTableColumns` — cheap (no row scanning), so it's safe to redo
 * on every filter/sort change without rebuilding each column's distinct
 * value list from scratch.
 */
export function applyTableState(
    columns: ColumnsType<AnalyticsRow>,
    tableState: LineListTableState,
): ColumnsType<AnalyticsRow> {
    return columns.map((col) => {
        const column = col as ColumnType<AnalyticsRow> & { key: string };
        return {
            ...column,
            ...(column.sorter
                ? {
                      sortOrder:
                          tableState.sortedColumnKey === column.key
                              ? tableState.sortedOrder
                              : null,
                  }
                : {}),
            ...(column.filters || column.filterDropdown
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
            // Plain buttons styled once by `.line-list-action`: antd Button's
            // wave/motion machinery dominated scroll re-render cost.
            <span className="line-list-actions">
                {links.onOpenEvent && (
                    <button
                        type="button"
                        className="line-list-action"
                        onClick={() =>
                            links.onOpenEvent?.(
                                record.trackedEntity.trackedEntity,
                                record.parentEvent.event,
                            )
                        }
                    >
                        Edit Visit
                    </button>
                )}
                {links.onOpenTrackedEntity && (
                    <button
                        type="button"
                        className="line-list-action"
                        onClick={() =>
                            links.onOpenTrackedEntity?.(
                                record.trackedEntity.trackedEntity,
                            )
                        }
                    >
                        Edit Profile
                    </button>
                )}
            </span>
        ),
    };
    return [...tableColumns, actionsColumn];
}

/**
 * Every column gets a filter. Option-set columns (including
 * multi-select ones, whose raw value is a comma-separated list of option
 * ids/codes) list the option set's own options rather than only the
 * values seen in the loaded rows, and match a row if any of its selected
 * options is checked. Freeform values use a search input; small categorical
 * columns use the distinct display values present in the rows.
 */
function buildColumnFilter(
    column: AnalyticsColumn,
    rows: AnalyticsRow[],
    optionSets: OptionSets,
): Partial<ColumnType<AnalyticsRow>> {
    if (column.valueKind === "date") {
        return {
            filterDropdown: (props) => <DateRangeFilterDropdown {...props} />,
            filterOnClose: false,
            onFilter: makeColumnFilterMatcher(column, optionSets),
        };
    }

    if (column.optionSetId) {
        const options = optionSets.get(column.optionSetId) ?? [];
        const sorted = [...options].sort((a, b) => a.sortOrder - b.sortOrder);
        return {
            filters: [{ text: "Empty", value: EMPTY_FILTER_VALUE }, ...sorted.map((option) => ({
                text: option.name,
                value: option.id,
            }))],
            filterMultiple: true,
            filterSearch: true,
            onFilter: makeColumnFilterMatcher(column, optionSets),
        };
    }

    if (column.valueKind === "number" && !column.isComputed) {
        return {
            filterDropdown: (props) => <NumberRangeFilterDropdown {...props} />,
            filterOnClose: false,
            onFilter: makeColumnFilterMatcher(column, optionSets),
        };
    }

    if (usesTextSearch(column)) {
        return {
            filterDropdown: (props) => <TextFilterDropdown {...props} />,
            filterOnClose: false,
            onFilter: makeColumnFilterMatcher(column, optionSets),
        };
    }

    const distinctValues = [
        ...new Set(
            rows
                .map((row) => row.values[column.key]?.display)
                .filter((value): value is string => Boolean(value?.trim())),
        ),
    ].sort((a, b) => a.localeCompare(b));

    return {
        filters: [{ text: "Empty", value: EMPTY_FILTER_VALUE },
            ...distinctValues.map((value) => ({ text: value, value }))],
        filterMultiple: true,
        filterSearch: true,
        onFilter: makeColumnFilterMatcher(column, optionSets),
    };
}

/**
 * A filter dropdown's shared foot: "Empty" (kept alongside the dropdown's
 * own criterion key), Apply and Reset.
 */
function FilterDropdownFooter({
    keys, criterion, applyDisabled, setSelectedKeys, confirm, clearFilters,
}: Pick<FilterDropdownProps, "setSelectedKeys" | "confirm" | "clearFilters"> & {
    keys: string[];
    criterion: string | undefined;
    applyDisabled?: boolean;
}) {
    return <>
        <Checkbox checked={keys.includes(EMPTY_FILTER_VALUE)} onChange={(event) => {
            setSelectedKeys([...(criterion ? [criterion] : []), ...(event.target.checked ? [EMPTY_FILTER_VALUE] : [])]);
        }}>Empty</Checkbox>
        <Space>
            <Button size="small" type="primary" disabled={applyDisabled} onClick={() => confirm({ closeDropdown: true })}>Apply</Button>
            <Button size="small" onClick={() => clearFilters?.({ confirm: true, closeDropdown: true })}>Reset</Button>
        </Space>
    </>;
}

function TextFilterDropdown({ selectedKeys, setSelectedKeys, confirm, clearFilters }: FilterDropdownProps) {
    const keys = selectedKeys.map(String);
    const searchKey = keys.find((key) => key !== EMPTY_FILTER_VALUE);
    const searchText = searchKey?.startsWith(TEXT_SEARCH_PREFIX)
        ? searchKey.slice(TEXT_SEARCH_PREFIX.length)
        : searchKey ?? "";
    return <Flex vertical gap={8} style={{ padding: 8, minWidth: 220 }} onKeyDown={(event) => event.stopPropagation()}>
        <Input
            placeholder="Search values"
            value={searchText}
            allowClear
            onChange={(event) => {
                const text = event.target.value;
                setSelectedKeys([
                    ...(text.trim() ? [`${TEXT_SEARCH_PREFIX}${text}`] : []),
                    ...(keys.includes(EMPTY_FILTER_VALUE) ? [EMPTY_FILTER_VALUE] : []),
                ]);
            }}
            onPressEnter={() => confirm({ closeDropdown: true })}
        />
        <FilterDropdownFooter keys={keys} criterion={searchKey} setSelectedKeys={setSelectedKeys}
            confirm={confirm} clearFilters={clearFilters} />
    </Flex>;
}

function NumberRangeFilterDropdown({ selectedKeys, setSelectedKeys, confirm, clearFilters }: FilterDropdownProps) {
    const keys = selectedKeys.map(String);
    const savedRange = keys.map(parseNumberSelection).find((range) => range !== undefined);
    const [bounds, setBounds] = React.useState<[number | null, number | null]>(savedRange ?? [null, null]);
    const invalid = bounds[0] !== null && bounds[1] !== null && bounds[0] > bounds[1];
    const legacy = keys.find((key) => key !== EMPTY_FILTER_VALUE && !parseNumberSelection(key));
    const changeBound = (side: 0 | 1, value: number | string | null) => {
        const next: [number | null, number | null] = [...bounds];
        next[side] = value === null ? null : Number(value);
        setBounds(next);
        if (next.some((bound) => bound !== null) && next[0] !== null && next[1] !== null && next[0] > next[1]) return;
        const range = next.some((bound) => bound !== null)
            ? [`${NUMBER_RANGE_PREFIX}${next[0] ?? ""}:${next[1] ?? ""}`] : [];
        setSelectedKeys([...range, ...(keys.includes(EMPTY_FILTER_VALUE) ? [EMPTY_FILTER_VALUE] : [])]);
    };
    return <Flex vertical gap={8} style={{ padding: 8, minWidth: 250 }} onKeyDown={(event) => event.stopPropagation()}>
        <Space>
            <InputNumber aria-label="Minimum" placeholder="Min" value={bounds[0]} controls={false}
                onChange={(value) => changeBound(0, value)} onPressEnter={() => { if (!invalid) confirm({ closeDropdown: true }); }} />
            <span>to</span>
            <InputNumber aria-label="Maximum" placeholder="Max" value={bounds[1]} controls={false}
                onChange={(value) => changeBound(1, value)} onPressEnter={() => { if (!invalid) confirm({ closeDropdown: true }); }} />
        </Space>
        {invalid && <span role="alert" style={{ color: "#cf1322" }}>Minimum cannot exceed maximum.</span>}
        {legacy && <span>Saved text filter active; enter a bound to replace it.</span>}
        <FilterDropdownFooter keys={keys} criterion={keys.find((key) => key !== EMPTY_FILTER_VALUE)}
            applyDisabled={invalid} setSelectedKeys={setSelectedKeys} confirm={confirm} clearFilters={clearFilters} />
    </Flex>;
}

function DateRangeFilterDropdown({ selectedKeys, setSelectedKeys, confirm, clearFilters }: FilterDropdownProps) {
    const keys = selectedKeys.map(String);
    const range = keys.map(parseDateSelection).find((value) => value !== undefined);
    return <Flex vertical gap={8} style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
        <DatePicker.RangePicker
            value={range ? [dayjs(range[0]), dayjs(range[1])] : null}
            getPopupContainer={(trigger) => trigger.parentElement ?? document.body}
            onChange={(dates) => {
                const empty = keys.includes(EMPTY_FILTER_VALUE) ? [EMPTY_FILTER_VALUE] : [];
                setSelectedKeys(dates?.[0] && dates?.[1]
                    ? [...empty, `${DATE_RANGE_PREFIX}${dates[0].format("YYYY-MM-DD")}:${dates[1].format("YYYY-MM-DD")}`]
                    : empty);
            }}
        />
        <FilterDropdownFooter keys={keys} criterion={keys.find((key) => parseDateSelection(key))}
            setSelectedKeys={setSelectedKeys} confirm={confirm} clearFilters={clearFilters} />
    </Flex>;
}
