---
title: Split the data set reports page
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/routes/reports.data-set.tsx` (`Reports` 312 lines) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split into `src/screens/data-set-report/` (526 lines → 3 files, largest
145); the route file keeps `createRoute`, calls `loadReport` in its
loader, and binds the URL to the screen. Behaviour-preserving.

- `report-data.ts` — loading a report (the server's values from the
  "ereports" service, this device's draft on top, DHIS2's completion
  state), `resolveAttribution` (033B's fixed attribute option combo, in
  one table), `toFormValues`, `describeError`; the pure parts unit-tested.
- `report-actions.ts` — `verifyReport` (values to `dataValueSets`,
  complete registration, local draft marked verified/synced) and
  `revokeReport`; each returns false for an incomplete report identity.
- `data-set-report-screen.tsx` — the ten data sets' forms as one table
  (was ten near-identical JSX blocks), verify/revoke messages, the
  remount key.

Also removed: two leftover `syncStatus` fields in the loader's early
returns (the prop went in "Split the HMIS form renderer").

**Security finding (not changed — for a decision):** `fetchServerValues`
calls `https://eregisters.health.go.ug/ereports/query` with a hard-coded
`x-api-key`. It ships in the JS bundle to every browser (any user can
read it) and is in git history; the URL is also fixed to production, so
a dev app against the test server reads production's report values. Now
in one marked place (`report-data.ts`).

Checked: typecheck clean; 82 test files / 563 tests pass (4 new); fallow
clean, no cycles. Browser: not checked (tab hidden, in use).
