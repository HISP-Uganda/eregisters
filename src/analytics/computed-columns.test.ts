import { describe, expect, it } from "vitest";
import {
    applyComputedColumns,
    computedColumnKey,
    findGap,
    findOverlappingRanges,
    matchRange,
    normalizeDefinition,
    type ComputedColumnDefinition,
    type ComputedColumnRange,
} from "./computed-columns";
import type { AnalyticsColumn, AnalyticsRow } from "./types";

const ageColumn: AnalyticsColumn = {
    key: "te.attribute.age",
    label: "Age",
    source: "trackedEntity",
    sourceFieldId: "age",
    valueKind: "number",
    groupPath: ["Tracked Entity"],
    defaultVisible: false,
    pivot: {
        canUseAsDimension: true,
        canUseAsMeasure: true,
        canUseForDistinctCount: true,
    },
};

function row(id: string, age: unknown): AnalyticsRow {
    return {
        id,
        trackedEntity: {} as AnalyticsRow["trackedEntity"],
        enrollment: undefined,
        parentEvent: {} as AnalyticsRow["parentEvent"],
        childEventsByStage: {},
        values: {
            "te.attribute.age": { raw: age, display: String(age ?? "Missing") },
        },
    };
}

function range(
    min: number,
    max: number | null,
    label: string,
    opts: { minInclusive?: boolean; maxInclusive?: boolean } = {},
): ComputedColumnRange {
    return {
        id: `${min}-${max}-${label}`,
        min,
        minInclusive: opts.minInclusive ?? true,
        max,
        maxInclusive: opts.maxInclusive ?? true,
        label,
    };
}

// 0 <= x <= 5 ("Under 6"), x > 5 ("6+") — the gap-free way to split at a
// fractional-safe boundary instead of "0-5" / "6+" (which strands 5.6).
const ageGroupDefinition: ComputedColumnDefinition = {
    id: "age-group",
    programId: "prog1",
    name: "Age group",
    sourceColumnKey: "te.attribute.age",
    ranges: [
        range(0, 5, "Under 6"),
        range(5, 17, "6-17", { minInclusive: false }),
        range(17, null, "18+", { minInclusive: false }),
    ],
    fallbackLabel: "Unknown",
};

describe("matchRange", () => {
    it("matches inclusive bounds", () => {
        expect(matchRange(0, ageGroupDefinition.ranges)?.label).toBe("Under 6");
        expect(matchRange(5, ageGroupDefinition.ranges)?.label).toBe("Under 6");
    });

    it("respects an exclusive min boundary at the shared point", () => {
        // 5 belongs to "Under 6" (max inclusive), not "6-17" (min exclusive)
        expect(matchRange(5, ageGroupDefinition.ranges)?.label).toBe("Under 6");
        expect(matchRange(5.6, ageGroupDefinition.ranges)?.label).toBe("6-17");
    });

    it("matches an open-ended range", () => {
        expect(matchRange(100, ageGroupDefinition.ranges)?.label).toBe("18+");
    });

    it("returns undefined when nothing matches", () => {
        expect(matchRange(-1, ageGroupDefinition.ranges)).toBeUndefined();
    });
});

describe("findOverlappingRanges", () => {
    it("finds no overlap in a valid gap-free set", () => {
        expect(findOverlappingRanges(ageGroupDefinition.ranges)).toBeUndefined();
    });

    it("detects an overlap when both boundaries at the shared point are inclusive", () => {
        const overlap = findOverlappingRanges([
            range(0, 5, "A"),
            range(5, 10, "B"),
        ]);
        expect(overlap?.map((r) => r.label)).toEqual(["A", "B"]);
    });

    it("does not flag a shared point as overlap when one side is exclusive", () => {
        const overlap = findOverlappingRanges([
            range(0, 5, "A"),
            range(5, 10, "B", { minInclusive: false }),
        ]);
        expect(overlap).toBeUndefined();
    });

    it("detects an overlap against an open-ended range", () => {
        const overlap = findOverlappingRanges([
            range(18, null, "18+"),
            range(20, 30, "20-30"),
        ]);
        expect(overlap?.map((r) => r.label)).toEqual(["18+", "20-30"]);
    });
});

describe("findGap", () => {
    it("finds no gap in a contiguous set", () => {
        expect(findGap(ageGroupDefinition.ranges)).toBeUndefined();
    });

    it("detects a numeric gap (the '0-5' / '6+' trap)", () => {
        const gap = findGap([range(0, 5, "0-5"), range(6, null, "6+")]);
        expect(gap?.map((r) => r.label)).toEqual(["0-5", "6+"]);
    });

    it("detects a boundary-point gap when both sides exclude the shared value", () => {
        const gap = findGap([
            range(0, 5, "A", { maxInclusive: false }),
            range(5, 10, "B", { minInclusive: false }),
        ]);
        expect(gap?.map((r) => r.label)).toEqual(["A", "B"]);
    });

    it("treats an open-ended range as having nothing after it", () => {
        expect(findGap([range(0, null, "0+")])).toBeUndefined();
    });
});

describe("normalizeDefinition", () => {
    it("backfills missing minInclusive/maxInclusive from pre-migration localStorage data as inclusive", () => {
        const legacy = {
            id: "d1",
            programId: "p1",
            name: "Age Group",
            sourceColumnKey: "parentEvent.dataValue.zxJ9SDZtKUS",
            ranges: [
                { id: "r1", min: 0, max: 5, label: "0-5" },
                { id: "r2", min: 6, max: 17, label: "6-17" },
                { id: "r3", min: 18, max: null, label: "18+" },
            ],
            fallbackLabel: "Other",
        } as unknown as ComputedColumnDefinition;

        const normalized = normalizeDefinition(legacy);
        expect(normalized.ranges).toEqual([
            { id: "r1", min: 0, max: 5, minInclusive: true, maxInclusive: true, label: "0-5" },
            { id: "r2", min: 6, max: 17, minInclusive: true, maxInclusive: true, label: "6-17" },
            { id: "r3", min: 18, max: null, minInclusive: true, maxInclusive: true, label: "18+" },
        ]);
    });

    it("leaves already-normalized ranges untouched", () => {
        expect(normalizeDefinition(ageGroupDefinition)).toEqual(ageGroupDefinition);
    });
});

describe("applyComputedColumns", () => {
    it("buckets a fractional value correctly across an exclusive boundary", () => {
        const rows = [row("1", 5.6), row("2", 5), row("3", "not a number")];
        const { columns, rows: nextRows } = applyComputedColumns(
            [ageColumn],
            rows,
            [ageGroupDefinition],
        );

        const key = computedColumnKey("age-group");
        expect(columns.map((c) => c.key)).toContain(key);
        const computed = columns.find((c) => c.key === key)!;
        expect(computed.isComputed).toBe(true);
        expect(computed.pivot).toEqual({
            canUseAsDimension: true,
            canUseAsMeasure: false,
            canUseForDistinctCount: false,
        });

        expect(nextRows[0].values[key].display).toBe("6-17");
        expect(nextRows[1].values[key].display).toBe("Under 6");
        expect(nextRows[2].values[key].display).toBe("Unknown");
    });

    it("keeps the source numeric value as raw for range-order sorting", () => {
        const rows = [row("1", 40)];
        const { rows: nextRows } = applyComputedColumns([ageColumn], rows, [
            ageGroupDefinition,
        ]);
        expect(nextRows[0].values[computedColumnKey("age-group")].raw).toBe(40);
    });

    it("is a no-op with no definitions", () => {
        const rows = [row("1", 3)];
        const result = applyComputedColumns([ageColumn], rows, []);
        expect(result.columns).toEqual([ageColumn]);
        expect(result.rows).toBe(rows);
    });
});
