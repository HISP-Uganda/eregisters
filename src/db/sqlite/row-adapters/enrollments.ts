import type { FlattenedEnrollment } from "../../../schemas";
import type { SqlDriver } from "../driver-types";
import type { RowAdapter } from "../row-adapter";
import { loadUsersByUid, upsertUser, type SqlUser } from "./users";

type EnrollmentParentRow = {
    enrollment: string;
    tracked_entity: string;
    program: string;
    org_unit: string;
    status: string;
    enrolled_at: string;
    occurred_at: string | null;
    created_at: string;
    updated_at: string;
    created_by_uid: string | null;
    updated_by_uid: string | null;
    follow_up: number;
    deleted: number;
    notes: string | null;
    last_synced: string;
    sync_error: string | null;
    version: number;
    sync_status: string;
};

type AttributeRow = {
    enrollment: string;
    attribute: string;
    value: string | null;
};

function toBool(n: number): boolean {
    return n === 1;
}
function toInt(b: boolean): number {
    return b ? 1 : 0;
}

const PARENT_COLUMNS = `enrollment, tracked_entity, program, org_unit, status,
                    enrolled_at, occurred_at, created_at, updated_at,
                    created_by_uid, updated_by_uid, follow_up, deleted,
                    notes, last_synced, sync_error, version, sync_status`;
const ATTRIBUTE_COLUMNS = `enrollment, attribute, value`;

function reassemble(
    parent: EnrollmentParentRow,
    attributes: AttributeRow[],
    usersByUid: Map<string, SqlUser>,
): FlattenedEnrollment {
    const attributesRecord: Record<string, unknown> = {};
    for (const attr of attributes) {
        attributesRecord[attr.attribute] = attr.value;
    }
    return {
        enrollment: parent.enrollment,
        trackedEntity: parent.tracked_entity,
        program: parent.program,
        orgUnit: parent.org_unit,
        status: parent.status,
        enrolledAt: parent.enrolled_at,
        occurredAt: parent.occurred_at ?? "",
        createdAt: parent.created_at,
        updatedAt: parent.updated_at,
        createdBy: parent.created_by_uid
            ? usersByUid.get(parent.created_by_uid)
            : undefined,
        updatedBy: parent.updated_by_uid
            ? usersByUid.get(parent.updated_by_uid)
            : undefined,
        followUp: toBool(parent.follow_up),
        deleted: toBool(parent.deleted),
        notes: parent.notes ? JSON.parse(parent.notes) : undefined,
        lastSynced: parent.last_synced,
        syncError: parent.sync_error,
        version: parent.version,
        syncStatus: parent.sync_status as FlattenedEnrollment["syncStatus"],
        attributes: attributesRecord,
    };
}

/** See tracked-entities.ts's getTrackedEntityById for the rationale. */
export async function getEnrollmentById(
    db: SqlDriver,
    enrollment: string,
): Promise<FlattenedEnrollment | undefined> {
    const [parent, attributeRows, usersByUid] = await Promise.all([
        db.execute<EnrollmentParentRow>(
            `SELECT ${PARENT_COLUMNS} FROM enrollments WHERE enrollment = ?`,
            [enrollment],
        ),
        db.execute<AttributeRow>(
            `SELECT ${ATTRIBUTE_COLUMNS} FROM enrollment_attributes WHERE enrollment = ?`,
            [enrollment],
        ),
        loadUsersByUid(db),
    ]);
    if (!parent.rows[0]) return undefined;
    return reassemble(parent.rows[0], attributeRows.rows, usersByUid);
}

async function loadMany(
    db: SqlDriver,
    whereClause: string,
    params: ReadonlyArray<unknown>,
): Promise<FlattenedEnrollment[]> {
    const [parents, attributeRows, usersByUid] = await Promise.all([
        db.execute<EnrollmentParentRow>(
            `SELECT ${PARENT_COLUMNS} FROM enrollments WHERE ${whereClause}`,
            params,
        ),
        db.execute<AttributeRow>(
            `SELECT ${ATTRIBUTE_COLUMNS} FROM enrollment_attributes`,
        ),
        loadUsersByUid(db),
    ]);
    const attributesByEnrollment = new Map<string, AttributeRow[]>();
    for (const attr of attributeRows.rows) {
        const bucket = attributesByEnrollment.get(attr.enrollment) ?? [];
        bucket.push(attr);
        attributesByEnrollment.set(attr.enrollment, bucket);
    }
    return parents.rows.map((parent) =>
        reassemble(
            parent,
            attributesByEnrollment.get(parent.enrollment) ?? [],
            usersByUid,
        ),
    );
}

/** Backs the recursive delete walk's "enrollments under this TE" lookup. */
export function findEnrollmentsByTrackedEntity(
    db: SqlDriver,
    trackedEntity: string,
): Promise<FlattenedEnrollment[]> {
    return loadMany(db, "tracked_entity = ?", [trackedEntity]);
}

/** Backs `tracked-entity.tsx`'s save-cascade query (multiple child TEs at once). */
export function findEnrollmentsByTrackedEntityIn(
    db: SqlDriver,
    trackedEntityIds: ReadonlyArray<string>,
): Promise<FlattenedEnrollment[]> {
    if (trackedEntityIds.length === 0) return Promise.resolve([]);
    const placeholders = trackedEntityIds.map(() => "?").join(", ");
    return loadMany(
        db,
        `tracked_entity IN (${placeholders})`,
        trackedEntityIds,
    );
}

/** Backs sync.ts's pending/failed/deleted scans (`processBatchSync`). */
export function findEnrollmentsBySyncStatusIn(
    db: SqlDriver,
    statuses: ReadonlyArray<string>,
): Promise<FlattenedEnrollment[]> {
    const placeholders = statuses.map(() => "?").join(", ");
    return loadMany(db, `sync_status IN (${placeholders})`, statuses);
}

/**
 * Backs `collection-adapter.ts`'s scoped reloadAndDiff — unlike `loadMany`
 * (whose attribute-table read is always unfiltered), this filters BOTH
 * tables by the given keys, so a single-row write reloads O(1) rows
 * instead of the whole collection.
 */
async function loadByKeys(
    db: SqlDriver,
    keys: readonly string[],
): Promise<FlattenedEnrollment[]> {
    if (keys.length === 0) return [];
    const placeholders = keys.map(() => "?").join(", ");
    const [parents, attributeRows, usersByUid] = await Promise.all([
        db.execute<EnrollmentParentRow>(
            `SELECT ${PARENT_COLUMNS} FROM enrollments WHERE enrollment IN (${placeholders})`,
            keys,
        ),
        db.execute<AttributeRow>(
            `SELECT ${ATTRIBUTE_COLUMNS} FROM enrollment_attributes WHERE enrollment IN (${placeholders})`,
            keys,
        ),
        loadUsersByUid(db),
    ]);
    const attributesByEnrollment = new Map<string, AttributeRow[]>();
    for (const attr of attributeRows.rows) {
        const bucket = attributesByEnrollment.get(attr.enrollment) ?? [];
        bucket.push(attr);
        attributesByEnrollment.set(attr.enrollment, bucket);
    }
    return parents.rows.map((parent) =>
        reassemble(
            parent,
            attributesByEnrollment.get(parent.enrollment) ?? [],
            usersByUid,
        ),
    );
}

export const enrollmentsRowAdapter: RowAdapter<FlattenedEnrollment, string> = {
    rowVersion: (row) => row.updatedAt,

    loadByKeys,

    loadAll: async (db) => {
        const [parents, attributeRows, usersByUid] = await Promise.all([
            db.execute<EnrollmentParentRow>(
                `SELECT ${PARENT_COLUMNS} FROM enrollments`,
            ),
            db.execute<AttributeRow>(
                `SELECT ${ATTRIBUTE_COLUMNS} FROM enrollment_attributes`,
            ),
            loadUsersByUid(db),
        ]);

        const attributesByEnrollment = new Map<string, AttributeRow[]>();
        for (const attr of attributeRows.rows) {
            const bucket = attributesByEnrollment.get(attr.enrollment) ?? [];
            bucket.push(attr);
            attributesByEnrollment.set(attr.enrollment, bucket);
        }

        return parents.rows.map((parent) =>
            reassemble(
                parent,
                attributesByEnrollment.get(parent.enrollment) ?? [],
                usersByUid,
            ),
        );
    },

    insertRow: async (db, row, options) => {
        await db.transaction(async (tx) => {
            await upsertUser(tx, row.createdBy);
            await upsertUser(tx, row.updatedBy);
            await tx.execute(
                `INSERT INTO enrollments (
                    enrollment, tracked_entity, program, org_unit, status,
                    enrolled_at, occurred_at, created_at, updated_at,
                    created_by_uid, updated_by_uid, follow_up, deleted,
                    notes, last_synced, sync_error, version, sync_status
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    row.enrollment,
                    row.trackedEntity,
                    row.program,
                    row.orgUnit,
                    row.status,
                    row.enrolledAt,
                    row.occurredAt ?? null,
                    row.createdAt,
                    row.updatedAt,
                    row.createdBy?.uid ?? null,
                    row.updatedBy?.uid ?? null,
                    toInt(row.followUp),
                    toInt(row.deleted),
                    row.notes ? JSON.stringify(row.notes) : null,
                    row.lastSynced,
                    row.syncError ?? null,
                    row.version,
                    row.syncStatus,
                ],
            );
            await insertAttributes(
                tx,
                row.enrollment,
                row.attributes,
                options?.source ?? "local",
            );
        });
    },

    updateRow: async (db, row, options) => {
        await db.transaction(async (tx) => {
            await upsertUser(tx, row.createdBy);
            await upsertUser(tx, row.updatedBy);
            await tx.execute(
                `UPDATE enrollments SET
                    tracked_entity = ?, program = ?, org_unit = ?, status = ?,
                    enrolled_at = ?, occurred_at = ?, created_at = ?,
                    updated_at = ?, created_by_uid = ?, updated_by_uid = ?,
                    follow_up = ?, deleted = ?, notes = ?, last_synced = ?,
                    sync_error = ?, version = ?, sync_status = ?
                 WHERE enrollment = ?`,
                [
                    row.trackedEntity,
                    row.program,
                    row.orgUnit,
                    row.status,
                    row.enrolledAt,
                    row.occurredAt ?? null,
                    row.createdAt,
                    row.updatedAt,
                    row.createdBy?.uid ?? null,
                    row.updatedBy?.uid ?? null,
                    toInt(row.followUp),
                    toInt(row.deleted),
                    row.notes ? JSON.stringify(row.notes) : null,
                    row.lastSynced,
                    row.syncError ?? null,
                    row.version,
                    row.syncStatus,
                    row.enrollment,
                ],
            );
            await tx.execute(
                "DELETE FROM enrollment_attributes WHERE enrollment = ?",
                [row.enrollment],
            );
            await insertAttributes(
                tx,
                row.enrollment,
                row.attributes,
                options?.source ?? "local",
            );
        });
    },

    deleteRow: async (db, key) => {
        await db.transaction(async (tx) => {
            await tx.execute(
                "DELETE FROM enrollment_attributes WHERE enrollment = ?",
                [key],
            );
            await tx.execute("DELETE FROM enrollments WHERE enrollment = ?", [
                key,
            ]);
        });
    },
};

// Defaults to 'local'; the future sync.ts pull path can pass 'server'
// explicitly via utils.bulkInsertLocally's options parameter — see
// tracked-entities.ts's equivalent function for the full rationale.
async function insertAttributes(
    db: SqlDriver,
    enrollment: string,
    attributes: Record<string, unknown>,
    source: "local" | "server",
): Promise<void> {
    for (const [attribute, value] of Object.entries(attributes)) {
        await db.execute(
            `INSERT INTO enrollment_attributes
                (enrollment, attribute, value, source)
             VALUES (?, ?, ?, ?)`,
            [
                enrollment,
                attribute,
                value == null ? null : String(value),
                source,
            ],
        );
    }
}
