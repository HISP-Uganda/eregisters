---
title: Switch the report page to the DHIS2 route
type: wayfinder:task
status: open
assignee:
blocked_by: [001-rotate-key, 002-route-api-research]
---

## Question

Create the route on the test server (then production, with the user's
OK) holding the new key, point `fetchServerValues` at it through the app's
data engine, delete the hard-coded URL and key, and check a report's
values load on the test server.
