import { DatePicker, Flex, Form, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import PeriodPicker from "../period-picker";
import type { Program } from "../../schemas";
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
    mainStageId: string;
    childStageIds: string[];
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

export function AnalyticsFilterBar({
    program,
    filters,
    onChange,
}: {
    program: Program;
    filters: AnalyticsFilters;
    onChange: (filters: AnalyticsFilters) => void;
}) {
    const isMobile = useIsMobile();
    // On mobile every field goes full-width, stacked; on desktop each keeps
    // its own comfortable minimum width and the row wraps as needed.
    const fieldStyle = (minWidth: number) =>
        isMobile ? { width: "100%" } : { minWidth };

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
                    style={fieldStyle(260)}
                    value={filters.mainStageId}
                    placeholder="Main stage"
                    options={program.programStages.map((stage) => ({
                        value: stage.id,
                        label: stage.name,
                    }))}
                    onChange={(mainStageId) =>
                        onChange({
                            ...filters,
                            mainStageId,
                            childStageIds: filters.childStageIds.filter(
                                (stageId) => stageId !== mainStageId,
                            ),
                        })
                    }
                />
            </Form.Item>
            <Form.Item label="Related Stages" layout="vertical">
                <Select
                    mode="multiple"
                    style={fieldStyle(300)}
                    value={filters.childStageIds}
                    placeholder="Child stages"
                    options={program.programStages
                        .filter((stage) => stage.id !== filters.mainStageId)
                        .map((stage) => ({
                            value: stage.id,
                            label: stage.name,
                        }))}
                    onChange={(childStageIds) =>
                        onChange({ ...filters, childStageIds })
                    }
                />
            </Form.Item>
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
