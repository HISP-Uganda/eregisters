---
title: Should Pull Data query with a safety overlap window?
type: wayfinder:grilling
status: open
assignee:
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
