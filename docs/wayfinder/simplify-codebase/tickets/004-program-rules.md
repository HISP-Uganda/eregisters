---
title: How should executeProgramRules be made smaller and safe to change?
type: wayfinder:grilling
status: open
assignee:
blocked_by: [003-split-utils]
---

## Question

`executeProgramRules` (`src/program-rules/execute-program-rules.ts`) is one 773-line function and has **no
tests**. Decide how to pin its current behaviour first (characterization
tests from real program rules/metadata), then how it breaks up (per rule
action type? condition evaluation vs. effects?), and what the form
machines' contract with it stays.
