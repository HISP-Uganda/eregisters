---
title: Normalized SQLite Schema for Tracker Collections
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
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

**Simplified by ticket 010**: no `persistedCollectionOptions` framework
schema in the picture anymore (see tickets 009/010) — design **one**
normalized schema, not a read-model alongside an opaque framework schema.
These tables are the authoritative store; the direct collection adapter
(ticket 011) reads/writes them straight, no duplication.

## Resolution

Grilling session settled 5 decisions, all confirmed:

1. **`createdBy`/`updatedBy`**: a shared `users(uid PK, username, first_name,
   surname)` lookup table, referenced by FK from every table that needs a
   user — not inline columns per table. Upsert-by-uid, server value wins
   (matches today's `merge-utils.ts` behavior for these fields).
2. **Per-value audit fields preserved**: today's flatten silently drops
   each dataValue's own `created_at`/`updated_at`/`stored_by`/
   `provided_elsewhere`/`created_by`/`updated_by` (wire shape confirmed at
   `src/schemas.ts:305-313`) and each attribute's `created_at`/`updated_at`
   (`src/schemas.ts:296-302`, no per-attribute user). The new child tables
   capture these — closes a real, currently-silent data-loss gap at near
   zero cost.
3. **Indexing**: composite `events(org_unit, program, program_stage)`
   matching the hot analytics filter path, plus `events(enrollment)`,
   `events(tracked_entity)`, `events(parent_event)`, `events(occurred_at)`,
   `enrollments(tracked_entity)`, `enrollments(program)`,
   `enrollments(org_unit)`, `trackedEntities(org_unit)`, and `sync_status`
   on all three parent tables. No speculative indexes beyond what
   `parent-event-dataset.ts` and the sync machine actually filter/join on
   today.
4. **Per-field merge granularity preserved**: each attribute/dataValue
   child-table row carries its own `source: 'local' | 'server'` (plus its
   own `updated_at`), replicating today's per-key "local wins, server
   fills gaps" merge (`src/db/merge-utils.ts`) at the row level instead of
   needing a parent-level flag. This directly protects the migration's
   core motivation (map.md Q2: not losing unsynced data) at the
   individual-field granularity the app already relies on. Ticket 011's
   adapter implements the actual merge logic against this; the schema just
   carries the signal.
5. **`ruleResults` stays simple**: one table, JSON `TEXT` columns for the
   array/record fields — no normalization. It's a regenerated computed
   cache, never synced/merged with the server, never queried relationally.

### Concrete schema

```sql
CREATE TABLE users (
    uid TEXT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    surname TEXT
);

CREATE TABLE tracked_entities (
    tracked_entity TEXT PRIMARY KEY,
    tracked_entity_type TEXT NOT NULL,
    org_unit TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    created_by_uid TEXT REFERENCES users(uid),
    updated_by_uid TEXT REFERENCES users(uid),
    inactive INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0,
    potential_duplicate INTEGER NOT NULL DEFAULT 0,
    parent_entity TEXT,
    last_synced TEXT,
    sync_error TEXT,
    version INTEGER NOT NULL DEFAULT 0,
    sync_status TEXT NOT NULL CHECK (sync_status IN
        ('draft','pending','syncing','synced','failed','deleted','editing'))
);
CREATE INDEX idx_te_org_unit ON tracked_entities(org_unit);
CREATE INDEX idx_te_sync_status ON tracked_entities(sync_status);

CREATE TABLE tracked_entity_attributes (
    tracked_entity TEXT NOT NULL REFERENCES tracked_entities(tracked_entity),
    attribute TEXT NOT NULL,
    value TEXT,
    display_name TEXT,
    value_type TEXT,
    created_at TEXT,
    updated_at TEXT,
    source TEXT NOT NULL CHECK (source IN ('local','server')),
    PRIMARY KEY (tracked_entity, attribute)
);

CREATE TABLE enrollments (
    enrollment TEXT PRIMARY KEY,
    tracked_entity TEXT NOT NULL REFERENCES tracked_entities(tracked_entity),
    program TEXT NOT NULL,
    org_unit TEXT NOT NULL,
    status TEXT NOT NULL,
    enrolled_at TEXT NOT NULL,
    occurred_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    created_by_uid TEXT REFERENCES users(uid),
    updated_by_uid TEXT REFERENCES users(uid),
    follow_up INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    last_synced TEXT,
    sync_error TEXT,
    version INTEGER NOT NULL DEFAULT 0,
    sync_status TEXT NOT NULL
);
CREATE INDEX idx_enr_tracked_entity ON enrollments(tracked_entity);
CREATE INDEX idx_enr_program ON enrollments(program);
CREATE INDEX idx_enr_org_unit ON enrollments(org_unit);
CREATE INDEX idx_enr_sync_status ON enrollments(sync_status);

CREATE TABLE enrollment_attributes (
    enrollment TEXT NOT NULL REFERENCES enrollments(enrollment),
    attribute TEXT NOT NULL,
    value TEXT,
    display_name TEXT,
    value_type TEXT,
    created_at TEXT,
    updated_at TEXT,
    source TEXT NOT NULL CHECK (source IN ('local','server')),
    PRIMARY KEY (enrollment, attribute)
);

CREATE TABLE events (
    event TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    program TEXT NOT NULL,
    program_stage TEXT NOT NULL,
    enrollment TEXT NOT NULL REFERENCES enrollments(enrollment),
    tracked_entity TEXT NOT NULL REFERENCES tracked_entities(tracked_entity),
    org_unit TEXT NOT NULL,
    parent_event TEXT REFERENCES events(event),
    occurred_at TEXT NOT NULL,
    follow_up INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    attribute_option_combo TEXT,
    attribute_category_options TEXT,
    completed_by TEXT,
    completed_at TEXT,
    created_by_uid TEXT REFERENCES users(uid),
    updated_by_uid TEXT REFERENCES users(uid),
    notes TEXT,
    last_synced TEXT,
    sync_error TEXT,
    version INTEGER NOT NULL DEFAULT 0,
    sync_status TEXT NOT NULL
);
CREATE INDEX idx_events_hot_path ON events(org_unit, program, program_stage);
CREATE INDEX idx_events_enrollment ON events(enrollment);
CREATE INDEX idx_events_tracked_entity ON events(tracked_entity);
CREATE INDEX idx_events_parent_event ON events(parent_event);
CREATE INDEX idx_events_occurred_at ON events(occurred_at);
CREATE INDEX idx_events_sync_status ON events(sync_status);

CREATE TABLE event_data_values (
    event TEXT NOT NULL REFERENCES events(event),
    data_element TEXT NOT NULL,
    value TEXT,
    stored_by TEXT,
    provided_elsewhere INTEGER,
    created_at TEXT,
    updated_at TEXT,
    created_by_uid TEXT REFERENCES users(uid),
    updated_by_uid TEXT REFERENCES users(uid),
    source TEXT NOT NULL CHECK (source IN ('local','server')),
    PRIMARY KEY (event, data_element)
);

CREATE TABLE rule_results (
    id TEXT PRIMARY KEY, -- `${eventId}_${formType}`
    assignments TEXT NOT NULL,        -- JSON
    hidden_fields TEXT NOT NULL,      -- JSON array
    shown_fields TEXT NOT NULL,
    hidden_sections TEXT NOT NULL,
    shown_sections TEXT NOT NULL,
    mandatory_fields TEXT NOT NULL,
    hidden_options TEXT NOT NULL,     -- JSON record
    shown_options TEXT NOT NULL,
    hidden_option_groups TEXT NOT NULL,
    shown_option_groups TEXT NOT NULL,
    errors TEXT NOT NULL,             -- JSON array of {key, content}
    warnings TEXT NOT NULL,
    messages TEXT NOT NULL
);
```

### Notes for ticket 011 (the adapter)

- Reassembling a `FlattenedTrackedEntity`/`FlattenedEnrollment`/
  `FlattenedEvent` object means: one query against the parent table
  (joined to `users` twice, for created/updated by) plus one query against
  the child table grouped by parent id back into the `attributes`/
  `dataValues` record shape the rest of the app expects — a mechanical
  consequence of this schema, not a further design decision.
- `notes` stays an untyped JSON blob column on `enrollments`/`events`,
  matching its current untyped/optional status in `src/schemas.ts`.
- Booleans are stored as `INTEGER` (SQLite has no native boolean type) —
  the adapter's reassembly layer converts `0`/`1` back to `boolean`.
