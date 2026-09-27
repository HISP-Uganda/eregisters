---
label: wayfinder:map
tracker: local-markdown
---

# Pull Data as a Reliable Incremental Sync

## Destination

Routine **Pull Data** reliably fetches only what changed since the last
successfully persisted checkpoint — on every boot path, after a store
copy, and across reloads — so users no longer need **Pull All Data**,
which is retired in favour of a confirmed "Re-download all data…"
(see the Phase 3 ticket for why it isn't admin-only).
IMPLEMENTATION_PLAN Phases 1–3 (R1, R2, R12, R13, R8, R3).

Done = the `sync.ts` boot path loads the data *and* push checkpoints
whether or not metadata needs syncing; the checkpoint is persisted as an
awaited state that reverts on failure; each pull emits one structured
`sync.pullData` log line; the Pull All Data menu item is gone and an
admin can reset the checkpoint behind a confirmation; and network
evidence from the real server shows a second Pull Data transferring no
historical records.

## Notes

- **Execution is carried into this map** (plan-and-build): each ticket
  decides, then implements, on branch `fix/pull-data-incremental` off
  `main`. **One commit/PR per phase** (Phase 1 = the checkpoint fix,
  alone) — IMPLEMENTATION_PLAN's "ship the smallest data-safety fix
  first". Its "prove each phase for a release cycle" gate is the
  maintainer's release process, not a ticket.
- Source docs: `docs/IMPLEMENTATION_PLAN.md` (Phases 1–3),
  `docs/INDEXEDDB_TO_OPFS_SQLITE_MIGRATION_INVESTIGATION.md` (§4 B1–B8,
  §6 R1–R3/R8/R12/R13), `docs/code-analysis.md` (§20–29 Pull Data
  requirements, §27 network acceptance test).
- Code: `src/machines/sync.ts` (`checkIndexDB` onDone branches,
  `persistSyncState`, `pullData`, `updateLastDataPull`,
  `FULL_DATA_SYNC`/`fullRefresh`/`deleteAllData`),
  `src/machines/sync-metadata-mode.ts` (`shouldUseLastDataPull` — keep
  these helpers, per CLAUDE.md), `src/machines/sync-metadata-actors.ts`
  (`persistCurrentSyncState` rewrites the WHOLE `sync_state` row),
  `src/routes/__root.tsx` (Pull Data button + "Pull All Data" dropdown
  item, "last pulled X ago" label already present),
  `src/routes/admin.app-settings.tsx` (admin area gated on `ALL`).
- Facts established while charting:
  - R1 is worse than documented: on the `needsSyncing` boot branch
    neither `lastDataPull` nor `lastDataPush` is loaded, and the next
    `persistCurrentSyncState` overwrites the row — **erasing the push
    checkpoint too**.
  - No sync-machine tests exist (`sync.test.ts` covers only
    `deriveValidIds`) — Phase 1 builds the scaffolding.
  - The storage-boot machine (map "Storage Migration as an XState
    Machine", on `main`) already carries `lastPullAt` across store
    copies and logs it in `storage.boot`.
- Real-server verification is done in the maintainer's Chrome against
  the dev proxy (`pnpm start`), read-only GETs, same technique as the
  storage cutover smoke.
- Pull Data and Pull All Data are both non-destructive merges; never
  truncate local rows (memory: pull semantics).
- Invoke `/grilling` and `/domain-modeling` for grilling tickets.

## Decisions so far

<!-- one line per closed ticket -->

- [Load and persist the data checkpoint correctly on every boot path (Phase 1)](tickets/001-checkpoint-fix.md) — both boot branches load pull+push checkpoints with no metadata-driven reset; checkpoints advance only after an awaited single-field `patchSyncState` write (serialized, so parallel pull/push can't clobber or erase each other); first whole-machine sync tests (failing-then-passing); real server: second pull sends the saved boundary and returns 0 of 1 records, and the needsSyncing boot path keeps both checkpoints.
- [What does the sync.pullData log line record? (Phase 2)](tickets/003-pull-observability.md) — one `console.info("sync.pullData", …)` per attempt from inside the actor: outcome (offline only for real network FetchErrors), mode as actually sent, checkpoint from/to, server total, fetched TE/enrollment/event counts, pages, duration.
- [Retire Pull All Data behind an admin "Reset sync checkpoint" (Phase 3)](tickets/004-retire-pull-all.md) — not admin-only (the admin page is fleet-wide and would reset the admin's own device): "Pull All Data" became a confirmed "Re-download all data…" for every user via `RESET_DATA_CHECKPOINT` (clears only the pull checkpoint, pulls immediately, keeps local rows); checkpoints are now scope-keyed so an org-unit change triggers a full pull automatically; `FULL_DATA_SYNC`/`fullRefresh`/`deleteAllData` removed.
- [How does the DHIS2 tracker API interpret updatedAfter?](tickets/002-updatedafter-semantics.md) — server is 2.41+; a zone-less `updatedAfter` is read in server time, inclusive, ms precision, filtered on the TE's own lastUpdated (child changes bump it) — so the app's verbatim-`serverDate` checkpoint is correct as-is; deletes need `includeDeleted` (R5); an optional overlap window would close a small import-commit gap the Android SDK also accepts.

## Not yet specified

<!-- none -->

## Out of scope

- IMPLEMENTATION_PLAN Phases 4–5 — pull mutex (R4), fetch timeouts
  (R17, partly done by the offline-resilience map), cached `me` (R10),
  offline toasts (R15), reconnect-driven sync (R16): offline robustness,
  a separate concern from incremental correctness.
- R5 applying server tombstones on merge — deferred until users report
  "deleted records still appearing". Research confirmed deletes are
  invisible without `includeDeleted=true`; add that flag only together
  with tombstone handling.
- Migrating `ouMode=SELECTED` → `orgUnitMode` (deprecated in DHIS2 2.41,
  removed in 2.42) — not Pull Data correctness, but **more urgent than
  first thought**: the Phase 1 smoke showed production is already
  **2.42** (`/api/42/`) and `ouMode=SELECTED` requests still return 200,
  so the server is likely ignoring it and applying its default org-unit
  mode. Verify the pulled scope and migrate soon (separate effort).
- R9 per-program checkpoints — deferred until a second program is
  enabled.
- Migration-cleanup / store-copy concerns — done by the "Storage
  Migration as an XState Machine" map.
