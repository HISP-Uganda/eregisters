import { BarChartOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useMemo, useState } from "react";
import { buildPivot } from "../../analytics/pivot-engine";
import type {
    AnalyticsColumn,
    AnalyticsRow,
    DateBucket,
    PivotConfig,
    PivotMeasure,
    PivotResult,
} from "../../analytics/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTableScrollHeight } from "../../hooks/useTableScrollHeight";

const dateBuckets: DateBucket[] = ["exact", "week", "month", "quarter", "year"];

export interface PivotExportInfo {
    result: PivotResult;
    measures: PivotMeasure[];
}

export function PivotBuilder({
    columns,
    rows,
    onResultChange,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    /**
     * Fired whenever the on-screen pivot (dimensions, measures, or the
     * underlying rows) changes, so an export button outside this component
     * can download exactly what's currently displayed.
     */
    onResultChange?: (info: PivotExportInfo) => void;
}) {
    const dimensionOptions = columns
        .filter((column) => column.pivot.canUseAsDimension)
        .map((column) => ({ value: column.key, label: column.label }));
    const measureOptions = [
        { value: "count", label: "Count" },
        ...columns
            .filter((column) => column.pivot.canUseAsMeasure)
            .map((column) => ({
                value: `sum:${column.key}`,
                label: `Sum ${column.label}`,
            })),
        ...columns
            .filter((column) => column.pivot.canUseForDistinctCount)
            .map((column) => ({
                value: `distinctCount:${column.key}`,
                label: `Distinct ${column.label}`,
            })),
    ];
    const [config, setConfig] = useState<PivotConfig>({
        rows: [],
        columns: [],
        measures: [{ id: "count", label: "Count", aggregation: "count" }],
    });

    // Pivot dimensions/measures are drawn from the Line List's selected
    // columns. If the user deselects a column that's in use here, drop it
    // from the pivot too instead of leaving a dangling, unlabelled choice.
    useEffect(() => {
        const columnKeys = new Set(columns.map((column) => column.key));
        setConfig((prev) => {
            const rows = prev.rows.filter((dimension) =>
                columnKeys.has(dimension.columnKey),
            );
            const columnDimensions = prev.columns.filter((dimension) =>
                columnKeys.has(dimension.columnKey),
            );
            const measures = prev.measures.filter(
                (measure) =>
                    measure.aggregation === "count" ||
                    (measure.columnKey && columnKeys.has(measure.columnKey)),
            );
            const nextMeasures =
                measures.length > 0
                    ? measures
                    : [{ id: "count", label: "Count", aggregation: "count" as const }];
            if (
                rows.length === prev.rows.length &&
                columnDimensions.length === prev.columns.length &&
                nextMeasures.length === prev.measures.length &&
                nextMeasures.every(
                    (measure, index) => measure.id === prev.measures[index]?.id,
                )
            ) {
                return prev;
            }
            return { rows, columns: columnDimensions, measures: nextMeasures };
        });
    }, [columns]);

    const result = useMemo(
        () => buildPivot({ rows, columns, config }),
        [rows, columns, config],
    );
    useEffect(() => {
        onResultChange?.({ result, measures: config.measures });
    }, [result, config.measures, onResultChange]);
    const tableRows = result.rowKeys.map((rowKey) => {
        const record: Record<string, string | number> = {
            key: rowKey.join("||"),
        };
        result.rowHeaders.forEach((header, index) => {
            record[`row_${index}`] = rowKey[index] ?? "";
        });
        for (const columnKey of result.columnKeys) {
            for (const measure of config.measures) {
                const key = [...columnKey, measure.id].join("||");
                record[key] =
                    result.cells[
                        `${rowKey.join("\u001f")}||${columnKey.join("\u001f")}`
                    ]?.values[measure.id] ?? 0;
            }
        }
        return record;
    });

    const rowSpans = useMemo(
        () => computeSpans(result.rowKeys, result.rowHeaders.length),
        [result.rowKeys, result.rowHeaders.length],
    );
    const { containerRef, scrollY } = useTableScrollHeight();
    const isMobile = useIsMobile();
    const fieldStyle = isMobile ? { width: "100%" } : undefined;

    return (
        <Flex vertical gap="middle" style={{ height: "100%", minHeight: 0 }}>
            <Flex
                gap="middle"
                wrap
                vertical={isMobile}
                align={isMobile ? "stretch" : undefined}
            >
                <Select
                    mode="multiple"
                    placeholder="Row dimensions"
                    style={fieldStyle ?? { minWidth: 260 }}
                    options={dimensionOptions}
                    value={config.rows.map((dimension) => dimension.columnKey)}
                    onChange={(keys) =>
                        setConfig((prev) => ({
                            ...prev,
                            rows: keys.map((columnKey) => ({ columnKey })),
                        }))
                    }
                />
                <Select
                    mode="multiple"
                    placeholder="Column dimensions"
                    style={fieldStyle ?? { minWidth: 260 }}
                    options={dimensionOptions}
                    value={config.columns.map(
                        (dimension) => dimension.columnKey,
                    )}
                    onChange={(keys) =>
                        setConfig((prev) => ({
                            ...prev,
                            columns: keys.map((columnKey) => ({ columnKey })),
                        }))
                    }
                />
                <Select
                    placeholder="Date bucket"
                    style={fieldStyle ?? { minWidth: 180 }}
                    options={dateBuckets.map((bucket) => ({
                        value: bucket,
                        label: bucket,
                    }))}
                    onChange={(bucket) =>
                        setConfig((prev) => ({
                            ...prev,
                            rows: prev.rows.map((dimension) => ({
                                ...dimension,
                                dateBucket: bucket,
                            })),
                            columns: prev.columns.map((dimension) => ({
                                ...dimension,
                                dateBucket: bucket,
                            })),
                        }))
                    }
                />
                <Select
                    mode="multiple"
                    placeholder="Measures"
                    style={fieldStyle ?? { minWidth: 260 }}
                    options={measureOptions}
                    value={config.measures.map((measure) =>
                        measure.aggregation === "count"
                            ? "count"
                            : `${measure.aggregation}:${measure.columnKey}`,
                    )}
                    onChange={(values) =>
                        setConfig((prev) => ({
                            ...prev,
                            measures: toMeasures(values, columns),
                        }))
                    }
                />
                <Button icon={<BarChartOutlined />}>{rows.length}</Button>
            </Flex>
            <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
                <Table
                    bordered
                    size="small"
                    rowKey="key"
                    pagination={false}
                    scroll={{ x: "max-content", y: scrollY }}
                    dataSource={tableRows}
                    columns={[
                        ...result.rowHeaders.map((header, index) => ({
                            title: header,
                            dataIndex: `row_${index}`,
                            key: `row_${index}`,
                            onCell: (
                                _record: Record<string, string | number>,
                                rowIndex?: number,
                            ) => ({
                                rowSpan: rowSpans[rowIndex ?? 0]?.[index] ?? 1,
                            }),
                        })),
                        ...buildColumnGroups(result.columnKeys, config.measures),
                    ]}
                />
            </div>
        </Flex>
    );
}

/**
 * For each row and each dimension level, computes the antd rowSpan needed
 * to merge consecutive rows that share the same values through that level
 * (0 means "covered by a preceding merged cell, don't render").
 */
function computeSpans(
    keys: string[][],
    levelCount: number,
): number[][] {
    const spans: number[][] = keys.map(() => new Array(levelCount).fill(1));
    for (let level = 0; level < levelCount; level++) {
        let start = 0;
        while (start < keys.length) {
            let end = start + 1;
            while (
                end < keys.length &&
                sharesPrefix(keys[end], keys[start], level)
            ) {
                end++;
            }
            spans[start][level] = end - start;
            for (let i = start + 1; i < end; i++) spans[i][level] = 0;
            start = end;
        }
    }
    return spans;
}

function sharesPrefix(a: string[], b: string[], level: number): boolean {
    for (let i = 0; i <= level; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/**
 * Builds antd's nested `children` column tree from the (already sorted)
 * column-dimension key tuples, so repeated dimension values at each level
 * render as a single grouped header instead of a flat, slash-joined title.
 */
function buildColumnGroups(
    columnKeys: string[][],
    measures: PivotMeasure[],
): ColumnsType<Record<string, string | number>> {
    return buildColumnLevel(columnKeys, 0, []);

    function buildColumnLevel(
        keys: string[][],
        level: number,
        prefix: string[],
    ): ColumnsType<Record<string, string | number>> {
        if (level >= (keys[0]?.length ?? 0)) {
            return measures.map((measure) => ({
                title: measure.label,
                dataIndex: [...prefix, measure.id].join("||"),
                key: [...prefix, measure.id].join("||"),
            }));
        }
        const groups: { value: string; keys: string[][] }[] = [];
        for (const key of keys) {
            const value = key[level];
            const current = groups[groups.length - 1];
            if (current && current.value === value) {
                current.keys.push(key);
            } else {
                groups.push({ value, keys: [key] });
            }
        }
        return groups.map((group) => ({
            title: group.value,
            key: [...prefix, group.value, `level_${level}`].join("||"),
            children: buildColumnLevel(group.keys, level + 1, [
                ...prefix,
                group.value,
            ]),
        }));
    }
}

function toMeasures(
    values: string[],
    columns: AnalyticsColumn[],
): PivotMeasure[] {
    if (values.length === 0) {
        return [{ id: "count", label: "Count", aggregation: "count" }];
    }
    const columnByKey = new Map(columns.map((column) => [column.key, column]));
    return values.map((value) => {
        if (value === "count") {
            return { id: "count", label: "Count", aggregation: "count" };
        }
        const [aggregation, columnKey] = value.split(":") as [
            "sum" | "distinctCount",
            string,
        ];
        const column = columnByKey.get(columnKey);
        return {
            id: `${aggregation}_${columnKey}`,
            label:
                aggregation === "sum"
                    ? `Sum ${column?.label ?? columnKey}`
                    : `Distinct ${column?.label ?? columnKey}`,
            aggregation,
            columnKey,
        };
    });
}
