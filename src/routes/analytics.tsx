import { DownloadOutlined } from "@ant-design/icons";
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { createRoute } from "@tanstack/react-router";
import { Button, Flex, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { buildParentEventDataset } from "../analytics/parent-event-dataset";
import type { AnalyticsRow } from "../analytics/types";
import {
    exportLineListWorkbook,
    exportPivotWorkbook,
    writeWorkbookFile,
} from "../analytics/xlsx-export";
import { AnalyticsFilterBar } from "../components/analytics/analytics-filter-bar";
import type { AnalyticsFilters } from "../components/analytics/analytics-filter-bar";
import { ColumnChooser } from "../components/analytics/column-chooser";
import { LineListTable } from "../components/analytics/line-list-table";
import { PivotBuilder } from "../components/analytics/pivot-builder";
import type { PivotExportInfo } from "../components/analytics/pivot-builder";
import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";
import { useMetadata } from "../hooks/useMetadata";
import { RootRoute } from "./__root";

const { Title, Text } = Typography;

export const AnalyticsRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/analytics",
    component: AnalyticsPage,
});

function AnalyticsPage() {
    const {
        program,
        orgUnit,
        trackedEntityAttributes,
        dataElements,
        optionSets,
    } = useMetadata();
    const defaultStage = program.programStages[0]?.id ?? "";
    const [filters, setFilters] = useState<AnalyticsFilters>({
        programId: program.id,
        mainStageId: defaultStage,
        childStageIds: [],
        startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
    });

    const { data: trackedEntities } = useLiveSuspenseQuery(
        (q) =>
            q.from({ trackedEntities: trackedEntitiesCollection }).where(
                ({ trackedEntities }) => eq(trackedEntities.orgUnit, orgUnit),
            ),
        [orgUnit],
    );
    const { data: enrollments } = useLiveSuspenseQuery(
        (q) =>
            q.from({ enrollments: enrollmentsCollection }).where(
                ({ enrollments }) =>
                    and(
                        eq(enrollments.orgUnit, orgUnit),
                        eq(enrollments.program, filters.programId),
                    ),
            ),
        [orgUnit, filters.programId],
    );
    const { data: events } = useLiveSuspenseQuery(
        (q) =>
            q.from({ events: eventsCollection }).where(({ events }) =>
                and(
                    eq(events.orgUnit, orgUnit),
                    eq(events.program, filters.programId),
                ),
            ),
        [orgUnit, filters.programId],
    );

    const dataset = useMemo(
        () =>
            buildParentEventDataset({
                metadata: {
                    program,
                    trackedEntityAttributes,
                    dataElements,
                    optionSets,
                },
                trackedEntities,
                enrollments,
                events,
                orgUnit,
                programId: filters.programId,
                mainStageId: filters.mainStageId || defaultStage,
                childStageIds: filters.childStageIds,
                startDate: filters.startDate,
                endDate: filters.endDate,
            }),
        [
            dataElements,
            defaultStage,
            enrollments,
            events,
            filters,
            optionSets,
            orgUnit,
            program,
            trackedEntities,
            trackedEntityAttributes,
        ],
    );
    const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>([]);
    const effectiveVisibleColumnKeys = visibleColumnKeys;
    const visibleColumns = useMemo(
        () =>
            dataset.columns.filter((column) =>
                effectiveVisibleColumnKeys.includes(column.key),
            ),
        [dataset.columns, effectiveVisibleColumnKeys],
    );

    // The rows currently on screen in the Line List after the user's column
    // filters/sort are applied. The Pivot tab and both exports are driven
    // from this instead of the raw dataset so they reflect what's filtered.
    const [filteredRows, setFilteredRows] = useState<AnalyticsRow[]>(
        dataset.rows,
    );
    useEffect(() => {
        setFilteredRows(dataset.rows);
    }, [dataset.rows]);

    const [pivotExportInfo, setPivotExportInfo] = useState<PivotExportInfo>({
        result: { rowHeaders: [], columnHeaders: [], rowKeys: [], columnKeys: [], cells: {} },
        measures: [{ id: "count", label: "Count", aggregation: "count" }],
    });

    return (
        <Flex
            vertical
            gap="middle"
            style={{ height: "calc(100vh - 48px - 64px)", padding: 16, minHeight: 0 }}
        >
            <style>{`
                .analytics-tabs.ant-tabs {
                    flex: 1;
                    min-height: 0;
                }
                .analytics-tabs .ant-tabs-content-holder,
                .analytics-tabs .ant-tabs-content,
                .analytics-tabs .ant-tabs-tabpane {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    min-height: 0;
                }
                .analytics-tabs .ant-tabs-tabpane.ant-tabs-tabpane-hidden {
                    display: none;
                }
            `}</style>
            <Flex align="center" justify="space-between" wrap gap="middle">
                <Flex vertical gap={0}>
                    <Title level={3} style={{ margin: 0 }}>
                        Analytics
                    </Title>
                    <Text type="secondary">
                        {dataset.rows.length} main events
                    </Text>
                </Flex>
                <AnalyticsFilterBar
                    program={program}
                    filters={filters}
                    onChange={setFilters}
                />
            </Flex>
            <Tabs
                className="analytics-tabs"
                style={{ minHeight: 0 }}
                items={[
                    {
                        key: "line-list",
                        label: "Line List",
                        children: (
                            <Flex
                                vertical
                                gap="middle"
                                style={{ height: "100%", minHeight: 0 }}
                            >
                                <Flex gap="middle" justify="flex-end">
                                    <ColumnChooser
                                        columns={dataset.columns}
                                        visibleColumnKeys={
                                            effectiveVisibleColumnKeys
                                        }
                                        onChange={setVisibleColumnKeys}
                                    />
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() =>
                                            writeWorkbookFile(
                                                exportLineListWorkbook({
                                                    columns: visibleColumns,
                                                    rows: filteredRows,
                                                }),
                                                "analytics-line-list.xlsx",
                                            )
                                        }
                                    >
                                        Export
                                    </Button>
                                </Flex>
                                <LineListTable
                                    columns={dataset.columns}
                                    rows={dataset.rows}
                                    visibleColumnKeys={
                                        effectiveVisibleColumnKeys
                                    }
                                    optionSets={optionSets}
                                    onFilteredRowsChange={setFilteredRows}
                                />
                            </Flex>
                        ),
                    },
                    {
                        key: "pivot",
                        label: "Pivot",
                        children: (
                            <Flex
                                vertical
                                gap="middle"
                                style={{ height: "100%", minHeight: 0 }}
                            >
                                <Flex justify="flex-end">
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() =>
                                            writeWorkbookFile(
                                                exportPivotWorkbook(
                                                    pivotExportInfo,
                                                ),
                                                "analytics-pivot.xlsx",
                                            )
                                        }
                                    >
                                        Export
                                    </Button>
                                </Flex>
                                <PivotBuilder
                                    columns={visibleColumns}
                                    rows={filteredRows}
                                    onResultChange={setPivotExportInfo}
                                />
                            </Flex>
                        ),
                    },
                ]}
            />
        </Flex>
    );
}
