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

function wrap(db: OpSqliteDb): SqlDriver {
    return {
        execute: async <TRow = Record<string, unknown>>(
            sql: string,
            params?: ReadonlyArray<unknown>,
        ): Promise<SqlExecuteResult<TRow>> => {
            const result = await db.execute(sql, params as any[] | undefined);
            return {
                rows: result.rows as unknown as TRow[],
                rowsAffected: result.rowsAffected,
                insertId: result.insertId,
            };
        },
        transaction: async <T>(
            fn: (tx: SqlDriver) => Promise<T>,
        ): Promise<T> => {
            let result!: T;
            await db.transaction(async (tx) => {
                const txDriver: SqlDriver = {
                    execute: async <TRow = Record<string, unknown>>(
                        sql: string,
                        params?: ReadonlyArray<unknown>,
                    ): Promise<SqlExecuteResult<TRow>> => {
                        const execResult = await tx.execute(
                            sql,
                            params as any[] | undefined,
                        );
                        return {
                            rows: execResult.rows as unknown as TRow[],
                            rowsAffected: execResult.rowsAffected,
                            insertId: execResult.insertId,
                        };
                    },
                    transaction: () => {
                        throw new Error(
                            "Nested transactions are not supported by op-sqlite's web backend.",
                        );
                    },
                };
                result = await fn(txDriver);
            });
            return result;
        },
    };
}

export async function createOpSqliteDriver(name: string): Promise<SqlDriver> {
    const db = await openAsync({ name });
    return wrap(db);
}
