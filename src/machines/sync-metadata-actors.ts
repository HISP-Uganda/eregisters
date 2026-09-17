import type { SyncState } from "../db";
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
import {
    emptyStageHierarchyConfig,
    emptyUIConfig,
    Engine,
    Metadata,
    MetadataVersion,
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

export function persistCurrentSyncState(
    store: MetadataStore,
    params: {
        lastDataPull: string | undefined;
        lastDataPush: string | undefined;
    },
): Promise<void> {
    const row: SyncState = {
        id: "current",
        status: "idle",
        isOnline: true,
        isSyncing: false,
        lastPullAt: params.lastDataPull,
        lastPushAt: params.lastDataPush,
        pendingCount: 0,
        updatedAt: new Date().toISOString(),
    };
    return store.putRow("sync_state", row);
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

export function deleteMetadataForResync(
    store: MetadataStore,
    input: Metadata,
): Promise<void> {
    return deleteMetadataForResyncGeneric(store, input);
}

export function resetMetadataForRecovery(store: MetadataStore): Promise<void> {
    return resetMetadataDatabaseGeneric(store);
}

export async function pullUiConfig(
    store: MetadataStore,
    engine: Engine,
): Promise<UIConfig> {
    try {
        const result = (await engine.query({
            uiConfig: { resource: "dataStore/eregisters/ui-config" },
        })) as { uiConfig: UIConfig };
        await store.putRow("ui_config", {
            id: "main",
            config: result.uiConfig,
        });
        return result.uiConfig;
    } catch {
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
        const result = (await engine.query({
            stageHierarchy: {
                resource: "dataStore/eregisters/stage-hierarchy",
            },
        })) as { stageHierarchy: StageHierarchyConfig };
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
        const result = (await engine.query({
            uiConfig: { resource: "dataStore/eregisters/ui-config" },
        })) as { uiConfig: UIConfig };
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

/** pullResource's `metadata_versions` bookkeeping read (sync.ts:~1243). */
export function getMetadataVersionRecord(
    store: MetadataStore,
): Promise<MetadataVersion | undefined> {
    return store.getRow<MetadataVersion>(
        "metadata_versions",
        "metadata-version",
    );
}
