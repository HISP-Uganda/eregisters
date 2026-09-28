## Findings

**op-sqlite itself.** `@op-engineering/op-sqlite` (pinned `^18.2.0` in
`package.json`, wrapped by `src/db/sqlite/op-sqlite-driver.ts` and
`src/db/sqlite/instance.ts`) exposes no capability-detection API for its
web/OPFS backend. Its docs state only that `open()` "intentionally throws"
on web and that `openAsync()` must be used instead — there is no
`isSupported()`/`canOpen()` equivalent, and no documented distinction
between an error meaning "this platform can't do OPFS" versus "this attempt
failed transiently." `createOpSqliteDriver` (op-sqlite-driver.ts:71-74)
just calls `openAsync({ name })` and lets whatever it throws propagate —
today's `App.tsx` `.catch()` (lines 86-90) treats every rejection
identically, including COOP/COEP misconfiguration (a real per-deployment
failure mode this app already worries about, per the comment at
App.tsx:59-67) and an unsupported browser.

**OPFS platform support, general.** Baseline availability is Chrome 102+,
Firefox 111+, Safari 15.4+/16.4+ (`createSyncAccessHandle` landed at 15.2,
but WASM-VFS implementations built on it are commonly gated to 16.4+/17+
due to a sub-worker storage bug Apple never backported a fix for below
17). This app's realistic device mix — desktop Chrome/Edge and Android
tablets — sits comfortably inside that support window; Safari's caveats
matter far less here than for a general-audience PWA.

The caveats that do apply even on "supported" browsers are **not**
detectable by a static feature check:
- **Safari private browsing** disables OPFS outright and throws
  `NotAllowedError` from `createSyncAccessHandle`/`getDirectory` — but
  `navigator.storage.getDirectory` itself may still resolve; the failure
  only surfaces on the first real write attempt.
- **Incognito/private-mode quota caps** (e.g. Chrome incognito's ~100MB
  ceiling) produce `QuotaExceededError` only once the app has been running
  and writing for a while — never at init.
- **Multi-tab access-handle conflicts**: OPFS access handles are
  exclusive per file, so a second tab opening the same database throws —
  this app already has a dedicated mitigation (`single-tab-lock.ts`) and
  is a *usage* failure, not a support failure.
- **Cross-origin isolation (COOP/COEP)**: required for this app's SQLite
  backend and is a *deployment* concern, not a browser-capability one —
  `navigator.storage.getDirectory` existing says nothing about whether
  this specific hosting actually sends the right headers.

In short: `navigator.storage.getDirectory` presence is a fast, cheap,
real signal but strictly a lower bound — it answers "does the browser
ship the API" only, and every failure mode this codebase actually cares
about (COOP/COEP misconfig, private-mode `NotAllowedError`, quota,
multi-tab conflict) only manifests once `openAsync` is actually attempted.

## Recommendation: hybrid, weighted toward init-failure-catch

1. **Cheap static pre-check first**: `typeof navigator.storage?.getDirectory === "function"`.
   If absent, skip straight to Dexie — this is the one case a probe
   *can* fully resolve (ancient browser, no OPFS at all) and it costs
   nothing.
2. **Otherwise, still attempt `initSqlDriver`** (today's behavior)
   and catch failure — the probe cannot distinguish COOP/COEP
   misconfiguration, Safari private-mode, or quota exhaustion from
   success, so skipping the real init on the strength of the probe alone
   would misclassify all of those as "OPFS works here."
3. **Cache the negative result** (e.g. in `localStorage`, keyed by
   `userInfo.id` the way `App.tsx` already keys the sync provider) after
   a real init failure, so a device that fails once doesn't pay the
   failed-init latency on every cold start — but do *not* cache it
   permanently without an expiry/version bump, since a COOP/COEP fix on
   the server side should let a previously-failing device recover.
4. Do not try to classify op-sqlite's thrown errors by type/message today
   — none are documented as stable, so any "unsupported vs transient"
   branching would be guessing at private API shape. Treat every
   `initSqlDriver` rejection the same (fall back to Dexie), which is what
   `App.tsx` already does.

Gist for the map: no op-sqlite capability API exists; only a
presence-of-API pre-check is reliably static, so real init-and-catch stays
load-bearing — add the cheap pre-check as a fast-fail short-circuit, and
cache failures locally to avoid repeat cost, rather than trying to
classify errors.
