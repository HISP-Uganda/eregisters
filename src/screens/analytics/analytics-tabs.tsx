import { DownloadOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Spin } from "antd";
import React from "react";
import type { AnalyticsColumn, AnalyticsRow } from "@/analytics/types";
import { exportPivotWorkbook, writeWorkbookFile } from "@/analytics/xlsx-export";
import { PivotBuilder } from "@/components/analytics/pivot-builder";
import type { PivotExportInfo } from "@/components/analytics/pivot-builder";
import { DatasetStatus } from "./use-analytics-dataset";

/**
 * antd v6's Tabs gives every pane "ant-tabs-content"; only the active one
 * also gets "ant-tabs-content-active" (an inactive one gets antd's
 * display:none "-hidden" class after its leave transition). Styling plain
 * ".ant-tabs-content" would out-rank that and stack both panes — so the
 * flex rules target the active pane only.
 */
export const ANALYTICS_TABS_CSS = `
.analytics-tabs.ant-tabs {
    flex: 1;
    min-height: 0;
}
.analytics-tabs .ant-tabs-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}
.analytics-tabs .ant-tabs-content-active {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}
`;

/** What a tab shows until its dataset is ready: a prompt, or a spinner. */
export function DatasetPlaceholder({ status }: { status: DatasetStatus }) {
    return (
        <Flex align="center" justify="center" style={{ height: "100%", minHeight: 0 }}>
            {status === "idle" ? (
                <Empty description="Pick a program stage and a period above or load saved lists to load data" />
            ) : (
                <Spin size="large" tip="Loading..." />
            )}
        </Flex>
    );
}

/** The pivot table over the line list's filtered rows, with its export. */
export function PivotTab({
    status,
    columns,
    rows,
    exportInfo,
    onExportInfoChange,
}: {
    status: DatasetStatus;
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    exportInfo: PivotExportInfo;
    onExportInfoChange: (info: PivotExportInfo) => void;
}) {
    if (status !== "ready") return <DatasetPlaceholder status={status} />;
    return (
        <Flex vertical gap="middle" style={{ height: "100%", minHeight: 0 }}>
            <Flex justify="flex-end">
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => writeWorkbookFile(exportPivotWorkbook(exportInfo), "analytics-pivot.xlsx")}
                >
                    Export
                </Button>
            </Flex>
            <PivotBuilder columns={columns} rows={rows} onResultChange={onExportInfoChange} />
        </Flex>
    );
}
