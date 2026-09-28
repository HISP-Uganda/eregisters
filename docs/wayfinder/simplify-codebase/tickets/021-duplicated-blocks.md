---
title: Which duplicated blocks should be merged?
type: wayfinder:grilling
status: open
assignee:
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
