import { BarChartOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Table } from "antd";
import React, { useMemo, useState } from "react";
import { buildPivot } from "../../analytics/pivot-engine";
import type {
    AnalyticsColumn,
    AnalyticsRow,
    DateBucket,
    PivotConfig,
    PivotMeasure,
} from "../../analytics/types";

const dateBuckets: DateBucket[] = ["exact", "week", "month", "quarter", "year"];

export function PivotBuilder({
    columns,
    rows,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
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
    const result = useMemo(
        () => buildPivot({ rows, columns, config }),
        [rows, columns, config],
    );
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

    return (
        <Flex vertical gap="middle">
            <Flex gap="middle" wrap>
                <Select
                    mode="multiple"
                    placeholder="Row dimensions"
                    style={{ minWidth: 260 }}
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
                    style={{ minWidth: 260 }}
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
                    style={{ minWidth: 180 }}
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
                    style={{ minWidth: 260 }}
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
            <Table
                bordered
                size="small"
                rowKey="key"
                scroll={{ x: "max-content" }}
                dataSource={tableRows}
                columns={[
                    ...result.rowHeaders.map((header, index) => ({
                        title: header,
                        dataIndex: `row_${index}`,
                        key: `row_${index}`,
                        width: 180,
                    })),
                    ...result.columnKeys.flatMap((columnKey) =>
                        config.measures.map((measure) => ({
                            title: [...columnKey, measure.label].join(" / "),
                            dataIndex: [...columnKey, measure.id].join("||"),
                            key: [...columnKey, measure.id].join("||"),
                            width: 160,
                        })),
                    ),
                ]}
            />
        </Flex>
    );
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
