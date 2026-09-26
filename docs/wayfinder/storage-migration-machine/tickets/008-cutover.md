---
title: Cut App.tsx over to the storage-boot actor
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [003-progress-ui]
---

## Question

Replace `App.tsx`'s `bootstrap()` / `attemptReverseMigrationIfNeeded`
with `useSelector(getStorageBootActor(), …)`: which UI each state
renders (spinner + banner while resolving/copying, error screen for
`unavailable`, Retry for `failed`), and `SyncContext.Provider` mounting
from `snapshot.output`. Decide:

- one PR vs. behind a flag, and whether the `run*IfNeeded` wrappers and
  `migration-progress.ts` are deleted in the same change;
- the real-browser smoke required before merge (forward, reverse,
  fresh install, interrupted copy, cleanup failure, two tabs at once);
- whether `useSelector` over a module singleton needs anything extra for
  the DHIS2 shell (the app isn't under StrictMode today).

> Unblocked by "How does the progress UI read the machine…": wire
> `StorageBootScreen` (with `onRetry` → `RETRY`) in `App.tsx` and
> `StorageFallbackNotice` in `__root.tsx` in place of
> `MigrationProgressBanner`, both via `useSelector(getStorageBootActor(), bootView)`.

> From "How is legacy-store cleanup made retryable…": include in the
> smoke a forward copy whose target SQLite held stale leftovers
> (`prepareTarget` drops tables under initialised collections).

> From "Escape hatch after repeated migration failures (R11)": wire
> `onContinue` → `CONTINUE` alongside `onRetry` → `RETRY`.

## Resolution

Grilled 2026-09-26.

1. **One change, no flag** (Q1): `bootstrap()`,
   `attemptReverseMigrationIfNeeded`, `MigrationProgressBanner`,
   `migration-progress.ts` (+ its test) and the `run*IfNeeded` wrappers
   are deleted. `MigrationProgress` moved into `store-copy.ts`. Step
   suites call `runStoreCopy(forward/reverseCopySteps(...))` via a local
   helper per file.
2. **Boot starts in `MyApp`** (Q2), in parallel with the `me` query;
   `FullApp` renders `StorageBootScreen` until the machine is done, then
   `SyncContext.Provider` from its `output`. `__root.tsx` renders
   `StorageFallbackNotice`.
3. `pnpm build` passes; all six service-worker patch sentinels present.
4. **Real-browser smoke (Q3)** — `pnpm start` against
   eregisters.health.go.ug, Chrome, driven by the browser tools; results
   read from temporary `performance.mark`s (removed afterwards). Before
   any wipe, the local store was confirmed fully `synced` (275/275/385,
   no HMIS drafts) and only this app's stores were deleted (its three
   OPFS files, `MOHRegister_*` IndexedDBs, two localStorage keys) —
   other apps' OPFS files/IndexedDBs on the origin untouched.

   | # | Scenario | Result |
   |---|---|---|
   | 1 | Fresh install | ✅ `detecting → markingComplete (fresh) → ready` on SQLite |
   | 2 | Forward copy (real data) | ✅ 1/1/2 rows, 12/12/21 nested, `lastPullAt` preserved, Dexie tracker DBs dropped |
   | 3 | Reopen | ✅ `current`, nothing copied; boot ≈ 850 ms (SQLite open ≈ 835 ms) |
   | 4 | Leftover Dexie DB, copy current | ✅ `cleaningUp` only, leftover deleted |
   | 5 | Reverse copy (real data) | ✅ Dexie matches row-for-row & nested-key-for-key; SQLite emptied |
   | 6 | Page killed in `copyingMetadata` | ✅ next boot re-copied (upsert) and completed — the duplicate-key bug fixed in the test-matrix ticket is gone |
   | 7 | Two tabs / Web Lock | ✅ tab A waited in `acquiringLock`, entered `detecting` 1 ms after tab B released |
   | 8 | Forced sqlite, bad row | ✅ failed screen with `events: 1 rows missing enrollment`; Retry re-ran and failed again; Continue → Dexie session + fallback notice; setting untouched, no failure counted |

5. **HMR** (Q4) accepted — observed once: a probe importing the module
   under a stale URL created a second actor (harmless `current` boot).
   Test artefact only; no HMR in production.

### Finding — outside this map

On the first fresh-install attempt, `auto` resolved to **Dexie**: the
SQLite open failed once (not reproducible — the next fresh install and
a direct open both succeeded in ~240 ms). `backend.ts` then cached
`eregisters.opfsInitFailed` **permanently** (versioned, no expiry), so
a device whose first-ever open fails transiently stays on Dexie forever
(`shouldAttemptSqliteToDexieCopy` also skips it: never used SQLite).
Pre-existing backend-resolution policy, not introduced here — belongs
to the admin storage-backend policy effort.
