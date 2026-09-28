---
label: wayfinder:map
tracker: local-markdown
---

# Keep the ereports API key out of the browser

## Destination

The report page still shows the server's submitted values, but no browser
ever holds the ereports service's API key: the app calls DHIS2, and DHIS2
(its Route API, 2.41+) adds the key server-side. The request follows
whichever DHIS2 server the app runs against, not always production.

## Notes

- Two copies in the code: the report page's `fetchServerValues`, and a
  dead `pullAggregateData` actor in `src/machines/sync.ts`.
- Found while splitting the reports page (map "Simplify the codebase",
  ticket "Split the data set reports page"): `fetchServerValues` in
  `src/screens/data-set-report/report-data.ts` calls
  `https://eregisters.health.go.ug/ereports/query` with a hard-coded
  `x-api-key`, shipped in the JS bundle and in git history.
- Decided 2026-09-28 (the user took the recommendation): rotate the key,
  then route the call through the DHIS2 Route API.
- Production DHIS2 is 2.42.5.1 and the test server 2.43 — both have the
  Route API. No writes to production without the user's explicit OK.
- Carries execution like the sibling maps.

## Decisions so far

- [How does the DHIS2 Route API proxy the ereports query?](tickets/002-route-api-research.md) — `POST /api/routes` with `api-headers` auth (key encrypted at rest), run via `routes/<code>/run` through the data engine, access by the app's authority; query-parameter forwarding to confirm when the route is made.

## Not yet specified

- Whether the ereports service can be reached from the DHIS2 server's
  network, and what the route's access (sharing) should be.

## Out of scope

- Other external calls — only this one was found.
