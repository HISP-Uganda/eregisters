---
title: Keep, restore or delete the commented-out code?
type: wayfinder:grilling
status: open
assignee:
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
