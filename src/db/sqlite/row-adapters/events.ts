import type { FlattenedEvent } from "@/schemas";
import type { RowAdapter } from "@/db/sqlite/row-adapter";
import type { SqlDriver } from "@/db/sqlite/driver-types";
import { makeRelatedRowsLoader, relatedRowReads, sqlIn, toBool, toInt } from "./load-related-rows";
import { type SqlUser } from "./users";
import { writeRelatedRow } from "./write-related-row";

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
    scheduled_at: string | null;
    rule_action_key: string | null;
    created_at_client: string | null;
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

const PARENT_COLUMNS = `event, status, program, program_stage, enrollment,
                    tracked_entity, org_unit, parent_event, occurred_at, scheduled_at, rule_action_key,
                    created_at_client, follow_up, deleted, created_at, updated_at,
                    attribute_option_combo, attribute_category_options,
                    completed_by, completed_at, created_by_uid,
                    updated_by_uid, notes, last_synced, sync_error,
                    version, sync_status`;
const DATA_VALUE_COLUMNS = `event, data_element, value, stored_by,
                    provided_elsewhere, created_at, updated_at,
                    created_by_uid, updated_by_uid`;

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
        scheduledAt: parent.scheduled_at ?? undefined,
        ruleActionKey: parent.rule_action_key ?? undefined,
        createdAtClient: parent.created_at_client ?? undefined,
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

const loadRows = makeRelatedRowsLoader<EventParentRow, DataValueRow, FlattenedEvent>({
    parentTable: "events",
    parentColumns: PARENT_COLUMNS,
    childTable: "event_data_values",
    childColumns: DATA_VALUE_COLUMNS,
    parentKey: (parent) => parent.event,
    childKey: (child) => child.event,
    reassemble,
});

/** See tracked-entities.ts's getTrackedEntityById for the rationale. */
export async function getEventById(
    db: SqlDriver,
    event: string,
): Promise<FlattenedEvent | undefined> {
    return (await loadRows(db, { clause: "event = ?", params: [event], scopeChildren: true }))[0];
}

async function loadMany(
    db: SqlDriver,
    whereClause: string,
    params: ReadonlyArray<unknown>,
): Promise<FlattenedEvent[]> {
    return loadRows(db, { clause: whereClause, params });
}

/** Backs the recursive delete walk's "events under this enrollment" lookup. */
export function findEventsByEnrollment(
    db: SqlDriver,
    enrollment: string,
): Promise<FlattenedEvent[]> {
    return loadMany(db, "enrollment = ?", [enrollment]);
}

/** Backs the recursive delete walk's "child events of this event" lookup. */
export function findEventsByParentEvent(
    db: SqlDriver,
    parentEvent: string,
): Promise<FlattenedEvent[]> {
    return loadMany(db, "parent_event = ?", [parentEvent]);
}

/** Backs the recursive delete walk's "events under this TE" lookup. */
export function findEventsByTrackedEntity(
    db: SqlDriver,
    trackedEntity: string,
): Promise<FlattenedEvent[]> {
    return loadMany(db, "tracked_entity = ?", [trackedEntity]);
}

/** Backs `tracked-entity.tsx`'s save-cascade query (multiple child TEs at once). */
export function findEventsByTrackedEntityIn(
    db: SqlDriver,
    trackedEntityIds: ReadonlyArray<string>,
): Promise<FlattenedEvent[]> {
    if (trackedEntityIds.length === 0) return Promise.resolve([]);
    return loadMany(db, sqlIn("tracked_entity", trackedEntityIds), trackedEntityIds);
}

/** Backs sync.ts's pending/failed/deleted scans (`processBatchSync`). */
export function findEventsBySyncStatusIn(
    db: SqlDriver,
    statuses: ReadonlyArray<string>,
): Promise<FlattenedEvent[]> {
    return loadMany(db, sqlIn("sync_status", statuses), statuses);
}

function parentValues(row: FlattenedEvent): unknown[] {
    return [
        row.status, row.program, row.programStage, row.enrollment,
        row.trackedEntity, row.orgUnit, row.parentEvent ?? null,
        row.occurredAt, row.scheduledAt ?? null, row.ruleActionKey ?? null,
        row.createdAtClient ?? null, toInt(row.followUp), toInt(row.deleted), row.createdAt, row.updatedAt,
        row.attributeOptionCombo ?? null, row.attributeCategoryOptions ?? null,
        row.completedBy ?? null, row.completedAt ?? null,
        row.createdBy?.uid ?? null, row.updatedBy?.uid ?? null,
        row.notes ? JSON.stringify(row.notes) : null,
        row.lastSynced, row.syncError ?? null, row.version, row.syncStatus,
    ];
}

export const eventsRowAdapter: RowAdapter<FlattenedEvent, string> = {
    ...relatedRowReads(loadRows, "event"),

    insertRow: (db, row, options) =>
        writeRelatedRow(db, row,
            `INSERT INTO events (
                    event, status, program, program_stage, enrollment,
                    tracked_entity, org_unit, parent_event, occurred_at, scheduled_at, rule_action_key,
                    created_at_client, follow_up, deleted, created_at, updated_at,
                    attribute_option_combo, attribute_category_options,
                    completed_by, completed_at, created_by_uid,
                    updated_by_uid, notes, last_synced, sync_error, version,
                    sync_status
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [row.event, ...parentValues(row)],
            (tx) => insertDataValues(tx, row.event, row.dataValues, options?.source ?? "local"),
        ),

    updateRow: (db, row, options) =>
        writeRelatedRow(db, row,
            `UPDATE events SET
                    status = ?, program = ?, program_stage = ?, enrollment = ?,
                    tracked_entity = ?, org_unit = ?, parent_event = ?,
                    occurred_at = ?, scheduled_at = ?, rule_action_key = ?, created_at_client = ?,
                    follow_up = ?, deleted = ?,
                    created_at = ?, updated_at = ?, attribute_option_combo = ?,
                    attribute_category_options = ?, completed_by = ?,
                    completed_at = ?, created_by_uid = ?, updated_by_uid = ?,
                    notes = ?, last_synced = ?, sync_error = ?, version = ?,
                    sync_status = ?
                WHERE event = ?`,
            [...parentValues(row), row.event],
            async (tx) => {
                await tx.execute("DELETE FROM event_data_values WHERE event = ?", [row.event]);
                await insertDataValues(tx, row.event, row.dataValues, options?.source ?? "local");
            },
        ),

    deleteRow: async (db, key) => {
        await db.transaction(async (tx) => {
            await tx.execute("DELETE FROM event_data_values WHERE event = ?", [
                key,
            ]);
            // indicator_evaluations is a separate computed-cache table
            // (Dexie's equivalent: db.indicatorEvaluations.where("eventId")
            // .equals(id).delete()) keyed 1:1 to an event — deleting it here,
            // uniformly for every event deletion path (not just the bulk
            // cascade functions in delete-cascade.ts), means callers never
            // need to remember it as a separate step.
            await tx.execute(
                "DELETE FROM indicator_evaluations WHERE event_id = ?",
                [key],
            );
            await tx.execute("DELETE FROM events WHERE event = ?", [key]);
        });
    },
};

// Defaults to 'local'; the future sync.ts pull path can pass 'server'
// explicitly via utils.bulkInsertLocally's options parameter. Per-value
// audit metadata (createdBy/updatedBy/storedBy/providedElsewhere) still
// isn't passed through since FlattenedEvent's dataValues record doesn't
// carry them yet — the columns exist and are ready for whichever effort
// wires up per-value audit fields at the app level.
async function insertDataValues(
    db: SqlDriver,
    event: string,
    dataValues: Record<string, unknown>,
    source: "local" | "server",
): Promise<void> {
    const entries = Object.entries(dataValues);
    if (entries.length === 0) return;
    // Single multi-row INSERT instead of N serial round-trips — each
    // execute() is a postMessage round-trip to the wa-sqlite Worker, so
    // saving an event with many data elements one row at a time was a
    // real, visible chunk of "why is a local-only save slow".
    const placeholders = entries.map(() => "(?, ?, ?, ?)").join(", ");
    const params = entries.flatMap(([dataElement, value]) => [
        event,
        dataElement,
        value == null ? null : String(value),
        source,
    ]);
    await db.execute(
        `INSERT INTO event_data_values (event, data_element, value, source) VALUES ${placeholders}`,
        params,
    );
}
