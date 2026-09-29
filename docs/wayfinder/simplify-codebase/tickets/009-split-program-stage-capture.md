---
title: Split ProgramStageCapture
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/components/program-stage-capture.tsx` (`ProgramStageCapture` 596 lines, `EditableCell` 152) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split into `src/screens/program-stage-capture/` (1,129 lines → 9 files,
largest component `EditableCell` ~110 lines); `main-event-capture.tsx`
imports it from there.

**A finding, and a decision by the user (2026-09-28):** `captureMode` was
never passed anywhere, so the `inline-expand` and `inline-row` modes
(~600 lines, added in `9beffc8`) had never run — every stage used the
popup. The `DA0Yt3V16AN` ternary in `main-event-capture.tsx` rendered the
same thing in both branches. The user chose to **keep both modes and wire
stage `DA0Yt3V16AN` (Medicines and Supplies) to `inline-row`** — a
deliberate feature change, against the map's "no new features" note, by
the user's call.

Fixed on the way, as the inline-row mode goes live: its table row
component was created inside render, so every re-render (e.g. after each
cell save) would have remounted all rows and lost their form state; it is
now a stable `InlineRow` fed through `onRow`.

Layout: `stage.ts` (pure: dates, labels, mandatory ids, rule events, the
form-machine input; unit-tested), `actions.ts` (create/save/delete, the
visit-date cascade), `use-stage-events.ts`, `editable-cell.tsx`,
`inline-row.tsx`, `inline-event-editor.tsx`, `stage-event-modal.tsx`,
`stage-columns.tsx`, `program-stage-capture.tsx`.

Checked: typecheck clean; 73 test files / 522 tests pass (5 new); fallow
clean. On the test server, a visit's Medicines and Supplies tab shows the
inline-row table (editable drug/dose/frequency cells, date shown
read-only, Delete) and Laboratory Tests still shows the popup-mode table;
no new console errors. **Not checked: typing into an inline cell** — that
writes a draft to a test client's visit, and it wasn't approved; worth a
hands-on try before release.
