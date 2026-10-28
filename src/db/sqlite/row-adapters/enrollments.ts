import type { FlattenedEnrollment } from "@/schemas";
import type { SqlDriver } from "@/db/sqlite/driver-types";
import type { RowAdapter } from "@/db/sqlite/row-adapter";
import { makeRelatedRowsLoader, relatedRowReads, sqlIn, toBool, toInt } from "./load-related-rows";
import { type SqlUser } from "./users";
import { writeRelatedRow } from "./write-related-row";

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

const loadRows = makeRelatedRowsLoader<EnrollmentParentRow, AttributeRow, FlattenedEnrollment>({
    parentTable: "enrollments",
    parentColumns: PARENT_COLUMNS,
    childTable: "enrollment_attributes",
    childColumns: ATTRIBUTE_COLUMNS,
    parentKey: (parent) => parent.enrollment,
    childKey: (child) => child.enrollment,
    reassemble,
});

/** See tracked-entities.ts's getTrackedEntityById for the rationale. */
export async function getEnrollmentById(
    db: SqlDriver,
    enrollment: string,
): Promise<FlattenedEnrollment | undefined> {
    return (await loadRows(db, { clause: "enrollment = ?", params: [enrollment], scopeChildren: true }))[0];
}

async function loadMany(
    db: SqlDriver,
    whereClause: string,
    params: ReadonlyArray<unknown>,
): Promise<FlattenedEnrollment[]> {
    return loadRows(db, { clause: whereClause, params });
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
    return loadMany(db, sqlIn("tracked_entity", trackedEntityIds), trackedEntityIds);
}

/** Backs sync.ts's pending/failed/deleted scans (`processBatchSync`). */
export function findEnrollmentsBySyncStatusIn(
    db: SqlDriver,
    statuses: ReadonlyArray<string>,
): Promise<FlattenedEnrollment[]> {
    return loadMany(db, sqlIn("sync_status", statuses), statuses);
}

function parentValues(row: FlattenedEnrollment): unknown[] {
    return [
        row.trackedEntity, row.program, row.orgUnit, row.status,
        row.enrolledAt, row.occurredAt ?? null, row.createdAt, row.updatedAt,
        row.createdBy?.uid ?? null, row.updatedBy?.uid ?? null,
        toInt(row.followUp), toInt(row.deleted),
        row.notes ? JSON.stringify(row.notes) : null,
        row.lastSynced, row.syncError ?? null, row.version, row.syncStatus,
    ];
}

export const enrollmentsRowAdapter: RowAdapter<FlattenedEnrollment, string> = {
    ...relatedRowReads(loadRows, "enrollment"),

    insertRow: (db, row, options) =>
        writeRelatedRow(db, row,
            `INSERT INTO enrollments (
                    enrollment, tracked_entity, program, org_unit, status,
                    enrolled_at, occurred_at, created_at, updated_at,
                    created_by_uid, updated_by_uid, follow_up, deleted,
                    notes, last_synced, sync_error, version, sync_status
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [row.enrollment, ...parentValues(row)],
            (tx) => insertAttributes(tx, row.enrollment, row.attributes, options?.source ?? "local"),
        ),

    updateRow: (db, row, options) =>
        writeRelatedRow(db, row,
            `UPDATE enrollments SET
                    tracked_entity = ?, program = ?, org_unit = ?, status = ?,
                    enrolled_at = ?, occurred_at = ?, created_at = ?,
                    updated_at = ?, created_by_uid = ?, updated_by_uid = ?,
                    follow_up = ?, deleted = ?, notes = ?, last_synced = ?,
                    sync_error = ?, version = ?, sync_status = ?
                 WHERE enrollment = ?`,
            [...parentValues(row), row.enrollment],
            async (tx) => {
                await tx.execute("DELETE FROM enrollment_attributes WHERE enrollment = ?", [row.enrollment]);
                await insertAttributes(tx, row.enrollment, row.attributes, options?.source ?? "local");
            },
        ),

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
