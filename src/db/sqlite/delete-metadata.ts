import type { Metadata, Resource } from "../../schemas";
import type { SqlDriver } from "./driver-types";

/**
 * SQLite equivalent of sync.ts's `deleteAllMetadata` actor
 * (`src/machines/sync.ts:1265-1303`), which today does `.clear()` per
 * resource, gated the same way `saveMetadata` (`save-metadata.ts`) is
 * gated. Collapsed into ONE transaction here — a real correctness
 * improvement (atomic all-or-nothing) over Dexie's 11 separate per-table
 * clears, matching the pattern ticket 013's decisions #5/#6 already
 * established for push write-back and delete-cascade.
 */
export async function deleteAllMetadata(
    db: SqlDriver,
    input: Metadata,
): Promise<void> {
    const succeeded = input.succeededResources ?? new Set<Resource>();
    const shouldClear = (resource: Resource) =>
        succeeded.size === 0 || succeeded.has(resource);

    await db.transaction(async (tx) => {
        if (shouldClear("organisationUnits")) {
            await tx.execute("DELETE FROM organisation_units");
        }
        if (shouldClear("programs")) {
            await tx.execute("DELETE FROM programs");
        }
        if (shouldClear("dataElements")) {
            await tx.execute("DELETE FROM data_elements");
        }
        if (shouldClear("programIndicators")) {
            await tx.execute("DELETE FROM program_indicators");
        }
        if (shouldClear("attributes")) {
            await tx.execute(
                "DELETE FROM tracked_entity_attribute_definitions",
            );
        }
        if (shouldClear("programRules")) {
            await tx.execute("DELETE FROM program_rules");
        }
        if (shouldClear("programRuleVariables")) {
            await tx.execute("DELETE FROM program_rule_variables");
        }
        if (shouldClear("optionSets")) {
            await tx.execute("DELETE FROM option_sets");
        }
        if (shouldClear("optionGroups")) {
            await tx.execute("DELETE FROM option_groups");
        }
        if (shouldClear("dataSets")) {
            await tx.execute("DELETE FROM data_sets");
        }
        if (shouldClear("categoryOptionCombos")) {
            await tx.execute("DELETE FROM category_option_combos");
        }
        // Always runs, matching today's unconditional db.metadataVersions.clear().
        await tx.execute("DELETE FROM metadata_versions");
    });
}
