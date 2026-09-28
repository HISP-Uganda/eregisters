---
label: wayfinder:map
tracker: local-markdown
---

# Force devices onto the latest app version

## Destination

No device keeps running an old build for long. An open app notices a new
deployed build (or an admin's "reload" broadcast) within minutes, shows a
popup that can't be dismissed with a short grace period to save work, then
reloads onto the new version — without losing unsaved form input or
cutting a sync off mid-way. Done = built and verified against a stand-in
server swapping builds (the COOP/COEP-retirement technique), multi-tab
included.

## Notes

- Settled while charting (2026-09-28, the user took every recommendation):
  **(Q1)** "new changes" = a new deployed build (service worker) **and** the
  admin broadcast (`uiConfig.reloadSignal.app`); **(Q2)** a blocking popup
  with a grace period (~10 min), then an automatic reload; **(Q3)** check
  for a new version every 15 minutes, on focus and when back online;
  **(Q4)** ours is the only update prompt — the platform's is turned off if
  it can be.
- Today: `App.tsx` calls `registration.update()` once at startup and sends
  `SKIP_WAITING` to any installed worker at once, so `controllerchange`
  reloads every tab immediately; the admin broadcast is a dismissible
  banner, only seen after `uiConfig` is re-pulled (metadata sync / boot).
  `@dhis2/app-adapter` has its own prompt (`usePWAUpdateState`,
  `ConnectedHeaderBar`).
- `scripts/patch-sw.js` is load-bearing (CLAUDE.md): patch 1
  (`clients.claim`) and patch 7 (network-first navigation) are what make an
  update reach users; don't break them.
- Carries execution, like the sibling maps: tickets are decided with the
  user, then built, tested and verified in a real browser.
- Invoke `/grilling` and `/domain-modeling` for grilling tickets.

## Decisions so far

- [What does a reload do to a push or pull in progress, and must a forced reload wait for sync?](tickets/002-sync-vs-reload.md) — a push or pull cut off by a reload recovers on its own (records stay pending; pages are atomic; the checkpoint moves only after success), but a Full Metadata Sync can leave no metadata. The forced reload waits for a running sync (cap: grace period + 5 min), and no new sync starts once the countdown ends.
- [How does the app know a form has unsaved changes?](tickets/003-unsaved-changes.md) — one app-wide editing registry (open popups, pending HMIS draft saves, form saves in flight, dirty admin pages); nothing registered → reload after a short notice; something registered → wait the grace period, extended once by 5 min for an open popup, then reload. Pending saves are flushed first.
- [What does the DHIS2 app platform do on an app update, and can its own prompt be turned off?](tickets/001-platform-update-prompt.md) — the platform checks once per page load, shows only a profile-menu prompt, and reloads every tab on `controllerchange`; `App.tsx`'s immediate `SKIP_WAITING` is what reloads all tabs today. No supported switch to disable the platform prompt — hide it with CSS; the reload-on-`controllerchange` can only be taken over by reassigning `oncontrollerchange`.
- [How do open tabs share one forced update?](tickets/004-tab-coordination.md) — one shared deadline across tabs; unsaved work (a shared Web Lock) or a running sync (the sync locks) in any tab holds the update back until the deadline + extension; then any tab posts `SKIP_WAITING` and the platform reloads every tab. `App.tsx`'s immediate `SKIP_WAITING` goes; an already-waiting worker is picked up on load; the platform's menu prompt is hidden with CSS.
- [How does an open app learn of the admin's reload broadcast promptly?](tickets/005-broadcast-freshness.md) — re-read `ui-config` on the version-check tick; "already acted on" = recorded as seen (the signal current at page load counts as seen) instead of comparing two devices' clocks, which would loop a forced reload; a broadcast gets the same popup and countdown, ending in a plain reload per tab. The metadata broadcast stays a dismissible banner.
- [Should a Full Metadata Sync replace metadata in one step instead of deleting it first?](tickets/007-atomic-full-metadata-sync.md) — yes: a new `MetadataStore.transaction` runs the full sync's delete + save as one step on both backends; a failure rolls back and keeps the old metadata (no more wiping the store via `resetIndexDB`).
- [Build the forced update and verify it against a stand-in server](tickets/006-build-and-verify.md) — built: all-or-nothing Full Metadata Sync, the unsaved-work registry (+ shared lock), the update controller (deploy + broadcast, shared deadline, holds, sync block) and its notice. Verified with real builds on a stand-in: a waiting worker applied after the notice; two tabs held by an open popup, then both reloaded when it closed. Broadcast path unit-tested (not against the real server).
- [Where should the app show which version it is running?](tickets/008-show-app-version.md) — `v1.1.7` next to the app title, with a tooltip naming the storage backend and the local store; the update banner doesn't name the new version.

## Not yet specified

- The notice's wording and look were set while building (a banner that
  can't be dismissed during the grace period, a blocking popup when the
  reload is due; 30 s / 10 min / +5 min) — revisit once field users have
  seen it.

## Out of scope

- Resuming or discarding registration drafts abandoned by a reload,
  crash or closed tab (they stay in the database, hidden from lists) —
  a gap regardless of forced updates; its own effort ("How does the app
  know a form has unsaved changes?").
- Devices that stay offline: they can't learn of a deploy until they
  reconnect; nothing to force meanwhile.
