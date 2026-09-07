---
title: Does persistedCollectionOptions Impose a Storage Scheme Incompatible With Normalized Child Tables?
type: wayfinder:research
status: open
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
