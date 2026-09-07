---
title: Build Pipeline - Bundling op-sqlite Web Worker + WASM Assets
type: wayfinder:research
status: open
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
