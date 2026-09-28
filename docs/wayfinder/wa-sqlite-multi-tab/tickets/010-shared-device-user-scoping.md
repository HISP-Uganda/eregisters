---
title: What should happen to local data when a different DHIS2 user signs in on the same device?
type: wayfinder:grilling
status: closed
assignee: claude-session
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

## Resolution

Grilled 2026-09-28; the user took every recommendation.

Facts: the platform's sign-in (`LoginModal`) reloads the page, so a user
switch is always a fresh boot; locally created records carry no author
(`createdBy` only comes from pulls, no `storedBy` is sent); the origin
already separates DHIS2 servers; HMIS draft ids include the org unit;
DHIS2's own access model is per org unit.

1. **The facility owns local data** (Q1 (a)): users of one org unit
   share a store (a shared register, as the server already shows them
   the same records); another org unit's user gets a separate store and
   never sees it. A same-facility colleague's unsent rows are pushed
   under whoever is signed in (no recorded author today anyway).
2. **Store key = the user's org unit** (Q3), `src/db/store-names.ts`:
   `storeName(base)` / `storeFlagKey(base)` suffix every facility store
   (`eregisters-metadata`, the five `MOHRegister_*` Dexie databases) and
   the per-store flags (`sqliteUsed`, `storeCopyFailures`).
3. **Existing devices** (Q4): the unsuffixed names are **slot 0**, owned
   by the first facility — nothing is copied. Its owner is recorded
   (`eregisters.slotZeroOwner`); unrecorded, a checkpoint scoped to
   another org unit proves it's that facility's (record it, reload into
   our own store), else the first facility to boot claims it.
4. **Boot order** (Q5): storage still opens before `me`, for the
   remembered org unit (`eregisters.lastOrgUnit`); if `me` differs it
   saves the new one and reloads; with nothing remembered it waits for
   `me` (`src/facility-store.ts`). The app now requires exactly one org
   unit (a user with none crashed before).
5. **Shared per device** (Q6): HMIS drafts, the backend setting, the
   OPFS failure cache, lock names.
6. **No switch notice** (Q7) — to fog, with recording a local author.
7. Also: a tab that settles on a facility broadcasts it; a tab on
   another facility's store (its session now belongs to another user)
   reloads.

Tests: names/keys/verdicts (`store-names.test.ts`), boot glue
(remembered → early boot; mismatch → reload; none → wait for `me`;
claim; hand-off to the checkpoint's facility; suffixed stores never
questioned), draft ids per facility. Full suite 65 files / 495.

Real browser (dev server → eregisters.health.go.ug, read-only, two real
users on one browser profile): (1) usual user (Test Facility,
`QBzwhBVuYPt`) — slot 0 claimed via its checkpoint scope, data intact
(Total Clients 1); (2) a Kisugu Health Centre III user (`aKmx8C5qUZ8`)
— new `eregisters-metadata-aKmx8C5qUZ8` store, metadata synced, Total
Clients 0, Test Facility's store untouched; (3) back to the usual user —
same store, Total Clients 1, checkpoint and metadata unchanged.
