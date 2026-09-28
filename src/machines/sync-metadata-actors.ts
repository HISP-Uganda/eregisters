import type { SyncState } from "../schemas";
import {
    checkMetadataInfoGeneric,
    deleteMetadataForResyncGeneric,
    queryMetadataGeneric,
    resetMetadataDatabaseGeneric,
    saveMetadataGeneric,
    type CheckMetadataInfoResult,
    type QueryMetadataInfoResult,
} from "../db/metadata-operations";
import type { MetadataStore } from "../db/metadata-store";
import { SYNC_STATE_LOCK_NAME, withLock } from "./sync-locks";
import { queryWithTimeout, SYNC_TIMEOUTS_MS } from "./network-reachability";
import { METADATA_RESOURCES } from "./metadata-resources";
import {
    extractServerDate,
    shouldUseLastUpdatedFilter,
    type MetadataSyncMode,
} from "./sync-metadata-mode";
import {
    emptyStageHierarchyConfig,
    emptyUIConfig,
    Engine,
    Metadata,
    MetadataVersion,
    Resource,
    StageHierarchyConfig,
    UIConfig,
} from "../schemas";

/**
 * Backend-agnostic bodies for `src/machines/sync.ts`'s metadata-pipeline
 * actors, extracted into small, independently-testable functions (per
 * wayfinder ticket "How Does src/machines/sync.ts's Pull/Push Logic Get
 * Restructured for the New SQLite Adapter?", the "Cut sync.ts's Metadata
 * Pipeline Over to SQLite" implementation plan, and later widened to
 * dual-backend per `docs/wayfinder/opfs-dexie-dual-backend/`). `sync.ts` is
 * explicitly load-bearing/fragile per root CLAUDE.md — keeping the new
 * logic here means it's testable without spinning up the whole XState
 * machine, and sync.ts's own diff for this stays small (each actor body
 * becomes a thin call into one of these functions).
 *
 * Every function here takes an explicit `MetadataStore` rather than
 * reaching for a module-level singleton or a raw `SqlDriver`, so tests can
 * pass either a `sqliteMetadataStore`- or `dexieMetadataStore`-backed
 * instance with no mocking needed.
 */

let syncStateWrites: Promise<unknown> = Promise.resolve();

/**
 * Updates ONE checkpoint field of the `sync_state` row (`lastPullAt` or
 * `lastPushAt`), leaving the other untouched — wayfinder ticket "Load and
 * persist the data checkpoint correctly on every boot path (Phase 1)".
 *
 * Replaces a whole-row rewrite from machine context: the pull and push
 * regions run in parallel, so each rewriting the row from its own context
 * made the later write clobber the other's newer checkpoint — and a
 * context that never loaded a checkpoint erased it outright. Writes are
 * read-merge-written one at a time — a module-level queue within this tab,
 * and a Web Lock across tabs (another tab's push and this tab's pull can
 * patch at the same moment; wayfinder ticket "Do two open tabs' sync
 * machines conflict, and does sync need a cross-tab lock?") — so two
 * patches can't interleave. Rejects when the write fails, so callers can keep the
 * previous checkpoint instead of advancing past what's on disk.
 */
export function patchSyncState(
    store: MetadataStore,
    patch:
        | Pick<SyncState, "lastPullAt" | "pullScope">
        | Pick<SyncState, "lastPushAt">,
): Promise<void> {
    const write = syncStateWrites.then(() => withLock(SYNC_STATE_LOCK_NAME, async () => {
        const existing = await store.getRow<SyncState>("sync_state", "current");
        const row: SyncState = {
            id: "current",
            status: "idle",
            isOnline: true,
            isSyncing: false,
            pendingCount: 0,
            ...existing,
            ...patch,
            updatedAt: new Date().toISOString(),
        };
        await store.putRow("sync_state", row);
    }));
    // Keep the queue alive after a failed write; the caller still sees it.
    syncStateWrites = write.catch(() => undefined);
    return write;
}

export function checkMetadataSyncStatus(
    store: MetadataStore,
): Promise<CheckMetadataInfoResult> {
    return checkMetadataInfoGeneric(store);
}

export function queryMetadata(
    store: MetadataStore,
    userOrgUnitPath: string,
): Promise<QueryMetadataInfoResult> {
    return queryMetadataGeneric(store, userOrgUnitPath);
}

export function saveMetadataToSqlite(
    store: MetadataStore,
    input: Metadata,
): Promise<void> {
    return saveMetadataGeneric(store, input);
}

/**
 * A Full Metadata Sync's replacement: delete the old metadata and save
 * the new copy as ONE all-or-nothing change, so an interruption (a forced
 * reload, a closed tab, a crash) or a failed save leaves the old metadata
 * intact instead of none — wayfinder ticket "Should a Full Metadata Sync
 * replace metadata in one step instead of deleting it first?".
 */
export function replaceMetadataForResync(
    store: MetadataStore,
    input: Metadata,
): Promise<void> {
    return store.transaction(async (tx) => {
        await deleteMetadataForResyncGeneric(tx, input);
        await saveMetadataGeneric(tx, input);
    });
}

export function resetMetadataForRecovery(store: MetadataStore): Promise<void> {
    return resetMetadataDatabaseGeneric(store);
}

export async function pullUiConfig(
    store: MetadataStore,
    engine: Engine,
): Promise<UIConfig> {
    try {
        const result = (await queryWithTimeout(engine, {
            uiConfig: { resource: "dataStore/eregisters/ui-config" },
        }, SYNC_TIMEOUTS_MS.probe)) as { uiConfig: UIConfig };
        await store.putRow("ui_config", {
            id: "main",
            config: result.uiConfig,
        });
        return result.uiConfig;
    } catch {
        // Runs on every boot (sync.ts's metadataSync `waiting` state), so
        // offline must not wipe the last config pulled while online.
        const existing = await store.getRow<{ id: string; config: UIConfig }>(
            "ui_config",
            "main",
        );
        if (existing) return existing.config;
        await store.putRow("ui_config", {
            id: "main",
            config: emptyUIConfig,
        });
        return emptyUIConfig;
    }
}

export async function pullStageHierarchyConfig(
    store: MetadataStore,
    engine: Engine,
): Promise<StageHierarchyConfig> {
    try {
        const result = (await queryWithTimeout(engine, {
            stageHierarchy: {
                resource: "dataStore/eregisters/stage-hierarchy",
            },
        }, SYNC_TIMEOUTS_MS.probe)) as { stageHierarchy: StageHierarchyConfig };
        await store.putRow("stage_hierarchy", {
            id: "main",
            config: result.stageHierarchy,
        });
        return result.stageHierarchy;
    } catch {
        await store.putRow("stage_hierarchy", {
            id: "main",
            config: emptyStageHierarchyConfig,
        });
        return emptyStageHierarchyConfig;
    }
}

/**
 * pullData's (the tracker actor's) `ui_config` read for `dataPullPageSize`
 * — the one touch point inside an otherwise out-of-scope, still-Dexie
 * actor, migrated here since it's trivially the same `ui_config` table
 * (see the implementation plan's decision #6).
 */
export async function getConfiguredPageSize(
    store: MetadataStore,
    engine: Engine,
): Promise<number | undefined> {
    try {
        const result = (await queryWithTimeout(engine, {
            uiConfig: { resource: "dataStore/eregisters/ui-config" },
        }, SYNC_TIMEOUTS_MS.probe)) as { uiConfig: UIConfig };
        await store.putRow("ui_config", {
            id: "main",
            config: result.uiConfig,
        });
        return result.uiConfig.dataPullPageSize;
    } catch {
        const row = await store.getRow<{ id: string; config: UIConfig }>(
            "ui_config",
            "main",
        );
        return row?.config.dataPullPageSize;
    }
}

/** The metadata pull's `metadata_versions` record (see pullMetadataResources). */
export function getMetadataVersionRecord(
    store: MetadataStore,
): Promise<MetadataVersion | undefined> {
    return store.getRow<MetadataVersion>(
        "metadata_versions",
        "metadata-version",
    );
}

/**
 * The metadata version after a pull: each resource that succeeded, and
 * the version as a whole, stamped `timestamp`; other resources keep theirs.
 */
function stampMetadataVersions(
    previous: MetadataVersion | undefined,
    succeeded: Iterable<Resource>,
    timestamp: string,
): MetadataVersion {
    const version = previous ?? {
        id: "metadata-version",
        lastSync: timestamp,
        versions: {},
    };
    for (const resource of succeeded) {
        version.versions[resource] = timestamp;
    }
    version.lastSync = timestamp;
    return version;
}

/**
 * `pullResource`'s body: pulls every resource in parallel (see
 * `METADATA_RESOURCES`), skipping any that fail, and stamps the ones that
 * succeeded in the metadata version.
 */
export async function pullMetadataResources({
    resources,
    engine,
    metadataStore,
    lastMetadataPull,
    metadataSyncMode,
    userOrgUnit,
}: {
    resources: Resource[];
    engine: Engine;
    metadataStore: MetadataStore;
    lastMetadataPull: string | undefined;
    metadataSyncMode: MetadataSyncMode;
    userOrgUnit: string;
}): Promise<Metadata> {
    // Mirror pullData's lastDataPull boundary: capture the SERVER's clock
    // once, before any resource is pulled, rather than the device clock
    // per-resource — avoids client/server clock skew and guarantees a
    // resource updated on the server *during* this (possibly long-running)
    // sync is re-fetched next time instead of being skipped.
    const serverDate = extractServerDate(
        (await queryWithTimeout(
            engine,
            { info: { resource: "system/info" } },
            SYNC_TIMEOUTS_MS.probe,
        )) as { info?: { serverDate?: string } },
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
    const context = {
        userOrgUnit,
        since: shouldUseLastUpdatedFilter(metadataSyncMode, lastMetadataPull)
            ? lastMetadataPull
            : undefined,
    };

    const outcomes = await Promise.allSettled(
        resources.map(async (resource) => {
            const definition = METADATA_RESOURCES[resource];
            if (!definition) return;
            const response = await queryWithTimeout(
                engine,
                definition.query(context) as never,
                definition.timeoutMs,
            );
            Object.assign(results, definition.read(response));
        }),
    );
    outcomes.forEach((outcome, index) => {
        const resource = resources[index];
        if (outcome.status === "fulfilled") {
            results.succeededResources!.add(resource);
        } else {
            console.warn(`[metadata-sync] Skipping ${resource}:`, outcome.reason);
        }
    });

    if (results.succeededResources!.size > 0) {
        // Prefer the server clock captured above; fall back to the previous
        // boundary (don't advance with an untrusted timestamp — same rule as
        // resolveNextDataPull) and only to the device clock as a last
        // resort, since MetadataVersion.lastSync requires a string.
        const timestamp = serverDate ?? lastMetadataPull ?? new Date().toISOString();
        results.metadataVersion = [
            stampMetadataVersions(
                await getMetadataVersionRecord(metadataStore),
                results.succeededResources!,
                timestamp,
            ),
        ];
    }
    return results;
}
