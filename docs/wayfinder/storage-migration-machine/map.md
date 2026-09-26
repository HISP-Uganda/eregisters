---
label: wayfinder:map
tracker: local-markdown
---

# Storage Migration as an XState Machine

## Destination

The imperative `bootstrap()` in `src/App.tsx` — backend resolution plus
the Dexie→SQLite (`runDexieMigrationIfNeeded`) and SQLite→Dexie
(`attemptReverseMigrationIfNeeded` / `runSqliteMigrationIfNeeded`)
copies — is replaced by one standalone **storage-boot XState machine**
whose states follow `docs/code-analysis.md` §5 (detect → copy tracker →
copy sync state → copy metadata → verify → mark complete → cleanup →
ready | failed), each step an invoked actor. It runs to completion
before `SyncContext.Provider` mounts and hands `{backend, metadataStore,
sqlDriver}` to the sync machine as input, preserving today's "sync never
races migration" guarantee. Folded in: R7 (retryable `cleanupPending`),
R11 (continue-with-legacy escape hatch after repeated failures), and
§15 structured migration logging.

Done = `bootstrap()` and `migration-progress.ts` are gone, the banner
reads the machine snapshot, the existing migrate-from-dexie /
migrate-from-sqlite test suites pass against the new step actors, and
`code-analysis.md` §14 tests 1–12 are covered by Vitest machine tests.

## Notes

- **Execution is carried into this map** (override of wayfinder's
  plan-only default, matching this repo's earlier maps): each ticket
  resolves its decision and then implements it on a feature branch
  (`feature/storage-migration-machine`).
- Source docs: `docs/code-analysis.md` (§5 state model, §6 invariants,
  §13 validation, §14 tests, §15 logging),
  `docs/INDEXEDDB_TO_OPFS_SQLITE_MIGRATION_INVESTIGATION.md` (§2.3–2.4
  current boot/migration flow, A5/R7, O-Gap-2/R11),
  `docs/IMPLEMENTATION_PLAN.md` (Phase 4 R7/R11 specifics).
- Code: `src/App.tsx` (`bootstrap`), `src/db/backend.ts`,
  `src/db/sqlite/migrate-from-dexie.ts`,
  `src/db/dexie/migrate-from-sqlite.ts`, `src/db/migration-progress.ts`,
  `src/components/migration-progress-banner.tsx`. Machine conventions:
  `src/machines/` (XState v5, `createActorContext`).
- Settled while charting:
  - One machine covers backend resolution **and both copy
    directions**.
  - **Fine-grained states** per §5; the `run*IfNeeded` wrappers
    dissolve, their helper functions become step actors.
  - It is a **standalone boot machine**, not a child of `sync.ts`.
  - The progress UI reads the machine snapshot; the
    `migration-progress.ts` pub/sub is retired.
  - Interrupted migrations **restart from scratch** (idempotent copy +
    `cleanUpPartialWrite`), not per-stage resume.
  - Tests: Vitest with `machine.provide({ actors })` fakes; the
    existing migration suites stay green throughout.
- Standing constraints: §6 invariants A–G are non-negotiable (never
  drop the source before `markComplete`); `MOHRegisterDB` is never
  dropped (HMIS drafts live there on both backends); don't touch
  `sync.ts` beyond consuming the handoff; no new dependencies.
- Invoke `/grilling` and `/domain-modeling` for grilling tickets.

## Decisions so far

<!-- one line per closed ticket -->

- [Design the storage-boot machine's state chart](tickets/001-state-chart.md) — one shared `copying` compound state driven by `StoreCopySteps` for both directions; failed copy falls back to the source store for the session on `auto`, stops in `failed` (RETRY) when forced; rollback/cleanup failures are logged, never fatal (fixing a real rollback-after-markComplete data-loss bug); cross-tab Web Lock; singleton actor, `output` hand-off. Implemented with 14 new tests; `App.tsx` not yet cut over.
- [How does the progress UI read the machine, and is the __root.tsx banner still needed?](tickets/003-progress-ui.md) — one pure `bootView(snapshot)` feeds a `StorageBootScreen` (step-n-of-m counter, no table names; Retry on `failed`) and a `StorageFallbackNotice` that replaces the unreachable `__root.tsx` progress banner, shown only after a session fallback. Built alongside the old UI; wiring left to cutover.
- [How is legacy-store cleanup made retryable (R7 cleanupPending)?](tickets/004-cleanup-pending.md) — no flag: "cleanup owed" is derived (copy current + source still holds data), so legacy devices are caught too; `detect` returns `cleanup-owed` → cleanup-only retry every boot; new `prepareTarget` step drops a target's stale leftovers before copying into it, closing a deleted-row resurrection path; `cleanedAt` cache spares Dexie boots a Worker start.
- [Escape hatch after repeated migration failures (R11)](tickets/005-escape-hatch.md) — `auto` stops re-running a copy after 3 consecutive failures (per-direction localStorage count, reset on success or by bumping `STORE_COPY_RETRY_VERSION`) and boots straight onto the previous store with a "paused" notice; forced settings' `failed` screen adds a session-only "Continue on previous storage for now" beside Retry. Setting never written.
- [What structured logs does the migration machine emit?](tickets/006-migration-logging.md) — exactly one `console.info("storage.boot", …)` per boot (ready/failed/unavailable) with setting, backend, outcome, fallback, duration and, when a copy ran, direction/verdict/result, per-table row counts, the sync checkpoint carried across (`copyConfig` now returns it), failed step and rollback/cleanup status — counts and timestamps only.
- [Map code-analysis §14 tests onto machine tests](tickets/007-test-matrix.md) — matrix recorded (all of §14 covered except Test 8, out of scope, and browser-only items → cutover smoke); Test 12 = rows missing a NOT NULL reference, now caught before writing with a precise error; the new interrupted-copy test exposed and fixed a stuck-forever bug (forward writes inserted instead of upserting at boot).
- [What must the verifying state check beyond tracker ids?](tickets/009-validation-depth.md) — verify now also reads back the sync checkpoint and counts nested attribute/data-value rows (both fail the copy on loss); metadata shortfalls don't fail but clear `lastMetadataSync` so the next metadata sync is a full, repairing pull (`metadataRepull` in the boot log). No value-by-value comparison.
- [Cut App.tsx over to the storage-boot actor](tickets/008-cutover.md) — `bootstrap()` and the old progress pub/sub/banner/wrappers deleted in one change; boot starts in `MyApp` alongside `me`; build + SW sentinels OK; all 8 real-browser smoke scenarios pass (fresh, forward, reopen, leftover cleanup, reverse, killed mid-copy, two-tab lock, forced failure + Retry/Continue).
- [How do XState v5 invoked promise actors behave on interruption, and how are they tested?](tickets/002-xstate-invoke-interruption.md) — stopping aborts `signal` but the promise keeps running, and @xstate/react remounts re-invoke it (double copy); host as a module-level singleton actor read via `useSelector`, add a Web Lock around the copy, test via `provide` + `waitFor` with timeout, hand off via machine `output`, model failure as states.

## Not yet specified

<!-- none — every patch graduated or was ruled out of scope -->

## Out of scope

- IMPLEMENTATION_PLAN Phases 1–6 in `sync.ts` (R1/R2 checkpoint fixes,
  retiring Pull All Data, pull mutex, offline UX, tombstones) — separate
  effort; Phase 1 should ship on its own ahead of this refactor.
- Per-stage resumable migration (persisted cursors) — ruled out in
  favour of restart-from-scratch; revisit only if large installs prove
  the copy too slow.
- Rewriting the copy helpers' SQL/Dexie internals.
- Driving an admin backend switch through the machine without a page reload — setting change + reload already runs the copies correctly (cutover smoke scenarios 2 and 5); a live switch would mean tearing down collections and the sync machine, beyond this destination. Ruled out after [Cut App.tsx over to the storage-boot actor](tickets/008-cutover.md).
- `auto`'s permanent OPFS-failure cache (`backend.ts`): one transient first-open failure pins a new device to Dexie forever — pre-existing backend-resolution policy, found during the cutover smoke; belongs to the admin storage-backend policy effort, see [Cut App.tsx over to the storage-boot actor](tickets/008-cutover.md).
- Persisting the `storage.boot` summary for support staff (e.g. an admin-settings view) — a new feature, not part of moving the copy into a machine; ruled out in [What structured logs does the migration machine emit?](tickets/006-migration-logging.md).
