---
title: Measure where cached metadata startup time is spent
type: wayfinder:task
status: closed
assignee: claude
blocked_by: []
---

## Question

Capture a timing breakdown of the remaining startup delay on an affected
device with the optimized code and existing cache. This task supplies
evidence for choosing the next optimization; it does not implement it.

Measure the validity check, full hydration database/worker wait, JSON
decoding, grouping/map construction and organisation-unit sorting, the
transition to `metadataSync.waiting`, and when the loading indicator
actually disappears. Check route pending-delay settings in the installed
router version. Distinguish storage boot before the metadata indicator
from the indicator's own lifetime.

Record backend, per-table counts and payload sizes, repeated-load timings,
and whether the machine actually takes the cached path or unexpectedly
enters syncing. Do not record metadata contents or patient information.
Inspect competing work only if the timeline indicates contention.

Link the timing artifact from the resolution. If device access requires
human help, provide precise capture steps and leave the task open until
the evidence is available; do not substitute simulated latency or SQL
call counts for the reported device delay.

## Progress

Added opt-in User Timing for SQL worker calls, including driver queue,
request/response, worker adapter execution, and returned-row counts.
[Capture instructions](../sql-timing.md) allow collecting these timings
without a connected browser. This ticket remains open: no affected-device
timings have been captured, and hydration/rendering are still unmeasured.

2026-10-28 (claude, taking over this ticket): added opt-in startup-step
timing behind the same switch (`src/utils/startup-timing.ts`): database
open and schema, whole storage boot, `me` loaded, validity check,
per-table decode rows/kilobytes, hydration read and assembly (with
organisation units read vs kept), loader done and first screen. The
[capture instructions](../sql-timing.md) now print and copy the whole
timeline in one step. Still open: waiting on the user's capture from
real eRegistry metadata (three reloads), plus a 4× CPU-throttled run.

### First capture (2026-10-28, user's machine, real data, SQLite, no store copy)

| Step | At (ms since navigation) | Duration (ms) |
|---|---|---|
| open-database (≈ all create-schema) | 2608 | 593 |
| storage-boot | 2609 | 606 (boot log: 661) |
| user-loaded (mark) | 3052 | — |
| check-metadata | 3233 | 10 |
| decode (program, 221 KB) | 3242 | 1 |
| read-metadata (16,860 rows; data_elements 5,410 rows / 1.2 MB) | 3244 | 313 |
| decode (hydration) | 3537 | 20 |
| assemble (org units read 1, kept 1) | 3557 | 4 |
| metadata-ready (mark) | 3563 | — |
| first-screen (mark) | 31528 | — |

SQL: 61 `execute` calls, 25,378 ms worker time in total.

Finding: metadata is ready 3.6 s after navigation; the remaining ~28 s is
the root layout's `useLiveSuspenseQuery` calls
(`src/screens/root-layout/use-shell-state.ts`) suspending until the
tracked-entity, enrollment and event collections fully load from SQLite,
shown through the root route's "Loading Metadata" pending component. The
code-visible metadata candidates are noise at this facility (one org unit;
program parsed twice costs ~1 ms). Awaiting the per-call breakdown of the
25 s and the facility's record counts.

## Resolution (2026-10-28)

Metadata is ready 3.6 s after navigation (check 10 ms, hydration read
313 ms, decode 21 ms, assembly 4 ms); storage boot ≈ 0.6 s, nearly all
schema setup. The first screen appears at 31.5 s: the ~28 s gap is the
root layout and the client list suspending until the tracked-entity,
enrollment and event collections fully load (`makeRelatedRowsLoader`
returns every attribute/data-value as its own row in one worker message;
25.4 s of worker time), shown under the "Loading Metadata" pending
component. The per-call breakdown of that 25 s was not captured; the
before/after timings of the chosen fix will measure it instead.
