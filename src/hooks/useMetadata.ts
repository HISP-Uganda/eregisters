import { SyncContext } from "@/machines";
import { DataElement, Program, TrackedEntityAttribute } from "@/schemas";
import { buildRuleEnvironment } from "@/program-rules/history";
import { useMemo } from "react";

export const useMetadata = () => {
    const metadata = SyncContext.useSelector((a) => a.context.metadata);
    const userInfo = SyncContext.useSelector((a) => a.context.userInfo);
    const {
        organisationUnits: [{ id, name }],
    } = SyncContext.useSelector((a) => a.context.userInfo);
    const {
        program,
        trackedEntityAttributes = new Map<string, TrackedEntityAttribute>(),
        programRuleVariables = [],
        programRules = [],
        dataElements = new Map<string, DataElement>(),
        optionGroups = new Map<
            string,
            Array<{
                id: string;
                name: string;
                code: string;
                optionGroup: string;
                sortOrder: number;
            }>
        >(),
        optionSets = new Map<
            string,
            Array<{
                id: string;
                name: string;
                code: string;
                optionSet: string;
                optionSetName?: string;
                sortOrder: number;
            }>
        >(),
        dataSets = [],
        organisationUnits = [],
        categoryOptionCombos = [],
    } = metadata;

    const ruleEnvironment = useMemo(() => buildRuleEnvironment(userInfo, organisationUnits), [userInfo, organisationUnits]);
    return {
        ruleEnvironment,
        trackedEntityAttributes,
        programRules,
        programRuleVariables,
        program: program as Program,
        dataElements,
        optionGroups,
        optionSets,
        orgUnitName: name,
        orgUnit: id,
        dataSets,
        organisationUnits,
        categoryOptionCombos,
    };
};
