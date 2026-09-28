---
title: Should records created on the device record their author, and how is it sent to DHIS2?
type: wayfinder:grilling
status: closed
assignee: claude-session
blocked_by: [011-dhis2-author-fields]
---

## Question

Records created or edited on the device carry no author today:
`createdBy` / `updatedBy` (`UserSchema`, `src/schemas.ts`) are only
filled from server pulls, and the push payloads send no `storedBy`. Since
"What should happen to local data when a different DHIS2 user signs in
on the same device?", same-facility users share one store, so a
colleague's unsent records are pushed under whoever is signed in — and
DHIS2 attributes them to that person.

Decide, using "Which author fields does DHIS2 2.42's tracker importer
take from the payload?":

- whether to record the local author at all, and what (user UID,
  username, the full `{uid, username, firstName, surname}`), on create
  only or on every edit;
- which payload fields carry it to DHIS2 (only those the importer
  honours), and what the app shows locally before a push;
- what happens for records created before this change (no author);
- whether a record authored by another user should be pushed silently,
  flagged, or held back — and whether that changes anything decided in
  the shared-device ticket;
- tests, and verification against the real server (read back what DHIS2
  stored).

> From the research: only `storedBy` (and the client timestamps) can
> carry a device-side author, and **only on 2.42.0–2.42.5.x, on create**;
> 2.42.6+ ignores it. Every `createdBy`/`updatedBy`/change-log author is
> the session user regardless. First confirm each server's patch release
> (`GET /api/system/info`, read-only) — the eRegistry build looks like
> 2.42.5.1 (`2.42.5.1-ug-ereg-custom`).

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Server facts: `eregisters.health.go.ug` runs **2.42.5.1** (`5239d23`, the
`2.42.5.1-ug-ereg-custom` build) — keeps a payload `storedBy` on create;
the test server `customization.health.go.ug/eregistry` runs
**2.43.2-SNAPSHOT** (`a7dedd0`).

1. **Recorded locally** (Q1): `src/db/local-author.ts` holds the signed-in
   user (set from `me` in `App.tsx`; signing in reloads the page). The
   three factories (`createEmpty*`) set `createdBy` / `updatedBy`; a
   user's edit (`collection.update` → `onUpdate`, both backends via a
   `stampEdit` option) sets `updatedBy` and `updatedAt`. Pulls and push
   bookkeeping don't go through `onUpdate`, so they never stamp. Same
   `UserSchema` shape as pulled records.
2. **Sent** (Q2 (a)+(c)), `authorFields` in `transformers.ts`: `storedBy`
   = the local author's username (omitted when unknown), and
   `createdAtClient` / `updatedAtClient` = the record's own times (the
   importer nulls them when left out — which it did before). Not
   attribute-level `storedBy`.
3. **Older records** (Q3): no author → no `storedBy`, never guessed.
4. **Another user's record** (Q4): pushed quietly with its real author.
5. **Verification** (Q5, the user chose the test server + the source
   research): unit tests — factories with/without an author, payload
   fields, an edit stamped but a pull not (SQLite, real adapter), the
   Dexie `onUpdate` wrapper (stubbed package); full suite 67 files / 505.
   On the 2.43 test server the user's own maternity/newborn records (2
   tracked entities, 2 enrollments, 4 events created with this code) were
   pushed and read back: imports accepted, `createdAtClient` = the
   device's creation time, `updatedAtClient` = the last local edit,
   `storedBy` = `hisp.colupot` on enrollments/events (author and session
   user are the same person here, so this can't show which one the server
   used — production's behaviour rests on the 2.42.5.1 source cited by the
   research). Tracked entities returned no `storedBy` on 2.43 — noted,
   not investigated.

Found while verifying, fixed separately (`a3ae5d6`): the maternity
"Live birth" popup failed with "begin requested while a transaction is
already open" — the driver let two transactions share a tab's one
connection; it now runs them one at a time.
