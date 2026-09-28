---
title: Should each device report its storage backend to the server?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

Dexie survives only as the fallback where OPFS fails ("Is the Dexie
storage backend still needed?"); removing it as a live store (require
OPFS, show "browser not supported") would delete most of `src/db/dexie/`
and the boot machine's fallback — but nothing tells us whether any
production device runs on Dexie. Decide whether each device reports its
backend (and whether it ever fell back) to the DHIS2 server — e.g. a
small dataStore entry per device written during sync, listed on an admin
page — what exactly is sent (no personal data), and the threshold for
then removing Dexie as a live store.
