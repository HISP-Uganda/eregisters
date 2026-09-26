---
title: What structured logs does the migration machine emit?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-state-chart]
---

## Question

`code-analysis.md` §15 lists migration log fields (migration id,
source/target, per-store read/written/skipped/failed counts, commit
status, sync-state source/destination value, validation status, cleanup
status, duration). Decide which of these the step actors can actually
report, the log shape (one `console.info("storage.migration", {...})`
per step and one summary, matching the `sync.pullData` style planned in
IMPLEMENTATION_PLAN Phase 2), and whether it is emitted from actions on
transitions or inside actors. No payloads/PII in logs. Then implement,
with a `vi.spyOn(console, "info")` shape test.

## Resolution

Grilled 2026-09-26. Sets the app's first structured-log pattern.

1. **One `console.info("storage.boot", summary)` per boot** (Q1 (a)),
   on entry to `ready`, `failed` or `unavailable` (a RETRY gets a fresh
   `bootId` and its own line). Step failures still also go to
   `console.error`.
2. **Shape** (`BootSummary`, built by the pure `bootSummary(context,
   outcome)` in `src/machines/storage-boot.ts`): `bootId, setting,
   backend, outcome, fellBack, durationMs, error?` plus, when a copy was
   attempted, `copy: { direction, verdict, result
   (copied|current|fresh|cleanup-only|failed|skipped), rows (counts per
   table), checkpoint, failedStep?, rollback, cleanup }`. Counts and
   timestamps only — tested to contain no row ids.
3. **Checkpoint evidence** (Q3): `StoreCopySteps.copyConfig()` now
   returns `CopiedCheckpoint { lastPullAt, lastPushAt, lastMetadataSync }`
   in both directions; the machine keeps it for the log. This is the
   production evidence (`code-analysis.md` §23/§27) that a copy carried
   the incremental-sync position across.
4. **Console only** (Q4). Persisting the last summary for support
   (e.g. an admin-settings view) ruled out of scope.

Machine bookkeeping added: `failedStep` (via `assignError`'s new
`step` param), `rollback` / `cleanup` step status, `verdict` for every
detect outcome, `bootId`/`startedAt`.

Tests: 4 new (ready line shape + no ids, failed step/rollback/fallback,
`current` vs no-copy summaries, unavailable). Full suite 60 files /
419 tests. Uncommitted on `feature/storage-migration-machine`.
