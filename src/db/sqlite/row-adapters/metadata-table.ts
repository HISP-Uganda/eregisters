import type { RowAdapter } from "@/db/sqlite/row-adapter";
import { createJsonMetadataTableRowAdapter } from "./json-metadata-table";

/** Row adapter for metadata tables keyed by a single id. */
export function createMetadataTableRowAdapter<T extends object>(
    tableName: string,
    getId: (row: T) => string,
): RowAdapter<T, string> {
    return createJsonMetadataTableRowAdapter(tableName, ["id"],
        (row) => [getId(row)], (key) => [key]);
}
