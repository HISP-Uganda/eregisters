---
title: Retire Pull All Data behind an admin "Reset sync checkpoint" (Phase 3)
type: wayfinder:grilling
status: closed
assignee: claude-session
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

## Resolution

Grilled 2026-09-27. Facts that reshaped the plan's R3: `admin.app-settings`
is **fleet-wide** (DHIS2 dataStore `uiConfig` broadcasts, `ALL`-gated),
so an admin-page reset would only reset the admin's own device; and the
single global checkpoint (B5) makes an **org-unit reassignment** miss the
new org unit's history — the one case a full pull is genuinely needed.

1. **Demoted, not admin-only** (Q1 (b)): the "Pull All Data" item is
   replaced by **"Re-download all data…"** in the Pull Data dropdown,
   available to every user, behind a confirmation dialog. `sync.pullData`
   (`mode: "full"`) shows whether people keep reaching for it.
2. **Scope-keyed checkpoint** (Q2): `sync_state.pullScope` =
   `pullScopeKey(program, orgUnit)` is saved with every pull checkpoint;
   on boot `checkpointForScope` ignores a checkpoint taken for another
   scope, so an org-unit change triggers a full pull automatically.
   Legacy rows (no `pullScope`) are trusted — forcing every device into a
   full re-download on upgrade would be the very load this avoids.
   (Helpers in `sync-metadata-mode.ts`; `PULL_PROGRAM` constant.)
3. **Reset** (Q3): `RESET_DATA_CHECKPOINT` (from idle / waiting /
   failure) → `resettingCheckpoint` persists `{ lastPullAt: undefined,
   pullScope: undefined }` via `patchSyncState`, then clears context and
   goes straight to `syncing`. Never touches `lastPushAt` or local rows.
   A failed save changes nothing (→ `waiting`). `FULL_DATA_SYNC`,
   `fullRefresh` and the empty `deleteAllData` actor deleted.
4. **Wording** (Q4) as agreed; **announcement** (Q5) via PR / release
   notes only.

Tests: scope helper unit tests (match / other org unit / legacy / none);
machine tests — other-org-unit checkpoint ignored, scope saved with the
next checkpoint, reset clears only the pull checkpoint on disk and pulls
with no boundary (push checkpoint kept), failed reset save does nothing.
Full suite 61 files / 451 tests; `pnpm build` + 6 SW sentinels.

Real browser (dev proxy, read-only): dropdown shows only "Re-download
all data…"; the dialog renders the agreed text; **Cancel** → no request,
checkpoint unchanged; **Re-download** → request with **no**
`updatedAfter`, new checkpoint `2026-09-27T13:48:54.384` saved with
`pullScope ueBhWkWll5v:QBzwhBVuYPt`, local records kept; the next
routine Pull Data sent `updatedAfter=2026-09-27T13:48:54.384`. The
pre-existing legacy (unscoped) checkpoint was trusted on boot.
