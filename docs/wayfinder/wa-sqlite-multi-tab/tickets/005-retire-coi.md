---
title: Retire the COOP/COEP header injection if wa-sqlite doesn't need it
type: wayfinder:grilling
status: open
assignee:
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

