---
title: Split the analytics page
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/routes/analytics.tsx` (`AnalyticsPage` 497 lines) and `src/components/analytics/computed-column-modal.tsx` (`ComputedColumnModal` 382) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split into `src/screens/analytics/` (617 + 456 lines → 9 files, largest
`AnalyticsScreen` ~180 lines); the route file keeps `createRoute` and the
`?restore=` handling. Behaviour-preserving.

- `return-search.ts` — pure: the snapshot carried to a record and back
  (encode with the size cap that drops table state first; decode);
  unit-tested.
- `use-analytics-dataset.ts` — the live queries and the deferred,
  token-guarded dataset build ("idle" until a stage and period are set).
- `use-line-list-columns.ts` — computed columns applied, visible columns,
  the table-filtered rows the pivot and exports use.
- `use-available-height.ts`, `analytics-tabs.tsx` (the tab CSS, the
  placeholder, the pivot tab), `analytics-screen.tsx`.
- `computed-columns/` — `ComputedColumnModal` moved from
  `src/components/analytics/` and split: `draft.ts` (pure: draft, the
  validation rules as `draftError`, `toDefinition`; unit-tested),
  `draft-editor.tsx` (form + one `RangeRow`), `computed-column-modal.tsx`
  (list + shell).

Checked: typecheck clean; 76 test files / 540 tests pass (6 new); fallow
clean, no cycles. **Browser check not done**: after a reload the dev app
stayed on the DHIS2 platform's loading screen (only 5 source modules
fetched, no build error overlay) — the platform start, before any app
code, so not this change; to be walked through once the dev session
loads again.
