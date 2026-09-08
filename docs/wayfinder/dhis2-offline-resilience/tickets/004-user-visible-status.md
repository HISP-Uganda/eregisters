---
title: What Should the User See for Degraded-Server vs. Offline vs. Healthy?
type: wayfinder:grilling
status: open
assignee: null
blocked_by: ["003-app-level-reachability-timeout.md"]
---

## Question

Per the map's destination and the user's own answer during charting
("timeout + clear status + let existing retry/sync-loop keep trying" —
not a new retry/backoff engine): once
[How Should sync.ts's Reachability Check Handle Timeouts and
Failure-Type Distinctions?](003-app-level-reachability-timeout.md)
gives the app a real, typed failure signal (network-down vs. degraded/5xx
vs. healthy) instead of today's single boolean, what should the user
actually see change?

Today's only offline-adjacent UI is a static `navigator.onLine` badge
(`src/routes/tracked-entity.tsx:463`) and manual "retry" button labels in
`sync-failures-modal.tsx`/`HmisForm.tsx` — none of it distinguishes
"server is slow/degraded" from "truly offline" from "healthy."

Needs deciding:

- Does a "server is slow/degraded" state get its own distinct UI signal
  at all, or does it just quietly extend the sync loop's next-retry
  timer without new user-facing messaging (the user's "minimal" option
  during charting was declined in favor of "clear status," but the exact
  shape of that status wasn't specified)?
- Where does this status live/render — extend the existing
  `navigator.onLine` badge (`tracked-entity.tsx:463`) to a 3-state
  indicator, surface it in the header toolbar alongside the existing
  `SyncButton`/`Badge` patterns (`__root.tsx`), or somewhere else?
- Does the SW-broadcast connection status (once ticket 002 decides
  whether/how to fix `dhis2ConnectionStatusPlugin`) feed into this same
  UI, or stay purely internal to the SW/app-message-passing layer?
- Should this reuse `src/components/sync-status-comp.tsx`'s existing
  icon/color conventions (green=synced, amber=pending, red=failed) by
  adding a 4th state, or does "degraded server" deserve genuinely
  different visual treatment since it's not a per-record status?

Invoke `/grilling` and `/domain-modeling`. May also warrant `/prototype`
if "how should it look" turns out to be the harder question once the
signal shape from ticket 003 is known.
