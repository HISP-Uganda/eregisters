import type { SqlDriver } from "./driver-types";
import { UNIFORM_METADATA_TABLES } from "./schema";

/**
 * SQLite equivalent of sync.ts's `resetDatabase` actor
 * (`src/machines/sync.ts:1304-1307`, today `db.delete()` + `db.open()`),
 * the error-recovery path triggered when `saveMetadata` fails
 * (`metadataSync.resetIndexDB` state).
 *
 * Deliberately narrower than Dexie's version: today's `db.delete()` wipes
 * the ENTIRE `MOHRegisterDB` database. This clears only the genuinely
 * resyncable metadata tables — `UNIFORM_METADATA_TABLES` minus
 * `hmis_drafts` (see below) — plus the three real-schema metadata tables
 * (`organisation_units`/`option_sets`/`option_groups`). NOT touched:
 * tracker tables (`tracked_entities`, `enrollments`, `events`,
 * `rule_results` — stay on Dexie in this migration phase, and even once
 * cut over, resetting them because metadata failed to save would throw
 * away unsynced local edits for no reason), `indicator_evaluations`
 * (tracker-linked per ticket 004's own reasoning, not a metadata-sync
 * concern), and `hmis_drafts` — a code-review pass on this caught that
 * `hmis_drafts` holds unsynced local HMIS-form drafts (user data), not
 * DHIS2-sourced metadata, even though it's grouped under
 * `UNIFORM_METADATA_TABLES` for schema convenience — wiping it on a
 * metadata-save failure would be the same "throw away unsynced local
 * data for no reason" mistake as wiping tracker tables. This narrowing
 * was confirmed with the user before building it, not assumed.
 */
const METADATA_TABLES_TO_RESET: readonly string[] = [
    ...UNIFORM_METADATA_TABLES.filter((table) => table !== "hmis_drafts"),
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
