import type { SqlDriver } from "./driver-types";
import { UNIFORM_METADATA_TABLES } from "./schema";

/**
 * Drops every table this app's SQLite/OPFS database creates — the SQL-side
 * mirror of `dexie-migration-source.ts`'s `dropAll()` (`Dexie.delete(name)`
 * per database), used after a successful SQLite→Dexie switch (wayfinder
 * ticket "Reverse migration design: SQLite -> Dexie", decision 6:
 * destructive on success).
 *
 * `DROP TABLE` rather than deleting the underlying OPFS file directly —
 * portable (works identically under the real op-sqlite/OPFS driver and the
 * `node:sqlite` test driver), and achieves the goal that actually matters
 * (this device's local SQL data is gone) without reaching into OPFS-
 * specific file APIs. `migration_status` is included deliberately: a
 * device that later switches back to SQLite should re-run the Dexie→SQLite
 * migration fresh from whatever Dexie holds at that point (ticket 003's
 * "always re-copy fresh, never trust stale retained data" reasoning) —
 * dropping the flag alongside everything else is what makes that happen;
 * `initSqlDriver`'s `createSchema` recreates all tables (`CREATE TABLE IF
 * NOT EXISTS`) empty on next use regardless.
 */
// Child tables before the parents they reference (SQLite enforces FK
// constraints on DROP TABLE, same as any other statement) —
// event_data_values -> events -> enrollments -> tracked_entities -> users,
// with enrollment_attributes/tracked_entity_attributes as their own leaf
// children. See schema.ts's REFERENCES clauses for the full graph.
const TRACKER_TABLES = [
    "event_data_values",
    "enrollment_attributes",
    "tracked_entity_attributes",
    "rule_results",
    "events",
    "enrollments",
    "tracked_entities",
    "users",
] as const;

const SPECIAL_SHAPE_METADATA_TABLES = [
    "option_sets",
    "option_groups",
    "organisation_units",
    "indicator_evaluations",
] as const;

export async function dropAllSqliteData(db: SqlDriver): Promise<void> {
    const tables = [
        ...TRACKER_TABLES,
        ...UNIFORM_METADATA_TABLES,
        ...SPECIAL_SHAPE_METADATA_TABLES,
    ];
    await db.transaction(async (tx) => {
        for (const table of tables) {
            await tx.execute(`DROP TABLE IF EXISTS ${table}`);
        }
    });
}
