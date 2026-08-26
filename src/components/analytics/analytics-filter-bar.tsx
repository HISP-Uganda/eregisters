import { DatePicker, Flex, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import type { Program } from "../../schemas";

const { RangePicker } = DatePicker;

export interface AnalyticsFilters {
    programId: string;
    mainStageId: string;
    childStageIds: string[];
    startDate: string;
    endDate: string;
}

export function AnalyticsFilterBar({
    program,
    filters,
    onChange,
}: {
    program: Program;
    filters: AnalyticsFilters;
    onChange: (filters: AnalyticsFilters) => void;
}) {
    return (
        <Flex gap="middle" wrap align="center">
            <Select
                style={{ minWidth: 260 }}
                value={filters.programId}
                options={[{ value: program.id, label: program.name }]}
                onChange={(programId) => onChange({ ...filters, programId })}
            />
            <Select
                style={{ minWidth: 260 }}
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
            <Select
                mode="multiple"
                style={{ minWidth: 300 }}
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
            <RangePicker
                value={[dayjs(filters.startDate), dayjs(filters.endDate)]}
                onChange={(range) => {
                    const [start, end] = range ?? [];
                    onChange({
                        ...filters,
                        startDate: formatDate(start, filters.startDate),
                        endDate: formatDate(end, filters.endDate),
                    });
                }}
            />
        </Flex>
    );
}

function formatDate(value: Dayjs | null | undefined, fallback: string) {
    return value?.format("YYYY-MM-DD") ?? fallback;
}
