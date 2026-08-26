import { DownloadOutlined } from "@ant-design/icons";
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { createRoute } from "@tanstack/react-router";
import { Button, Flex, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { buildParentEventDataset } from "../analytics/parent-event-dataset";
import { buildPivot } from "../analytics/pivot-engine";
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
        parentStageId: defaultStage,
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
                parentStageId: filters.parentStageId || defaultStage,
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
    const effectiveVisibleColumnKeys =
        visibleColumnKeys.length > 0
            ? visibleColumnKeys
            : dataset.columns
                  .filter((column) => column.defaultVisible)
                  .map((column) => column.key);
    const visibleColumns = dataset.columns.filter((column) =>
        effectiveVisibleColumnKeys.includes(column.key),
    );

    return (
        <Flex vertical gap="middle" style={{ padding: 16 }}>
            <Flex align="center" justify="space-between" wrap gap="middle">
                <Flex vertical gap={0}>
                    <Title level={3} style={{ margin: 0 }}>
                        Analytics
                    </Title>
                    <Text type="secondary">
                        {dataset.rows.length} parent events
                    </Text>
                </Flex>
                <AnalyticsFilterBar
                    program={program}
                    filters={filters}
                    onChange={setFilters}
                />
            </Flex>
            <Tabs
                items={[
                    {
                        key: "line-list",
                        label: "Line List",
                        children: (
                            <Flex vertical gap="middle">
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
                                                    rows: dataset.rows,
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
                                />
                            </Flex>
                        ),
                    },
                    {
                        key: "pivot",
                        label: "Pivot",
                        children: (
                            <Flex vertical gap="middle">
                                <Flex justify="flex-end">
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() => {
                                            const result = buildPivot({
                                                rows: dataset.rows,
                                                columns: dataset.columns,
                                                config: {
                                                    rows: [],
                                                    columns: [],
                                                    measures: [
                                                        {
                                                            id: "count",
                                                            label: "Count",
                                                            aggregation:
                                                                "count",
                                                        },
                                                    ],
                                                },
                                            });
                                            writeWorkbookFile(
                                                exportPivotWorkbook({
                                                    result,
                                                    measures: [
                                                        {
                                                            id: "count",
                                                            label: "Count",
                                                            aggregation:
                                                                "count",
                                                        },
                                                    ],
                                                }),
                                                "analytics-pivot.xlsx",
                                            );
                                        }}
                                    >
                                        Export
                                    </Button>
                                </Flex>
                                <PivotBuilder
                                    columns={dataset.columns}
                                    rows={dataset.rows}
                                />
                            </Flex>
                        ),
                    },
                ]}
            />
        </Flex>
    );
}
