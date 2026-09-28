---
title: Is the Dexie storage backend still needed?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

The app keeps two full storage backends — SQLite (wa-sqlite on OPFS) and
Dexie (IndexedDB) — plus copying between them in both directions
(`migrate-from-dexie.ts`, `migrate-from-sqlite.ts`, the storage-boot
machine's copy steps, `backend.ts`'s auto/fallback logic, the admin
storage policy). Dexie is the fallback where OPFS fails (Safari — no
users today), the path an admin can force, and where every device lived
before SQLite shipped. Decide whether Dexie stays, becomes
read-only-for-migration, or goes — and when (devices still on it must
be copied to SQLite first) — and what that removes.

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Facts: Dexie-only code ~1,285 lines (`src/db/dexie/`) plus ~2,190 lines
of shared copy/boot logic and 12 files branching on the backend. A device
lands on Dexie when OPFS is missing (Safari — no users), after two failed
SQLite opens, or when an admin forces it; nothing tells us how many
production devices are on Dexie today. The reverse copy (SQLite → Dexie)
only served a deliberate switch to Dexie — when OPFS itself breaks it
can't read SQLite anyway.

1. **Dexie stays only as the fallback** (Q1 (b)): removed the SQLite →
   Dexie copy (`dexie/migrate-from-sqlite.ts`, the migration target, the
   storage-boot machine's `preparingReverseCopy` / reverse direction /
   copy driver, `shouldAttemptSqliteToDexieCopy`, the `sqliteUsed` flag,
   `clearSqliteMigrationFlag`, `dexie-verification.ts`). Kept: the Dexie →
   SQLite copy (a device's older Dexie data) and Dexie as the store where
   OPFS fails.
2. **No backend setting at all** (Q3): the per-device setting, the admin
   "Device Storage Backend" policy (UI, `uiConfig.storageBackendPolicy`,
   its reload banner) and the storage-boot machine's forced-backend paths
   (`failed` state, `RETRY`/`CONTINUE`, the boot screen's failed view) —
   every device is "auto"; a failed copy always falls back to Dexie for
   the session.
3. **Evidence before removing Dexie as a live store** (Q2): new ticket
   "Should each device report its storage backend to the server?".

Result: ~1,265 lines of app code and ~1,000 lines of tests removed; the
storage-boot machine 873 → ~765 lines. Typecheck clean; 68 files / 475
tests pass (the removed behaviour's tests went with it); fallow: no new
dead code. Real browser (dev server): the app boots on SQLite with its
data (SQLite lock held); App Settings renders without the storage card.
The old per-device localStorage key `eregisters.storageBackend` is now
ignored.
