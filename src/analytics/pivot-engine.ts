import { bucketDate } from "./date-buckets";
import type {
    AnalyticsColumn,
    AnalyticsRow,
    PivotConfig,
    PivotMeasure,
    PivotResult,
} from "./types";
import { numericValue } from "./value-format";

interface PivotInput {
    rows: AnalyticsRow[];
    columns: AnalyticsColumn[];
    config: PivotConfig;
}

interface Accumulator {
    count: number;
    values: Record<string, number[]>;
    distinct: Record<string, Set<string>>;
}

export function buildPivot({
    rows,
    columns,
    config,
}: PivotInput): PivotResult {
    const columnByKey = new Map(columns.map((column) => [column.key, column]));
    const rowKeyMap = new Map<string, string[]>();
    const columnKeyMap = new Map<string, string[]>();
    const grouped = new Map<string, Accumulator>();

    for (const row of rows) {
        const rowKey = dimensionKey(row, config.rows, columnByKey);
        const columnKey = dimensionKey(row, config.columns, columnByKey);
        const rowToken = keyToken(rowKey);
        const columnToken = keyToken(columnKey);
        const cellKey = `${rowToken}||${columnToken}`;

        rowKeyMap.set(rowToken, rowKey);
        columnKeyMap.set(columnToken, columnKey);

        const accumulator =
            grouped.get(cellKey) ?? { count: 0, values: {}, distinct: {} };
        accumulator.count += 1;
        for (const measure of config.measures) {
            collectMeasure(accumulator, measure, row);
        }
        grouped.set(cellKey, accumulator);
    }

    const cells: PivotResult["cells"] = {};
    for (const [cellKey, accumulator] of grouped.entries()) {
        cells[cellKey] = { values: aggregate(accumulator, config.measures) };
    }

    return {
        rowHeaders: config.rows.map(
            (dimension) => columnByKey.get(dimension.columnKey)?.label ?? dimension.columnKey,
        ),
        columnHeaders: config.columns.map(
            (dimension) => columnByKey.get(dimension.columnKey)?.label ?? dimension.columnKey,
        ),
        rowKeys: [...rowKeyMap.values()].sort(compareDimensionKeys),
        columnKeys: [...columnKeyMap.values()].sort(compareDimensionKeys),
        cells,
    };
}

/**
 * Sorts dimension key tuples level-by-level so identical values at each
 * level sit next to each other — required for the table to merge (rowSpan)
 * or group (nested column headers) repeated dimension values.
 */
function compareDimensionKeys(a: string[], b: string[]): number {
    const length = Math.max(a.length, b.length);
    for (let level = 0; level < length; level++) {
        const cmp = (a[level] ?? "").localeCompare(b[level] ?? "");
        if (cmp !== 0) return cmp;
    }
    return 0;
}

function dimensionKey(
    row: AnalyticsRow,
    dimensions: PivotConfig["rows"],
    columnByKey: Map<string, AnalyticsColumn>,
): string[] {
    if (dimensions.length === 0) return [];

    return dimensions.map((dimension) => {
        const cell = row.values[dimension.columnKey];
        const column = columnByKey.get(dimension.columnKey);
        if (
            dimension.dateBucket &&
            (column?.valueKind === "date" || column?.valueKind === "datetime")
        ) {
            return bucketDate(cell?.raw, dimension.dateBucket).label;
        }
        return cell?.display || "Missing";
    });
}

function keyToken(key: string[]): string {
    return key.join("\u001f");
}

function collectMeasure(
    accumulator: Accumulator,
    measure: PivotMeasure,
    row: AnalyticsRow,
) {
    if (measure.aggregation === "count") return;
    if (!measure.columnKey) return;

    if (measure.aggregation === "distinctCount") {
        accumulator.distinct[measure.id] =
            accumulator.distinct[measure.id] ?? new Set<string>();
        const raw = row.values[measure.columnKey]?.raw;
        if (raw !== undefined && raw !== null && raw !== "") {
            accumulator.distinct[measure.id].add(String(raw));
        }
        return;
    }

    const value = numericValue(row.values[measure.columnKey]?.raw);
    if (value === undefined) return;
    accumulator.values[measure.id] = accumulator.values[measure.id] ?? [];
    accumulator.values[measure.id].push(value);
}

function aggregate(
    accumulator: Accumulator,
    measures: PivotMeasure[],
): Record<string, number> {
    const values: Record<string, number> = {};
    for (const measure of measures) {
        const numericValues = accumulator.values[measure.id] ?? [];
        switch (measure.aggregation) {
            case "count":
                values[measure.id] = accumulator.count;
                break;
            case "sum":
                values[measure.id] = numericValues.reduce(
                    (total, value) => total + value,
                    0,
                );
                break;
            case "avg":
                values[measure.id] = numericValues.length
                    ? numericValues.reduce((total, value) => total + value, 0) /
                      numericValues.length
                    : 0;
                break;
            case "min":
                values[measure.id] = numericValues.length
                    ? Math.min(...numericValues)
                    : 0;
                break;
            case "max":
                values[measure.id] = numericValues.length
                    ? Math.max(...numericValues)
                    : 0;
                break;
            case "distinctCount":
                values[measure.id] = accumulator.distinct[measure.id]?.size ?? 0;
                break;
        }
    }
    return values;
}
