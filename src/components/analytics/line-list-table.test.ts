import { describe, expect, it } from "vitest";
import type { AnalyticsColumn } from "../../analytics/types";
import { toTableColumns } from "./line-list-table";

describe("toTableColumns", () => {
    it("renders flat columns without grouped header children", () => {
        const columns = toTableColumns([
            analyticsColumn({
                key: "trackedEntity.trackedEntity",
                label: "Tracked Entity ID",
                groupPath: ["System IDs"],
            }),
            analyticsColumn({
                key: "te.attribute.firstName",
                label: "First name",
                groupPath: ["Tracked Entity", "Registration"],
            }),
        ]);

        expect(columns).toHaveLength(2);
        expect(columns.map((column) => column.title)).toEqual([
            "Tracked Entity ID",
            "First name",
        ]);
        expect(columns.some((column) => "children" in column)).toBe(false);
    });
});

function analyticsColumn(
    overrides: Pick<AnalyticsColumn, "key" | "label" | "groupPath">,
): AnalyticsColumn {
    return {
        source: "trackedEntity",
        sourceFieldId: overrides.key,
        valueKind: "string",
        defaultVisible: true,
        pivot: {
            canUseAsDimension: true,
            canUseAsMeasure: false,
            canUseForDistinctCount: true,
        },
        ...overrides,
    };
}
