---
title: Which scroll mechanism should the line list use?
type: wayfinder:grilling
status: closed
assignee: claude
blocked_by: [001, 002]
---

## Question

Given where the per-frame cost goes ([Where does each scroll frame's time
go in the current line list?](001-profile-scroll.md)) and what antd's
virtual Table costs ([Can antd's built-in virtual Table serve the committed
result at 200,000 rows?](002-antd-virtual-feasibility.md)): switch to
antd's default `virtual` scrolling over the committed result, or keep the
custom window and make each step cheap (stable columns, memoized rows,
larger overscan, rAF-throttled `scrollTop`, render-row reuse)? Decide the
mechanism, what is traded off (e.g. full-array handoff on filter change),
and the acceptance numbers the build must hit.

The research found antd's virtual mode needs a `pnpm patch` of
`@rc-component/virtual-list` to hit 60 fps at 200k rows; whether patching
an installed package is acceptable is part of this decision.

## Resolution

Decided 2026-10-27 with the user (all recommendations accepted).

1. **Mechanism: keep our own window and scroll it natively.** Remove the
   separate 16 px scroll track and our wheel/touch/key handlers. Let
   `.ant-table-body` scroll natively on both axes, with a custom
   `components.body.wrapper` that renders spacer `<tr>`s above and below the
   rendered window (`start × 40 px` and `(count − end) × 40 px`, fixed 40 px
   rows, `nowrap` kept). This gives pixel-smooth compositor scrolling and
   removes the whole-row jumps, the 80 px dead zone and the passive-wheel
   `preventDefault`. antd `virtual` with a `pnpm patch` of
   `@rc-component/virtual-list` is **rejected**: the patch would need
   maintaining across upgrades, `scroll.x` would have to be a number, and
   horizontal scrolling would re-render rows. Just making each step cheaper
   on the current track is rejected because it keeps the row jumps.
2. **Chunked re-windowing.** Render about 10 overscan rows at each edge and
   re-window only once scrolling passes about 5 of them, so React renders
   roughly every 200 px instead of every wheel step. Tune the overscan size
   against the profile.
3. **A lighter Actions column.** Replace the two antd `Button`s per row with
   plain `<button>`s that look the same: antd tokens applied once through a
   class, same "Edit Visit" / "Edit Profile" labels, focus and click. No
   Wave, motion or loading machinery. A row "⋯" menu was rejected because
   it changes the workflow.
4. **Acceptance numbers.** At 200k rows × 12 columns + Actions, in the
   synthetic harness on a production build:
   - **Unthrottled:** mean main-thread time per wheel step ≤ 8 ms, and
     wheel scrolling at 60 fps.
   - **At 4× CPU:** no long tasks > 50 ms during wheel scrolling, frame
     p95 ≤ 33 ms, and zero blank-row frames during wheel scrolling.
   - **Fast end-to-end drag at 4×:** a brief blank area is allowed, but no
     frame may exceed 100 ms.
   - **Filter-apply** stays ≤ 200 ms.

   The destination is amended to "60 fps at 1×, ≥ 30 fps with no long tasks
   at 4×". 60 fps at 4× would likely require leaving antd's table body.

Implied, no separate decision needed: build columns once and memoize them,
including the Actions column, so header filter UI doesn't re-render on
scroll; reset `scrollTop` to 0 on a new result generation.
