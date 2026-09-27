---
title: Does an offline cold start fail to load the wa-sqlite worker?
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Research for "Does wa-sqlite's OPFSCoopSyncVFS still need cross-origin
isolation?" found, from the code only, that `scripts/patch-sw.js` patch
7's worker-script branch (`destination === "worker"`) fetches from the
network with **no cache fallback** and takes the request away from
Workbox's precache. If so, opening the app **offline after a browser
restart** — routine for outreach health workers — would fail to start
the wa-sqlite Worker. On `auto`, `resolveBackend` then falls back to
Dexie and caches `eregisters.opfsInitFailed` **permanently**, so a
device whose data is in SQLite could come up on an empty Dexie store
offline and never return to SQLite.

Reproduce with the production build (no-COOP/COEP stand-in, then take
it offline / stop it; Chrome and Safari): a device that has run on
SQLite, cold start offline → which backend, what data is visible, what
is cached. If confirmed: ship the interim fix (a `caches.match` fallback
in that branch, or let Workbox's precache serve worker scripts) ahead of
the COI retirement, with a test, and decide whether the permanent
failure cache must stop treating a network-caused worker failure as
"no OPFS". Record what happened on real devices, if known.

## Resolution (2026-09-27)

Reproduced in Chrome with the production build on the no-COOP/COEP
stand-in (`/api` → d2 dev proxy), a device on SQLite holding a real
pulled record; "offline" = stand-in stopped after closing the app tab.

**Confirmed — two bugs, both in `scripts/patch-sw.js` patch 7:**
1. **Worker script network-only.** Offline cold start (via
   `/index.html`): the app opened with the Offline badge but **Total
   Clients 0** — `new Worker(wa-sqlite-worker-*.js)` failed because patch
   7 fetched it network-only and pre-empted Workbox, though the same
   script fetched from the page came back **200 from the precache**.
   `auto` fell back to an **empty Dexie store** and cached
   `eregisters.opfsInitFailed`.
2. **Directory navigations never matched the precache (new).** The PWA's
   `start_url` is `"."`, a directory URL; patch 7's fallback matched only
   the exact URL (precache stores `index.html`), so an **installed app
   launched offline didn't open at all** (`ERR_FAILED`).

**Recovery without the fix** (corrects the ticket's "never returns"):
no data lost. Online boot 1 still started on Dexie, but its reverse-copy
probe opened SQLite, cleared the failure cache and copied the record
into Dexie (visible again); online boot 2 returned to SQLite via the
forward copy, record and checkpoint intact. Offline, though, the user
saw an empty register the whole time.

**Fix** (`scripts/patch-sw.js`, patch 7, same sentinel): new
`__patch7Cached(request)` — precache match with `ignoreSearch`, falling
back to `index.html` for directory navigations (as Workbox's own
navigation route does). The worker branch is now network-first →
precache fallback (COEP still added until the COI retirement); both
navigation fallbacks use the helper. Build: 6 sentinels, patch 7 applied.

**Verified offline after the fix:** launching at `/` opens (was
`ERR_FAILED`), isolated, SQLite starts from the precached worker —
Total Clients 1, no cached failure, no Dexie fallback.

**New finding, ticketed separately** ("Why does the first SQLite open
sometimes fail on a reload, and should it trigger a full store copy?"):
a same-tab navigation (offline, `/index.html`) had its first SQLite open
fail transiently → Dexie fallback → reverse copy (SQLite emptied, record
safe in Dexie); a fresh tab didn't. Not caused by this ticket's bug.
