---
title: What should happen to local data when a different DHIS2 user signs in on the same device?
type: wayfinder:grilling
status: open
assignee:
blocked_by: []
---

## Question

Every local store has a fixed name — SQLite `eregisters-metadata` (OPFS),
Dexie `MOHRegisterDB` and the tracker collection stores — shared by
every DHIS2 user of one browser profile, and no app code runs on sign-out
or a user switch (`App.tsx` only re-keys the sync machine on
`userInfo.id` + org unit; the data stays). The pull checkpoint is scoped
to program + org unit (`pullScopeKey`), not user. So on a **shared
facility device**, user B signing in after user A:

- sees and edits A's local tracked entities, enrollments and events;
- trusts A's checkpoint when both work in the same org unit;
- **pushes A's still-pending rows under B's DHIS2 session** (server-side
  audit attributes them to B), or, for a B in another org unit, keeps A's
  rows locally while pulling B's scope.

Decide which of these is intended — a shared facility register may be
exactly what staff want — and, for what isn't:

- scope stores per user (database name keyed on user, or on server +
  user as mohw-nas did), per org unit, or not at all;
- what happens to another user's **unsynced** rows at a switch (block
  sign-in / push first / keep them aside for their owner / discard never);
- whether HMIS drafts (`MOHRegisterDB`) follow the same rule;
- migration for devices that already hold one shared store;
- how it's verified (two real DHIS2 users on one browser profile).

Graduated from this map's "Not yet specified" (workspace/user scoping in
file naming), sharpened by the shared-device case.
