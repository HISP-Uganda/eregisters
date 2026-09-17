import { assign, fromPromise, not, setup } from "xstate";
import {
    AggregateData,
    CategoryOptionCombo,
    DataElement,
    DataSet,
    DEFAULT_DATA_PULL_PAGE_SIZE,
    emptyStageHierarchyConfig,
    emptyUIConfig,
    Engine,
    FlattenedEvent,
    FlattenedOptionSet,
    FlattenedTrackedEntity,
    Metadata,
    MeUser,
    OU,
    Program,
    ProgramIndicator,
    ProgramRule,
    ProgramRuleVariable,
    Resource,
    StageHierarchyConfig,
    TrackedEntity,
    TrackedEntityAttribute,
    UIConfig,
} from "../schemas";

import { createActorContext } from "@xstate/react";
import { MessageInstance } from "antd/es/message/interface";
import { isEmpty } from "lodash";
import type { StorageBackend } from "../db/backend";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "../db/collections";
import type {
    CheckMetadataInfoResult,
    QueryMetadataInfoResult,
} from "../db/metadata-operations";
import type { MetadataStore } from "../db/metadata-store";
import { writePulledTrackedEntityPage } from "../db/pull-page";
import { dexieLocalLookups } from "../db/dexie/pull-page-lookups";
import type { SqlDriver } from "../db/sqlite/driver-types";
import { sqlLocalLookups } from "../db/sqlite/pull-page-lookups";
import { type ConnectivityStatus } from "./network-reachability";
import {
    checkMetadataSyncStatus,
    deleteMetadataForResync,
    getConfiguredPageSize,
    getMetadataVersionRecord,
    persistCurrentSyncState,
    pullStageHierarchyConfig,
    pullUiConfig,
    queryMetadata,
    resetMetadataForRecovery,
    saveMetadataToSqlite,
} from "./sync-metadata-actors";
import {
    DataPullMode,
    DataPushMode,
    extractServerDate,
    MetadataSyncMode,
    resolveNextDataPull,
    shouldContinueDataPull,
    shouldRecordDataPush,
    shouldUseLastDataPull,
    shouldUseLastUpdatedFilter,
} from "./sync-metadata-mode";
import { processBatchSync as processBatchSyncImpl } from "./sync-tracker-actors";

/**
 * Which attribute/data-element ids belong to this program (and, for data
 * elements, which program stage) — used to drop stale local fields that
 * are no longer part of the program before push.
 *
 * Deliberately doesn't also derive optionSet validity here: the program's
 * own `programStageDataElements[].dataElement` / `programTrackedEntityAttributes[].trackedEntityAttribute`
 * references are id-only stubs (the metadata pull only fetches
 * `dataElement[id]` for them — see the `fields:` selector below), so they
 * never carry a real `optionSetValue`/`optionSet`. `transformEvent` /
 * `transformTrackedEntity` / `transformEnrollment` look that up directly
 * from the full metadata maps (`context.metadata.dataElements` /
 * `.trackedEntityAttributes` / `.optionSets`) instead.
 */
export function deriveValidIds(program: Program | undefined): {
    validAttributeIds: Set<string>;
    validDataElementsByStage: Map<string, Set<string>>;
} {
    if (!program) {
        return {
            validAttributeIds: new Set(),
            validDataElementsByStage: new Map(),
        };
    }
    return {
        validAttributeIds: new Set(
            program.programTrackedEntityAttributes.map(
                (ptea) => ptea.trackedEntityAttribute.id,
            ),
        ),
        validDataElementsByStage: new Map(
            program.programStages.map((stage) => [
                stage.id,
                new Set(
                    stage.programStageDataElements.map(
                        (psde) => psde.dataElement.id,
                    ),
                ),
            ]),
        ),
    };
}

/**
 * Only the periodic push/delete-sync actors can discover a degraded/offline
 * server — a batch with nothing pending never checks reachability, so its
 * output has no opinion on connectivityStatus and the prior value should
 * carry forward rather than being reset to "healthy" by default.
 */
function nextConnectivityStatus(
    context: SyncContext,
    event: { output: { connectivityStatus?: ConnectivityStatus } },
): ConnectivityStatus {
    return event.output.connectivityStatus ?? context.connectivityStatus;
}

export interface SyncContext {
    error: Error | null;
    info: string | undefined;
    engine: Engine;
    backend: StorageBackend;
    metadataStore: MetadataStore;
    // Only present on the SQLite backend — a handful of actors still need
    // raw driver access where no Dexie equivalent applies generically
    // (pullData's local-row lookups, the tracker push actors' SQL
    // row-adapters). Kept narrow and threaded explicitly, not a general
    // escape hatch back to SqlDriver-everywhere.
    sqlDriver: SqlDriver | undefined;
    lastDataPull: string | undefined;
    lastDataPush: string | undefined;
    lastMetadataPull: string | undefined;
    metadataSyncMode: MetadataSyncMode;
    dataPullMode: DataPullMode;
    dataPushMode: DataPushMode;
    resources: Resource[];
    validAttributeIds: Set<string>;
    validDataElementsByStage: Map<string, Set<string>>;
    message: MessageInstance;
    metadata: Partial<QueryMetadataInfoResult>;
    userInfo: MeUser;
    rawMetadata: Metadata;
    uiConfig: UIConfig;
    stageHierarchyConfig: StageHierarchyConfig;
    period?: string;
    dataSet?: string;
    orgUnit?: string;
    aggregateData?: Map<string, string>;
    periodType?: string;
    connectivityStatus: ConnectivityStatus;
}

type SyncEvent =
    | {
          type: "PUSH_DATA";
      }
    | { type: "RETRY" }
    | { type: "START_METADATA_SYNC" }
    | { type: "START_DATA_SYNC" }
    | { type: "FULL_METADATA_SYNC" }
    | { type: "FULL_DATA_SYNC" }
    | {
          type: "EVALUATE_INDICATORS";
          event: FlattenedEvent;
          trackedEntity: FlattenedTrackedEntity;
      }
    | { type: "FULL_INDICATOR_SYNC" }
    | { type: "CANCEL" }
    | { type: "NETWORK_RECONNECT" }
    | { type: "SET_CONNECTIVITY_STATUS"; status: ConnectivityStatus }
    | { type: "PARENT_READY" }
    | { type: "SET_PERIOD"; period?: string }
    | { type: "SET_DATASET"; dataSet?: string; periodType?: string }
    | { type: "SET_ORG_UNIT"; orgUnit?: string }
    | {
          type: "FETCH_AGGREGATE_DATA";
          orgUnit: string;
          period: string;
          dataSet?: string;
          periodType?: string;
      }
    | { type: "PARENT_NOT_READY" };
const syncMachine = setup({
    types: {
        context: {} as SyncContext,
        events: {} as SyncEvent,
        input: {} as {
            engine: Engine;
            backend: StorageBackend;
            metadataStore: MetadataStore;
            sqlDriver: SqlDriver | undefined;
            initialLastMetadataPull?: string;
            initialLastDataPull?: string;
            initialLastDataPush?: string;
            message: MessageInstance;
            userInfo: MeUser;
        },
    },

    actions: {
        markAsSuccessful: () => {},

        notifySuccess: ({ context }) => {
            context.message.success(context.info);
        },
        notifyFailure: ({ context }) => {
            context.message.error(context.error?.message);
        },
        resetLastDataPull: assign({
            lastDataPull: undefined,
        }),

        resetLastMetadataPull: assign({
            lastMetadataPull: undefined,
        }),

        persistSyncState: ({ context }) => {
            void persistCurrentSyncState(context.metadataStore, {
                lastDataPull: context.lastDataPull,
                lastDataPush: context.lastDataPush,
            });
        },
    },
    actors: {
        pullAggregateData: fromPromise<
            AggregateData,
            { dataSet?: string; period?: string; orgUnit?: string }
        >(async ({ input: { period, dataSet, orgUnit } }) => {
            if (
                orgUnit === undefined ||
                period === undefined ||
                dataSet === undefined
            ) {
                throw new Error("OrgUnit,Data set or period not specified");
            }
            const params = new URLSearchParams({
                source: "hmis_dvs",
                period,
                dataset: dataSet,
                orgunit: orgUnit,
            });
            const response = await fetch(
                `https://eregisters.health.go.ug/ereports/query?${params.toString()}`,
                {
                    headers: {
                        "x-api-key": "LnwYPc0EnRKIqjKaQabQWGIN31ranjYt",
                    },
                },
            );
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const data = await response.json();
            return data as AggregateData;
        }),
        checkIndexDB: fromPromise<
            CheckMetadataInfoResult,
            { metadataStore: MetadataStore }
        >(async ({ input: { metadataStore } }) => {
            return checkMetadataSyncStatus(metadataStore);
        }),
        queryIndexDB: fromPromise<
            QueryMetadataInfoResult,
            { metadataStore: MetadataStore; userInfo: MeUser }
        >(async ({ input: { metadataStore, userInfo } }) => {
            return queryMetadata(
                metadataStore,
                userInfo.organisationUnits[0].path,
            );
        }),
        pullData: fromPromise<
            string | undefined,
            {
                program: string;
                orgUnit: string;
                lastDataPull: string | undefined;
                engine: Engine;
                backend: StorageBackend;
                metadataStore: MetadataStore;
                sqlDriver: SqlDriver | undefined;
                dataPullMode: DataPullMode;
            }
        >(
            async ({
                input: {
                    lastDataPull,
                    orgUnit,
                    program,
                    engine,
                    backend,
                    metadataStore,
                    sqlDriver,
                    dataPullMode,
                },
            }) => {
                // Mirror the DHIS2 Android SDK: the incremental `updatedAfter`
                // boundary is the SERVER's clock captured BEFORE the pull
                // starts, never the device clock captured after it. Reading
                // system/info up front (a) avoids client/server clock skew and
                // (b) guarantees that any record edited on the server *during*
                // this (paged, possibly long-running) pull is re-fetched next
                // time instead of being skipped. This value is only persisted
                // once the pull below completes successfully.
                const serverDate = extractServerDate(
                    (await engine.query({
                        info: { resource: "system/info" },
                    })) as { info?: { serverDate?: string } },
                );

                let currentPage = 1;
                // Fetch fresh from the DHIS2 dataStore (not the local mirror
                // or machine context) so a pageSize change made from any
                // device takes effect on the very next pull. Fall back to
                // the local mirror, then the hardcoded default, when the
                // dataStore is unreachable (offline pull).
                const configuredPageSize = await getConfiguredPageSize(
                    metadataStore,
                    engine,
                );
                const pageSize =
                    configuredPageSize ?? DEFAULT_DATA_PULL_PAGE_SIZE;
                let hasMoreData = true;

                console.log(
                    "Starting data pull for program:",
                    program,
                    "orgUnit:",
                    orgUnit,
                    "lastDataPull:",
                    lastDataPull,
                    "dataPullMode:",
                    dataPullMode,
                );

                while (hasMoreData) {
                    let params: Record<string, any> = {
                        program,
                        orgUnits: orgUnit,
                        ouMode: "SELECTED",
                        fields: "trackedEntity,createdAt,updatedAt,createdAtClient,updatedAtClient,orgUnit,trackedEntityType,inactive,deleted,potentialDuplicate,createdBy[uid,username,firstName,surname],updatedBy[uid,username,firstName,surname],attributes[attribute,value,createdAt,updatedAt],enrollments[enrollment,createdAt,updatedAt,createdAtClient,updatedAtClient,orgUnit,program,enrolledAt,occurredAt,completedAt,followUp,status,trackedEntity,geometry,attributeOptionCombo,deleted,createdBy[uid,username,firstName,surname],updatedBy[uid,username,firstName,surname],attributes[attribute,value,createdAt,updatedAt],events[event,enrollment,createdAt,updatedAt,createdAtClient,updatedAtClient,status,geometry,program,programStage,orgUnit,trackedEntity,occurredAt,completedAt,scheduledAt,attributeOptionCombo,assignedUser,completedBy,followUp,deleted,createdBy[uid,username,firstName,surname],updatedBy[uid,username,firstName,surname],dataValues[dataElement,createdBy,value,createdAt,updatedAt,providedElsewhere]]]",
                        page: currentPage,
                        pageSize: pageSize,
                    };
                    if (shouldUseLastDataPull(dataPullMode, lastDataPull)) {
                        params = { ...params, updatedAfter: lastDataPull };
                    }

                    const response = (await engine.query({
                        trackedEntities: {
                            resource: "tracker/trackedEntities",
                            params,
                        },
                    })) as {
                        trackedEntities: {
                            pager?: {
                                page?: number;
                                pageSize?: number;
                                pageCount?: number;
                                nextPage?: string;
                                total?: number;
                            };
                            trackedEntities: TrackedEntity[];
                        };
                    };
                    const { trackedEntities: instances } =
                        response.trackedEntities;
                    const pager = response.trackedEntities.pager;

                    // Flatten, merge (local-wins-per-key against the
                    // already-stored row), and write this page — see
                    // pull-page.ts's own doc comment for why the merge
                    // logic and write order live there, standalone-tested.
                    const collections = {
                        trackedEntities: getTrackedEntitiesCollection(),
                        enrollments: getEnrollmentsCollection(),
                        events: getEventsCollection(),
                    };
                    await writePulledTrackedEntityPage(
                        instances,
                        collections,
                        backend === "sqlite"
                            ? sqlLocalLookups(sqlDriver!)
                            : dexieLocalLookups(collections as any),
                    );

                    hasMoreData = shouldContinueDataPull({
                        receivedCount: instances.length,
                        pageSize,
                        pager,
                    });
                    currentPage++;
                }

                // The pull succeeded: advance the boundary to the server time
                // captured before it started. If system/info gave us nothing,
                // keep the previous boundary rather than the device clock.
                return resolveNextDataPull(serverDate, lastDataPull);
            },
        ),
        saveMetadata: fromPromise<
            void,
            { metadataStore: MetadataStore; metadata: Metadata }
        >(async ({ input: { metadataStore, metadata } }) => {
            await saveMetadataToSqlite(metadataStore, metadata);
        }),
        pullUIConfig: fromPromise<
            UIConfig,
            { metadataStore: MetadataStore; engine: Engine }
        >(async ({ input: { metadataStore, engine } }) => {
            return pullUiConfig(metadataStore, engine);
        }),
        pullStageHierarchy: fromPromise<
            StageHierarchyConfig,
            { metadataStore: MetadataStore; engine: Engine }
        >(async ({ input: { metadataStore, engine } }) => {
            return pullStageHierarchyConfig(metadataStore, engine);
        }),
        pullResource: fromPromise<
            Metadata,
            {
                resources: Resource[];
                engine: Engine;
                metadataStore: MetadataStore;
                lastMetadataPull: string | undefined;
                metadataSyncMode: MetadataSyncMode;
                userOrgUnit: string;
            }
        >(async ({ input }) => {
            const {
                resources,
                engine,
                metadataStore,
                lastMetadataPull,
                metadataSyncMode,
                userOrgUnit,
            } = input;

            // Mirror pullData's lastDataPull boundary: capture the SERVER's
            // clock once, before any resource is pulled, rather than the
            // device clock per-resource — avoids client/server clock skew
            // and guarantees a resource updated on the server *during* this
            // (possibly long-running) sync is re-fetched next time instead
            // of being skipped.
            const serverDate = extractServerDate(
                (await engine.query({
                    info: { resource: "system/info" },
                })) as { info?: { serverDate?: string } },
            );

            const results: Metadata = {
                dataElements: [],
                optionGroups: [],
                optionSets: [],
                organisationUnits: [],
                programs: [],
                programIndicators: [],
                programRules: [],
                programRuleVariables: [],
                trackedEntityAttributes: [],
                metadataVersion: [],
                dataSets: [],
                categoryOptionCombos: [],
                succeededResources: new Set<Resource>(),
            };
            for (const resource of resources) {
                try {
                    switch (resource) {
                        case "categoryOptionCombos":
                            const {
                                categoryOptionCombos: { categoryOptionCombos },
                            } = (await engine.query({
                                categoryOptionCombos: {
                                    resource: `categoryCombos/UjXPudXlraY/categoryOptionCombos.json`,
                                    params: {
                                        fields: "id,name,access,categoryOptions[id,name,access]",
                                    },
                                },
                            })) as {
                                categoryOptionCombos: {
                                    categoryOptionCombos: CategoryOptionCombo[];
                                };
                            };
                            results.categoryOptionCombos = categoryOptionCombos;
                            break;
                        case "organisationUnits":
                            const {
                                organisationUnits: { organisationUnits },
                            } = (await engine.query({
                                organisationUnits: {
                                    resource: `organisationUnits/${userOrgUnit}.json`,
                                    params: {
                                        fields: "id,name,code,path,parent",
                                        paging: false,
                                        includeDescendants: true,
                                    },
                                },
                            })) as {
                                organisationUnits: {
                                    organisationUnits: OU[];
                                };
                            };
                            results.organisationUnits = organisationUnits;
                            break;
                        case "dataSets":
                            const {
                                dataSets: { dataSets },
                            } = (await engine.query({
                                dataSets: {
                                    resource: "dataSets.json",
                                    params: {
                                        fields: "id,name,code,periodType",
                                    },
                                },
                            })) as {
                                dataSets: {
                                    dataSets: DataSet[];
                                };
                            };
                            results.dataSets = dataSets;
                            break;

                        case "programs":
                            const { program } = (await engine.query({
                                program: {
                                    resource: "programs",
                                    id: "ueBhWkWll5v",
                                    params: {
                                        fields: "id,name,programSections[id,name,sortOrder,trackedEntityAttributes[id]],trackedEntityType[id,trackedEntityTypeAttributes[id]],programType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,programStages[id,repeatable,name,code,executionDateLabel,programStageDataElements[id,sortOrder,compulsory,renderOptionsAsRadio,dataElement[id],renderType,allowFutureDate],programStageSections[id,name,sortOrder,dataElements[id]]],programTrackedEntityAttributes[id,mandatory,searchable,renderOptionsAsRadio,renderType,sortOrder,allowFutureDate,displayInList,trackedEntityAttribute[id]]",
                                    },
                                },
                            })) as { program: Program };
                            results.programs = [program];
                            break;

                        case "dataElements":
                            const dataElementsParams: any = {
                                fields: "id,name,code,valueType,formName,optionSetValue,optionSet[id]",
                                paging: false,
                            };

                            if (
                                shouldUseLastUpdatedFilter(
                                    metadataSyncMode,
                                    lastMetadataPull,
                                )
                            ) {
                                dataElementsParams.filter = `lastUpdated:gt:${lastMetadataPull}`;
                            }
                            const {
                                dataElements: { dataElements },
                            } = (await engine.query({
                                dataElements: {
                                    resource: "dataElements",
                                    params: dataElementsParams,
                                },
                            })) as {
                                dataElements: {
                                    dataElements: DataElement[];
                                };
                            };

                            results.dataElements = dataElements;
                            break;
                        case "programIndicators":
                            const programIndicatorsParams: any = {
                                fields: "id,name,filter,program,aggregationType,expression",
                                paging: false,
                            };
                            if (
                                shouldUseLastUpdatedFilter(
                                    metadataSyncMode,
                                    lastMetadataPull,
                                )
                            ) {
                                programIndicatorsParams.filter = `lastUpdated:gt:${lastMetadataPull}`;
                            }
                            const {
                                programIndicators: { programIndicators },
                            } = (await engine.query({
                                programIndicators: {
                                    resource: "programIndicators",
                                    params: programIndicatorsParams,
                                },
                            })) as {
                                programIndicators: {
                                    programIndicators: ProgramIndicator[];
                                };
                            };

                            results.programIndicators = programIndicators;

                            break;

                        case "attributes":
                            const attributesParams: any = {
                                fields: "id,name,code,unique,generated,pattern,confidential,valueType,optionSetValue,displayFormName,formName,optionSet[id]",
                                paging: false,
                            };
                            if (
                                shouldUseLastUpdatedFilter(
                                    metadataSyncMode,
                                    lastMetadataPull,
                                )
                            ) {
                                attributesParams.filter = `lastUpdated:gt:${lastMetadataPull}`;
                            }
                            const {
                                trackedEntityAttributes: {
                                    trackedEntityAttributes,
                                },
                            } = (await engine.query({
                                trackedEntityAttributes: {
                                    resource: "trackedEntityAttributes",
                                    params: attributesParams,
                                },
                            })) as {
                                trackedEntityAttributes: {
                                    trackedEntityAttributes: TrackedEntityAttribute[];
                                };
                            };

                            results.trackedEntityAttributes =
                                trackedEntityAttributes;
                            break;

                        case "programRules":
                            const programRulesFilters = [
                                "program.id:eq:ueBhWkWll5v",
                            ];
                            if (
                                shouldUseLastUpdatedFilter(
                                    metadataSyncMode,
                                    lastMetadataPull,
                                )
                            ) {
                                programRulesFilters.push(
                                    `lastUpdated:gt:${lastMetadataPull}`,
                                );
                            }
                            const {
                                programRules: { programRules },
                            } = (await engine.query({
                                programRules: {
                                    resource: `programRules.json`,
                                    params: {
                                        filter: programRulesFilters,
                                        fields: "*,programRuleActions[*]",
                                        paging: false,
                                    },
                                },
                            })) as {
                                programRules: {
                                    programRules: ProgramRule[];
                                };
                            };

                            results.programRules = programRules;

                            break;

                        case "programRuleVariables":
                            const programRuleVariablesFilters = [
                                "program.id:eq:ueBhWkWll5v",
                            ];
                            if (
                                shouldUseLastUpdatedFilter(
                                    metadataSyncMode,
                                    lastMetadataPull,
                                )
                            ) {
                                programRuleVariablesFilters.push(
                                    `lastUpdated:gt:${lastMetadataPull}`,
                                );
                            }
                            const {
                                programRuleVariables: { programRuleVariables },
                            } = (await engine.query({
                                programRuleVariables: {
                                    resource: `programRuleVariables.json`,
                                    params: {
                                        filter: programRuleVariablesFilters,
                                        fields: "*",
                                        paging: false,
                                    },
                                },
                            })) as {
                                programRuleVariables: {
                                    programRuleVariables: ProgramRuleVariable[];
                                };
                            };

                            results.programRuleVariables = programRuleVariables;
                            break;

                        case "optionSets":
                            const optionSetsParams: any = {
                                fields: "id,name,options[id,name,code,sortOrder]",
                                paging: false,
                            };
                            if (
                                shouldUseLastUpdatedFilter(
                                    metadataSyncMode,
                                    lastMetadataPull,
                                )
                            ) {
                                optionSetsParams.filter = `lastUpdated:gt:${lastMetadataPull}`;
                            }
                            const { optionSets } = (await engine.query({
                                optionSets: {
                                    resource: "optionSets",
                                    params: optionSetsParams,
                                },
                            })) as {
                                optionSets: {
                                    optionSets: {
                                        id: string;
                                        name: string;
                                        options: {
                                            id: string;
                                            name: string;
                                            code: string;
                                            sortOrder: number;
                                        }[];
                                    }[];
                                };
                            };

                            const flattenedOptionSets =
                                optionSets.optionSets.flatMap((os) =>
                                    os.options.map((o) => ({
                                        ...o,
                                        optionSet: os.id,
                                        optionSetName: os.name,
                                    })),
                                );
                            results.optionSets = flattenedOptionSets;
                            break;

                        case "optionGroups":
                            const optionGroupsParams: any = {
                                fields: "id,options[id,name,code,sortOrder]",
                                paging: false,
                            };
                            if (
                                shouldUseLastUpdatedFilter(
                                    metadataSyncMode,
                                    lastMetadataPull,
                                )
                            ) {
                                optionGroupsParams.filter = `lastUpdated:gt:${lastMetadataPull}`;
                            }
                            const { optionGroups } = (await engine.query({
                                optionGroups: {
                                    resource: "optionGroups",
                                    params: optionGroupsParams,
                                },
                            })) as {
                                optionGroups: {
                                    optionGroups: Array<{
                                        id: string;
                                        options: {
                                            id: string;
                                            name: string;
                                            code: string;
                                            sortOrder: number;
                                        }[];
                                    }>;
                                };
                            };

                            const flattenedOptionGroups =
                                optionGroups.optionGroups.flatMap((og) =>
                                    og.options.map((o) => ({
                                        ...o,
                                        optionGroup: og.id,
                                    })),
                                );
                            results.optionGroups = flattenedOptionGroups;
                            break;
                    }
                    // Prefer the server clock captured above; fall back to
                    // the previous boundary (don't advance with an
                    // untrusted timestamp — same rule as resolveNextDataPull)
                    // and only to the device clock as a last resort, since
                    // MetadataVersion.lastSync requires a string.
                    const currentTimestamp =
                        serverDate ??
                        lastMetadataPull ??
                        new Date().toISOString();
                    let version =
                        await getMetadataVersionRecord(metadataStore);
                    if (version === undefined) {
                        version = {
                            id: "metadata-version",
                            lastSync: currentTimestamp,
                            versions: {},
                        };
                    }
                    version.versions[resource] = currentTimestamp;
                    version.lastSync = currentTimestamp;
                    results.metadataVersion = [version];
                    results.succeededResources!.add(resource);
                } catch (error) {
                    console.warn(
                        `[metadata-sync] Skipping ${resource}:`,
                        error,
                    );
                    continue;
                }
            }
            return results;
        }),
        deleteAllMetadata: fromPromise<
            void,
            { metadataStore: MetadataStore; metadata: Metadata }
        >(async ({ input: { metadataStore, metadata } }) => {
            await deleteMetadataForResync(metadataStore, metadata);
        }),
        resetDatabase: fromPromise<void, { metadataStore: MetadataStore }>(
            async ({ input: { metadataStore } }) => {
                await resetMetadataForRecovery(metadataStore);
            },
        ),
        deleteAllData: fromPromise<void>(async () => {}),
        processBatchSync: fromPromise(
            async ({
                input,
            }: {
                input: {
                    engine: Engine;
                    backend: StorageBackend;
                    sqlDriver: SqlDriver | undefined;
                    validAttributeIds: Set<string>;
                    validDataElementsByStage: Map<string, Set<string>>;
                    dataElements: Map<string, DataElement> | undefined;
                    trackedEntityAttributes:
                        | Map<string, TrackedEntityAttribute>
                        | undefined;
                    optionSets: Map<string, FlattenedOptionSet[]> | undefined;
                };
            }) => {
                return processBatchSyncImpl(input);
            },
        ),
    },
    delays: {
        // dataSyncInterval: () => 1000 * 60 * 30 + Math.random() * 1000 * 60 * 5,
        dataSyncInterval: () => {
            const min = 30 * 60 * 1000;
            const max = 60 * 60 * 1000;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        dataPullInterval: () => {
            const min = 1 * 60 * 60 * 1000;
            const max = 3 * 60 * 60 * 1000;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    },
    guards: {
        hasValidParams: ({ context: { dataSet, period, orgUnit } }) =>
            !isEmpty(dataSet) && !isEmpty(period) && !isEmpty(orgUnit),
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5SwJ4DsDGA6AtmALgIYSFEDK62AlhADZgDEEA9mmFlWgG7MDW7qTLgLFShCkJr0EnHhlJVWAbQAMAXVVrEoAA7NYVfIrTaQAD0QBmAEwBGLCoAsANgAcrlbduXbAVl+WjgA0ICiItiq+jg6WAJwqAOy2Cc6+7gC+6SGC2HhEJOSUHHSMLGwc3HwCRXmihZIlMpXyRsrqSrZaSCB6Bq0m3RYI1q6WWAmxqd7x1nYJrsGh4bau1uNuNrbxo76Z2TUiBeJFUoxgAE7nzOdYOrSkAGbXOFg5wvliEtSNsswtxppNKZeoZjKYhpsHC53J5vH4AoswghRq4sL55t44o50a5bHsQG9akcvsV6AwyAAVACCACUKQB9ACyAFFqQARKnU+lkACaADkAMJA7og-rgxAJMZRXxeFQqWKWZzWRzykJI2wq6LeVKOWIRWzOTz4wmHT4nEoMABiAFUADK2pmsqkcrm8wXC3T6UGscUISwJLDWVIqDwTZwJXWqpYIPwTcZ2Gx6lRK2LWY0HD71bCwQhcThQRmmohMVjsX78V4ZurHIQ5vNoAtFwhNOQKNoadTAr1iwbhVzOLUq5ypGWWVyxSZq8KOLZYVPjw16xz99NCIlmoQARwArhcUPmAJJoCBgMxsgBCJfK5eqa6bJJ3e8Px9PF5bfzbaEBnZF3bBvZjftB2TEdvHHSdo2SawxiSVwEgSaxYQWFZV1ye8ikfc59wbI8TzPS8LiuG47keZ5KzvTMa2wTDsKgXDX3Pd9-nbD0ej-H0ANmBJfDnZNrAnBUokcCMpxjGcA0cEZJnlDUVyyAkq2JIoT3oIwG0LSirzLSoKxNSiSRUgh8w06smM-b8uk9Pp-1AIYNRGLANWTfwXFiXFHERadLB4zxZliFx7N8FRLFQ95qwMsBVOMpsGEI65bnufAnnOF49PC5TIqM9SmzM-oLK7ayONs6cHKckdXPczzAPHKE3DcqZhLxeS0qU2tKHzLSKh4XTFI3bN2obXKAXaH8rO9AZioQeJYkDXFuPReZfGVBJRLhVFEI8nxJjmSZQvXLNyIwDqym07rbzQ-SihyfMhpYzoCvG313HsJx3GxJUuOE1aZRmraEIWBJImTELmt6g7robWLLnikikrIlq+sOm7fmYr8RsstjCom8xEFWX7HH9cNdQQiMVsgxCeIjYT0RnKIvDTUGKPSoQAHdCFBSHKVpBkWXZTkqW5fkhVGzHHoAgcVHGXFlSW5dlwHVaB2iRqQw8ILrHRXZGYu5nsDZjmoCtO0HV551+cF90RdFGycb9Pw5zSHxcU8Anh0VjysEajaB0CRw9vQ1n2bUw2zFgIh8HYQgHgj84AApDTlFQAEoGARg79eD1jraK23IScNwPC8Hx-ECVaCeiby-A8SwVGg8dQta74yTdAV6WZPkKQPTvmTILP2OxoZEMloLE4NHwh6W0SNcBrA4KCmvnECGW-e1rBG9JRgAAVrTIAAJekXSpPusd9Ie0UTzxF9sCfrCnhesH9dX4lp+CV-2IR19OBhQ-DyPo4uWONdE4pzeJ-Eox8xaTTPiPOUY9r5ykntGWYaRZ7cVrtLSYLgG6IwgFQc4YAMD4C+AwCBPZJrDmcLPfOAkAjcVcL4Ke6I1iP2CsmEm8Etbv2wOvbcdxmDEHzGyPBBD8CdRvIdNeiNeG0H4bghsQj8GENumjDsGNs4D2WIkRyctDQRH8kGMmSJlR2HPkGSwlcogTmwQdaRsjBHCMIVDIiCVSIpQkTwvhAj5EOPwMo-Kv4T7i38p7R+cJF6+FiOiKeKoeJpAicOZc1gOEgy4ZIg6AAjUgGAAAWxCTpdSqO4xGmT8A5K+H49GD0yG2woVQ1yE5aFxKnkGewLCRjX0wc4axVEsAlLKZQJxMNErJVSspYpWTcmUAqaoqpNtB5ynPqPK+N8p4Gh4vxZw8QIiBEiE1VJHiChgFtIQMObIxCb23LAbJJCrb919PAmadg4LcWgvZWIU9861XiJEeYIZfBdNXkcC5tBaAb3JNSOkB9zYt1IXM8IqY5yphWLEQG44FhBm+i9C+iF+KKhed04FoKv42ntFC10QtYU5zsgiicTyUUhjcpJZw0SxgfTiBMOw6sIwEu3CCsFP9SB-xjvHC+ICxlEEJRvSlGiYw0qReOVFjKMVIOCdfaCbkky6lGDyvlDxeW0BpGAB4+CrliJ0udNJhBJV6pBYa41cBsnTOlb6JU0RgrxAjIqccQUGHRi2oGGBgRvJhhSQpD+5z9VYBtQao1JrrlxWIsM+G4qrWRujXauNTrbmBPIcqGIHrXbesiFPJI4wYEazrqkUNoCI18ohobfJ4ia0SsjfWrNai7kAQiEGB+Mo0hJPgp4fsoklqomHBqReE4fCpABfs2toL62DMTa40Z4aW11oGlAdtsyqXhFrpQixqx4KAxWMy6My57AGgnTXaWgRZ1hu4fOrAvDDnHNOfOm5Hac22z0WsGcKoFjCU1L6pEw4eI2FxMXRCY43A6tBRnDqXNIWHwtsLL9kCf1yrpYq9FZ6kRRDGIkSD8o4LeVg4Cp9CHIYkodChmF2aMPUrWLS5FOGmWiUCPYNlE5VjGIVHBrAVGQ5h0FVgKOwqE5yjFWu1NfKhPOq7Vh1jDLcOiV1LEjEQDuKSU1pkeSaBmAnngN0HIO6ZUAFoUGSl1FsaDGsZKiXM3mi+tmBJjn7NWsGVEzO+nMxEcYgQ9SpmCvZvUoluIvU01iHEeyH1hTAfQHzAEEKrRrr9a+Mplz0OSf7S6tZczRUoklyaBphKOXs95bE-FoJVWmDxSSC5a4IRHLl3WWAaLPjwheYrtsKaogCEmSUOpatxGY1JQ0SSgwl1a+vQywcTJHB63ZU9jk57LTcHXQxJVogpD8gTMc3aZuI3rUtxAM4xiKm8v6DVF6FaQUkjtpUyRX42f8kd9OQd8ynYQIvAMgN1PevcGkPD4QUhSjxv8lE813s9IeOzWg258HfeWjNaEHgmX+A1GXa+Dh5jSWPQ1t+cXG7I9q5E-r9S0gzkmMkbpJJTjfZS0gyIqICYorSMFf50E6fKR8V8b7BMeL0KiHQyMkpXCMLK3PVhrD0SeZkySWxXioAKJEd99wqJxzJh02slU7ykGSUlk4A0kTJgymnjzoQfTJmYAFyYtBcphwISCqmKqsxFSoK5cuKmsXm09JfYKt9+Azktqud97wtcQkvM2Sid6zSe1tKSAify96-eEtJ6JRensBKhkTs4LwRO0+RoZwExjiBgm6ieaGeCowRIG61O7lFSKvcCfTbGh1AuvAOCI1sGcIWaYceCmiOIzkfqKh9gJk7pfqlDEA45TwOJFwRGHeemqeoJ38QWPEOIAmA8RyDyH2TtBw8rB4ovEYipZgDiVJnrRMWgHDg877lNkqhOM9vtGKIax-oR419iJIre8OiOYAJ+9CWA5+owH01+H+SIwkzGBeSozy-YkwCQem6QQAA */
    id: "sync",
    type: "parallel",
    on: {
        SET_CONNECTIVITY_STATUS: {
            actions: assign({
                connectivityStatus: ({ event }) => event.status,
            }),
        },
    },
    context: ({
        input: { engine, backend, metadataStore, sqlDriver, message, userInfo },
    }) => {
        return {
            engine,
            backend,
            metadataStore,
            sqlDriver,
            error: null,
            connectivityStatus: "healthy",
            resources: [
                "programs",
                "programStages",
                "dataElements",
                "optionSets",
                "optionGroups",
                "attributes",
                "programRuleVariables",
                "categoryOptionCombos",
                "programRules",
                "dataSets",
                "organisationUnits",
            ] as Resource[],

            lastDataPull: undefined,
            lastDataPush: undefined,
            lastMetadataPull: undefined,
            metadataSyncMode: "full",
            dataPullMode: "incremental",
            dataPushMode: "batch",
            validAttributeIds: new Set<string>(),
            validDataElementsByStage: new Map<string, Set<string>>(),
            message,
            info: undefined,
            metadata: {},
            userInfo,
            uiConfig: emptyUIConfig,
            stageHierarchyConfig: emptyStageHierarchyConfig,
            rawMetadata: {
                dataElements: [],
                optionGroups: [],
                optionSets: [],
                organisationUnits: [],
                programs: [],
                programIndicators: [],
                programRules: [],
                programRuleVariables: [],
                trackedEntityAttributes: [],
                metadataVersion: [],
                dataSets: [],
                categoryOptionCombos: [],
            },
        };
    },
    states: {
        aggregateData: {
            initial: "idle",
            states: {
                idle: {
                    on: {
                        SET_PERIOD: {
                            actions: assign(({ event }) => {
                                return {
                                    period: event.period,
                                };
                            }),
                            target: "canPullAggregateData",
                        },
                        SET_DATASET: {
                            actions: assign(({ event }) => {
                                return {
                                    dataSet: event.dataSet,
                                    periodType: event.periodType,
                                };
                            }),
                            target: "canPullAggregateData",
                        },
                        SET_ORG_UNIT: {
                            actions: assign({
                                orgUnit: ({ event }) => event.orgUnit,
                            }),
                            target: "canPullAggregateData",
                        },
                    },
                },
                canPullAggregateData: {
                    always: [
                        {
                            target: "pullAggregateData",
                            guard: "hasValidParams",
                        },
                        {
                            target: "idle",
                            guard: not("hasValidParams"),
                        },
                    ],
                },
                pullAggregateData: {
                    invoke: {
                        src: "pullAggregateData",
                        input: ({ context: { dataSet, period, orgUnit } }) => {
                            return {
                                dataSet,
                                period,
                                orgUnit,
                            };
                        },
                        onDone: {
                            actions: assign(({ event }) => {
                                return {
                                    aggregateData: new Map(
                                        event.output.dataValues.map(
                                            ({
                                                dataElement,
                                                attributeOptionCombo,
                                                categoryOptionCombo,
                                                value,
                                            }) => [
                                                `${dataElement}_${categoryOptionCombo}_${attributeOptionCombo}`,
                                                value,
                                            ],
                                        ),
                                    ),
                                };
                            }),
                            target: "idle",
                        },
                        onError: {
                            actions: ({ event }) => {},
                            target: "idle",
                        },
                    },
                },
            },
        },
        metadataSync: {
            initial: "idle",
            id: "metadataSync",
            states: {
                idle: {
                    invoke: {
                        src: "checkIndexDB",
                        input: ({ context: { metadataStore } }) => ({
                            metadataStore,
                        }),
                        onDone: [
                            {
                                target: "queryingIndexDB",
                                guard: ({ event }) => {
                                    return !event.output.needsSyncing;
                                },
                                actions: assign(({ event }) => {
                                    const syncState = event.output.syncState as
                                        | {
                                              lastPullAt?: string;
                                              lastPushAt?: string;
                                          }
                                        | undefined;
                                    return {
                                        lastMetadataPull:
                                            event.output.metadataVersion
                                                ?.lastSync,
                                        lastDataPull: syncState?.lastPullAt,
                                        lastDataPush: syncState?.lastPushAt,
                                        ...deriveValidIds(event.output.program),
                                    };
                                }),
                            },
                            {
                                target: "syncing",
                                guard: ({ event }) => {
                                    return event.output.needsSyncing;
                                },

                                actions: assign(({ event }) => {
                                    const mode =
                                        event.output.hasEmptyTables ||
                                        event.output.wasDatabaseDeleted
                                            ? "full"
                                            : "incremental";
                                    return {
                                        metadataSyncMode: mode,
                                        lastMetadataPull:
                                            event.output.metadataVersion
                                                ?.lastSync,
                                        ...deriveValidIds(event.output.program),
                                    };
                                }),
                            },
                        ],

                        onError: {
                            target: "failure",
                            actions: ({ event }) => {},
                        },
                    },
                    on: {
                        START_METADATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                metadataSyncMode: () => "incremental",
                            }),
                        },
                        FULL_METADATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                metadataSyncMode: () => "full",
                            }),
                        },
                    },
                },
                savingMetadata: {
                    invoke: {
                        src: "saveMetadata",
                        input: ({ context: { metadataStore, rawMetadata } }) => {
                            return { metadataStore, metadata: rawMetadata };
                        },
                        onDone: {
                            target: "pullingUIConfig",
                        },
                        onError: {
                            target: "resetIndexDB",
                        },
                    },
                },
                resetIndexDB: {
                    invoke: {
                        src: "resetDatabase",
                        input: ({ context: { metadataStore } }) => ({
                            metadataStore,
                        }),
                        onDone: {
                            target: "idle",
                        },
                    },
                },
                pullingUIConfig: {
                    invoke: {
                        src: "pullUIConfig",
                        input: ({ context: { metadataStore, engine } }) => ({
                            metadataStore,
                            engine,
                        }),
                        onDone: {
                            target: "pullingStageHierarchy",
                            actions: assign(({ event }) => ({
                                uiConfig: event.output,
                            })),
                        },
                        onError: "pullingStageHierarchy",
                    },
                },
                pullingStageHierarchy: {
                    invoke: {
                        src: "pullStageHierarchy",
                        input: ({ context: { metadataStore, engine } }) => ({
                            metadataStore,
                            engine,
                        }),
                        onDone: {
                            target: "queryingIndexDB",
                            actions: assign(({ event }) => ({
                                stageHierarchyConfig: event.output,
                            })),
                        },
                        onError: "queryingIndexDB",
                    },
                },
                queryingIndexDB: {
                    invoke: {
                        src: "queryIndexDB",
                        input: ({ context }) => ({
                            metadataStore: context.metadataStore,
                            userInfo: context.userInfo,
                        }),
                        onDone: {
                            target: "waiting",
                            actions: assign(({ event }) => {
                                return {
                                    metadata: event.output,
                                    ...deriveValidIds(event.output.program),
                                };
                            }),
                        },
                        onError: {
                            target: "failure",
                            actions: ({ event }) => {},
                        },
                    },
                },
                deletingMetadata: {
                    invoke: {
                        src: "deleteAllMetadata",
                        input: ({ context: { metadataStore, rawMetadata } }) => ({
                            metadataStore,
                            metadata: rawMetadata,
                        }),
                        onDone: "savingMetadata",
                        onError: "failure",
                    },
                },

                syncing: {
                    invoke: {
                        src: "pullResource",
                        input: ({
                            context: {
                                engine,
                                metadataStore,
                                resources,
                                lastMetadataPull,
                                metadataSyncMode,
                                userInfo,
                            },
                        }) => {
                            return {
                                resources,
                                engine,
                                metadataStore,
                                lastMetadataPull,
                                metadataSyncMode,
                                userOrgUnit: userInfo.organisationUnits[0].id,
                            };
                        },

                        onDone: [
                            {
                                guard: ({ context: { metadataSyncMode } }) => {
                                    return metadataSyncMode === "incremental";
                                },

                                actions: assign(({ event }) => ({
                                    lastMetadataPull:
                                        event.output.metadataVersion[0]
                                            .lastSync,
                                    rawMetadata: event.output,
                                })),
                                target: "savingMetadata",
                            },
                            {
                                guard: ({ context: { metadataSyncMode } }) => {
                                    return metadataSyncMode === "full";
                                },

                                actions: assign(({ event }) => ({
                                    lastMetadataPull:
                                        event.output.metadataVersion[0]
                                            .lastSync,
                                    rawMetadata: event.output,
                                })),
                                target: "deletingMetadata",
                            },
                        ],

                        onError: "failure",
                    },
                },
                waiting: {
                    on: {
                        START_METADATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                metadataSyncMode: () => "incremental",
                            }),
                        },

                        FULL_METADATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                metadataSyncMode: () => "full",
                            }),
                        },
                    },
                },

                failure: {},
            },
        },
        dataSync: {
            initial: "idle",
            id: "dataSync",
            states: {
                idle: {
                    on: {
                        PUSH_DATA: {
                            target: "batchSync",
                            actions: assign({
                                dataPushMode: () => "batch",
                            }),
                        },
                        NETWORK_RECONNECT: {
                            target: "batchSync",
                            actions: assign({
                                dataPushMode: () => "batch",
                            }),
                        },
                    },
                    after: {
                        dataSyncInterval: {
                            target: "batchSync",
                            actions: assign({
                                dataPushMode: () => "batch",
                            }),
                        },
                    },
                },

                batchSync: {
                    invoke: {
                        src: "processBatchSync",
                        input: ({ context }) => ({
                            engine: context.engine,
                            backend: context.backend,
                            sqlDriver: context.sqlDriver,
                            validAttributeIds: context.validAttributeIds,
                            validDataElementsByStage:
                                context.validDataElementsByStage,
                            dataElements: context.metadata.dataElements,
                            trackedEntityAttributes:
                                context.metadata.trackedEntityAttributes,
                            optionSets: context.metadata.optionSets,
                        }),
                        onDone: [
                            {
                                guard: ({ event }) =>
                                    shouldRecordDataPush(event.output),
                                target: "updateLastDataPush",
                                actions: assign({
                                    connectivityStatus: ({ context, event }) =>
                                        nextConnectivityStatus(context, event),
                                }),
                            },
                            {
                                target: "idle",
                                actions: assign({
                                    connectivityStatus: ({ context, event }) =>
                                        nextConnectivityStatus(context, event),
                                }),
                            },
                        ],
                        onError: {
                            target: "idle",
                            actions: ({ event }) => {
                                console.error("Batch sync error:", event.error);
                            },
                        },
                    },
                },

                updateLastDataPush: {
                    entry: [
                        assign({
                            lastDataPush: () => new Date().toISOString(),
                        }),
                        "persistSyncState",
                    ],
                    always: "idle",
                },
            },
        },
        dataPull: {
            initial: "idle",
            id: "dataPull",
            states: {
                idle: {
                    after: {
                        dataPullInterval: "syncing",
                    },
                    on: {
                        START_DATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },

                        FULL_DATA_SYNC: {
                            target: "fullRefresh",
                            actions: assign({
                                dataPullMode: () => "full",
                            }),
                        },

                        NETWORK_RECONNECT: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                    },
                },
                fullRefresh: {
                    invoke: {
                        src: "deleteAllData",
                        onDone: {
                            target: "syncing",
                        },
                        onError: "failure",
                    },
                },

                syncing: {
                    invoke: {
                        src: "pullData",
                        input: ({
                            context: {
                                engine,
                                backend,
                                metadataStore,
                                sqlDriver,
                                lastDataPull,
                                userInfo,
                                dataPullMode,
                            },
                        }) => ({
                            engine,
                            backend,
                            metadataStore,
                            sqlDriver,
                            lastDataPull,
                            orgUnit: userInfo.organisationUnits[0].id,
                            program: "ueBhWkWll5v",
                            dataPullMode,
                        }),

                        onDone: {
                            target: "updateLastDataPull",
                            // Persist the server-clock boundary returned by
                            // `pullData` (captured before the pull) — not the
                            // device clock. See the Android SDK parity note in
                            // the actor above.
                            actions: assign({
                                lastDataPull: ({ event }) => event.output,
                                dataPullMode: () => "incremental",
                            }),
                        },

                        onError: "failure",
                    },
                },
                updateLastDataPull: {
                    entry: ["persistSyncState"],
                    always: "waiting",
                },

                waiting: {
                    after: {
                        dataPullInterval: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                    },
                    on: {
                        START_DATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                        FULL_DATA_SYNC: {
                            target: "fullRefresh",
                            actions: assign({
                                dataPullMode: () => "full",
                            }),
                        },
                        NETWORK_RECONNECT: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                    },
                },
                failure: {},
            },
        },
    },
});

export const SyncContext = createActorContext(syncMachine);
