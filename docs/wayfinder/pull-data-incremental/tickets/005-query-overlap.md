---
title: Should Pull Data query with a safety overlap window?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-checkpoint-fix]
---

## Question

Research ("How does the DHIS2 tracker API interpret updatedAfter?")
confirmed the checkpoint format is correct and `updatedAfter` is
inclusive, but a record whose `lastUpdated` is stamped inside an import
that commits after our `serverDate` read can be skipped (ms–s; minutes
for bulk imports) — the Android SDK accepts that gap. Decide whether to
send `updatedAfter = checkpoint − N minutes` (stored checkpoint
unchanged; subtraction on the zone-less wall-clock string), what N is,
and how it interacts with the `sync.pullData` log's checkpointFrom.
Merges are idempotent, so the cost is re-downloading a few recent rows
per pull. Then implement + test (boundary string arithmetic stays
zone-free).

## Resolution

Grilled 2026-09-27. Re-fetching is safe: pulled rows go through
`mergeBulk*` (local-wins per field), so a record fetched twice changes
nothing and unsent local edits are never overwritten.

1. **Adopt a 5-minute overlap** (Q1 (b)) — `PULL_OVERLAP_MINUTES = 5`.
   Closes the import-commit gap (and small multi-server clock skew) for
   everything except imports longer than 5 minutes; costs only the
   records changed in that window per pull.
2. **Zone-free string arithmetic** (Q2) — `withPullOverlap` in
   `sync-metadata-mode.ts` parses `YYYY-MM-DDTHH:mm:ss[.SSS]` as a naive
   wall-clock value, subtracts, and formats back in the same shape
   (`Date.UTC` only as a calendar calculator — handles day/month/year and
   leap-day rollover). Anything else (a `Z` / offset-carrying value,
   unexpected format) is sent unchanged. The **stored** checkpoint stays
   the exact server date.
3. **Log** (Q3) — `sync.pullData` gained `updatedAfter` (value actually
   sent) beside `checkpointFrom` (stored).
4. **Constant** (Q4), not an admin setting.

Tests: overlap arithmetic (plain, midnight/month/year, leap day,
precision kept, no zone added, pass-through of zoned/unknown values);
machine test with the real pull actor — sends `13:43:54.384` for a
stored `13:48:54.384`, stores the exact server date, logs both. Full
suite 61 files / 456 tests; `pnpm build` + 6 SW sentinels. Not
browser-verified (the real actor path is covered in tests).
