import type { MetadataStore } from "../metadata-store";
import { getConfigRow, putConfigRow } from "./config-rows";
import type { SqlDriver } from "./driver-types";
import { getAllRows } from "./metadata-info";

/**
 * SQL implementation of `MetadataStore` — a thin facade over the existing
 * `config-rows.ts`/`metadata-info.ts` functions (unchanged, per wayfinder
 * ticket 001's "SQL untouched" decision), not a rewrite. See
 * `../metadata-store.ts` for the interface contract and its documented
 * gaps (`organisation_units`, composite-key tables).
 */
export function sqliteMetadataStore(db: SqlDriver): MetadataStore {
    return {
        getRow: (table, id) => getConfigRow(db, table, id),
        putRow: (table, row) => putConfigRow(db, table, row),
        listRows: (table) => getAllRows(db, table),
    };
}
