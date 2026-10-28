---
title: Can antd's built-in virtual Table serve the committed result at 200,000 rows?
type: wayfinder:research
status: closed
assignee: claude-research-agent
blocked_by: []
---

## Question

From the installed antd 6.6.2 and its table/virtual-list dependencies
(node_modules, versions per pnpm-lock.yaml) and antd docs: what does
`<Table virtual scroll={{ x, y }}>` do per `dataSource` change and per
scroll step? Specifically: O(n) work on a new dataSource (record
flattening, `rowKey` resolution, sort/filter pipelines even with
`onFilter` removed and `sorter: true`), whether a lazy array-like or
Proxy over `rowAt` is safe to pass as `dataSource`, measured cost of
handing it 200,000 rows (against the 200 ms filter budget), how it
handles fixed-right columns + horizontal scroll, header filter dropdowns,
programmatic scroll-to-top on a new result (`ref.scrollTo`), fixed row
height, and known performance issues/caveats in the issue tracker.

## Resolution

Researched 2026-10-27 by a research agent from installed antd 6.6.2 /
`@rc-component/table` / `@rc-component/virtual-list` 1.5.1 sources plus a
Node micro-benchmark replicating antd's loops (no browser run). Findings:
`research/002-findings.md` and `research/002-bench.mjs` on branch
`research/antd-virtual-table` (`30a0c16`), pushed, no PR.

- **Feasible on filter change, not on scroll, at 200k — unless patched.**
- **New dataSource ≈ 47 ms JS at 200k** (within the 200 ms budget): five
  O(n) passes — two child-row scans (antd `InternalTable.js:186`,
  rc-table `useExpand.js:33`, 2–3 ms each), array copy
  (`useSorter.js:242`, never sorts with `sorter: true`, 0.8 ms),
  per-row wrapper objects (`useFlattenRecords.js:44`, 15 ms), and the
  visible-range loop ×2. Materializing the array from committed indices
  adds 11 ms. Browser first-paint is **unmeasured**.
- **Per scroll step ≈ 15 ms at 200k** (≈ the whole 16.7 ms frame):
  virtual-list recomputes the visible range with an O(n) loop over every
  row on every offset, no early exit (`List.js:144-161`), and again after
  measuring new rows' heights (`useHeights.js:33-40` → `List.js:181`).
  7.5 ms/pass at 200k, 1.7 ms at 50k. No prop disables it; only a
  `pnpm patch` of `List.js` — outside the map's "installed packages,
  unmodified" constraint, so it needs the user's approval.
- **Caveats:** Proxy over `rowAt` works only wrapping a real array and is
  copied anyway (~5× slower) — pass a real array. Fixed-right Actions,
  header filter dropdowns, controlled sort and `ref.scrollTo({top: 0})`
  work. `scroll.x` must be a number (no `"max-content"`; widths only from
  column `width`). Horizontal scroll is virtualized too (re-renders rows
  per step). No keyboard scrolling in virtual mode (keep our handler).
  Default row height 41 px vs our 40 px (heights measured per row). No
  GitHub issue documents the O(n) scroll cost.
