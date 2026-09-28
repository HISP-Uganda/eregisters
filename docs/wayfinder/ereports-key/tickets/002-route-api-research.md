---
title: How does the DHIS2 Route API proxy the ereports query?
type: wayfinder:research
status: open
assignee:
blocked_by: []
---

## Question

For DHIS2 2.42/2.43: how a route is created (`/api/routes`), how it stores
an API-key header server-side, how query parameters are passed through
(`/api/routes/{id}/run/…`), who may call it (sharing/authorities), and
what the app's call and response look like — enough to replace
`fetchServerValues` without the browser seeing the key.
