---
title: What should the function-size target be?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

The destination asks for "no non-test function or component over ~300
lines" (met: the largest is `buildColumnRegistry`, 268) and "fallow's
`unit_size` penalty well below today's 10.0" (not met). fallow computes
`unit_size = min(functions over 60 LOC per 1,000 functions × 0.5, 10)`
(fallow.tools/docs/explanations/health). Counted 2026-09-28 (babel,
non-blank non-comment lines): **119 of 3,742 functions are over 60
lines — 31.8 per 1,000**; the penalty stays at its 10.0 cap until below
20 per 1,000. **53 of the 119 are tests** (`describe` blocks), so even
with every app function under 60 lines the penalty would be ~7. The 66
app functions include many React components whose layout JSX alone runs
past 60 lines.

Decide the target: keep the ~300-line rule and drop the fallow metric;
exclude tests from health and aim for a number; split the largest
remaining app functions (list in the count); or some mix.

## Resolution

Decided 2026-09-28 (the user took the recommendations):

1. **The map finishes on the ~300-line rule — met** (largest app
   function: `buildColumnRegistry`, 268). fallow's `unit_size` is
   **dropped as a goal** and kept as information only: it counts
   functions over 60 lines, and reaching "well below 10" would mean
   splitting ~40 mostly JSX-heavy components where splitting adds files
   without adding clarity. The screens pattern's ~150 lines per component
   still guides new code; any of the 16 functions over 150 (listed in
   this ticket's question) gets its own ticket if it gets in someone's
   way.
2. **fallow's health config is left alone** — tests stay in; hiding big
   `describe` blocks would only flatter the number.

The map's Destination is updated to match.
