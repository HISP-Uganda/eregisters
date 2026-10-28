---
label: wayfinder:map
tracker: local-markdown
---

# Clients screen: visit cards, Last Visit and a virtual table

## Destination

The clients screen changed in place and verified: a clickable "Visits
Today" card beside clickable "Total Clients" and "Registered Today" cards,
each listing its clients; a Last Visit column pinned first; and the
results shown in an unpaginated antd virtual table with an improved
display.

## Notes

- 2026-10-28: the user took every recommendation in the charting round.
  This map **carries execution**: build tickets deliver the change, and
  only the table's look is still a decision.
- A **visit** is an event on the main stage (`MAIN_STAGE`); its Visit Date
  is `occurredAt`.
- Visits load in the background after the first screen
  (see the cached-metadata-startup map), so anything needing visits shows a
  loading state at first rather than holding the page.
- Code: `src/routes/tracked-entities.tsx` (cards),
  `src/screens/client-search/` (results table, columns, query).
- pnpm only; antd only; commit only when asked.

## Decisions so far

<!-- one line per closed ticket -->

- Charting round (2026-10-28), user accepted all recommendations:
  - "Visits Today" counts this facility's clients (not draft/deleted) with
    a visit whose Visit Date is today, so the number equals the list length.
  - Clicking a card lists its clients in the results panel in place of the
    search, clears the search form, highlights the card, and is kept in the
    route's search params (Back and refresh preserve it); a search or a
    second click returns to normal. All three cards are clickable.
  - Last Visit is the latest Visit Date among the client's main-stage
    visits on this device, shown `YYYY-MM-DD` or "—"; pinned left; lists
    open sorted by most recent Last Visit.
  - "Registered Today" keeps using the client's `createdAt`.
  - "Improving the table display" is settled by a prototype.
- [Build the Visits Today card and clickable card lists](tickets/001-card-lists.md):
  built; three clickable cards share one in-memory client list, kept in the
  route's `list` search param.
- [Build the Last Visit column](tickets/002-last-visit-column.md): built;
  one pass gives each client's Last Visit (revised: when the most recently
  created visit was created), lists sort by it, ~60 ms for 20k clients /
  60k visits.
- [Prototype the improved clients table](tickets/003-table-prototype.md):
  variant A chosen — virtual, unpaginated, sortable dense grid; one-line
  cells; Last Visit with time. Built.

- Follow-up (2026-10-28, user: "make the page mobile friendly"): below
  `lg` the cards go compact (no icons, smaller text on phones) and the
  results panel is `max(420px, 75vh)` with the count and a
  full-width "Register New Client" above the table. Search left as it was
  (user). Desktop unchanged.

## Not yet specified

- Nothing open. Remaining: the user's check in the browser, then commit.

## Out of scope

