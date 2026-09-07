import type { SqlDriver } from "./driver-types";

/**
 * Post-push status write-back, per ticket "How Does src/machines/sync.ts's
 * Pull/Push Logic Get Restructured for the New SQLite Adapter?" decision #5:
 * today's Dexie code (`syncReportToLocal`, `src/machines/sync.ts:368-370`)
 * writes trackedEntities/enrollments/events status updates as 3 SEPARATE
 * transactions — an interruption mid-way could leave inconsistent state
 * (e.g. TEs marked synced but their events still pending). This combines
 * all three into ONE transaction, atomic all-or-nothing.
 */
export type PushResultUpdate = {
    key: string;
    syncStatus: "synced" | "failed";
    syncError: string | null;
};

export type PushResults = {
    trackedEntities: PushResultUpdate[];
    enrollments: PushResultUpdate[];
    events: PushResultUpdate[];
};

async function applyUpdates(
    db: SqlDriver,
    table: string,
    keyColumn: string,
    updates: PushResultUpdate[],
): Promise<void> {
    for (const update of updates) {
        await db.execute(
            `UPDATE ${table} SET sync_status = ?, sync_error = ? WHERE ${keyColumn} = ?`,
            [update.syncStatus, update.syncError, update.key],
        );
    }
}

export async function applyPushResults(
    db: SqlDriver,
    results: PushResults,
): Promise<void> {
    await db.transaction(async (tx) => {
        await applyUpdates(
            tx,
            "tracked_entities",
            "tracked_entity",
            results.trackedEntities,
        );
        await applyUpdates(tx, "enrollments", "enrollment", results.enrollments);
        await applyUpdates(tx, "events", "event", results.events);
    });
}
