import { FormInstance } from "antd";
import dayjs from "dayjs";
import { filterRuleOptions } from "@/program-rules/option-filter";
import React from "react";
import { ProgramRuleResult } from "@/schemas";
import { buildCurrentDataElements, calculateColSpan } from "@/utils/form-fields";
import { DataElementField } from "./data-element-field";
import { useMetadata } from "@/hooks/useMetadata";

interface DataElementRendererProps {
    dataElementId: string;
    currentDataElements: ReturnType<typeof buildCurrentDataElements>;
    ruleResult: ProgramRuleResult;
    sectionLength: number;
    form: FormInstance;
    onFieldChange: (fieldId: string, value: any) => void;
    mode?: "dataElement" | "attribute";
    xl?: number;
}
export const DataElementRenderer = React.memo(
    ({
        dataElementId,
        currentDataElements,
        ruleResult,
        sectionLength,
        form,
        onFieldChange,
        mode = "dataElement",
        xl,
    }: DataElementRendererProps) => {
        const {
            dataElements,
            trackedEntityAttributes,
            optionSets,
            optionGroups,
        } = useMetadata();

        if (ruleResult.hiddenFields.includes(dataElementId)) return null;

        const currentDataElement =
            mode === "attribute"
                ? trackedEntityAttributes.get(dataElementId)
                : dataElements.get(dataElementId);

        if (!currentDataElement) return null;

        if (ruleResult.hiddenSections.includes(dataElementId)) return null;

        const {
            compulsory = false,
            desktopRenderType,
            allowFutureDate,
        } = currentDataElements.get(dataElementId) ?? {};

        const optionSetId = currentDataElement.optionSet?.id ?? "";
        const finalOptions = filterRuleOptions(optionSets.get(optionSetId) ?? [], optionGroups, {
            hiddenOptions: ruleResult.hiddenOptions[dataElementId],
            shownOptions: ruleResult.shownOptions[dataElementId],
            hiddenOptionGroups: ruleResult.hiddenOptionGroups[dataElementId],
            shownOptionGroups: ruleResult.shownOptionGroups[dataElementId],
        });
        const errors = [...ruleResult.errors, ...(ruleResult.completionErrors ?? [])].filter((m) => m.key === dataElementId);
        const messages = [...ruleResult.messages, ...(ruleResult.displayKeyValues ?? [])].filter(
            (m) => m.key === dataElementId,
        );
        const warnings = [...ruleResult.warnings, ...(ruleResult.completionWarnings ?? [])].filter(
            (m) => m.key === dataElementId,
        );
        const isDisabled = dataElementId in ruleResult.assignments;

        return (
            <DataElementField
                dataElement={currentDataElement}
                hidden={false}
                desktopRenderType={desktopRenderType}
                finalOptions={finalOptions}
                messages={messages}
                warnings={warnings}
                errors={errors}
                required={compulsory || ruleResult.mandatoryFields.includes(dataElementId)}
                disabled={isDisabled}
                key={dataElementId}
                form={form}
                xs={calculateColSpan(sectionLength, 24)}
                sm={calculateColSpan(sectionLength, 24)}
                md={calculateColSpan(sectionLength, 24)}
                lg={calculateColSpan(sectionLength, 12)}
                xl={xl ?? calculateColSpan(sectionLength, 8)}
                onFieldChange={onFieldChange}
                disabledDate={(date) => {
                    if (allowFutureDate) return date.isBefore(dayjs(), "day");
                    return date.isAfter(dayjs(), "day");
                }}
            />
        );
    },
);
