---
title: Do the data set and category option combo pulls miss pages?
type: wayfinder:task
status: open
assignee:
blocked_by: [006-pull-resource]
---

## Question

The metadata pull's `dataSets.json` and
`categoryCombos/UjXPudXlraY/categoryOptionCombos.json` requests
(`src/machines/metadata-resources.ts`) send no `paging: false`, so DHIS2
returns only the first page (50). Check the counts on production; if
either can exceed a page, add `paging: false` as a deliberate change to
the pinned request snapshot.
