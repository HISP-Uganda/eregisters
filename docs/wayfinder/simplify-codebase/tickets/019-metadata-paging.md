---
title: Do the data set and category option combo pulls miss pages?
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [006-pull-resource]
---

## Question

The metadata pull's `dataSets.json` and
`categoryCombos/UjXPudXlraY/categoryOptionCombos.json` requests
(`src/machines/metadata-resources.ts`) send no `paging: false`, so DHIS2
returns only the first page (50). Check the counts on production; if
either can exceed a page, add `paging: false` as a deliberate change to
the pinned request snapshot.

## Resolution

Checked on the test server (DHIS2 2.43, 2026-09-28, read-only; production
not reachable from this dev setup, and the paging behaviour is the same):

- `dataSets.json` **is paged** (pageSize 50). There are 11 data sets, so
  the app's request gets them all today — but past 50 it would silently
  get only the first page, and reports for the rest would vanish.
  **Fixed:** `paging: false` added (`metadata-resources.ts`); the pinned
  request snapshot changed by exactly that, in full and incremental mode.
- `categoryCombos/UjXPudXlraY/categoryOptionCombos.json` **isn't paged**
  (no pager; 3 combos returned) — nothing to fix.

Checked: 82 test files / 563 tests pass.
