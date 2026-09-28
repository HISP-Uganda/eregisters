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

## Not yet specified

- The popup's exact wording and look, and the grace-period length —
  settle once the mechanics are decided (possibly a prototype ticket).
- Showing the running app version somewhere (e.g. the profile menu), so
  support can tell which build a device is on.

## Out of scope

- Devices that stay offline: they can't learn of a deploy until they
  reconnect; nothing to force meanwhile.
