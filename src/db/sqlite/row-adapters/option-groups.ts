import type { FlattenedOptionGroup } from "../../../schemas";
import {
    compositeKey,
    createCompositeKeyMetadataTableRowAdapter,
} from "./composite-key-metadata-table";

export const optionGroupsRowAdapter = createCompositeKeyMetadataTableRowAdapter<
    FlattenedOptionGroup
>(
    "option_groups",
    "id",
    "option_group",
    (row) => row.id,
    (row) => row.optionGroup,
);

export function optionGroupKey(row: FlattenedOptionGroup): string {
    return compositeKey(row.id, row.optionGroup);
}
