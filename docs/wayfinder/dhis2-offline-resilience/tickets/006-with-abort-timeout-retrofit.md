---
title: Apply withAbortTimeout to the remaining unprotected sync calls
type: wayfinder:task
status: closed
assignee: claude-session
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

## Resolution

Worked 2026-09-28; the user took every recommendation.

**Inventory — 18 unprotected calls**, none passing a signal:
`pullData` (`system/info`, one `tracker/trackedEntities` page per loop),
`pullResource` (`system/info`, category combos, org unit, data sets, and
the bulk collections: program, data elements, program indicators,
tracked entity attributes, program rules, rule variables, option sets,
option groups), the three `dataStore/eregisters/*` config reads in
`sync-metadata-actors.ts`, and the tracker import POST
(`submitTrackerImportAndWaitForReport`, `async: false`, carrying every
pending row).

1. **Four classes** (Q1), `SYNC_TIMEOUTS_MS` in
   `network-reachability.ts` — the data engine buffers whole responses,
   so these bound total time, sized for the payload on a slow link:
   `probe` 30 s (8 calls), `pullPage` 60 s (1), `bulkMetadata` 180 s (8),
   `trackerImport` 300 s (1).
2. **The import POST gets a long limit, not none** (Q2): since the
   cross-tab sync locks, a hung push would block pushing in every tab.
   Aborting may leave the server to commit; the rows stay `pending` and
   the next push re-sends them (CREATE_AND_UPDATE by UID).
3. **Helpers** (Q3): `queryWithTimeout` / `mutateWithTimeout` over
   `withAbortTimeout`; each call site names its class.
4. **Surfacing** (Q4): no new states — a timeout is a `FetchError`
   `network` with an `AbortError` in `details`, which
   `classifyFetchError` calls `"timeout"`: a pull ends in `failure` with
   `sync.pullData` `outcome: "error"` and no checkpoint advance; a push
   returns to `idle` with rows pending; config reads fall back to the
   stored config; metadata goes to `failure`.

Tests: helper times out exactly at its limit (not before) as
`"timeout"` and leaves no timer on a prompt answer; a hung import
leaves the row `pending`; a hung pull page (real `pullData`) ends in
`failure`, logs `outcome: "error"`, keeps the checkpoint. Full suite
63 files / 481.

Real browser (dev server, read-only): with the page's `fetch` made to
hang `tracker/trackedEntities` (honouring the signal), Pull Data was
still pulling at 35 s, aborted at 60.75 s → `failure`, `sync.pullData`
`{"outcome":"error","checkpointTo":null,"pages":0,"durationMs":60964}`,
checkpoint unchanged. With `fetch` restored, the next pull was `ok` and
advanced the checkpoint.
