import { DownloadOutlined } from "@ant-design/icons";
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { Badge, Button, Empty, Flex, Spin, Tabs } from "antd";
import dayjs from "dayjs";
import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { z } from "zod";
import {
    applyComputedColumns,
    computedColumnKey,
} from "../analytics/computed-columns";
import type { ComputedColumnDefinition } from "../analytics/computed-columns";
import { buildParentEventDataset } from "../analytics/parent-event-dataset";
import type { SavedLineListView } from "../analytics/saved-views";
import type { AnalyticsDataset, AnalyticsRow } from "../analytics/types";
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
import { SavedViewsModal } from "../components/analytics/saved-views-modal";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "../db/collections";
import { useComputedColumns } from "../hooks/useComputedColumns";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMetadata } from "../hooks/useMetadata";
import { useSavedViews } from "../hooks/useSavedViews";
import { useStageHierarchyConfig } from "../hooks/useStageHierarchyConfig";
import { useUIConfig } from "../hooks/useUIConfig";
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

// Fallback used only for the very first paint, before the measurement
// effect below has run — matches the app's usual header budget so there's
// no visible flash before the real measurement kicks in.
const FALLBACK_AVAILABLE_HEIGHT = "calc(100vh - 112px)";

/**
 * Measures the actual space between this element's top and the bottom of
 * the viewport, instead of guessing it from a hardcoded header height. A
 * fixed `calc(100vh - Npx)` breaks whenever the header is a different
 * height than assumed (e.g. the mobile header, which is shorter) or extra
 * banners (update/migration notices) push content down — either under- or
 * over-shoots the real available height, so the table ends up not filling
 * it (or overflowing the page instead of scrolling internally).
 */
function useAvailableHeight() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => {
            const top = el.getBoundingClientRect().top;
            setHeight(Math.max(window.innerHeight - top, 200));
        };
        measure();
        window.addEventListener("resize", measure);
        const observer = new ResizeObserver(measure);
        observer.observe(document.body);
        return () => {
            window.removeEventListener("resize", measure);
            observer.disconnect();
        };
    }, []);

    return { ref, height };
}

function AnalyticsPage() {
    const isMobile = useIsMobile();
    const { ref: availableHeightRef, height: availableHeight } =
        useAvailableHeight();
    const {
        program,
        orgUnit,
        trackedEntityAttributes,
        dataElements,
        optionSets,
    } = useMetadata();
    const uiConfig = useUIConfig();
    const stageHierarchyPairs = useStageHierarchyConfig();
    const trackedEntitiesCollection = getTrackedEntitiesCollection();
    const enrollmentsCollection = getEnrollmentsCollection();
    const eventsCollection = getEventsCollection();
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
    // useLayoutEffect (not useEffect) so this fires synchronously right
    // after mount, before the dataset-build effect below gets a chance to
    // run its deliberately-deferred (setTimeout) heavy computation — that
    // gap was previously wide enough that a slow device could still be
    // sitting on a URL with `restore=...` in it (a user refreshing right
    // after returning from a record's detail view could land back on the
    // stale filters/table-column-filters that snapshot captured).
    useLayoutEffect(() => {
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
                // Nothing pre-selected — the user picks a stage and a
                // period before any data is pulled/computed.
                selectedStageId: "",
                childStageIds: [],
                serviceTypes: [],
                startDate: "",
                endDate: "",
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

    // Nothing to compute until the user has picked both a stage and a
    // period — also keeps the page from building/rendering a large default
    // dataset before the user has actually asked for anything.
    const hasRequiredFilters = Boolean(
        filters.selectedStageId && filters.startDate && filters.endDate,
    );
    const emptyDataset: AnalyticsDataset = useMemo(
        () => ({ columns: [], rows: [], mainStage: program.programStages[0] }),
        [program],
    );
    const [datasetState, setDatasetState] = useState<{
        status: "idle" | "loading" | "ready";
        dataset: AnalyticsDataset;
    }>({ status: "idle", dataset: emptyDataset });
    // Guards a stale computation (superseded by a newer filter change while
    // it was still running) from overwriting the current one.
    const computeTokenRef = useRef(0);

    useEffect(() => {
        if (!hasRequiredFilters) {
            setDatasetState({ status: "idle", dataset: emptyDataset });
            return;
        }
        const token = ++computeTokenRef.current;
        setDatasetState((prev) => ({
            status: "loading",
            dataset: prev.dataset,
        }));
        // Building the dataset is synchronous and can be heavy for large
        // org units/date ranges — deferring it a tick lets the "loading"
        // state above actually paint (showing a spinner) before the main
        // thread blocks on the computation, instead of freezing on the
        // same frame as the filter change with nothing shown yet.
        const timer = setTimeout(() => {
            const built = buildParentEventDataset({
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
                selectedStageId: filters.selectedStageId,
                legalParentStageIds,
                childStageIds: filters.childStageIds,
                selectedServiceTypes: filters.serviceTypes,
                startDate: filters.startDate,
                endDate: filters.endDate,
                uiConfig,
            });
            if (computeTokenRef.current !== token) return;
            setDatasetState({ status: "ready", dataset: built });
        }, 0);
        return () => clearTimeout(timer);
    }, [
        hasRequiredFilters,
        emptyDataset,
        dataElements,
        enrollments,
        events,
        filters,
        legalParentStageIds,
        optionSets,
        orgUnit,
        program,
        trackedEntities,
        trackedEntityAttributes,
        uiConfig,
    ]);
    const dataset = datasetState.dataset;
    const { definitions: computedColumnDefinitions, save: saveComputedColumn, remove: removeComputedColumn } =
        useComputedColumns(filters.programId);
    const { views: savedViews, save: saveView, remove: removeSavedView } =
        useSavedViews(filters.programId);
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
    const buildSavedViewSnapshot = () => ({
        programId: filters.programId,
        filters,
        visibleColumnKeys,
        tableState,
    });
    const loadSavedView = (view: SavedLineListView) => {
        setFilters(view.filters);
        setVisibleColumnKeys(view.visibleColumnKeys);
        setTableState(view.tableState);
        setActiveTab("line-list");
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

    const datasetPlaceholder =
        datasetState.status === "idle" ? (
            <Flex
                align="center"
                justify="center"
                style={{ height: "100%", minHeight: 0 }}
            >
                <Empty description="Pick a program stage and a period above to load data" />
            </Flex>
        ) : (
            <Flex
                align="center"
                justify="center"
                style={{ height: "100%", minHeight: 0 }}
            >
                <Spin size="large" tip="Loading..." />
            </Flex>
        );

    const [pivotExportInfo, setPivotExportInfo] = useState<PivotExportInfo>({
        result: { rowHeaders: [], columnHeaders: [], rowKeys: [], columnKeys: [], cells: {} },
        measures: [{ id: "count", label: "Count", aggregation: "count" }],
    });

    return (
        <Flex
            ref={availableHeightRef}
            vertical
            gap="middle"
            style={{
                height: availableHeight ?? FALLBACK_AVAILABLE_HEIGHT,
                padding: isMobile ? 12 : 16,
                minHeight: 0,
            }}
        >
            <style>{`
                /*
                 * antd v6's Tabs (via @rc-component/tabs) gives EVERY pane —
                 * active or not — the class "ant-tabs-content"; only the
                 * active one also gets "ant-tabs-content-active", and an
                 * inactive one only gets "ant-tabs-content-hidden" (antd's
                 * own display:none rule for it) after its leave transition
                 * finishes. There is no single shared content wrapper and
                 * no "ant-tabs-tabpane" class in this version — targeting
                 * plain ".ant-tabs-content" here (as an earlier version of
                 * this rule did) makes every pane display:flex with a
                 * *higher specificity* than antd's own "-hidden" rule,
                 * overriding it — the Pivot pane and the Line List pane
                 * both stay visible and stack instead of only one showing
                 * at a time. Scope this to ".ant-tabs-content-active" only.
                 */
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
                        // Only the actual table (and its Export, which reads
                        // straight off the loaded rows) needs a dataset —
                        // Columns/Computed columns/Saved views all operate on
                        // state that already exists before any period is
                        // picked (an empty column list, this program's saved
                        // computed-column/view definitions), so they stay
                        // usable the whole time, e.g. to reopen a saved view
                        // that itself sets the period.
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
                                    <SavedViewsModal
                                        views={savedViews}
                                        onSave={saveView}
                                        onLoad={loadSavedView}
                                        onDelete={removeSavedView}
                                        buildSnapshot={buildSavedViewSnapshot}
                                    />
                                    <Button
                                        icon={<DownloadOutlined />}
                                        disabled={datasetState.status !== "ready"}
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
                                {datasetState.status !== "ready" ? (
                                    datasetPlaceholder
                                ) : (
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
                                )}
                            </Flex>
                        ),
                    },
                    {
                        key: "pivot",
                        label: "Pivot",
                        children:
                            datasetState.status !== "ready" ? (
                                datasetPlaceholder
                            ) : (
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
