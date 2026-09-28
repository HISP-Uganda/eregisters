---
title: How should the metadata pull (pullResource) be broken up?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

`pullResource` in `src/machines/sync.ts` is one ~400-line actor that
fetches each metadata resource in turn (system info, org units, data
sets, program, data elements, indicators, attributes, rules, rule
variables, option sets, option groups…), with per-resource params and
incremental filters. Decide how it splits (one small function per
resource? a table of resource definitions?) without changing what's
requested, and how that's verified (the request list before/after).
