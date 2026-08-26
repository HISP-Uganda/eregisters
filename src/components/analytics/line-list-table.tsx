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

function toTableColumns(columns: AnalyticsColumn[]): ColumnsType<AnalyticsRow> {
    const root: GroupNode = { children: new Map(), columns: [] };
    for (const column of columns) {
        let node = root;
        for (const segment of column.groupPath) {
            const next =
                node.children.get(segment) ?? {
                    title: segment,
                    children: new Map<string, GroupNode>(),
                    columns: [],
                };
            node.children.set(segment, next);
            node = next;
        }
        node.columns.push(column);
    }
    return flattenNode(root);
}

interface GroupNode {
    title?: string;
    children: Map<string, GroupNode>;
    columns: AnalyticsColumn[];
}

function flattenNode(node: GroupNode): ColumnsType<AnalyticsRow> {
    return [
        ...[...node.children.values()].map((child) => ({
            title: child.title,
            children: flattenNode(child),
        })),
        ...node.columns.map((column) => ({
            title: column.label,
            dataIndex: ["values", column.key, "display"],
            key: column.key,
            width: 180,
        })),
    ];
}
