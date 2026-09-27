---
title: Load and persist the data checkpoint correctly on every boot path (Phase 1)
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Design and implement IMPLEMENTATION_PLAN Phase 1 in `src/machines/sync.ts`:

- **R1** — the `needsSyncing` branch of `checkIndexDB` must load
  `lastDataPull` / `lastDataPush` from `syncState` too. Decide the one
  deliberate exception: what does `wasDatabaseDeleted` mean today (with
  the storage-boot machine carrying `sync_state` across copies), and
  should it still reset the data checkpoint?
- **R2** — replace the fire-and-forget `persistSyncState` with an
  awaited `persistingCheckpoint` state: shape of the invoked actor, what
  in-memory values revert to on failure, and whether push
  (`lastDataPush`) goes through the same state.
- **R12** — never advance `lastDataPull` on an unhealthy pull output.
- **R13** — the invariant comment on `pullData`.
- **Test scaffolding** — the first whole-machine tests for `sync.ts`
  (fake actors via `provide`, per the storage map's XState research):
  plan Tests A–E.
- **Verification** — real-server network evidence (`code-analysis.md`
  §27): second boot / second Pull Data sends `updatedAfter` and returns
  no historical records; checkpoint survives reload.

Then implement as one commit on `fix/pull-data-incremental`.

## Resolution

Grilled 2026-09-27. Facts that changed the plan's recipe:
`wasDatabaseDeleted` is `!metadataVersion?.lastSync` ("no metadata
checkpoint"), not a deleted database; the pull and push regions run in
parallel and both rewrote the whole `sync_state` row; `pullData` returns
only the boundary string (no `connectivityStatus`) and throws on every
failure path.

1. **R1** — both `checkIndexDB` branches load `lastDataPull` and
   `lastDataPush` from `sync_state`, **no exception**: metadata state never
   resets the data position (the plan's `wasDatabaseDeleted` exception
   would have turned every metadata repair into a full data re-download).
2. **R2** — pending value, not assign-then-revert: `pullData` → context
   `pendingDataPull` → `updateLastDataPull` invokes `persistCheckpoint`;
   `lastDataPull` is assigned only on `onDone`; on `onError` it's logged
   and the previous value stays (next pull re-fetches the same window —
   idempotent). Push identical via `pendingDataPush` /
   `updateLastDataPush`. `persistSyncState` action removed.
3. **Single-field writes** — `persistCurrentSyncState` replaced by
   `patchSyncState(store, { lastPullAt } | { lastPushAt })` in
   `sync-metadata-actors.ts`: read-merge-write through a module-level
   queue, rejects on failure. Fixes the parallel-region clobber and the
   push-checkpoint erasure at the source.
4. **R12 / R13** — no new guard needed (failures throw; missing server
   date keeps the previous boundary); invariant comment on `pullData`,
   covered by test E.
5. **Tests** — first whole-machine tests for `sync.ts`
   (`src/machines/__tests__/sync-checkpoint.test.ts`, 7 tests: A, B
   (R1), C (wasDatabaseDeleted never resets), boundary sent + persisted
   before advancing, D (failed persist keeps previous), E (failed pull
   advances nothing), pull/push never erase each other). Real SQLite
   metadata store; all other actors faked. **Failing-then-passing
   verified**: with R1 reverted, B, C and the pull/push test fail.
   `patchSyncState` unit tests (merge, concurrent patches, failed write).
   `syncMachine` is now exported for tests.
   Full suite 60 files / 437 tests; `pnpm build` + 6 SW sentinels.
6. **Real-server evidence** (maintainer's Chrome, dev proxy, read-only):
   - Pull 1 sent `updatedAfter=2026-09-26T20:53:38.153` (stored value,
     verbatim, zone-less); saved `2026-09-27T13:22:23.778`.
   - Pull 2 sent `updatedAfter=2026-09-27T13:22:23.778`; replaying both
     windows with `fields=trackedEntity`: **0** records each vs **1**
     unfiltered — no historical re-download.
   - R1 path: deleted the local metadata checkpoint + seeded a
     `lastPushAt` marker, reloaded → full metadata re-sync
     (`needsSyncing`); next pull sent
     `updatedAfter=2026-09-27T13:22:55.025` (the pre-reload checkpoint),
     saved `13:25:13.549`, and **`lastPushAt` survived**. Marker removed
     afterwards. Reload persistence shown by the same run.
   - Server is **DHIS2 2.42** (`/api/42/`).

Uncommitted → committed with the map updates on `fix/pull-data-incremental`.
