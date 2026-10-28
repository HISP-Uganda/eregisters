import type { SqlDriver } from "./driver-types";

/** Just what the clients screen needs from a visit, without its data values. */
export interface VisitSummary {
    trackedEntity: string;
    occurredAt: string;
    createdAt: string;
    createdAtClient?: string;
}

/**
 * Every live (not draft, not deleted) event on `programStage` of a live
 * client registered at `orgUnit`, read straight from SQLite: a few columns
 * per visit, so the stats cards and Last Visit needn't wait for the client
 * and events collections to load every record in full.
 */
export async function readVisitSummaries(
    db: SqlDriver,
    programStage: string,
    orgUnit: string,
): Promise<VisitSummary[]> {
    const { rows } = await db.execute<{
        tracked_entity: string;
        occurred_at: string;
        created_at: string;
        created_at_client: string | null;
    }>(
        `SELECT e.tracked_entity, e.occurred_at, e.created_at, e.created_at_client
         FROM events e JOIN tracked_entities t ON t.tracked_entity = e.tracked_entity
         WHERE e.program_stage = ? AND e.sync_status NOT IN ('draft', 'deleted')
           AND t.org_unit = ? AND t.sync_status NOT IN ('draft', 'deleted')`,
        [programStage, orgUnit],
    );
    return rows.map((row) => ({
        trackedEntity: row.tracked_entity,
        occurredAt: row.occurred_at,
        createdAt: row.created_at,
        createdAtClient: row.created_at_client ?? undefined,
    }));
}
