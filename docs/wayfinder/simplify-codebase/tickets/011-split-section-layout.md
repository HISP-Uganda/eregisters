---
title: Split the section layout admin page
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/routes/admin.section-layout.tsx` (`SectionLayout` 806 lines, `LayoutGroupCard` 333) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split into `src/screens/section-layout/` (1,233 lines → 6 files, largest
component `SectionLayoutScreen` 173 lines, mostly layout JSX); the route
file keeps only `createRoute`. Behaviour-preserving.

- `layout.ts` — pure: every edit to a layout (add element into the active
  section, move element within its section, swap sections, insert /
  rename / colour / remove headers), grouping, loading from `formLayouts`
  or the older `subsections`, and converting back; 8 unit tests.
- `use-layout-editor.ts` — the editing state (layout, active and expanded
  section) and Save to the dataStore `ui-config` plus the local copy.
- `layout-group-card.tsx` (+ `section-colors.tsx`) — a group's card, now
  title, header actions and element rows as small components; the three
  colour pickers are one table.
- `section-panels.tsx` — the section list, the available elements, and
  one name popup used for both "add" and "rename" (they were copies).
- `section-layout-screen.tsx` — composition and the DHIS2 sections of
  each kind.

Checked: typecheck clean; fallow clean; full suite passes (75 files /
534 tests; one earlier run had 2 intermittent failures in the unrelated
`update-controller.test.ts`, which then passed 3/3 alone and 2/2 in full
runs). Browser (test server, nothing saved): the page renders, picking a
section loads it, adding an element and adding a section via the popup
work, no console errors. The browser tool then stopped responding
(screenshots and element lookups timed out), so moving, renaming,
colouring and adding into an active section weren't clicked through —
they're covered by the `layout.ts` tests.
