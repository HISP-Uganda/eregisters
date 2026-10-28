---
title: Where does each scroll frame's time go in the current line list?
type: wayfinder:task
status: closed
assignee: claude
blocked_by: []
---

## Question

Using the synthetic harness in `.scratch/line-list-filter-performance/`
(and the real app if an authenticated tab is available), record a
Performance profile of continuous wheel scrolling and of a fast scrollbar
drag at 500, 50,000 and 200,000 rows × 12 columns + Actions, in a
production build. Report fps / long tasks per scroll, and attribute the
per-frame cost: React render of antd `Table` (column re-processing, row
mount/unmount from changing keys), `withActionsColumn`/`applyTableState`
rebuilds, `rowAt` materialization, style/layout, and any blank-row frames.
Confirm or refute that the cost is per-scroll-step and independent of row
count.

## Resolution

Profiled 2026-10-27 in headless Chromium (Playwright 1.63, i9-9980HK laptop,
1440×900) against a production build of a synthetic harness: the real
`LineListTable` + `useIndexedLineListResult`, 12 text columns + the Actions
column wired as in `analytics-screen.tsx`. Synthetic data only. Assets in
`.scratch/line-list-scroll-performance/` (`harness.tsx`, `drive.mjs`,
`matrix.jsonl`, `comp.mjs`/`incl.mjs`, `cpu-200000-4.cpuprofile`,
`subrow.mjs`). Scenarios: "wheel" = 150 real wheel events of 60 px;
"drag" = the scroll track jumped end-to-end in 120 rAF steps. "4×" is
CDP CPU throttling as the mid-range-laptop proxy.

**Confirmed: the cost is per scroll step and does not depend on row count.**

- Main thread per wheel step, unthrottled: **~30 ms** (4,459 ms / 150 at
  500 rows; 4,488 ms / 150 at 200k), of which ~22 ms is JS and ~4 ms paint.
  That is already over the 16.7 ms frame budget on a fast laptop.
- At 4×: every wheel step is a long task (151/151), averaging
  **~88 ms at 500 rows and ~94 ms at 200k**, giving ~17–18 fps. Drag at 4×
  runs at 10 fps (500 rows) down to 5.5 fps (200k).
- Headless rAF reported ~58 fps unthrottled for wheel. That number is
  unreliable as a jank signal, so use per-step main-thread time instead.
- Drag cost **does grow with rows**, though wheel cost doesn't: unthrottled
  drag ran at 43.5 fps at 500 rows, 27.9 at 50k and 25.6 at 200k. This is
  not yet explained (row materialization via `getRow` on full-window
  replacement is the suspect).

**Where a wheel step's time goes** (CPU profile at 200k, 4×, 22.5 s
non-idle across 150 steps):

- **React render/commit of the whole antd Table: ~70%** (`performWorkOnRoot`
  15.7 s; `commitRoot` 3.4 s; passive effects 1.6 s). Each step passes a new
  `dataSource` window, and `withActionsColumn` builds a new columns array on
  every render. So every row, cell, header cell and filter trigger re-renders.
- Component render self time (10.3 s total) breaks down as:
  - **Actions column ≈ 40%**: Button 1.9 s, Space 0.9 s, Wave 0.8 s,
    CSSMotion 0.6 s, loading icon, Space.Item. That's two antd Buttons per row.
  - **Body cells ≈ 38%**: Cell 2.9 s, BodyRow 1.0 s.
  - **Header filter UI ≈ 13%**: Dropdown, Trigger, FilterDropdown, icons and
    HeaderRow re-render on every step even though nothing in them changed.
  - antd CSS-in-JS token hashing runs inside these components on every
    render (`useToken` 1.1 s, `useGlobalCache` 0.7 s, `useStyleRegister`
    0.4 s, `murmur2`/`flattenToken`).
- **Forced synchronous layout: ~7%.** rc-table's `Table.js` runs
  `triggerOnScroll` in an effect on every `data` change, and it reads
  `scrollWidth`/`clientWidth` on the scroll body: 1.5 s self, ~10 ms per step at 4×.
- Our own code is negligible: `lineListWindow`, `getRow`,
  `applyTableState` and `LineListTable` itself are each < 30 ms total.

**Behavioural defects that make scrolling feel sluggish, independent of CPU:**

- **Rows move only in whole-row jumps.** The body is never offset by
  `scrollTop % 40`, so scrolling 1–39 px changes nothing on screen and then
  the content snaps a full row.
- **An 80 px dead zone, then a 2-row offset.** The 2 overscan rows above the
  window are drawn in the visible area. At `scrollTop` 40 and 100 the first
  visible row is still row 0, and at 120 it's row 1 instead of row 3.
- **Rows trail the scrollbar by at least one frame.** React renders the new
  window in a task after the scroll event, so during a drag 120/120 frames
  showed rows behind the scroll position.
- **The wheel `preventDefault` never works.** React registers `onWheel` as
  passive, so the console logs "Unable to preventDefault inside passive event
  listener invocation" and the page can scroll underneath the table.
- DOM size is small and isn't the problem: 26 `tr`, 338 `td`.
