import { DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Badge, Button, Flex, Tabs } from "antd";
import React, { useMemo, useState } from "react";
import type { SavedLineListView } from "../../analytics/saved-views";
import { exportLineListWorkbook, writeWorkbookFile } from "../../analytics/xlsx-export";
import { AnalyticsFilterBar } from "../../components/analytics/analytics-filter-bar";
import type { AnalyticsFilters } from "../../components/analytics/analytics-filter-bar";
import { ColumnChooser } from "../../components/analytics/column-chooser";
import { ComputedColumnModal } from "./computed-columns/computed-column-modal";
import { EMPTY_LINE_LIST_TABLE_STATE, LineListTable } from "../../components/analytics/line-list-table";
import type { LineListTableState } from "../../components/analytics/line-list-table";
import type { PivotExportInfo } from "../../components/analytics/pivot-builder";
import { SavedViewsModal } from "../../components/analytics/saved-views-modal";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMetadata } from "../../hooks/useMetadata";
import { useSavedViews } from "../../hooks/useSavedViews";
import { useStageHierarchyConfig } from "../../hooks/useStageHierarchyConfig";
import { ANALYTICS_TABS_CSS, DatasetPlaceholder, PivotTab } from "./analytics-tabs";
import { AnalyticsRestoredState, encodeReturnSearch } from "./return-search";
import { useAnalyticsDataset } from "./use-analytics-dataset";
import { FALLBACK_AVAILABLE_HEIGHT, useAvailableHeight } from "./use-available-height";
import { useLineListColumns } from "./use-line-list-columns";

/** The service types data entry offers (the visit's `mrKZWf2WMIC` field). */
const SERVICE_TYPES_OPTION_SET = "QwsvSPpnRul";

const EMPTY_PIVOT: PivotExportInfo = {
    result: { rowHeaders: [], columnHeaders: [], rowKeys: [], columnKeys: [], cells: {} },
    measures: [{ id: "count", label: "Count", aggregation: "count" }],
};

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
    const [pivotExportInfo, setPivotExportInfo] = useState<PivotExportInfo>(EMPTY_PIVOT);

    const { status, dataset } = useAnalyticsDataset(filters);
    const list = useLineListColumns(dataset, filters.programId, restored?.visibleColumnKeys);
    const { views: savedViews, save: saveView, remove: removeSavedView } = useSavedViews(filters.programId);
    const serviceTypeOptions = useMemo(() => optionSets.get(SERVICE_TYPES_OPTION_SET) ?? [], [optionSets]);

    const returnSearch = () =>
        encodeReturnSearch({ filters, visibleColumnKeys: list.visibleColumnKeys, tab: activeTab, tableState });
    // Both open the client's page (an event also opens that event there),
    // as the sync-error fixing flow does.
    const openRecord = (trackedEntity: string, search: { edit: "client" } | { event: string }) =>
        navigate({
            to: "/tracked-entity/$trackedEntity",
            params: { trackedEntity },
            search: { ...search, from: "analytics", returnSearch: returnSearch() },
        });
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
                    visibleColumnKeys={list.visibleColumnKeys}
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
                    buildSnapshot={() => ({
                        programId: filters.programId,
                        filters,
                        visibleColumnKeys: list.visibleColumnKeys,
                        tableState,
                    })}
                />
                <Button
                    icon={<DownloadOutlined />}
                    disabled={status !== "ready"}
                    onClick={() =>
                        writeWorkbookFile(
                            exportLineListWorkbook({ columns: list.exportableVisibleColumns, rows: list.filteredRows }),
                            "analytics-line-list.xlsx",
                        )
                    }
                >
                    Export
                </Button>
            </Flex>
            {status !== "ready" ? (
                <DatasetPlaceholder status={status} />
            ) : (
                <LineListTable
                    columns={list.columns}
                    rows={list.rows}
                    visibleColumnKeys={list.visibleColumnKeys}
                    optionSets={optionSets}
                    tableState={tableState}
                    onFilteredRowsChange={list.setFilteredRows}
                    onTableStateChange={setTableState}
                    onOpenTrackedEntity={(trackedEntity) => openRecord(trackedEntity, { edit: "client" })}
                    onOpenEvent={(trackedEntity, event) => openRecord(trackedEntity, { event })}
                />
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
                                <Badge count={list.filteredRows.length} overflowCount={99999} color="#1890ff" />
                            </Flex>
                        ),
                        children: lineList,
                    },
                    {
                        key: "pivot",
                        label: "Pivot",
                        children: (
                            <PivotTab
                                status={status}
                                columns={list.visibleColumns}
                                rows={list.filteredRows}
                                exportInfo={pivotExportInfo}
                                onExportInfoChange={setPivotExportInfo}
                            />
                        ),
                    },
                ]}
            />
        </Flex>
    );
}
