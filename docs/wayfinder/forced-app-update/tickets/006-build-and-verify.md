---
title: Build the forced update and verify it against a stand-in server
type: wayfinder:task
status: open
assignee:
blocked_by: [001-platform-update-prompt, 002-sync-vs-reload, 003-unsaved-changes, 004-tab-coordination, 005-broadcast-freshness]
---

## Question

Implement the decisions above (periodic and focus/online update checks,
the blocking popup with grace period, sync-safe and dirty-form-safe
reload, tab coordination, the broadcast path), with tests, then verify on
a stand-in server by swapping builds with tabs open: an idle tab, a tab
mid-form, a tab mid-pull, two tabs, and the admin broadcast.
