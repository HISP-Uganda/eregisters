import { assign, fromPromise, not, setup } from "xstate";
import {
    AggregateData,
    CategoryOptionCombo,
    DataElement,
    DataSet,
    Dhis2Report,
    emptyUIConfig,
    Enrollment,
    Event,
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    Metadata,
    MeUser,
    OU,
    Program,
    ProgramIndicator,
    ProgramRule,
    ProgramRuleVariable,
    Resource,
    TrackedEntity,
    TrackedEntityAttribute,
    UIConfig,
} from "../schemas";

import type { useDataEngine } from "@dhis2/app-runtime";
import { createActorContext } from "@xstate/react";
import { MessageInstance } from "antd/es/message/interface";
import { Table } from "dexie";
import { isEmpty } from "lodash";
import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";
import { db } from "../db";
import {
    mergeBulkEnrollments,
    mergeBulkEvents,
    mergeBulkTrackedEntities,
} from "../db/merge-utils";
import {
    transformEnrollment,
    transformEvent,
    transformTrackedEntity,
} from "../db/transformers";
import {
    checkInfo,
    flattenEnrollment,
    flattenEvent,
    flattenTrackedEntity,
    queryInfo,
} from "../utils/utils";
import {
    DataPullMode,
    DataPushMode,
    MetadataSyncMode,
    shouldContinueDataPull,
    shouldRecordDataPush,
    shouldUseLastDataPull,
    shouldUseLastUpdatedFilter,
} from "./sync-metadata-mode";

function deriveValidIds(program: Program | undefined): {
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

async function isDhis2Reachable(engine: ReturnType<typeof useDataEngine>) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return false;
    }

    try {
        await engine.query({
            ping: {
                resource: "me",
                params: {
                    fields: "id",
                },
            },
        });
        return true;
    } catch {
        return false;
    }
}

async function submitTrackerImportAndWaitForReport({
    engine,
    data,
    params,
}: {
    engine: ReturnType<typeof useDataEngine>;
    data: any;
    params: Record<string, any>;
}) {
    const response = (await engine.mutate({
        resource: "tracker",
        type: "create",
        data,
        params: {
            ...params,
            async: false,
        },
    })) as unknown as Dhis2Report;

    return response;
    // const jobId = extractTrackerJobId(response);
    // const startedAt = Date.now();

    // while (Date.now() - startedAt < timeoutMs) {
    //     const jobResponse = (await engine.query({
    //         job: {
    //             resource: `tracker/jobs/${jobId}`,
    //         },
    //     })) as { job: unknown };

    //     if (isTrackerJobComplete(jobResponse.job)) {
    //         const reportResponse = (await engine.query({
    //             report: {
    //                 resource: `tracker/jobs/${jobId}/report`,
    //                 params: {
    //                     reportMode: "FULL",
    //                 },
    //             },
    //         })) as { report: Dhis2Report };
    //         return reportResponse.report;
    //     }

    //     await sleep(pollIntervalMs);
    // }

    // throw new Error(`Timed out waiting for DHIS2 tracker job ${jobId}`);
}

export interface SyncContext {
    error: Error | null;
    info: string | undefined;
    engine: ReturnType<typeof useDataEngine>;
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
    metadata: Partial<Awaited<ReturnType<typeof queryInfo>>>;
    userInfo: MeUser;
    rawMetadata: Metadata;
    uiConfig: UIConfig;
    period?: string;
    dataSet?: string;
    orgUnit?: string;
    aggregateData?: Map<string, string>;
    periodType?: string;
}

const syncReportToLocal = async ({
    entities,
    engine,
    validAttributeIds,
    validDataElementsByStage,
}: {
    entities: Array<
        FlattenedTrackedEntity | FlattenedEnrollment | FlattenedEvent
    >;
    engine: ReturnType<typeof useDataEngine>;
    validAttributeIds: Set<string>;
    validDataElementsByStage: Map<string, Set<string>>;
}) => {
    const reachable = await isDhis2Reachable(engine);
    if (!reachable) {
        return { processed: 0, succeeded: 0, failed: 0 };
    }

    const payload = entities.reduce<{
        trackedEntities: TrackedEntity[];
        enrollments: Enrollment[];
        events: Event[];
    }>(
        (acc, entity) => {
            if ("trackedEntityType" in entity) {
                acc.trackedEntities.push(
                    transformTrackedEntity(entity, validAttributeIds),
                );
            } else if ("enrolledAt" in entity) {
                acc.enrollments.push(
                    transformEnrollment(entity, validAttributeIds),
                );
            } else if ("event" in entity) {
                const stageIds =
                    validDataElementsByStage.get(entity.programStage) ??
                    new Set<string>();
                acc.events.push(transformEvent(entity, stageIds));
            }
            return acc;
        },
        {
            trackedEntities: [],
            enrollments: [],
            events: [],
        },
    );
    const response = await submitTrackerImportAndWaitForReport({
        engine,
        data: payload,
        params: {
            importStrategy: "CREATE_AND_UPDATE",
            atomicMode: "OBJECT",
            skipPatternValidation: "true",
            skipSideEffects: "true",
        },
    });
    const failedResponses = new Map<string, string>();
    for (const err of response.validationReport.errorReports) {
        const line = err.errorCode
            ? `[${err.errorCode}] ${err.message}`
            : err.message;
        const existing = failedResponses.get(err.uid);
        failedResponses.set(err.uid, existing ? `${existing}\n${line}` : line);
    }

    const syncedEvents = new Set(
        response.bundleReport.typeReportMap.EVENT.objectReports.map(
            (a) => a.uid,
        ),
    );
    const syncedEnrollments = new Set(
        response.bundleReport.typeReportMap.ENROLLMENT.objectReports.map(
            (a) => a.uid,
        ),
    );

    const syncedEntities = new Set(
        response.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports.map(
            (a) => a.uid,
        ),
    );

    const updatedEntities: FlattenedTrackedEntity[] = entities.flatMap((a) => {
        if ("trackedEntityType" in a && failedResponses.has(a.trackedEntity)) {
            return {
                ...a,
                syncStatus: "failed",
                lastSynced: new Date().toISOString(),
                syncError: failedResponses.get(a.trackedEntity),
            };
        } else if (
            "trackedEntityType" in a &&
            syncedEntities.has(a.trackedEntity)
        ) {
            return {
                ...a,
                syncStatus: "synced",
                lastSynced: new Date().toISOString(),
                syncError: null,
            };
        }
        return [];
    });

    const updatedEnrolments: FlattenedEnrollment[] = entities.flatMap((a) => {
        if ("enrolledAt" in a && failedResponses.has(a.enrollment)) {
            return {
                ...a,
                syncStatus: "failed",
                lastSynced: new Date().toISOString(),
                syncError: failedResponses.get(a.enrollment),
            };
        } else if ("enrolledAt" in a && syncedEnrollments.has(a.enrollment)) {
            return {
                ...a,
                syncStatus: "synced",
                lastSynced: new Date().toISOString(),
                syncError: null,
            };
        }
        return [];
    });

    const updatedEvents: FlattenedEvent[] = entities.flatMap((a) => {
        if ("event" in a && failedResponses.has(a.event)) {
            return {
                ...a,
                syncStatus: "failed",
                lastSynced: new Date().toISOString(),
                syncError: failedResponses.get(a.event),
            };
        } else if ("event" in a && syncedEvents.has(a.event)) {
            return {
                ...a,
                syncStatus: "synced",
                lastSynced: new Date().toISOString(),
                syncError: null,
            };
        }
        return [];
    });

    await trackedEntitiesCollection.utils.bulkUpdateLocally(updatedEntities);
    await enrollmentsCollection.utils.bulkUpdateLocally(updatedEnrolments);
    await eventsCollection.utils.bulkUpdateLocally(updatedEvents);

    return {
        processed: entities.length,
        succeeded:
            syncedEntities.size + syncedEnrollments.size + syncedEvents.size,
        failed: failedResponses.size,
    };
};

const syncDeleteToLocal = async ({
    deletedEvents,
    deletedTrackedEntities,
    deletedEnrollments,
    engine,
}: {
    deletedEvents: FlattenedEvent[];
    deletedTrackedEntities: FlattenedTrackedEntity[];
    deletedEnrollments: FlattenedEnrollment[];
    engine: ReturnType<typeof useDataEngine>;
}): Promise<{ succeeded: number; failed: number }> => {
    const hasAnything =
        deletedEvents.length > 0 ||
        deletedTrackedEntities.length > 0 ||
        deletedEnrollments.length > 0;
    if (!hasAnything) return { succeeded: 0, failed: 0 };

    const reachable = await isDhis2Reachable(engine);
    if (!reachable) {
        return { succeeded: 0, failed: 0 };
    }

    const deletedTeIds = new Set(
        deletedTrackedEntities.map((te) => te.trackedEntity),
    );

    const payload: Record<string, unknown> = {};
    if (deletedTrackedEntities.length > 0) {
        payload.trackedEntities = deletedTrackedEntities.map((te) => ({
            trackedEntity: te.trackedEntity,
        }));
    }
    if (deletedEnrollments.length > 0) {
        payload.enrollments = deletedEnrollments
            .filter((e) => !deletedTeIds.has(e.trackedEntity))
            .map((e) => ({ enrollment: e.enrollment }));
    }
    if (deletedEvents.length > 0) {
        payload.events = deletedEvents
            .filter((e) => !deletedTeIds.has(e.trackedEntity))
            .map((e) => ({ event: e.event }));
    }

    const response = await submitTrackerImportAndWaitForReport({
        engine,
        data: payload,
        params: {
            importStrategy: "DELETE",
            atomicMode: "OBJECT",
        },
    });

    // E1114 = TE already deleted, E1082 = Event already deleted, E1113 = Enrollment already deleted
    const ALREADY_DELETED_CODES = new Set(["E1082", "E1113", "E1114"]);

    const cleanupTeUids = new Set(
        response.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports.map(
            (r) => r.uid,
        ),
    );
    const cleanupEnrollmentUids = new Set(
        response.bundleReport.typeReportMap.ENROLLMENT.objectReports.map(
            (r) => r.uid,
        ),
    );
    const cleanupEventUids = new Set(
        response.bundleReport.typeReportMap.EVENT.objectReports.map(
            (r) => r.uid,
        ),
    );

    let realFailures = 0;
    for (const err of response.validationReport.errorReports) {
        if (ALREADY_DELETED_CODES.has(err.errorCode)) {
            if (err.trackerType === "TRACKED_ENTITY")
                cleanupTeUids.add(err.uid);
            else if (err.trackerType === "ENROLLMENT")
                cleanupEnrollmentUids.add(err.uid);
            else if (err.trackerType === "EVENT") cleanupEventUids.add(err.uid);
        } else {
            realFailures++;
        }
    }
    const eventTable = eventsCollection.utils.getTable() as Table<
        FlattenedEvent,
        string
    >;
    const enrollTable = enrollmentsCollection.utils.getTable() as Table<
        FlattenedEnrollment,
        string
    >;

    for (const te of deletedTrackedEntities) {
        if (cleanupTeUids.has(te.trackedEntity)) {
            const childEnrollments = await enrollTable
                .filter((e) => e.trackedEntity === te.trackedEntity)
                .toArray();
            for (const enr of childEnrollments) {
                const childEvents = await eventTable
                    .filter((e) => e.enrollment === enr.enrollment)
                    .toArray();
                for (const ev of childEvents) {
                    await eventsCollection.delete(ev.event).isPersisted.promise;
                }
                await enrollmentsCollection.delete(enr.enrollment).isPersisted
                    .promise;
            }
            await trackedEntitiesCollection.delete(te.trackedEntity).isPersisted
                .promise;
        }
    }

    for (const enrollment of deletedEnrollments) {
        if (
            cleanupEnrollmentUids.has(enrollment.enrollment) &&
            !deletedTeIds.has(enrollment.trackedEntity)
        ) {
            await enrollmentsCollection.delete(enrollment.enrollment)
                .isPersisted.promise;
        }
    }

    for (const event of deletedEvents) {
        if (
            cleanupEventUids.has(event.event) &&
            !deletedTeIds.has(event.trackedEntity)
        ) {
            await eventsCollection.delete(event.event).isPersisted.promise;
        }
    }

    return {
        succeeded:
            cleanupTeUids.size +
            cleanupEnrollmentUids.size +
            cleanupEventUids.size,
        failed: realFailures,
    };
};

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
            engine: ReturnType<typeof useDataEngine>;
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
            db.syncState.put({
                id: "current",
                status: "idle",
                isOnline: true,
                isSyncing: false,
                lastPullAt: context.lastDataPull,
                lastPushAt: context.lastDataPush,
                pendingCount: 0,
                updatedAt: new Date().toISOString(),
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
        checkIndexDB: fromPromise<Awaited<ReturnType<typeof checkInfo>>>(
            async () => {
                return checkInfo();
            },
        ),
        queryIndexDB: fromPromise<
            Awaited<ReturnType<typeof queryInfo>>,
            { userInfo: MeUser }
        >(async ({ input: { userInfo } }) => {
            return queryInfo(userInfo);
        }),
        pullData: fromPromise<
            void,
            {
                program: string;
                orgUnit: string;
                lastDataPull: string | undefined;
                engine: ReturnType<typeof useDataEngine>;
                dataPullMode: DataPullMode;
            }
        >(
            async ({
                input: { lastDataPull, orgUnit, program, engine, dataPullMode },
            }) => {
                let currentPage = 1;
                const pageSize = 50;
                let hasMoreData = true;

                while (hasMoreData) {
                    let params: Record<string, any> = {
                        program,
                        orgUnits: orgUnit,
                        ouMode: "SELECTED",
                        fields: "*,enrollments[*,events[*]]",
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

                    const serverTrackedEntities =
                        instances.map(flattenTrackedEntity);
                    const serverEvents = instances.flatMap(({ enrollments }) =>
                        (enrollments ?? []).flatMap(({ events }) =>
                            (events ?? [])
                                .filter((event) => event.occurredAt)
                                .map(flattenEvent),
                        ),
                    );
                    const serverEnrollments = instances.flatMap(
                        ({ enrollments }) => {
                            return (enrollments ?? []).map(flattenEnrollment);
                        },
                    );

                    const teTable =
                        trackedEntitiesCollection.utils.getTable() as Table<
                            FlattenedTrackedEntity,
                            string
                        >;
                    const eventTable =
                        eventsCollection.utils.getTable() as Table<
                            FlattenedEvent,
                            string
                        >;
                    const enrollTable =
                        enrollmentsCollection.utils.getTable() as Table<
                            FlattenedEnrollment,
                            string
                        >;

                    const mergedTrackedEntities =
                        await mergeBulkTrackedEntities(
                            serverTrackedEntities,
                            async (id) => {
                                const result = await teTable.get(id);
                                return result;
                            },
                        );

                    const mergedEvents = await mergeBulkEvents(
                        serverEvents,
                        async (id) => {
                            const result = await eventTable.get(id);
                            return result;
                        },
                    );

                    const mergedEnrollments = await mergeBulkEnrollments(
                        serverEnrollments,
                        async (id) => {
                            const result = await enrollTable.get(id);
                            return result;
                        },
                    );
                    await enrollmentsCollection.utils.bulkInsertLocally(
                        mergedEnrollments,
                    );
                    await trackedEntitiesCollection.utils.bulkInsertLocally(
                        mergedTrackedEntities,
                    );
                    await eventsCollection.utils.bulkInsertLocally(
                        mergedEvents,
                    );

                    hasMoreData = shouldContinueDataPull({
                        receivedCount: instances.length,
                        pageSize,
                        pager,
                    });
                    currentPage++;
                }
            },
        ),
        saveMetadata: fromPromise<void, Metadata>(async ({ input }) => {
            const succeeded = input.succeededResources ?? new Set<Resource>();
            const wrote = (resource: Resource) =>
                succeeded.size === 0 || succeeded.has(resource);
            if (wrote("organisationUnits")) {
                await db.organisationUnits.bulkPut(input.organisationUnits);
            }
            if (wrote("programs")) {
                await db.programs.bulkPut(input.programs);
            }
            if (wrote("dataElements")) {
                await db.dataElements.bulkPut(input.dataElements);
            }
            if (wrote("programIndicators")) {
                await db.programIndicators.bulkPut(input.programIndicators);
            }
            if (wrote("attributes")) {
                await db.trackedEntityAttributes.bulkPut(
                    input.trackedEntityAttributes,
                );
            }
            if (wrote("programRules")) {
                await db.programRules.bulkPut(input.programRules);
            }
            if (wrote("programRuleVariables")) {
                await db.programRuleVariables.bulkPut(
                    input.programRuleVariables,
                );
            }
            if (wrote("optionSets")) {
                await db.optionSets.bulkPut(input.optionSets);
            }
            if (wrote("optionGroups")) {
                await db.optionGroups.bulkPut(input.optionGroups);
            }
            if (wrote("dataSets")) {
                await db.dataSets.bulkPut(input.dataSets);
            }
            if (wrote("categoryOptionCombos")) {
                await db.categoryOptionCombos.bulkPut(
                    input.categoryOptionCombos,
                );
            }
            // metadata-version bookkeeping always writes — its content only
            // reflects successful resources thanks to per-resource try/catch.
            await db.metadataVersions.bulkPut(input.metadataVersion);
        }),
        pullUIConfig: fromPromise<
            UIConfig,
            { engine: ReturnType<typeof useDataEngine> }
        >(async ({ input: { engine } }) => {
            try {
                const result = (await engine.query({
                    uiConfig: {
                        resource: "dataStore/eregisters/ui-config",
                    },
                })) as { uiConfig: UIConfig };
                await db.uiConfig.bulkPut([
                    { id: "main", config: result.uiConfig },
                ]);
                return result.uiConfig;
            } catch {
                await db.uiConfig.bulkPut([
                    { id: "main", config: emptyUIConfig },
                ]);
                return emptyUIConfig;
            }
        }),
        pullResource: fromPromise<
            Metadata,
            {
                resources: Resource[];
                engine: ReturnType<typeof useDataEngine>;
                lastMetadataPull: string | undefined;
                metadataSyncMode: MetadataSyncMode;
                userOrgUnit: string;
            }
        >(async ({ input }) => {
            const {
                resources,
                engine,
                lastMetadataPull,
                metadataSyncMode,
                userOrgUnit,
            } = input;

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
                                    fields: "id,name,programSections[id,name,sortOrder,trackedEntityAttributes[id]],trackedEntityType[id,trackedEntityTypeAttributes[id]],programType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,programStages[id,repeatable,name,code,programStageDataElements[id,compulsory,renderOptionsAsRadio,dataElement[id],renderType,allowFutureDate],programStageSections[id,name,sortOrder,dataElements[id]]],programTrackedEntityAttributes[id,mandatory,searchable,renderOptionsAsRadio,renderType,sortOrder,allowFutureDate,displayInList,trackedEntityAttribute[id]]",
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
                            fields: "id,options[id,name,code,sortOrder]",
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
                    const currentTimestamp = new Date().toISOString();
                    let version = await db.metadataVersions.get(
                        "metadata-version",
                    );
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
        deleteAllMetadata: fromPromise<void, Metadata>(async ({ input }) => {
            const succeeded = input.succeededResources ?? new Set<Resource>();
            const shouldClear = (resource: Resource) =>
                succeeded.size === 0 || succeeded.has(resource);
            if (shouldClear("organisationUnits")) {
                await db.organisationUnits.clear();
            }
            if (shouldClear("programs")) {
                await db.programs.clear();
            }
            if (shouldClear("dataElements")) {
                await db.dataElements.clear();
            }
            if (shouldClear("programIndicators")) {
                await db.programIndicators.clear();
            }
            if (shouldClear("attributes")) {
                await db.trackedEntityAttributes.clear();
            }
            if (shouldClear("programRules")) {
                await db.programRules.clear();
            }
            if (shouldClear("programRuleVariables")) {
                await db.programRuleVariables.clear();
            }
            if (shouldClear("optionSets")) {
                await db.optionSets.clear();
            }
            if (shouldClear("optionGroups")) {
                await db.optionGroups.clear();
            }
            if (shouldClear("dataSets")) {
                await db.dataSets.clear();
            }
            if (shouldClear("categoryOptionCombos")) {
                await db.categoryOptionCombos.clear();
            }
            await db.metadataVersions.clear();
        }),
        resetDatabase: fromPromise(async () => {
            await db.delete();
            await db.open();
        }),
        deleteAllData: fromPromise<void>(async () => {}),
        processBatchSync: fromPromise(
            async ({
                input,
            }: {
                input: {
                    engine: ReturnType<typeof useDataEngine>;
                    validAttributeIds: Set<string>;
                    validDataElementsByStage: Map<string, Set<string>>;
                };
            }) => {
                const { engine, validAttributeIds, validDataElementsByStage } =
                    input;

                const teTable =
                    trackedEntitiesCollection.utils.getTable() as Table<
                        FlattenedTrackedEntity,
                        string
                    >;
                const eventTable = eventsCollection.utils.getTable() as Table<
                    FlattenedEvent,
                    string
                >;
                const enrollTable =
                    enrollmentsCollection.utils.getTable() as Table<
                        FlattenedEnrollment,
                        string
                    >;

                const pendingTEs = await teTable
                    .filter(
                        (e) =>
                            e.syncStatus === "pending" ||
                            e.syncStatus === "failed",
                    )
                    .toArray();

                const pendingEnrollments = await enrollTable
                    .filter(
                        (e) =>
                            (e.syncStatus === "pending" ||
                                e.syncStatus === "failed") &&
                            !!e.enrolledAt,
                    )
                    .toArray();

                const pendingEvents = await eventTable
                    .filter(
                        (e) =>
                            (e.syncStatus === "pending" ||
                                e.syncStatus === "failed") &&
                            !!e.occurredAt,
                    )
                    .toArray();

                const deletedEvents = await eventTable
                    .filter((e) => e.syncStatus === "deleted")
                    .toArray();

                const deletedTEs = await teTable
                    .filter((e) => e.syncStatus === "deleted")
                    .toArray();

                const deletedEnrollments = await enrollTable
                    .filter((e) => e.syncStatus === "deleted")
                    .toArray();

                if (
                    pendingTEs.length === 0 &&
                    pendingEnrollments.length === 0 &&
                    pendingEvents.length === 0 &&
                    deletedEvents.length === 0 &&
                    deletedTEs.length === 0 &&
                    deletedEnrollments.length === 0
                ) {
                    return { processed: 0, succeeded: 0, failed: 0 };
                }

                let upsertResult = { processed: 0, succeeded: 0, failed: 0 };
                if (
                    pendingTEs.length > 0 ||
                    pendingEnrollments.length > 0 ||
                    pendingEvents.length > 0
                ) {
                    upsertResult = await syncReportToLocal({
                        entities: [
                            ...pendingTEs,
                            ...pendingEnrollments,
                            ...pendingEvents,
                        ],
                        engine,
                        validAttributeIds,
                        validDataElementsByStage,
                    });
                }

                let deleteResult = { succeeded: 0, failed: 0 };
                if (
                    deletedEvents.length > 0 ||
                    deletedTEs.length > 0 ||
                    deletedEnrollments.length > 0
                ) {
                    deleteResult = await syncDeleteToLocal({
                        deletedEvents,
                        deletedTrackedEntities: deletedTEs,
                        deletedEnrollments,
                        engine,
                    });
                }

                return {
                    processed:
                        upsertResult.processed +
                        deleteResult.succeeded +
                        deleteResult.failed,
                    succeeded: upsertResult.succeeded + deleteResult.succeeded,
                    failed: upsertResult.failed + deleteResult.failed,
                };
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
    context: ({ input: { engine, message, userInfo } }) => {
        return {
            engine,
            error: null,
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

            enrollmentsCollection,
            eventsCollection,
            trackedEntitiesCollection,
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
                        onDone: [
                            {
                                target: "queryingIndexDB",
                                guard: ({ event }) => {
                                    return !event.output.needsSyncing;
                                },
                                actions: assign(({ event }) => {
                                    return {
                                        lastMetadataPull:
                                            event.output.metadataVersion
                                                ?.lastSync,
                                        lastDataPull:
                                            event.output.syncStatus?.lastPullAt,
                                        lastDataPush:
                                            event.output.syncStatus?.lastPushAt,
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
                                        event.output.wasIndexedDBDeleted
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
                        input: ({ context: { rawMetadata } }) => {
                            return rawMetadata;
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
                        onDone: {
                            target: "idle",
                        },
                    },
                },
                pullingUIConfig: {
                    invoke: {
                        src: "pullUIConfig",
                        input: ({ context: { engine } }) => ({ engine }),
                        onDone: {
                            target: "queryingIndexDB",
                            actions: assign(({ event }) => ({
                                uiConfig: event.output,
                            })),
                        },
                        onError: "queryingIndexDB",
                    },
                },
                queryingIndexDB: {
                    invoke: {
                        src: "queryIndexDB",
                        input: ({ context }) => ({
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
                        input: ({ context: { rawMetadata } }) => rawMetadata,
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
                                resources,
                                lastMetadataPull,
                                metadataSyncMode,
                                userInfo,
                            },
                        }) => {
                            return {
                                resources,
                                engine,
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
                            validAttributeIds: context.validAttributeIds,
                            validDataElementsByStage:
                                context.validDataElementsByStage,
                        }),
                        onDone: [
                            {
                                guard: ({ event }) =>
                                    shouldRecordDataPush(event.output),
                                target: "updateLastDataPush",
                            },
                            {
                                target: "idle",
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
                                lastDataPull,
                                userInfo,
                                dataPullMode,
                            },
                        }) => ({
                            engine,
                            lastDataPull,
                            enrollmentsCollection,
                            eventsCollection,
                            orgUnit: userInfo.organisationUnits[0].id,
                            program: "ueBhWkWll5v",
                            trackedEntitiesCollection,
                            dataPullMode,
                        }),

                        onDone: {
                            target: "updateLastDataPull",
                        },

                        onError: "failure",
                    },
                },
                updateLastDataPull: {
                    entry: [
                        assign({
                            lastDataPull: () => new Date().toISOString(),
                            dataPullMode: () => "incremental",
                        }),
                        "persistSyncState",
                    ],
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
