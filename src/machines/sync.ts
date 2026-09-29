import { assign, fromCallback, fromPromise, not, setup } from "xstate";
import {
    DataElement,
    DEFAULT_DATA_PULL_PAGE_SIZE,
    emptyStageHierarchyConfig,
    emptyUIConfig,
    Engine,
    FlattenedEvent,
    FlattenedOptionSet,
    FlattenedTrackedEntity,
    Metadata,
    MeUser,
    Program,
    Resource,
    StageHierarchyConfig,
    TrackedEntity,
    TrackedEntityAttribute,
    UIConfig,
} from "@/schemas";

import { createActorContext } from "@xstate/react";
import { MessageInstance } from "antd/es/message/interface";
import type { SyncState } from "@/schemas";
import type { StorageBackend } from "@/db/backend";
import { crossTabBus } from "@/db/cross-tab";
import { subscribeConfigChanged } from "@/db/reactive-config";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "@/db/collections";
import type {
    CheckMetadataInfoResult,
    QueryMetadataInfoResult,
} from "@/db/metadata-operations";
import type { MetadataStore } from "@/db/metadata-store";
import { writePulledTrackedEntityPage } from "@/db/pull-page";
import { dexieLocalLookups } from "@/db/dexie/pull-page-lookups";
import type { SqlDriver } from "@/db/sqlite/driver-types";
import { sqlLocalLookups } from "@/db/sqlite/pull-page-lookups";
import { type ConnectivityStatus } from "./network-reachability";
import { queryWithTimeout, SYNC_TIMEOUTS_MS } from "./network-reachability";
import {
    checkMetadataSyncStatus,
    replaceMetadataForResync,
    getConfiguredPageSize,
    patchSyncState,
    pullMetadataResources,
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
    checkpointForScope,
    pullScopeKey,
    shouldUseLastDataPull,
    withPullOverlap,
} from "./sync-metadata-mode";
import {
    countFetched,
    logPullData,
    pullFailureOutcome,
    type PullDataSummary,
} from "./pull-log";
import { processBatchSync as processBatchSyncImpl } from "./sync-tracker-actors";
import { syncsBlockedByUpdate } from "@/app-update/update-controller";
import {
    holdLockIfAvailable,
    SYNC_LOCK_NAMES,
    type SyncKind,
} from "./sync-locks";

/** Shown in a tab whose sync was skipped because another tab runs it. */
const SKIPPED_SYNC_MESSAGES: Record<SyncKind, string> = {
    push: "Another open tab is already pushing data.",
    pull: "Another open tab is already pulling data — this tab updates when it finishes.",
    metadata:
        "Another open tab is already syncing metadata — this tab updates when it finishes.",
};

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
    /** A pulled / pushed checkpoint awaiting its write to `sync_state`. */
    pendingDataPull?: string;
    pendingDataPush?: string;
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
    /** Forget the pull checkpoint and pull everything again (local records kept). */
    | { type: "RESET_DATA_CHECKPOINT" }
    | {
          type: "EVALUATE_INDICATORS";
          event: FlattenedEvent;
          trackedEntity: FlattenedTrackedEntity;
      }
    | { type: "FULL_INDICATOR_SYNC" }
    | { type: "CANCEL" }
    | { type: "NETWORK_RECONNECT" }
    // Cross-tab coordination (wayfinder ticket "Do two open tabs' sync
    // machines conflict, and does sync need a cross-tab lock?").
    // Carry their kind: the regions run in parallel and every event reaches
    // all of them, so a push lock's grant must not start a waiting pull.
    | { type: "SYNC_LOCK_ACQUIRED"; kind: SyncKind }
    | { type: "SYNC_LOCK_BUSY"; kind: SyncKind }
    /** `sync_state` changed — possibly another tab's pull or push. */
    | { type: "SYNC_STATE_CHANGED"; syncState: SyncState | undefined }
    /** Another tab finished a metadata sync. */
    | { type: "METADATA_CHANGED_ELSEWHERE" }
    | { type: "SET_CONNECTIVITY_STATUS"; status: ConnectivityStatus }
    | { type: "PARENT_READY" }
    | { type: "PARENT_NOT_READY" };
/** The one tracker program this deployment pulls (see IMPLEMENTATION_PLAN R9 for multi-program). */
const PULL_PROGRAM = "ueBhWkWll5v";

function currentPullScope(userInfo: MeUser): string {
    return pullScopeKey(PULL_PROGRAM, userInfo.organisationUnits[0].id);
}

export const syncMachine = setup({
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

        announceSkippedSync: ({ context, event }) => {
            if (event.type === "SYNC_LOCK_BUSY") {
                context.message.info(
                    syncsBlockedByUpdate()
                        ? "An app update is about to be applied — syncing resumes after the reload."
                        : SKIPPED_SYNC_MESSAGES[event.kind],
                );
            }
        },
        announceMetadataSynced: () => {
            crossTabBus.publish({ kind: "metadata" });
        },

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

    },
    actors: {
        // Holds a sync kind's cross-tab Web Lock while the invoking state
        // is active; reports whether another tab already had it.
        holdSyncLock: fromCallback<SyncEvent, { kind: SyncKind }>(
            ({ sendBack, input }) => {
                // An app update is about to reload every tab: start nothing
                // new (wayfinder "What does a reload do to a push or pull
                // in progress, and must a forced reload wait for sync?").
                if (syncsBlockedByUpdate()) {
                    queueMicrotask(() =>
                        sendBack({ type: "SYNC_LOCK_BUSY", kind: input.kind }),
                    );
                    return () => {};
                }
                return holdLockIfAvailable(SYNC_LOCK_NAMES[input.kind], (acquired) =>
                    sendBack(
                        acquired
                            ? { type: "SYNC_LOCK_ACQUIRED", kind: input.kind }
                            : { type: "SYNC_LOCK_BUSY", kind: input.kind },
                    ),
                );
            },
        ),
        // What other tabs change underneath this machine: checkpoints
        // (`sync_state`, re-read so the labels and the next pull's
        // boundary stay current) and metadata they synced.
        watchOtherTabs: fromCallback<SyncEvent, { metadataStore: MetadataStore }>(
            ({ sendBack, input }) => {
                const offSyncState = subscribeConfigChanged(
                    "sync_state",
                    "current",
                    () => {
                        input.metadataStore
                            .getRow<SyncState>("sync_state", "current")
                            .then((syncState) =>
                                sendBack({ type: "SYNC_STATE_CHANGED", syncState }),
                            )
                            .catch((error) =>
                                console.warn("Re-reading sync_state failed:", error),
                            );
                    },
                );
                const offBus = crossTabBus.subscribe((change) => {
                    if (change.kind === "metadata") {
                        sendBack({ type: "METADATA_CHANGED_ELSEWHERE" });
                    }
                });
                return () => {
                    offSyncState();
                    offBus();
                };
            },
        ),
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
        // Awaited, so a checkpoint only advances in context once it is on
        // disk (IMPLEMENTATION_PLAN R2) — the pull/push states below wait
        // for this and keep the previous value if it rejects.
        persistCheckpoint: fromPromise<
            void,
            {
                metadataStore: MetadataStore;
                patch:
                    | { lastPullAt: string | undefined; pullScope?: string }
                    | { lastPushAt: string | undefined };
            }
        >(({ input }) => patchSyncState(input.metadataStore, input.patch)),
        // Invariant (R13): a failed or offline pull throws, so neither
        // local rows beyond the pages already merged nor `lastDataPull`
        // advance; a missing server date keeps the previous boundary.
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
                const startedAt = Date.now();
                const checkpointFrom = shouldUseLastDataPull(
                    dataPullMode,
                    lastDataPull,
                )
                    ? lastDataPull
                    : undefined;
                const updatedAfter = checkpointFrom
                    ? withPullOverlap(checkpointFrom)
                    : undefined;
                const fetched = { trackedEntities: 0, enrollments: 0, events: 0 };
                let pages = 0;
                let pageSize = DEFAULT_DATA_PULL_PAGE_SIZE;
                let serverTotal: number | undefined;
                const summary = (
                    outcome: PullDataSummary["outcome"],
                    checkpointTo: string | undefined,
                    error?: unknown,
                ): PullDataSummary => ({
                    outcome,
                    ...(error === undefined
                        ? {}
                        : { error: error instanceof Error ? error.message : String(error) }),
                    mode: checkpointFrom ? "incremental" : "full",
                    checkpointFrom: checkpointFrom ?? null,
                    updatedAfter: updatedAfter ?? null,
                    checkpointTo: checkpointTo ?? null,
                    serverTotal,
                    fetched,
                    pages,
                    pageSize,
                    durationMs: Date.now() - startedAt,
                });
                try {
                    // Mirror the DHIS2 Android SDK: the incremental `updatedAfter`
                    // boundary is the SERVER's clock captured BEFORE the pull
                    // starts, never the device clock captured after it. Reading
                    // system/info up front (a) avoids client/server clock skew and
                    // (b) guarantees that any record edited on the server *during*
                    // this (paged, possibly long-running) pull is re-fetched next
                    // time instead of being skipped. This value is only persisted
                    // once the pull below completes successfully.
                    const serverDate = extractServerDate(
                        (await queryWithTimeout(engine, {
                            info: { resource: "system/info" },
                        }, SYNC_TIMEOUTS_MS.probe)) as { info?: { serverDate?: string } },
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
                    pageSize =
                        configuredPageSize ?? DEFAULT_DATA_PULL_PAGE_SIZE;
                    let hasMoreData = true;


                    while (hasMoreData) {
                        let params: Record<string, any> = {
                            program,
                            orgUnits: orgUnit,
                            // `orgUnitMode`, not the legacy `ouMode`: DHIS2
                            // 2.41 deprecated `ouMode` and 2.42 (production)
                            // removed it — the server silently ignores it.
                            orgUnitMode: "SELECTED",
                            fields: "trackedEntity,createdAt,updatedAt,createdAtClient,updatedAtClient,orgUnit,trackedEntityType,inactive,deleted,potentialDuplicate,createdBy[uid,username,firstName,surname],updatedBy[uid,username,firstName,surname],attributes[attribute,value,createdAt,updatedAt],enrollments[enrollment,createdAt,updatedAt,createdAtClient,updatedAtClient,orgUnit,program,enrolledAt,occurredAt,completedAt,followUp,status,trackedEntity,geometry,attributeOptionCombo,deleted,createdBy[uid,username,firstName,surname],updatedBy[uid,username,firstName,surname],attributes[attribute,value,createdAt,updatedAt],events[event,enrollment,createdAt,updatedAt,createdAtClient,updatedAtClient,status,geometry,program,programStage,orgUnit,trackedEntity,occurredAt,completedAt,scheduledAt,attributeOptionCombo,assignedUser,completedBy,followUp,deleted,createdBy[uid,username,firstName,surname],updatedBy[uid,username,firstName,surname],dataValues[dataElement,createdBy,value,createdAt,updatedAt,providedElsewhere]]]",
                            page: currentPage,
                            pageSize: pageSize,
                        };
                        if (updatedAfter) {
                            params = { ...params, updatedAfter };
                        }

                        const response = (await queryWithTimeout(engine, {
                            trackedEntities: {
                                resource: "tracker/trackedEntities",
                                params,
                            },
                        }, SYNC_TIMEOUTS_MS.pullPage)) as {
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
                        pages += 1;
                        countFetched(fetched, instances);
                        if (pages === 1) serverTotal = pager?.total;

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

                    // The pull succeeded: advance the boundary to the server
                    // time captured before it started. If system/info gave
                    // us nothing, keep the previous boundary rather than the
                    // device clock.
                    const next = resolveNextDataPull(serverDate, lastDataPull);
                    logPullData(summary("ok", next));
                    return next;
                } catch (error) {
                    logPullData(summary(pullFailureOutcome(error), undefined, error));
                    throw error;
                }
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
            Parameters<typeof pullMetadataResources>[0]
        >(async ({ input }) => pullMetadataResources(input)),
        replaceAllMetadata: fromPromise<
            void,
            { metadataStore: MetadataStore; metadata: Metadata }
        >(async ({ input: { metadataStore, metadata } }) => {
            await replaceMetadataForResync(metadataStore, metadata);
        }),
        resetDatabase: fromPromise<void, { metadataStore: MetadataStore }>(
            async ({ input: { metadataStore } }) => {
                await resetMetadataForRecovery(metadataStore);
            },
        ),
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
    delays: {},
    guards: {
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5SwJ4DsDGA6AtmALgIYSFEDK62AlhADZgDEEA9mmFlWgG7MDW7qTLgLFShCkJr0EnHhlJVWAbQAMAXVVrEoAA7NYVfIrTaQAD0QBmAEwBGLCoAsANgAcrlbduXbAVl+WjgA0ICiItiq+jg6WAJwqAOy2Cc6+7gC+6SGC2HhEJOSUHHSMLGwc3HwCRXmihZIlMpXyRsrqSrZaSCB6Bq0m3RYI1q6WWAmxqd7x1nYJrsGh4bau1uNuNrbxo76Z2TUiBeJFUoxgAE7nzOdYOrSkAGbXOFg5wvliEtSNsswtxppNKZeoZjKYhpsHC53J5vH4AoswghRq4sL55t44o50a5bHsQG9akcvsV6AwyAAVACCACUKQB9ACyAFFqQARKnU+lkACaADkAMJA7og-rgxAJMZRXxeFQqWKWZzWRzykJI2wq6LeVKOWIRWzOTz4wmHT4nEoMABiAFUADK2pmsqkcrm8wXC3T6UGscUISwJLDWVIqDwTZwJXWqpYIPwTcZ2Gx6lRK2LWY0HD71bCwQhcThQRmmohMVjsX78V4ZurHIQ5vNoAtFwhNOQKNoadTAr1iwbhVzOLUq5ypGWWVyxSZq8KOLZYVPjw16xz99NCIlmoQARwArhcUPmAJJoCBgMxsgBCJfK5eqa6bJJ3e8Px9PF5bfzbaEBnZF3bBvZjftB2TEdvHHSdo2SawxiSVwEgSaxYQWFZV1ye8ikfc59wbI8TzPS8LiuG47keZ5KzvTMa2wTDsKgXDX3Pd9-nbD0ej-H0ANmBJfDnZNrAnBUokcCMpxjGcA0cEZJnlDUVyyAkq2JIoT3oIwG0LSirzLSoKxNSiSRUgh8w06smM-b8uk9Pp-1AIYNRGLANWTfwXFiXFHERadLB4zxZliFx7N8FRLFQ95qwMsBVOMpsGEI65bnufAnnOF49PC5TIqM9SmzM-oLK7ayONs6cHKckdXPczzAPHKE3DcqZhLxeS0qU2tKHzLSKh4XTFI3bN2obXKAXaH8rO9AZioQeJYkDXFuPReZfGVBJRLhVFEI8nxJjmSZQvXLNyIwDqym07rbzQ-SihyfMhpYzoCvG313HsJx3GxJUuOE1aZRmraEIWBJImTELmt6g7robWLLnikikrIlq+sOm7fmYr8RsstjCom8xEFWX7HH9cNdQQiMVsgxCeIjYT0RnKIvDTUGKPSoQAHdCFBSHKVpBkWXZTkqW5fkhVGzHHoAgcVHGXFlSW5dlwHVaB2iRqQw8ILrHRXZGYu5nsDZjmoCtO0HV551+cF90RdFGycb9Pw5zSHxcU8Anh0VjysEajaB0CRw9vQ1n2bUw2zFgIh8HYQgHgj84AApDTlFQAEoGARg79eD1jraK23IScNwPC8Hx-ECVaCeiby-A8SwVGg8dQta74yTdAV6WZPkKQPTvmTILP2OxoZEMloLE4NHwh6W0SNcBrA4KCmvnECGW-e1rBG9JRgAAVrTIAAJekXSpPusd9Ie0UTzxF9sCfrCnhesH9dX4lp+CV-2IR19OBhQ-DyPo4uWONdE4pzeJ-Eox8xaTTPiPOUY9r5ykntGWYaRZ7cVrtLSYLgG6IwgFQc4YAMD4C+AwCBPZJrDmcLPfOAkAjcVcL4Ke6I1iP2CsmEm8Etbv2wOvbcdxmDEHzGyPBBD8CdRvIdNeiNeG0H4bghsQj8GENumjDsGNs4D2WIkRyctDQRH8kGMmSJlR2HPkGSwlcogTmwQdaRsjBHCMIVDIiCVSIpQkTwvhAj5EOPwMo-Kv4T7i38p7R+cJF6+FiOiKeKoeJpAicOZc1gOEgy4ZIg6AAjUgGAAAWxCTpdSqO4xGmT8A5K+H49GD0yG2woVQ1yE5aFxKnkGewLCRjX0wc4axVEsAlLKZQJxMNErJVSspYpWTcmUAqaoqpNtB5ynPqPK+N8p4Gh4vxZw8QIiBEiE1VJHiChgFtIQMObIxCb23LAbJJCrb919PAmadg4LcWgvZWIU9861XiJEeYIZfBdNXkcC5tBaAb3JNSOkB9zYt1IXM8IqY5yphWLEQG44FhBm+i9C+iF+KKhed04FoKv42ntFC10QtYU5zsgiicTyUUhjcpJZw0SxgfTiBMOw6sIwEu3CCsFP9SB-xjvHC+ICxlEEJRvSlGiYw0qReOVFjKMVIOCdfaCbkky6lGDyvlDxeW0BpGAB4+CrliJ0udNJhBJV6pBYa41cBsnTOlb6JU0RgrxAjIqccQUGHRi2oGGBgRvJhhSQpD+5z9VYBtQao1JrrlxWIsM+G4qrWRujXauNTrbmBPIcqGIHrXbesiFPJI4wYEazrqkUNoCI18ohobfJ4ia0SsjfWrNai7kAQiEGB+Mo0hJPgp4fsoklqomHBqReE4fCpABfs2toL62DMTa40Z4aW11oGlAdtsyqXhFrpQixqx4KAxWMy6My57AGgnTXaWgRZ1hu4fOrAvDDnHNOfOm5Hac22z0WsGcKoFjCU1L6pEw4eI2FxMXRCY43A6tBRnDqXNIWHwtsLL9kCf1yrpYq9FZ6kRRDGIkSD8o4LeVg4Cp9CHIYkodChmF2aMPUrWLS5FOGmWiUCPYNlE5VjGIVHBrAVGQ5h0FVgKOwqE5yjFWu1NfKhPOq7Vh1jDLcOiV1LEjEQDuKSU1pkeSaBmAnngN0HIO6ZUAFoUGSl1FsaDGsZKiXM3mi+tmBJjn7NWsGVEzO+nMxEcYgQ9SpmCvZvUoluIvU01iHEeyH1hTAfQHzAEEKrRrr9a+Mplz0OSf7S6tZczRUoklyaBphKOXs95bE-FoJVWmDxSSC5a4IRHLl3WWAaLPjwheYrtsKaogCEmSUOpatxGY1JQ0SSgwl1a+vQywcTJHB63ZU9jk57LTcHXQxJVogpD8gTMc3aZuI3rUtxAM4xiKm8v6DVF6FaQUkjtpUyRX42f8kd9OQd8ynYQIvAMgN1PevcGkPD4QUhSjxv8lE813s9IeOzWg258HfeWjNaEHgmX+A1GXa+Dh5jSWPQ1t+cXG7I9q5E-r9S0gzkmMkbpJJTjfZS0gyIqICYorSMFf50E6fKR8V8b7BMeL0KiHQyMkpXCMLK3PVhrD0SeZkySWxXioAKJEd99wqJxzJh02slU7ykGSUlk4A0kTJgymnjzoQfTJmYAFyYtBcphwISCqmKqsxFSoK5cuKmsXm09JfYKt9+Azktqud97wtcQkvM2Sid6zSe1tKSAify96-eEtJ6JRensBKhkTs4LwRO0+RoZwExjiBgm6ieaGeCowRIG61O7lFSKvcCfTbGh1AuvAOCI1sGcIWaYceCmiOIzkfqKh9gJk7pfqlDEA45TwOJFwRGHeemqeoJ38QWPEOIAmA8RyDyH2TtBw8rB4ovEYipZgDiVJnrRMWgHDg877lNkqhOM9vtGKIax-oR419iJIre8OiOYAJ+9CWA5+owH01+H+SIwkzGBeSozy-YkwCQem6QQAA */
    id: "sync",
    type: "parallel",
    invoke: {
        src: "watchOtherTabs",
        input: ({ context }) => ({ metadataStore: context.metadataStore }),
    },
    on: {
        // The disk is the source of truth for checkpoints: another tab's
        // pull or push moved them. Taking an older value is safe (a later
        // pull re-downloads an overlap), never a skipped update.
        SYNC_STATE_CHANGED: {
            actions: assign(({ context, event }) => ({
                lastDataPull: checkpointForScope(
                    event.syncState,
                    currentPullScope(context.userInfo),
                ),
                lastDataPush: event.syncState?.lastPushAt,
            })),
        },
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
                                actions: assign(({ context, event }) => {
                                    const syncState = event.output.syncState as
                                        | {
                                              lastPullAt?: string;
                                              lastPushAt?: string;
                                              pullScope?: string;
                                          }
                                        | undefined;
                                    return {
                                        lastMetadataPull:
                                            event.output.metadataVersion
                                                ?.lastSync,
                                        lastDataPull: checkpointForScope(
                                            syncState,
                                            currentPullScope(context.userInfo),
                                        ),
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

                                actions: assign(({ context, event }) => {
                                    const mode =
                                        event.output.hasEmptyTables ||
                                        event.output.wasDatabaseDeleted
                                            ? "full"
                                            : "incremental";
                                    // Metadata state never resets the data
                                    // position (R1): `wasDatabaseDeleted`
                                    // only means "no metadata checkpoint",
                                    // which a metadata repair clears on
                                    // purpose. Without these, the next
                                    // pull dropped `updatedAfter` and the
                                    // push checkpoint was erased.
                                    const syncState = event.output
                                        .syncState as
                                        | {
                                              lastPullAt?: string;
                                              lastPushAt?: string;
                                              pullScope?: string;
                                          }
                                        | undefined;
                                    return {
                                        metadataSyncMode: mode,
                                        lastMetadataPull:
                                            event.output.metadataVersion
                                                ?.lastSync,
                                        lastDataPull: checkpointForScope(
                                            syncState,
                                            currentPullScope(context.userInfo),
                                        ),
                                        lastDataPush: syncState?.lastPushAt,
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
                syncing: {
                    // Holds this sync kind's cross-tab Web Lock for as long as the
                    // flow runs; leaving the state (done, failed, or the machine
                    // stopping) releases it. Another tab holding it → skip.
                    invoke: {
                        src: "holdSyncLock",
                        input: { kind: "metadata" as const },
                    },
                    initial: "acquiringLock",
                    on: {
                        SYNC_LOCK_BUSY: {
                            guard: ({ event }) => event.kind === "metadata",
                            target: "#metadataSync.queryingIndexDB",
                            actions: "announceSkippedSync",
                        },
                    },
                    states: {
                        acquiringLock: {
                            on: {
                                SYNC_LOCK_ACQUIRED: {
                                    guard: ({ event }) => event.kind === "metadata",
                                    target: "pulling",
                                },
                            },
                        },
                        pulling: {
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
                                        target: "replacingMetadata",
                                    },
                                ],

                                onError: {
                                    target: "#metadataSync.failure",
                                    actions: ({ event }) => {
                                        console.error(
                                            "Metadata pull error:",
                                            event.error,
                                        );
                                    },
                                },
                            },
                        },
                        // Full sync: delete + save as one all-or-nothing
                        // change. A failure rolls back and keeps the old
                        // metadata — never the store wipe (resetIndexDB)
                        // an incremental save's failure leads to.
                        replacingMetadata: {
                            invoke: {
                                src: "replaceAllMetadata",
                                input: ({
                                    context: { metadataStore, rawMetadata },
                                }) => ({
                                    metadataStore,
                                    metadata: rawMetadata,
                                }),
                                onDone: "pullingUIConfig",
                                onError: {
                                    target: "#metadataSync.failure",
                                    actions: ({ event }) => {
                                        console.error(
                                            "Full metadata replacement failed; old metadata kept:",
                                            event.error,
                                        );
                                    },
                                },
                            },
                        },
                        savingMetadata: {
                            invoke: {
                                src: "saveMetadata",
                                input: ({
                                    context: { metadataStore, rawMetadata },
                                }) => {
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
                                    target: "#metadataSync.idle",
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
                                // Tell other tabs, which reload metadata
                                // from the store (METADATA_CHANGED_ELSEWHERE).
                                onDone: {
                                    target: "#metadataSync.queryingIndexDB",
                                    actions: [
                                        assign(({ event }) => ({
                                            stageHierarchyConfig: event.output,
                                        })),
                                        "announceMetadataSynced",
                                    ],
                                },
                                onError: {
                                    target: "#metadataSync.queryingIndexDB",
                                    actions: "announceMetadataSynced",
                                },
                            },
                        },
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

                waiting: {
                    invoke: {
                        src: "pullUIConfig",
                        input: ({ context: { metadataStore, engine } }) => ({
                            metadataStore,
                            engine,
                        }),
                        onDone: {
                            actions: assign(({ event }) => ({
                                uiConfig: event.output,
                            })),
                        },
                    },
                    on: {
                        // Another tab synced metadata: reload it from the
                        // store (no server call).
                        METADATA_CHANGED_ELSEWHERE: {
                            target: "queryingIndexDB",
                        },
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

                // Same dead-end bug as dataPull's failure state (was
                // `failure: {}`, no recovery path short of a page reload)
                // — matches `waiting`'s exact recovery shape.
                failure: {
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
                },

                batchSync: {
                    // Holds this sync kind's cross-tab Web Lock for as long as the
                    // flow runs; leaving the state (done, failed, or the machine
                    // stopping) releases it. Another tab holding it → skip.
                    invoke: {
                        src: "holdSyncLock",
                        input: { kind: "push" as const },
                    },
                    initial: "acquiringLock",
                    on: {
                        SYNC_LOCK_BUSY: {
                            guard: ({ event }) => event.kind === "push",
                            target: "#dataSync.idle",
                            actions: "announceSkippedSync",
                        },
                    },
                    states: {
                        acquiringLock: {
                            on: {
                                SYNC_LOCK_ACQUIRED: {
                                    guard: ({ event }) => event.kind === "push",
                                    target: "pushing",
                                },
                            },
                        },
                        pushing: {
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
                                        target: "#dataSync.updateLastDataPush",
                                        actions: assign({
                                            connectivityStatus: ({ context, event }) =>
                                                nextConnectivityStatus(context, event),
                                        }),
                                    },
                                    {
                                        target: "#dataSync.idle",
                                        actions: assign({
                                            connectivityStatus: ({ context, event }) =>
                                                nextConnectivityStatus(context, event),
                                        }),
                                    },
                                ],
                                onError: {
                                    target: "#dataSync.idle",
                                    actions: ({ event }) => {
                                        console.error("Batch sync error:", event.error);
                                    },
                                },
                            },
                        },
                    },
                },

                updateLastDataPush: {
                    entry: assign({
                        pendingDataPush: () => new Date().toISOString(),
                    }),
                    invoke: {
                        src: "persistCheckpoint",
                        input: ({ context }) => ({
                            metadataStore: context.metadataStore,
                            patch: { lastPushAt: context.pendingDataPush },
                        }),
                        onDone: {
                            target: "idle",
                            actions: assign({
                                lastDataPush: ({ context }) =>
                                    context.pendingDataPush,
                            }),
                        },
                        onError: {
                            target: "idle",
                            actions: ({ event }) => {
                                console.error(
                                    "Failed to persist push checkpoint:",
                                    event.error,
                                );
                            },
                        },
                    },
                },
            },
        },
        dataPull: {
            initial: "idle",
            id: "dataPull",
            states: {
                idle: {
                    on: {
                        START_DATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },

                        RESET_DATA_CHECKPOINT: {
                            target: "resettingCheckpoint",
                        },

                        NETWORK_RECONNECT: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                    },
                },
                // Clears only the pull checkpoint — on disk first, then in
                // context — and pulls straight away. Local rows and the push
                // checkpoint are untouched: the full pull is a merge, like
                // any other. If the clear can't be saved, nothing changes.
                resettingCheckpoint: {
                    invoke: {
                        src: "persistCheckpoint",
                        input: ({ context }) => ({
                            metadataStore: context.metadataStore,
                            patch: { lastPullAt: undefined, pullScope: undefined },
                        }),
                        onDone: {
                            target: "syncing",
                            actions: assign({
                                lastDataPull: undefined,
                                dataPullMode: () => "incremental",
                            }),
                        },
                        onError: {
                            target: "waiting",
                            actions: ({ event }) => {
                                console.error(
                                    "Failed to reset pull checkpoint:",
                                    event.error,
                                );
                            },
                        },
                    },
                },

                syncing: {
                    // Holds this sync kind's cross-tab Web Lock for as long as the
                    // flow runs; leaving the state (done, failed, or the machine
                    // stopping) releases it. Another tab holding it → skip.
                    invoke: {
                        src: "holdSyncLock",
                        input: { kind: "pull" as const },
                    },
                    initial: "acquiringLock",
                    on: {
                        SYNC_LOCK_BUSY: {
                            guard: ({ event }) => event.kind === "pull",
                            target: "#dataPull.waiting",
                            actions: "announceSkippedSync",
                        },
                    },
                    states: {
                        acquiringLock: {
                            on: {
                                SYNC_LOCK_ACQUIRED: {
                                    guard: ({ event }) => event.kind === "pull",
                                    target: "pulling",
                                },
                            },
                        },
                        pulling: {
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
                                    program: PULL_PROGRAM,
                                    dataPullMode,
                                }),

                                onDone: {
                                    target: "#dataPull.updateLastDataPull",
                                    // The server-clock boundary returned by
                                    // `pullData` (captured before the pull) — not
                                    // the device clock; see the Android SDK parity
                                    // note in the actor. Pending until persisted.
                                    actions: assign({
                                        pendingDataPull: ({ event }) => event.output,
                                        dataPullMode: () => "incremental",
                                    }),
                                },

                                onError: {
                                    target: "#dataPull.failure",
                                    actions: ({ event }) => {
                                        console.error("Data pull error:", event.error);
                                    },
                                },
                            },
                        },
                    },
                },
                // The checkpoint advances in context only once it is on disk
                // (R2). If the write fails, the previous boundary stays and
                // the next pull re-fetches the same window — merges are
                // idempotent, so that only costs bandwidth.
                updateLastDataPull: {
                    invoke: {
                        src: "persistCheckpoint",
                        input: ({ context }) => ({
                            metadataStore: context.metadataStore,
                            patch: {
                                lastPullAt: context.pendingDataPull,
                                pullScope: currentPullScope(context.userInfo),
                            },
                        }),
                        onDone: {
                            target: "waiting",
                            actions: assign({
                                lastDataPull: ({ context }) =>
                                    context.pendingDataPull,
                            }),
                        },
                        onError: {
                            target: "waiting",
                            actions: ({ event }) => {
                                console.error(
                                    "Failed to persist pull checkpoint:",
                                    event.error,
                                );
                            },
                        },
                    },
                },

                waiting: {
                    on: {
                        START_DATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                        RESET_DATA_CHECKPOINT: {
                            target: "resettingCheckpoint",
                        },
                        NETWORK_RECONNECT: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                    },
                },
                // Was a dead end with no `on`/`after` handlers — a single
                // failed pull left the machine permanently stuck here,
                // accepting no further sync requests until the whole
                // `SyncContext.Provider` remounted (a full page reload).
                // Same recovery shape as `waiting`: retries automatically
                // on the next scheduled interval, and accepts the same
                // manual/network-triggered re-pull events immediately.
                failure: {
                    on: {
                        START_DATA_SYNC: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                        RESET_DATA_CHECKPOINT: {
                            target: "resettingCheckpoint",
                        },
                        NETWORK_RECONNECT: {
                            target: "syncing",
                            actions: assign({
                                dataPullMode: () => "incremental",
                            }),
                        },
                    },
                },
            },
        },
    },
});

export const SyncContext = createActorContext(syncMachine);
