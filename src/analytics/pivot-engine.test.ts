import { describe, expect, it } from "vitest";
import { buildPivot } from "./pivot-engine";
import type { AnalyticsColumn, AnalyticsRow } from "./types";

const columns: AnalyticsColumn[] = [
    column("status", "Status", "string"),
    column("month", "Visit date", "date"),
    column("weight", "Weight", "number"),
    column("trackedEntity", "Tracked Entity", "string"),
];

const rows = [
    row("r1", {
        status: "ACTIVE",
        month: "2026-08-01",
        weight: 50,
        trackedEntity: "te1",
    }),
    row("r2", {
        status: "ACTIVE",
        month: "2026-08-19",
        weight: 70,
        trackedEntity: "te2",
    }),
    row("r3", {
        status: undefined,
        month: undefined,
        weight: "bad",
        trackedEntity: "te2",
    }),
];

describe("buildPivot", () => {
    it("aggregates counts, numeric measures, and distinct counts by dimensions", () => {
        const result = buildPivot({
            rows,
            columns,
            config: {
                rows: [{ columnKey: "status" }],
                columns: [{ columnKey: "month", dateBucket: "month" }],
                measures: [
                    { id: "count", label: "Count", aggregation: "count" },
                    {
                        id: "weight_sum",
                        label: "Weight sum",
                        aggregation: "sum",
                        columnKey: "weight",
                    },
                    {
                        id: "te_distinct",
                        label: "TE distinct",
                        aggregation: "distinctCount",
                        columnKey: "trackedEntity",
                    },
                ],
            },
        });

        expect(result.rowKeys).toEqual([["ACTIVE"], ["Missing"]]);
        expect(result.columnKeys).toEqual([["August 2026"], ["Missing"]]);
        expect(result.cells["ACTIVE||August 2026"].values).toEqual({
            count: 2,
            weight_sum: 120,
            te_distinct: 2,
        });
        expect(result.cells["Missing||Missing"].values.count).toBe(1);
    });

    it("computes averages from numeric values only", () => {
        const result = buildPivot({
            rows,
            columns,
            config: {
                rows: [{ columnKey: "status" }],
                columns: [],
                measures: [
                    {
                        id: "weight_avg",
                        label: "Weight avg",
                        aggregation: "avg",
                        columnKey: "weight",
                    },
                ],
            },
        });

        expect(result.cells["ACTIVE||"].values.weight_avg).toBe(60);
        expect(result.cells["Missing||"].values.weight_avg).toBe(0);
    });
});

function column(
    key: string,
    label: string,
    valueKind: AnalyticsColumn["valueKind"],
): AnalyticsColumn {
    return {
        key,
        label,
        source: "parentEvent",
        sourceFieldId: key,
        valueKind,
        groupPath: ["Test"],
        defaultVisible: true,
        pivot: {
            canUseAsDimension: true,
            canUseAsMeasure: valueKind === "number",
            canUseForDistinctCount: true,
        },
    };
}

function row(id: string, values: Record<string, unknown>): AnalyticsRow {
    return {
        id,
        trackedEntity: {} as AnalyticsRow["trackedEntity"],
        enrollment: undefined,
        parentEvent: {} as AnalyticsRow["parentEvent"],
        childEventsByStage: {},
        linkedParentByStage: {},
        values: Object.fromEntries(
            Object.entries(values).map(([key, raw]) => [
                key,
                { raw, display: raw === undefined ? "Missing" : String(raw) },
            ]),
        ),
    };
}
