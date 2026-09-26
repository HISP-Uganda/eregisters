import { optionGroupKey } from "./sqlite/row-adapters/option-groups";
import { optionSetKey } from "./sqlite/row-adapters/option-sets";
import type { OrgUnitRow } from "./sqlite/row-adapters/organisation-units";
import { UNIFORM_METADATA_TABLES } from "./sqlite/schema";
import type { MetadataStore } from "./metadata-store";
import type {
    CategoryOptionCombo,
    DataElement,
    DataSet,
    FlattenedOptionGroup,
    FlattenedOptionSet,
    Metadata,
    MetadataVersion,
    Program,
    ProgramRule,
    ProgramRuleVariable,
    Resource,
    TrackedEntityAttribute,
} from "../schemas";

/**
 * Backend-agnostic equivalents of `src/db/sqlite/metadata-info.ts`/
 * `save-metadata.ts`/`delete-metadata.ts`/`reset-metadata-database.ts`,
 * operating purely through a `MetadataStore` (see `./metadata-store.ts`)
 * instead of a raw SQL `SqlDriver` — the piece that lets
 * `sync-metadata-actors.ts` work against either backend. Mirrors those
 * SQL-only functions' exact per-resource gating and reassembly logic;
 * only the storage calls differ.
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

export function keyForRow(table: string, row: { id: string }): string {
    if (table === "option_sets") return optionSetKey(row as FlattenedOptionSet);
    if (table === "option_groups")
        return optionGroupKey(row as FlattenedOptionGroup);
    return row.id;
}

async function tableHasRowsGeneric(
    store: MetadataStore,
    table: string,
): Promise<boolean> {
    const rows = await store.listRows(table);
    return rows.length > 0;
}

async function clearTable(store: MetadataStore, table: string): Promise<void> {
    await store.clearTable(table);
}

/**
 * Every metadata table a backend switch carries across (both directions:
 * `sqlite/migrate-from-dexie.ts` and `dexie/migrate-from-sqlite.ts`) —
 * everything the app writes through `MetadataStore` except `sync_state`/
 * `metadata_versions` (single rows, copied separately), `hmis_drafts`
 * (lives in Dexie's MOHRegisterDB on both backends) and `migration_status`
 * (per-backend bookkeeping).
 */
export const MIGRATED_METADATA_TABLES = [
    "programs",
    "data_elements",
    "tracked_entity_attribute_definitions",
    "program_indicators",
    "program_rules",
    "program_rule_variables",
    "category_option_combos",
    "data_sets",
    "organisation_units",
    "option_sets",
    "option_groups",
    "ui_config",
    "stage_hierarchy",
] as const;

/**
 * Makes `store`'s migrated metadata tables equal to `tables` (clear, then
 * write), so rows left over from an earlier stay on that backend don't
 * linger. No-op when `tables` holds no metadata at all — an empty source
 * must never wipe the target's metadata.
 */
export async function replaceMetadataTables(
    store: MetadataStore,
    tables: Record<string, unknown[]>,
): Promise<void> {
    const hasAny = MIGRATED_METADATA_TABLES.some(
        (table) => (tables[table]?.length ?? 0) > 0,
    );
    if (!hasAny) return;
    for (const table of MIGRATED_METADATA_TABLES) {
        await clearTable(store, table);
        await store.putRows(
            table,
            (tables[table] ?? []) as { id: string }[],
            (row) => keyForRow(table, row),
        );
    }
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

/** Generic equivalent of `src/db/sqlite/metadata-info.ts`'s `checkMetadataInfo`. */
export async function checkMetadataInfoGeneric(
    store: MetadataStore,
): Promise<CheckMetadataInfoResult> {
    try {
        let hasEmptyTables = false;
        for (const table of CHECKED_TABLES) {
            if (!(await tableHasRowsGeneric(store, table))) {
                hasEmptyTables = true;
                break;
            }
        }
        const metadataVersion = await store.getRow<MetadataVersion>(
            "metadata_versions",
            "metadata-version",
        );
        const syncState = await store.getRow("sync_state", "current");
        const wasDatabaseDeleted = !metadataVersion?.lastSync;
        const programs = await store.listRows<Program>("programs");

        return {
            needsSyncing: hasEmptyTables || wasDatabaseDeleted,
            hasEmptyTables,
            wasDatabaseDeleted,
            metadataVersion,
            syncState,
            program: programs[0],
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

/**
 * Generic equivalent of `queryMetadataInfo`. `organisation_units`'s SQL
 * indexed prefix query (`findOrgUnitsByPathPrefix`) becomes an in-memory
 * filter here — per-device org-unit counts are small (a facility's own
 * tree), so this is a disclosed performance tradeoff, not a correctness
 * gap.
 */
export async function queryMetadataGeneric(
    store: MetadataStore,
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
        organisationUnitsAll,
    ] = await Promise.all([
        store.listRows<DataElement>("data_elements"),
        store.listRows<TrackedEntityAttribute>(
            "tracked_entity_attribute_definitions",
        ),
        store.listRows<ProgramRule>("program_rules"),
        store.listRows<ProgramRuleVariable>("program_rule_variables"),
        store.listRows<FlattenedOptionGroup>("option_groups"),
        store.listRows<FlattenedOptionSet>("option_sets"),
        store.listRows<Program>("programs"),
        store.listRows<DataSet>("data_sets"),
        store.listRows<CategoryOptionCombo>("category_option_combos"),
        store.listRows<OrgUnitRow>("organisation_units"),
    ]);

    const organisationUnits = organisationUnitsAll
        .filter((row) => row.path.startsWith(userOrgUnitPath))
        .sort((a, b) => a.path.localeCompare(b.path));

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

/** Generic equivalent of `src/db/sqlite/save-metadata.ts`'s `saveMetadata`. */
export async function saveMetadataGeneric(
    store: MetadataStore,
    input: Metadata,
): Promise<void> {
    const succeeded = input.succeededResources ?? new Set<Resource>();
    const wrote = (resource: Resource) =>
        succeeded.size === 0 || succeeded.has(resource);

    const putAll = async <T extends { id: string }>(
        table: string,
        rows: T[],
        key?: (row: T) => string,
    ): Promise<void> => {
        await store.putRows(table, rows, key);
    };

    if (wrote("organisationUnits")) {
        await putAll("organisation_units", input.organisationUnits);
    }
    if (wrote("programs")) {
        await putAll("programs", input.programs);
    }
    if (wrote("dataElements")) {
        await putAll("data_elements", input.dataElements);
    }
    if (wrote("programIndicators")) {
        await putAll("program_indicators", input.programIndicators);
    }
    if (wrote("attributes")) {
        await putAll(
            "tracked_entity_attribute_definitions",
            input.trackedEntityAttributes,
        );
    }
    if (wrote("programRules")) {
        await putAll("program_rules", input.programRules);
    }
    if (wrote("programRuleVariables")) {
        await putAll("program_rule_variables", input.programRuleVariables);
    }
    if (wrote("optionSets")) {
        await putAll("option_sets", input.optionSets, optionSetKey);
    }
    if (wrote("optionGroups")) {
        await putAll("option_groups", input.optionGroups, optionGroupKey);
    }
    if (wrote("dataSets")) {
        await putAll("data_sets", input.dataSets);
    }
    if (wrote("categoryOptionCombos")) {
        await putAll("category_option_combos", input.categoryOptionCombos);
    }
    // Always writes, matching today's unconditional bookkeeping write.
    await putAll("metadata_versions", input.metadataVersion);
}

/** Generic equivalent of `src/db/sqlite/delete-metadata.ts`'s `deleteAllMetadata`. */
export async function deleteMetadataForResyncGeneric(
    store: MetadataStore,
    input: Metadata,
): Promise<void> {
    const succeeded = input.succeededResources ?? new Set<Resource>();
    const shouldClear = (resource: Resource) =>
        succeeded.size === 0 || succeeded.has(resource);

    if (shouldClear("organisationUnits")) {
        await clearTable(store, "organisation_units");
    }
    if (shouldClear("programs")) {
        await clearTable(store, "programs");
    }
    if (shouldClear("dataElements")) {
        await clearTable(store, "data_elements");
    }
    if (shouldClear("programIndicators")) {
        await clearTable(store, "program_indicators");
    }
    if (shouldClear("attributes")) {
        await clearTable(store, "tracked_entity_attribute_definitions");
    }
    if (shouldClear("programRules")) {
        await clearTable(store, "program_rules");
    }
    if (shouldClear("programRuleVariables")) {
        await clearTable(store, "program_rule_variables");
    }
    if (shouldClear("optionSets")) {
        await clearTable(store, "option_sets");
    }
    if (shouldClear("optionGroups")) {
        await clearTable(store, "option_groups");
    }
    if (shouldClear("dataSets")) {
        await clearTable(store, "data_sets");
    }
    if (shouldClear("categoryOptionCombos")) {
        await clearTable(store, "category_option_combos");
    }
    // Always runs, matching today's unconditional clear.
    await clearTable(store, "metadata_versions");
}

/**
 * Generic equivalent of `src/db/sqlite/reset-metadata-database.ts`'s
 * `resetMetadataDatabase` — see that file's doc comment for why
 * `hmis_drafts`/`migration_status` are deliberately excluded.
 */
export async function resetMetadataDatabaseGeneric(
    store: MetadataStore,
): Promise<void> {
    const tables = [
        ...UNIFORM_METADATA_TABLES.filter(
            (table) => table !== "hmis_drafts" && table !== "migration_status",
        ),
        "organisation_units",
        "option_sets",
        "option_groups",
    ];
    for (const table of tables) {
        await clearTable(store, table);
    }
}

/**
 * Distinct keys per migrated metadata table — the row count
 * `replaceMetadataTables` should leave in the target (composite-key
 * tables collapse duplicate source rows).
 */
export function distinctMetadataKeys(
    tables: Record<string, unknown[]>,
): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const table of MIGRATED_METADATA_TABLES) {
        const rows = (tables[table] ?? []) as { id: string }[];
        counts[table] = new Set(rows.map((row) => keyForRow(table, row))).size;
    }
    return counts;
}
