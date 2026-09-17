---
title: Wiring the reverse migration to actually execute on a backend switch
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

`device-storage-settings.tsx` (ticket 004) already has the 3-option
radio and confirm-before-switch modal, but confirming a switch today
only persists the `localStorage` setting — it does not move any data
(documented scope cut in that component: running the reverse migration
for real, before `App.tsx` branched on the resolved backend, would have
been actively harmful, since the still-live *forward* migration would
silently copy the freshly-switched-to Dexie data straight back to
SQLite on the very next reload).

That blocker is gone: `App.tsx` now calls `resolveBackend()` and
branches to whichever backend it resolves to (sync.ts/App.tsx backend
wiring, `a017cb0`), and the reverse-migration mechanics
(`migrate-from-sqlite.ts`, `DexieMigrationTarget`, ticket 003) and the
forward ones (`migrate-from-dexie.ts`) both already exist and are
tested. What's not yet decided is how the settings UI's confirm action
actually drives the real migration:

- Does confirming a switch run the migration synchronously before
  closing the modal (with the progress/per-table-checklist/failure UI
  ticket 004 originally prototyped but didn't build), or does it set
  the `localStorage` setting and require a reload, running the
  migration during the next `App.tsx` bootstrap (mirroring how the
  *forward* migration already runs today — fire-and-forget after
  collections init)?
- Either way, `App.tsx`'s bootstrap needs to know "a migration is
  pending" for the direction that just got resolved — how does it
  avoid re-triggering `runDexieMigrationIfNeeded` (forward) on a device
  that just deliberately switched to Dexie, given both migrations key
  off backend-agnostic completion flags that live in different places
  (SQLite table vs `MetadataStore`)?
- What does the user see if the migration fails partway — ticket 004's
  prototype has a failure state ("names which table/row range it
  failed at... offers Try again or Keep &lt;current backend&gt;") that
  was never built; does this ticket build it now, or re-scope it down
  again?
- Does switching back and forth (SQLite → Dexie → SQLite) need any
  extra guard beyond "always re-copy fresh" (ticket 003 decision 6),
  now that it's a real, repeatable, user-triggered action rather than
  a one-time cutover?

Use `/grilling` and `/domain-modeling` per this map's Notes.

## Answer

Two of the four questions this ticket originally posed turned out to
already be settled by existing code, not real open decisions:

- **Forward-migration re-triggering after a switch to Dexie**: already
  impossible. `device-storage-settings.tsx`'s confirm action calls
  `setBackendSetting("dexie")` — a *forced* pin, not "auto" — and
  `resolveBackend()` returns a forced setting as-is without ever
  attempting `initSqlDriver`. App.tsx's Dexie branch (built in commit
  `a017cb0`) never calls `runDexieMigrationIfNeeded` at all on a
  device forced to Dexie.
- **Repeated back-and-forth switching**: already safe. Both
  directions are destructive-on-success against their *source*
  (`drop-all-data.ts`'s comment confirms `migration_status` is
  dropped deliberately; the forward direction's `dropAll()` destroys
  the Dexie side the same way), so each direction's "already migrated"
  flag lives on the side that just lost its data — a later switch back
  always starts fresh, exactly ticket 003 decision 6.

The two real decisions:

1. **Timing — reload-then-migrate, not synchronous-in-modal.**
   Confirming a switch in `device-storage-settings.tsx` only persists
   the forced `localStorage` setting (as it already does today); the
   actual copy runs during the next `App.tsx` bootstrap on the
   newly-resolved backend, the same fire-and-forget pattern
   `runDexieMigrationIfNeeded` already uses for the forward direction.
   Chosen over a synchronous in-modal copy because it reuses a proven,
   tested execution path instead of building a second one, and avoids
   reasoning about tearing down the *current* session's live
   `SyncContext` mid-session while a modal is still open.
   Consequence: **no new UI is needed at all** —
   `migrate-from-sqlite.ts` already publishes through the exact same
   `src/db/sqlite/migration-progress.ts` pub/sub the existing
   `MigrationProgressBanner` renders, `"failed"` state included.

2. **Feeding the migration a `SqlDriver` on the Dexie branch.**
   `resolveBackend()` never attempts `initSqlDriver` for a *forced*
   setting, so on the very reload where the reverse migration needs to
   run, App.tsx's Dexie branch has no `SqlDriver` to read the old data
   from. Resolved as:
   - Check `realDexieMigrationTarget.hasCompletedMigration()` first —
     cheap, Dexie/IndexedDB-only, no SQLite involvement. Only if it
     says "not yet migrated" does App.tsx make a separate, best-effort
     `initSqlDriver` attempt purely to feed
     `runSqliteMigrationIfNeeded`, then discard that driver — it is
     never used for anything else on the Dexie backend.
   - **No `requestPrimaryTab()` duplicate-tab lock** for that attempt.
     Reusing the full lock/duplicate-tab-screen dance would resurrect
     exactly the friction ticket 005 decided Dexie-backend users
     shouldn't have to deal with, for what's now a background,
     retryable, one-time operation. Any `initSqlDriver` failure (a real
     multi-tab OPFS conflict included) is treated identically to "can't
     migrate right now": skip, don't mark complete, retry next reload
     — reusing `runSqliteMigrationIfNeeded`'s own existing failure path
     (ticket 003), not a second blocking UI.
   - **Reuse `src/db/backend.ts`'s existing
     `getCachedOpfsFailure`/`setCachedOpfsFailure`/`clearCachedOpfsFailure`**
     around this attempt, so a device that's structurally incapable of
     OPFS (the common reason it's on Dexie via auto-detection in the
     first place) pays the failed-attempt cost once, not every reload;
     a successful attempt clears any stale cached failure, same as
     `resolveBackend`'s own "auto" path already does.
