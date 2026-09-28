---
title: Split ProgramStageCapture
type: wayfinder:task
status: open
assignee:
blocked_by: [005-screen-pattern]
---

## Question

Split `src/components/program-stage-capture.tsx` (`ProgramStageCapture` 596 lines, `EditableCell` 152) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.
