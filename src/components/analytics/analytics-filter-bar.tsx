import { DatePicker, Flex, Form, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import PeriodPicker from "../period-picker";
import type { Program, StagePair } from "../../schemas";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
    currentPeriodId,
    periodBounds,
    type DhisPeriodType,
} from "../../utils/periods";

const { RangePicker } = DatePicker;

export type AnalyticsRangeType =
    | "custom"
    | "Yearly"
    | "Quarterly"
    | "Monthly"
    | "Weekly";

export interface AnalyticsFilters {
    programId: string;
    selectedStageId: string;
    childStageIds: string[];
    /** Selected Service Type codes (same vocabulary as the main event's
     * Service Type field). Only meaningful — and only shown in the filter
     * bar — when the selected stage has configured child stages; see
     * `serviceTypeOptions` below. */
    serviceTypes: string[];
    startDate: string;
    endDate: string;
    /** "custom" uses startDate/endDate directly via the range picker; the
     * other values drive a single-period picker whose bounds overwrite
     * startDate/endDate whenever a period is chosen. */
    rangeType: AnalyticsRangeType;
    /** The selected DHIS2 period id when `rangeType !== "custom"`. */
    periodId?: string;
}

const RANGE_TYPE_OPTIONS: { value: AnalyticsRangeType; label: string }[] = [
    { value: "custom", label: "Custom range" },
    { value: "Yearly", label: "Year" },
    { value: "Quarterly", label: "Quarter" },
    { value: "Monthly", label: "Month" },
    { value: "Weekly", label: "Week" },
];

function legalChildrenOf(stageId: string, pairs: StagePair[]) {
    return pairs
        .filter((p) => p.parentStageId === stageId)
        .map((p) => p.childStageId);
}

function legalParentsOf(stageId: string, pairs: StagePair[]) {
    return pairs
        .filter((p) => p.childStageId === stageId)
        .map((p) => p.parentStageId);
}

function describeRole(
    stageId: string,
    pairs: StagePair[],
    stageName: (id: string) => string | undefined,
) {
    const children = legalChildrenOf(stageId, pairs);
    const parents = legalParentsOf(stageId, pairs);
    const parts: string[] = [];
    if (parents.length > 0) {
        parts.push(
            `child of ${parents.map((id) => stageName(id) ?? id).join(", ")}`,
        );
    }
    if (children.length > 0) {
        parts.push(`parent of ${children.length} stage(s)`);
    }
    return parts.length > 0 ? ` — ${parts.join(", ")}` : "";
}

export function AnalyticsFilterBar({
    program,
    pairs,
    filters,
    onChange,
    serviceTypeOptions,
}: {
    program: Program;
    pairs: StagePair[];
    filters: AnalyticsFilters;
    onChange: (filters: AnalyticsFilters) => void;
    /** Service Type options (same optionSet the main event capture form
     * uses). The filter field itself only shows when the selected stage
     * has configured child stages — see `childStageIdsForSelectedStage`. */
    serviceTypeOptions: Array<{ code: string; name: string }>;
}) {
    const isMobile = useIsMobile();
    // On mobile every field goes full-width, stacked; on desktop each keeps
    // its own comfortable minimum width and the row wraps as needed.
    const fieldStyle = (minWidth: number) =>
        isMobile ? { width: "100%" } : { minWidth };
    const childStageIdsForSelectedStage = legalChildrenOf(
        filters.selectedStageId,
        pairs,
    );

    return (
        <Flex
            gap="middle"
            wrap
            vertical={isMobile}
            align={isMobile ? "stretch" : "center"}
        >
            <Form.Item label="Program" layout="vertical">
                <Select
                    style={fieldStyle(260)}
                    value={filters.programId}
                    options={[{ value: program.id, label: program.name }]}
                    onChange={(programId) =>
                        onChange({ ...filters, programId })
                    }
                />
            </Form.Item>
            <Form.Item label="Program Stage" layout="vertical">
                <Select
                    style={fieldStyle(320)}
                    value={filters.selectedStageId}
                    placeholder="Stage"
                    options={program.programStages.map((stage) => ({
                        value: stage.id,
                        label: `${stage.name}${describeRole(
                            stage.id,
                            pairs,
                            (id) =>
                                program.programStages.find(
                                    (s) => s.id === id,
                                )?.name,
                        )}`,
                    }))}
                    onChange={(selectedStageId) =>
                        onChange({
                            ...filters,
                            selectedStageId,
                            childStageIds: [],
                            serviceTypes: [],
                        })
                    }
                />
            </Form.Item>
            {childStageIdsForSelectedStage.length > 0 && (
                <Form.Item label="Include child stages" layout="vertical">
                    <Select
                        mode="multiple"
                        style={fieldStyle(300)}
                        value={filters.childStageIds}
                        placeholder="Child stages"
                        options={childStageIdsForSelectedStage.map((id) => ({
                            value: id,
                            label:
                                program.programStages.find(
                                    (s) => s.id === id,
                                )?.name ?? id,
                        }))}
                        onChange={(childStageIds) =>
                            onChange({ ...filters, childStageIds })
                        }
                    />
                </Form.Item>
            )}
            {childStageIdsForSelectedStage.length > 0 && (
                <Form.Item label="Service Type" layout="vertical">
                    <Select
                        mode="multiple"
                        style={fieldStyle(300)}
                        value={filters.serviceTypes}
                        placeholder="All services"
                        allowClear
                        options={serviceTypeOptions.map((o) => ({
                            value: o.code,
                            label: o.name,
                        }))}
                        onChange={(serviceTypes) =>
                            onChange({ ...filters, serviceTypes })
                        }
                    />
                </Form.Item>
            )}
            <Form.Item label="Period Type" layout="vertical">
                <Select
                    style={fieldStyle(150)}
                    value={filters.rangeType}
                    options={RANGE_TYPE_OPTIONS}
                    onChange={(rangeType: AnalyticsRangeType) => {
                        if (rangeType === "custom") {
                            onChange({ ...filters, rangeType });
                            return;
                        }
                        const periodId = currentPeriodId(rangeType);
                        const bounds = periodBounds(periodId);
                        onChange({
                            ...filters,
                            rangeType,
                            periodId,
                            startDate: bounds
                                ? bounds.start.format("YYYY-MM-DD")
                                : filters.startDate,
                            endDate: bounds
                                ? bounds.end.format("YYYY-MM-DD")
                                : filters.endDate,
                        });
                    }}
                />
            </Form.Item>

            <Form.Item label="Period" layout="vertical">
                {filters.rangeType === "custom" ? (
                    <RangePicker
                        style={isMobile ? { width: "100%" } : undefined}
                        value={[
                            dayjs(filters.startDate),
                            dayjs(filters.endDate),
                        ]}
                        onChange={(range) => {
                            const [start, end] = range ?? [];
                            onChange({
                                ...filters,
                                startDate: formatDate(start, filters.startDate),
                                endDate: formatDate(end, filters.endDate),
                            });
                        }}
                    />
                ) : (
                    <PeriodPicker
                        periodType={filters.rangeType as DhisPeriodType}
                        value={filters.periodId}
                        allowFuture
                        onChange={(periodId) => {
                            if (!periodId) return;
                            const bounds = periodBounds(periodId);
                            onChange({
                                ...filters,
                                periodId,
                                startDate: bounds
                                    ? bounds.start.format("YYYY-MM-DD")
                                    : filters.startDate,
                                endDate: bounds
                                    ? bounds.end.format("YYYY-MM-DD")
                                    : filters.endDate,
                            });
                        }}
                    />
                )}
            </Form.Item>
        </Flex>
    );
}

function formatDate(value: Dayjs | null | undefined, fallback: string) {
    return value?.format("YYYY-MM-DD") ?? fallback;
}
