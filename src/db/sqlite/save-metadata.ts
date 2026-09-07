import type { Metadata, Resource } from "../../schemas";
import type { SqlDriver } from "./driver-types";

/**
 * Consolidated metadata write, per wayfinder ticket "How Does
 * src/machines/sync.ts's Pull/Push Logic Get Restructured for the New
 * SQLite Adapter?" decision #3: one shared `saveMetadataTable` function
 * (`INSERT OR REPLACE INTO <table> (id, data) VALUES (?, ?)` per row, one
 * transaction) replacing the 12+ near-identical per-resource `bulkPut`
 * calls in today's `src/machines/sync.ts:792-833`.
 *
 * Not yet wired into sync.ts itself — that integration is this ticket's own
 * deferred, separate scope. This is the standalone, independently-tested
 * piece ready for that later wiring.
 *
 * Deliberately does NOT reuse `createMetadataTableRowAdapter`'s insert/
 * update (code review flagged this as duplicated SQL shape): that adapter's
 * insert-vs-update split exists to support the collection-adapter's
 * diffing (distinguishing a genuinely new key from an existing one it's
 * updating), which doesn't apply here — a metadata pull always wants
 * unconditional upsert (`INSERT OR REPLACE`) regardless of whether a row
 * previously existed, since the whole resource set is being resynced.
 */

/** `INSERT OR REPLACE` every row into a uniform `id TEXT, data TEXT` table. */
export async function saveMetadataTable<T extends object>(
    db: SqlDriver,
    tableName: string,
    rows: T[],
    getId: (row: T) => string,
): Promise<void> {
    await db.transaction(async (tx) => {
        for (const row of rows) {
            await tx.execute(
                `INSERT OR REPLACE INTO ${tableName} (id, data) VALUES (?, ?)`,
                [getId(row), JSON.stringify(row)],
            );
        }
    });
}

/** Same as saveMetadataTable, but for the two composite-primary-key tables. */
async function saveCompositeKeyMetadataTable<T extends object>(
    db: SqlDriver,
    tableName: string,
    firstKeyColumn: string,
    secondKeyColumn: string,
    rows: T[],
    getFirstKey: (row: T) => string,
    getSecondKey: (row: T) => string,
): Promise<void> {
    await db.transaction(async (tx) => {
        for (const row of rows) {
            await tx.execute(
                `INSERT OR REPLACE INTO ${tableName} (${firstKeyColumn}, ${secondKeyColumn}, data) VALUES (?, ?, ?)`,
                [getFirstKey(row), getSecondKey(row), JSON.stringify(row)],
            );
        }
    });
}

async function saveOrganisationUnits(
    db: SqlDriver,
    rows: Metadata["organisationUnits"],
): Promise<void> {
    await db.transaction(async (tx) => {
        for (const row of rows) {
            const { id, name, path, ...rest } = row;
            await tx.execute(
                `INSERT OR REPLACE INTO organisation_units (id, name, path, data) VALUES (?, ?, ?, ?)`,
                [id, name, path, JSON.stringify(rest)],
            );
        }
    });
}

export async function saveMetadata(
    db: SqlDriver,
    input: Metadata,
): Promise<void> {
    const succeeded = input.succeededResources ?? new Set<Resource>();
    const wrote = (resource: Resource) =>
        succeeded.size === 0 || succeeded.has(resource);

    if (wrote("organisationUnits")) {
        await saveOrganisationUnits(db, input.organisationUnits);
    }
    if (wrote("programs")) {
        await saveMetadataTable(db, "programs", input.programs, (r) => r.id);
    }
    if (wrote("dataElements")) {
        await saveMetadataTable(
            db,
            "data_elements",
            input.dataElements,
            (r) => r.id,
        );
    }
    if (wrote("programIndicators")) {
        await saveMetadataTable(
            db,
            "program_indicators",
            input.programIndicators,
            (r) => r.id,
        );
    }
    if (wrote("attributes")) {
        await saveMetadataTable(
            db,
            "tracked_entity_attribute_definitions",
            input.trackedEntityAttributes,
            (r) => r.id,
        );
    }
    if (wrote("programRules")) {
        await saveMetadataTable(
            db,
            "program_rules",
            input.programRules,
            (r) => r.id,
        );
    }
    if (wrote("programRuleVariables")) {
        await saveMetadataTable(
            db,
            "program_rule_variables",
            input.programRuleVariables,
            (r) => r.id,
        );
    }
    if (wrote("optionSets")) {
        await saveCompositeKeyMetadataTable(
            db,
            "option_sets",
            "id",
            "option_set",
            input.optionSets,
            (r) => r.id,
            (r) => r.optionSet,
        );
    }
    if (wrote("optionGroups")) {
        await saveCompositeKeyMetadataTable(
            db,
            "option_groups",
            "id",
            "option_group",
            input.optionGroups,
            (r) => r.id,
            (r) => r.optionGroup,
        );
    }
    if (wrote("dataSets")) {
        await saveMetadataTable(db, "data_sets", input.dataSets, (r) => r.id);
    }
    if (wrote("categoryOptionCombos")) {
        await saveMetadataTable(
            db,
            "category_option_combos",
            input.categoryOptionCombos,
            (r) => r.id,
        );
    }
    // metadata-version bookkeeping always writes — its content only
    // reflects successful resources thanks to per-resource gating above,
    // matching today's Dexie behavior (src/machines/sync.ts:846-848).
    await saveMetadataTable(
        db,
        "metadata_versions",
        input.metadataVersion,
        (r) => r.id,
    );
}
