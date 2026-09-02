import { DownloadOutlined } from "@ant-design/icons";
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { Badge, Button, Flex, Tabs } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
    applyComputedColumns,
    computedColumnKey,
} from "../analytics/computed-columns";
import type { ComputedColumnDefinition } from "../analytics/computed-columns";
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
import { ComputedColumnModal } from "../components/analytics/computed-column-modal";
import {
    EMPTY_LINE_LIST_TABLE_STATE,
    LineListTable,
} from "../components/analytics/line-list-table";
import type { LineListTableState } from "../components/analytics/line-list-table";
import { PivotBuilder } from "../components/analytics/pivot-builder";
import type { PivotExportInfo } from "../components/analytics/pivot-builder";
import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";
import { useComputedColumns } from "../hooks/useComputedColumns";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMetadata } from "../hooks/useMetadata";
import { useStageHierarchyConfig } from "../hooks/useStageHierarchyConfig";
import { RootRoute } from "./__root";

export const AnalyticsRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/analytics",
    component: AnalyticsPage,
    validateSearch: z.object({
        /** JSON-encoded snapshot of filters/columns/tab to restore on
         * arrival — set when returning here from a record opened from the
         * line list, so the user's prior selections aren't lost. */
        restore: z.string().optional(),
    }),
});

interface AnalyticsRestoredState {
    filters: AnalyticsFilters;
    visibleColumnKeys: string[];
    tab: string;
    /** Omitted when the snapshot's `returnSearch` would otherwise grow past
     * `MAX_RETURN_SEARCH_LENGTH` — see `buildReturnSearch`. */
    tableState?: LineListTableState;
}

// Every modern evergreen browser accepts URLs far longer than this (Chrome
// ~2MB, Firefox ~65K, Safari tens of thousands) — this cap is just headroom
// so a page with many columns and heavily-filtered ones can never approach
// any browser's actual ceiling. The column filter/sort snapshot is the only
// part of the round trip that scales with the data (one entry per selected
// filter value across every filtered column), so it's the one we drop first
// if the encoded snapshot ever gets this large; filters/columns/tab stay
// tiny and bounded regardless of how many columns the program has.
const MAX_RETURN_SEARCH_LENGTH = 8000;

function AnalyticsPage() {
    const isMobile = useIsMobile();
    const {
        program,
        orgUnit,
        trackedEntityAttributes,
        dataElements,
        optionSets,
    } = useMetadata();
    const defaultStage = program.programStages[0]?.id ?? "";
    const stageHierarchyPairs = useStageHierarchyConfig();
    const routeSearch = AnalyticsRoute.useSearch();
    const routeNavigate = AnalyticsRoute.useNavigate();
    const [restored] = useState<AnalyticsRestoredState | null>(() => {
        if (!routeSearch.restore) return null;
        try {
            return JSON.parse(routeSearch.restore) as AnalyticsRestoredState;
        } catch {
            return null;
        }
    });
    // The restored snapshot is only needed once, on arrival — drop it from
    // the URL so a later reload/share doesn't stick to a stale selection.
    useEffect(() => {
        if (!routeSearch.restore) return;
        routeNavigate({
            search: (prev) => ({ ...prev, restore: undefined }),
            replace: true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [filters, setFilters] = useState<AnalyticsFilters>(
        () =>
            restored?.filters ?? {
                programId: program.id,
                selectedStageId: defaultStage,
                childStageIds: [],
                serviceTypes: [],
                startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
                endDate: dayjs().format("YYYY-MM-DD"),
                rangeType: "custom",
            },
    );
    const [activeTab, setActiveTab] = useState<string>(
        () => restored?.tab ?? "line-list",
    );
    const [tableState, setTableState] = useState<LineListTableState>(
        () => restored?.tableState ?? EMPTY_LINE_LIST_TABLE_STATE,
    );

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

    const legalParentStageIds = useMemo(
        () =>
            stageHierarchyPairs
                .filter((p) => p.childStageId === filters.selectedStageId)
                .map((p) => p.parentStageId),
        [stageHierarchyPairs, filters.selectedStageId],
    );

    // Same optionSet the main event capture form's Service Type field uses
    // (mrKZWf2WMIC) — keeps the Analytics filter's vocabulary identical to
    // what data entry actually offers.
    const serviceTypeOptions = useMemo(
        () => optionSets.get("QwsvSPpnRul") ?? [],
        [optionSets],
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
                selectedStageId: filters.selectedStageId || defaultStage,
                legalParentStageIds,
                childStageIds: filters.childStageIds,
                selectedServiceTypes: filters.serviceTypes,
                startDate: filters.startDate,
                endDate: filters.endDate,
            }),
        [
            dataElements,
            defaultStage,
            enrollments,
            events,
            filters,
            legalParentStageIds,
            optionSets,
            orgUnit,
            program,
            stageHierarchyPairs,
            trackedEntities,
            trackedEntityAttributes,
        ],
    );
    const { definitions: computedColumnDefinitions, save: saveComputedColumn, remove: removeComputedColumn } =
        useComputedColumns(filters.programId);
    const numericSourceColumns = useMemo(
        () => dataset.columns.filter((column) => column.valueKind === "number"),
        [dataset.columns],
    );
    const { columns: columnsWithComputed, rows: computedRows } = useMemo(
        () =>
            applyComputedColumns(
                dataset.columns,
                dataset.rows,
                computedColumnDefinitions,
            ),
        [dataset.columns, dataset.rows, computedColumnDefinitions],
    );

    const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
        () =>
            restored?.visibleColumnKeys ??
            columnsWithComputed
                .filter((column) => column.defaultVisible)
                .map((column) => column.key),
    );
    const effectiveVisibleColumnKeys = visibleColumnKeys;
    const visibleColumns = useMemo(
        () =>
            columnsWithComputed.filter((column) =>
                effectiveVisibleColumnKeys.includes(column.key),
            ),
        [columnsWithComputed, effectiveVisibleColumnKeys],
    );
    const exportableVisibleColumns = useMemo(
        () => visibleColumns.filter((column) => !column.isComputed),
        [visibleColumns],
    );

    // The rows currently on screen in the Line List after the user's column
    // filters/sort are applied. The Pivot tab and both exports are driven
    // from this instead of the raw dataset so they reflect what's filtered.
    const [filteredRows, setFilteredRows] = useState<AnalyticsRow[]>(
        computedRows,
    );
    useEffect(() => {
        setFilteredRows(computedRows);
    }, [computedRows]);

    const handleSaveComputedColumn = (definition: ComputedColumnDefinition) => {
        saveComputedColumn(definition);
        const key = computedColumnKey(definition.id);
        setVisibleColumnKeys((prev) =>
            prev.includes(key) ? prev : [...prev, key],
        );
    };

    // Same navigation as the sync-error-fixing flow (sync-failures-modal.tsx):
    // both the tracked entity and the event views live on the tracked entity
    // route, an event just also opens that specific event within it.
    const navigate = useNavigate();
    const buildReturnSearch = () => {
        const snapshot: AnalyticsRestoredState = {
            filters,
            visibleColumnKeys,
            tab: activeTab,
            tableState,
        };
        const encoded = JSON.stringify(snapshot);
        if (encoded.length <= MAX_RETURN_SEARCH_LENGTH) return encoded;
        return JSON.stringify({
            ...snapshot,
            tableState: undefined,
        } satisfies AnalyticsRestoredState);
    };
    const openTrackedEntity = (trackedEntity: string) => {
        navigate({
            to: "/tracked-entity/$trackedEntity",
            params: { trackedEntity },
            search: {
                edit: "client",
                from: "analytics",
                returnSearch: buildReturnSearch(),
            },
        });
    };
    const openEvent = (trackedEntity: string, event: string) => {
        navigate({
            to: "/tracked-entity/$trackedEntity",
            params: { trackedEntity },
            search: {
                event,
                from: "analytics",
                returnSearch: buildReturnSearch(),
            },
        });
    };

    const [pivotExportInfo, setPivotExportInfo] = useState<PivotExportInfo>({
        result: { rowHeaders: [], columnHeaders: [], rowKeys: [], columnKeys: [], cells: {} },
        measures: [{ id: "count", label: "Count", aggregation: "count" }],
    });

    return (
        <Flex
            vertical
            gap="middle"
            style={{
                height: "calc(100vh - 48px - 64px)",
                padding: isMobile ? 12 : 16,
                minHeight: 0,
            }}
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
            <AnalyticsFilterBar
                program={program}
                pairs={stageHierarchyPairs}
                filters={filters}
                serviceTypeOptions={serviceTypeOptions}
                onChange={setFilters}
            />
            <Tabs
                className="analytics-tabs"
                style={{ minHeight: 0 }}
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: "line-list",
                        label: (
                            <Flex align="center" gap={6}>
                                Line List
                                <Badge
                                    count={filteredRows.length}
                                    overflowCount={99999}
                                    color="#1890ff"
                                />
                            </Flex>
                        ),
                        children: (
                            <Flex
                                vertical
                                gap="middle"
                                style={{ height: "100%", minHeight: 0 }}
                            >
                                <Flex gap="middle" wrap justify="flex-end">
                                    <ColumnChooser
                                        columns={columnsWithComputed}
                                        visibleColumnKeys={
                                            effectiveVisibleColumnKeys
                                        }
                                        onChange={setVisibleColumnKeys}
                                    />
                                    <ComputedColumnModal
                                        programId={filters.programId}
                                        numericColumns={numericSourceColumns}
                                        definitions={computedColumnDefinitions}
                                        onSave={handleSaveComputedColumn}
                                        onDelete={removeComputedColumn}
                                    />
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() =>
                                            writeWorkbookFile(
                                                exportLineListWorkbook({
                                                    columns: exportableVisibleColumns,
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
                                    columns={columnsWithComputed}
                                    rows={computedRows}
                                    visibleColumnKeys={
                                        effectiveVisibleColumnKeys
                                    }
                                    optionSets={optionSets}
                                    tableState={tableState}
                                    onFilteredRowsChange={setFilteredRows}
                                    onTableStateChange={setTableState}
                                    onOpenTrackedEntity={openTrackedEntity}
                                    onOpenEvent={openEvent}
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
