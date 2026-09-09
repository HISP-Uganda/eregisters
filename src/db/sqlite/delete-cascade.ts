import type { SqlDriver } from "./driver-types";

/**
 * Single-transaction cascading deletes, per ticket "How Does
 * src/machines/sync.ts's Pull/Push Logic Get Restructured for the New
 * SQLite Adapter?" decision #6: today's Dexie code (`syncDeleteToLocal`,
 * `src/machines/sync.ts:472-509`) loops record-by-record with individually
 * awaited promises, including nested loops for cascading enrollment/event
 * deletes. The schema's real `REFERENCES` foreign keys (ticket "Normalized
 * SQLite Schema for Tracker Collections") make it possible to know exactly
 * which child tables to clean up here — but they are NOT declared
 * `ON DELETE CASCADE`, so each function below still issues its own explicit
 * ordered `DELETE`s; wrapping them in one transaction (rather than SQLite
 * doing the cascade automatically) is what makes this both faster and
 * safer than a loop that could partially complete.
 */

export async function deleteTrackedEntityCascade(
    db: SqlDriver,
    trackedEntityId: string,
): Promise<void> {
    await db.transaction(async (tx) => {
        await tx.execute(
            `DELETE FROM event_data_values WHERE event IN
                (SELECT event FROM events WHERE tracked_entity = ?)`,
            [trackedEntityId],
        );
        await tx.execute(
            `DELETE FROM indicator_evaluations WHERE event_id IN
                (SELECT event FROM events WHERE tracked_entity = ?)`,
            [trackedEntityId],
        );
        await tx.execute("DELETE FROM events WHERE tracked_entity = ?", [
            trackedEntityId,
        ]);
        await tx.execute(
            `DELETE FROM enrollment_attributes WHERE enrollment IN
                (SELECT enrollment FROM enrollments WHERE tracked_entity = ?)`,
            [trackedEntityId],
        );
        await tx.execute("DELETE FROM enrollments WHERE tracked_entity = ?", [
            trackedEntityId,
        ]);
        await tx.execute(
            "DELETE FROM tracked_entity_attributes WHERE tracked_entity = ?",
            [trackedEntityId],
        );
        await tx.execute(
            "DELETE FROM tracked_entities WHERE tracked_entity = ?",
            [trackedEntityId],
        );
    });
}

export async function deleteEnrollmentCascade(
    db: SqlDriver,
    enrollmentId: string,
): Promise<void> {
    await db.transaction(async (tx) => {
        await tx.execute(
            `DELETE FROM event_data_values WHERE event IN
                (SELECT event FROM events WHERE enrollment = ?)`,
            [enrollmentId],
        );
        await tx.execute(
            `DELETE FROM indicator_evaluations WHERE event_id IN
                (SELECT event FROM events WHERE enrollment = ?)`,
            [enrollmentId],
        );
        await tx.execute("DELETE FROM events WHERE enrollment = ?", [
            enrollmentId,
        ]);
        await tx.execute(
            "DELETE FROM enrollment_attributes WHERE enrollment = ?",
            [enrollmentId],
        );
        await tx.execute("DELETE FROM enrollments WHERE enrollment = ?", [
            enrollmentId,
        ]);
    });
}

export async function deleteEventCascade(
    db: SqlDriver,
    eventId: string,
): Promise<void> {
    await db.transaction(async (tx) => {
        await tx.execute("DELETE FROM event_data_values WHERE event = ?", [
            eventId,
        ]);
        await tx.execute(
            "DELETE FROM indicator_evaluations WHERE event_id = ?",
            [eventId],
        );
        await tx.execute("DELETE FROM events WHERE event = ?", [eventId]);
    });
}
