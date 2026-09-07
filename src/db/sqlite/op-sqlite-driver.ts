import { openAsync } from "@op-engineering/op-sqlite";
import type { SqlDriver, SqlExecuteResult } from "./driver-types";

/**
 * Production SqlDriver wrapping @op-engineering/op-sqlite's async-only
 * web/OPFS backend. Ported from the verified spike
 * (wayfinder ticket "Build and Verify OpSqliteWebDriver Conformance",
 * branch spike/opsqlite-driver-conformance) — all-Chrome, real-OPFS
 * end-to-end conformance (insert/update/delete, transactions, persistence
 * across reopen) already confirmed there.
 *
 * Requires the page to be cross-origin isolated (COOP/COEP) — see
 * wayfinder ticket "Prototype COOP/COEP Service-Worker Header Injection
 * Against Production DHIS2" for how that's provided on this app's hosting.
 */

type OpSqliteDb = Awaited<ReturnType<typeof openAsync>>;
type OpSqliteTransaction = Parameters<
    Parameters<OpSqliteDb["transaction"]>[0]
>[0];

function wrapExecute(
    executor: { execute: (sql: string, params?: any[]) => Promise<any> },
) {
    return async <TRow = Record<string, unknown>>(
        sql: string,
        params?: ReadonlyArray<unknown>,
    ): Promise<SqlExecuteResult<TRow>> => {
        const result = await executor.execute(
            sql,
            params as any[] | undefined,
        );
        return {
            rows: result.rows as unknown as TRow[],
            rowsAffected: result.rowsAffected,
            insertId: result.insertId,
        };
    };
}

// Reentrant: op-sqlite's own Transaction object has no `.transaction()` of
// its own (nesting a real BEGIN inside op-sqlite's web backend isn't
// supported), so a `.transaction()` call already running inside this
// tx-scoped driver just reuses itself rather than erroring — this lets a
// whole page/batch be one atomic unit (collection-adapter.ts) while each
// row adapter keeps its own internal `db.transaction()` for direct,
// standalone calls outside a batch.
function makeTxDriver(tx: OpSqliteTransaction): SqlDriver {
    const txDriver: SqlDriver = {
        execute: wrapExecute(tx),
        transaction: async (fn) => fn(txDriver),
    };
    return txDriver;
}

function wrap(db: OpSqliteDb): SqlDriver {
    return {
        execute: wrapExecute(db),
        transaction: async <T>(
            fn: (tx: SqlDriver) => Promise<T>,
        ): Promise<T> => {
            let result!: T;
            await db.transaction(async (tx) => {
                result = await fn(makeTxDriver(tx));
            });
            return result;
        },
    };
}

export async function createOpSqliteDriver(name: string): Promise<SqlDriver> {
    const db = await openAsync({ name });
    return wrap(db);
}
