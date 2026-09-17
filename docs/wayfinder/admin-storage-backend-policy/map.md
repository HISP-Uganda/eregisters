---
label: wayfinder:map
tracker: local-markdown
---

# Centrally admin-controlled device storage configuration

## Destination

Replace the per-device, self-service storage backend setting (wayfinder
ticket "Per-device backend setting - UI placement and states",
`docs/wayfinder/opfs-dexie-dual-backend/tickets/004-settings-ui-placement.md`,
built as `src/components/device-storage-settings.tsx`) with a single,
global, admin-controlled policy — an org admin, not each individual field
worker, decides whether devices use Auto/Force SQLite/Force IndexedDB.
Done means: the per-device Drawer is gone, an admin can set the policy in
`admin.app-settings.tsx`, and it reaches already-running devices via the
same reload-banner mechanism this app already uses for app/metadata
updates.

## Notes

- This map's charting session surfaced no fog — every decision resolved
  in one grilling session with no research or prototyping needed, no
  child tickets created. It's recorded here as a decision log, not a
  live map with open tickets, per this session's convention of recording
  design decisions made outside a formal ticket.
- Domain: `src/routes/admin.app-settings.tsx`, `src/components/device-storage-settings.tsx`
  (removed by this effort), `src/db/backend.ts` (`getBackendSetting`/`setBackendSetting`,
  unchanged — only *who writes* the cached value changes), `src/schemas.ts`'s
  `UIConfig` type, `src/routes/__root.tsx`'s `reloadSignal` banner pattern.
- Directly tensions with ticket 004's original reasoning (per-device
  override exists because OPFS capability is a hardware/browser fact a
  field worker needs to fix without an admin intermediary) — deliberately
  overridden here: full replacement was chosen knowing a broken-OPFS
  device with no admin override becomes a real dead end for that user.

## Decisions so far

- **Full replacement, not layered on a per-device override** — the
  per-device Drawer UI is removed entirely. A broken-OPFS device with no
  matching admin override is a real dead end (the user needs to contact
  an admin) — an accepted tradeoff, not an oversight.
- **Policy lives in `dataStore/eregisters`**, the same DHIS2 Data Store
  namespace `admin.app-settings.tsx` already uses for other admin config
  — no new persistence mechanism.
- **Single global value**, not scoped per org-unit/user-group — matches
  what the setting actually represents (an org-wide policy/safety-valve,
  not a per-population preference).
- **No device-level UI at all** (not even read-only) — `device-storage-settings.tsx`
  is deleted outright.
- **First-ever boot (no cached policy yet) falls back to today's local
  auto-detection** (`resolveBackend("auto", ...)`), then fetches and
  caches the real admin policy in the background for every subsequent
  boot to use — avoids blocking a brand-new device's first boot on a
  network call, preserving this app's offline-first premise.
- **Reaches already-running devices via the existing `reloadSignal`/"Reload
  now" banner pattern** (`__root.tsx`) — a new `storageBackendPolicy`
  field rides alongside `reloadSignal` in `UIConfig`
  (`src/schemas.ts`), fetched by the already-backend-agnostic
  `pullUIConfig` sync actor on the normal cycle. `resolveBackend()`
  and `getBackendSetting()`/`setBackendSetting()` (`src/db/backend.ts`)
  are otherwise **unchanged** — the resolved policy value is written into
  the exact same `localStorage` slot bootstrap already reads, so
  bootstrap sequencing doesn't change at all, only who writes that cached
  value (this new background sync, instead of the removed Drawer).
- **No fleet-visibility telemetry** — set-and-forget; the admin sets a
  policy and trusts the sync-and-reload mechanism to apply it. A "which
  backend is each device actually on" report is a real, separate feature
  (would need new per-device reporting infrastructure that doesn't exist
  today) — out of scope here, chart separately if wanted.

## Implementation progress

Built (commit `973a301`, `main`), matching every decision above.
`/code-review`'s spec-axis review confirmed all six decisions hold with
no missing requirements, no scope creep, and no behavioral deviations.
Its standards-axis review caught one real duplication —
`SyncContext.useSelector((a) => a.context.metadataStore)` independently
reached-into from two files — fixed with a new `useMetadataStore()`
hook; also collapsed the resulting triplicated reload-signal
read-and-compare logic in `__root.tsx`'s `checkSignals` into a shared
`isNewSignal` helper.

Also fixed along the way, a real bug this feature depends on:
`dexieMetadataStore.putRow` was missing the `notifyConfigChanged` call
`sqliteMetadataStore`'s equivalent path already had (transitively via
`config-rows.ts`'s `putConfigRow`) — without it, the reload-banner
mechanism's same-tab reactive refresh would have silently never fired
on the Dexie backend. `reactive-config.ts` moved out of `db/sqlite/`
(no SQL dependency) to a backend-neutral location; `useSqliteConfigRow`
(SQL-only, threw on Dexie) replaced by `useConfigRow`.

## Not yet specified

(none — charting surfaced no fog)

## Out of scope

- Fleet-visibility telemetry (admin seeing which backend each device
  actually resolved to) — a separate feature needing new per-device
  reporting infrastructure, not part of this destination.
- OPFS multi-tab/multi-window concurrency — researched in parallel this
  session and found to have no workaround compatible with the current
  `op-sqlite` driver (single-connection-only `opfs-sahpool` VFS); the
  existing single-tab-lock-and-redirect design is the correct fit for
  this driver choice. True multi-tab concurrency would require replacing
  the storage driver entirely — a much larger, separate effort, not
  ticketed.
