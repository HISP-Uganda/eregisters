---
title: What does the DHIS2 app platform do on an app update, and can its own prompt be turned off?
type: wayfinder:research
status: closed
assignee: claude-research-agent
blocked_by: []
---

## Question

From the installed `@dhis2/app-adapter` / `@dhis2/app-runtime` /
`@dhis2/pwa` source (node_modules, the versions in pnpm-lock.yaml) and
the platform docs: how does the platform detect and surface a new app
version (`usePWAUpdateState`, `ConnectedHeaderBar`, the offline
interface's `controllerchange` handling, `PWALoadingBoundary`), what does
it do when a worker is waiting vs. activated, and is there a supported
way (d2.config.js option, prop, env) to disable its update prompt so the
app's own is the only one? Also: what exactly triggers the page reload
after `SKIP_WAITING` today (the platform or `patch-sw.js`'s
`clients.claim`), and whether every open tab reloads.

## Resolution

Researched 2026-09-28 by a research agent from the installed
`@dhis2/app-adapter` 12.11.4 / `@dhis2/pwa` / `@dhis2/app-runtime`
sources and the built service worker (no app run, no server contacted).
Findings with file/line evidence:
[research/001-findings.md](../research/001-findings.md) on branch
`research/platform-update-flow` (`d5fff42`).

- **Detection:** each tab's `OfflineInterface` (via `usePWAUpdateState`)
  checks once on mount — catching a worker already waiting and later
  `updatefound`/`statechange`. The platform **never calls
  `registration.update()`**, so a long-open tab never re-checks.
- **Prompt:** the only UI is a "New {appName} version available — Click
  to reload" item in the header's **profile menu**; one tab → applies at
  once, several → `ConfirmUpdateModal`. `PWALoadingBoundary` auto-applies
  a waiting worker at startup when exactly one tab is open.
- **Applying:** the worker skips waiting **only** on
  `{type: "SKIP_WAITING"}`; `controllerchange` → the platform's
  `OfflineInterface` calls `window.location.reload()` **in every tab**,
  unconditionally. Today `App.tsx` posts `SKIP_WAITING` as soon as a
  worker installs, so every open tab reloads at once, with no prompt and
  no check for unsaved input or a running sync.
- **Turning the platform prompt off:** no supported switch (the `pwa`
  config has only `enabled`/`caching`). Least invasive: hide the menu
  item with CSS (`[data-test="dhis2-ui-headerbar-updatenotification"]`);
  that leaves the startup auto-apply and the reload-on-`controllerchange`
  (replaceable only by reassigning
  `navigator.serviceWorker.oncontrollerchange`, last assignment wins, or
  by patching the adapter).
- **Hooks for the app:** none public — call `registration.update()`,
  read `registration.waiting`, post `SKIP_WAITING` directly. `@dhis2/pwa`'s
  `checkForUpdates` isn't a declared dependency and would overwrite the
  platform's `onupdatefound` handler.

Unconfirmed: no browser run; whether `controllerchange` fires without
`clients.claim()` in the target browsers (spec says yes for already-
controlled tabs); whether a worker installed while only the login modal
showed can stay stuck waiting (`App.tsx` ignores an existing
`registration.waiting`).
