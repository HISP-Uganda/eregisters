---
label: wayfinder:map
tracker: local-markdown
---

# Reduce the remaining cached metadata startup wait

## Destination

Identify what dominates the remaining “Loading Metadata” wait on a device
with cached metadata, and decide the next optimization using measured evidence.
Cover local validity checks and hydration while preserving sync rules.

## Notes

- User reports that batching SQLite reads made startup only slightly faster.
  The prior optimization reduced check + hydration calls from 23 to five;
  this is a call-count result, not an end-to-end timing result.
- No new background refresh. Preserve existing empty-table/checkpoint rules
  and ensure pages receive complete metadata before rendering.
- The user authorized implementing removal of the root route's minimum
  spinner duration and limiting program hydration to one row. Broader
  optimization remains subject to the timing investigation.
- Consult `diagnose`, `grilling`, and `domain-modeling` as appropriate.
- Tracker convention: tickets below `tickets/`; `blocked_by` references
  sibling filenames. Open, unassigned tickets with no open blockers form
  the frontier. Claims use `assignee`.
- Relevant sources: `src/routes/__root.tsx`, `src/machines/sync.ts`,
  `src/db/metadata-operations.ts`, and both metadata-store implementations.
- No connected browser was available during charting, so the reported
  residual delay has not been reproduced or timed here.

## Decisions so far

- [Choose the next optimization from measured startup timings](tickets/002-choose-optimization.md): user selected the two small, code-supported changes before device timing; broader changes still need measurements.

## Not yet specified

- Whether the dominant cost is local reads/worker transfer, JSON decoding,
  metadata assembly, competing startup activity, or route rendering.
- Which optimization addresses that measured cost without changing the
  agreed cache-validity and readiness behavior.

## Out of scope

- Introducing background metadata refresh, changing cache-validity rules,
  or rendering pages with incomplete metadata.
- Unrelated screen performance or changes to server synchronization.
