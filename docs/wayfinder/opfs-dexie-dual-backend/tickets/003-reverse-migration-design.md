---
title: "Reverse migration design: SQLite -> Dexie"
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-storage-abstraction-shape]
---

## Question

`src/db/sqlite/migrate-from-dexie.ts` already does a one-time,
copy-and-verify migration from Dexie into SQLite, guarded by a
`migration_status` completion flag, ending in `dropAll()` on the old Dexie
databases. Switching a device from SQLite to Dexie needs the mirror image:
copy tracked entities/enrollments/events/HMIS drafts (and whatever else
the resolved storage abstraction puts in the Dexie path) out of SQLite
into Dexie, verify, then decide whether to drop or retain the SQLite data
(a device might switch back later — does it need to keep both stores
intact, or is the copy destructive like today's Dexie→SQLite direction?).

Depends on "Storage abstraction shape for dual backend" because the
target shape of the Dexie-side data (which library, which collection
adapter shape) determines what "copy into Dexie" even writes.

Also needs: what happens to in-flight sync state (pending/failed rows,
`sync_state` config row recording `lastDataPull`/`lastDataPush`) across
the switch — does the copied data preserve `syncStatus`, or does
switching force a resync of anything not already `synced`?

## Answer

Mirrors `migrate-from-dexie.ts`'s procedure exactly, in reverse — enabled
directly by ticket 001's decisions, which turn out to make this close to
symmetric rather than requiring new machinery:

1. **Guard**: a completion flag (`migration_status`-equivalent), now
   written via the `MetadataStore` interface (ticket 001) instead of a
   bespoke mechanism — its Dexie implementation writes this the same
   generic way it writes any other config row. Checked first; if absent,
   check whether the source (SQLite) backend actually has any data at
   all — if not (e.g. a device auto-detected/was set to Dexie with no
   prior SQL data ever written), mark complete with nothing copied,
   mirroring `existsAnyDexieData()`'s fresh-install shortcut.
2. **Copy order and mechanism**: trackedEntities → enrollments → events,
   each read via the existing SQL row-adapters (`getTrackedEntityById`-
   style functions already reassemble full `FlattenedX` objects from
   parent+child tables — no new read-side code needed), written via the
   same unified `bulkInsertLocally(rows, { source })` ticket 001 decided
   both adapters implement — just pointed at the Dexie collections
   instead of the SQLite ones. Then hmisDrafts and the `sync_state`
   config row (`lastDataPull`/`lastDataPush`) — both travel as plain
   metadata rows through `MetadataStore`, the same mechanism actual
   metadata tables use (today's code already treats hmisDrafts this way
   via `saveMetadataTable`, not as a tracker collection).
3. **`syncStatus` preservation**: preserved as-is, with no special
   handling required — it's already a field on the `FlattenedX` object
   being copied wholesale, exactly like today's forward direction never
   touches `syncStatus` either. Answers the ticket's original open
   question directly: switching does **not** force a resync of anything
   not already `synced`.
4. **Verification**: Dexie-native (count/read back the ids just written),
   not an extension to the shared `.utils` interface — matches today's
   SQL-side verification, which is also raw-SQL-specific
   (`countMatchingIds` in `migrate-from-dexie.ts`), not routed through
   `.utils` either. No new shared-interface surface needed.
5. **Failure cleanup**: trivial `collection.delete(id)` per written id —
   no cascade-delete logic needed, because Dexie's flat rows (ticket
   001's decision) have no child tables to cascade through, unlike
   today's SQL-side `cleanUpPartialWrite` which must use the real cascade
   functions for normalized parent+child tables.
6. **Destructive on success**: drop the SQLite/OPFS data after
   copy-and-verify succeeds, matching today's `dropAll()`. Reasoned
   explicitly during grilling: a device that ever switches back should
   always re-copy fresh from whichever backend is currently live (never
   trust stale retained data that could have diverged since) — so
   retaining the old backend's data wouldn't skip any work on a future
   switch-back, only cost storage for no functional benefit.

## Implementation progress

Built (commit `b76c306`, `main`): `migrate-from-sqlite.ts` (orchestration
+ `DexieMigrationTarget`), `real-dexie-migration-target.ts`,
`dexie-verification.ts` (Dexie-native count, per decision 4),
`drop-all-data.ts` (per decision 6). Reviewed via `/code-review` before
landing; the spec-axis review caught a real data-loss bug — the
fresh-install guard (point 1) only checked tracker tables, so a device
with `hmis_drafts` rows but no tracker data would silently skip both
copying and dropping its HMIS drafts. Fixed (guard now also checks
`hmis_drafts`), with a regression test. Also found and fixed, during
testing rather than review: `drop-all-data.ts`'s first pass dropped
parent tables before their children, tripping SQLite's FK constraints —
fixed the drop order, added a direct regression test.

**Not built**: same boundary as ticket 001 — no wiring into `App.tsx` or
`src/machines/sync.ts`. This migration is independently correct and
tested (SQL side under `node:sqlite`; the Dexie-writing side is faked
for orchestration tests, same documented gap as ticket 001 — no
`fake-indexeddb` dependency in this repo) but isn't in the live app's
call path yet.
