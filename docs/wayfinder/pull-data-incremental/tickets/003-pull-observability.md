---
title: What does the sync.pullData log line record? (Phase 2)
type: wayfinder:grilling
status: open
assignee:
blocked_by: [001-checkpoint-fix]
---

## Question

IMPLEMENTATION_PLAN R8: one structured `console.info("sync.pullData", …)`
per pull (match the `storage.boot` line's style). Decide which fields
the `pullData` actor can actually report (mode, checkpointFrom,
checkpointTo, records fetched / written per resource, pages, duration,
connectivityStatus, outcome ok|error|offline) — extending its output
type as needed — and whether it fires on `onDone`, `onError` and the
offline short-circuit alike. The "last pulled X ago" label already
exists on the Pull Data button, so R14's widget is not in scope here.
Then implement with a `vi.spyOn(console, "info")` shape test.
