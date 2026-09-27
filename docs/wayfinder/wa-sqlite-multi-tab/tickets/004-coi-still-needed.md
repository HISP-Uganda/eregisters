---
title: Does wa-sqlite's OPFSCoopSyncVFS still need cross-origin isolation?
type: wayfinder:research
status: closed
assignee: research-subagent
blocked_by: []
---

## Question

The COOP/COEP service-worker header injection (`scripts/patch-sw.js`
patches 6 and 7, plus the dev-server headers in `viteConfigExtensions.mts`)
exists because op-sqlite's OPFS backend needed `crossOriginIsolated`
(SharedArrayBuffer). The app now uses `@journeyapps/wa-sqlite@2.0.4`'s
`OPFSCoopSyncVFS` inside a dedicated Worker (`src/db/sqlite/wa-sqlite-*`).

1. From wa-sqlite's source/docs (the installed version): does
   `OPFSCoopSyncVFS` (or anything the app's worker / adapter uses —
   the WASM build, `createSyncAccessHandle`, Atomics) require
   `SharedArrayBuffer` or `crossOriginIsolated`? Which browsers' OPFS
   sync access handles work without isolation?
2. Does anything else in the app depend on isolation (grep for
   `SharedArrayBuffer`, `Atomics`, `crossOriginIsolated`,
   `performance.measureUserAgentSpecificMemory`)?
3. What would retiring isolation remove/risk: patch 6/7's COI headers
   (and whether patch 7's navigation/timeout/cache-fallback role must
   stay), the dead patches 2/5/6, the dev-server COOP/COEP headers, the
   `crossOrigin="anonymous"` workaround from ticket 018.

Record findings in
`docs/wayfinder/wa-sqlite-multi-tab/research/004-findings.md`. The
answer will be confirmed empirically by the retire ticket (open wa-sqlite
in a non-isolated page), not assumed from source alone.

## Resolution

Findings: `research/004-findings.md` on branch `research/coi-still-needed`
(commit `4225186`, unpushed; worktree
`.claude/worktrees/agent-a528e09239ad9eed8`). Source-level; the empirical
confirmation is the retire ticket's job.

1. **wa-sqlite 2.0.4 doesn't need isolation.** The app uses the
   synchronous build + `OPFSCoopSyncVFS` in a dedicated Worker. The
   package's own examples README lists "No COOP/COEP requirements" ✅ for
   every VFS; no `SharedArrayBuffer`/`Atomics`/`crossOriginIsolated` in its
   `src/` or `dist/`; all three `.wasm` builds declare **non-shared**
   memory. The VFS stays synchronous by returning an error for async
   steps (Web Locks, opening access handles) and retrying after awaiting
   — no `Atomics.wait`. Sync access handles need only a secure context +
   dedicated worker (Chrome 102, Chrome Android 109, Firefox 111, Safari
   15.2). mohw-nas's prototype passed 14/14 with `crossOriginIsolated ===
   false`.
2. **Nothing else in the app depends on isolation** — only the
   header-injecting patches, the `crossOrigin="anonymous"` logo
   workaround, and stale comments in `backend.ts`. Dev-server COOP/COEP
   headers were already removed (dev has been running un-isolated).
3. **What goes / stays**: patches 1, 3, 4 stay; 2, 5, 6 go (dead or
   header-only); **patch 7's navigation handling stays** (the only
   version-robust network-first/timeout/precache-fallback navigation
   handler) minus its header injection; patch 7's **worker-script branch**
   goes (it existed only to add COEP for op-sqlite's worker); the logo
   workaround goes after isolation is gone. **Two-release rollout**
   (tabs loaded while isolated stay isolated until reload): N — stop
   COOP/COEP on navigations, keep COEP on worker scripts and the logo
   workaround, delete 2/5/6; N+1 — drop the worker-script branch and the
   workaround.

**New hazard found (static, unverified)**: patch 7's worker-script
branch fetches network-only (no cache fallback) and pre-empts Workbox's
precache — an **offline cold start** may fail to load the wa-sqlite
worker, fall back to Dexie and cache the OPFS failure permanently.
Ticketed separately: "Does an offline cold start fail to load the
wa-sqlite worker?".
