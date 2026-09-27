---
title: How should config changes made in one tab reach other open tabs?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

`src/db/reactive-config.ts`'s pub/sub (behind `useConfigRow.ts`, e.g.
`ui_config`, `stage_hierarchy`) is same-tab only, so a config change in
one tab (admin settings, a metadata sync) isn't reflected in another
open tab until it re-reads. Concurrent tabs are now real and verified
(COOP/COEP verification ticket, item 6). Decide: `BroadcastChannel`
notifications between tabs vs. re-reading on `visibilitychange`/focus
(the pattern `__root.tsx`'s reload-signal polling already uses) vs.
accepting the gap — which config rows actually matter across tabs, and
whether tracker collections (TanStack DB snapshots) have the same gap.
