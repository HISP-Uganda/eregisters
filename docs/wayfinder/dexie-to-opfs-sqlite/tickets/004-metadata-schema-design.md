---
title: SQLite Schema for MOHRegisterDB Metadata Tables
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
---

## Question

Design the SQLite schema for `MOHRegisterDB`'s reference/metadata tables
(`src/db/index.ts`): `programs`, `dataElements`, `trackedEntityAttributes`,
`programIndicators`, `programRules`, `programRuleVariables`, `optionSets`,
`optionGroups`, `organisationUnits` (indexed by `path` today),
`categoryOptionCombos`, `dataSets`, `metadataVersions`,
`metadataSyncProgress`, `syncState`, `indicatorEvaluations`, `uiConfig`,
`stageHierarchy`, `hmisDrafts` (schema in `src/db/hmis-drafts.ts`).

These are mostly bulk-put dictionaries with no query complexity today
(per the map's Q6 decision, these don't need normalizing the way tracker
collections do). Decide:
- Which tables are plain key-value/JSON-blob rows (config blobs like
  `uiConfig`, `stageHierarchy`) vs. which benefit from real columns (e.g.
  `organisationUnits.path` needs prefix/hierarchy queries today via Dexie
  indexing — confirm the SQL equivalent, e.g. an indexed `path` column with
  `LIKE 'prefix%'` or a materialized ancestor table).
- `metadataVersions`/`metadataSyncProgress`/`syncState` bookkeeping shape.
- `indicatorEvaluations` cache invalidation/keying.
- `hmisDrafts` — confirm no relational needs beyond a keyed blob.

Invoke `/grilling` and `/domain-modeling`.

## Resolution

Grilling session settled 3 decisions, all confirmed:

1. **Uniform blob-table shape**: exhaustive grep confirmed 15 of 18 tables
   are accessed *only* via whole-table `.toArray()`/`.count()`/
   `bulkPut()`/`.clear()` — zero secondary-field filtering anywhere in the
   app, despite Dexie declaring unused `name`/`program` indexes on several.
   All of these get one uniform shape (`id TEXT PRIMARY KEY, data TEXT
   NOT NULL`, the whole record as JSON) as separate, clearly-named tables
   matching today's Dexie table names — no hand-designed flat columns
   with zero query justification. This also lets `saveMetadata`
   (`src/machines/sync.ts:792-833`, currently one repetitive `bulkPut`
   call per resource) collapse into one reusable function. `organisationUnits`
   is the confirmed exception — real `id`/`name`/`path` columns (path
   indexed) for its one genuine prefix-search use
   (`src/utils/utils.ts:1510-1512`).
2. **`metadataSyncProgress` dropped**: confirmed dead — no reads/writes
   anywhere outside its own Dexie declaration. Not carried into the new
   schema; add it later with real requirements if it's ever wired up.
3. **`indicatorEvaluations` kept minimal**: no write path exists today,
   only two delete-cascade-by-`eventId` call sites
   (`src/utils/utils.ts:1358-1361,1404-1406`). Kept as
   `id TEXT PRIMARY KEY, event_id TEXT, data TEXT NOT NULL` (indexed on
   `event_id`) purely so those two call sites keep working. Removing the
   dead call sites entirely is application-logic cleanup, out of scope
   here — noted for whoever executes the migration.

**One correction folded in without re-asking** (a precision point, not a
new decision): `optionSets`/`optionGroups` originally used a **composite**
Dexie key (`[id+optionSet]`/`[id+optionGroup]`, `src/db/index.ts:127-128`)
because a single option's `id` is not guaranteed unique across different
option sets/groups. A bare `id TEXT PRIMARY KEY` would silently collapse
rows that legitimately coexist under the old schema — preserved as a
composite primary key instead.

`uiConfig`/`stageHierarchy`/`metadataVersions`/`syncState`/`hmisDrafts`
all already fit the uniform `id`+`data` shape trivially (each is a
single-row-keyed or naturally-keyed blob per the research) — no further
design needed beyond Q1's decision.

### Concrete schema

```sql
CREATE TABLE programs (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE data_elements (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE tracked_entity_attribute_definitions (
    id TEXT PRIMARY KEY, data TEXT NOT NULL
); -- metadata definitions; distinct from ticket 003's per-instance
   -- tracked_entity_attributes VALUE rows
CREATE TABLE program_indicators (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE program_rules (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE program_rule_variables (id TEXT PRIMARY KEY, data TEXT NOT NULL);

CREATE TABLE option_sets (
    id TEXT NOT NULL,
    option_set TEXT NOT NULL,
    data TEXT NOT NULL,
    PRIMARY KEY (id, option_set)
);
CREATE TABLE option_groups (
    id TEXT NOT NULL,
    option_group TEXT NOT NULL,
    data TEXT NOT NULL,
    PRIMARY KEY (id, option_group)
);

CREATE TABLE category_option_combos (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE data_sets (id TEXT PRIMARY KEY, data TEXT NOT NULL);

CREATE TABLE organisation_units (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    data TEXT NOT NULL -- code, parent, etc.
);
CREATE INDEX idx_ou_path ON organisation_units(path);

CREATE TABLE metadata_versions (id TEXT PRIMARY KEY, data TEXT NOT NULL);
-- single row, id = 'metadata-version'
CREATE TABLE sync_state (id TEXT PRIMARY KEY, data TEXT NOT NULL);
-- single row, id = 'current'
CREATE TABLE ui_config (id TEXT PRIMARY KEY, data TEXT NOT NULL);
-- single row, id = 'main'
CREATE TABLE stage_hierarchy (id TEXT PRIMARY KEY, data TEXT NOT NULL);
-- single row, id = 'main'
CREATE TABLE hmis_drafts (id TEXT PRIMARY KEY, data TEXT NOT NULL);
-- id already a deterministic composite key (draftId() in
-- src/db/hmis-drafts.ts:19-26)

CREATE TABLE indicator_evaluations (
    id TEXT PRIMARY KEY,
    event_id TEXT,
    data TEXT NOT NULL
);
CREATE INDEX idx_indicator_evaluations_event_id
    ON indicator_evaluations(event_id);

-- metadataSyncProgress: NOT created (dead table, dropped)
```

### Note for whoever executes the migration

`src/utils/utils.ts:1358-1361` and `:1404-1406` delete from
`indicatorEvaluations` by `eventId` even though nothing ever writes to it —
this dead-write/live-delete asymmetry pre-dates this migration and wasn't
introduced by it; worth a follow-up cleanup ticket of its own (application
code, not schema) but is out of scope for this map.
