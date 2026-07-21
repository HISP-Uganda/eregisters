# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

A DHIS2 web app (DHIS2 Application Platform) — an offline-first Progressive Web App used as an electronic Medical eRegistry for Uganda's Ministry of Health. It works against a running DHIS2 instance (dev proxy points at `https://customization.health.go.ug/eregistry`) and pushes/pulls tracker data (tracked entities, enrollments, events) plus aggregate HMIS report data (dataValueSets).

## Package manager

`pnpm@10.13.1` (declared in `package.json`; a `pnpm-workspace.yaml` exists but this is a single-package repo). Do not use `npm install` or `yarn install` — they'll produce a divergent lockfile.

## Commands

- `pnpm start` — dev server on http://localhost:3000, proxied against the DHIS2 server declared in `package.json`.
- `pnpm build` — production build via `d2-app-scripts`; runs `scripts/patch-sw.js` in `postbuild` to patch the generated service worker.
- `pnpm deploy` — deploys `build/bundle` to a DHIS2 instance (prompts for URL/creds).
- `pnpm test` — DHIS2 platform test runner (Jest under the hood).
- `pnpm test:vitest` — the Vitest suite (`vitest run`). This is what actually runs the tests in `src/**/*.test.ts` (see `vitest.config.ts`). Config-only assertions live here — e.g. `src/form-configs/no-duplicate-headers.test.ts`.
- Run a single Vitest test: `pnpm exec vitest run src/form-configs/no-duplicate-headers.test.ts` (add `-t "<name>"` to filter by test name).

There is no lint/format script configured. TypeScript is checked implicitly by the build; `tsconfig.json` has `noEmit: true` and `strictNullChecks: true` but not full `strict`.

## Architecture

### DHIS2 platform + PWA

Bootstrapped by `@dhis2/cli-app-scripts` (see `d2.config.js`). PWA is enabled — `scripts/patch-sw.js` post-processes `build/app/service-worker.js` to (1) call `clients.claim()` so `controllerchange` fires after an SW update, and (2) fix the navigation handler to fetch a fresh `index.html` from the network. Without those patches PWA users get a white screen after updates. Do not remove that step.

### App entry & user shell

`src/App.tsx` bootstraps: fetches `me` via `useDataQuery`, wraps everything in an antd `ConfigProvider` and the XState `SyncContext.Provider`, then renders `RouterProvider` from TanStack Router. The provider is keyed on `${userInfo.id}${orgUnit.id}` so switching org unit fully resets the sync machine.

### Routing

TanStack Router with **hash history** (`createHashHistory()` in `src/router.tsx`) — required because DHIS2 serves the app under a hashed subpath. Routes are hand-declared (not file-based): each file in `src/routes/` exports a `createRoute` object and they are wired together in `router.tsx`. `RootRoute`'s loader `waitFor`s the sync machine to reach `metadataSync.waiting` before children render, so route components can assume metadata is loaded.

### State: XState v5 machines

`src/machines/` — all long-lived state lives in state machines exposed as React contexts (`createActorContext` from `@xstate/react`).

- `sync.ts` (~1.7k lines) is the top-level machine — parallel states covering `metadataSync`, `dataPull`, `dataSync` (push), plus caches for metadata (`context.metadata`), user info, last-sync timestamps, and pull versions. **Almost every "does the app know X yet?" question is answered by `SyncContext.useSelector(...)`.** Access metadata through `hooks/useMetadata.ts` rather than reaching into the machine directly.
- `enrollment-form.ts`, `event-form.ts`, `tracked-entity-form.ts` — per-form machines that own form data, program-rule evaluation (`executeProgramRules` from `utils/utils.ts`), errors, and persistence.
- `sync-metadata-mode.ts` — small helpers (`shouldUseLastUpdatedFilter`, `isDataPullLoading`, etc.) that gate sync behavior. Prefer these over ad-hoc booleans.

### Data layer: Dexie + TanStack DB

Two IndexedDB databases:

1. `MOHRegisterDB` (`src/db/index.ts`) — reference/metadata tables: programs, dataElements, optionSets, programRules, orgUnits, dataSets, categoryOptionCombos, sync state, UI config, etc. Schema versioning is via Dexie `.version(N).stores({...})`.
2. Per-collection Dexie stores wrapped as **TanStack DB collections** via `tanstack-dexie-db-collection` — `trackedEntities`, `enrollments`, `events`, `rule-results` (see `src/collections/`). Components query these reactively with `useLiveSuspenseQuery` from `@tanstack/react-db`. Each collection has a Zod schema (`FlattenedTrackedEntitySchema` etc. in `src/schemas.ts`) that is also the source of truth for its TypeScript type.

`syncStatus` on every collection row is one of `draft | pending | syncing | synced | failed | deleted | editing`. The sync machine reads pending/deleted rows, transforms them via `src/db/transformers.ts` into DHIS2 API payloads, POSTs them, and merges the response via `src/db/merge-utils.ts`.

### Schemas

`src/schemas.ts` (~800 lines) is the single source of truth for domain types. Prefer inferring types from Zod schemas over redefining shapes. Types with `Flattened*` prefixes are the local (denormalized) shape stored in Dexie; unprefixed ones (`TrackedEntity`, `Enrollment`, `Event`) are the DHIS2 API shape.

### HMIS forms (aggregate reports)

`src/components/HmisForm.tsx` is a generic renderer for aggregate data-entry forms. Each specific form (`Hmis10501`, `Hmis1050203`, …) is a thin wrapper that (a) imports its layout from `src/form-configs/<name>.config.ts` and (b) passes it to `HmisForm`. The form-config format is defined in `src/form-configs/types.ts` (`HmisFormConfig` → tabs → sections → rows → cells). Configs are auto-generated from DHIS2 custom-form HTML — the comment at the top of each config file says so — so hand-edits should be limited.

Regression guard: `src/form-configs/no-duplicate-headers.test.ts` asserts that no row in any config duplicates its section title (because `HmisForm` renders `section.title` as its own row and would double up). If you add a new HMIS form config, add it to that test file's `modules` map.

### UI

antd v6 with a global `ConfigProvider` theme override in `App.tsx`. Icons from `@ant-design/icons`. Dates/periods via `dayjs`. Do not add other UI libraries.

## Working style

- Sync is subtle. When touching `src/machines/sync.ts`, don't refactor away helpers in `sync-metadata-mode.ts` — they encode which pull mode uses `lastUpdated` filters vs full pulls, which push mode records timestamps, etc.
- The service-worker patch (`scripts/patch-sw.js`) is load-bearing for the PWA update path. If you change build tooling, verify a full build cycle produces the two sentinels (`__patch_claim_clients__`, `__patch_navigation__` if present) in `build/app/service-worker.js`.
- `docs/xstate-phase{1,2,3}-complete.md` document the historical migration of sync/form state into XState — useful background if you are refactoring machines, otherwise ignore.
