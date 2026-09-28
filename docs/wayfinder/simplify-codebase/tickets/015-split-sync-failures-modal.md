---
title: Split SyncFailuresModal
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/components/sync-failures-modal.tsx` (`SyncFailuresModal` 381 lines) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split and moved to `src/screens/root-layout/sync-failures/` (482 lines →
3 files, largest `SyncFailuresModal` ~110 lines), its only user being the
root layout. Behaviour-preserving.

- `name-lookup.ts` — pure: readable names for the ids in DHIS2's sync
  errors (data elements, attributes, options, option sets with the fields
  using them, stages, sections); unit-tested.
- `failure-columns.tsx` — `ErrorCell` and the Error / Last attempt / Open
  columns written once and shared by the event, enrollment and client
  tables (they were three copies).
- `sync-failures-modal.tsx` — the tabs (one `failureTab` helper for the
  three) and Retry push.

The modal no longer runs its own three "failed" queries: the root layout
already runs them (`useRecordsToSync`) and passes the rows in.

Also fixed on the way (own commit): `update-controller.test.ts`'s
broadcast tests failed intermittently in full runs (5 s timeouts while
re-importing the controller after `vi.resetModules()`); they now have
20 s.

Checked: typecheck clean; 79 test files / 550 tests pass, twice (3 new);
fallow clean, no cycles. Not seen in a browser: the test server has no
failed records, and the popup is opened from failure entries.
