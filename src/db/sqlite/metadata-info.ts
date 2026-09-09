import type {
    CategoryOptionCombo,
    DataElement,
    DataSet,
    FlattenedOptionGroup,
    FlattenedOptionSet,
    MetadataVersion,
    Program,
    ProgramRule,
    ProgramRuleVariable,
    TrackedEntityAttribute,
} from "../../schemas";
import type { SqlDriver } from "./driver-types";
import { createMetadataTableRowAdapter } from "./row-adapters/metadata-table";
import { optionGroupsRowAdapter } from "./row-adapters/option-groups";
import { optionSetsRowAdapter } from "./row-adapters/option-sets";
import { findOrgUnitsByPathPrefix, type OrgUnitRow } from "./row-adapters/organisation-units";

/**
 * SQLite equivalents of `checkInfo`/`queryInfo` (`src/utils/utils.ts:1500-
 * 1586`), per wayfinder ticket "How Does src/machines/sync.ts's Pull/Push
 * Logic Get Restructured for the New SQLite Adapter?" decision #4:
 * restructured into simpler generic helpers rather than a 1:1 port, since
 * the uniform metadata schema (ticket "SQLite Schema for MOHRegisterDB
 * Metadata Tables") removes most of the per-table special-casing Dexie
 * needed. Standalone and independently tested — not wired into sync.ts.
 */

const CHECKED_TABLES = [
    "data_elements",
    "tracked_entity_attribute_definitions",
    "program_rules",
    "program_rule_variables",
    "option_groups",
    "option_sets",
    "programs",
    "data_sets",
    "organisation_units",
    "category_option_combos",
] as const;

export async function tableHasRows(
    db: SqlDriver,
    tableName: string,
): Promise<boolean> {
    const result = await db.execute<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${tableName}`,
    );
    return (result.rows[0]?.count ?? 0) > 0;
}

async function anyTableEmpty(
    db: SqlDriver,
    tableNames: readonly string[],
): Promise<boolean> {
    for (const tableName of tableNames) {
        if (!(await tableHasRows(db, tableName))) {
            return true;
        }
    }
    return false;
}

export async function getRowById<T extends object>(
    db: SqlDriver,
    tableName: string,
    id: string,
): Promise<T | undefined> {
    const result = await db.execute<{ data: string }>(
        `SELECT data FROM ${tableName} WHERE id = ?`,
        [id],
    );
    return result.rows[0] ? (JSON.parse(result.rows[0].data) as T) : undefined;
}

export type CheckMetadataInfoResult = {
    needsSyncing: boolean;
    hasEmptyTables: boolean;
    wasDatabaseDeleted: boolean;
    metadataVersion: MetadataVersion | undefined;
    syncState: unknown;
    program: Program | undefined;
};

const SAFE_FALLBACK_RESULT: CheckMetadataInfoResult = {
    needsSyncing: true,
    hasEmptyTables: true,
    wasDatabaseDeleted: true,
    metadataVersion: undefined,
    syncState: undefined,
    program: undefined,
};

export async function checkMetadataInfo(
    db: SqlDriver,
): Promise<CheckMetadataInfoResult> {
    // Mirrors checkInfo's try/catch shape (src/utils/utils.ts:1536,1573-1586):
    // any query failure here is treated as "needs a full resync" rather than
    // propagating. checkInfo's catch ALSO deletes and reopens the Dexie
    // database on corruption — there's no equivalent here yet, since that
    // needs a driver-level "drop this database" capability the generic
    // SqlDriver interface doesn't expose. Deliberately deferred: whoever
    // wires this into sync.ts needs to decide what "corrupted OPFS database"
    // recovery looks like for SQLite specifically, not assume it inherits
    // Dexie's delete-and-reopen approach unchanged.
    try {
        const hasEmptyTables = await anyTableEmpty(db, CHECKED_TABLES);
        const metadataVersion = await getRowById<MetadataVersion>(
            db,
            "metadata_versions",
            "metadata-version",
        );
        const syncState = await getRowById(db, "sync_state", "current");
        const wasDatabaseDeleted = !metadataVersion?.lastSync;
        const [program] = await createMetadataTableRowAdapter<Program>(
            "programs",
            (r) => r.id,
        ).loadAll(db);

        return {
            needsSyncing: hasEmptyTables || wasDatabaseDeleted,
            hasEmptyTables,
            wasDatabaseDeleted,
            metadataVersion,
            syncState,
            program,
        };
    } catch {
        return SAFE_FALLBACK_RESULT;
    }
}

function groupByKey<T extends object>(
    rows: T[],
    key: keyof T,
): Map<string, T[]> {
    const map = new Map<string, T[]>();
    for (const row of rows) {
        const groupKey = String(row[key]);
        const bucket = map.get(groupKey) ?? [];
        bucket.push(row);
        map.set(groupKey, bucket);
    }
    return map;
}

export type QueryMetadataInfoResult = {
    dataElements: Map<string, DataElement>;
    trackedEntityAttributes: Map<string, TrackedEntityAttribute>;
    programRules: ProgramRule[];
    programRuleVariables: ProgramRuleVariable[];
    optionGroups: Map<string, FlattenedOptionGroup[]>;
    optionSets: Map<string, FlattenedOptionSet[]>;
    program: Program | undefined;
    dataSets: DataSet[];
    organisationUnits: OrgUnitRow[];
    categoryOptionCombos: CategoryOptionCombo[];
};

export async function queryMetadataInfo(
    db: SqlDriver,
    userOrgUnitPath: string,
): Promise<QueryMetadataInfoResult> {
    const [
        dataElements,
        trackedEntityAttributes,
        programRules,
        programRuleVariables,
        optionGroups,
        optionSets,
        programs,
        dataSets,
        categoryOptionCombos,
        organisationUnits,
    ] = await Promise.all([
        createMetadataTableRowAdapter<DataElement>(
            "data_elements",
            (r) => r.id,
        ).loadAll(db),
        createMetadataTableRowAdapter<TrackedEntityAttribute>(
            "tracked_entity_attribute_definitions",
            (r) => r.id,
        ).loadAll(db),
        createMetadataTableRowAdapter<ProgramRule>(
            "program_rules",
            (r) => r.id,
        ).loadAll(db),
        createMetadataTableRowAdapter<ProgramRuleVariable>(
            "program_rule_variables",
            (r) => r.id,
        ).loadAll(db),
        optionGroupsRowAdapter.loadAll(db),
        optionSetsRowAdapter.loadAll(db),
        createMetadataTableRowAdapter<Program>("programs", (r) => r.id).loadAll(
            db,
        ),
        createMetadataTableRowAdapter<DataSet>(
            "data_sets",
            (r) => r.id,
        ).loadAll(db),
        createMetadataTableRowAdapter<CategoryOptionCombo>(
            "category_option_combos",
            (r) => r.id,
        ).loadAll(db),
        findOrgUnitsByPathPrefix(db, userOrgUnitPath),
    ]);

    return {
        dataElements: new Map(dataElements.map((de) => [de.id, de])),
        trackedEntityAttributes: new Map(
            trackedEntityAttributes.map((ta) => [ta.id, ta]),
        ),
        programRules,
        programRuleVariables,
        optionGroups: groupByKey(optionGroups, "optionGroup"),
        optionSets: groupByKey(optionSets, "optionSet"),
        program: programs[0],
        dataSets,
        organisationUnits,
        categoryOptionCombos,
    };
}
