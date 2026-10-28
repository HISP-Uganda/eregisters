import type { SqlDriver } from "@/db/sqlite/driver-types";
import { loadUsersByUid, type SqlUser } from "./users";

type Where = {
    clause: string;
    params: ReadonlyArray<unknown>;
    /** Use only when the child table has the same columns named in clause. */
    scopeChildren?: boolean;
};

type RelatedRows<Parent, Result> = {
    parentTable: string;
    parentColumns: string;
    childTable: string;
    /** The child column naming its parent (same name as the parent's key column). */
    childKeyColumn: string;
    /** The child columns holding each value's name and value. */
    childNameColumn: string;
    childValueColumn: string;
    parentKey: (parent: Parent) => string;
    reassemble: (parent: Parent, values: Record<string, unknown>, usersByUid: Map<string, SqlUser>) => Result;
};

/**
 * Loads parent rows and their child name/value pairs. SQLite packs each
 * parent's children into one JSON object, so a full load returns one row
 * per record instead of one per value — far less to build in the worker,
 * transfer to the page and rebuild there (the startup freeze, wayfinder
 * map "Reduce the remaining cached metadata startup wait").
 */
export function makeRelatedRowsLoader<Parent, Result>(
    config: RelatedRows<Parent, Result>,
) {
    return async (db: SqlDriver, where?: Where): Promise<Result[]> => {
        const parentWhere = where ? ` WHERE ${where.clause}` : "";
        const childWhere = where?.scopeChildren ? parentWhere : "";
        const [parents, children, usersByUid] = await Promise.all([
            db.execute<Parent>(
                `SELECT ${config.parentColumns} FROM ${config.parentTable}${parentWhere}`,
                where?.params,
            ),
            db.execute<{ parent_key: string; packed: string }>(
                `SELECT ${config.childKeyColumn} AS parent_key,
                        json_group_object(${config.childNameColumn}, ${config.childValueColumn}) AS packed
                 FROM ${config.childTable}${childWhere}
                 GROUP BY ${config.childKeyColumn}`,
                where?.scopeChildren ? where.params : undefined,
            ),
            loadUsersByUid(db),
        ]);
        const packedByParent = new Map<string, string>();
        for (const child of children.rows) packedByParent.set(child.parent_key, child.packed);
        return parents.rows.map((parent) => {
            const packed = packedByParent.get(config.parentKey(parent));
            return config.reassemble(parent, packed ? JSON.parse(packed) : {}, usersByUid);
        });
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
