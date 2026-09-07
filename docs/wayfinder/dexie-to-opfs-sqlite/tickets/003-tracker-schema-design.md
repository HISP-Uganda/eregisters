---
title: Normalized SQLite Schema for Tracker Collections
type: wayfinder:grilling
status: open
assignee: null
blocked_by: [009-persisted-collection-storage-scheme]
---

## Question

Design the normalized SQLite schema for the tracker collections currently
backed by `FlattenedTrackedEntitySchema`, `FlattenedEnrollmentSchema`,
`FlattenedEventSchema`, and `RuleResultSchema` (`src/schemas.ts`).

Needs to cover:
- Parent tables for tracked entities, enrollments, events (keyed the same
  as today: `trackedEntity`, `enrollment`, `event`).
- Child tables for `attributes` (on trackedEntity and enrollment) and
  `dataValues` (on event) — one row per `(parent id, attribute/dataElement,
  value)` — replacing the JSON arrays Dexie stores today.
- Indexing strategy that actually serves the query patterns in
  `src/analytics/parent-event-dataset.ts`, `column-registry.ts`, and
  `pivot-engine.ts` (org unit + program + date-range filters, attribute/
  dataElement value lookups for computed columns).
- How a `FlattenedTrackedEntity`/`FlattenedEnrollment`/`FlattenedEvent`
  object gets reassembled from joined rows for existing consumers that
  still expect the current shape (`syncStatus`, `createdBy`/`updatedBy`
  objects, etc. — see `src/db/transformers.ts` and `src/db/merge-utils.ts`).
- Whether `ruleResults` needs normalizing at all, or can stay closer to a
  simple keyed table (it's a computed cache, not user data).

Invoke `/grilling` and `/domain-modeling`.

**Blocked on ticket 009** (persisted-collection storage scheme): ticket
002's resolution flagged that `db-sqlite-persistence-core`'s
`sqlite-core-adapter.ts` may impose its own row-versioning/tombstone table
layout that constrains — or conflicts with — normalizing attributes/
dataValues into separate child tables. Need that answered before finalizing
this schema.
