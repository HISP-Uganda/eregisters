---
title: How do open tabs share one forced update?
type: wayfinder:grilling
status: open
assignee:
blocked_by: [001-platform-update-prompt]
---

## Question

Activating a new service worker affects every tab of the app at once
(`controllerchange`). Decide: does every tab show the popup and its own
countdown; which tab's reload activates the waiting worker (and so
reloads the others, possibly mid-form); how a tab with unsaved input
holds the update back without blocking it forever; and whether
`src/db/cross-tab.ts` carries the coordination.
