---
label: wayfinder:map
tracker: local-markdown
---

# Reduce the remaining cached metadata startup wait

## Destination

A measured, implemented and verified reduction of the “Loading Metadata”
wait from app open to the first usable screen on a device with cached
metadata: a timed breakdown of that wait, the optimizations chosen from it
(each with its expected saving), built and re-timed before/after, with an
end-to-end target agreed once the breakdown is known. Cover storage boot,
local validity checks and hydration while preserving sync rules.

## Notes

- User reports that batching SQLite reads made startup only slightly faster.
  The prior optimization reduced check + hydration calls from 23 to five;
  this is a call-count result, not an end-to-end timing result.
- No new background refresh. Preserve existing empty-table/checkpoint rules
  and ensure pages receive complete metadata before rendering.
- The user authorized implementing removal of the root route's minimum
  spinner duration and limiting program hydration to one row. Broader
  optimization remains subject to the timing investigation.
- 2026-10-28: the user re-reported the wait as slow and, taking every
  recommendation, extended this map: "slow" is the cached-start wait (not
  first download or metadata sync); the map now **carries execution**
  through a measured, verified fix; timings come from real eRegistry
  metadata on a facility-class machine, with 4× CPU throttling on a fast
  laptop as the stand-in; only startup read paths and storage opening may
  change (sync/pull logic, `sync-metadata-mode.ts` helpers and the
  service-worker patch stay untouched).
- Candidates visible in code (2026-10-28, unmeasured): hydration reads
  every `organisation_units` row and filters by path in JS although
  `idx_ou_path` exists; the program row (stages, sections, data elements)
  is read and JSON-parsed twice — once by the validity check, again by
  hydration; storage boot (open, schema statements one worker round-trip
  each, migrations) runs before the check under the same spinner.
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
- [Measure where cached metadata startup time is spent](tickets/001-measure-startup.md): metadata is ready at 3.6 s; the remaining ~28 s is the first screen waiting for every client, enrollment and event to load.
- [Which code-visible startup candidates are worth building?](tickets/003-code-visible-candidates.md): none for now; measured as noise (1 org unit, ~1 ms reparse).
- [How should startup stop waiting for every tracker record?](tickets/004-stop-waiting-for-records.md): A — don't block the first screen on full collections; B — load child values packed per record.
- [Build the non-blocking first screen](tickets/005-non-blocking-first-screen.md): built; the first screen appears in ~2–3 s instead of ~31 s, with records loading behind it.

## Not yet specified

- The end-to-end target, once A's and B's timings are in.
- Whether other pages (visit capture, analytics) wait on full collections
  in ways A and B don't cover.
- Storage boot (~0.6 s, schema statements one round trip each) and the
  ~2.6 s before storage opens, if they still matter after A and B.

## Out of scope

- Introducing background metadata refresh, changing cache-validity rules,
  or rendering pages with incomplete metadata.
- Unrelated screen performance or changes to server synchronization.
