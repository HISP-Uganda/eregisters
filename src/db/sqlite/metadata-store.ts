import type { MetadataStore } from "@/db/metadata-store";
import { notifyConfigChanged } from "@/db/reactive-config";
import { getConfigRow, putConfigRow } from "./config-rows";
import type { SqlDriver } from "./driver-types";
import { getAllRows } from "./metadata-info";
import { measureStartup, startupTimingEnabled } from "@/utils/startup-timing";

type OrganisationUnitSqlRow = { id: string; name: string; path: string; data: string };

function toOrganisationUnit<T extends object>(row: OrganisationUnitSqlRow): T {
    const rest = JSON.parse(row.data) as object;
    return { id: row.id, name: row.name, path: row.path, ...rest } as T;
}

/**
 * The two composite-primary-key tables (`option_sets`: `(id, option_set)`,
 * `option_groups`: `(id, option_group)`) — see `../metadata-store.ts`'s
 * doc comment. `putRow`/`deleteRow` special-case these by real column name
 * instead of going through `config-rows.ts`'s uniform `id`-keyed path.
 */
const COMPOSITE_TABLES: Record<string, { first: string; second: string }> = {
    option_sets: { first: "id", second: "option_set" },
    option_groups: { first: "id", second: "option_group" },
};

/** Splits a `optionSetKey`/`optionGroupKey`-style `"id::group"` key. */
function splitCompositeKey(key: string): [string, string] {
    const separatorIndex = key.indexOf("::");
    return separatorIndex === -1
        ? [key, ""]
        : [key.slice(0, separatorIndex), key.slice(separatorIndex + 2)];
}

/**
 * Stays well under SQLite's bound-parameter limit (999 on older builds)
 * for the multi-row INSERTs `putRows` issues.
 */
const MAX_PARAMS_PER_STATEMENT = 900;

async function insertManyRows(
    db: SqlDriver,
    table: string,
    columns: readonly string[],
    rows: unknown[][],
): Promise<void> {
    const rowsPerStatement = Math.max(
        1,
        Math.floor(MAX_PARAMS_PER_STATEMENT / columns.length),
    );
    const placeholder = `(${columns.map(() => "?").join(", ")})`;
    await db.transaction(async (tx) => {
        for (let i = 0; i < rows.length; i += rowsPerStatement) {
            const chunk = rows.slice(i, i + rowsPerStatement);
            await tx.execute(
                `INSERT OR REPLACE INTO ${table} (${columns.join(", ")}) VALUES ${chunk
                    .map(() => placeholder)
                    .join(", ")}`,
                chunk.flat(),
            );
        }
    });
}

/**
 * SQL implementation of `MetadataStore` — a thin facade over the existing
 * `config-rows.ts`/`metadata-info.ts` functions (unchanged, per wayfinder
 * ticket 001's "SQL untouched" decision) for the 15 uniform tables, plus
 * direct real-column SQL for the three non-uniform tables:
 * `organisation_units` (real `id`/`name`/`path` columns — its indexed
 * path-prefix query, `findOrgUnitsByPathPrefix`, stays SQL-only and
 * unrelated to this interface) and the two composite-key tables
 * (`option_sets`/`option_groups`). `getRow` on a composite table is not
 * meaningfully single-row and isn't called that way by any current
 * caller — only `listRows`/`putRow`/`deleteRow` are used for
 * `option_sets`/`option_groups`.
 */
export function sqliteMetadataStore(db: SqlDriver): MetadataStore {
    return {
        // The driver's transaction is reentrant, so each method's own
        // transaction nests inside this one.
        transaction: (fn) =>
            db.transaction((tx) => fn(sqliteMetadataStore(tx))),
        async getRow<T extends object>(table: string, id: string) {
            if (table === "organisation_units") {
                const result = await db.execute<OrganisationUnitSqlRow>(
                    "SELECT id, name, path, data FROM organisation_units WHERE id = ?",
                    [id],
                );
                return result.rows[0]
                    ? toOrganisationUnit<T>(result.rows[0])
                    : undefined;
            }
            return getConfigRow<T>(db, table, id);
        },
        async putRow<T extends { id: string }>(
            table: string,
            row: T,
            key?: string,
        ): Promise<void> {
            if (table === "organisation_units") {
                const { id, name, path, ...rest } = row as unknown as {
                    id: string;
                    name: string;
                    path: string;
                };
                await db.execute(
                    "INSERT OR REPLACE INTO organisation_units (id, name, path, data) VALUES (?, ?, ?, ?)",
                    [id, name, path, JSON.stringify(rest)],
                );
                return;
            }
            const composite = COMPOSITE_TABLES[table];
            if (composite && key) {
                const [first, second] = splitCompositeKey(key);
                await db.execute(
                    `INSERT OR REPLACE INTO ${table} (${composite.first}, ${composite.second}, data) VALUES (?, ?, ?)`,
                    [first, second, JSON.stringify(row)],
                );
                return;
            }
            await putConfigRow(db, table, row);
        },
        async putRows<T extends { id: string }>(
            table: string,
            rows: T[],
            keyOf?: (row: T) => string,
        ): Promise<void> {
            if (rows.length === 0) return;
            if (table === "organisation_units") {
                await insertManyRows(
                    db,
                    table,
                    ["id", "name", "path", "data"],
                    rows.map((row) => {
                        const { id, name, path, ...rest } = row as unknown as {
                            id: string;
                            name: string;
                            path: string;
                        };
                        return [id, name, path, JSON.stringify(rest)];
                    }),
                );
                return;
            }
            const composite = COMPOSITE_TABLES[table];
            if (composite && keyOf) {
                await insertManyRows(
                    db,
                    table,
                    [composite.first, composite.second, "data"],
                    rows.map((row) => [
                        ...splitCompositeKey(keyOf(row)),
                        JSON.stringify(row),
                    ]),
                );
                return;
            }
            await insertManyRows(
                db,
                table,
                ["id", "data"],
                rows.map((row) => [row.id, JSON.stringify(row)]),
            );
            // Same reactive-notify step putRow gets via putConfigRow.
            for (const row of rows) notifyConfigChanged(table, row.id);
        },
        async listRows<T extends object>(table: string) {
            if (table === "organisation_units") {
                const result = await db.execute<OrganisationUnitSqlRow>(
                    "SELECT id, name, path, data FROM organisation_units",
                );
                return result.rows.map((row) => toOrganisationUnit<T>(row));
            }
            return getAllRows<T>(db, table);
        },
        async listRowsMany(tables, limit) {
            if (tables.length === 0) return [];
            // UNION ALL transports all tables in one worker round trip without
            // building an extra JSON aggregate of potentially large metadata.
            const result = await db.execute<OrganisationUnitSqlRow & { table_index: number }>(
                tables.map((table, index) => {
                    const tableLimit = typeof limit === "number" ? limit : limit?.[table];
                    if (tableLimit !== undefined && (!Number.isSafeInteger(tableLimit) || tableLimit < 0)) {
                        throw new Error("Invalid metadata row limit");
                    }
                    const columns = table === "organisation_units"
                        ? "id, name, path"
                        : "NULL AS id, NULL AS name, NULL AS path";
                    const source = tableLimit === undefined
                        ? table
                        : `(SELECT * FROM ${table} LIMIT ${tableLimit})`;
                    return `SELECT ${index} AS table_index, data, ${columns} FROM ${source}`;
                }).join(" UNION ALL "),
            );
            const decodeStart = performance.now();
            const groups: object[][] = tables.map(() => []);
            for (const row of result.rows) {
                groups[row.table_index].push(tables[row.table_index] === "organisation_units"
                    ? toOrganisationUnit(row)
                    : JSON.parse(row.data));
            }
            if (startupTimingEnabled()) {
                const bytes = tables.map(() => 0);
                for (const row of result.rows) bytes[row.table_index] += row.data?.length ?? 0;
                measureStartup("decode-metadata", decodeStart, Object.fromEntries(tables.map((table, index) =>
                    [table, { rows: groups[index].length, kilobytes: Math.round(bytes[index] / 1024) }])));
            }
            return groups;
        },
        async hasRowsMany(tables) {
            if (tables.length === 0) return [];
            const result = await db.execute<Record<string, number>>(
                `SELECT ${tables.map((table, index) =>
                    `EXISTS(SELECT 1 FROM ${table} LIMIT 1) AS t${index}`,
                ).join(", ")}`,
            );
            return tables.map((_, index) => Boolean(result.rows[0][`t${index}`]));
        },
        async hasRows(table: string) {
            const result = await db.execute(`SELECT 1 FROM ${table} LIMIT 1`);
            return result.rows.length > 0;
        },
        async deleteRow(table: string, key: string): Promise<void> {
            const composite = COMPOSITE_TABLES[table];
            if (composite) {
                const [first, second] = splitCompositeKey(key);
                await db.execute(
                    `DELETE FROM ${table} WHERE ${composite.first} = ? AND ${composite.second} = ?`,
                    [first, second],
                );
                return;
            }
            await db.execute(`DELETE FROM ${table} WHERE id = ?`, [key]);
        },
        async clearTable(table: string): Promise<void> {
            await db.execute(`DELETE FROM ${table}`);
        },
    };
}
