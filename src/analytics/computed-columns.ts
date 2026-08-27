import type { AnalyticsColumn, AnalyticsRow } from "./types";
import { numericValue } from "./value-format";

export interface ComputedColumnRange {
    id: string;
    /** Lower bound. */
    min: number;
    /** `true` = min is `>=`; `false` = min is strictly `>`. */
    minInclusive: boolean;
    /** Upper bound; `null` means open-ended ("and above"). */
    max: number | null;
    /** `true` = max is `<=`; `false` = max is strictly `<`. Ignored when `max` is `null`. */
    maxInclusive: boolean;
    label: string;
}

export interface ComputedColumnDefinition {
    id: string;
    programId: string;
    name: string;
    sourceColumnKey: string;
    ranges: ComputedColumnRange[];
    fallbackLabel: string;
}

export function computedColumnKey(definitionId: string): string {
    return `computed.${definitionId}`;
}

/**
 * Definitions saved before `minInclusive`/`maxInclusive` existed have
 * ranges missing those fields. Backfill them as inclusive (`true`) — the
 * only behavior those older ranges ever had — so loading old localStorage
 * data doesn't silently flip previously-inclusive bounds to exclusive.
 */
export function normalizeDefinition(
    definition: ComputedColumnDefinition,
): ComputedColumnDefinition {
    return {
        ...definition,
        ranges: definition.ranges.map((range) => ({
            ...range,
            minInclusive: range.minInclusive ?? true,
            maxInclusive: range.maxInclusive ?? true,
        })),
    };
}

/**
 * True when `upper` (a range's max boundary) sits entirely before `lower`
 * (another range's min boundary) — i.e. no value can satisfy both. Equal
 * boundary values only count as "before" when neither side includes that
 * shared point (both exclusive), since then the point belongs to neither
 * range and there's nothing left to overlap on.
 */
function endBeforeStart(
    upper: { value: number | null; inclusive: boolean },
    lower: { value: number; inclusive: boolean },
): boolean {
    if (upper.value === null) return false;
    if (upper.value < lower.value) return true;
    if (upper.value > lower.value) return false;
    return !(upper.inclusive && lower.inclusive);
}

/**
 * Ranges must be non-overlapping, so a value always matches at most one
 * range unambiguously. Returns the first pair of ranges that overlap, or
 * `undefined` if the set is valid.
 */
export function findOverlappingRanges(
    ranges: ComputedColumnRange[],
): [ComputedColumnRange, ComputedColumnRange] | undefined {
    for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
            const a = ranges[i];
            const b = ranges[j];
            const aLeftOfB = endBeforeStart(
                { value: a.max, inclusive: a.maxInclusive },
                { value: b.min, inclusive: b.minInclusive },
            );
            const bLeftOfA = endBeforeStart(
                { value: b.max, inclusive: b.maxInclusive },
                { value: a.min, inclusive: a.minInclusive },
            );
            if (!aLeftOfB && !bLeftOfA) return [a, b];
        }
    }
    return undefined;
}

/**
 * Ranges must also be gap-free — every value between the lowest and
 * highest defined boundary should land in exactly one range, so nothing
 * silently falls through to the fallback label because of a boundary
 * mismatch (e.g. "0-5" then "6+" stranding 5.6). Assumes no overlaps
 * (check `findOverlappingRanges` first). Returns the first adjacent pair
 * with a gap between them, sorted by position, or `undefined` if none.
 */
export function findGap(
    ranges: ComputedColumnRange[],
): [ComputedColumnRange, ComputedColumnRange] | undefined {
    const sorted = [...ranges].sort((a, b) => a.min - b.min);
    for (let i = 0; i < sorted.length - 1; i++) {
        const lower = sorted[i];
        const upper = sorted[i + 1];
        if (lower.max === null) continue; // open-ended, nothing can follow it
        const touching =
            lower.max === upper.min && (lower.maxInclusive || upper.minInclusive);
        if (!touching) return [lower, upper];
    }
    return undefined;
}

export function matchRange(
    value: number,
    ranges: ComputedColumnRange[],
): ComputedColumnRange | undefined {
    return ranges.find((range) => {
        const aboveMin = range.minInclusive
            ? value >= range.min
            : value > range.min;
        if (!aboveMin) return false;
        if (range.max === null) return true;
        return range.maxInclusive ? value <= range.max : value < range.max;
    });
}

/**
 * Appends one AnalyticsColumn per computed-column definition, and — for
 * every row — a matching `AnalyticsCell` under that column's key. `raw`
 * holds the source numeric value (so sorting a computed column orders by
 * range, not alphabetically by label); `display` holds the matched
 * range's label, or the definition's fallback label when nothing matches.
 */
export function applyComputedColumns(
    columns: AnalyticsColumn[],
    rows: AnalyticsRow[],
    definitions: ComputedColumnDefinition[],
): { columns: AnalyticsColumn[]; rows: AnalyticsRow[] } {
    if (definitions.length === 0) return { columns, rows };

    const computedColumns: AnalyticsColumn[] = definitions.map((definition) => ({
        key: computedColumnKey(definition.id),
        label: definition.name,
        source: "computed",
        sourceFieldId: definition.id,
        valueKind: "number",
        groupPath: ["Computed"],
        defaultVisible: true,
        isComputed: true,
        pivot: {
            // Its whole point is turning a number into a category label, so
            // it's a dimension. Not a measure: `raw` is the source's
            // original numeric value, and summing that per bucket isn't a
            // meaningful "Sum <name>" for a computed column.
            canUseAsDimension: true,
            canUseAsMeasure: false,
            canUseForDistinctCount: false,
        },
    }));

    const nextRows = rows.map((row) => {
        const values = { ...row.values };
        for (const definition of definitions) {
            const numeric = numericValue(
                row.values[definition.sourceColumnKey]?.raw,
            );
            const match =
                numeric !== undefined
                    ? matchRange(numeric, definition.ranges)
                    : undefined;
            values[computedColumnKey(definition.id)] = {
                raw: numeric,
                display: match?.label ?? definition.fallbackLabel,
            };
        }
        return { ...row, values };
    });

    return { columns: [...columns, ...computedColumns], rows: nextRows };
}
