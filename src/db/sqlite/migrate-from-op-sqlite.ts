import { getConfigRow, putConfigRow } from "./config-rows";
import type { SqlDriver } from "./driver-types";
import { dropAllSqliteData } from "./drop-all-data";
import { publishMigrationProgress } from "./migration-progress";
import { UNIFORM_METADATA_TABLES } from "./schema";

/**
 * One-time copy of a device's existing op-sqlite data into a fresh
 * wa-sqlite-backed database, per wayfinder ticket "Design the op-sqlite
 * -> wa-sqlite migration procedure"
 * (`docs/wayfinder/wa-sqlite-multi-tab/tickets/002-migration-procedure-design.md`)
 * — mirrors `migrate-from-dexie.ts`/`migrate-from-sqlite.ts` exactly, with
 * no divergence, per that ticket's resolution.
 *
 * Unlike those two migrations, source and destination here speak the
 * EXACT SAME schema (op-sqlite and wa-sqlite are just two different
 * `SqlDriver` implementations over the identical relational SQL schema,
 * `schema.ts`) — so this copies generically, table by table, `SELECT *`
 * then a column-agnostic `INSERT`, rather than reconstructing
 * `Flattened*` domain objects the way the Dexie-facing migrations must.
 */

const MIGRATION_STATUS_TABLE = "migration_status";
const MIGRATION_STATUS_ID = "wa-sqlite-migration";

type MigrationStatusRow = { id: string; completedAt: string };

// Child tables before the parents they reference on delete (cleanup after
// a failed copy); reversed for insert order (parents before children, so
// FK constraints on INSERT are satisfied) — same table set and ordering
// `drop-all-data.ts`'s `TRACKER_TABLES` already established.
const TRACKER_TABLES_CHILD_FIRST = [
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

const ALL_TABLES_CHILD_FIRST: readonly string[] = [
    ...TRACKER_TABLES_CHILD_FIRST,
    ...UNIFORM_METADATA_TABLES,
    ...SPECIAL_SHAPE_METADATA_TABLES,
];
const ALL_TABLES_PARENT_FIRST: readonly string[] = [
    ...ALL_TABLES_CHILD_FIRST,
].reverse();

async function countRows(db: SqlDriver, table: string): Promise<number> {
    const result = await db.execute<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${table}`,
    );
    return result.rows[0]?.count ?? 0;
}

async function hasAnyOpSqliteData(source: SqlDriver): Promise<boolean> {
    for (const table of ALL_TABLES_PARENT_FIRST) {
        if ((await countRows(source, table)) > 0) return true;
    }
    return false;
}

/** Copies every row of one table, column-agnostically, in a single
 * destination transaction. Returns the row count copied. */
async function copyTable(
    source: SqlDriver,
    dest: SqlDriver,
    table: string,
): Promise<number> {
    const { rows } = await source.execute<Record<string, unknown>>(
        `SELECT * FROM ${table}`,
    );
    if (rows.length === 0) return 0;
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => "?").join(", ");
    await dest.transaction(async (tx) => {
        for (const row of rows) {
            await tx.execute(
                `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
                columns.map((column) => row[column]),
            );
        }
    });
    return rows.length;
}

/** Deletes every row this migration may have already written to `dest`,
 * child tables first — used to leave `dest` empty for a clean retry after
 * a failed copy (mirrors both existing migrations' "restart from scratch
 * next boot" decision, no partial-resume logic). */
async function cleanUpPartialWrite(dest: SqlDriver): Promise<void> {
    await dest.transaction(async (tx) => {
        for (const table of ALL_TABLES_CHILD_FIRST) {
            await tx.execute(`DELETE FROM ${table}`);
        }
    });
}

export async function runWaSqliteMigrationIfNeeded(
    source: SqlDriver,
    dest: SqlDriver,
): Promise<void> {
    const existing = await getConfigRow<MigrationStatusRow>(
        dest,
        MIGRATION_STATUS_TABLE,
        MIGRATION_STATUS_ID,
    );
    if (existing) {
        publishMigrationProgress({ phase: "done" });
        return;
    }

    publishMigrationProgress({ phase: "checking" });
    if (!(await hasAnyOpSqliteData(source))) {
        // Fresh install, or a device that never actually initialized
        // op-sqlite — nothing to copy, don't scan for it again next boot.
        await putConfigRow<MigrationStatusRow>(dest, MIGRATION_STATUS_TABLE, {
            id: MIGRATION_STATUS_ID,
            completedAt: new Date().toISOString(),
        });
        publishMigrationProgress({ phase: "done" });
        return;
    }

    try {
        for (const table of ALL_TABLES_PARENT_FIRST) {
            const copied = await copyTable(source, dest, table);
            publishMigrationProgress({
                phase: "copying",
                table,
                copied,
                total: copied,
            });
        }

        publishMigrationProgress({ phase: "verifying" });
        for (const table of ALL_TABLES_PARENT_FIRST) {
            const [sourceCount, destCount] = await Promise.all([
                countRows(source, table),
                countRows(dest, table),
            ]);
            if (sourceCount !== destCount) {
                throw new Error(
                    `Migration verification failed for "${table}": expected ${sourceCount}, found ${destCount}`,
                );
            }
        }

        await putConfigRow<MigrationStatusRow>(dest, MIGRATION_STATUS_TABLE, {
            id: MIGRATION_STATUS_ID,
            completedAt: new Date().toISOString(),
        });
        // Drop immediately on success (wayfinder ticket 002's decision) —
        // op-sqlite has no real production data at stake yet, so this
        // carries the same risk profile the original Dexie->SQLite
        // migration took, not a harder one.
        await dropAllSqliteData(source);
        publishMigrationProgress({ phase: "done" });
    } catch (error) {
        await cleanUpPartialWrite(dest);
        publishMigrationProgress({
            phase: "failed",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
