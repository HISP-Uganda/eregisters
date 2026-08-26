import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { exportLineListWorkbook, exportPivotWorkbook } from "./xlsx-export";
import type { AnalyticsColumn, AnalyticsRow, PivotResult } from "./types";

describe("xlsx export", () => {
    it("exports the visible line list columns to one worksheet", () => {
        const workbook = exportLineListWorkbook({
            columns: [
                column("trackedEntity.trackedEntity", "Tracked Entity ID"),
                column("parentEvent.event", "Parent Event ID"),
            ],
            rows: [
                row("r1", {
                    "trackedEntity.trackedEntity": "te1",
                    "parentEvent.event": "event1",
                }),
            ],
        });

        expect(workbook.SheetNames).toEqual(["Line List"]);
        expect(
            XLSX.utils.sheet_to_json(workbook.Sheets["Line List"], {
                header: 1,
            }),
        ).toEqual([["Tracked Entity ID", "Parent Event ID"], ["te1", "event1"]]);
    });

    it("exports pivot results to one worksheet", () => {
        const pivot: PivotResult = {
            rowHeaders: ["Status"],
            columnHeaders: ["Month"],
            rowKeys: [["ACTIVE"]],
            columnKeys: [["August 2026"]],
            cells: {
                "ACTIVE||August 2026": {
                    values: { count: 3 },
                },
            },
        };

        const workbook = exportPivotWorkbook({
            result: pivot,
            measures: [{ id: "count", label: "Count", aggregation: "count" }],
        });

        expect(workbook.SheetNames).toEqual(["Pivot"]);
        expect(
            XLSX.utils.sheet_to_json(workbook.Sheets.Pivot, { header: 1 }),
        ).toEqual([["Status", "August 2026 / Count"], ["ACTIVE", 3]]);
    });
});

function column(key: string, label: string): AnalyticsColumn {
    return {
        key,
        label,
        source: "parentEvent",
        sourceFieldId: key,
        valueKind: "string",
        groupPath: ["Test"],
        defaultVisible: true,
        pivot: {
            canUseAsDimension: true,
            canUseAsMeasure: false,
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
        values: Object.fromEntries(
            Object.entries(values).map(([key, raw]) => [
                key,
                { raw, display: raw === undefined ? "Missing" : String(raw) },
            ]),
        ),
    };
}
