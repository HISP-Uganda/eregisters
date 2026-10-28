import type { FilterValue } from "antd/es/table/interface";
import { EMPTY_FILTER_VALUE, TEXT_SEARCH_PREFIX, parseDateSelection, parseNumberSelection, usesTextSearch } from "./line-list-filters";
import type { AnalyticsColumn, AnalyticsRow } from "./types";
import { numericValue, optionTokens, type OptionSets } from "./value-format";

export interface IndexedLineListSelection {
    filteredInfo: Record<string, FilterValue | null>;
    visibleColumnKeys: string[];
    sortedColumnKey?: string;
    sortedOrder?: "ascend" | "descend" | null;
}

export interface IndexedLineListResult {
    indices: Uint32Array;
    count: number;
}

/** Prepared values for one dataset; evaluation returns positions, not copied records. */
export interface LineListIndex {
    evaluate(selection: IndexedLineListSelection): IndexedLineListResult;
}

interface ColumnCache {
    displays: string[];
    empty: Uint8Array;
    lower?: string[];
    dates?: string[];
    tokens?: string[][];
    numeric?: Float64Array;
}

export class IndexedLineListEngine {
    private datasetGeneration = 0;
    private requestGeneration = 0;
    private index: LineListIndex | null = null;
    private committed: IndexedLineListResult | null = null;

    constructor(private readonly options: { yieldToMain?: () => Promise<void>; rowsPerTask?: number } = {}) {}

    async loadDataset(rows: AnalyticsRow[], columns: AnalyticsColumn[], optionSets: OptionSets): Promise<boolean> {
        this.clear();
        const datasetGeneration = this.datasetGeneration;
        try {
            const index = await buildLineListIndex(rows, columns, optionSets, {
                ...this.options,
                isCurrent: () => datasetGeneration === this.datasetGeneration,
            });
            if (datasetGeneration !== this.datasetGeneration) return false;
            this.index = index;
            return true;
        } catch (error) {
            if (error instanceof CancelledIndexBuild) return false;
            throw error;
        }
    }

    clear(): void {
        ++this.datasetGeneration;
        ++this.requestGeneration;
        this.index = null;
        this.committed = null;
    }

    async request(selection: IndexedLineListSelection): Promise<IndexedLineListResult | null> {
        const requestGeneration = ++this.requestGeneration;
        const datasetGeneration = this.datasetGeneration;
        const index = this.index;
        if (!index) return null;
        await (this.options.yieldToMain ?? yieldTask)();
        if (requestGeneration !== this.requestGeneration || datasetGeneration !== this.datasetGeneration) return null;
        const result = index.evaluate(selection);
        if (requestGeneration !== this.requestGeneration || datasetGeneration !== this.datasetGeneration) return null;
        this.committed = result;
        return result;
    }

    getCommitted(): IndexedLineListResult | null {
        return this.committed;
    }
}

class CancelledIndexBuild extends Error {}

function yieldTask(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function buildLineListIndex(
    rows: AnalyticsRow[],
    columns: AnalyticsColumn[],
    optionSets: OptionSets,
    options: { yieldToMain?: () => Promise<void>; rowsPerTask?: number; isCurrent?: () => boolean } = {},
): Promise<LineListIndex> {
    const yieldToMain = options.yieldToMain ?? yieldTask;
    const rowsPerTask = options.rowsPerTask ?? 16384;
    const cache = new Map<string, ColumnCache>();
    for (const column of columns) {
        const displays = new Array<string>(rows.length);
        const empty = new Uint8Array(rows.length);
        const lower = usesTextSearch(column) || (column.valueKind === "number" && !column.isComputed)
            ? new Array<string>(rows.length) : undefined;
        const dates = column.valueKind === "date" ? new Array<string>(rows.length) : undefined;
        const tokens = column.optionSetId && !dates ? new Array<string[]>(rows.length) : undefined;
        const numeric = column.valueKind === "number" ? new Float64Array(rows.length) : undefined;
        for (let i = 0; i < rows.length; i++) {
            const cell = rows[i].values[column.key];
            const display = cell?.display ?? "";
            displays[i] = display;
            empty[i] = display.trim() ? 0 : 1;
            if (lower) lower[i] = display.toLowerCase();
            if (dates) {
                const date = typeof cell?.raw === "string" ? cell.raw.slice(0, 10) : "";
                dates[i] = date && parseDateSelection(date) ? date : "";
            }
            if (tokens) tokens[i] = optionTokens(cell?.raw);
            if (numeric) numeric[i] = column.isComputed
                ? (typeof cell?.raw === "number" ? cell.raw : -Infinity)
                : (numericValue(cell?.raw) ?? Number.NaN);
            if (i > 0 && i % rowsPerTask === 0) {
                await yieldToMain();
                if (options.isCurrent?.() === false) throw new CancelledIndexBuild();
            }
        }
        cache.set(column.key, { displays, lower, empty, dates, tokens, numeric });
    }
    if (options.isCurrent?.() === false) throw new CancelledIndexBuild();
    // Built on a column's first sort, then reused for this dataset.
    const sortRanks = new Map<string, Float64Array>();
    return {
        evaluate(selection) {
            const active = columns.flatMap((column) => {
                if (!selection.visibleColumnKeys.includes(column.key)) return [];
                const selected = selection.filteredInfo[column.key];
                if (!selected?.length) return [];
                const values = cache.get(column.key)!;
                const includeEmpty = selected.includes(EMPTY_FILTER_VALUE);
                if (column.valueKind === "date") {
                    const ranges = selected.flatMap((value) => {
                        const range = parseDateSelection(value);
                        return range ? [range] : [];
                    });
                    return [(i: number) => Boolean(includeEmpty && values.empty[i]) ||
                        Boolean(values.dates?.[i] && ranges.some(([start, end]) =>
                            values.dates![i] >= start && values.dates![i] <= end))];
                }
                if (column.optionSetId) {
                    const selectedIds = new Set(selected.filter((value) => value !== EMPTY_FILTER_VALUE));
                    const selectedTokens = new Set<string>();
                    for (const option of optionSets.get(column.optionSetId) ?? []) {
                        if (selectedIds.has(option.id)) {
                            selectedTokens.add(option.id);
                            selectedTokens.add(option.code);
                        }
                    }
                    return [(i: number) => Boolean(includeEmpty && values.empty[i]) ||
                        (selectedTokens.size > 0 && values.tokens![i].some((token) => selectedTokens.has(token)))];
                }
                if (column.valueKind === "number" && !column.isComputed) {
                    const ranges = selected.flatMap((value) => {
                        const range = parseNumberSelection(value);
                        return range ? [range] : [];
                    });
                    const queries = selected.flatMap((value) =>
                        typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)
                            ? [value.slice(TEXT_SEARCH_PREFIX.length).trim().toLowerCase()] : [],
                    ).filter(Boolean);
                    const exact = new Set(selected.filter((value) =>
                        value !== EMPTY_FILTER_VALUE && !parseNumberSelection(value) &&
                        !(typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)),
                    ));
                    return [(i: number) => Boolean(includeEmpty && values.empty[i]) ||
                        (Number.isFinite(values.numeric![i]) && ranges.some(([min, max]) =>
                            (min === null || values.numeric![i] >= min) &&
                            (max === null || values.numeric![i] <= max))) ||
                        exact.has(values.displays[i]) ||
                        queries.some((query) => values.lower![i].includes(query))];
                }
                if (!usesTextSearch(column)) {
                    const displays = new Set(selected.filter((value) => value !== EMPTY_FILTER_VALUE));
                    return [(i: number) => Boolean(includeEmpty && values.empty[i]) || displays.has(values.displays[i])];
                }
                const queries = selected.flatMap((value) =>
                    typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)
                        ? [value.slice(TEXT_SEARCH_PREFIX.length).trim().toLowerCase()]
                        : [],
                ).filter(Boolean);
                const exact = new Set(selected.filter((value) =>
                    value !== EMPTY_FILTER_VALUE &&
                    !(typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)),
                ));
                if (!includeEmpty && exact.size === 0 && queries.length === 1) {
                    const lower = values.lower!;
                    const query = queries[0];
                    return [(i: number) => lower[i].includes(query)];
                }
                return [(i: number) => Boolean(includeEmpty && values.empty[i]) ||
                    exact.has(values.displays[i]) || queries.some((query) => values.lower![i].includes(query))];
            });
            // A small, spread-out sample puts the most selective predicate
            // first, so later predicates inspect fewer rows.
            if (active.length > 1) {
                const sampleSize = Math.min(rows.length, 256);
                const ranked = active.map((predicate) => {
                    let hits = 0;
                    for (let sample = 0; sample < sampleSize; sample++) {
                        const index = sampleSize === 1 ? 0 : Math.floor(sample * (rows.length - 1) / (sampleSize - 1));
                        if (predicate(index)) hits++;
                    }
                    return { predicate, hits };
                });
                ranked.sort((a, b) => a.hits - b.hits);
                for (let i = 0; i < ranked.length; i++) active[i] = ranked[i].predicate;
            }
            const found: number[] = [];
            for (let i = 0; i < rows.length; i++) {
                let matches = true;
                for (let j = 0; j < active.length; j++) {
                    if (!active[j](i)) {
                        matches = false;
                        break;
                    }
                }
                if (matches) found.push(i);
            }
            const sortColumn = columns.find((column) => column.key === selection.sortedColumnKey &&
                selection.visibleColumnKeys.includes(column.key));
            if (sortColumn && selection.sortedOrder) {
                let rank = sortRanks.get(sortColumn.key);
                if (!rank) {
                    rank = buildSortRank(sortColumn, rows, cache.get(sortColumn.key)!, optionSets);
                    sortRanks.set(sortColumn.key, rank);
                }
                const direction = selection.sortedOrder === "ascend" ? 1 : -1;
                // Empty cells (NaN) go last either way; ties keep row order.
                found.sort((a, b) => {
                    const left = rank![a];
                    const right = rank![b];
                    const leftEmpty = left !== left;
                    const rightEmpty = right !== right;
                    if (leftEmpty || rightEmpty) {
                        return leftEmpty === rightEmpty ? a - b : (leftEmpty ? 1 : -1);
                    }
                    return left === right ? a - b : (left < right ? -direction : direction);
                });
            }
            return { indices: Uint32Array.from(found), count: found.length };
        },
    };
}

/**
 * A plain-comparable stand-in for natural, case- and accent-insensitive
 * order: lowercased, accents dropped, digit runs zero-padded ("ward 2" <
 * "ward 10"). Far faster than Intl.Collator over ~100k distinct values.
 */
function naturalKey(text: string): string {
    let key = NON_ASCII.test(text)
        ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : text.toLowerCase();
    if (HAS_DIGIT.test(key)) key = key.replace(/\d+/g, (digits) => digits.padStart(16, "0"));
    return key;
}
const NON_ASCII = /[^\x00-\x7f]/;
const HAS_DIGIT = /\d/;

/**
 * Each row's ascending sort position in `column`, NaN for an empty cell.
 * Numbers sort by value, dates and date-times by time, option-set values
 * by the option set's own order, everything else by text ("Ward 2" before
 * "Ward 10"). Computed columns sort by their range's numeric value.
 */
function buildSortRank(
    column: AnalyticsColumn,
    rows: AnalyticsRow[],
    values: ColumnCache,
    optionSets: OptionSets,
): Float64Array {
    const rank = new Float64Array(rows.length);
    if (values.numeric) {
        for (let i = 0; i < rows.length; i++) {
            const value = values.numeric[i];
            rank[i] = values.empty[i] || !Number.isFinite(value) ? Number.NaN : value;
        }
        return rank;
    }
    if (column.valueKind === "date" || column.valueKind === "datetime") {
        for (let i = 0; i < rows.length; i++) {
            const raw = rows[i].values[column.key]?.raw;
            rank[i] = values.empty[i] || typeof raw !== "string" ? Number.NaN : Date.parse(raw);
        }
        return rank;
    }
    // Rank the distinct displays once, then give each row its display's place.
    const optionOrder = new Map<string, number>();
    for (const option of (column.optionSetId && optionSets.get(column.optionSetId)) || []) {
        optionOrder.set(option.code, option.sortOrder);
        optionOrder.set(option.id, option.sortOrder);
    }
    const idByDisplay = new Map<string, number>();
    const distinct: Array<{ display: string; order: number; key: string }> = [];
    const rowIds = new Int32Array(rows.length).fill(-1);
    for (let i = 0; i < rows.length; i++) {
        if (values.empty[i]) continue;
        const display = values.displays[i];
        let id = idByDisplay.get(display);
        if (id === undefined) {
            id = distinct.length;
            idByDisplay.set(display, id);
            const first = values.tokens?.[i]?.[0];
            const order = first === undefined ? Infinity : optionOrder.get(first) ?? Infinity;
            distinct.push({ display, order, key: naturalKey(display) });
        }
        rowIds[i] = id;
    }
    const byOrder = Array.from(distinct.keys()).sort((a, b) => {
        const left = distinct[a];
        const right = distinct[b];
        return (left.order - right.order) ||
            (left.key < right.key ? -1 : left.key > right.key ? 1 :
                left.display < right.display ? -1 : left.display > right.display ? 1 : 0);
    });
    const positionOfId = new Float64Array(distinct.length);
    byOrder.forEach((id, position) => { positionOfId[id] = position; });
    for (let i = 0; i < rows.length; i++) {
        rank[i] = rowIds[i] < 0 ? Number.NaN : positionOfId[rowIds[i]];
    }
    return rank;
}
