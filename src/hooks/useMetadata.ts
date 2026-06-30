import { SyncContext } from "../machines";
import { DataElement, TrackedEntityAttribute } from "../schemas";
import { queryInfo } from "../utils/utils";

export const useMetadata = (): Awaited<ReturnType<typeof queryInfo>> => {
    const metadata = SyncContext.useSelector((a) => a.context.metadata);
    const { organisationUnits } = SyncContext.useSelector(
        (a) => a.context.userInfo,
    );
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
                sortOrder: number;
            }>
        >(),
    } = metadata;

    if (program === undefined) {
        throw new Error("OrgUnit or program undefined");
    }

    return {
        trackedEntityAttributes,
        programRules,
        programRuleVariables,
        program,
        dataElements,
        optionGroups,
        optionSets,
        orgUnitName: organisationUnits[0].name,
        orgUnit: organisationUnits[0].id,
    };
};
