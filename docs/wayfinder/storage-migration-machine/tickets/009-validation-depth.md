---
title: What must the verifying state check beyond tracker ids?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

`StoreCopySteps.verify(written)` checks only that every tracker id
(plus hmis drafts in reverse) is present in the live store. `copyConfig`
(sync_state / metadata_versions — the sync checkpoints) and
`copyMetadata` (all `MIGRATED_METADATA_TABLES`) are unverified. Per
`code-analysis.md` §13 and §23 (a copy that loses the sync checkpoint is
incomplete), decide which of these `verify` must also assert before
`markComplete`: sync_state `lastPullAt`/`lastPushAt` equality, metadata
version equality, per-table metadata row counts — and whether a
mismatch fails the copy (rollback) or is only logged. Then implement in
both directions with tests.

## Resolution

Grilled 2026-09-26. Key fact: SQLite writes exactly one child row per
key of `attributes` / `dataValues` (nulls kept), so nested counts are
exact — no false mismatches.

1. **Checkpoint read-back** (Q1): `verify` re-reads `sync_state`
   (`lastPullAt`, `lastPushAt`) and `metadata_versions` (`lastSync`)
   from the target and compares with what `copyConfig` copied (only
   values that were copied). Mismatch **fails the copy** — losing the
   incremental-sync position is an incomplete copy (§23).
2. **Nested rows** (Q2), both directions, **fail on shortfall**:
   forward counts `tracked_entity_attributes` / `enrollment_attributes`
   / `event_data_values` for the copied ids; reverse sums the nested
   keys of the rows read back from Dexie (`sumDexieNestedKeys`).
   Expected totals are gathered as the copy reads its source. Check is
   `found >= expected`: an update of a pre-existing row may leave extra
   child rows, which isn't loss.
3. **Metadata** (Q3 (b)): per migrated table, target rows vs the
   source's distinct keys (`distinctMetadataKeys`, composite-key aware).
   A shortfall does **not** fail the copy — `lastMetadataSync` is
   cleared in the target so the next metadata sync is a full pull, and
   `verify` returns `{ metadataRepull: true }`, which reaches the
   `storage.boot` line as `copy.metadataRepull`.
4. **No value-by-value comparison** (Q4).

Code: `store-copy.ts` (`VerifyReport`, `countNestedKeys`,
`assertNestedRows`, `assertCheckpoint`, `metadataShortfalls`),
`metadata-operations.ts` (`keyForRow` exported, `distinctMetadataKeys`),
both step modules, `DexieMigrationTarget` + real target (5 read-back
methods), `dexie-verification.ts`, machine (`verifyCopy` actor,
`metadataRepull` in context and summary).

Tests: 3 reverse loss-detection tests (attributes, checkpoint,
metadata → repull), 4 helper unit tests. Existing forward suites on
real SQLite now exercise the exact nested/checkpoint/metadata checks.
Full suite 59 files / 428 tests. Uncommitted on
`feature/storage-migration-machine`.
