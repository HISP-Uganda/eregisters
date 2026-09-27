---
title: How should config changes made in one tab reach other open tabs?
type: wayfinder:grilling
status: closed
assignee: claude-session
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

## Resolution

Grilled 2026-09-27; the user took every recommendation.

Facts that widened the question: the SQLite tracker collections had the
same gap as the config rows (`sqlite/collection-adapter.ts` reloaded only
after its *own* writes, on an "exactly one writer" assumption), and it
was a correctness bug, not just staleness — `bulkInsertLocally` picked
insert vs update from the tab's in-memory snapshot, so a pull page
containing a row another tab had already stored failed on a duplicate
key (whole page rolled back), and a row another tab deleted was
"updated" into nothing. Dexie collections were already cross-tab
(`tanstack-dexie-db-collection` uses Dexie's `liveQuery`).

1. **Scope** (Q1 (b)): config rows + SQLite tracker collections + the
   insert/update bug. Refreshing the sync machine's in-memory metadata
   after another tab's metadata sync moved to "Do two open tabs' sync
   machines conflict, and does sync need a cross-tab lock?" — whether
   one tab owns sync decides how the others learn of new metadata.
2. **Mechanism** (Q2): `src/db/cross-tab.ts` — one `BroadcastChannel`
   (`eregisters-changes`) per tab. Messages only name what changed
   (`{kind:"config", table, id}`, `{kind:"collection", id, keys?}` — no
   keys = re-read everything, the `refresh()` path); the receiver reads
   the database itself.
3. **Missed messages** (Q3): a full re-read on Chrome's `resume` event
   (a thawed frozen tab), not on every `visibilitychange`.
4. **Insert/update bug** (Q4): the existence check reads the database
   inside the write transaction (`loadByKeys`, `loadAll` fallback)
   instead of the snapshot. Tests written first and failing; confirmed
   they still fail with the fix reverted (the broadcast alone doesn't
   mask it).
5. **Placement** (Q5): config publishing in `reactive-config.ts`
   (backend-neutral), limited to `ui_config`/`stage_hierarchy` — both
   metadata stores' `putRows` notify per row, so a metadata sync would
   otherwise flood other tabs. Collection publishing in the SQLite
   adapter only (a `crossTab` option, defaulting to the app's bus).

Tests: 2 duplicate-key/lost-row regressions, cross-tab propagation
(write, delete, `refresh()`), resume re-read, config listener fired by
another tab, only config tables broadcast. Full suite 62 files / 467.

Real browser (dev server, two Chrome tabs, SQLite): a local-only
`syncError` tweak to a synced client in tab A appeared in tab B's
collection, then the row was restored exactly (status stayed `synced`,
Push Data 0); one message per write. A metadata sync in tab A sent tab B
only `ui_config` ×2 and `stage_hierarchy` ×1 — nothing for the metadata
rows. Dexie: a `liveQuery` in tab B saw tab A's write to a throwaway
database (deleted after). Not exercised in the browser: a real
duplicate-key pull (needs new server data between two tabs' pulls) —
covered by the unit tests.
