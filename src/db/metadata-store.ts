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
 * Not yet wired into `sync-metadata-actors.ts`/`config-rows.ts` (which
 * still call `SqlDriver`-based functions directly) — that wiring is
 * deferred alongside `sync.ts`'s broader backend-agnostic rewiring (see
 * the map's "Not yet specified": `src/machines/sync.ts` has 52 direct
 * `sqlDriver: SqlDriver` references, and CLAUDE.md calls this file
 * load-bearing). This interface and its two implementations exist and are
 * independently correct/tested now, ready for that later wiring.
 */
export interface MetadataStore {
    getRow: <T extends object>(
        table: string,
        id: string,
    ) => Promise<T | undefined>;
    putRow: <T extends { id: string }>(table: string, row: T) => Promise<void>;
    listRows: <T extends object>(table: string) => Promise<T[]>;
}
