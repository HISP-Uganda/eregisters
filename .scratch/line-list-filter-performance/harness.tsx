import React, { Profiler, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { DATE_RANGE_PREFIX, NUMBER_RANGE_PREFIX, filterLineListRows, TEXT_SEARCH_PREFIX } from "@/analytics/line-list-filters";
import { buildLineListIndex } from "@/analytics/indexed-line-list";
import type { AnalyticsColumn, AnalyticsRow } from "@/analytics/types";
import { LineListTable, type LineListTableState } from "@/components/analytics/line-list-table";
import { useIndexedLineListResult } from "@/screens/analytics/use-indexed-line-list-result";

const params = new URLSearchParams(location.search);
const rowCount = Number(params.get("rows") ?? 50000);
const columnCount = Number(params.get("columns") ?? 12);
const mode = params.get("mode") ?? "table";
const remount = params.has("remount");
const indexed = params.has("indexed");
const indexedEngine = params.has("engine");
const computedSort = params.has("computedSort");
const mixed = params.has("mixed");
const numericRange = params.has("numericRange");
const capDataSource = params.has("capDataSource");
const metrics: Record<string, unknown> = { rowCount, columnCount, mode, remount, indexed, indexedEngine, computedSort, mixed, capDataSource, longTasks: [] as unknown[], renders: [] as unknown[] };
(window as any).profile = metrics;
new PerformanceObserver((list) => {
    (metrics.longTasks as unknown[]).push(...list.getEntries().map((entry) => ({ start: entry.startTime, duration: entry.duration })));
}).observe({ entryTypes: ["longtask"] });

const columns: AnalyticsColumn[] = Array.from({ length: columnCount }, (_, i) => ({
    key: `col${i}`, label: `Column ${i}`, source: "parentEvent", sourceFieldId: `field${i}`,
    valueKind: numericRange && i === 0 ? "number" : (computedSort || mixed) && i === columnCount - 1 ? "number"
        : mixed && i === 1 ? "date" : mixed && i === 3 ? "boolean" : "string",
    isComputed: (computedSort || mixed) && i === columnCount - 1,
    optionSetId: mixed && i === 2 ? "set" : undefined,
    groupPath: [], defaultVisible: true,
    pivot: { canUseAsDimension: true, canUseAsMeasure: false, canUseForDistinctCount: true },
}));
const rows: AnalyticsRow[] = Array.from({ length: rowCount }, (_, i) => ({
    id: String(i), trackedEntity: {} as AnalyticsRow["trackedEntity"], parentEvent: {} as AnalyticsRow["parentEvent"],
    enrollment: undefined, childEventsByStage: {}, linkedParentByStage: {},
    values: Object.fromEntries(columns.map((column, j) => {
        const date = `2024-01-${String(i % 28 + 1).padStart(2, "0")}`;
        return [column.key, {
            raw: numericRange && j === 0 ? i - rowCount / 2
                : (computedSort || mixed) && j === columnCount - 1 ? i % 1000
                : mixed && j === 1 ? date : mixed && j === 2 ? (i % 2 ? "BETA" : "ALPHA")
                : mixed && j === 3 ? i % 2 === 0 : `${j}-${i % 1000}`,
            display: numericRange && j === 0 ? String(i - rowCount / 2)
                : mixed && j === 1 ? date : mixed && j === 2 ? (i % 2 ? "Beta" : "Alpha")
                : mixed && j === 3 ? (i % 2 ? "false" : "true")
                : i % 10 === 0 && j === 0 ? "MATCH" : `value-${j}-${i % 1000}`,
        }];
    })),
}));
const optionSets = mixed ? new Map([["set", [
    { id: "a", code: "ALPHA", name: "Alpha", optionSet: "set", sortOrder: 1 },
    { id: "b", code: "BETA", name: "Beta", optionSet: "set", sortOrder: 2 },
]]]) : new Map();
const visibleColumnKeys = columns.map((column) => column.key);
const indexStart = performance.now();
const col0Lower = indexed ? rows.map((row) => row.values.col0.display.toLowerCase()) : [];
metrics.indexBuildMs = performance.now() - indexStart;
const engineBuildStart = performance.now();
metrics.engineBuildStart = engineBuildStart;
metrics.heapBeforeIndex = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
const engineIndex = indexedEngine ? await buildLineListIndex(rows, columns, optionSets) : null;
metrics.engineBuildEnd = performance.now();
metrics.engineBuildMs = Number(metrics.engineBuildEnd) - engineBuildStart;
metrics.heapAfterIndex = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;

function App() {
    const [state, setState] = useState<LineListTableState>({ filteredInfo: {} });
    const filteredRows = useMemo(() => {
        const start = performance.now();
        const result = engineIndex
            ? Array.from(engineIndex.evaluate({
                filteredInfo: state.filteredInfo,
                visibleColumnKeys: columns.map((column) => column.key),
                sortedColumnKey: state.sortedColumnKey,
                sortedOrder: state.sortedOrder,
            }).indices, (i) => rows[i])
            : indexed && state.filteredInfo.col0?.length
            ? rows.filter((_row, i) => col0Lower[i].includes("match"))
            : filterLineListRows(rows, columns, state.filteredInfo, optionSets);
        metrics.filterMs = performance.now() - start;
        return result;
    }, [state.filteredInfo]);
    useEffect(() => {
        metrics.count = filteredRows.length;
        if (metrics.clickStart !== undefined) {
            metrics.effectMs = performance.now() - Number(metrics.clickStart);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                metrics.paintMs = performance.now() - Number(metrics.clickStart);
                document.getElementById("count")!.textContent = String(filteredRows.length);
            }));
        }
    }, [filteredRows]);
    return <div style={{ height: "100vh" }}>
        <div>Rows: {rowCount}; columns: {columnCount}; filtered: <span id="count">{filteredRows.length}</span></div>
        <button id="synthetic-filter" onClick={() => {
            metrics.clickStart = performance.now();
            metrics.longTasks = [];
            metrics.renders = [];
            setState({ filteredInfo: { col0: [`${TEXT_SEARCH_PREFIX}MATCH`] } });
        }}>Apply synthetic filter</button>
        <button id="broad-filter" onClick={() => {
            metrics.clickStart = performance.now();
            metrics.longTasks = [];
            metrics.renders = [];
            setState({ filteredInfo: Object.fromEntries(columns.map((column, j) => [column.key,
                [`${TEXT_SEARCH_PREFIX}value-${j}-`]])) });
        }}>Apply 12 broad filters</button>
        <button id="sort-filter" onClick={() => {
            metrics.clickStart = performance.now();
            metrics.longTasks = [];
            metrics.renders = [];
            setState({ filteredInfo: {}, sortedColumnKey: `col${columnCount - 1}`, sortedOrder: "ascend" });
        }}>Apply computed sort</button>
        <button id="mixed-filter" onClick={() => {
            metrics.clickStart = performance.now();
            metrics.longTasks = [];
            metrics.renders = [];
            setState({ filteredInfo: {
                col0: [`${TEXT_SEARCH_PREFIX}value-0-`],
                col1: [`${DATE_RANGE_PREFIX}2024-01-01:2024-01-14`],
                col2: ["a"],
                col3: ["true"],
                col4: [`${TEXT_SEARCH_PREFIX}value-4-`],
            } });
        }}>Apply mixed filters</button>
        {mode === "table" && <Profiler id="LineListTable" onRender={(_id, phase, actualDuration, baseDuration, startTime, commitTime) => {
            (metrics.renders as unknown[]).push({ phase, actualDuration, baseDuration, startTime, commitTime });
            metrics.commitMs = performance.now() - Number(metrics.clickStart ?? performance.now());
        }}><LineListTable key={remount ? JSON.stringify(state.filteredInfo) : undefined} columns={columns} rows={rows} filteredRows={capDataSource ? filteredRows.slice(0, 100) : filteredRows}
            visibleColumnKeys={columns.map((column) => column.key)} optionSets={optionSets} tableState={state}
            onTableStateChange={(next) => { metrics.clickStart = performance.now(); metrics.longTasks = []; metrics.renders = []; setState(next); }} />
        </Profiler>}
    </div>;
}

function ViewportApp() {
    const [state, setState] = useState<LineListTableState>({ filteredInfo: {} });
    const result = useIndexedLineListResult("ready", rows, columns, optionSets, visibleColumnKeys, state);
    useEffect(() => {
        metrics.count = result.count;
        metrics.ready = result.ready;
        if (result.ready && metrics.clickStart !== undefined) {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                metrics.paintMs = performance.now() - Number(metrics.clickStart);
                metrics.visibleDomRows = document.querySelectorAll(".line-list-table .ant-table-tbody tr").length;
            }));
        }
    }, [result.count, result.ready, result.generation]);
    return <div style={{ height: "100vh" }}>
        <div>Rows: {rowCount}; columns: {columnCount}; filtered: <span id="count">{result.count}</span>; ready: {String(result.ready)}</div>
        <button id="broad-filter" disabled={!result.ready} onClick={() => {
            metrics.clickStart = performance.now(); metrics.longTasks = [];
            setState({ filteredInfo: Object.fromEntries(columns.map((column, j) => [column.key, [`${TEXT_SEARCH_PREFIX}value-${j}-`]])) });
        }}>Apply 12 broad filters</button>
        <button id="synthetic-filter" disabled={!result.ready} onClick={() => {
            metrics.clickStart = performance.now(); metrics.longTasks = [];
            setState({ filteredInfo: { col0: [`${TEXT_SEARCH_PREFIX}MATCH`] } });
        }}>Apply synthetic filter</button>
        {numericRange && <button id="numeric-range" disabled={!result.ready} onClick={() => {
            metrics.clickStart = performance.now(); metrics.longTasks = [];
            setState({ filteredInfo: { col0: [`${NUMBER_RANGE_PREFIX}0:10000`] } });
        }}>Apply numeric range</button>}
        <LineListTable columns={columns} rows={rows} filteredRows={[]} rowCount={result.count} rowAt={result.getRow}
            resultGeneration={result.generation} visibleColumnKeys={visibleColumnKeys} optionSets={optionSets}
            tableState={state} onTableStateChange={setState} />
    </div>;
}

createRoot(document.getElementById("root")!).render(params.has("viewport") ? <ViewportApp /> : <App />);
