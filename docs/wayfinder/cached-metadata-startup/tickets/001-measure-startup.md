---
title: Measure where cached metadata startup time is spent
type: wayfinder:task
status: open
assignee: codex-session
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
