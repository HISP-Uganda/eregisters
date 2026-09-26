/**
 * The dual-backend contract for metadata/config tables (programs,
 * dataElements, optionSets, orgUnits, uiConfig, stageHierarchy,
 * syncState, ...) — per wayfinder ticket "Storage abstraction shape for
 * dual backend" (`docs/wayfinder/opfs-dexie-dual-backend/tickets/001-storage-abstraction-shape.md`),
 * Answer #2: metadata goes dual-backend too (a device that fails over for
 * tracker data but can't load metadata can't render any form), via a small
 * `get`/`put`/`listRows` interface rather than a TanStack DB collection —
 * metadata is loaded once into `SyncContext`'s XState context
 * (`src/hooks/useMetadata.ts`), never queried as a reactive collection, so
 * collection-level machinery doesn't apply to it.
 *
 * Covers the uniform "id + JSON blob" table shape shared by most metadata
 * tables (confirmed by the sibling `dexie-to-opfs-sqlite` map's ticket
 * "SQLite Schema for MOHRegisterDB Metadata Tables": 15 of 18 tables are
 * this shape). `organisation_units` (real `id`/`name`/`path` columns) and
 * the two composite-key tables (`option_sets`, `option_groups`, keyed on
 * `(id, <group>)` since a single `id` can repeat under a different group)
 * are NOT fully covered by this generic facade yet — `getRow`/`putRow`
 * still address them by their own `id` (DHIS2 UIDs are globally unique
 * across a table), but a `putRow` on `organisation_units` through this
 * interface would need the SQL implementation to reconstruct real
 * columns from the blob, which it does not do today. Documented gap, not
 * silently mishandled — whoever wires this into `sync-metadata-actors.ts`/
 * `config-rows.ts` needs to resolve it for those two-plus-one tables
 * specifically.
 *
 * Wired into `sync-metadata-actors.ts` via `src/db/metadata-operations.ts`'s
 * generic save/query/check/delete/reset functions, as part of the broader
 * `sync.ts` backend-agnostic rewiring (see the map's former "Not yet
 * specified" note — `src/machines/sync.ts` had 52 direct
 * `sqlDriver: SqlDriver` references, and CLAUDE.md calls this file
 * load-bearing).
 *
 * `organisation_units`'s indexed path-prefix query stays SQL-only
 * (`findOrgUnitsByPathPrefix`, unrelated to this interface — `queryMetadata`
 * in `metadata-operations.ts` filters `listRows("organisation_units")` by
 * path in memory instead for both backends, since per-device org-unit
 * counts are small). `option_sets`/`option_groups`' composite `(id, group)`
 * primary key is handled via `putRow`'s optional `key` param — callers
 * compute a synthetic composite key (`optionSetKey`/`optionGroupKey`,
 * `src/db/sqlite/row-adapters/option-{sets,groups}.ts`) and pass it
 * explicitly; the stored row itself keeps its real `id`/`optionSet` fields
 * untouched.
 */
export interface MetadataStore {
    getRow: <T extends object>(
        table: string,
        id: string,
    ) => Promise<T | undefined>;
    /**
     * `key` defaults to `row.id` — pass an explicit composite key (e.g.
     * `optionSetKey(row)`) for the two composite-key tables, since a plain
     * `id` is not unique across different option sets/groups.
     */
    putRow: <T extends { id: string }>(
        table: string,
        row: T,
        key?: string,
    ) => Promise<void>;
    /**
     * Bulk `putRow` — same semantics per row, but written as one batch
     * (one SQL transaction / one Dexie bulkPut) instead of one
     * transaction per row, which dominated metadata-sync time. `keyOf`
     * plays `putRow`'s `key` role for the composite-key tables.
     */
    putRows: <T extends { id: string }>(
        table: string,
        rows: T[],
        keyOf?: (row: T) => string,
    ) => Promise<void>;
    listRows: <T extends object>(table: string) => Promise<T[]>;
    deleteRow: (table: string, key: string) => Promise<void>;
    /** Deletes every row of `table` in one operation. */
    clearTable: (table: string) => Promise<void>;
}
