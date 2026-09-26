---
title: How does the progress UI read the machine, and is the __root.tsx banner still needed?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-state-chart]
---

## Question

With `migration-progress.ts` retired, how does
`MigrationProgressBanner` get its data from the storage-boot machine
snapshot (selector over which states/context), and what does it show
per state (checking, copying table X n/m, verifying, cleanup, failed)?

`__root.tsx:944` also mounts the banner, but the copy now completes
before any route renders. Is that mount dead (remove it), or does some
path (admin backend switch, cleanup retry) still need in-app progress?
Also decide what the `failed` state shows and how it interacts with the
R11 escape hatch (see "Escape hatch after repeated migration
failures").

## Resolution

Grilled 2026-09-26.

1. **Single read path**: `bootView(snapshot)` in
   `src/machines/storage-boot.ts` maps machine states to a `BootView`
   union — `preparing` | `copying {step, steps, copied, total}` |
   `finishing` | `failed {error}` | `unavailable {error}` |
   `ready {fellBack}`. Components use
   `useSelector(getStorageBootActor(), bootView)` (wired in the cutover).
2. **Boot screen per state** (`StorageBootScreen`,
   `src/components/storage-boot-screen.tsx`):
   - preparing (resolving / preparing reverse / lock / detect — incl. a
     tab waiting on another tab's copy): spinner + "Preparing local
     storage…";
   - copyingTracker: "Upgrading local storage… step n of m (copied/total)";
   - config / metadata / verify / markComplete / cleanup / rollback:
     "…finishing up";
   - failed: error alert + **Retry** (sends `RETRY`); R11's escape
     hatch adds to this screen later;
   - unavailable: the existing red "Could not open local storage…" text.
3. **No table names on screen** (Q4 (c)): step counter only.
   `StoreCopySteps` gained `tables` (copy order) so the counter is exact
   per direction (3 forward, 4 reverse).
4. **`__root.tsx` mount repurposed**: its copying/verifying messages
   were unreachable (routes render only after `ready`). Replaced by
   `StorageFallbackNotice` — a dismissible warning shown only when
   `ready` was reached via fallback (new context flag `fellBack`).
5. **`migration-progress.ts` retirement** and the `App.tsx` /
   `__root.tsx` wiring are left to the cutover ticket; this ticket built
   the pieces alongside the old ones.

Tests: `bootView` across preparing → copying → finishing → ready,
fellBack, failed, unavailable (`src/machines/__tests__/storage-boot.test.ts`);
`bootMessage` (`src/components/__tests__/storage-boot-screen.test.ts`).
Full suite 59 files / 399 tests pass. Uncommitted on
`feature/storage-migration-machine`.
