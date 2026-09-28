---
title: Split the root layout
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/routes/__root.tsx` (`LayoutWithDrafts` 440 lines, `SyncErrorsButton` 190, `navItems` 145) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split into `src/screens/root-layout/` (982 lines → 6 files, largest
`NavItems` ~110 lines); `src/routes/__root.tsx` keeps only `RootRoute`
(context, pending spinner, the metadata-loaded loader). Behaviour-preserving.

- `failures.ts` — pure: the errors menu's preview (events, then
  enrollments, then clients; at most six, plus "…and N more"), short ids,
  first error line; unit-tested (replaces a loop with three copies).
- `sync-errors-button.tsx`, `sync-buttons.tsx` (`SyncButton`,
  `SplitSyncButton`, `PushDataButton`, sharing one two-line label).
- `use-shell-state.ts` — `useSyncStatus` (what's running, last runs,
  admin/program), `useRecordsToSync` (the six pending/failed queries),
  `useMetadataReloadBanner` (the broadcast banner and its dismissal),
  `useConnectivityEvents`, `useStageNames`.
- `nav-items.tsx` — the header/drawer buttons; `root-layout.tsx` — the
  shell (header, version tooltip, drawer, notices, outlet, failures modal).

Kept as it was: `SplitSyncButton`'s commented-out `Dropdown` (and so its
unused `dropdownItems`) — that's the map's "commented-out code" item.
fallow no longer flags the prop only because it is now destructured.

Checked: typecheck clean; 77 test files / 543 tests pass (3 new); fallow
clean, no cycles. **Browser check** (test server, the tab hidden so read from the DOM once
the new modules had loaded): the header shows the facility, Pull Data /
Sync Metadata / Push Data with their last-run times, the pending (0) and
failed (0) badges, Errors, Verify Reports, Line Lists and Administration,
linking to `/`, `/reports`, `/analytics` and `/admin/section-layout`.
Not clicked: the drawer, the errors menu, the metadata banner.
