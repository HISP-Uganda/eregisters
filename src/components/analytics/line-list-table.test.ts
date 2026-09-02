import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import type { AnalyticsColumn, AnalyticsRow } from "../../analytics/types";
import { toTableColumns, withActionsColumn } from "./line-list-table";

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

    it("leaves every column as a plain cell — no ID column is clickable", () => {
        const columns = toTableColumns([
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
        ]);

        expect(columns.every((column) => column.render === undefined)).toBe(
            true,
        );
    });
});

describe("withActionsColumn", () => {
    const record = {
        trackedEntity: { trackedEntity: "TE001" },
        parentEvent: { event: "EV001" },
        values: {},
    } as unknown as AnalyticsRow;

    it("adds a fixed-right Actions column with View Visit / View Profile buttons that call the right handlers", () => {
        const onOpenTrackedEntity = vi.fn();
        const onOpenEvent = vi.fn();

        const columns = withActionsColumn([], {
            onOpenTrackedEntity,
            onOpenEvent,
        });

        const actionsColumn = columns.find((c) => c.key === "__actions")!;
        expect(actionsColumn.fixed).toBe("right");

        const element = actionsColumn.render!(
            undefined,
            record,
            0,
        ) as ReactElement;
        const buttons = (
            element.props as {
                children: Array<{ props: { onClick: () => void } } | false>;
            }
        ).children.filter((child): child is { props: { onClick: () => void } } =>
            Boolean(child),
        );

        expect(buttons).toHaveLength(2);
        buttons[0].props.onClick();
        expect(onOpenEvent).toHaveBeenCalledWith("TE001", "EV001");
        buttons[1].props.onClick();
        expect(onOpenTrackedEntity).toHaveBeenCalledWith("TE001");
    });

    it("shows only the button for whichever handler is actually wired up", () => {
        const onOpenTrackedEntity = vi.fn();

        const columns = withActionsColumn([], { onOpenTrackedEntity });
        const actionsColumn = columns.find((c) => c.key === "__actions")!;
        const element = actionsColumn.render!(
            undefined,
            record,
            0,
        ) as ReactElement;
        const buttons = (
            element.props as { children: ReactElement[] }
        ).children.filter(Boolean);

        expect(buttons).toHaveLength(1);
    });

    it("leaves the columns untouched when no link callback is given at all", () => {
        const original = [
            analyticsColumn({
                key: "trackedEntity.trackedEntity",
                label: "Tracked Entity ID",
                groupPath: ["System IDs"],
            }),
        ];

        const columns = toTableColumns(original);
        expect(withActionsColumn(columns, {})).toBe(columns);
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
