import type { RowAdapter } from "../row-adapter";

const KEY_SEPARATOR = "::";

/**
 * Generic row adapter for the two metadata tables with a composite primary
 * key — `option_sets` (id, option_set) and `option_groups` (id,
 * option_group) — preserved from Dexie's original `[id+optionSet]`/
 * `[id+optionGroup]` composite index because a single option's `id` is not
 * guaranteed unique across different option sets/groups (ticket "SQLite
 * Schema for MOHRegisterDB Metadata Tables").
 *
 * `createMetadataTableRowAdapter` doesn't fit these two tables (its
 * single-`id`-column shape), so the collection-level key is synthesized as
 * `${firstKeyValue}::${secondKeyValue}` and split back apart for deletes.
 */
export function createCompositeKeyMetadataTableRowAdapter<T extends object>(
    tableName: string,
    firstKeyColumn: string,
    secondKeyColumn: string,
    getFirstKey: (row: T) => string,
    getSecondKey: (row: T) => string,
): RowAdapter<T, string> {
    return {
        rowVersion: () => "",

        loadAll: async (db) => {
            const result = await db.execute<{ data: string }>(
                `SELECT data FROM ${tableName}`,
            );
            return result.rows.map((r) => JSON.parse(r.data) as T);
        },

        insertRow: async (db, row) => {
            await db.execute(
                `INSERT INTO ${tableName} (${firstKeyColumn}, ${secondKeyColumn}, data) VALUES (?, ?, ?)`,
                [getFirstKey(row), getSecondKey(row), JSON.stringify(row)],
            );
        },

        updateRow: async (db, row) => {
            await db.execute(
                `UPDATE ${tableName} SET data = ? WHERE ${firstKeyColumn} = ? AND ${secondKeyColumn} = ?`,
                [JSON.stringify(row), getFirstKey(row), getSecondKey(row)],
            );
        },

        deleteRow: async (db, key) => {
            const [firstKey, secondKey] = key.split(KEY_SEPARATOR);
            await db.execute(
                `DELETE FROM ${tableName} WHERE ${firstKeyColumn} = ? AND ${secondKeyColumn} = ?`,
                [firstKey, secondKey],
            );
        },
    };
}

export function compositeKey(firstKey: string, secondKey: string): string {
    return `${firstKey}${KEY_SEPARATOR}${secondKey}`;
}
