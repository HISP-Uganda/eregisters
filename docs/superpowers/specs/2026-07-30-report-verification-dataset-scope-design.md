# Report verification: dataset-scoped, revocable

## Context

Today, HMIS report verification appears to be per-user: when user A marks a report verified, user B (fully online, same org unit/period/dataset) opens the same report and still sees the "Mark Report as Verified" button. There is also no way to un-verify a report.

The verify path already writes to DHIS2's `completeDataSetRegistrations` — which is inherently dataset-scoped (one row per `dataSet × period × orgUnit × attributeOptionCombo`). The per-user behaviour is a client-side bug: the loader falls back to `combineIsVerified(local, server) = local || server`, so the flag only "sticks" for the browser that wrote it. Any other browser sees whatever the server returned — and if the server read has any glitch it silently defaults to unverified.

We want:

1. All users see the same verified state (native DHIS2 completion is the single source of truth).
2. Any user with report access can revoke the verification.
3. Existing offline / queued-verify behaviour is preserved and extended to queued-revoke.

Approach: stay on DHIS2's native `completeDataSetRegistrations` mechanism. Fix the read/write so it is trusted as the truth, add a Revoke button that DELETEs the completion, and generalise the local pending-write flag to cover either direction.

## Design

### 1. Verified state comes from the server only

- Delete `combineIsVerified` (`src/db/hmis-drafts.ts`). The loader in `src/routes/reports.data-set.tsx` returns `isVerified` equal to whatever `fetchServerVerified` returned (default `false` when unknown/absent).
- Local `hmisDrafts.isVerified` is no longer read for display; it lives on only as part of the offline queue (see §3) and is removed from the render path.
- The loader also exposes `verifiedAt` / `verifiedBy` returned by DHIS2 so the header can attribute the action (e.g. "Verified by Jane on 2026-07-28"). Reading these requires including `storedBy` and `date` in the existing `completeDataSetRegistrations` GET.

### 2. Revoke action

- `HmisForm` header gets a second button when `isVerified === true` and the form is not read-only: **"Revoke verification"** (danger, wrapped in `Popconfirm` — "This will mark the report as unverified for everyone. Continue?").
- New prop `onRevoke?: () => Promise<void>` on `HmisForm`; wired in `reports.data-set.tsx`.
- Handler calls DHIS2 `DELETE completeDataSetRegistrations` with the same key params used by the verify POST (`dataSet`, `period`, `organisationUnit`, `attributeOptionCombo`). Standardise on the params shape the app already uses; if only the bulk POST endpoint is available, POST `{ completed: false }` for the same key. Then:
  - Update local draft: `isVerified=false`, `verifiedAt=undefined`, `pendingVerificationAction=null`, `syncStatus='synced'`.
  - `router.invalidate()` so every subsequent read on any browser reflects the new state.
  - On failure: set `pendingVerificationAction='revoke'`, `syncStatus='pending'`; success toast becomes "Revocation queued — will sync when online."

### 3. Offline queue — one column, two directions

- Add `pendingVerificationAction: 'verify' | 'revoke' | null` to `HmisDraft` (unindexed → no Dexie schema bump required on existing installs; add to the schema string only if we want indexed lookups later).
- Remove the implicit meaning where `isVerified=true` + `syncStatus='pending'` used to mean "verify pending".
- Sync tick (existing HMIS draft sync path) reads `pendingVerificationAction`, replays the corresponding request, and clears the column on success. Ordering is not required because there is at most one pending action per draft — a fresh action overwrites the previous pending one.

### 4. UI states — header button

| Server state | Pending action | Buttons shown |
|--|--|--|
| unverified | none | **Mark Report as Verified** |
| unverified | `verify` | **Verification queued (retry)** |
| verified | none | **Verified** (green pill, non-interactive) + **Revoke verification** (danger) |
| verified | `revoke` | **Revocation queued (retry)** |

`verifiedAt` / `verifiedBy` render as a subtitle beside the badge when known.

### 5. Files touched

- `src/routes/reports.data-set.tsx` — loader returns server-only `isVerified` + `verifiedAt` + `verifiedBy`; new `onRevoke` handler; drop use of `combineIsVerified`.
- `src/components/HmisForm.tsx` — new `onRevoke` prop and Revoke button + Popconfirm; render subtitle.
- `src/db/hmis-drafts.ts` — add `pendingVerificationAction`; remove `combineIsVerified`; adjust existing helpers/tests.
- `src/db/hmis-drafts.test.ts` — cover the new column and the "revoke overwrites pending verify" case.
- `src/db/index.ts` — no schema bump needed (column is unindexed); if we choose to index it later, bump `.version()` accordingly.

### 6. Verification (how we test it end-to-end)

1. Two-browser check: user A verifies → user B refreshes → sees Verified + Revoke. User B revokes → user A refreshes → sees Unverified.
2. Airplane-mode: verify online → success. Go offline → revoke → "Revocation queued". Go back online → a single DELETE fires → server ends in unverified state.
3. Existing `pnpm test:vitest` must stay green; add coverage for `pendingVerificationAction` semantics.
4. Manual: after revoke, DHIS2's built-in Data Completeness report reflects the removal.

## Out of scope

- Role-based restriction on who can revoke (any user with report access can revoke — matches product decision).
- Audit trail beyond DHIS2's built-in `storedBy` / `date` on the current completion.
- Changing how draft values (as opposed to verification state) are stored or reconciled.
