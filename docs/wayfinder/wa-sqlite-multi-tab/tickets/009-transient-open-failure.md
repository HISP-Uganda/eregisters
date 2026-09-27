---
title: Why does the first SQLite open sometimes fail on a reload, and should it trigger a full store copy?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

Seen twice on the production build: on a same-tab navigation/reload
(and once on a fresh install), the storage boot's first
`createWaSqliteDriver` failed, but the reverse-copy probe seconds later
opened SQLite fine. On `auto` that one transient failure caused a Dexie
fallback **plus a full SQLite → Dexie store copy** (SQLite emptied), and
the next boot a full copy back — heavy churn on an ordinary reload, and
an empty screen if it happens offline before the copy. A fresh tab
(previous page's Worker gone) didn't fail. Hypothesis: the previous
page's wa-sqlite Worker still holds OPFS access handles when the new
page opens the file.

1. Reproduce and pin the cause (capture the real open error — `auto`
   swallows it; time the old Worker's teardown).
2. Decide the fix: retry the open with a short backoff before falling
   back? close the driver on `pagehide`/`beforeunload`? treat a failure
   right after a navigation as transient (no permanent
   `opfsInitFailed`)? and should a reverse copy ever run on a device
   whose SQLite merely failed to open once (vs. an admin switching to
   Dexie)?
