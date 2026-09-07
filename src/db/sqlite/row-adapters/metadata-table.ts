import type { RowAdapter } from "../row-adapter";

/**
 * Generic row adapter for the 13 metadata tables sharing the uniform
 * `id TEXT PRIMARY KEY, data TEXT` shape (ticket "SQLite Schema for
 * MOHRegisterDB Metadata Tables" — confirmed whole-table-only access with
 * no secondary-field filtering anywhere in the app). One factory call per
 * table (programs, data_elements, ..., hmis_drafts — see
 * UNIFORM_METADATA_TABLES in ../schema.ts) rather than 13 hand-written
 * near-identical adapters.
 *
 * `getId` extracts the row's own id from its serialized shape (every
 * resource type already carries its own `id` field, per src/schemas.ts) —
 * the `id` column and the JSON blob's own id are kept in sync by
 * `insertRow`/`updateRow`.
 */
export function createMetadataTableRowAdapter<T extends object>(
    tableName: string,
    getId: (row: T) => string,
): RowAdapter<T, string> {
    return {
        // No natural version/timestamp field exists across arbitrary
        // metadata shapes — constant version relies entirely on the
        // collection adapter's content-equality fallback, same as
        // rule-results.ts.
        rowVersion: () => "",

        loadAll: async (db) => {
            const result = await db.execute<{ data: string }>(
                `SELECT data FROM ${tableName}`,
            );
            return result.rows.map((r) => JSON.parse(r.data) as T);
        },

        insertRow: async (db, row) => {
            await db.execute(
                `INSERT INTO ${tableName} (id, data) VALUES (?, ?)`,
                [getId(row), JSON.stringify(row)],
            );
        },

        updateRow: async (db, row) => {
            await db.execute(
                `UPDATE ${tableName} SET data = ? WHERE id = ?`,
                [JSON.stringify(row), getId(row)],
            );
        },

        deleteRow: async (db, key) => {
            await db.execute(`DELETE FROM ${tableName} WHERE id = ?`, [key]);
        },
    };
}
