---
title: Where should the app show which version it is running?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Support and testers can't tell which build a device runs (e.g. checking
1.1.7 → 1.1.8 during the forced-update test) without DevTools. The
platform already knows it: `useConfig().appVersion` from
`@dhis2/app-service-config` (filled from `package.json`'s `version` at
build). Decide where it's shown (the DHIS2 header's profile menu is the
platform's, not ours), whether the forced-update banner names the new
version, and whether anything else (build date, storage backend) belongs
next to it.

> Graduated from this map's "Not yet specified".

## Resolution

Grilled 2026-09-28; the user took every recommendation.

1. **Shown next to the "Medical eRegistry" title** in the app's own
   header (`__root.tsx`), as small grey `v1.1.7` (Q1 (a)) — always
   visible, no admin rights needed. The DHIS2 header's profile menu is the
   platform's.
2. **Tooltip** (Q2): version, storage backend (SQLite / IndexedDB) and
   the local store — the facility's own (`getStoreKey()`) or the default
   slot. No build date (the platform doesn't expose one).
3. **The update banner doesn't name the new version** (Q3): the waiting
   worker doesn't carry it; the header shows it after the reload.

Source: `useConfig().appVersion` (`@dhis2/app-service-config`, from
`package.json`'s `version` at build). Typecheck and tests pass; not yet
seen in a browser (the dev app needed a sign-in).
