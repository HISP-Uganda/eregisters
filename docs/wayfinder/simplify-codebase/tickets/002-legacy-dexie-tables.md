---
title: Can the unused MOHRegisterDB tables and old migration code go?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-dexie-backend]
---

## Question

`MOHRegisterDB` (`src/db/index.ts`) still declares its old metadata
tables (programRules, dataElements, optionSets, …) though nothing reads
them since `checkInfo`/`queryInfo` were deleted — only `hmisDrafts` is
used. Decide whether to drop them (a Dexie version bump that deletes the
old tables on devices), and which old migration code (reading the legacy
`MOHRegister_*` tracker databases) can go once the Dexie decision is
made.

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Facts: `MOHRegisterDB` declared 18 tables; only `hmisDrafts` is used —
the other 17 are Dexie-era metadata copies nothing reads since metadata
moved behind `MetadataStore`, still holding full copies on older devices.
`src/db/index.ts` also exported six dead interfaces (`SyncOperation`,
`MachineState`, `RuleCacheEntry`, `MetadataSyncProgress`, and duplicates
of `Village`/`IndicatorEvaluation` — the live ones are in `schemas.ts`),
hidden from fallow by an `ignoreExports` entry. The "old migration code"
reading the `MOHRegister_*` databases is **not** removable: those are also
where the live Dexie fallback store lives, and the Dexie → SQLite copy
reads them.

1. **Dexie schema version 5 deletes the 17 unused tables on devices**
   (Q1), keeping `hmisDrafts`; earlier versions stay declared so any old
   schema still upgrades.
2. **The Dexie → SQLite copy's source stays** (Q2).
3. **Tidy** (Q3): the six dead interfaces removed; `SyncState` moved to
   `schemas.ts`; the stale `db` import in `utils.ts` removed; the fallow
   ignore for `src/db/index.ts` dropped, so dead exports there are caught.

Verified in a real browser (dev server): a `MOHRegisterDB` built with the
old version-4 schema (18 tables, one HMIS draft, an old `programRules`
row) opened by the new code → version 5, IndexedDB holds only
`hmisDrafts`, the draft intact (test draft deleted after). Typecheck
clean; 68 files / 475 tests pass; fallow: no new dead code.
