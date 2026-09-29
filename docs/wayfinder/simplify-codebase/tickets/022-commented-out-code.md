---
title: Keep, restore or delete the commented-out code?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Decide each:

1. `SplitSyncButton`'s `Dropdown` ("Re-download all data…", "Full
   Metadata Sync") — `screens/root-layout/sync-buttons.tsx`; its
   `dropdownItems` prop is still passed. A git stash "WIP: disable
   SplitSyncButton full-resync dropdown items" suggests it was switched
   off on purpose.
2. `PersistentStorageBanner` — commented out in `root-layout.tsx`; the
   58-line component in `src/components/persistent-storage-banner.tsx` is
   otherwise unused.
3. The client list's "Delete client" column and its dead "Patient
   Dashboard / Patient Summary" menu (no click handlers; the column only
   appears for an attribute id `actions`) —
   `screens/client-search/client-columns.tsx`.
4. `redirectByAuthorities` (send users without the eregisters authority
   or programs to the monitoring dashboard) — `utils/record-cascades.ts`.
5. Small leftovers: a commented `data.me` destructure in `App.tsx`, and
   the old `villages.json` import in `village-select.tsx`.

## Resolution

Decided 2026-09-29 (the user took the recommendations):

1. **Pull/Sync dropdown — deleted** (the commented `<Dropdown>`, the
   `dropdownItems` prop, and its "Re-download all data…" / "Full Metadata
   Sync" items), as the user's stash "WIP: disable SplitSyncButton
   full-resync dropdown items" intended. `SplitSyncButton` is now a sync
   button that is disabled while its sync runs; its tooltip still says
   "no program" only when there is none. The machine's
   `RESET_DATA_CHECKPOINT` / `FULL_METADATA_SYNC` events remain, for a
   future (e.g. admin-only) recovery action.
2. **Persistent storage — requested again, quietly.** The switched-off
   `PersistentStorageBanner` was the only caller of
   `requestPersistentStorage()`, so since v1.1.6's banner was turned off
   the app hadn't asked the browser to keep its storage — unsynced
   offline data could be evicted under storage pressure. `App.tsx` now
   asks once at startup, with no UI; the banner component is deleted.
   **A behaviour change** (restoring v1.1.6's intent).
3. **Client list's "Delete client" column and "Patient Dashboard /
   Summary" menu — deleted** (the column was never on; the menu had no
   handlers and never showed). Clients are still deleted from their page.
4. **`redirectByAuthorities`, the `data.me` destructure in `App.tsx`,
   the `villages.json` import — deleted.**

No commented-out code blocks remain in `src` (outside the generated form
configs). Checked: typecheck clean; 83 test files / 566 tests pass;
fallow: nothing reported.
