---
title: Do two open tabs' sync machines conflict, and does sync need a cross-tab lock?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

Every open tab runs its own `sync.ts` machine: pushes (`processBatchSync`
on PUSH_DATA / NETWORK_RECONNECT), pulls, and metadata sync. The storage
boot's Web Lock covers only the store copy. With two tabs: can both push
the same pending rows (duplicate imports? DHIS2 imports by UID, so
likely updates, but `syncStatus` transitions and failure bookkeeping may
race), pull concurrently (double bandwidth; checkpoint writes are
serialized per tab by `patchSyncState`'s queue but not across tabs), or
run metadata sync twice? Decide whether sync needs a cross-tab lock
(e.g. `navigator.locks` per sync kind, or leader election), what the
non-leader tab shows, and verify the chosen behaviour with two real tabs.

> From "How should config changes made in one tab reach other open
> tabs?": also decide how a tab learns of **metadata another tab
> synced** — each tab's `sync.ts` holds `context.metadata` in memory,
> loaded once, and nothing refreshes it (config rows and SQLite
> collections now propagate via `src/db/cross-tab.ts`, which a fix here
> could reuse).
