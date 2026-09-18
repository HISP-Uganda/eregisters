import type { WaSqliteParams, WaSqliteStatementResult } from "./wa-sqlite-adapter";

/**
 * Message protocol between `wa-sqlite-driver.ts` (main thread, one per
 * tab) and `wa-sqlite-worker.ts` (the dedicated Worker that actually
 * owns the wa-sqlite/OPFSCoopSyncVFS connection). Deliberately minimal —
 * unlike mohw-nas's own worker protocol (mutation-ID reconciliation,
 * generation/schema-version fencing, cross-tab BroadcastChannel
 * notifications), eregisters' map explicitly scoped this migration to
 * "swap the driver," not import that broader coordination architecture
 * (`docs/wayfinder/wa-sqlite-multi-tab/map.md`'s "Decisions so far").
 *
 * `begin`/`commit`/`rollback` exist because `SqlDriver.transaction(fn)`
 * callers call `tx.execute()` multiple times against ONE open
 * transaction (see `src/db/sqlite/collection-adapter.ts`,
 * `delete-cascade.ts`, etc.) — the worker keeps that transaction open
 * across several separate request/response round-trips from the main
 * thread, rather than requiring the whole transaction to travel as one
 * opaque message the way mohw-nas's higher-level `saveTrackerTransaction`-
 * style methods do. The worker's own request queue
 * (`wa-sqlite-worker.ts`) already serializes one request at a time per
 * tab, so no request can interleave inside an open transaction.
 */
export type WaSqliteRequest =
    | { id: number; type: "execute"; sql: string; params?: WaSqliteParams }
    | { id: number; type: "begin" }
    | { id: number; type: "commit" }
    | { id: number; type: "rollback" };

/** `Omit<WaSqliteRequest, "id">`, distributed over the union — a plain
 * `Omit` collapses to the shared-fields-only shape instead. */
export type WaSqliteRequestBody =
    | { type: "execute"; sql: string; params?: WaSqliteParams }
    | { type: "begin" }
    | { type: "commit" }
    | { type: "rollback" };

export type WaSqliteResponse =
    | { id: number; ok: true; result: WaSqliteStatementResult }
    | { id: number; ok: false; error: string };
