import Dexie from "dexie";

/**
 * Dexie-native row-count check, for the reverse migration's post-write
 * verification — per wayfinder ticket "Reverse migration design: SQLite ->
 * Dexie" decision 4: "Dexie-native (count/read back the ids just
 * written), not an extension to the shared `.utils` interface" (matching
 * how the forward direction's own verification, `countMatchingIds` in
 * `migrate-from-dexie.ts`, is also raw-SQL-specific rather than routed
 * through `.utils`).
 *
 * Opens the database WITHOUT declaring `.version().stores()` — same
 * technique as `../sqlite/dexie-migration-source.ts`'s `readAllRows`, so
 * this never needs to know (or duplicate) the exact index string
 * `tanstack-dexie-db-collection` set up internally for the collection's
 * table. Only ever called right after this migration itself wrote to the
 * database, so the database is guaranteed to already exist.
 */
export async function countDexieRowsByIds(
    dbName: string,
    tableName: string,
    ids: string[],
): Promise<number> {
    if (ids.length === 0) return 0;
    const handle = new Dexie(dbName);
    try {
        await handle.open();
        // "id" is not this repo's assumption — `dexieCollectionOptions`
        // (tanstack-dexie-db-collection) always physically stores the row
        // under an `id` field it injects itself (`{...serialized, id: key}`
        // in its `insertLocally`/`bulkInsertLocally`), regardless of the
        // collection's own logical key field (`trackedEntity`/`enrollment`/
        // `event`). Every collection built via `dexieTrackerCollectionOptions`
        // (`./dexie-collection-adapter.ts`) shares this fixed physical shape.
        return await handle
            .table<unknown, string>(tableName)
            .where("id")
            .anyOf(ids)
            .count();
    } finally {
        handle.close();
    }
}

/**
 * Every stored row id of one tracker table — same schema-less open as
 * `countDexieRowsByIds`. Empty when the database doesn't exist (never
 * creates it).
 */
export async function listDexieIds(
    dbName: string,
    tableName: string,
): Promise<string[]> {
    if (!(await Dexie.exists(dbName))) return [];
    const handle = new Dexie(dbName);
    try {
        await handle.open();
        if (!handle.tables.some((table) => table.name === tableName)) return [];
        return (await handle
            .table<unknown, string>(tableName)
            .toCollection()
            .primaryKeys()) as string[];
    } finally {
        handle.close();
    }
}

/** Total keys of one nested record field across the given rows — schema-less open, as above. */
export async function sumDexieNestedKeys(
    dbName: string,
    tableName: string,
    ids: string[],
    field: string,
): Promise<number> {
    if (ids.length === 0) return 0;
    const handle = new Dexie(dbName);
    try {
        await handle.open();
        const rows = await handle
            .table<Record<string, unknown>, string>(tableName)
            .where("id")
            .anyOf(ids)
            .toArray();
        let total = 0;
        for (const row of rows) {
            const nested = row[field];
            if (nested && typeof nested === "object") {
                total += Object.keys(nested).length;
            }
        }
        return total;
    } finally {
        handle.close();
    }
}
