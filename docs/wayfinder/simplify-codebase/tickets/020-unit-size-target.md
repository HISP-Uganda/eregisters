---
title: What should the function-size target be?
type: wayfinder:grilling
status: open
assignee:
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
