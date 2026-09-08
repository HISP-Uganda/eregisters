---
title: What Should the User See for Degraded-Server vs. Offline vs. Healthy?
type: wayfinder:grilling
status: closed
assignee: claude-session-01PcWUcXQiieqFWmoKvZKBtH
blocked_by: []
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

## Resolution

Grounded in the actual current UI before deciding: `tracked-entity.tsx:463`'s
only offline signal today is a static
`{!navigator.onLine && <Tag color="orange">Offline</Tag>}` — pure browser
event, no DHIS2-reachability awareness. Confirmed via grep that **nothing
in this app currently listens to the SW's `dhis2ConnectionStatusPlugin`
broadcast** (`App.tsx`'s only `navigator.serviceWorker` usage is unrelated
update-registration logic) — wiring it in would be new plumbing, not
extending an existing consumer.

**Decisions**:

1. **Three distinct states, not two.** `"healthy" | "degraded" | "offline"`,
   derived from ticket 003's `{reachable, reason}`:
   - `reachable: true` → `"healthy"`.
   - `reason === "network"` (fetch itself failed to connect — DNS/connection
     refused) → `"offline"`. Browser-detected `!navigator.onLine` also maps
     here, and is checked independently for instant feedback (see #3).
   - `reason === "timeout"` (no response inside the 5s window — hung or
     very slow) or `reason === "server-error"` (5xx) or `reason === "access"`
     (401/403/409 — transport worked, something else is wrong) → `"degraded"`.
     Grouping timeout/5xx/access together matches the destination's actual
     ask ("slow/degraded" vs "truly offline") — none of them mean "no
     network," and `sync.ts`'s existing retry cadence already handles all
     three the same way (keep retrying on schedule), so the UI doesn't need
     to split them further.
2. **Extend `tracked-entity.tsx:463`'s existing tag**, not a new toolbar
   badge. It already conditionally renders only when there's something to
   report — reuse that footprint rather than adding a permanent toolbar
   element for a state that's usually "healthy."
3. **Two update sources, not one**: `window`'s `online`/`offline` events
   drive instant `"offline"` detection independent of the sync cycle (a
   user unplugging Wi-Fi shouldn't wait for the next periodic ping to see
   it); `"degraded"` can only be discovered by an actual DHIS2 round-trip,
   so it's set from `isDhis2Reachable`'s result inside the existing periodic
   push/delete-sync actors (`sync-tracker-actors.ts`) — no new polling loop,
   per the map's "reuse existing retry cadence" constraint. This means
   `"degraded"` can lag up to one sync-cycle interval behind reality, which
   is accepted (same staleness bound the rest of the sync loop already
   has).
4. **New `SyncContext` field**: `connectivityStatus: "healthy" | "degraded" | "offline"`
   (default `"healthy"`), written by the tracker actors after each
   `isDhis2Reachable` call and by the `online`/`offline` window listeners.
   `tracked-entity.tsx` reads it via `SyncContext.useSelector` instead of
   calling `navigator.onLine` directly.
5. **No SW-broadcast wiring.** Base the signal purely on the app's own
   `isDhis2Reachable` ping — simpler, no new `serviceWorker.addEventListener("message", ...)`
   consumer, and once ticket 002's 5xx-throw SW patch lands the two signals
   would mostly duplicate each other anyway.
6. **Reuse `sync-status-comp.tsx`'s color conventions**: hidden entirely
   when `"healthy"` (matches today's "only render when there's something to
   report"); amber `Tag` ("Server slow — retrying") for `"degraded"`; red
   `Tag` ("Offline") for `"offline"` (replacing today's orange, so red
   consistently means "failed"/"can't reach" across the app, amber means
   "in progress/pending").

**Not this ticket's job**: the actual `isDhis2Reachable` rewrite (ticket
003, not yet implemented) and wiring `connectivityStatus` into `sync.ts`'s
context/actors is implementation work for a future `/implement` session.
