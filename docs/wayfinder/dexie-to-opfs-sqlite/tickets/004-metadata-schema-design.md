---
title: SQLite Schema for MOHRegisterDB Metadata Tables
type: wayfinder:grilling
status: open
assignee: null
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
