import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import type { AnalyticsColumn, AnalyticsRow } from "../../analytics/types";

export function LineListTable({
    columns,
    rows,
    visibleColumnKeys,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    visibleColumnKeys: string[];
}) {
    const visible = columns.filter((column) =>
        visibleColumnKeys.includes(column.key),
    );
    return (
        <Table
            bordered
            size="small"
            rowKey="id"
            scroll={{ x: "max-content" }}
            dataSource={rows}
            columns={toTableColumns(visible)}
        />
    );
}

export function toTableColumns(
    columns: AnalyticsColumn[],
): ColumnsType<AnalyticsRow> {
    return columns.map((column) => ({
            title: column.label,
            dataIndex: ["values", column.key, "display"],
            key: column.key,
            width: 180,
        }));
}
