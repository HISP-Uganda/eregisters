---
title: Apply withAbortTimeout to the remaining unprotected sync calls
type: wayfinder:task
status: open
assignee:
blocked_by: []
---

## Question

Ticket "How should sync.ts's reachability check handle timeouts and
failure-type distinctions?" added `withAbortTimeout`
(`src/machines/network-reachability.ts`) but applied it only to
`isDhis2Reachable`. The other `engine.query` / `engine.mutate` call sites
in `src/machines/sync.ts` and `sync-metadata-actors.ts` (metadata pulls,
`system/info`, the tracker pull pages, the tracker-import submission,
dataStore config reads) can still hang indefinitely on a slow server.
Inventory them, choose per-call timeouts (GETs vs. the import POST —
don't abort a legitimately slow upload; reuse the SW ticket's reasoning),
apply the helper, and make sure a timeout surfaces as a normal failure
(the `sync.pullData` log's `outcome: "error"`, no checkpoint advance).
