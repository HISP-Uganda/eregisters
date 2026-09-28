---
title: How do open tabs share one forced update?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [001-platform-update-prompt]
---

## Question

Activating a new service worker affects every tab of the app at once
(`controllerchange`). Decide: does every tab show the popup and its own
countdown; which tab's reload activates the waiting worker (and so
reloads the others, possibly mid-form); how a tab with unsaved input
holds the update back without blocking it forever; and whether
`src/db/cross-tab.ts` carries the coordination.

## Resolution

Grilled 2026-09-28; the user took every recommendation. Facts from "What
does the DHIS2 app platform do on an app update, and can its own prompt be
turned off?": one waiting worker serves every tab; `SKIP_WAITING` from any
tab activates it and the platform's `controllerchange` handler reloads
**every** tab; each tab detects the waiting worker on its own.

1. **One shared deadline** (Q1 (a)): the first tab to notice the update
   records when (localStorage + a `src/db/cross-tab.ts` message); every
   tab counts down to the same moment.
2. **Unsaved work anywhere holds the update back** (Q2): a tab whose
   editing registry is non-empty holds a **shared** Web Lock
   `eregisters-unsaved`; the update applies only when an **exclusive**
   request with `ifAvailable` succeeds (no tab holds it), or after the
   deadline + the one 5-minute extension. Locks die with a closed or
   crashed tab, so it can't block forever.
3. **A sync running anywhere holds it back** (Q3): check
   `navigator.locks.query()` for the held sync locks
   (`eregisters-sync-push`/`-pull`/`-metadata`); the "no new syncs once
   the countdown ends" rule applies in every tab.
4. **Applying** (Q4): any tab whose countdown ends with both clear posts
   `SKIP_WAITING` (a duplicate is harmless); the platform's reload on
   `controllerchange` reloads every tab — kept, not taken over.
   `App.tsx`'s immediate `SKIP_WAITING` goes; a tab picks up an
   **already-waiting** worker on load (the case the research flagged).
5. **The platform's profile-menu prompt is hidden with CSS**
   (`[data-test="dhis2-ui-headerbar-updatenotification"]`) (Q5); its
   one-tab startup auto-apply is kept (a fresh load has nothing unsaved).
