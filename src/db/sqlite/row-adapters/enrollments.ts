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

export const enrollmentsRowAdapter: RowAdapter<FlattenedEnrollment, string> = {
    rowVersion: (row) => row.updatedAt,

    loadAll: async (db) => {
        const [parents, attributeRows, usersByUid] = await Promise.all([
            db.execute<EnrollmentParentRow>(
                `SELECT enrollment, tracked_entity, program, org_unit, status,
                        enrolled_at, occurred_at, created_at, updated_at,
                        created_by_uid, updated_by_uid, follow_up, deleted,
                        notes, last_synced, sync_error, version, sync_status
                 FROM enrollments`,
            ),
            db.execute<AttributeRow>(
                `SELECT enrollment, attribute, value FROM enrollment_attributes`,
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

    insertRow: async (db, row) => {
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
            await insertAttributes(tx, row.enrollment, row.attributes);
        });
    },

    updateRow: async (db, row) => {
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
            await insertAttributes(tx, row.enrollment, row.attributes);
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

// See tracked-entities.ts's equivalent note: source='local' is a
// schema+adapter-only-scope simplification, revisited when sync.ts
// integration (a separate, deferred wayfinder ticket) lands.
async function insertAttributes(
    db: SqlDriver,
    enrollment: string,
    attributes: Record<string, unknown>,
): Promise<void> {
    for (const [attribute, value] of Object.entries(attributes)) {
        await db.execute(
            `INSERT INTO enrollment_attributes
                (enrollment, attribute, value, source)
             VALUES (?, ?, ?, 'local')`,
            [enrollment, attribute, value == null ? null : String(value)],
        );
    }
}
