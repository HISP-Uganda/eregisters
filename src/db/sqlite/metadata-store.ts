import type { MetadataStore } from "../metadata-store";
import { getConfigRow, putConfigRow } from "./config-rows";
import type { SqlDriver } from "./driver-types";
import { getAllRows } from "./metadata-info";

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
        async listRows<T extends object>(table: string) {
            if (table === "organisation_units") {
                const result = await db.execute<OrganisationUnitSqlRow>(
                    "SELECT id, name, path, data FROM organisation_units",
                );
                return result.rows.map((row) => toOrganisationUnit<T>(row));
            }
            return getAllRows<T>(db, table);
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
    };
}
