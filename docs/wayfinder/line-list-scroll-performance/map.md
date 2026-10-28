---
label: wayfinder:map
tracker: local-markdown
---

# Make line list vertical scrolling smooth

## Destination

A measured fix, built and browser-verified: vertical scrolling in the line
list holds 60 fps on a fast laptop and ≥ 30 fps with no long tasks and no
blank rows at 4× CPU throttling (the mid-range proxy), and doesn't feel
sluggish to the user on a typical facility laptop with real data, at 200,000 rows × 12
visible columns plus the Actions column, while keeping the
≤200 ms filter-apply target and the single committed result that feeds the
count, Pivot and Export.

## Notes

- Settled while charting (2026-10-27, the user took every recommendation):
  symptom is assumed to be jank/dropped frames plus blank rows on fast scroll
  (Q1), on desktop at any row count (Q2); the map **carries execution**
  through to a measured, browser-verified fix, as the filtering map did (Q3);
  the scroll mechanism may be replaced, but only within antd and already
  installed packages (Q4). The user asked that **antd's default `virtual`
  Table scrolling** be seriously considered as the replacement.
- Today (`src/components/analytics/line-list-table.tsx`,
  `line-list-window.ts`): a separate 16 px scroll track sets `scrollTop`
  state on every scroll event; each tick re-renders the whole antd `Table`
  with a new `dataSource` window (viewport + 2 overscan rows each edge),
  rebuilds the Actions column via `withActionsColumn`, and forwards
  wheel/touch/keys to the track. `virtual` is only used when `rowAt` is
  absent. The table body has `overflow-y: hidden`.
- Must keep: horizontal scroll with fixed-right Actions column, filter
  dropdowns (incl. date picker), sorting, keyboard/touch scrolling, scroll
  reset on a new result generation, Save/Return snapshot behaviour, and not
  pushing the full matching-row array through React on filter change unless
  measured as within budget.
- Background: [Make line list column filtering responsive](../../../.scratch/line-list-filter-performance/map.md)
  (decisions there: indexed filter engine, bounded viewport, shared result).
  Its synthetic harness lives in `.scratch/line-list-filter-performance/`.
- Skills: `diagnosing-bugs` for profiling, `antd` when evaluating Table
  behaviour, `grilling` + `domain-modeling` for decisions. Preserve the
  shared worktree's uncommitted changes. Synthetic data only in artifacts.

## Decisions so far

- [Can antd's built-in virtual Table serve the committed result at 200,000 rows?](tickets/002-antd-virtual-feasibility.md): Filter change is fine (~47 ms JS), but every scroll step loops over all rows (~15 ms at 200k, fine to ~50k); 60 fps at 200k needs a `pnpm patch` of virtual-list.
- [Where does each scroll frame's time go in the current line list?](tickets/001-profile-scroll.md): ~30 ms main thread per wheel step on a fast laptop (~90 ms at 4× CPU), independent of row count; ~70% is re-rendering the whole antd Table (Actions buttons ≈ 40% of component time, cells ≈ 38%, unchanged header filters ≈ 13%) plus a forced layout per data change; rows also move in whole-row jumps with an 80 px dead zone and lag the scrollbar a frame.
- [Which scroll mechanism should the line list use?](tickets/003-choose-scroll-mechanism.md): Keep our own window but scroll `.ant-table-body` natively with spacer rows, re-window in ~5-row chunks, lighten the Actions buttons, and memoize columns; antd virtual + package patch rejected; destination amended to 60 fps at 1× / ≥ 30 fps with no long tasks at 4×.
- [Build the natively scrolled, chunked line list window](tickets/004-build-native-scroll-window.md): Built. At 200k rows, 1× runs at 59 fps (p95 16.7 ms, 7.3 ms JS per step, no blank frames); 4× went from 17 fps with 151 long tasks to 30–36 fps with no long tasks, but frame p95 is still 83–100 ms because rc-table re-renders every retained row on each re-window; filter-apply is 166–179 ms.
- [Should the line list render its own body rows to close the 4× gap?](tickets/006-own-body-rows.md): No. Keep rc-table's body; at 4×, gate on ≥ 30 fps with no long tasks and no blank rows (p95 is only reported), and a drag max frame ≤ 150 ms; add a user-run real-device check, and reopen custom rows only if that still feels sluggish.

## Not yet specified

- Any further work that verification turns up.

## Out of scope

- Filter engine, Pivot, and export performance beyond keeping them working.
- Horizontal-scroll performance, unless the fix itself regresses it.
