---
title: Build the non-blocking first screen
type: wayfinder:task
status: closed
assignee: claude
blocked_by: [004-stop-waiting-for-records.md]
---

## Question

Build change A from "How should startup stop waiting for every tracker
record?" and re-time the first screen with the startup capture.

## Progress (2026-10-28)

Built: the shell's pending/failed record queries
(`src/screens/root-layout/use-shell-state.ts`), the client list's
statistics (`src/routes/tracked-entities.tsx`) and client search
(`src/screens/client-search/use-client-search.ts`,
`client-search-screen.tsx`) use non-suspending `useLiveQuery`; search
with no terms doesn't query, and with terms shows "Loading clients…"
until clients are in memory. No suspending record query remains on the
first screen. Typecheck clean, 725/725 tests. Awaiting the user's
re-capture of `first-screen` and whether the page stays responsive while
records load (main-thread reassembly still runs; change B addresses it).

## Resolution (2026-10-28)

User-reported on real data: the first screen now appears in roughly 2–3 s
after reload (was ~31.5 s). Still to measure under "Build packed record
reads": how long the record collections take to finish loading behind
the screen, and whether the page stalls while they do.
