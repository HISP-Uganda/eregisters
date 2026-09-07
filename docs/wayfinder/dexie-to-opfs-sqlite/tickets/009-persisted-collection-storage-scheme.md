---
title: Does persistedCollectionOptions Impose a Storage Scheme Incompatible With Normalized Child Tables?
type: wayfinder:research
status: closed
assignee: null
blocked_by: []
research_branch: research/persisted-collection-storage-scheme
---

## Question

Ticket 002's research only skimmed `db-sqlite-persistence-core`'s
`sqlite-core-adapter.ts` (~2162 lines, from the npm tarball for
`@tanstack/db-sqlite-persistence-core@0.2.20`) and flagged it likely defines
its own table layout, row-versioning, and tombstone scheme that the
`SQLiteDriver` executes SQL on behalf of.

Read that file in full and answer: does `persistedCollectionOptions` own
the physical row representation entirely (e.g., one opaque table per
collection with a JSON blob column it manages internally), such that a
normalized schema (separate `tracked_entity_attributes`,
`event_data_values` child tables, per the map's Q6 decision and ticket 003)
would have to live in **separate tables outside** the framework's control —
queried directly via raw SQL for analytics, while the framework's own
tables handle sync/reactivity/mutation bookkeeping? Or does the framework
provide any hook/extension point for a genuinely relational internal
schema?

This could reshape ticket 003's design entirely (e.g., "normalize" might
mean maintaining derived/denormalized-for-query tables alongside the
framework's authoritative tables, refreshed on write, rather than the
framework's tables themselves being normalized) — resolve before finalizing
ticket 003.

Resolve via a `/research` subagent; capture findings on branch
`research/persisted-collection-storage-scheme`.

## Resolution

Full findings: `research/009-findings.md` (merged from
`research/persisted-collection-storage-scheme`), read `sqlite-core-adapter.ts`
(2162 lines) in full.

**The framework owns the schema entirely and offers no extension point.**
Each collection gets one opaque table (`key TEXT PRIMARY KEY, value TEXT
/*JSON blob*/, metadata TEXT, row_version INTEGER`) plus a tombstone table,
with content-hashed table names. "Indexes" are `json_extract(value, '$.path')`
expression indexes over the blob — not real typed columns.
`SQLiteCoreAdapterOptions` only exposes lifecycle knobs (schema version,
mismatch policy, pruning), nothing for custom relational layout.

However, raw SQL reads/writes against the same OPFS database file, outside
the framework's own reserved tables, are safe — nothing stops the app from
maintaining separate normalized tables in the same database.

**Decision for ticket 003**: don't expect `persistedCollectionOptions` to
store normalized data. Let it own the opaque blob/tombstone tables purely
for sync/reactivity and mutation bookkeeping (what it's for). Design a
separate, app-owned "read-model" schema (`tracked_entity_attributes`,
`event_data_values`, etc.) in the same database, refreshed transactionally
on every write, queried directly via raw SQL for analytics. This unblocks
ticket 003.
