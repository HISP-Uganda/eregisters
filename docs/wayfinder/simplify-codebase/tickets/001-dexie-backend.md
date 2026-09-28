---
title: Is the Dexie storage backend still needed?
type: wayfinder:grilling
status: open
assignee:
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
