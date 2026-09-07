import type { FlattenedEvent } from "../../../schemas";
import type { SqlDriver } from "../driver-types";
import type { RowAdapter } from "../row-adapter";
import { loadUsersByUid, upsertUser, type SqlUser } from "./users";

type EventParentRow = {
    event: string;
    status: string;
    program: string;
    program_stage: string;
    enrollment: string;
    tracked_entity: string;
    org_unit: string;
    parent_event: string | null;
    occurred_at: string;
    follow_up: number;
    deleted: number;
    created_at: string;
    updated_at: string;
    attribute_option_combo: string | null;
    attribute_category_options: string | null;
    completed_by: string | null;
    completed_at: string | null;
    created_by_uid: string | null;
    updated_by_uid: string | null;
    notes: string | null;
    last_synced: string;
    sync_error: string | null;
    version: number;
    sync_status: string;
};

type DataValueRow = {
    event: string;
    data_element: string;
    value: string | null;
    stored_by: string | null;
    provided_elsewhere: number | null;
    created_at: string | null;
    updated_at: string | null;
    created_by_uid: string | null;
    updated_by_uid: string | null;
};

function toBool(n: number): boolean {
    return n === 1;
}
function toInt(b: boolean): number {
    return b ? 1 : 0;
}

// FlattenedEventSchema's `dataValues` is `z.record(z.string(), z.any())` —
// today's flatten silently drops each dataValue's own audit fields (ticket
// 003's resolution point 2). This adapter now CAN preserve them (the child
// table has the columns), but the flat application-level `FlattenedEvent`
// type doesn't have anywhere to carry them back out to yet — that's a
// follow-on to whichever effort actually surfaces per-value audit info in
// the UI. For now, loadAll reassembles just `value` into the record, same
// shape as today, while insertRow/updateRow already persist the full audit
// columns so no data is lost even though this app-level type doesn't expose
// it yet.
function reassemble(
    parent: EventParentRow,
    dataValues: DataValueRow[],
    usersByUid: Map<string, SqlUser>,
): FlattenedEvent {
    const dataValuesRecord: Record<string, unknown> = {};
    for (const dv of dataValues) {
        dataValuesRecord[dv.data_element] = dv.value;
    }
    return {
        event: parent.event,
        status: parent.status,
        program: parent.program,
        programStage: parent.program_stage,
        enrollment: parent.enrollment,
        trackedEntity: parent.tracked_entity,
        orgUnit: parent.org_unit,
        parentEvent: parent.parent_event ?? undefined,
        occurredAt: parent.occurred_at,
        followUp: toBool(parent.follow_up),
        deleted: toBool(parent.deleted),
        createdAt: parent.created_at,
        updatedAt: parent.updated_at,
        attributeOptionCombo: parent.attribute_option_combo ?? undefined,
        attributeCategoryOptions:
            parent.attribute_category_options ?? undefined,
        completedBy: parent.completed_by ?? undefined,
        completedAt: parent.completed_at ?? undefined,
        createdBy: parent.created_by_uid
            ? usersByUid.get(parent.created_by_uid)
            : undefined,
        updatedBy: parent.updated_by_uid
            ? usersByUid.get(parent.updated_by_uid)
            : undefined,
        notes: parent.notes ? JSON.parse(parent.notes) : undefined,
        lastSynced: parent.last_synced,
        syncError: parent.sync_error,
        version: parent.version,
        syncStatus: parent.sync_status as FlattenedEvent["syncStatus"],
        dataValues: dataValuesRecord,
    };
}

export const eventsRowAdapter: RowAdapter<FlattenedEvent, string> = {
    rowVersion: (row) => row.updatedAt,

    loadAll: async (db) => {
        const [parents, dataValueRows, usersByUid] = await Promise.all([
            db.execute<EventParentRow>(
                `SELECT event, status, program, program_stage, enrollment,
                        tracked_entity, org_unit, parent_event, occurred_at,
                        follow_up, deleted, created_at, updated_at,
                        attribute_option_combo, attribute_category_options,
                        completed_by, completed_at, created_by_uid,
                        updated_by_uid, notes, last_synced, sync_error,
                        version, sync_status
                 FROM events`,
            ),
            db.execute<DataValueRow>(
                `SELECT event, data_element, value, stored_by,
                        provided_elsewhere, created_at, updated_at,
                        created_by_uid, updated_by_uid
                 FROM event_data_values`,
            ),
            loadUsersByUid(db),
        ]);

        const dataValuesByEvent = new Map<string, DataValueRow[]>();
        for (const dv of dataValueRows.rows) {
            const bucket = dataValuesByEvent.get(dv.event) ?? [];
            bucket.push(dv);
            dataValuesByEvent.set(dv.event, bucket);
        }

        return parents.rows.map((parent) =>
            reassemble(
                parent,
                dataValuesByEvent.get(parent.event) ?? [],
                usersByUid,
            ),
        );
    },

    insertRow: async (db, row) => {
        await db.transaction(async (tx) => {
            await upsertUser(tx, row.createdBy);
            await upsertUser(tx, row.updatedBy);
            await tx.execute(
                `INSERT INTO events (
                    event, status, program, program_stage, enrollment,
                    tracked_entity, org_unit, parent_event, occurred_at,
                    follow_up, deleted, created_at, updated_at,
                    attribute_option_combo, attribute_category_options,
                    completed_by, completed_at, created_by_uid,
                    updated_by_uid, notes, last_synced, sync_error, version,
                    sync_status
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    row.event,
                    row.status,
                    row.program,
                    row.programStage,
                    row.enrollment,
                    row.trackedEntity,
                    row.orgUnit,
                    row.parentEvent ?? null,
                    row.occurredAt,
                    toInt(row.followUp),
                    toInt(row.deleted),
                    row.createdAt,
                    row.updatedAt,
                    row.attributeOptionCombo ?? null,
                    row.attributeCategoryOptions ?? null,
                    row.completedBy ?? null,
                    row.completedAt ?? null,
                    row.createdBy?.uid ?? null,
                    row.updatedBy?.uid ?? null,
                    row.notes ? JSON.stringify(row.notes) : null,
                    row.lastSynced,
                    row.syncError ?? null,
                    row.version,
                    row.syncStatus,
                ],
            );
            await insertDataValues(tx, row.event, row.dataValues);
        });
    },

    updateRow: async (db, row) => {
        await db.transaction(async (tx) => {
            await upsertUser(tx, row.createdBy);
            await upsertUser(tx, row.updatedBy);
            await tx.execute(
                `UPDATE events SET
                    status = ?, program = ?, program_stage = ?, enrollment = ?,
                    tracked_entity = ?, org_unit = ?, parent_event = ?,
                    occurred_at = ?, follow_up = ?, deleted = ?,
                    created_at = ?, updated_at = ?, attribute_option_combo = ?,
                    attribute_category_options = ?, completed_by = ?,
                    completed_at = ?, created_by_uid = ?, updated_by_uid = ?,
                    notes = ?, last_synced = ?, sync_error = ?, version = ?,
                    sync_status = ?
                 WHERE event = ?`,
                [
                    row.status,
                    row.program,
                    row.programStage,
                    row.enrollment,
                    row.trackedEntity,
                    row.orgUnit,
                    row.parentEvent ?? null,
                    row.occurredAt,
                    toInt(row.followUp),
                    toInt(row.deleted),
                    row.createdAt,
                    row.updatedAt,
                    row.attributeOptionCombo ?? null,
                    row.attributeCategoryOptions ?? null,
                    row.completedBy ?? null,
                    row.completedAt ?? null,
                    row.createdBy?.uid ?? null,
                    row.updatedBy?.uid ?? null,
                    row.notes ? JSON.stringify(row.notes) : null,
                    row.lastSynced,
                    row.syncError ?? null,
                    row.version,
                    row.syncStatus,
                    row.event,
                ],
            );
            await tx.execute(
                "DELETE FROM event_data_values WHERE event = ?",
                [row.event],
            );
            await insertDataValues(tx, row.event, row.dataValues);
        });
    },

    deleteRow: async (db, key) => {
        await db.transaction(async (tx) => {
            await tx.execute(
                "DELETE FROM event_data_values WHERE event = ?",
                [key],
            );
            await tx.execute("DELETE FROM events WHERE event = ?", [key]);
        });
    },
};

// See tracked-entities.ts's equivalent note: source='local' and no per-value
// audit metadata (createdBy/updatedBy/storedBy/providedElsewhere) is passed
// through here since FlattenedEvent's dataValues record doesn't carry them
// yet — the columns exist and are ready for whichever effort wires up
// per-value audit fields at the app level.
async function insertDataValues(
    db: SqlDriver,
    event: string,
    dataValues: Record<string, unknown>,
): Promise<void> {
    for (const [dataElement, value] of Object.entries(dataValues)) {
        await db.execute(
            `INSERT INTO event_data_values
                (event, data_element, value, source)
             VALUES (?, ?, ?, 'local')`,
            [event, dataElement, value == null ? null : String(value)],
        );
    }
}
