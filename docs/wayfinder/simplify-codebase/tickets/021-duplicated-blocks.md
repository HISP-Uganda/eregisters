---
title: Which duplicated blocks should be merged?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

fallow's real (non-generated) clone groups: `src/analytics/column-registry.ts`
(three near-identical blocks inside `buildColumnRegistry`, 268 lines);
the SQLite row adapters' `loadByKeys` in
`src/db/sqlite/row-adapters/{enrollments,events,tracked-entities}.ts`;
and the admin pages' "update `ui-config`, else create it, then save the
local copy" (`admin.app-settings.tsx` ×2, `admin.stage-relations.tsx`,
`screens/section-layout/use-layout-editor.ts`). Decide which to merge and
how — noting the admin broadcast must record the signal as seen
*before* the local copy is saved (see `admin.app-settings.tsx`), so a
shared helper can't just do both steps.

## Resolution

Decided 2026-09-28 (the user took the recommendations):

1. **`column-registry.ts` — merged.** The three per-stage loops (main
   stage, child-stage slots, linked parent stages) share one generator,
   `stageDataElements`, which owns the rule that ungrouped or
   service-filtered-out data elements are omitted and yields each data
   element's label, value kind and group path. Pinned first (own commit):
   a snapshot of the full 42-column list across all three kinds —
   unchanged after.
2. **SQLite row adapters' `loadByKeys` — left.** The shared part is a
   signature and a two-line preamble; the bodies read different tables.
   It's now fallow's only non-generated clone group.
3. **dataStore saving — merged the server step.** `saveToDataStore(engine,
   key, value)` (`src/db/app-data-store.ts`: update, else create) replaces
   four copies — `ui-config` in App Settings (×2) and Section Layout, and
   `stage-hierarchy` in Stage Relations. Callers still save their local
   copy themselves, so the admin's reload broadcast still marks the
   signal as seen before that.

Checked: typecheck clean; 83 test files / 566 tests pass (3 new); fallow:
no dead code, one clone group left (item 2).
