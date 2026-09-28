---
title: Should a Full Metadata Sync replace metadata in one step instead of deleting it first?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

A Full Metadata Sync runs `deletingMetadata` (all metadata tables
cleared) and then `savingMetadata`; anything that interrupts it in
between — a forced reload, a closed tab, a crash, a dead battery —
leaves the device with no metadata, and offline it can't work until it
reconnects. Decide how to make the replacement all-or-nothing on both
backends (one transaction on SQLite; Dexie's equivalent), what happens
to a failure half-way (keep the old copy), and how it's tested.

> From "What does a reload do to a push or pull in progress, and must a
> forced reload wait for sync?".

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Facts (code reading): a full sync runs `deleteMetadataForResyncGeneric`
(clears each metadata table the new payload carries) then
`saveMetadataGeneric` (one `putRows` per table) — every table its own
transaction, and `MetadataStore` has no transaction API. Worse, a failed
save goes `savingMetadata` → `onError` → `resetIndexDB`, which **wipes**
the metadata database even though the old copy was only partly replaced.
Both backends can do it in one step: SQLite's `driver.transaction` is
reentrant (per-table writes nest inside it); Dexie keeps all metadata
rows in one table (`MOHRegister_Metadata.rows`), so one `rw`
transaction covers it.

1. **`MetadataStore.transaction(fn)`** (Q1 (a)): SQLite via the driver's
   transaction, Dexie via `db.transaction("rw", db.rows, fn)`. A full
   sync runs delete + save inside one transaction, as one new
   `replacingMetadata` step replacing `deletingMetadata` →
   `savingMetadata`. Accepted cost: the tab's other database reads wait
   while it saves — a rare admin action that already shows as loading.
2. **A failed replacement keeps the old metadata** (Q2): the
   transaction rolls back and the flow goes to `failure` (Retry), not
   `resetIndexDB`. Incremental syncs keep their path (they delete
   nothing).
3. **Tests** (Q3): the store transaction commits and rolls everything
   back on a throw (SQLite for real; the Dexie wrapper with a stub); a
   machine test where a full sync's save fails half-way ends in
   `failure` with the old metadata rows intact. Built in "Build the
   forced update and verify it against a stand-in server".
