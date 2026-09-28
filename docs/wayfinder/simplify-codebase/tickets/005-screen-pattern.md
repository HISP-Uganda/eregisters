---
title: What pattern should the giant screens be split into?
type: wayfinder:grilling
status: open
assignee:
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
