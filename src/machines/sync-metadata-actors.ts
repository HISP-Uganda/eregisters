import type { SyncState } from "../db";
import { getConfigRow, putConfigRow } from "../db/sqlite/config-rows";
import { deleteAllMetadata } from "../db/sqlite/delete-metadata";
import type { SqlDriver } from "../db/sqlite/driver-types";
import {
    checkMetadataInfo,
    queryMetadataInfo,
    type CheckMetadataInfoResult,
    type QueryMetadataInfoResult,
} from "../db/sqlite/metadata-info";
import { resetMetadataDatabase } from "../db/sqlite/reset-metadata-database";
import { saveMetadata } from "../db/sqlite/save-metadata";
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
 * SQL-touching bodies for `src/machines/sync.ts`'s metadata-pipeline
 * actors, extracted into small, independently-testable functions (per
 * wayfinder ticket "How Does src/machines/sync.ts's Pull/Push Logic Get
 * Restructured for the New SQLite Adapter?", the "Cut sync.ts's Metadata
 * Pipeline Over to SQLite" implementation plan). `sync.ts` is explicitly
 * load-bearing/fragile per root CLAUDE.md — keeping the new SQL logic here
 * means it's testable without spinning up the whole XState machine, and
 * sync.ts's own diff for this cutover stays small (each actor body becomes
 * a thin call into one of these functions).
 *
 * Every function here takes an explicit `SqlDriver` rather than reaching
 * for a module-level singleton, so tests can pass a `node:sqlite`-backed
 * driver (`test-support/node-sqlite-driver.ts`) with no mocking needed for
 * the SQL side.
 */

export function persistCurrentSyncState(
    sqlDriver: SqlDriver,
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
    return putConfigRow(sqlDriver, "sync_state", row);
}

export function checkMetadataSyncStatus(
    sqlDriver: SqlDriver,
): Promise<CheckMetadataInfoResult> {
    return checkMetadataInfo(sqlDriver);
}

export function queryMetadata(
    sqlDriver: SqlDriver,
    userOrgUnitPath: string,
): Promise<QueryMetadataInfoResult> {
    return queryMetadataInfo(sqlDriver, userOrgUnitPath);
}

export function saveMetadataToSqlite(
    sqlDriver: SqlDriver,
    input: Metadata,
): Promise<void> {
    return saveMetadata(sqlDriver, input);
}

export function deleteMetadataForResync(
    sqlDriver: SqlDriver,
    input: Metadata,
): Promise<void> {
    return deleteAllMetadata(sqlDriver, input);
}

export function resetMetadataForRecovery(sqlDriver: SqlDriver): Promise<void> {
    return resetMetadataDatabase(sqlDriver);
}

export async function pullUiConfig(
    sqlDriver: SqlDriver,
    engine: Engine,
): Promise<UIConfig> {
    try {
        const result = (await engine.query({
            uiConfig: { resource: "dataStore/eregisters/ui-config" },
        })) as { uiConfig: UIConfig };
        await putConfigRow(sqlDriver, "ui_config", {
            id: "main",
            config: result.uiConfig,
        });
        return result.uiConfig;
    } catch {
        await putConfigRow(sqlDriver, "ui_config", {
            id: "main",
            config: emptyUIConfig,
        });
        return emptyUIConfig;
    }
}

export async function pullStageHierarchyConfig(
    sqlDriver: SqlDriver,
    engine: Engine,
): Promise<StageHierarchyConfig> {
    try {
        const result = (await engine.query({
            stageHierarchy: {
                resource: "dataStore/eregisters/stage-hierarchy",
            },
        })) as { stageHierarchy: StageHierarchyConfig };
        await putConfigRow(sqlDriver, "stage_hierarchy", {
            id: "main",
            config: result.stageHierarchy,
        });
        return result.stageHierarchy;
    } catch {
        await putConfigRow(sqlDriver, "stage_hierarchy", {
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
    sqlDriver: SqlDriver,
    engine: Engine,
): Promise<number | undefined> {
    try {
        const result = (await engine.query({
            uiConfig: { resource: "dataStore/eregisters/ui-config" },
        })) as { uiConfig: UIConfig };
        await putConfigRow(sqlDriver, "ui_config", {
            id: "main",
            config: result.uiConfig,
        });
        return result.uiConfig.dataPullPageSize;
    } catch {
        const row = await getConfigRow<{ id: string; config: UIConfig }>(
            sqlDriver,
            "ui_config",
            "main",
        );
        return row?.config.dataPullPageSize;
    }
}

/** pullResource's `metadata_versions` bookkeeping read (sync.ts:~1243). */
export function getMetadataVersionRecord(
    sqlDriver: SqlDriver,
): Promise<MetadataVersion | undefined> {
    return getConfigRow<MetadataVersion>(
        sqlDriver,
        "metadata_versions",
        "metadata-version",
    );
}
