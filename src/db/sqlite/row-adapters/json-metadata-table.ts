import type { RowAdapter } from "@/db/sqlite/row-adapter";

/** JSON metadata table adapter for either one or multiple key columns. */
export function createJsonMetadataTableRowAdapter<T extends object>(
    tableName: string,
    keyColumns: readonly string[],
    getKeys: (row: T) => string[],
    parseKey: (key: string) => string[],
): RowAdapter<T, string> {
    const where = keyColumns.map((column) => `${column} = ?`).join(" AND ");
    const insertColumns = [...keyColumns, "data"].join(", ");
    const placeholders = keyColumns.map(() => "?").concat("?").join(", ");
    return {
        rowVersion: () => "",
        loadAll: async (db) => {
            const result = await db.execute<{ data: string }>(`SELECT data FROM ${tableName}`);
            return result.rows.map((row) => JSON.parse(row.data) as T);
        },
        insertRow: async (db, row) => {
            await db.execute(
                `INSERT INTO ${tableName} (${insertColumns}) VALUES (${placeholders})`,
                [...getKeys(row), JSON.stringify(row)],
            );
        },
        updateRow: async (db, row) => {
            await db.execute(
                `UPDATE ${tableName} SET data = ? WHERE ${where}`,
                [JSON.stringify(row), ...getKeys(row)],
            );
        },
        deleteRow: async (db, key) => {
            await db.execute(`DELETE FROM ${tableName} WHERE ${where}`, parseKey(key));
        },
    };
}
