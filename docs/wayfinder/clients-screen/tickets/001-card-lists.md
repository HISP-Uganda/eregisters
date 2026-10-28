---
title: Build the Visits Today card and clickable card lists
type: wayfinder:task
status: closed
assignee: claude
blocked_by: []
---

## Question

Build, per the charting decisions on the map: a "Visits Today" card; all
three cards clickable, each listing its clients in the results panel
(route search param, highlighted card, search cleared, toggle off on
second click or a search). Non-suspending queries; tests for the
today-filters.

## Resolution (2026-10-28)

Built. `src/screens/client-search/client-lists.ts` holds the lists
(`registeredOn`, `visitedOn`, `isOnDay`) and `useClientListsSource`, run
once in the clients page and shared with the results panel through
`ClientListsContext`. The route search gains `list`
(`all | registeredToday | visitsToday`); a card click clears the search
form and toggles its list, a search clears the list. The selected card is
outlined in its colour. Visits are queried (main stage, not draft/deleted,
only `trackedEntity` + `occurredAt`) once clients have loaded, so Visits
Today shows a loading state for those first seconds. Empty lists show the
register card with "No clients visited today." etc. Tests:
`src/screens/client-search/__tests__/client-lists.test.ts`; full suite
731 passed. Not yet checked in the browser by the user.

## Revision (2026-10-28, user: "visits today take long querying")

Visits Today waited for the full client list (~7 s) and then the whole
events collection with data values. Now `readVisitSummaries`
(`src/db/sqlite/visit-summaries.ts`, via `readQuickVisitSummaries` in
`src/db/collections.ts`) reads only tracked entity, Visit Date and
creation times of the facility's live clients' live main-stage visits in
one SQL join on mount; the card count (`counts.visitsToday`) comes from it
before either collection is ready, and Last Visit / the lists use it until
the events collection has loaded, then switch to the live query. Dexie
backend: no quick read, unchanged behaviour.
