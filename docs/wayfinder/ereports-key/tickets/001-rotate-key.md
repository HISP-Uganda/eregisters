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
