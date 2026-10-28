import type { SqlDriver } from "@/db/sqlite/driver-types";
import { loadUsersByUid, type SqlUser } from "./users";

type Where = {
    clause: string;
    params: ReadonlyArray<unknown>;
    /** Use only when the child table has the same columns named in clause. */
    scopeChildren?: boolean;
};

type RelatedRows<Parent, Child, Result> = {
    parentTable: string;
    parentColumns: string;
    childTable: string;
    childColumns: string;
    parentKey: (parent: Parent) => string;
    childKey: (child: Child) => string;
    reassemble: (parent: Parent, children: Child[], usersByUid: Map<string, SqlUser>) => Result;
};

/** Loads parent rows and their child rows, preserving scoped child reads by key. */
export function makeRelatedRowsLoader<Parent, Child, Result>(
    config: RelatedRows<Parent, Child, Result>,
) {
    return async (db: SqlDriver, where?: Where): Promise<Result[]> => {
        const parentWhere = where ? ` WHERE ${where.clause}` : "";
        const childWhere = where?.scopeChildren ? parentWhere : "";
        const [parents, children, usersByUid] = await Promise.all([
            db.execute<Parent>(
                `SELECT ${config.parentColumns} FROM ${config.parentTable}${parentWhere}`,
                where?.params,
            ),
            db.execute<Child>(
                `SELECT ${config.childColumns} FROM ${config.childTable}${childWhere}`,
                where?.scopeChildren ? where.params : undefined,
            ),
            loadUsersByUid(db),
        ]);
        const childrenByParent = new Map<string, Child[]>();
        for (const child of children.rows) {
            const key = config.childKey(child);
            const bucket = childrenByParent.get(key) ?? [];
            bucket.push(child);
            childrenByParent.set(key, bucket);
        }
        return parents.rows.map((parent) =>
            config.reassemble(parent, childrenByParent.get(config.parentKey(parent)) ?? [], usersByUid),
        );
    };
}

/** The collection adapter's full and key-scoped read paths share one loader. */
export function relatedRowReads<Result extends { updatedAt: string }>(
    loadRows: (db: SqlDriver, where?: Where) => Promise<Result[]>,
    keyColumn: string,
) {
    return {
        rowVersion: (row: Result) => row.updatedAt,
        loadAll: (db: SqlDriver) => loadRows(db),
        loadByKeys: (db: SqlDriver, keys: readonly string[]) =>
            keys.length === 0
                ? Promise.resolve([] as Result[])
                : loadRows(db, { clause: sqlIn(keyColumn, keys), params: keys, scopeChildren: true }),
    };
}

export const sqlIn = (column: string, values: ReadonlyArray<unknown>) =>
    `${column} IN (${values.map(() => "?").join(", ")})`;

export const toBool = (value: number) => value === 1;
export const toInt = (value: boolean) => value ? 1 : 0;
