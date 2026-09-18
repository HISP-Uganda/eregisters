import type { RowAdapter } from "../row-adapter";

/**
 * organisation_units is the one metadata table with real columns
 * (id/name/path) rather than the uniform id+data blob shape, because it has
 * a genuine indexed prefix-search query in the app
 * (`src/utils/utils.ts:1510-1512`, `WHERE path LIKE 'prefix%'`).
 */
export type OrgUnitRow = {
    id: string;
    name: string;
    code?: string;
    path: string;
    parent?: { id: string };
};

type SqlRow = {
    id: string;
    name: string;
    path: string;
    data: string;
};

function toOrgUnit(row: SqlRow): OrgUnitRow {	
    const extra = JSON.parse(row.data) as Omit<OrgUnitRow, "id" | "name" | "path">;
    return { id: row.id, name: row.name, path: row.path, ...extra };
}

export const organisationUnitsRowAdapter: RowAdapter<OrgUnitRow, string> = {
    rowVersion: () => "",

    loadAll: async (db) => {
        const result = await db.execute<SqlRow>(
            "SELECT id, name, path, data FROM organisation_units",
        );
        return result.rows.map(toOrgUnit);
    },

    insertRow: async (db, row) => {
        const { id, name, path, ...rest } = row;
        await db.execute(
            "INSERT INTO organisation_units (id, name, path, data) VALUES (?, ?, ?, ?)",
            [id, name, path, JSON.stringify(rest)],
        );
    },

    updateRow: async (db, row) => {
        const { id, name, path, ...rest } = row;
        await db.execute(
            "UPDATE organisation_units SET name = ?, path = ?, data = ? WHERE id = ?",
            [name, path, JSON.stringify(rest), id],
        );
    },

    deleteRow: async (db, key) => {
        await db.execute("DELETE FROM organisation_units WHERE id = ?", [
            key,
        ]);
    },
};

/** The real prefix-search query this table exists to serve. */
export async function findOrgUnitsByPathPrefix(
    db: Parameters<RowAdapter<OrgUnitRow, string>["loadAll"]>[0],
    prefix: string,
): Promise<OrgUnitRow[]> {
    const result = await db.execute<SqlRow>(
        "SELECT id, name, path, data FROM organisation_units WHERE path LIKE ? ORDER BY path",
        [`${prefix}%`],
    );
    return result.rows.map(toOrgUnit);
}
