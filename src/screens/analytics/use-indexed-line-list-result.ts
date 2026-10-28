import { useEffect, useRef, useState } from "react";
import { IndexedLineListEngine, type IndexedLineListResult } from "@/analytics/indexed-line-list";
import type { AnalyticsColumn, AnalyticsRow } from "@/analytics/types";
import type { OptionSets } from "@/analytics/value-format";
import type { LineListTableState } from "@/components/analytics/line-list-table";
import type { DatasetStatus } from "./use-analytics-dataset";

interface Committed {
    rows: AnalyticsRow[];
    result: IndexedLineListResult;
}

/** Holds large index arrays outside React state; renders observe only a generation and count. */
export function useIndexedLineListResult(
    status: DatasetStatus,
    rows: AnalyticsRow[],
    columns: AnalyticsColumn[],
    optionSets: OptionSets,
    visibleColumnKeys: string[],
    tableState: LineListTableState,
) {
    const engine = useRef(new IndexedLineListEngine());
    const committed = useRef<Committed | null>(null);
    const [snapshot, setSnapshot] = useState({
        rows,
        columns,
        optionSets,
        visibleColumnKeys,
        tableState,
        generation: 0,
        count: 0,
    });
    const currentDataset = status === "ready" && snapshot.rows === rows &&
        snapshot.columns === columns && snapshot.optionSets === optionSets;
    const display = currentDataset && committed.current !== null;
    const ready = display && snapshot.visibleColumnKeys === visibleColumnKeys &&
        snapshot.tableState === tableState && committed.current !== null;

    useEffect(() => {
        let active = true;
        committed.current = null;
        engine.current.clear();
        setSnapshot((previous) => ({ ...previous, rows, columns, optionSets, generation: previous.generation + 1, count: 0 }));
        if (status === "ready") {
            engine.current.loadDataset(rows, columns, optionSets).then((loaded) => {
                if (!active || !loaded) return;
                // Selection effect below requests the first result once the cache exists.
                setIndexReady((value) => value + 1);
            });
        }
        return () => { active = false; engine.current.clear(); committed.current = null; };
    }, [status, rows, columns, optionSets]);

    const [indexReady, setIndexReady] = useState(0);
    useEffect(() => {
        if (status !== "ready") return;
        let active = true;
        engine.current.request({
            filteredInfo: tableState.filteredInfo,
            sortedColumnKey: tableState.sortedColumnKey,
            sortedOrder: tableState.sortedOrder,
            visibleColumnKeys,
        }).then((result) => {
            if (!active || !result) return;
            committed.current = { rows, result };
            setSnapshot((previous) => ({
                ...previous, rows, columns, optionSets, visibleColumnKeys, tableState,
                generation: previous.generation + 1, count: result.count,
            }));
        });
        return () => { active = false; };
    }, [status, rows, columns, optionSets, visibleColumnKeys, tableState, indexReady]);

    const getRow = (position: number) => {
        if (!display) return undefined;
        const current = committed.current!;
        return current.rows[current.result.indices[position]];
    };
    const getRows = () => {
        if (!display) return [];
        const current = committed.current!;
        return Array.from(current.result.indices, (index) => current.rows[index]);
    };
    return {
        ready,
        hasResult: display,
        pending: status === "ready" && !ready,
        count: currentDataset ? snapshot.count : 0,
        generation: snapshot.generation,
        getRow,
        getRows,
    };
}
