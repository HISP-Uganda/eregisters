/**
 * Storage-agnostic SQL driver contract. Production code talks to op-sqlite's
 * web/OPFS backend (see op-sqlite-driver.ts); tests talk to Node's built-in
 * node:sqlite module (see test-support/node-sqlite-driver.ts) — both satisfy
 * this same interface, so schema/query/merge logic is exercised against real
 * SQL semantics in either environment (wayfinder ticket "Testing Strategy for
 * OPFS/SQLite in CI and Pre-deploy QA").
 */
export interface SqlExecuteResult<TRow = Record<string, unknown>> {
    rows: TRow[];
    rowsAffected: number;
    insertId?: number;
}

export interface SqlDriver {
    execute: <TRow = Record<string, unknown>>(
        sql: string,
        params?: ReadonlyArray<unknown>,
    ) => Promise<SqlExecuteResult<TRow>>;
    transaction: <T>(fn: (tx: SqlDriver) => Promise<T>) => Promise<T>;
}
