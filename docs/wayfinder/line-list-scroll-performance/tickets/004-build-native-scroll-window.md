---
title: Build the natively scrolled, chunked line list window
type: wayfinder:task
status: closed
assignee: claude
blocked_by: [003]
---

## Question

Implement the mechanism decided in [Which scroll mechanism should the line
list use?](003-choose-scroll-mechanism.md) in
`src/components/analytics/line-list-table.tsx` / `line-list-window.ts`:

- native `.ant-table-body` scrolling with spacer rows via
  `components.body.wrapper`;
- chunked re-windowing;
- memoized columns, so the header doesn't re-render on scroll;
- a lightweight Actions column;
- `scrollTop` reset on a new result generation.

Then remove the scroll track and the custom wheel/touch/key handlers.

Keep these working:

- horizontal scroll with the fixed-right Actions column;
- filter dropdowns (including the date picker) and sorting;
- the committed-result wiring (count, Pivot, Export);
- keyboard and touch scrolling, now native.

Also explain why the old drag cost grew with row count, and confirm the new
design doesn't. Update the unit tests (`line-list-window`, table tests).
Record the before/after profile numbers from the existing harness
(`.scratch/line-list-scroll-performance/`).

## Resolution

Built 2026-10-27, uncommitted in the shared worktree:
`src/components/analytics/line-list-table.tsx`, `line-list-window.ts` and
`__tests__/line-list-window.test.ts`. TypeScript is clean and the 90
analytics tests pass. Profile numbers come from
`.scratch/line-list-scroll-performance/` (`matrix.jsonl` before,
`matrix-after.jsonl` after). These are synthetic production builds in headless
Chromium on an i9-9980HK. "4×" means CDP CPU throttling.

**What changed**

- The separate scroll track and our wheel/touch/key handlers are gone.
  `.ant-table-body` scrolls natively. A stable `components.body.wrapper`
  (`SpacedBody`) adds spacer `<tr>`s sized from a context.
- `lineListWindow(count, scrollTop, height, current)` returns `current`
  unchanged while at least 5 of the 10 overscan rows remain at each edge.
  Re-windows run inside `React.startTransition`, so React renders them in
  slices rather than one long task.
- Rows are pinned to exactly 40 px with a border-box, zero-vertical-padding
  `td` (specificity raised above antd's small-table rule). The Actions cell's
  24 px buttons had made rows 41 px, so the content drifted 1 px per row
  against the spacers.
- Columns, including the Actions column, are memoized, with handlers read
  through a ref. The header no longer re-renders on scroll.
- The Actions column now uses plain `<button class="line-list-action">`
  styled with antd tokens. The labels and handlers are unchanged.
- While scrolling, cell transitions are off and row `pointer-events` are
  suspended via a DOM class, cleared 150 ms after the last scroll event.
  Rows sliding under a still pointer had been firing hover on every step and
  starting about 4,000 CSS transitions per run.
- On a new result generation, `scrollTop` resets to 0 through the Table ref.

**Before → after, 200k rows** (wheel = 150 × 60 px; drag = end to end in 120 frames)

| | before | after |
|---|---|---|
| 1× wheel | 58 fps (headless; ~30 ms main thread/step) | **59.4 fps, p95 16.7 ms, 0 blank frames** |
| 1× wheel main thread/step | ~30 ms (22 ms JS) | **10.6 ms (7.3 ms JS)** |
| 1× drag | 25.6 fps, rows lag the scroll | **60 fps, 0 blank frames** |
| 4× wheel | 17 fps, 151 long tasks (~94 ms each) | **30–36 fps, 1 long task\*, p95 83–100 ms, 0 blank frames** |
| 4× drag | 5.5 fps | **46 fps, max frame 83–117 ms, 0 blank frames** |
| Filter-apply (12 broad filters, 1×) | 126 ms (earlier map) | **166–179 ms** (≤ 200 ms) |

\* A one-off ~70–80 ms task on the first wheel event. It appears in the old
design, in the new one and with re-windowing disabled, and almost none of it
is attributed to work inside the page, so I'm treating it as harness overhead.
Some STALE-check runs at 4× showed up to 12 long tasks. The per-frame layout
check adds noise.

Row count no longer matters: 500 and 200k rows give the same numbers.

**Acceptance status**

- Met:
  - 1× wheel at 60 fps;
  - JS per step ≤ 8 ms (7.3 ms). Total main thread per step, paint
    included, is 10.6 ms;
  - zero blank frames;
  - 4× at ≥ 30 fps with no long tasks;
  - filter-apply ≤ 200 ms.
- **Not met:**
  - 4× wheel frame p95 ≤ 33 ms (83–100 ms);
  - 4× drag "no frame > 100 ms" (max 83–117 ms, borderline).

**Remaining cause, measured:**

- With re-windowing disabled, 4× wheel scrolling runs at 58 fps. A plain
  static HTML table also holds 59 fps at 4×. So the remaining slow frames
  are entirely re-window cost.
- rc-table re-renders **every** retained `BodyRow`/`Cell` on each re-window,
  because `rowKeys` and `index` props change. Then it repaints the rows.
- At 4×, a re-window takes longer than scrolling 5 rows, so the count of
  slow frames stays near 38 whatever the overscan size (tried 6/3, 10/5,
  20/10 and 30/15).
- Closing the gap means retained rows must not re-render. That requires
  rendering body rows ourselves instead of rc-table's `BodyRow`. See the
  new decision ticket.

**Why the old drag cost grew with row count:** this is unverified, because
the old code was replaced in place. In the old design every drag frame
replaced all 26 rows, so they all re-mounted, each with two antd Buttons.
Higher row indices also have longer cell text ("value-11-199999" vs
"value-11-499"). That widens columns beyond their estimated width, which
triggers rc-table's column re-measure and a second render. 50k and 200k
(5–6 digits) were equally slow, and 500 (3 digits) was faster. In the new
design, drag runs at 60 fps at every row count.
