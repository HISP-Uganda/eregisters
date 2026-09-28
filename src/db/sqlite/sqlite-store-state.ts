import type { SqlDriver } from "./driver-types";
import { getConfigRow } from "./config-rows";
import { getAllRows } from "./metadata-info";
import { enrollmentsRowAdapter } from "./row-adapters/enrollments";
import { eventsRowAdapter } from "./row-adapters/events";
import { trackedEntitiesRowAdapter } from "./row-adapters/tracked-entities";

/**
 * What the two store copies need to know about the SQLite store, shared
 * here so neither copy module imports the other (`migrate-from-dexie.ts`
 * and `dexie/migrate-from-sqlite.ts` used to import one helper each from
 * the other — a circular dependency fallow reported).
 */

/** `metadata_versions` row the metadata checkpoint lives in. */
export const METADATA_VERSION_ID = "metadata-version";

/** The Dexie → SQLite copy's completion flag (`migration_status` row). */
export const MIGRATION_STATUS_TABLE = "migration_status";
export const MIGRATION_STATUS_ID = "dexie-migration";

/**
 * Mirrors migrate-from-dexie.ts's `existsAnyDexieData()` — but that one
 * checks `Dexie.exists()` per *database*, which covers its hmisDrafts
 * store "for free". This side has no equivalent single check (SQLite is
 * one database, not five), so hmis_drafts needs its own explicit check:
 * a device that filled an HMIS aggregate form but never touched tracker
 * data would otherwise take the fresh-install shortcut below and silently
 * never copy (or drop) its hmis_drafts rows — a real data-loss bug this
 * fixes.
 */
export async function hasAnySqliteData(db: SqlDriver): Promise<boolean> {
    const [tes, enrollments, events, hmisDrafts, metadataVersion] =
        await Promise.all([
            trackedEntitiesRowAdapter.loadAll(db),
            enrollmentsRowAdapter.loadAll(db),
            eventsRowAdapter.loadAll(db),
            getAllRows(db, "hmis_drafts"),
            getConfigRow(db, "metadata_versions", METADATA_VERSION_ID),
        ]);
    // A metadata sync on SQLite counts too: a device that pulled metadata
    // but has no tracker data yet must still carry that metadata (and its
    // lastMetadataPull) across, instead of taking the fresh-install
    // shortcut.
    return (
        tes.length > 0 ||
        enrollments.length > 0 ||
        events.length > 0 ||
        hmisDrafts.length > 0 ||
        metadataVersion !== undefined
    );
}

/**
 * Clears this migration's completion flag, so the NEXT boot on SQLite
 * copies Dexie's data again. Called whenever Dexie becomes the live store
 * (see `migrate-from-sqlite.ts`): from then on new data lands in Dexie,
 * and a stale flag here would make a later switch back to SQLite skip
 * copying it.
 */
export async function clearDexieMigrationFlag(db: SqlDriver): Promise<void> {
    await db.execute(`DELETE FROM ${MIGRATION_STATUS_TABLE} WHERE id = ?`, [
        MIGRATION_STATUS_ID,
    ]);
}
