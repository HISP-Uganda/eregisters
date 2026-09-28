---
title: How should utils.ts be split?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

`src/utils/utils.ts` is 1552 lines with 22 exports, imported by 17
files: program-rule execution, record factories (`createEmpty*`), form
helpers, draft deletion, formatting and more. Decide the modules it
splits into (by topic), what stays shared, and how imports move — a
pure move with no behaviour change.
