---
title: Retire the COOP/COEP header injection if wa-sqlite doesn't need it
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [004-coi-still-needed]
---

## Question

If "Does wa-sqlite's OPFSCoopSyncVFS still need cross-origin isolation?"
finds it doesn't: first prove it empirically (production build on a
no-COOP/COEP stand-in with the COI header injection disabled → SQLite
still opens, reads/writes work, two tabs work, Chrome + Safari), then
decide the retirement: which `patch-sw.js` patches go (COI header
injection in patch 7 vs. its navigation network/timeout/cache role;
dead patches 2/5/6 — absorbing the "remove dead patches" item from the
Dexie to OPFS SQLite Migration map), the dev-server headers, the
`crossOrigin="anonymous"` asset workaround, and the rollout order for
devices whose installed service worker still injects the headers
(isolation disappearing mid-session must not break an open app).

> From the research ("Does wa-sqlite's OPFSCoopSyncVFS still need
> cross-origin isolation?"): isolation is not needed; keep patch 7's
> navigation handling, drop its COOP/COEP injection and worker-script
> branch, delete patches 2/5/6, then the logo workaround — in **two
> releases** (N: stop navigation headers, keep worker COEP + workaround;
> N+1: drop the rest). Empirical checks to run: `crossOriginIsolated`
> false yet DB opens/reads/writes, two tabs, update from an isolating to
> a non-isolating build with a tab open, offline cold boot — Chrome,
> Firefox, Safari.


## Resolution

Grilled 2026-09-27; the user took every recommendation.

1. **Empirical proof first** (Q1). Production build with no header
   injection (`pnpm build` → stand-in serving no COOP/COEP headers,
   Chrome):
   - **Update from the isolating build with a tab open**: tab open on the
     old build (`crossOriginIsolated: true`), stand-in swapped to the new
     build, `reg.update()` → new SW installed and waiting → accepted
     (`SKIP_WAITING`) → `controllerchange` → the page reloaded itself, no
     white screen, now `crossOriginIsolated: false`.
   - **SQLite without isolation**: a raw probe of the built
     `wa-sqlite-worker` on a throwaway `coi-probe.db` created a table,
     inserted and read back (`{c:1,m:42}`); probe files removed after.
   - **Full app boot** (signed in, real data): home screen renders, on
     SQLite (`eregisters-wa-v1-eregisters-metadata.sqlite3` written this
     boot, its OPFS access-handle lock held), no `opfsInitFailed`.
   - **Two tabs** open at once: both boot on SQLite, no errors.
   - **Offline cold start** (stand-in stopped, every app tab closed,
     fresh tab): app opens "Offline" via the new SW, SQLite lock held,
     no `opfsInitFailed`.
   - **Safari not re-run** on this build: per "Browser support gate —
     what happens on Safari/WebKit", Safari can't run OPFSCoopSyncVFS and
     falls back to Dexie, which never needed isolation; no Safari users.
     Firefox not run.
2. **One release, not two** (Q2) — the research's two-release plan
   guarded against isolation vanishing mid-session; the
   isolating→non-isolating update test above shows an open app just
   reloads onto the new SW and keeps working, so one release suffices.
3. **Patch 7** (Q3) keeps its network-first navigation handling (8s
   timeout, precache fallback incl. directory URLs → `index.html`) with
   no header rewriting; its worker-script branch is deleted — worker
   scripts are left to Workbox's precache (hashed, cache-first).
4. **Cleanup** (Q4): dead patches 2/5/6 deleted (absorbing the "remove
   dead patches" item from the Dexie to OPFS SQLite Migration map);
   `crossOrigin="anonymous"` on the header logo (`__root.tsx`) removed;
   stale COOP/COEP comments in `backend.ts` / `viteConfigExtensions.mts`
   updated; `patch-sw.js` header lists patches 1/3/4/7 + a "Retired"
   note; CLAUDE.md's sentinel list now `__patch_claim_clients__`,
   `__patch_app_shell_timeout__`, `__patch_independent_nav__`, with a
   "don't reintroduce COOP/COEP" note.

Build: patches 1/3/4/7 applied, no `__patch_coi_headers__` and no
`Cross-Origin-Embedder-Policy` in the built SW. Full suite 61 files /
460 tests.
