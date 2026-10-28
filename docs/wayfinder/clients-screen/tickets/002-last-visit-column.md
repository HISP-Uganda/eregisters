---
title: Build the Last Visit column
type: wayfinder:task
status: closed
assignee: claude
blocked_by: []
---

## Question

Add Last Visit (latest main-stage Visit Date per client, `YYYY-MM-DD` or
"—") as the first column, pinned left, with lists sorted most recent
first. Compute it without a per-row scan of all events (one pass building
a client → latest date map), and check its cost on a synthetic
20k-client / 60k-visit set.

## Resolution (2026-10-28)

Built. `latestVisits` (one pass over main-stage visits → client →
latest Visit Date) and `byLastVisit` live in
`src/screens/client-search/client-lists.ts`; the shared client lists and
search results are sorted most recent first, never-visited clients last in
their existing order. `clientColumns(metadata, lastVisits)` puts "Last
Visit" (`YYYY-MM-DD` or "—", `fixed: "left"`, 120 px) first.

Cost on a synthetic 20k clients / 60k visits (Vitest, this machine):
534 ms with dayjs per date, cut to **58 ms** by comparing parsed times
against the day's bounds (date-only values read as local midnight, as
dayjs reads them). Full suite 735 passed. Not yet checked by the user in
the browser; until visits load, every client shows "—" and the order is
unsorted for those first seconds.

## Revision (2026-10-28, user)

Last Visit is now the Visit Date (`occurredAt`) of the client's most
recently **created** visit (`createdAtClient`, else `createdAt`; ties by
the later Visit Date), not the latest Visit Date. Sorting still uses that
shown Visit Date. 63 ms for 20k clients / 60k visits. Glossary updated.

## Revision 2 (2026-10-28, user)

Last Visit now shows **when the most recently created visit was created**
(`createdAtClient`, else `createdAt`, else its Visit Date), and lists sort
by that time.
