import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import type { AnalyticsColumn, AnalyticsRow } from "@/analytics/types";
import { EMPTY_FILTER_VALUE, NUMBER_RANGE_PREFIX, filterLineListRows, parseNumberSelection } from "@/analytics/line-list-filters";
import type { ColumnType } from "antd/es/table";
import { applyTableState, toTableColumns, withActionsColumn, withoutNativeFiltering } from "@/components/analytics/line-list-table";

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

describe("line list column filters", () => {
    const row = (raw: unknown, display = raw == null ? "" : String(raw)) => ({
        values: { field: { raw, display } },
    }) as unknown as AnalyticsRow;
    const filterColumn = () => analyticsColumn({ key: "field", label: "Field", groupPath: [] });

    it("offers Empty and matches missing values without treating zero as empty", () => {
        const column = toTableColumns([filterColumn()], [row(null), row(""), row(0)])[0] as ColumnType<AnalyticsRow>;
        expect(column.filterDropdown).toBeTypeOf("function");
        expect(column.filters).toBeUndefined();
        expect(column.onFilter?.("__lineListEmpty__", row(null))).toBe(true);
        expect(column.onFilter?.("__lineListEmpty__", row(""))).toBe(true);
        expect(column.onFilter?.("__lineListEmpty__", row(0))).toBe(false);
        expect(column.onFilter?.("__lineListEmpty__", row(undefined, "Unmatched"))).toBe(false);
    });

    it("searches plain text without building a distinct-value menu", () => {
        const column = toTableColumns([filterColumn()], [row("Mary Jane"), row("John")])[0] as ColumnType<AnalyticsRow>;
        expect(column.filterDropdown).toBeTypeOf("function");
        expect(column.filters).toBeUndefined();
        expect(column.onFilter?.("__lineListTextSearch__:mArY", row("Mary Jane"))).toBe(true);
        expect(column.onFilter?.("__lineListTextSearch__:mArY", row("John"))).toBe(false);
        expect(column.onFilter?.("Mary Jane", row("Mary Jane"))).toBe(true);
        expect(column.onFilter?.("Mary Jane", row("Mary Jane Jr"))).toBe(false);
        expect(filterLineListRows([row("Mary Jane"), row("John"), row(null)], [filterColumn()],
            { field: ["__lineListTextSearch__:mary", "__lineListEmpty__"] }, new Map(),
        )).toHaveLength(2);
    });

    it("uses inclusive numeric ranges, open bounds, and Empty for ordinary number fields", () => {
        const numeric = { ...filterColumn(), valueKind: "number" as const };
        const column = toTableColumns([numeric], [row(-2), row(0), row(1.5), row(1234)])[0] as ColumnType<AnalyticsRow>;
        expect(column.filterDropdown).toBeTypeOf("function");
        expect(column.filters).toBeUndefined();
        const range = `${NUMBER_RANGE_PREFIX}-2:1.5`;
        expect(column.onFilter?.(range, row(-2))).toBe(true);
        expect(column.onFilter?.(range, row(1.5))).toBe(true);
        expect(column.onFilter?.(range, row(1234))).toBe(false);
        expect(column.onFilter?.(`${NUMBER_RANGE_PREFIX}:0`, row(-2))).toBe(true);
        expect(column.onFilter?.(`${NUMBER_RANGE_PREFIX}1.5:`, row(1.5))).toBe(true);
        expect(column.onFilter?.(EMPTY_FILTER_VALUE, row(null))).toBe(true);
        expect(filterLineListRows([row(-2), row(0), row(1.5), row(null)], [numeric],
            { field: [range, EMPTY_FILTER_VALUE] }, new Map())).toHaveLength(4);
    });

    it("parses only finite, ordered number ranges and restores legacy numeric searches", () => {
        expect(parseNumberSelection(`${NUMBER_RANGE_PREFIX}-1.5:2`)).toEqual([-1.5, 2]);
        expect(parseNumberSelection(`${NUMBER_RANGE_PREFIX}:2`)).toEqual([null, 2]);
        expect(parseNumberSelection(`${NUMBER_RANGE_PREFIX}2:`)).toEqual([2, null]);
        expect(parseNumberSelection(`${NUMBER_RANGE_PREFIX}:`)).toBeUndefined();
        expect(parseNumberSelection(`${NUMBER_RANGE_PREFIX}2:1`)).toBeUndefined();
        expect(parseNumberSelection(`${NUMBER_RANGE_PREFIX}Infinity:3`)).toBeUndefined();
        const column = toTableColumns([{ ...filterColumn(), valueKind: "number" }])[0] as ColumnType<AnalyticsRow>;
        expect(column.onFilter?.("__lineListTextSearch__:234", row(1234))).toBe(true);
        expect(column.onFilter?.("1234", row(1234))).toBe(true);
        expect(column.onFilter?.("1234", row(12345))).toBe(false);
        expect(applyTableState([column], { filteredInfo: { field: [`${NUMBER_RANGE_PREFIX}0:10`] } })[0].filteredValue)
            .toEqual([`${NUMBER_RANGE_PREFIX}0:10`]);
    });

    it("offers Empty for option-set columns and preserves option matching", () => {
        const column = toTableColumns(
            [{ ...filterColumn(), optionSetId: "choices" }],
            [row(null), row("A", "Alpha")],
            new Map([["choices", [{ id: "optionA", code: "A", name: "Alpha", optionSet: "choices", sortOrder: 1 }]]]),
        )[0] as ColumnType<AnalyticsRow>;
        expect(column.filters).toContainEqual({ text: "Empty", value: "__lineListEmpty__" });
        expect(column.onFilter?.("__lineListEmpty__", row(null))).toBe(true);
        expect(column.onFilter?.("optionA", row("A", "Alpha"))).toBe(true);
    });

    it("uses a date range dropdown with inclusive date matching and Empty as an alternative", () => {
        const column = toTableColumns(
            [{ ...filterColumn(), valueKind: "date" }],
            [row("2025-02-01"), row(null)],
        )[0] as ColumnType<AnalyticsRow>;
        expect(column.filterDropdown).toBeTypeOf("function");
        expect(column.filters).toBeUndefined();
        const range = "__lineListDateRange__:2025-02-01:2025-02-28";
        expect(column.onFilter?.(range, row("2025-02-01"))).toBe(true);
        expect(column.onFilter?.(range, row("2025-02-28"))).toBe(true);
        expect(column.onFilter?.("2025-02-28", row("2025-02-28"))).toBe(true);
        expect(column.onFilter?.("2025-02-28", row("2025-03-01"))).toBe(false);
        expect(column.onFilter?.(range, row("2025-03-01"))).toBe(false);
        expect(column.onFilter?.(range, row(null))).toBe(false);
        expect(column.onFilter?.(range, row("2025-02-31"))).toBe(false);
        expect(column.onFilter?.("__lineListDateRange__:2025-03-01:2025-03-31", row("2025-02-31"))).toBe(false);
        expect(column.onFilter?.("__lineListEmpty__", row(null))).toBe(true);
    });

    it("restores a saved date range selection as the column's controlled filter", () => {
        const columns = toTableColumns([{ ...filterColumn(), valueKind: "date" }]);
        const range = "__lineListDateRange__:2025-02-01:2025-02-28";
        const restored = applyTableState(columns, { filteredInfo: { field: [range, "__lineListEmpty__"] } });
        expect(restored[0].filteredValue).toEqual([range, "__lineListEmpty__"]);
    });

    it("uses restored filters for the rows shared with pivot and export", () => {
        const range = "__lineListDateRange__:2025-02-01:2025-02-28";
        const columns = [
            { ...filterColumn(), valueKind: "date" },
            { ...filterColumn(), key: "status", label: "Status" },
        ] satisfies AnalyticsColumn[];
        const records = [
            { values: { field: { raw: "2025-02-01", display: "2025-02-01" }, status: { raw: "open", display: "open" } } },
            { values: { field: { raw: null, display: "" }, status: { raw: "open", display: "open" } } },
            { values: { field: { raw: "2025-02-14", display: "2025-02-14" }, status: { raw: "closed", display: "closed" } } },
            { values: { field: { raw: "2025-03-01", display: "2025-03-01" }, status: { raw: "open", display: "open" } } },
        ] as unknown as AnalyticsRow[];
        expect(filterLineListRows(records, columns,
            { field: [range, "__lineListEmpty__"], status: ["open"] }, new Map(),
        )).toEqual(records.slice(0, 2));
    });

    it("resolves option selections once per filter, not for each row", () => {
        const options = new Map([["choices", [
            { id: "optionA", code: "A", name: "Alpha", optionSet: "choices", sortOrder: 1 },
        ]]]);
        const lookup = vi.spyOn(options, "get");
        const records = Array.from({ length: 100 }, () => row("A", "Alpha"));
        expect(filterLineListRows(records, [{ ...filterColumn(), optionSetId: "choices" }],
            { field: ["optionA"] }, options,
        )).toHaveLength(100);
        expect(lookup).toHaveBeenCalledTimes(1);
    });

    it("keeps the table's filter controls without making Ant Design scan rows again", () => {
        const columns = toTableColumns([{ ...filterColumn(), valueKind: "date" }]);
        const displayColumns = withoutNativeFiltering(columns);
        expect(displayColumns[0].filterDropdown).toBeDefined();
        expect(displayColumns[0].onFilter).toBeUndefined();
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
        ).children.filter(
            (child): child is { props: { onClick: () => void } } =>
                Boolean(child),
        );

        expect(buttons).toHaveLength(2);
        // Plain buttons: antd Button's wave/motion work dominated the cost of
        // re-rendering rows while scrolling.
        expect(buttons.map((button) => (button as unknown as ReactElement).type)).toEqual(["button", "button"]);
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
