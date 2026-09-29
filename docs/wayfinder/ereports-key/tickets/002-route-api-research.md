---
title: How does the DHIS2 Route API proxy the ereports query?
type: wayfinder:research
status: closed
assignee: claude-session
blocked_by: []
---

## Question

For DHIS2 2.42/2.43: how a route is created (`/api/routes`), how it stores
an API-key header server-side, how query parameters are passed through
(`/api/routes/{id}/run/…`), who may call it (sharing/authorities), and
what the app's call and response look like — enough to replace
`fetchServerValues` without the browser seeing the key.

## Resolution

From the DHIS2 docs ("Route", developer docs for the Web API), 2026-09-29:

- **Availability:** v40.10, v41.6 and later — production 2.42.5.1 and the
  test server 2.43 both have it.
- **Create:** `POST /api/routes` (needs the `Route` authority), e.g.

  ```json
  {
    "name": "eReports query",
    "code": "ereports-query",
    "url": "https://eregisters.health.go.ug/ereports/query",
    "disabled": false,
    "auth": { "type": "api-headers", "headers": { "X-API-KEY": "<new key>" } },
    "authorities": ["M_eregisters"],
    "responseTimeoutSeconds": 30
  }
  ```

  Auth headers are **encrypted at rest** (plain `headers` on a route are
  not). A URL ending `/**` passes sub-paths through; not needed here.
- **Run:** `GET /api/routes/{id|code}/run` — from the app, the data
  engine's `resource: "routes/ereports-query/run"` (the engine already
  calls arbitrary API paths here, e.g. `dataStore/eregisters`). DHIS2
  adds the key and an `X-Forwarded-User` header; the browser never sees
  the key.
- **Who may run it:** its creator, users with `ALL`, and users holding
  any authority listed in the route's `authorities` — use the app's own
  (e.g. `M_eregisters`) so facility users can run it.
- **Limits:** response timeout 5 s by default (`responseTimeoutSeconds`,
  1–60; the ereports query may need more); 5 min max transfer; the
  target must match `route.remote_servers_allowed` in `dhis.conf`
  (default `https://*`).
- **Not stated in the docs — check first when the route is made:**
  whether query parameters on `/run` (`source`, `period`, `dataset`,
  `orgunit`) are forwarded to the upstream URL; whether the upstream's
  status and body come back unchanged; whether a `GET /api/routes/{id}`
  ever returns the key. If parameters aren't forwarded, a `/**` route
  plus a path, or one route per query shape, would be needed.

Fog it clears: none new; the Not-yet-specified question (can the DHIS2
server reach ereports) stays for ticket "Switch the report page to the
DHIS2 route" — both are on the same host today.
