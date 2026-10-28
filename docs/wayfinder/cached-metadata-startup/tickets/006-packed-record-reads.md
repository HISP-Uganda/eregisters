---
title: Build packed record reads
type: wayfinder:task
status: in-progress
assignee: claude
blocked_by: [005-non-blocking-first-screen.md]
---

## Question

Build change B from "How should startup stop waiting for every tracker
record?": load each tracked entity's, enrollment's and event's child
values packed as one JSON value per parent row. Keep the row adapters'
output identical (tests), and measure the full collection load before
and after on the user's data.

## Progress (2026-10-28)

Built: `makeRelatedRowsLoader` (`src/db/sqlite/row-adapters/load-related-rows.ts`)
now asks SQLite for each parent's child name/value pairs packed with
`json_group_object(...) GROUP BY` the parent key, one row per record; the
events, tracked-entity and enrollment adapters reassemble from that object.
Output unchanged (row-adapter tests pass). `json_group_object` is compiled
into every `@journeyapps/wa-sqlite` 2.0.4 build.

Synthetic benchmark (Node SQLite, 20,000 events × 30 data values, with a
`structuredClone` per result standing in for the worker transfer):
full event load 4.2–4.3 s → 0.50–0.53 s; transfer stand-in 1.7 s → 0.15 s.
Awaiting the user's check on real data: whether the post-paint freeze is
gone and how soon "Total Clients" shows.

User check after packing: the page still freezes until the client
statistics load ("Register New Client" only responds then). Cause: the
collection adapter applied the whole initial load in one sync commit, so
the commit and every live query's update ran as one uninterrupted task.

Built (`src/db/sqlite/collection-adapter.ts`): full reloads now commit in
chunks of 1,000 rows with a macrotask yield between them, and all reloads
(full and scoped) run through one ordered queue, so a local write during
a chunked load is never diffed against a half-applied snapshot (and the
pre-existing race, where the final delete pass could drop a row written
during the load's read, is closed). The collection is still marked ready
only after the last chunk, so queries never treat a partial load as
complete. New opt-in timings: `load-<collection>` and `apply-<collection>`.
Tests: chunked load yields mid-way and isn't ready early; a row written
mid-load survives. 727/727 tests.

User check after chunking: ~7 s (reported without the capture). Next fix
built: the shell's enrollment and event sync queries
(`use-shell-state.ts`) start only once the tracked-entity collection is
ready (`onFirstReady`), so clients load without competing for the worker
and main thread; the sync badge fills in shortly after. 727/727 tests.
