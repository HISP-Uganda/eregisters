---
title: Should each device report its storage backend to the server?
type: wayfinder:grilling
status: closed
assignee: claude-session
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

## Resolution

Ruled **out of scope** for this map (2026-09-28; the user took the
recommendation). Reporting each device's backend is a new feature — a
device id, a dataStore write during sync, an admin view — and the map's
Notes put new features out of bounds. The destination only needs every
removal candidate decided, and Dexie's is: it stays as the fallback where
OPFS fails ("Is the Dexie storage backend still needed?").

If picked up as a separate effort, the sketch discussed: one entry per
device in a `eregisters-devices` dataStore namespace (random device id
from localStorage; backend, fallback reason, app version, browser family,
facility org unit, last-seen server date — no user or record data),
written at most daily after a metadata sync; an App Settings "Devices"
card; remove Dexie as a live store only after 30 days of the reporting
release with no device reporting Dexie.
