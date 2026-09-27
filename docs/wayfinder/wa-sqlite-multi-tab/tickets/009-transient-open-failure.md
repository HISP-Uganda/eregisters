---
title: Why does the first SQLite open sometimes fail on a reload, and should it trigger a full store copy?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Seen twice on the production build: on a same-tab navigation/reload
(and once on a fresh install), the storage boot's first
`createWaSqliteDriver` failed, but the reverse-copy probe seconds later
opened SQLite fine. On `auto` that one transient failure caused a Dexie
fallback **plus a full SQLite → Dexie store copy** (SQLite emptied), and
the next boot a full copy back — heavy churn on an ordinary reload, and
an empty screen if it happens offline before the copy. A fresh tab
(previous page's Worker gone) didn't fail. Hypothesis: the previous
page's wa-sqlite Worker still holds OPFS access handles when the new
page opens the file.

1. Reproduce and pin the cause (capture the real open error — `auto`
   swallows it; time the old Worker's teardown).
2. Decide the fix: retry the open with a short backoff before falling
   back? close the driver on `pagehide`/`beforeunload`? treat a failure
   right after a navigation as transient (no permanent
   `opfsInitFailed`)? and should a reverse copy ever run on a device
   whose SQLite merely failed to open once (vs. an admin switching to
   Dexie)?

## Resolution

Grilled 2026-09-27, after capturing the real error with a temporary log
(persisted to localStorage across reloads; removed afterwards).

**Root cause — a wa-sqlite race, not ours.** Production build, offline
same-tab navigation: 1 in 3 first opens failed in ~150 ms with
`Failed to execute 'removeEntry' on 'FileSystemDirectoryHandle' …
NoModificationAllowedError`. `OPFSCoopSyncVFS.#initialize` deletes stale
`.ahp-*` temp directories whose Web Lock is free; on a same-tab
navigation the old page's lock is released at teardown while its
Worker's access handles in that directory live a moment longer, so the
delete throws and — uncaught — fails the whole VFS start. Explains every
sighting (same-tab only, intermittent, works seconds later). Not
reproduced in dev (4/4) or online prod reloads (4/4).

1. **Fix** (Q1 (c)):
   - `pnpm patch` of `@journeyapps/wa-sqlite@2.0.4`
     (`patches/@journeyapps__wa-sqlite@2.0.4.patch`): the stale-dir
     `removeEntry` is best-effort (try/catch, logged, cleaned next start).
   - `createWaSqliteDriver` retries the open on a fresh Worker (delays
     `[300, 1000]` ms, `OPEN_RETRY_DELAYS_MS`), terminating failed
     Workers, rethrowing the last error.
2. **Failure cache** (Q2): `eregisters.opfsInitFailed` now counts
   consecutive failed boots (`failures`); `getCachedOpfsFailure` is true
   only at `OPFS_FAILURES_TO_CACHE = 2`. Pre-counting entries count as 1,
   so devices already pinned to Dexie by one transient failure retry.
3. **Reverse copy on `auto`** (Q3 (a)): unchanged — with 1–2 the trigger
   should be rare; `storage.boot` shows it if not.

**Verified**: production build with the patch + retry, 6 offline
same-tab navigations (alternating `/` and `/index.html`): **6/6 opened
SQLite**, no fallback, no store copy, record visible; one boot took
3.4 s (retry absorbing a slower race — recovered, didn't fall back).
Tests: retry (fresh Worker after failure, failed one terminated; gives
up after all attempts), failure counting (single/legacy failure
re-attempts, second failure sticks). Full suite 61 files / 460 tests;
build + 6 SW sentinels.

**Upstream issue draft** (for the maintainer to file at
rhashimoto/wa-sqlite; the journeyapps fork carries the same code):

> **OPFSCoopSyncVFS: stale temp-dir cleanup fails VFS creation after a
> same-tab navigation.** `#initialize` deletes `.ahp-*` directories whose
> lock is available. On a same-tab navigation the previous document's
> Web Lock is released at teardown, but its dedicated Worker's
> `FileSystemSyncAccessHandle`s inside that directory can outlive it
> briefly, so `root.removeEntry(name, { recursive: true })` throws
> `NoModificationAllowedError` and `OPFSCoopSyncVFS.create()` rejects.
> Cleanup is best-effort; wrapping the `removeEntry` in try/catch (and
> leaving the directory for a later start) fixes it. Reproduced in
> Chrome (roughly 1 in 3 same-tab navigations under load).
