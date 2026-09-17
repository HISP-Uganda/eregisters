import type { SqlDriver } from "./driver-types";
import { getRowById } from "./metadata-info";
import { notifyConfigChanged } from "../reactive-config";
import { saveMetadataTable } from "./save-metadata";

/**
 * Single-row read/write for the "id + JSON blob" config tables
 * (`ui_config`, `stage_hierarchy`, `sync_state`) — the SQLite equivalents of
 * sync.ts's `pullUIConfig`/`pullStageHierarchy` actors and `persistSyncState`
 * action, each of which does a `bulkPut([{id, ...}])`-shaped write today.
 * `putConfigRow` is the single choke point for these writes (sync.ts actors
 * and the admin routes that edit config directly both go through it) so
 * nobody forgets the reactive-notify step `reactive-config.ts` depends on.
 */

export async function getConfigRow<T extends object>(
    db: SqlDriver,
    table: string,
    id: string,
): Promise<T | undefined> {
    return getRowById<T>(db, table, id);
}

export async function putConfigRow<T extends { id: string }>(
    db: SqlDriver,
    table: string,
    row: T,
): Promise<void> {
    await saveMetadataTable(db, table, [row], (r) => r.id);
    notifyConfigChanged(table, row.id);
}
