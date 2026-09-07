import type { SqlDriver } from "./driver-types";
import { UNIFORM_METADATA_TABLES } from "./schema";

/**
 * SQLite equivalent of sync.ts's `resetDatabase` actor
 * (`src/machines/sync.ts:1304-1307`, today `db.delete()` + `db.open()`),
 * the error-recovery path triggered when `saveMetadata` fails
 * (`metadataSync.resetIndexDB` state).
 *
 * Deliberately narrower than Dexie's version: today's `db.delete()` wipes
 * the ENTIRE `MOHRegisterDB` database. This clears only the metadata
 * tables — every `UNIFORM_METADATA_TABLES` entry (including `sync_state`/
 * `ui_config`/`stage_hierarchy`/`hmis_drafts`, all genuinely part of
 * `MOHRegisterDB` today) plus the three real-schema metadata tables
 * (`organisation_units`/`option_sets`/`option_groups`). Tracker tables
 * (`tracked_entities`, `enrollments`, `events`, `rule_results`) and
 * `indicator_evaluations` (tracker-linked per ticket 004's own reasoning,
 * not a metadata-sync concern) are NOT touched — tracker data stays on
 * Dexie in this migration phase, and even once it's cut over, resetting it
 * because metadata failed to save would throw away unsynced local edits
 * for no reason. This narrowing was confirmed with the user before
 * building it, not assumed.
 */
const METADATA_TABLES_TO_RESET: readonly string[] = [
    ...UNIFORM_METADATA_TABLES,
    "organisation_units",
    "option_sets",
    "option_groups",
];

export async function resetMetadataDatabase(db: SqlDriver): Promise<void> {
    await db.transaction(async (tx) => {
        for (const table of METADATA_TABLES_TO_RESET) {
            await tx.execute(`DELETE FROM ${table}`);
        }
    });
}
