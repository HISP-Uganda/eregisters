---
title: Do two open tabs' sync machines conflict, and does sync need a cross-tab lock?
type: wayfinder:grilling
status: closed
assignee: claude-session
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

## Resolution

Grilled 2026-09-27; the user took every recommendation.

Facts: the browser's `online` event starts a push **and** a pull in
every open tab at once (the realistic collision); a push has no claim
step (it reads every pending/failed/deleted row and sends them — two
tabs send the same rows, and concurrent creates or repeated deletes can
come back as false failures); `patchSyncState`'s queue was per-tab, so
two tabs' checkpoint patches could overwrite each other; each tab held
its own in-memory checkpoints and metadata, loaded once.

1. **Coordination** (Q1): one Web Lock per sync kind
   (`eregisters-sync-push` / `-pull` / `-metadata`, `sync-locks.ts`).
   Each sync is a parent state (`dataSync.batchSync`, `dataPull.syncing`,
   `metadataSync.syncing` — names unchanged, so `__root.tsx`'s checks
   still work) that invokes `holdSyncLock`, a callback actor holding the
   lock while the state is active; leaving it (done, failed, the machine
   stopping) releases it. Metadata's whole flow (pull → delete/save → UI
   config → stage hierarchy) sits under one lock.
2. **Busy → skip** (Q2), for automatic and button-started syncs alike.
3. **Other tab** (Q3): an antd `message.info` ("Another open tab is
   already …"); push → `idle`, pull → `waiting`, metadata → re-read the
   store. A root-level `watchOtherTabs` actor re-reads `sync_state` when
   it changes (now broadcast across tabs) and updates `lastDataPull` /
   `lastDataPush`, so labels and the next pull's boundary stay current.
4. **Checkpoint race** (Q4): `patchSyncState`'s read-merge-write runs
   under `eregisters-sync-state` (waits, doesn't skip).
5. **Metadata** (Q5): a finished metadata sync publishes
   `{kind:"metadata"}`; a tab in `waiting` goes back through
   `queryingIndexDB` (no server call).

**Bug found in the browser, fixed**: lock events reached every parallel
region, so a tab granted the push lock also started its pull without the
pull lock, then the pull's "busy" event aborted both. `SYNC_LOCK_ACQUIRED`
/ `SYNC_LOCK_BUSY` now carry their kind and each group guards on it;
regression test "a free lock for one kind doesn't let another kind run
past its own busy lock" (failed before the fix).

Tests: lock helpers against a fake LockManager (grant, busy, silent after
release, no Web Locks, `withLock` ordering); machine — skipped pull and
push, the crossover, another tab's checkpoints picked up, metadata reload
on another tab's sync. Full suite 63 files / 477.

Real browser (dev server, two Chrome tabs, read-only — nothing pending
to push): `online` fired in both within 1 ms → tab A took both locks and
made the only tracker request; tab B made none, showed one message per
kind, and its checkpoint moved to A's new one. Metadata: A ran the full
flow; B's attempt was refused with the message, and B reloaded metadata
from the store when A finished.
