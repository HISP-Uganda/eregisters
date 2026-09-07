---
title: How Does src/machines/sync.ts's Pull/Push Logic Get Restructured for the New SQLite Adapter?
type: wayfinder:grilling
status: open
assignee: null
blocked_by: []
---

## Question

Graduated from the map's "Not yet specified" fog now that the schema
(tickets 003/004) and the direct collection adapter (ticket 011) are both
settled and verified. `src/machines/sync.ts` (~1.9k lines, explicitly
load-bearing per root `CLAUDE.md`) currently reads/writes Dexie directly
in its `pullData`, `saveMetadata`, `pullUIConfig`, `pullStageHierarchy`,
and push (`processBatchSync`) actors.

Needs deciding:
- Does `pullData`'s paged tracker fetch loop write each page via the
  adapter's `utils.bulkInsertLocally` (per ticket 011's pattern) one row
  at a time, or does it warrant a more optimized batch-SQL-insert path
  for large pages (op-sqlite's `transaction()` already batches at the
  SQL level, per ticket 008's findings — is the adapter's per-row loop
  inside one transaction sufficient, or does a real device's page size
  (ticket "add data-pull page size config", already shipped) risk being
  slow row-by-row)?
- Where does the field-level merge logic (`src/db/merge-utils.ts`'s
  per-key "local wins, server fills gaps" behavior, preserved in ticket
  003's schema via the `source` column) actually execute — inside the row
  adapter's `insertRow`/`updateRow` (SQL-side), or does `sync.ts` keep
  computing the merge in JS and hand the adapter an already-merged row
  (matching today's architecture, where `mergeEvent`/etc. run in
  `sync.ts` before calling Dexie)?
- `saveMetadata` currently does one `bulkPut` call per resource
  (`src/machines/sync.ts:792-833`) — ticket 004's resolution already
  flagged this collapses into one reusable function under the uniform
  `id`+`data` schema; confirm/design that function's shape.
- Do `checkIndexDB`/`queryInfo` (`src/utils/utils.ts`, referenced in
  ticket 004's research) get 1:1 SQL ports, or restructured given the
  metadata tables' new uniform shape removes most of their per-table
  special-casing?
- Does this restructuring happen as one big-bang rewrite of `sync.ts` (per
  the map's standing big-bang preference), or incrementally per-actor
  behind a storage-backend abstraction during development (even though
  the shipped result is still one release)?

Invoke `/grilling` and `/domain-modeling`.
