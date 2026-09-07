import { DatabaseSync } from "node:sqlite";
import type { SqlDriver, SqlExecuteResult } from "../driver-types";

/**
 * Test-only SqlDriver backed by Node's built-in node:sqlite (real, in-process
 * SQL execution — not a mock). Production code uses op-sqlite's web/OPFS
 * backend (op-sqlite-driver.ts); this exists purely so schema/query/merge
 * logic can be exercised fast, synchronously, with zero new dependencies,
 * under Vitest's existing `environment: "node"` (wayfinder ticket "Testing
 * Strategy for OPFS/SQLite in CI and Pre-deploy QA").
 */
export function createNodeSqliteDriver(location: string = ":memory:"): {
    driver: SqlDriver;
    close: () => void;
} {
    const db = new DatabaseSync(location);

    function wrap(handle: DatabaseSync): SqlDriver {
        return {
            execute: async <TRow = Record<string, unknown>>(
                sql: string,
                params: ReadonlyArray<unknown> = [],
            ): Promise<SqlExecuteResult<TRow>> => {
                const trimmed = sql.trim().toUpperCase();
                const isSelect =
                    trimmed.startsWith("SELECT") ||
                    trimmed.startsWith("PRAGMA");
                const stmt = handle.prepare(sql);
                if (isSelect) {
                    const rows = stmt.all(
                        ...(params as unknown[]),
                    ) as TRow[];
                    return { rows, rowsAffected: 0 };
                }
                const result = stmt.run(...(params as unknown[]));
                return {
                    rows: [],
                    rowsAffected: Number(result.changes),
                    insertId:
                        result.lastInsertRowid !== undefined
                            ? Number(result.lastInsertRowid)
                            : undefined,
                };
            },
            transaction: async <T>(
                fn: (tx: SqlDriver) => Promise<T>,
            ): Promise<T> => {
                handle.exec("BEGIN");
                try {
                    const result = await fn(wrap(handle));
                    handle.exec("COMMIT");
                    return result;
                } catch (error) {
                    handle.exec("ROLLBACK");
                    throw error;
                }
            },
        };
    }

    return { driver: wrap(db), close: () => db.close() };
}
