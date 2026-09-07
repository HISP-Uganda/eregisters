import type { FlattenedOptionSet } from "../../../schemas";
import {
    compositeKey,
    createCompositeKeyMetadataTableRowAdapter,
} from "./composite-key-metadata-table";

export const optionSetsRowAdapter = createCompositeKeyMetadataTableRowAdapter<
    FlattenedOptionSet
>(
    "option_sets",
    "id",
    "option_set",
    (row) => row.id,
    (row) => row.optionSet,
);

export function optionSetKey(row: FlattenedOptionSet): string {
    return compositeKey(row.id, row.optionSet);
}
