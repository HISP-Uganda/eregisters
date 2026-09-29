---
title: Rotate the exposed ereports API key
type: wayfinder:task
status: open
assignee: claude-session
blocked_by: []
---

## Question

The current `x-api-key` is in the app's bundle and in git history, so
treat it as exposed. Whoever runs the ereports service issues a new key
and revokes the old one — a human task (HITL): the key lives on that
service, not in this repo. The new key must **not** go into the app's
code; it goes into the DHIS2 route (next ticket). Until the route exists,
decide whether the report page may go without server values for a while
or needs the old path for a short overlap.

## Decided (2026-09-29, the user took the recommendation)

**Short overlap:** the old key keeps working until the DHIS2 route is live
on production; it is revoked right after. Report pages keep loading the
server's values throughout. Keep the overlap to days, not weeks.

Checklist (the user's):
1. Get a new key from whoever runs the ereports service — never into
   chat, the repo or the app's code.
2. Hand it over only when "Switch the report page to the DHIS2 route"
   creates the route (test server first, production with the user's OK);
   it goes straight into the route's encrypted `api-headers`.
3. Once the route serves production reports, revoke the old key
   (`LnwYP…`, exposed in git history and every loaded bundle).
4. Delete the stray copies in local `.claude/worktrees/` checkouts.

Stays open until the new key exists; this ticket then closes and unblocks
the switch-over.

**Update (2026-09-29, the user):** "use the same key for now" — the
rotation is deferred; the current key goes into the DHIS2 route, so it
leaves the app's code and bundle now. Rotating it (and revoking the old
one, still in git history and old bundles) stays on this ticket.

**Update (2026-09-29):** the route `ereports-query` is live on both
servers (ticket "Switch the report page to the DHIS2 route"), still with
the old key. Step 4 is done: the six clean research worktrees under
`.claude/worktrees/` were removed (their branches are kept; the key is
still in those branches' history, like in `main`'s). What remains, all
the user's:

1. Get a new key from whoever runs the ereports service.
2. Put it into the route on **both** servers, and nowhere else. In the
   browser console of the app, signed in to each server in turn:
   `PATCH /api/routes/<uid>` with
   `[{"op":"replace","path":"/auth","value":{"type":"api-headers","headers":{"X-API-KEY":"<new key>"}}}]`
   (Content-Type `application/json-patch+json`). The uids are
   `aarGHEoF7B4` on the test server and `tuincdXhDh6` on production.
3. Open one report on each server to confirm it still loads its values.
4. Revoke the old key (`LnwYP…`).

This ticket closes when the old key is revoked.
