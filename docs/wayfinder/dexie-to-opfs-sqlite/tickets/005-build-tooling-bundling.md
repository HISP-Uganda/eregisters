---
title: Build Pipeline - Bundling op-sqlite Web Worker + WASM Assets
type: wayfinder:research
status: closed
assignee: null
blocked_by: []
research_branch: research/build-tooling-opfs-bundling
---

## Question

`@op-engineering/op-sqlite`'s web backend spins up a dedicated Web Worker
(`opsqlite-web.worker`) wrapping `@sqlite.org/sqlite-wasm`. This project
builds via `@dhis2/cli-app-scripts` (`d2-app-scripts`), configured through
`viteConfigExtensions.mts` (already sets COOP/COEP for dev server + preview,
and excludes both packages from `optimizeDeps`).

Research and confirm, for both `pnpm start` (dev) and `pnpm build`
(production):
- Does the worker file get discovered/bundled correctly via
  `new Worker(new URL(...))` static analysis under d2-app-scripts' actual
  bundler (confirm whether it's Vite or webpack under the hood for this
  `@dhis2/cli-app-scripts` version — `viteConfigExtensions.mts`'s existence
  suggests Vite, but verify)?
- Does the `sqlite3.wasm` binary get copied as a static asset correctly,
  and served with the right MIME type?
- Does this need to coexist with `scripts/patch-sw.js`'s postbuild service
  worker patching, or with a new COOP/COEP-injecting SW from ticket
  "Prototype COOP/COEP Service-Worker Header Injection" — i.e., do the
  worker/wasm asset paths need to be stable/known ahead of time for the SW
  to correctly cache/serve them offline (this app is offline-first)?
- Any `pnpm test:vitest` (Vitest) implications — can worker/wasm-dependent
  code even be unit-tested in jsdom, or does it need to be excluded/mocked?

Resolve via a `/research` subagent; capture findings on branch
`research/build-tooling-opfs-bundling`.

## Resolution

Full findings: `research/005-findings.md` (merged from
`research/build-tooling-opfs-bundling`).

Confirmed `d2-app-scripts@12.11.4` builds the app itself via real Vite (both
`start` and `build` dynamically `import('vite')` and load
`viteConfigExtensions.mts`); webpack is scoped entirely to compiling the
separate service-worker IIFE bundle. op-sqlite's `new Worker(new URL(...))`
pattern and `@sqlite.org/sqlite-wasm`'s `import.meta.url`-based wasm
resolution are exactly what Vite statically discovers and content-hashes —
no extra bundler config needed beyond the `optimizeDeps.exclude` already in
`viteConfigExtensions.mts:14`. No conflict with `scripts/patch-sw.js`:
`injectPrecacheManifest` globs the whole built output *after* Vite finishes,
so hashed worker/wasm files are swept into the precache manifest
automatically; `patch-sw.js`'s two existing patches touch unrelated
activate/fetch logic on the same file. One caveat: precache has a 3MB
per-file cap — check `sqlite3.wasm`'s built size against it once wired in.

Vitest (`environment: "node"`) cannot exercise worker/OPFS code at all —
that logic needs mocking at the `openAsync()`/driver boundary (consistent
with this repo's existing config-only Vitest pattern) or a real-browser tool
(Playwright) for anything beyond that, which is out of scope for this
ticket (see ticket 007, testing strategy).

Follow-on surfaced: a note added to ticket 001 (the COOP/COEP prototype's
header-injection patch should be implemented as a third idempotent,
sentinel-guarded patch alongside `scripts/patch-sw.js`'s existing two).
