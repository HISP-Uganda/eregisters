import { DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Badge, Button, Flex, Tabs, message } from "antd";
import React, { useMemo, useState } from "react";
import type { SavedLineListView } from "@/analytics/saved-views";
import { exportLineListWorkbook, writeWorkbookFile } from "@/analytics/xlsx-export";
import { AnalyticsFilterBar } from "@/components/analytics/analytics-filter-bar";
import type { AnalyticsFilters } from "@/components/analytics/analytics-filter-bar";
import { ColumnChooser } from "@/components/analytics/column-chooser";
import { ComputedColumnModal } from "./computed-columns/computed-column-modal";
import { EMPTY_LINE_LIST_TABLE_STATE, LineListTable } from "@/components/analytics/line-list-table";
import type { LineListTableState } from "@/components/analytics/line-list-table";
import type { PivotExportInfo } from "@/components/analytics/pivot-builder";
import { SavedViewsModal } from "@/components/analytics/saved-views-modal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMetadata } from "@/hooks/useMetadata";
import { useSavedViews } from "@/hooks/useSavedViews";
import { useStageHierarchyConfig } from "@/hooks/useStageHierarchyConfig";
import { ANALYTICS_TABS_CSS, DatasetPlaceholder, PivotTab } from "./analytics-tabs";
import { AnalyticsRestoredState, encodeReturnSearch } from "./return-search";
import { useAnalyticsDataset } from "./use-analytics-dataset";
import { FALLBACK_AVAILABLE_HEIGHT, useAvailableHeight } from "./use-available-height";
import { useLineListColumns } from "./use-line-list-columns";
import { useIndexedLineListResult } from "./use-indexed-line-list-result";
import type { AnalyticsRow } from "@/analytics/types";

/** The service types data entry offers (the visit's `mrKZWf2WMIC` field). */
const SERVICE_TYPES_OPTION_SET = "QwsvSPpnRul";

const EMPTY_PIVOT: PivotExportInfo = {
    result: { rowHeaders: [], columnHeaders: [], rowKeys: [], columnKeys: [], cells: {} },
    measures: [{ id: "count", label: "Count", aggregation: "count" }],
};
const NO_ROWS: AnalyticsRow[] = [];

/**
 * Line lists and pivots over this facility's local records. `restored`:
 * the selections to come back to after opening a record from the list.
 */
export function AnalyticsScreen({ restored }: { restored: AnalyticsRestoredState | null }) {
    const isMobile = useIsMobile();
    const { ref: availableHeightRef, height: availableHeight } = useAvailableHeight();
    const { program, optionSets } = useMetadata();
    const stageHierarchyPairs = useStageHierarchyConfig();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<AnalyticsFilters>(
        () =>
            restored?.filters ?? {
                programId: program.id,
                // Nothing pre-selected: the user picks a stage and a period
                // before any data is computed.
                selectedStageId: "",
                childStageIds: [],
                serviceTypes: [],
                startDate: "",
                endDate: "",
                rangeType: "custom",
            },
    );
    const [activeTab, setActiveTab] = useState<string>(() => restored?.tab ?? "line-list");
    const [tableState, setTableState] = useState<LineListTableState>(
        () => restored?.tableState ?? EMPTY_LINE_LIST_TABLE_STATE,
    );
    const [pivotExportInfo, setPivotExportInfo] = useState<{ generation: number; info: PivotExportInfo }>({ generation: -1, info: EMPTY_PIVOT });

    const { status, dataset } = useAnalyticsDataset(filters);
    const list = useLineListColumns(dataset, filters.programId, restored?.visibleColumnKeys);
    const result = useIndexedLineListResult(status, list.rows, list.columns, optionSets, list.shownColumnKeys, tableState);
    const pivotRows = useMemo(
        () => activeTab === "pivot" && result.ready ? result.getRows() : NO_ROWS,
        [activeTab, result.ready, result.generation],
    );
    const { views: savedViews, save: saveView, remove: removeSavedView } = useSavedViews(filters.programId);
    const serviceTypeOptions = useMemo(() => optionSets.get(SERVICE_TYPES_OPTION_SET) ?? [], [optionSets]);

    // Both open the client's page (an event also opens that event there),
    // as the sync-error fixing flow does.
    const openRecord = (trackedEntity: string, search: { edit: "client" } | { event: string }) => {
        let returnSearch: string;
        try { returnSearch = encodeReturnSearch({ filters, visibleColumnKeys: list.visibleColumnKeys, tab: activeTab, tableState }); }
        catch (error) { message.error(error instanceof Error ? error.message : "Could not save the return selection."); return; }
        navigate({
            to: "/tracked-entity/$trackedEntity",
            params: { trackedEntity },
            search: { ...search, from: "analytics", returnSearch },
        });
    };
    const loadSavedView = (view: SavedLineListView) => {
        setFilters(view.filters);
        list.setVisibleColumnKeys(view.visibleColumnKeys);
        setTableState(view.tableState);
        setActiveTab("line-list");
    };

    const lineList = (
        <Flex vertical gap="middle" style={{ height: "100%", minHeight: 0 }}>
            {/* These work before any data is loaded (e.g. to open a saved
                view that sets the period); only the table and Export need it. */}
            <Flex gap="middle" wrap justify="flex-end">
                <ColumnChooser
                    columns={list.columns}
                    visibleColumnKeys={list.shownColumnKeys}
                    onChange={list.setVisibleColumnKeys}
                />
                <ComputedColumnModal
                    programId={filters.programId}
                    numericColumns={list.numericSourceColumns}
                    definitions={list.computedColumnDefinitions}
                    onSave={list.saveComputedColumn}
                    onDelete={list.removeComputedColumn}
                />
                <SavedViewsModal
                    views={savedViews}
                    onSave={saveView}
                    onLoad={loadSavedView}
                    onDelete={removeSavedView}
                    saveDisabled={!result.ready}
                    buildSnapshot={() => ({
                        programId: filters.programId,
                        filters,
                        visibleColumnKeys: list.visibleColumnKeys,
                        tableState,
                    })}
                />
                <Button
                    icon={<DownloadOutlined />}
                    disabled={!result.ready}
                    onClick={() =>
                        writeWorkbookFile(
                            exportLineListWorkbook({ columns: list.exportableVisibleColumns, rows: result.getRows() }),
                            "analytics-line-list.xlsx",
                        )
                    }
                >
                    Export
                </Button>
            </Flex>
            {status !== "ready" || !result.hasResult ? (
                <DatasetPlaceholder status={status === "ready" ? "loading" : status} />
            ) : (
                <>
                {result.pending && <span role="status">Filtering…</span>}
                <LineListTable
                    columns={list.columns}
                    rows={list.rows}
                    filteredRows={NO_ROWS}
                    rowCount={result.count}
                    rowAt={result.getRow}
                    resultGeneration={result.generation}
                    visibleColumnKeys={list.shownColumnKeys}
                    optionSets={optionSets}
                    tableState={tableState}
                    onTableStateChange={setTableState}
                    onOpenTrackedEntity={(trackedEntity) => openRecord(trackedEntity, { edit: "client" })}
                    onOpenEvent={(trackedEntity, event) => openRecord(trackedEntity, { event })}
                />
                </>
            )}
        </Flex>
    );

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
            <style>{ANALYTICS_TABS_CSS}</style>
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
                                <Badge count={result.count} overflowCount={99999} color="#1890ff" />
                            </Flex>
                        ),
                        children: lineList,
                    },
                    {
                        key: "pivot",
                        label: "Pivot",
                        children: (
                            <PivotTab
                                status={status === "ready" && !result.ready ? "loading" : status}
                                columns={list.visibleColumns}
                                rows={pivotRows}
                                exportInfo={pivotExportInfo.info}
                                exportDisabled={!result.ready || pivotExportInfo.generation !== result.generation}
                                onExportInfoChange={(info) => setPivotExportInfo({ generation: result.generation, info })}
                            />
                        ),
                    },
                ]}
            />
        </Flex>
    );
}
