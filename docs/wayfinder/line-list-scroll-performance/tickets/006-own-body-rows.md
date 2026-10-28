---
title: Should the line list render its own body rows to close the 4× gap?
type: wayfinder:grilling
status: closed
assignee: claude
blocked_by: [004]
---

## Question

[Build the natively scrolled, chunked line list window](004-build-native-scroll-window.md)
meets the 1× targets. At 4× CPU it misses frame p95 ≤ 33 ms (83–100 ms),
because rc-table re-renders every retained row on each re-window.

The option is to have `SpacedBody` ignore rc-table's row children (keeping
its `MeasureRow`) and render memoized rows itself, keyed by row id, so that
only rows entering the window render. That means re-implementing:

- antd cell classes and fixed-right sticky cells for Actions;
- `dataIndex`/`render` handling;
- hover styling.

What remains to decide:

- Is that maintenance worth it?
- Should the 4× p95 target be relaxed instead, accepting today's
  30–36 fps with no long tasks?
- What would the custom rows have to keep (row hover, a11y, column widths)?

## Resolution

Decided 2026-10-27 with the user (all recommendations accepted).

1. **Don't render our own body rows for now.** Keep rc-table's body and
   relax the 4× target. The accepted 4× bar is **≥ 30 fps, no long tasks
   and no blank rows** during wheel scrolling. Wheel-frame p95 at 4× is
   reported but no longer gates completion. The 1× targets stand: 60 fps,
   p95 ≤ 16.7 ms, JS ≤ 8 ms per step. Reasons: the 4× figure is a synthetic
   headless stand-in, the build already removed most of the reported
   sluggishness (17 → ~35 fps at 4×, pixel-smooth native scroll), and a
   copy of antd's body cells would be a lasting maintenance cost.
2. **The fast drag bar at 4× becomes "max frame ≤ 150 ms, no blank rows"**
   (measured 83–117 ms).
3. **The final verification adds a real-device check:** a HITL checklist
   the user runs on a typical facility laptop with real analytics data.
   If the user judges it still sluggish there, rendering our own rows comes
   back as a fresh ticket. That's the trigger for reopening this decision.
