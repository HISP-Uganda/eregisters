---
title: How is legacy-store cleanup made retryable (R7 cleanupPending)?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-state-chart]
---

## Question

Investigation finding A5: `markComplete()` and `dropAll()` are not
co-transactional; if cleanup throws after completion is recorded, the
SQLite boot path never retries and stale Dexie tracker DBs linger. The
reverse direction (`dropAllSqliteData`) has the analogous gap.

Decide, for both directions:

- where the `cleanupPending` flag lives (destination store config row?)
  and when it is written relative to `markComplete`;
- which machine state retries cleanup on later boots (every boot on the
  live backend, before `ready`?), and whether a cleanup failure blocks
  `ready` (it should not — data is safe);
- how "cleanup pending but completed" differs from "not migrated" in the
  guards, so §14 Test 11 (IDB still exists after success) doesn't
  re-migrate;
- logging of cleanup outcome.

Then implement with Vitest coverage for §14 Tests 10 and 11.

> Note from "Design the storage-boot machine's state chart": a cleanup
> failure is already non-fatal (`cleaningUp` → `copied`, logged) and no
> longer triggers a rollback. What remains here is retrying the cleanup
> on later boots.

## Resolution

Grilled 2026-09-26.

**Why it matters beyond storage**: a failed cleanup leaves the previous
store holding stale rows. A later copy the other way *upserts* into
them, so rows deleted in the meantime resurrect.

1. **Cleanup owed is derived, never stored** (Q1 (b)) — also catches
   devices already in the field whose cleanup failed before this fix:
   - forward: copy current (Dexie not live since) AND
     `existsAnyDexieData()` — nothing else creates the Dexie tracker DBs
     (verified: `initDexieTrackerCollections` only on Dexie boots / the
     reverse target; the rule-results Dexie collection is unused);
   - reverse: reverse copy-complete row exists (cleared on every SQLite
     boot) AND `hasAnySqliteData(db)`.
2. **Retry** (Q2): new verdict `"cleanup-owed"` → `detecting` goes
   straight to `cleaningUp` under the lock; every boot until it
   succeeds; failures logged, never block `ready`. Same in
   `runStoreCopy`.
3. **Finish the target's owed cleanup before copying into it** (Q3):
   new step `prepareTarget` (machine state `preparingTarget`, before
   `copyingTracker`; failure → rollback path):
   - forward: reverse copy-complete row present AND SQLite has data →
     `dropAllSqliteData` + `createSchema`;
   - reverse: forward copy row present and still current (Dexie not live
     since) AND Dexie has tracker rows → delete them through the
     collections.
4. **Worker-start cost** (derived detail): working out reverse
   cleanup-owed needs SQLite open. To avoid a Worker start on every
   Dexie boot, the reverse completion row carries `cleanedAt`, set when
   cleanup succeeds or `detect` finds SQLite empty, reset by
   `markMigrationComplete`. `prepareReverseCopy` skips opening SQLite
   only when complete AND cleaned. It is a cache: a row without
   `cleanedAt` (legacy devices) is re-checked from the data.
5. Reverse cleanup now recreates the schema empty after dropping, so the
   driver stays usable and the next `detect` reads "no data" rather than
   missing tables.

**Residual**: `prepareTarget`'s forward wipe drops SQLite tables under
the already-initialised SQLite tracker collections. Safe today because
routes (the only queriers) render after `ready`; worth a real-browser
check in the cutover smoke.

Implemented (uncommitted, `feature/storage-migration-machine`):
`store-copy.ts`, `migrate-from-dexie.ts`, `migrate-from-sqlite.ts`,
`real-dexie-migration-target.ts`, `dexie-migration-source.ts`,
`dexie-verification.ts` (`listDexieIds`), `storage-boot.ts`,
`storage-boot-actor.ts`. Tests: forward cleanup retry, forward
stale-target wipe + keep-live-data, reverse cleanup retry, reverse
stale-target wipe + keep-live-data, machine `cleanup-owed` path.
Full suite 59 files / 406 tests pass.
