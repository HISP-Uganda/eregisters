---
title: What does the DHIS2 app platform do on an app update, and can its own prompt be turned off?
type: wayfinder:research
status: open
assignee:
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
