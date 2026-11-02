// Synthetic scroll-profiling harness: the real LineListTable + indexed result
// at ?rows=N&columns=C, with the Actions column wired like analytics-screen.
import React, { Profiler, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { AnalyticsColumn, AnalyticsRow } from "@/analytics/types";
import { LineListTable, type LineListTableState } from "@/components/analytics/line-list-table";
import { useIndexedLineListResult } from "@/screens/analytics/use-indexed-line-list-result";

const params = new URLSearchParams(location.search);
const rowCount = Number(params.get("rows") ?? 50000);
const columnCount = Number(params.get("columns") ?? 12);
const metrics = { rowCount, columnCount, commits: [] as { actual: number; at: number }[] };
(window as any).profile = metrics;

const columns: AnalyticsColumn[] = Array.from({ length: columnCount }, (_, i) => ({
    key: `col${i}`, label: `Column ${i}`, source: "parentEvent", sourceFieldId: `field${i}`,
    valueKind: "string", isComputed: false, groupPath: [], defaultVisible: true,
    pivot: { canUseAsDimension: true, canUseAsMeasure: false, canUseForDistinctCount: true },
}));
const rows: AnalyticsRow[] = Array.from({ length: rowCount }, (_, i) => ({
    id: String(i), trackedEntity: { trackedEntity: `te${i}` } as AnalyticsRow["trackedEntity"],
    parentEvent: { event: `ev${i}` } as AnalyticsRow["parentEvent"],
    enrollment: undefined, childEventsByStage: {}, linkedParentByStage: {},
    values: Object.fromEntries(columns.map((column, j) => [column.key, { raw: `${j}-${i}`, display: `value-${j}-${i}` }])),
}));
const optionSets = new Map();
const visibleColumnKeys = columns.map((column) => column.key);
const recordOpen = (...args: string[]) => { (metrics as any).opened = args; };

function App() {
    const [state, setState] = useState<LineListTableState>({ filteredInfo: {} });
    const result = useIndexedLineListResult("ready", rows, columns, optionSets, visibleColumnKeys, state);
    useEffect(() => { (metrics as any).ready = result.ready; (metrics as any).count = result.count; }, [result.ready, result.count]);
    return <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <div>rows {rowCount}; count <span id="count">{result.count}</span>; ready {String(result.ready)}</div>
        <Profiler id="LineListTable" onRender={(_id, _phase, actual) => { metrics.commits.push({ actual, at: performance.now() }); }}>
            <LineListTable columns={columns} rows={rows} filteredRows={[]} rowCount={result.count} rowAt={result.getRow}
                resultGeneration={result.generation} visibleColumnKeys={visibleColumnKeys} optionSets={optionSets}
                tableState={state} onTableStateChange={setState} onOpenTrackedEntity={recordOpen} onOpenEvent={recordOpen} />
        </Profiler>
    </div>;
}

createRoot(document.getElementById("root")!).render(<App />);
