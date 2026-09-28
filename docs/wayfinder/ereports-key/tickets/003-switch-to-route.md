---
title: Switch the report page to the DHIS2 route
type: wayfinder:task
status: open
assignee: claude-session
blocked_by: [002-route-api-research]
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

## Progress (2026-09-29)

- **Code** (`23f8a55`): `fetchServerValues` calls `routes/ereports-query/run`
  through the data engine; the dead `aggregateData` region and its key
  copy removed from `sync.ts`. No key or ereports URL left in `src`.
- **Test server** (the user's OK): route `ereports-query` created —
  uid `aarGHEoF7B4`, `api-headers` auth with the current key (the user:
  "use the same key for now"), `authorities: ["M_eregisters"]`,
  `responseTimeoutSeconds: 30`. Checked:
  - reading the route back returns only `{"type":"api-headers"}`-level
    auth — **the key isn't exposed**;
  - **query parameters are forwarded**: HMIS 105:1, Kisugu, 202608 → 143
    values via the route, 143 via ereports directly;
  - upstream errors pass through (no parameters → ereports' 422).
- **Production:** no route yet. It must be created there (with the
  user's OK) **before** a build with this change is deployed, or report
  pages open without server values.
- **In the app** (test server, new code): the HMIS 105:01 report for
  Kisugu, August 2026, opened with its server values (17 of the first
  tab's 40 cells filled, from the 143 values); switching to July fetched
  `api/43/routes/ereports-query/run` — and nothing from ereports directly
  — and showed an empty form, correctly (July has 0 values).

Remaining for this ticket: create the same route on **production**
(needs the user's OK), before deploying a build with `23f8a55`.
