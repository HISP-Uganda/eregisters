---
title: Switch the report page to the DHIS2 route
type: wayfinder:task
status: open
assignee:
blocked_by: [001-rotate-key, 002-route-api-research]
---

## Question

Create the route on the test server (then production, with the user's
OK) holding the new key, point `fetchServerValues` at it through the app's
data engine, delete the hard-coded URL and key, and check a report's
values load on the test server.

**Found 2026-09-29 — a second copy of the key:** `src/machines/sync.ts`'s
`pullAggregateData` actor also calls `ereports/query` with the same
hard-coded key. It is dead: the machine's `aggregateData` region only
runs on `SET_PERIOD` / `SET_DATASET` / `SET_ORG_UNIT`, which nothing
sends, and nothing reads `context.aggregateData`. Delete that region, its
actor, the three events and the `AggregateData` types as part of this
ticket, so no copy of the key is left in `src`.
