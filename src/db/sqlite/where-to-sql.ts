/**
 * Translates a TanStack DB `where` expression (what an on-demand
 * collection's `loadSubset` receives from a live query) into a SQL filter
 * over one tracker table, so a screen loads only the rows its query asks
 * for instead of the whole facility.
 *
 * The SQL is always a SUPERSET of what the expression selects: TanStack DB
 * re-applies the exact expression to whatever is loaded, so loading a few
 * extra rows is harmless, while missing one would hide data. Anything this
 * module can't translate exactly widens to "all rows" (`1`) at that point
 * of the tree, and a NOT is only pushed down over an exact translation.
 */

/** Minimal structural view of `@tanstack/db`'s IR (`PropRef`/`Value`/`Func`). */
type Expr =
    | { type: "ref"; path: string[] }
    | { type: "val"; value: unknown }
    | { type: "func"; name: string; args: Expr[] };

export type SqlFilter = { sql: string; params: unknown[] };

/** How one table's row fields map to SQL. */
export interface TableSpec {
    /** The parent table, also the name its columns are qualified with. */
    table: string;
    /** Its primary-key column. */
    key: string;
    /** Top-level row fields stored as TEXT columns, by field name. */
    columns: Record<string, string>;
    /**
     * A record field (`attributes`/`dataValues`) stored one value per row
     * in a child table: `row[field][name]` is `value` where `name_column`
     * is `name`.
     */
    child?: {
        field: string;
        table: string;
        foreignKey: string;
        nameColumn: string;
        /**
         * The child table has an index on (name, value, foreign key). Then a
         * test on one child value is a lookup of the matching parents, done
         * once (`key IN (...)`), instead of a check per parent row.
         */
        lookupIndex?: boolean;
    };
}

type Translated = SqlFilter & { exact: boolean };

const ALL: Translated = { sql: "1", params: [], exact: false };
const NONE: Translated = { sql: "0", params: [], exact: true };

function isString(value: unknown): value is string {
    return typeof value === "string";
}

/** ASCII only: SQLite's LIKE folds case for ASCII letters alone. */
function isAscii(value: string): boolean {
    return /^[\x00-\x7f]*$/.test(value);
}

function asExpr(node: unknown): Expr | null {
    if (!node || typeof node !== "object") return null;
    const type = (node as { type?: unknown }).type;
    return type === "ref" || type === "val" || type === "func"
        ? (node as Expr)
        : null;
}

/** `col` for a top-level text field, or null when the field isn't mapped. */
function column(spec: TableSpec, ref: Expr): string | null {
    if (ref.type !== "ref" || ref.path.length !== 1) return null;
    const col = spec.columns[ref.path[0]];
    return col ? `${spec.table}.${col}` : null;
}

/** The child-table value name for `row[child.field][name]`, if that's what `ref` is. */
function childName(spec: TableSpec, ref: Expr): string | null {
    if (!spec.child || ref.type !== "ref" || ref.path.length !== 2) return null;
    return ref.path[0] === spec.child.field ? ref.path[1] : null;
}

function childExists(spec: TableSpec, name: string, test: string, params: unknown[]): Translated {
    const c = spec.child!;
    return {
        sql: c.lookupIndex
            ? `${spec.table}.${spec.key} IN (SELECT c.${c.foreignKey} FROM ${c.table} c WHERE c.${c.nameColumn} = ? AND ${test})`
            : `EXISTS (SELECT 1 FROM ${c.table} c WHERE c.${c.foreignKey} = ${spec.table}.${spec.key} AND c.${c.nameColumn} = ? AND ${test})`,
        params: [name, ...params],
        // Value comparisons in the child table follow SQLite's type
        // affinity rather than JavaScript's, so never treat them as exact.
        exact: false,
    };
}

/** `ref op value`, with the ref on either side. */
function comparison(spec: TableSpec, args: Expr[]): { ref: Expr; value: unknown } | null {
    if (args.length !== 2) return null;
    const [a, b] = args;
    if (a.type === "ref" && b.type === "val") return { ref: a, value: b.value };
    if (b.type === "ref" && a.type === "val") return { ref: b, value: a.value };
    return null;
}

function translateEq(spec: TableSpec, args: Expr[]): Translated {
    if (args.length === 2 && args[0].type === "val" && args[1].type === "val") {
        // Two constants. (TanStack DB drops a constant-only filter before
        // loadSubset, so this is for direct callers.)
        return { sql: args[0].value === args[1].value ? "1" : "0", params: [], exact: true };
    }
    const cmp = comparison(spec, args);
    if (!cmp) return ALL;
    const { ref, value } = cmp;
    if (value === null || value === undefined) {
        // eq(x, null/undefined) is never true for a stored row in TanStack
        // DB's comparison; SQL's `= NULL` is never true either.
        const col = column(spec, ref);
        return col ? { sql: "0", params: [], exact: false } : ALL;
    }
    if (!isString(value)) return ALL;
    const col = column(spec, ref);
    if (col) return { sql: `${col} = ?`, params: [value], exact: true };
    const name = childName(spec, ref);
    if (name !== null) return childExists(spec, name, "c.value = ?", [value]);
    return ALL;
}

function translateInArray(spec: TableSpec, args: Expr[]): Translated {
    if (args.length !== 2 || args[0].type !== "ref" || args[1].type !== "val") return ALL;
    const values = args[1].value;
    if (!Array.isArray(values) || !values.every(isString)) return ALL;
    const col = column(spec, args[0]);
    if (!col) return ALL;
    if (values.length === 0) return { sql: "0", params: [], exact: true };
    return {
        sql: `${col} IN (${values.map(() => "?").join(", ")})`,
        params: values,
        exact: true,
    };
}

/**
 * `like`/`ilike`: SQLite's LIKE ignores ASCII case, so it's exact for an
 * ASCII `ilike` pattern and a superset for `like`. Non-ASCII patterns widen.
 */
function translateLike(spec: TableSpec, args: Expr[]): Translated {
    const cmp = comparison(spec, args);
    if (!cmp || args[0].type !== "ref" || !isString(cmp.value) || !isAscii(cmp.value)) {
        return ALL;
    }
    const col = column(spec, cmp.ref);
    if (col) return { sql: `${col} LIKE ?`, params: [cmp.value], exact: false };
    const name = childName(spec, cmp.ref);
    if (name !== null) return childExists(spec, name, "c.value LIKE ?", [cmp.value]);
    return ALL;
}

function translate(spec: TableSpec, node: Expr): Translated {
    if (node.type === "val") {
        if (node.value === true) return { sql: "1", params: [], exact: true };
        if (node.value === false) return { sql: "0", params: [], exact: true };
        return ALL;
    }
    if (node.type !== "func") return ALL;
    const args = node.args.map(asExpr);
    if (args.some((a) => a === null)) return ALL;
    const exprs = args as Expr[];
    switch (node.name) {
        case "and":
        case "or": {
            const parts = exprs.map((a) => translate(spec, a));
            const joiner = node.name === "and" ? " AND " : " OR ";
            // In an OR, one widened branch widens the whole OR.
            if (node.name === "or" && parts.some((p) => p.sql === "1")) return ALL;
            // An AND with a "no rows" part selects nothing (each part is a
            // superset, so "0" means none can match); exact only if all are.
            if (node.name === "and" && parts.some((p) => p.sql === "0")) {
                return { ...NONE, exact: parts.every((p) => p.exact) };
            }
            const kept = node.name === "and" ? parts.filter((p) => p.sql !== "1") : parts;
            if (kept.length === 0) return { ...ALL, exact: parts.every((p) => p.exact) };
            return {
                sql: kept.map((p) => `(${p.sql})`).join(joiner),
                params: kept.flatMap((p) => p.params),
                exact: parts.every((p) => p.exact),
            };
        }
        case "not": {
            if (exprs.length !== 1) return ALL;
            const inner = translate(spec, exprs[0]);
            if (!inner.exact) return ALL;
            // COALESCE: a NULL column makes `NOT (col = ?)` NULL in SQL;
            // counting it as a match keeps this a superset.
            return { sql: `NOT COALESCE((${inner.sql}), 0)`, params: inner.params, exact: false };
        }
        case "eq":
            return translateEq(spec, exprs);
        case "in": // inArray()
            return translateInArray(spec, exprs);
        case "like":
        case "ilike":
            return translateLike(spec, exprs);
        default:
            return ALL;
    }
}

/**
 * The SQL filter for `where` (undefined: every row). The SQL qualifies
 * columns with `spec.table`, so it can be used in a subquery over it.
 */
/** A filter that selects nothing, so there is nothing to load. */
export function selectsNothing(filter: SqlFilter): boolean {
    return filter.sql === "0";
}

export function whereToSql(spec: TableSpec, where: unknown): SqlFilter {
    const expr = asExpr(where);
    if (!expr) return { sql: "1", params: [] };
    const { sql, params } = translate(spec, expr);
    return { sql, params: params.map((p) => (p === undefined ? null : p)) };
}
