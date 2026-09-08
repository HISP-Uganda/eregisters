---
title: Migration and Cutover Procedure Design
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Design the actual cutover procedure that runs once, per the map's
belt-and-suspenders decision (require full sync first, AND copy-and-verify
before dropping old DBs). Needs to settle:

- **Trigger**: what detects "this device still has old Dexie databases and
  needs migrating" — an app-version check, presence-check of the Dexie
  databases, a one-time flag in the new SQLite DB itself?
- **Sync-first gate**: what happens if the required full sync (push all
  pending, pull latest) fails — block app usage entirely until it succeeds?
  Retry with backoff? Allow the user to proceed anyway and accept the risk
  (contradicts the "protect unsynced data" priority from the map's Q2)?
  Health-facility devices may have poor/no connectivity for extended
  periods — this needs a real answer, not an assumption.
- **Copy-and-verify**: read every row from all 5 Dexie databases, write into
  the new SQLite schema (per tickets 003/004), verify row counts (and
  probably spot-check content) match before dropping the old IndexedDB
  databases. What's the failure/rollback path if verification fails?
- **User-facing UX** during migration — progress indicator, blocking modal,
  background with a banner? This runs on real health-facility devices that
  may have a lot of locally-synced data.
- **Idempotency** — what if migration is interrupted (browser closed,
  device loses power) mid-copy? Must be safely resumable/re-runnable
  without double-writing or losing data.

Invoke `/grilling` and `/domain-modeling`.

## Resolution

Grilling session settled 5 decisions:

1. **Revises map.md's Q7**: dropped the hard "require full successful
   sync before migrating" gate. Facts found: there is no combined "fully
   synced" signal in `src/machines/sync.ts` — push (`dataSync`) and pull
   (`dataPull`) are independent parallel regions on 30-60min/1-3h timers
   with no terminal "all clear" state, and this app is explicitly built
   for outreach scenarios where a field team can accumulate hundreds of
   `pending`/`draft` records with zero connectivity for extended periods
   (the existing failed-records UI already truncates display at 6 items
   expecting a non-trivial backlog, `src/routes/__root.tsx`). Requiring
   zero pending/failed/draft/editing records before migrating would strand
   exactly the highest-risk devices — the ones with the most unsynced
   data — on old Dexie storage indefinitely. **Copy-and-verify alone is
   the real protection**: it carries over every row regardless of
   `syncStatus` faithfully into the new store, where the unmodified sync
   machine keeps trying to push them afterward — same protection, no
   connectivity dependency. See map.md for the updated Destination text.
2. **Trigger**: both a one-time flag/version stamp in the new SQLite store
   (fast-path check on every boot) AND a Dexie-presence-check fallback
   (`indexedDB.databases()` or direct open attempt against the 5 known
   Dexie database names) for the edge case where the flag didn't survive
   (e.g. a corrupted/partially-migrated SQLite file).
3. **Copy-and-verify failure path**: never drop or mark Dexie as migrated
   until row-count/spot-check verification passes. On failure, clear
   whatever was written to SQLite and retry the whole copy from scratch
   on next boot/reload — no partial-state debugging or resume logic.
4. **UX**: non-blocking banner with a progress indicator ("Upgrading
   local storage… N/M records"), reusing this app's existing sync-status
   visual conventions (`src/components/sync-status-comp.tsx`,
   `__root.tsx`'s `SyncButton`/`Badge` toolbar patterns) rather than a
   blocking full-screen modal — this is a fast, no-network, local-copy
   operation, so full-screen blocking is unnecessary friction, but a
   silent/invisible copy risks the user thinking the app is frozen given
   real data volumes (hundreds of records).
5. **Idempotency**: always restart the copy from scratch on interruption
   (browser closed / device loses power mid-copy) — consistent with
   decision 3, and simpler to reason about correctly than incremental
   resume logic, given the local copy is fast even at hundreds of records.

### Detection query for decision 1's gate removal (informational, not a gate)

The banner in decision 4 can still *report* pending/unsynced counts
without blocking on them, using the same query shape the header UI
already runs (`__root.tsx:592-639`): count rows where `syncStatus IN
('pending','deleted','failed','draft','editing','syncing')` across
trackedEntities/enrollments/events. This becomes an informational
"N records will keep syncing after the upgrade" line, not a precondition.

### Procedure summary

1. **Detect** (decision 2): on boot, check for the migration-complete flag
   in the new SQLite store; if absent, check for Dexie database presence.
   Neither present + fresh install → no migration needed, just initialize
   SQLite normally. Dexie present + flag absent → migration needed.
2. **Copy**: read every row from all 5 Dexie databases (`MOHRegisterDB` +
   4 tracker collection DBs) as-is, regardless of `syncStatus`, and write
   into the new schema (tickets 003/004) inside SQLite transactions.
   Surface progress via the banner (decision 4).
3. **Verify**: row counts per table must match source Dexie counts
   (plus spot-check content on a sample). Pass → write the migration-
   complete flag, then drop the 5 old Dexie/IndexedDB databases. Fail
   (decision 3) → clear the SQLite tables written so far, leave Dexie
   untouched, retry on next boot.
4. **Resume normal operation**: the sync machine (`src/machines/sync.ts`)
   continues unmodified against the new SQLite-backed collections —
   pending/failed rows carried over keep getting pushed exactly as
   before, just from a different underlying store.

## Implementation progress: procedure actually built (Phase 3)

On branch `migration/dexie-data-copy-phase3` (built on top of Phase 2's
branch, not merged to `main` — same ticket-012 blocker as Phases 1-2),
this procedure was implemented, with two scope refinements confirmed
with the user against real facts gathered during implementation:

- **What actually gets copied**: `MOHRegister_TrackedEntities`/
  `_Enrollments`/`_Events` (every row, any `syncStatus`) and
  `MOHRegisterDB.hmisDrafts` (genuine irreplaceable local draft data).
  **Not** copied: every DHIS2-metadata table in `MOHRegisterDB` (Phase 1
  already re-pulls these fresh — copying old rows would just get
  overwritten) and `indicatorEvaluations` (a computed cache, confirmed
  with the user to recompute rather than migrate, same treatment as
  metadata). `MOHRegister_RuleResults` is confirmed always-empty on every
  real device (dead code, zero writers ever, per git history) — still
  dropped during cleanup for tidiness, never read from. This narrows
  "all 5 Dexie databases" in decision/procedure-summary language above to
  4 genuinely-copied tables plus a 5th dropped-but-never-read database.
- New `src/db/sqlite/migrate-from-dexie.ts`: `runDexieMigrationIfNeeded(db,
  source)` — flag check, presence check, copy (via a `copyTable` helper
  shared across all 4 tables), verify (row counts for exactly the ids
  just written, not a blind table count — a concurrent sync-machine pull
  could otherwise be writing to the same tables), mark complete + drop
  Dexie on success, or clean up exactly what was written (via the real
  `deleteTrackedEntityCascade`/`deleteEnrollmentCascade`/
  `deleteEventCascade` — a raw `DELETE FROM` would skip child-table
  cleanup and trip FK constraints in the wrong order) and leave the flag
  unset on failure, per decision 3's no-partial-resume rule.
- `DexieMigrationSource` is an injected interface — the orchestration
  logic above is unit-tested against a fake; the real implementation
  (`dexie-migration-source.ts`) uses `Dexie.exists()` for the presence
  check (never creates a database that isn't there), and opens the 3
  tracker databases schema-less (`new Dexie(name)` + `.open()` with no
  `.version().stores()` declared) rather than reverse-engineering the
  index string `tanstack-dexie-db-collection` set up privately for them.
- New `migration_status` single-row flag table (via the existing
  `getConfigRow`/`putConfigRow` pattern) and `migration-progress.ts` (a
  same-tab pub/sub, same shape as `reactive-config.ts`) back a new
  non-blocking `<Alert>` banner (`migration-progress-banner.tsx`, wired
  into `__root.tsx`) — matches decision 4, reusing the exact banner
  pattern the existing `showAppReload`/`showMetadataReload` alerts use.
- Wired into `src/App.tsx`'s bootstrap as fire-and-forget, right after
  `initTrackerCollections` resolves and before `setSqlDriver` — the app
  renders immediately regardless of copy progress, matching decision 4's
  non-blocking requirement.
- A `/code-review` pass afterwards (Standards + Spec axes) found no
  correctness gaps — only one worthwhile duplication smell (4
  near-identical copy blocks), collapsed into a shared `copyTable` helper
  with no behavior change.
- Verification: `pnpm exec tsc --noEmit -p tsconfig.json` clean, full
  `pnpm exec vitest run` passing (42 files / 242 tests). No real-browser/
  IndexedDB testing attempted — `dexie-migration-source.ts`'s actual
  `Dexie.exists`/schema-less-open/`Dexie.delete` calls can only be
  verified by hand against real leftover Dexie data; flagged as a manual
  smoke-test item for whoever eventually deploys, not blocked on ticket
  012 specifically (this piece doesn't need OPFS/COOP-COEP to be
  testable, just a real browser with real Dexie data).
