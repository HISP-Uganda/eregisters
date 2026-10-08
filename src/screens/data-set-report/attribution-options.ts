import { orderBy } from "lodash";
import type { CategoryOptionCombo } from "@/schemas";

/**
 * The Nationality picker's entries: each category option the user may
 * enter data for, by name, valued by its attribute option combo. The
 * combo has one category, so each option has exactly one combo — and the
 * combo id is what server values, drafts and imports are keyed by.
 */
export function attributionOptions(categoryOptionCombos: CategoryOptionCombo[]): Array<{ id: string; name: string }> {
    return orderBy(
        categoryOptionCombos.flatMap((combo) =>
            combo.categoryOptions
                .filter((option) => option.access?.data?.write)
                .map((option) => ({ id: combo.id, name: option.name })),
        ),
        "name",
        "asc",
    );
}
