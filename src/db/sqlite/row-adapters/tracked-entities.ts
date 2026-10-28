import type { FlattenedTrackedEntity } from "@/schemas";
import type { SqlDriver } from "@/db/sqlite/driver-types";
import type { RowAdapter } from "@/db/sqlite/row-adapter";
import { makeRelatedRowsLoader, relatedRowReads, sqlIn, toBool, toInt } from "./load-related-rows";
import { type SqlUser } from "./users";
import { writeRelatedRow } from "./write-related-row";

type TrackedEntityParentRow = {
    tracked_entity: string;
    tracked_entity_type: string;
    org_unit: string;
    created_at: string;
    updated_at: string;
    created_by_uid: string | null;
    updated_by_uid: string | null;
    inactive: number;
    deleted: number;
    potential_duplicate: number;
    parent_entity: string | null;
    last_synced: string;
    sync_error: string | null;
    version: number;
    sync_status: string;
};

const PARENT_COLUMNS = `tracked_entity, tracked_entity_type, org_unit, created_at,
                    updated_at, created_by_uid, updated_by_uid, inactive,
                    deleted, potential_duplicate, parent_entity,
                    last_synced, sync_error, version, sync_status`;

function reassemble(
    parent: TrackedEntityParentRow,
    attributesRecord: Record<string, unknown>,
    usersByUid: Map<string, SqlUser>,
): FlattenedTrackedEntity {
    return {
        trackedEntity: parent.tracked_entity,
        trackedEntityType: parent.tracked_entity_type,
        orgUnit: parent.org_unit,
        createdAt: parent.created_at,
        updatedAt: parent.updated_at,
        createdBy: parent.created_by_uid
            ? usersByUid.get(parent.created_by_uid)
            : undefined,
        updatedBy: parent.updated_by_uid
            ? usersByUid.get(parent.updated_by_uid)
            : undefined,
        inactive: toBool(parent.inactive),
        deleted: toBool(parent.deleted),
        potentialDuplicate: toBool(parent.potential_duplicate),
        parentEntity: parent.parent_entity ?? undefined,
        lastSynced: parent.last_synced,
        syncError: parent.sync_error,
        version: parent.version,
        syncStatus: parent.sync_status as FlattenedTrackedEntity["syncStatus"],
        attributes: attributesRecord,
    };
}

const loadRows = makeRelatedRowsLoader<TrackedEntityParentRow, FlattenedTrackedEntity>({
    parentTable: "tracked_entities",
    parentColumns: PARENT_COLUMNS,
    childTable: "tracked_entity_attributes",
    childKeyColumn: "tracked_entity",
    childNameColumn: "attribute",
    childValueColumn: "value",
    parentKey: (parent) => parent.tracked_entity,
    reassemble,
});

/**
 * Single-row lookup, scoped for the pull-loop merge step
 * (`mergeBulkTrackedEntities`'s `getLocalEntity` callback,
 * `src/db/merge-utils.ts:77-89`) — `RowAdapter.loadAll` is bulk-only, and a
 * per-row merge lookup for a whole page loading everything each time would
 * be wasteful.
 */
export async function getTrackedEntityById(
    db: SqlDriver,
    trackedEntity: string,
): Promise<FlattenedTrackedEntity | undefined> {
    return (await loadRows(db, { clause: "tracked_entity = ?", params: [trackedEntity], scopeChildren: true }))[0];
}

async function loadMany(
    db: SqlDriver,
    whereClause: string,
    params: ReadonlyArray<unknown>,
): Promise<FlattenedTrackedEntity[]> {
    return loadRows(db, { clause: whereClause, params });
}

/**
 * Backs `utils.ts`'s recursive parent/child-tracked-entity walk (see
 * `deleteRecursiveDraftSubtree`/`deleteEventWithChildren`/
 * `deleteTrackedEntityWithChildren`, and `tracked-entity.tsx`'s save-cascade
 * query) — a child TE-under-TE relationship (`parentEntity`), distinct from
 * DHIS2 relationships.
 */
export function findTrackedEntitiesByParentEntity(
    db: SqlDriver,
    parentEntity: string,
): Promise<FlattenedTrackedEntity[]> {
    return loadMany(db, "parent_entity = ?", [parentEntity]);
}

/** Backs sync.ts's pending/failed/deleted scans (`processBatchSync`). */
export function findTrackedEntitiesBySyncStatusIn(
    db: SqlDriver,
    statuses: ReadonlyArray<string>,
): Promise<FlattenedTrackedEntity[]> {
    return loadMany(db, sqlIn("sync_status", statuses), statuses);
}

function parentValues(row: FlattenedTrackedEntity): unknown[] {
    return [
        row.trackedEntityType, row.orgUnit, row.createdAt, row.updatedAt,
        row.createdBy?.uid ?? null, row.updatedBy?.uid ?? null,
        toInt(row.inactive), toInt(row.deleted), toInt(row.potentialDuplicate),
        row.parentEntity ?? null, row.lastSynced, row.syncError ?? null,
        row.version, row.syncStatus,
    ];
}

export const trackedEntitiesRowAdapter: RowAdapter<
    FlattenedTrackedEntity,
    string
> = {
    ...relatedRowReads(loadRows, "tracked_entity"),

    insertRow: (db, row, options) =>
        writeRelatedRow(db, row,
            `INSERT INTO tracked_entities (
                    tracked_entity, tracked_entity_type, org_unit, created_at,
                    updated_at, created_by_uid, updated_by_uid, inactive,
                    deleted, potential_duplicate, parent_entity, last_synced,
                    sync_error, version, sync_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [row.trackedEntity, ...parentValues(row)],
            (tx) => insertAttributes(tx, row.trackedEntity, row.attributes, options?.source ?? "local"),
        ),

    updateRow: (db, row, options) =>
        writeRelatedRow(db, row,
            `UPDATE tracked_entities SET
                    tracked_entity_type = ?, org_unit = ?, created_at = ?,
                    updated_at = ?, created_by_uid = ?, updated_by_uid = ?,
                    inactive = ?, deleted = ?, potential_duplicate = ?,
                    parent_entity = ?, last_synced = ?, sync_error = ?,
                    version = ?, sync_status = ?
                 WHERE tracked_entity = ?`,
            [...parentValues(row), row.trackedEntity],
            async (tx) => {
                await tx.execute("DELETE FROM tracked_entity_attributes WHERE tracked_entity = ?", [row.trackedEntity]);
                await insertAttributes(tx, row.trackedEntity, row.attributes, options?.source ?? "local");
            },
        ),

    deleteRow: async (db, key) => {
        await db.transaction(async (tx) => {
            await tx.execute(
                "DELETE FROM tracked_entity_attributes WHERE tracked_entity = ?",
                [key],
            );
            await tx.execute(
                "DELETE FROM tracked_entities WHERE tracked_entity = ?",
                [key],
            );
        });
    },
};

// Defaults to 'local' (ordinary optimistic collection writes) but a caller
// — the future sync.ts pull path, via utils.bulkInsertLocally's options
// parameter — can pass 'server' explicitly, so the per-field merge model
// ticket 003 designed is actually honored once that integration lands.
async function insertAttributes(
    db: SqlDriver,
    trackedEntity: string,
    attributes: Record<string, unknown>,
    source: "local" | "server",
): Promise<void> {
    for (const [attribute, value] of Object.entries(attributes)) {
        await db.execute(
            `INSERT INTO tracked_entity_attributes
                (tracked_entity, attribute, value, source)
            VALUES (?, ?, ?, ?)`,
            [
                trackedEntity,
                attribute,
                value == null ? null : String(value),
                source,
            ],
        );
    }
}
