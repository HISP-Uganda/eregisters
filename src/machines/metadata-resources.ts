import type {
    CategoryOptionCombo,
    DataElement,
    DataSet,
    Metadata,
    OU,
    Program,
    ProgramIndicator,
    ProgramRule,
    ProgramRuleVariable,
    Resource,
    TrackedEntityAttribute,
} from "@/schemas";
import { SYNC_TIMEOUTS_MS } from "./network-reachability";

/**
 * What the metadata pull requests for each resource and how it reads the
 * answer — one entry per resource, used by `pullMetadataResources`
 * (sync-metadata-actors.ts).
 */

const PROGRAM = "ueBhWkWll5v";

type ResourceContext = {
    userOrgUnit: string;
    /** Only records changed after this (incremental pulls); else everything. */
    since: string | undefined;
};

type ResourceQuery = {
    resource: string;
    id?: string;
    params?: Record<string, unknown>;
};

type ResourceDefinition = {
    timeoutMs: number;
    /** The DHIS2 query, keyed as the response will be. */
    query: (context: ResourceContext) => Record<string, ResourceQuery>;
    /** This resource's part of the pulled metadata. */
    read: (response: any) => Partial<Metadata>;
};

type Option = { id: string; name: string; code: string; sortOrder: number };

/** `filter` for the resources pulled incrementally. */
const changedSince = (since: string | undefined) =>
    since ? { filter: `lastUpdated:gt:${since}` } : {};

/** Program rules and variables: this program's, changed since if given. */
const programFilters = (since: string | undefined) => [
    `program.id:eq:${PROGRAM}`,
    ...(since ? [`lastUpdated:gt:${since}`] : []),
];

const PROGRAM_FIELDS =
    "id,name,programSections[id,name,sortOrder,trackedEntityAttributes[id]],trackedEntityType[id,trackedEntityTypeAttributes[id]],programType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,programStages[id,repeatable,name,code,executionDateLabel,programStageDataElements[id,sortOrder,compulsory,renderOptionsAsRadio,dataElement[id],renderType,allowFutureDate],programStageSections[id,name,sortOrder,dataElements[id]]],programTrackedEntityAttributes[id,mandatory,searchable,renderOptionsAsRadio,renderType,sortOrder,allowFutureDate,displayInList,trackedEntityAttribute[id]]";

/**
 * Resources with no entry (e.g. `programStages`, which come with the
 * program) need no request: they count as pulled.
 */
export const METADATA_RESOURCES: Partial<Record<Resource, ResourceDefinition>> = {
    // Always pulled in full.
    categoryOptionCombos: {
        timeoutMs: SYNC_TIMEOUTS_MS.probe,
        query: () => ({
            categoryOptionCombos: {
                resource: "categoryCombos/UjXPudXlraY/categoryOptionCombos.json",
                params: { fields: "id,name,access,categoryOptions[id,name,access]" },
            },
        }),
        read: (r: { categoryOptionCombos: { categoryOptionCombos: CategoryOptionCombo[] } }) => ({
            categoryOptionCombos: r.categoryOptionCombos.categoryOptionCombos,
        }),
    },
    organisationUnits: {
        timeoutMs: SYNC_TIMEOUTS_MS.probe,
        query: ({ userOrgUnit }) => ({
            organisationUnits: {
                resource: `organisationUnits/${userOrgUnit}.json`,
                params: {
                    fields: "id,name,code,path,parent,organisationUnitGroups[id,code]",
                    paging: false,
                    includeDescendants: true,
                },
            },
        }),
        read: (r: { organisationUnits: { organisationUnits: OU[] } }) => ({
            organisationUnits: r.organisationUnits.organisationUnits,
        }),
    },
    dataSets: {
        timeoutMs: SYNC_TIMEOUTS_MS.probe,
        query: () => ({
            dataSets: {
                resource: "dataSets.json",
                // The list is paged (50) unless told otherwise; the category
                // option combos endpoint above isn't.
                params: { fields: "id,name,code,periodType", paging: false },
            },
        }),
        read: (r: { dataSets: { dataSets: DataSet[] } }) => ({
            dataSets: r.dataSets.dataSets,
        }),
    },
    programs: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: () => ({
            program: { resource: "programs", id: PROGRAM, params: { fields: PROGRAM_FIELDS } },
        }),
        read: (r: { program: Program }) => ({ programs: [r.program] }),
    },

    // Pulled incrementally when the metadata sync is incremental.
    dataElements: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: ({ since }) => ({
            dataElements: {
                resource: "dataElements",
                params: {
                    fields: "id,name,code,valueType,formName,optionSetValue,optionSet[id]",
                    paging: false,
                    ...changedSince(since),
                },
            },
        }),
        read: (r: { dataElements: { dataElements: DataElement[] } }) => ({
            dataElements: r.dataElements.dataElements,
        }),
    },
    programIndicators: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: ({ since }) => ({
            programIndicators: {
                resource: "programIndicators",
                params: {
                    fields: "id,name,filter,program,aggregationType,expression",
                    paging: false,
                    ...changedSince(since),
                },
            },
        }),
        read: (r: { programIndicators: { programIndicators: ProgramIndicator[] } }) => ({
            programIndicators: r.programIndicators.programIndicators,
        }),
    },
    attributes: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: ({ since }) => ({
            trackedEntityAttributes: {
                resource: "trackedEntityAttributes",
                params: {
                    fields: "id,name,code,unique,generated,pattern,confidential,valueType,optionSetValue,displayFormName,formName,optionSet[id]",
                    paging: false,
                    ...changedSince(since),
                },
            },
        }),
        read: (r: { trackedEntityAttributes: { trackedEntityAttributes: TrackedEntityAttribute[] } }) => ({
            trackedEntityAttributes: r.trackedEntityAttributes.trackedEntityAttributes,
        }),
    },
    programRules: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: () => ({
            programRules: {
                resource: "programRules.json",
                params: {
                    filter: [`program.id:eq:${PROGRAM}`],
                    fields: "id,condition,priority,program[id],programStage[id]",
                    paging: false,
                },
            },
            programRuleActions: {
                resource: "programRuleActions.json",
                params: {
                    fields: "id,programRuleActionType,programRule[id],dataElement[id],trackedEntityAttribute[id],programStage[id],programStageSection[id],option[id],optionGroup[id],data,content,location,templateUid",
                    paging: false,
                },
            },
        }),
        read: (r: {
            programRules: { programRules: ProgramRule[] };
            programRuleActions: { programRuleActions: (ProgramRule["programRuleActions"][number] & { programRule: { id: string } })[] };
        }) => {
            const rules = r.programRules.programRules;
            const actions = r.programRuleActions.programRuleActions;
            if (!Array.isArray(rules) || !Array.isArray(actions)) throw new Error("Incomplete program rule metadata");
            const byRule = new Map(rules.map((rule) => [rule.id, [] as ProgramRule["programRuleActions"]]));
            for (const action of actions) {
                if (!action.programRule?.id) throw new Error("Program rule action has no parent");
                const bucket = byRule.get(action.programRule.id);
                if (bucket) bucket.push(action);
            }
            return {
                programRules: rules.map((rule) => ({
                    ...rule,
                    programRuleActions: byRule.get(rule.id) ?? [],
                }))
            };
        },
    },
    programRuleVariables: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: ({ since }) => ({
            programRuleVariables: {
                resource: "programRuleVariables.json",
                params: {
                    filter: programFilters(since),
                    fields: "id,name,programRuleVariableSourceType,dataElement[id],trackedEntityAttribute[id],programStage[id]",
                    paging: false,
                },
            },
        }),
        read: (r: { programRuleVariables: { programRuleVariables: ProgramRuleVariable[] } }) => ({
            programRuleVariables: r.programRuleVariables.programRuleVariables,
        }),
    },
    optionSets: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: () => ({
            options: {
                resource: "options",
                params: {
                    fields: "id,name,code,sortOrder,optionSet[id]",
                    paging: false,
                },
            },
            optionSets: {
                resource: "optionSets",
                params: {
                    fields: "id,name",
                    paging: false,
                },
            },
        }),
        read: (r: {
            options: { options: (Option & { optionSet?: { id: string } })[] };
            optionSets: { optionSets: { id: string; name: string }[] };
        }) => {
            const options = r.options?.options;
            const optionSets = r.optionSets?.optionSets;
            if (!Array.isArray(options) || !Array.isArray(optionSets)) throw new Error("Incomplete option metadata");
            const optionSetNames = new Map(optionSets.map((set) => [set.id, set.name]));
            return {
                optionSets: options.flatMap(({ optionSet, ...option }) => {
                    if (!optionSet) return [];
                    const optionSetName = optionSetNames.get(optionSet.id);
                    if (!optionSetName) throw new Error(`Option ${option.id} references missing set ${optionSet.id}`);
                    return [{ ...option, optionSet: optionSet.id, optionSetName }];
                }),
            };
        },
    },
    optionGroups: {
        timeoutMs: SYNC_TIMEOUTS_MS.bulkMetadata,
        query: () => ({
            optionGroups: {
                resource: "optionGroups",
                params: {
                    fields: "id,options[id]",
                    paging: false,
                },
            },
        }),
        read: (r: { optionGroups: { optionGroups: { id: string; options: { id: string }[] }[] } }) => {
            const groups = r.optionGroups.optionGroups;
            if (!Array.isArray(groups) || groups.some((group) => !Array.isArray(group.options))) {
                throw new Error("Incomplete option group metadata");
            }
            return {
                optionGroups: groups.flatMap((group) =>
                    group.options.map((option) => ({ id: option.id, name: "", code: "", sortOrder: 0, optionGroup: group.id })),
                )
            };
        },
    },
};
