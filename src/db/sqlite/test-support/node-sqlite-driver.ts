import { DatabaseSync } from "node:sqlite";
import type { SqlDriver, SqlExecuteResult } from "../driver-types";

/**
 * Test-only SqlDriver backed by Node's built-in node:sqlite (real, in-process
 * SQL execution — not a mock). Production code uses wa-sqlite's OPFS
 * backend (wa-sqlite-driver.ts); this exists purely so schema/query/merge
 * logic can be exercised fast, synchronously, with zero new dependencies,
 * under Vitest's existing `environment: "node"` (wayfinder ticket "Testing
 * Strategy for OPFS/SQLite in CI and Pre-deploy QA").
 */
export function createNodeSqliteDriver(location: string = ":memory:"): {
    driver: SqlDriver;
    close: () => void;
} {
    const db = new DatabaseSync(location);

    function makeExecute(handle: DatabaseSync) {
        return async <TRow = Record<string, unknown>>(
            sql: string,
            params: ReadonlyArray<unknown> = [],
        ): Promise<SqlExecuteResult<TRow>> => {
            const trimmed = sql.trim().toUpperCase();
            const isSelect =
                trimmed.startsWith("SELECT") || trimmed.startsWith("PRAGMA");
            const stmt = handle.prepare(sql);
            if (isSelect) {
                const rows = stmt.all(...(params as unknown[])) as TRow[];
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
        };
    }

    // Reentrant: a `.transaction()` call already running inside an active
    // transaction (e.g. a row adapter's own internal transaction, invoked
    // from within collection-adapter's batch-level transaction) reuses the
    // active transaction instead of issuing a second BEGIN, which real
    // SQLite rejects ("cannot start a transaction within a transaction").
    // This lets a whole page/batch be one atomic unit while each row
    // adapter keeps its own internal transaction for direct, standalone
    // calls outside a batch.
    function makeTxDriver(handle: DatabaseSync): SqlDriver {
        const txDriver: SqlDriver = {
            execute: makeExecute(handle),
            transaction: async (fn) => fn(txDriver),
        };
        return txDriver;
    }

    const driver: SqlDriver = {
        execute: makeExecute(db),
        transaction: async (fn) => {
            db.exec("BEGIN");
            try {
                const result = await fn(makeTxDriver(db));
                db.exec("COMMIT");
                return result;
            } catch (error) {
                db.exec("ROLLBACK");
                throw error;
            }
        },
    };

    return { driver, close: () => db.close() };
}
