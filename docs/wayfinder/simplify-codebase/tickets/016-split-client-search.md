---
title: Split the client search page
type: wayfinder:task
status: closed
assignee: claude-session
blocked_by: [005-screen-pattern]
---

## Question

Split `src/routes/tracked-entities.index.tsx` (`TrackedEntitiesSearch` 354 lines) following the pattern in "What pattern should the giant screens
be split into?" (`src/screens/<screen>/`: data hooks, pure helpers with
unit tests, presentational sections, `actions.ts`; no component or hook
over ~150 lines). Behaviour-preserving; checked by typecheck, tests,
fallow and a browser walk-through on the test server.

## Resolution

Split into `src/screens/client-search/` (401 + 228 lines → 5 files,
largest ~95 lines); the route file only binds the search terms and
"open client" to the screen. Decided with the user (2026-09-28, took the
recommendations):

1. **One registration flow** (`register-client.tsx`:
   `useClientRegistration` + `RegisterClientModal`) for both the results
   page and the "no clients found" card, which had near-copies. It
   follows the card's behaviour everywhere — a small, deliberate change
   on the results page: **Cancel now deletes the draft client** (the
   results page used to leave it in the local store — drafts are hidden
   from search, so they piled up unseen, never pushed), the form doesn't
   keep stale values (`preserve={false}`), and the save order is client
   then enrollment. Pre-filling from the search stays the card's option.
2. The rest: `use-client-search.ts` (the search query; `filledTerms`),
   `client-columns.tsx` (the columns builder; the registering-facility
   and village columns), `no-clients-card.tsx` (was
   `src/components/no-patient-card.tsx`), `client-search-screen.tsx`.
   Kept as they were, for the map's "commented-out code" item: the
   commented-out "Delete client" column, and the "Patient Dashboard /
   Patient Summary" menu (no click handlers; its column only appears for
   an attribute id `actions`, which the program lacks).

Checked: typecheck clean; 80 test files / 553 tests pass (3 new); fallow
clean, no cycles. Browser: not re-checked after the change (the tab is
hidden and was in use). Note: an earlier check (old code) opened the
results page's registration and may have left one empty draft client in
the test device's local store — the leak this fixes; never pushed.
