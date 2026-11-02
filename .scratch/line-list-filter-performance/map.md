---
label: wayfinder:map
tracker: local-markdown
---

# Make line list column filtering responsive

## Destination

Deliver a measured fix for line list column filtering: applying a filter updates the visible rows and count within 200 ms on the largest representative dataset, without a visible page freeze. The same filtered rows must feed the pivot and exports, and saved or restored filters must keep working.

## Notes

- This map carries execution through the measured fix and browser verification, because two earlier code changes improved isolated benchmarks while the reported page remains slow.
- Preserve the current filter behavior: Empty can be combined with another criterion, `DATE` and `AGE` use inclusive birth-date ranges, freeform fields use text search, option sets use choices, and saved views/return navigation restore filters.
- Existing code synchronously derives `filteredRows` in `useLineListColumns`, passes them to a virtual Ant Design table, and shares them with the pivot/export. Prior 50,000-row microbenchmarks measured roughly 20 ms for one date range, 47 ms for five option choices, and 0.6 ms to build eight text column definitions. These measurements do not explain the continuing browser freeze.
- No browser tab was available in the current computer-use inventory. Build a representative local browser reproduction if an authenticated analytics session is unavailable. Record only synthetic data and aggregate timings in artifacts.
- Use `diagnosing-bugs` for the reproduction/profile, `antd` when evaluating Table behavior, and `grilling` plus `domain-modeling` for decisions.
- Keep unrelated sync, storage, and metadata work outside this effort; preserve existing uncommitted changes in the shared worktree.

## Decisions so far

- [What work blocks the page when a column filter is applied?](issues/01-reproduce-browser-freeze.md): A synthetic browser reproduction found a development-only React diagnostics stall at 50,000 rows and a production synchronous filter-scan stall at 200,000 rows; the latter exceeds the 200 ms target.
- [Which filtering architecture will meet the target?](issues/02-choose-filtering-architecture.md): Use a normalized column filter cache and a bounded continuous-scroll viewport, then commit one ordered result generation across the line list, count, Pivot, and Export.
- [How should filtered results be shared across analytics views?](issues/03-share-filtered-results.md): Keep one generation-checked committed result behind a stable store; all views and exports read it, while saved lists and return navigation persist only selections.
- [Build the indexed filter result engine](issues/05-build-indexed-filter-result.md): The chunked, generation-checked engine preserves filter/sort behavior and evaluates 12 broad filters over 200,000 rows in 76–80 ms; full-page rendering remains the next bottleneck.
- [Build the bounded continuous-scroll line list](issues/06-build-bounded-line-list-viewport.md): The screen now uses a bounded viewport and one committed result for count, list, Pivot, and exports. Synthetic 200,000 × 12 broad-filter click-to-paint was 180.5 ms in development and 126.4 ms in production; final interaction and authenticated-data verification remain in 04.

## Not yet specified

- Any additional work revealed by the shared-result contract or full browser verification.

## Out of scope

- Changing how tracker data is pulled or stored, or changing the analytics dataset's clinical meaning.
- Pivot optimizations unrelated to applying a line list column filter.
