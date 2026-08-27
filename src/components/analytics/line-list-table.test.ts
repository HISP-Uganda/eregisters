import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import type { AnalyticsColumn, AnalyticsRow } from "../../analytics/types";
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

    it("makes the Tracked Entity ID and Main Event ID columns clickable, jumping into that record like sync-error fixing does", () => {
        const onOpenTrackedEntity = vi.fn();
        const onOpenEvent = vi.fn();
        const columns = toTableColumns(
            [
                analyticsColumn({
                    key: "trackedEntity.trackedEntity",
                    label: "Tracked Entity ID",
                    groupPath: ["System IDs"],
                }),
                analyticsColumn({
                    key: "parentEvent.event",
                    label: "Main Event ID",
                    groupPath: ["System IDs"],
                }),
            ],
            [],
            new Map(),
            { onOpenTrackedEntity, onOpenEvent },
        );

        const record = {
            trackedEntity: { trackedEntity: "TE001" },
            parentEvent: { event: "EV001" },
            values: {
                "trackedEntity.trackedEntity": { raw: "TE001", display: "TE001" },
                "parentEvent.event": { raw: "EV001", display: "EV001" },
            },
        } as unknown as AnalyticsRow;

        const teColumn = columns.find(
            (c) => c.key === "trackedEntity.trackedEntity",
        )!;
        const teElement = teColumn.render!("TE001", record, 0) as ReactElement;
        (teElement.props as { onClick: () => void }).onClick();
        expect(onOpenTrackedEntity).toHaveBeenCalledWith("TE001");

        const eventColumn = columns.find((c) => c.key === "parentEvent.event")!;
        const eventElement = eventColumn.render!(
            "EV001",
            record,
            0,
        ) as ReactElement;
        (eventElement.props as { onClick: () => void }).onClick();
        expect(onOpenEvent).toHaveBeenCalledWith("TE001", "EV001");
    });

    it("leaves other columns as plain cells when no link callbacks are given", () => {
        const columns = toTableColumns([
            analyticsColumn({
                key: "trackedEntity.trackedEntity",
                label: "Tracked Entity ID",
                groupPath: ["System IDs"],
            }),
        ]);

        expect(columns[0].render).toBeUndefined();
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
