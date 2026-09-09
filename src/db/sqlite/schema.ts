import type { SqlDriver } from "./driver-types";

/**
 * SQLite schema for the Dexie-to-OPFS-SQLite migration.
 *
 * Tracker tables (tracked entities/enrollments/events) per wayfinder ticket
 * "Normalized SQLite Schema for Tracker Collections": parent tables plus
 * per-field child tables for attributes/dataValues, each carrying a
 * `source: 'local' | 'server'` column that replicates today's per-key merge
 * granularity (src/db/merge-utils.ts).
 *
 * Metadata tables per wayfinder ticket "SQLite Schema for MOHRegisterDB
 * Metadata Tables": a uniform `id TEXT PRIMARY KEY, data TEXT` shape for the
 * 15 tables confirmed to be accessed only via whole-table reads/writes
 * today, with `organisation_units` and `indicator_evaluations` as the two
 * confirmed exceptions. `metadataSyncProgress` was confirmed dead and is not
 * created here.
 */

export const TRACKER_SCHEMA_STATEMENTS: readonly string[] = [
    `CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        surname TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS tracked_entities (
        tracked_entity TEXT PRIMARY KEY,
        tracked_entity_type TEXT NOT NULL,
        org_unit TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        created_by_uid TEXT REFERENCES users(uid),
        updated_by_uid TEXT REFERENCES users(uid),
        inactive INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER NOT NULL DEFAULT 0,
        potential_duplicate INTEGER NOT NULL DEFAULT 0,
        parent_entity TEXT,
        last_synced TEXT,
        sync_error TEXT,
        version INTEGER NOT NULL DEFAULT 0,
        sync_status TEXT NOT NULL CHECK (sync_status IN
            ('draft','pending','syncing','synced','failed','deleted','editing'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_te_org_unit ON tracked_entities(org_unit)`,
    `CREATE INDEX IF NOT EXISTS idx_te_sync_status ON tracked_entities(sync_status)`,
    `CREATE INDEX IF NOT EXISTS idx_te_parent_entity ON tracked_entities(parent_entity)`,
    `CREATE TABLE IF NOT EXISTS tracked_entity_attributes (
        tracked_entity TEXT NOT NULL REFERENCES tracked_entities(tracked_entity),
        attribute TEXT NOT NULL,
        value TEXT,
        display_name TEXT,
        value_type TEXT,
        created_at TEXT,
        updated_at TEXT,
        source TEXT NOT NULL CHECK (source IN ('local','server')),
        PRIMARY KEY (tracked_entity, attribute)
    )`,
    `CREATE TABLE IF NOT EXISTS enrollments (
        enrollment TEXT PRIMARY KEY,
        tracked_entity TEXT NOT NULL REFERENCES tracked_entities(tracked_entity),
        program TEXT NOT NULL,
        org_unit TEXT NOT NULL,
        status TEXT NOT NULL,
        enrolled_at TEXT NOT NULL,
        occurred_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        created_by_uid TEXT REFERENCES users(uid),
        updated_by_uid TEXT REFERENCES users(uid),
        follow_up INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        last_synced TEXT,
        sync_error TEXT,
        version INTEGER NOT NULL DEFAULT 0,
        sync_status TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_enr_tracked_entity ON enrollments(tracked_entity)`,
    `CREATE INDEX IF NOT EXISTS idx_enr_program ON enrollments(program)`,
    `CREATE INDEX IF NOT EXISTS idx_enr_org_unit ON enrollments(org_unit)`,
    `CREATE INDEX IF NOT EXISTS idx_enr_sync_status ON enrollments(sync_status)`,
    `CREATE TABLE IF NOT EXISTS enrollment_attributes (
        enrollment TEXT NOT NULL REFERENCES enrollments(enrollment),
        attribute TEXT NOT NULL,
        value TEXT,
        display_name TEXT,
        value_type TEXT,
        created_at TEXT,
        updated_at TEXT,
        source TEXT NOT NULL CHECK (source IN ('local','server')),
        PRIMARY KEY (enrollment, attribute)
    )`,
    `CREATE TABLE IF NOT EXISTS events (
        event TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        program TEXT NOT NULL,
        program_stage TEXT NOT NULL,
        enrollment TEXT NOT NULL REFERENCES enrollments(enrollment),
        tracked_entity TEXT NOT NULL REFERENCES tracked_entities(tracked_entity),
        org_unit TEXT NOT NULL,
        parent_event TEXT REFERENCES events(event),
        occurred_at TEXT NOT NULL,
        follow_up INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        attribute_option_combo TEXT,
        attribute_category_options TEXT,
        completed_by TEXT,
        completed_at TEXT,
        created_by_uid TEXT REFERENCES users(uid),
        updated_by_uid TEXT REFERENCES users(uid),
        notes TEXT,
        last_synced TEXT,
        sync_error TEXT,
        version INTEGER NOT NULL DEFAULT 0,
        sync_status TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_events_hot_path ON events(org_unit, program, program_stage)`,
    `CREATE INDEX IF NOT EXISTS idx_events_enrollment ON events(enrollment)`,
    `CREATE INDEX IF NOT EXISTS idx_events_tracked_entity ON events(tracked_entity)`,
    `CREATE INDEX IF NOT EXISTS idx_events_parent_event ON events(parent_event)`,
    `CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON events(occurred_at)`,
    `CREATE INDEX IF NOT EXISTS idx_events_sync_status ON events(sync_status)`,
    `CREATE TABLE IF NOT EXISTS event_data_values (
        event TEXT NOT NULL REFERENCES events(event),
        data_element TEXT NOT NULL,
        value TEXT,
        stored_by TEXT,
        provided_elsewhere INTEGER,
        created_at TEXT,
        updated_at TEXT,
        created_by_uid TEXT REFERENCES users(uid),
        updated_by_uid TEXT REFERENCES users(uid),
        source TEXT NOT NULL CHECK (source IN ('local','server')),
        PRIMARY KEY (event, data_element)
    )`,
    `CREATE TABLE IF NOT EXISTS rule_results (
        id TEXT PRIMARY KEY,
        assignments TEXT NOT NULL,
        hidden_fields TEXT NOT NULL,
        shown_fields TEXT NOT NULL,
        hidden_sections TEXT NOT NULL,
        shown_sections TEXT NOT NULL,
        mandatory_fields TEXT NOT NULL,
        hidden_options TEXT NOT NULL,
        shown_options TEXT NOT NULL,
        hidden_option_groups TEXT NOT NULL,
        shown_option_groups TEXT NOT NULL,
        errors TEXT NOT NULL,
        warnings TEXT NOT NULL,
        messages TEXT NOT NULL
    )`,
];

/** Metadata tables sharing the uniform `id TEXT PRIMARY KEY, data TEXT` shape. */
export const UNIFORM_METADATA_TABLES: readonly string[] = [
    "programs",
    "data_elements",
    "tracked_entity_attribute_definitions",
    "program_indicators",
    "program_rules",
    "program_rule_variables",
    "category_option_combos",
    "data_sets",
    "metadata_versions",
    "sync_state",
    "ui_config",
    "stage_hierarchy",
    "hmis_drafts",
    "migration_status",
];

export const METADATA_SCHEMA_STATEMENTS: readonly string[] = [
    ...UNIFORM_METADATA_TABLES.map(
        (table) =>
            `CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, data TEXT NOT NULL)`,
    ),
    `CREATE TABLE IF NOT EXISTS option_sets (
        id TEXT NOT NULL,
        option_set TEXT NOT NULL,
        data TEXT NOT NULL,
        PRIMARY KEY (id, option_set)
    )`,
    `CREATE TABLE IF NOT EXISTS option_groups (
        id TEXT NOT NULL,
        option_group TEXT NOT NULL,
        data TEXT NOT NULL,
        PRIMARY KEY (id, option_group)
    )`,
    `CREATE TABLE IF NOT EXISTS organisation_units (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        data TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_ou_path ON organisation_units(path)`,
    `CREATE TABLE IF NOT EXISTS indicator_evaluations (
        id TEXT PRIMARY KEY,
        event_id TEXT,
        data TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_indicator_evaluations_event_id ON indicator_evaluations(event_id)`,
];

export const ALL_SCHEMA_STATEMENTS: readonly string[] = [
    ...TRACKER_SCHEMA_STATEMENTS,
    ...METADATA_SCHEMA_STATEMENTS,
];

export async function createSchema(driver: SqlDriver): Promise<void> {
    for (const statement of ALL_SCHEMA_STATEMENTS) {
        await driver.execute(statement);
    }
}
