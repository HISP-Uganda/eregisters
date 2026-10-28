import type { RowAdapter } from "@/db/sqlite/row-adapter";
import { createJsonMetadataTableRowAdapter } from "./json-metadata-table";

const KEY_SEPARATOR = "::";

/** Row adapter for option metadata keyed by option id and set or group id. */
export function createCompositeKeyMetadataTableRowAdapter<T extends object>(
    tableName: string,
    firstKeyColumn: string,
    secondKeyColumn: string,
    getFirstKey: (row: T) => string,
    getSecondKey: (row: T) => string,
): RowAdapter<T, string> {
    return createJsonMetadataTableRowAdapter(tableName, [firstKeyColumn, secondKeyColumn],
        (row) => [getFirstKey(row), getSecondKey(row)],
        (key) => key.split(KEY_SEPARATOR));
}

export function compositeKey(firstKey: string, secondKey: string): string {
    return `${firstKey}${KEY_SEPARATOR}${secondKey}`;
}
