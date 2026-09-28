---
title: Build the forced update and verify it against a stand-in server
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [001-platform-update-prompt, 002-sync-vs-reload, 003-unsaved-changes, 004-tab-coordination, 005-broadcast-freshness, 007-atomic-full-metadata-sync]
---

## Question

Implement the decisions above (periodic and focus/online update checks,
the blocking popup with grace period, sync-safe and dirty-form-safe
reload, tab coordination, the broadcast path), with tests, then verify on
a stand-in server by swapping builds with tabs open: an idle tab, a tab
mid-form, a tab mid-pull, two tabs, and the admin broadcast.

## Resolution

Built 2026-09-28 (commits `2f33f61`, `5d4989f`, `a1c7f17`, and the
admin-broadcast fix and tests in the commit closing this ticket).

- **All-or-nothing Full Metadata Sync**: `MetadataStore.transaction`;
  one `replacingMetadata` step; a failure keeps the old metadata and ends
  in `failure`.
- **Unsaved work** (`src/app-update/unsaved-work.ts`): open `DataModal`
  popups, HMIS forms with a pending draft save (flushable), form-machine
  saves in flight, the dirty stage-relations page; a tab with any holds
  the shared Web Lock `eregisters-unsaved`.
- **Update controller** (`update-controller.ts`, rules in
  `update-policy.ts`): deploy + broadcast detection (load, 15 min, focus,
  online); shared deadline; 30 s notice → 10 min grace → +5 min for
  unsaved work / sync; flush, then `SKIP_WAITING` (deploy) or reload
  (broadcast); no new syncs past the grace period. `App.tsx`'s immediate
  `SKIP_WAITING` removed; the old dismissible app-reload banner removed.
- **Notice** (`update-notice.tsx`): during the grace period a banner that
  can't be dismissed (the app stays usable so forms can be saved — a
  blocking popup from the start would have made "save your work"
  impossible); a blocking popup once the reload is due; hides the
  platform's profile-menu prompt.
- **Found while verifying**: the admin sending a broadcast would have
  force-reloaded their own app — the sender now marks it as seen.

**Verified** (production builds on the stand-in server, no COOP/COEP,
API through the dev proxy — read-only):
1. A worker already waiting at load → banner "A new version of the app
   is available. The app reloads in 0:13." → applied after the 30 s
   notice → reloaded under the new worker; nothing waiting, deadline key
   cleared; the platform prompt's hiding style present.
2. Deploy with two tabs, one with the "Register New Client" popup open:
   both banners on one shared deadline (tab 1 "…reloads in 9:53", tab 2
   "…Save or close an open "Register New Client" form — …9:41"); 40 s in
   (past the notice) nothing had reloaded; closing the popup applied it
   and **both tabs reloaded** within ~2 s onto the new worker.
   (The two builds' app bundles happened to be identical — the marker
   was tree-shaken — but their service workers differed, which is what
   the update path acts on.)
3. The admin-broadcast path — unit tests (not run against the real
   server: broadcasting there would force-reload every real device): the
   signal current at load counts as seen; a new one reloads after the
   notice and is recorded as seen first; unsaved work holds it.

Not exercised in the browser: the 10-minute grace expiring and the
+5-minute extension, a sync holding the reload (covered by
`update-policy` tests), and Firefox/Safari.
