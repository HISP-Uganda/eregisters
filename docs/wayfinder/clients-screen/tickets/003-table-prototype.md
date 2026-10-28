---
title: Prototype the improved clients table
type: wayfinder:prototype
status: closed
assignee: claude
blocked_by: [002]
---

## Question

How should the clients results table look? Replace pagination with an
antd virtual table filling the panel height (sticky header, compact rows,
sortable columns, count above the table, Last Visit pinned) as a rough
working version on the real screen for the user to react to. The
reaction decides the final display; any follow-ups graduate from the map's
fog.

## Progress (2026-10-28)

Prototype on the real screen (sub-shape A), switched by `?variant=` on
`#/tracked-entities` with a dev-only bottom bar (← / → keys):
`src/screens/client-search/clients-table.prototype.tsx`,
`src/components/prototype-switcher.tsx`, temporary `variant` search param in
`ClientSchema`. All three are antd virtual tables, no pagination, sized to
fill the panel under the cards:

- **A — Dense sortable grid**: every column, small rows, sticky header,
  every column sortable, zebra rows, Last Visit pinned.
- **B — Two-line rows + quick filter**: recency tag (Today / 3 days ago…)
  + date pinned left; first list attribute bold with the rest underneath;
  no header; a filter box over the shown list.
- **C — Grouped by last visit**: Today / This week / This month / Earlier /
  Never visited headings with counts, compact columns beneath.

Awaiting the user's reaction; not checked in a browser by the agent
(extension not connected).

## Resolution (2026-10-28)

The user chose **A (dense sortable grid)** and added: Last Visit shows the
time too, and cell text stays on one line. Built as
`src/screens/client-search/clients-table.tsx` (`ClientsTable`): antd
virtual table, no pagination, small rows, sticky header, zebra rows, every
column sortable (Last Visit by time, others by shown text with a numeric
collator), `white-space: nowrap` + ellipsis with the full text on hover,
each column sized to its title and the longest text in the first 300 rows
(90–320 px). Last Visit is `YYYY-MM-DD HH:mm`, 150 px, pinned left. The
panel fits under the cards so the table body scrolls, not the page.

All three variants are kept on the local throwaway branch
`prototype/clients-table` (commit `eb9632c`, never merge, not pushed);
the switcher, variants and temporary `variant` search param are removed
from the working tree. Tests 737 passed. Not checked in a browser by the
agent (extension not connected).

## Revision (2026-10-28, user)

No ellipsis anywhere, headings included. Each column's width is now
measured with the page font (canvas `measureText`): the wider of its bold
title plus sort arrows and its widest text across **all** rows (the 20
longest by length are measured), no upper limit; cells and titles are
`nowrap`. Last Visit is sized the same way.
