import type { FlattenedTrackedEntity } from "../../../schemas";
import type { SqlDriver } from "../driver-types";
import type { RowAdapter } from "../row-adapter";
import { loadUsersByUid, upsertUser, type SqlUser } from "./users";

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

type AttributeRow = {
    tracked_entity: string;
    attribute: string;
    value: string | null;
    display_name: string | null;
    value_type: string | null;
    created_at: string | null;
    updated_at: string | null;
};

function toBool(n: number): boolean {
    return n === 1;
}
function toInt(b: boolean): number {
    return b ? 1 : 0;
}

function reassemble(
    parent: TrackedEntityParentRow,
    attributes: AttributeRow[],
    usersByUid: Map<string, SqlUser>,
): FlattenedTrackedEntity {
    const attributesRecord: Record<string, unknown> = {};
    for (const attr of attributes) {
        attributesRecord[attr.attribute] = attr.value;
    }
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

export const trackedEntitiesRowAdapter: RowAdapter<
    FlattenedTrackedEntity,
    string
> = {
    rowVersion: (row) => row.updatedAt,

    loadAll: async (db) => {
        const [parents, attributeRows, usersByUid] = await Promise.all([
            db.execute<TrackedEntityParentRow>(
                `SELECT tracked_entity, tracked_entity_type, org_unit, created_at,
                        updated_at, created_by_uid, updated_by_uid, inactive,
                        deleted, potential_duplicate, parent_entity,
                        last_synced, sync_error, version, sync_status
                 FROM tracked_entities`,
            ),
            db.execute<AttributeRow>(
                `SELECT tracked_entity, attribute, value, display_name,
                        value_type, created_at, updated_at
                 FROM tracked_entity_attributes`,
            ),
            loadUsersByUid(db),
        ]);

        const attributesByEntity = new Map<string, AttributeRow[]>();
        for (const attr of attributeRows.rows) {
            const bucket = attributesByEntity.get(attr.tracked_entity) ?? [];
            bucket.push(attr);
            attributesByEntity.set(attr.tracked_entity, bucket);
        }

        return parents.rows.map((parent) =>
            reassemble(
                parent,
                attributesByEntity.get(parent.tracked_entity) ?? [],
                usersByUid,
            ),
        );
    },

    insertRow: async (db, row) => {
        await db.transaction(async (tx) => {
            await upsertUser(tx, row.createdBy);
            await upsertUser(tx, row.updatedBy);
            await tx.execute(
                `INSERT INTO tracked_entities (
                    tracked_entity, tracked_entity_type, org_unit, created_at,
                    updated_at, created_by_uid, updated_by_uid, inactive,
                    deleted, potential_duplicate, parent_entity, last_synced,
                    sync_error, version, sync_status
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    row.trackedEntity,
                    row.trackedEntityType,
                    row.orgUnit,
                    row.createdAt,
                    row.updatedAt,
                    row.createdBy?.uid ?? null,
                    row.updatedBy?.uid ?? null,
                    toInt(row.inactive),
                    toInt(row.deleted),
                    toInt(row.potentialDuplicate),
                    row.parentEntity ?? null,
                    row.lastSynced,
                    row.syncError ?? null,
                    row.version,
                    row.syncStatus,
                ],
            );
            await insertAttributes(tx, row.trackedEntity, row.attributes);
        });
    },

    updateRow: async (db, row) => {
        await db.transaction(async (tx) => {
            await upsertUser(tx, row.createdBy);
            await upsertUser(tx, row.updatedBy);
            await tx.execute(
                `UPDATE tracked_entities SET
                    tracked_entity_type = ?, org_unit = ?, created_at = ?,
                    updated_at = ?, created_by_uid = ?, updated_by_uid = ?,
                    inactive = ?, deleted = ?, potential_duplicate = ?,
                    parent_entity = ?, last_synced = ?, sync_error = ?,
                    version = ?, sync_status = ?
                 WHERE tracked_entity = ?`,
                [
                    row.trackedEntityType,
                    row.orgUnit,
                    row.createdAt,
                    row.updatedAt,
                    row.createdBy?.uid ?? null,
                    row.updatedBy?.uid ?? null,
                    toInt(row.inactive),
                    toInt(row.deleted),
                    toInt(row.potentialDuplicate),
                    row.parentEntity ?? null,
                    row.lastSynced,
                    row.syncError ?? null,
                    row.version,
                    row.syncStatus,
                    row.trackedEntity,
                ],
            );
            await tx.execute(
                "DELETE FROM tracked_entity_attributes WHERE tracked_entity = ?",
                [row.trackedEntity],
            );
            await insertAttributes(tx, row.trackedEntity, row.attributes);
        });
    },

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

// insertRow/updateRow always write attribute rows with source='local' — this
// adapter is written/verified independent of the sync machine (wayfinder
// ticket "How Does src/machines/sync.ts's Pull/Push Logic Get Restructured
// for the New SQLite Adapter?" deferred that integration to a later session).
// Server-sourced bulk writes (the future sync.ts pull path) will need a
// variant that marks rows `source='server'` to support the per-field merge
// ticket 003 designed — not needed for this schema+adapter-only scope.
async function insertAttributes(
    db: SqlDriver,
    trackedEntity: string,
    attributes: Record<string, unknown>,
): Promise<void> {
    for (const [attribute, value] of Object.entries(attributes)) {
        await db.execute(
            `INSERT INTO tracked_entity_attributes
                (tracked_entity, attribute, value, source)
             VALUES (?, ?, ?, 'local')`,
            [trackedEntity, attribute, value == null ? null : String(value)],
        );
    }
}
