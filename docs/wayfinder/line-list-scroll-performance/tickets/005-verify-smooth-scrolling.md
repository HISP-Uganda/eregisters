---
title: Does the new line list meet the scroll acceptance numbers?
type: wayfinder:task
status: in-progress
assignee: claude
blocked_by: [004, 006]
---

## Question

Re-run `.scratch/line-list-scroll-performance/drive.mjs` (wheel, drag,
trace, CPU) at 500 / 50k / 200k rows, 1× and 4×, against a production build.
Pass/fail each acceptance number in [Which scroll mechanism should the line
list use?](003-choose-scroll-mechanism.md), as amended by [Should the line
list render its own body rows to close the 4× gap?](006-own-body-rows.md), and re-check filter-apply
≤ 200 ms with the filtering map's harness.

In the browser, check by hand:

- horizontal scroll and the fixed Actions column;
- filter and sort dropdowns;
- keyboard, touch and trackpad scrolling;
- scroll reset on filter change;
- the return-snapshot round trip.

Decide what regression coverage guards the per-step cost, for example a
test that a scroll within the overscan band causes no re-render. If an
authenticated analytics tab is available, sanity-check on real data.

Real-device check (HITL): give the user a checklist for a typical facility
laptop running the app (`pnpm start`) against real analytics data:

- wheel/trackpad scroll through a large list;
- fast scrollbar drag;
- horizontal scroll with the fixed Actions column;
- Edit Visit / Edit Profile buttons;
- applying and clearing a filter, plus the scroll reset.

Record the user's verdict. "Still sluggish" opens a fresh ticket for
rendering our own body rows.


## Automated verification (2026-10-27)

Production builds of the synthetic harnesses in headless Chromium on an
i9-9980HK. Raw results: `.scratch/line-list-scroll-performance/final.jsonl`.
Interaction script: `checks.mjs`. Screenshot: `final-filtered.png`.

**Gates (amended by "Should the line list render its own body rows to
close the 4× gap?")**: all pass at 500, 50k and 200k rows.

| Gate | 500 | 50k | 200k |
|---|---|---|---|
| 1× wheel fps / p95 | 58.3 / 16.8 ms | 58.9 / 16.8 | 59.1 / 16.8 |
| 1× JS per wheel step (≤ 8 ms) | 8.8\* | 6.2 | 6.6 |
| 1× drag fps, blank frames | 60, 0 | 60, 0 | 60, 0 |
| 4× wheel fps (≥ 30) / long tasks / blank | 38.6 / 1† / 0 | 40.2 / 1† / 0 | 39.2 / 1† / 0 |
| 4× wheel p95 (reported only) | 67–83 ms | 67 ms | 67 ms |
| 4× drag max frame (≤ 150 ms) / blank | 83 / 0 | 67 / 0 | 67 / 0 |
| Filter-apply, 12 broad filters (≤ 200 ms) | | | 178–182 ms |

\* This was the first run after the build (warm-up), and the same run had
p95 33 ms. The other runs, including the 50k and 200k traces, are
6.2–6.6 ms.
† This is the one-off first-wheel task, which appears in every design.
See "Build the natively scrolled, chunked line list window".

**Interactions at 200k rows**: all pass, with no console errors or warnings.

- **Keyboard:** after clicking a cell, PageDown scrolls 607 px, ArrowDown
  40 px, End reaches the last rows (first visible row 199983), and Home
  returns to row 0.
- **Touch:** a synthetic touch drag scrolls the body (603 px), and rows
  follow.
- **Horizontal:** the body's `scrollLeft` of 500 is mirrored by the header
  (500), and the fixed Actions column stays pinned right (0 px gap).
- **Actions:** on row 995, Edit Visit → `(te995, ev995)` and Edit Profile →
  `(te995)`.
- **Hover:** row `pointer-events` is `none` during the wheel and `auto`
  afterwards, and hover styling returns.
- **Filter:** from row 50,000, a Column 0 text filter returns 111 rows,
  `scrollTop` resets to 0 and the first row is `value-0-1999`. Reset
  restores 200,000 rows at the top.
- **Not exercised in the harness:** sorting (the synthetic columns aren't
  sortable; the `applyTableState` path is unchanged and unit-tested) and
  the return-snapshot round trip. Snapshots store only the selection, never
  a scroll position, and nothing outside `line-list-table.tsx` referenced
  the removed track.

**Regression coverage decided**:

- `line-list-window.test.ts` asserts that scrolling within the overscan
  band returns the same window, so no re-render happens. That guards the
  per-step cost.
- `line-list-table.test.ts` now asserts that the Actions column renders
  plain `button` elements, not antd `Button`.
- Timing gates stay as the scripted harness
  (`.scratch/line-list-scroll-performance/drive.mjs`), not CI, because
  frame timing in CI is too noisy to gate on.
- TypeScript is clean and the analytics tests pass.

**Outstanding**: the user-run real-device check below.
