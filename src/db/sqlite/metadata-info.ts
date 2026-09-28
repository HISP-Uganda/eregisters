import type { SqlDriver } from "./driver-types";

/**
 * Generic row reads for the uniform "id + data" metadata tables. The
 * SQLite-only `checkMetadataInfo` / `queryMetadataInfo` that used to live
 * here were superseded by the backend-neutral versions in
 * `src/db/metadata-operations.ts` and removed (fallow reported their
 * result types as duplicate exports).
 */

export async function getRowById<T extends object>(
    db: SqlDriver,
    tableName: string,
    id: string,
): Promise<T | undefined> {
    const result = await db.execute<{ data: string }>(
        `SELECT data FROM ${tableName} WHERE id = ?`,
        [id],
    );
    return result.rows[0] ? (JSON.parse(result.rows[0].data) as T) : undefined;
}

/** Same "id + data" shape as `getRowById`, for every row instead of one. */
export async function getAllRows<T extends object>(
    db: SqlDriver,
    tableName: string,
): Promise<T[]> {
    const result = await db.execute<{ data: string }>(
        `SELECT data FROM ${tableName}`,
    );
    return result.rows.map((row) => JSON.parse(row.data) as T);
}
