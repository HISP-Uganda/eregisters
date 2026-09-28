---
title: What pattern should the giant screens be split into?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Six screen components are 480–870 lines each (`TrackedEntityComponent`,
`SectionLayout`, `ProgramStageCapture`, `LayoutWithDrafts`,
`AnalyticsPage`, `MainEventCapture`), mixing data queries, state,
handlers and large JSX. Decide one pattern for splitting them (e.g. data
hooks + presentational sections + handler modules, file layout, where
state lives), pick the first screen to prove it on, and how each split is
checked (tests + a browser walk-through of that screen).

## Resolution

**The pattern**: each giant screen gets a folder `src/screens/<screen>/`;
the route file keeps only `createRoute` and a small component binding the
URL (params, search, navigation) to the screen through props — so the
screen never imports its route (no cycle). In the folder:

- `use-<thing>.ts` — data hooks: live queries and derived metadata
- pure helper modules (`client.ts`) — no React, unit-tested
- presentational sections (`client-header.tsx`, `visits-card.tsx`, …) —
  props in, local UI state only
- `actions.ts` — the writes, as plain async functions (no hook needed);
  side effects like starting a push come in as callbacks

State stays where it lives (XState contexts, URL search, TanStack DB
collections); no new React contexts or stores; props go at most one level
down. Size target: no component or hook over ~150 lines, no file over
~300. Files are kebab-case, like `src/components`.

**Checking each split**: typecheck, the test suite, unit tests for the
pure helpers, fallow (no dead code, no cycles), and a browser
walk-through of the screen. For walk-throughs the dev proxy points at the
test server (`customization.health.go.ug/eregistry`, a local
`package.json` change never committed); writes there only with the user's
OK. No jsdom/Testing Library.

**Proven on the client page** (`src/routes/tracked-entity.tsx`, 971 →
61 lines, plus `src/screens/tracked-entity/`, 11 files, largest
`ClientView` ~100 lines). One deliberate behaviour change: the page
called `useMemo` after its "not found" return, so a client disappearing
while open (a delete, a sync) broke React's hook order; now
`TrackedEntityScreen` decides "not found" and a child renders the found
client. Checked: typecheck clean; 71 test files / 506 tests pass (5 new
for `client.ts`); fallow clean; on the test server a client's page, its
profile, a visit (with rule-computed BMI) and the client form open and
cancel with no errors. The `?edit=client` link wasn't re-tried — the
browser extension disconnected.
