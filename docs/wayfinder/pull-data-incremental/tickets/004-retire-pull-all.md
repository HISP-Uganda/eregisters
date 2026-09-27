---
title: Retire Pull All Data behind an admin "Reset sync checkpoint" (Phase 3)
type: wayfinder:grilling
status: open
assignee:
blocked_by: [001-checkpoint-fix, 003-pull-observability]
---

## Question

IMPLEMENTATION_PLAN R3: remove the "Pull All Data" dropdown item
(`__root.tsx`), the `FULL_DATA_SYNC` event, the `fullRefresh` state and
the empty `deleteAllData` actor, and add a `RESET_DATA_CHECKPOINT`
path. Decide:

- where the reset lives (`admin.app-settings.tsx`?) and who may use it
  (the admin area's `ALL` gate, or a narrower authority);
- whether reset clears only `lastDataPull` or also `lastDataPush`, and
  whether it persists immediately (through Phase 1's
  `persistingCheckpoint`) or only on the next pull;
- whether the next pull starts automatically after a reset;
- confirmation wording ("local records are not affected");
- how to announce the removed menu item to users (release note only?).

Then implement with tests (plan Tests H–J).
