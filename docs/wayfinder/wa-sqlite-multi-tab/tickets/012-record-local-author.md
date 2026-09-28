---
title: Should records created on the device record their author, and how is it sent to DHIS2?
type: wayfinder:grilling
status: open
assignee:
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
