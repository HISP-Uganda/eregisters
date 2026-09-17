---
label: wayfinder:map
tracker: local-markdown
---

# Replace op-sqlite with wa-sqlite for real multi-tab support

## Destination

Replace `@op-engineering/op-sqlite` (today's SQLite/OPFS driver — single-
connection-only, `single-tab-lock.ts` locks out every tab but the first)
with `@journeyapps/wa-sqlite@2.0.4`'s `OPFSCoopSyncVFS`, so multiple tabs
or windows of the same browser can have the app open simultaneously: all
of them read live data, and concurrent writes are safely serialized (not
lost, not corrupted, not requiring a raw `SQLITE_BUSY` retry loop in app
code) rather than locking every tab but one out entirely.
`single-tab-lock.ts` and its "this app is already open in another tab"
screen are removed once this lands. Real production op-sqlite/OPFS data
already on devices today must survive the swap — this is NOT a fresh-
install-only change.

Done means: `SqlDriver`'s existing interface (`src/db/sqlite/driver-types.ts`)
is satisfied by a new wa-sqlite-backed implementation, a real device with
existing op-sqlite data upgrades cleanly with nothing lost, and two tabs
of the same browser can both be open against the same device without
either being redirected away.

## Notes

- **Prior art exists and was consulted directly**: `/Users/carapai/projects/mohw-nas`
  (same org, HISP Uganda), a sibling DHIS2 tracker app that already built
  this exact swap — its own wayfinder map at
  `docs/wayfinder/wa-sqlite-multi-tab/` there (map.md + 9 tickets) is a
  complete, production-grade reference: VFS selection/prototype results
  (`ticket-08-storage-prototype.md`/`prototype-results.md`, 14/14 checks
  passed Chrome+Firefox, Safari fails outright), the real driver code
  (`src/features/sync/sqlite-adapter.ts`, 58 lines + `worker.ts`, 49
  lines), and its `launch-spec.md`. **Critical divergence**: mohw-nas had
  no production deployment and explicitly chose "no legacy import, fresh
  start" (ticket-07/`legacy-ownership-proposal.md`, closed out of scope)
  — that decision does NOT transfer here; eregisters has real user data
  today and this map's tickets account for that difference directly.
- Domain: `src/db/sqlite/*` (current op-sqlite driver + row-adapters,
  unchanged in shape — only the driver underneath `SqlDriver` swaps),
  `src/db/sqlite/single-tab-lock.ts` (removed), `src/App.tsx` (bootstrap
  wiring), `scripts/patch-sw.js` (COI header injection — NOT touched by
  this map, see Decisions).
- This map's tickets, once resolved, may carry into real implementation
  directly (per this session's established convention on the sibling
  `opfs-dexie-dual-backend`/`dexie-to-opfs-sqlite` maps) — not
  planning-only by default.
- Consult `/Users/carapai/projects/mohw-nas`'s actual code directly when
  implementing, not just this map's summaries of it.

## Decisions so far

- **VFS: `OPFSCoopSyncVFS` via `@journeyapps/wa-sqlite@2.0.4`** — matches
  the "reads work, writes serialize" success bar (round 1 of this map's
  charting session); a properly published, versioned npm package (not
  the raw `rhashimoto/wa-sqlite` GitHub repo, stuck at npm 1.0.0 since
  Jan 2024 — that supply-chain concern doesn't apply once using
  PowerSync's maintained fork); empirically validated by mohw-nas's own
  prototype (14/14 checks, Chrome+Firefox desktop).
- **"Multi-tab/multi-window" scope: same-browser only.** OPFS storage is
  origin-scoped per browser profile — Chrome and Firefox have entirely
  separate, invisible-to-each-other OPFS storage for the same site, so
  "multiple different browsers accessing the same live data" isn't an
  OPFS concept in any driver. Multiple tabs/windows of ONE browser is
  the real, achievable target.
- **`single-tab-lock.ts` removed entirely**, not kept as a fallback —
  once the new driver genuinely supports multi-tab, the lock-and-redirect
  UX it exists for becomes unnecessary.
- **COOP/COEP header-injection mechanism (`scripts/patch-sw.js` patches
  6/7) is NOT touched by this map** — wa-sqlite's docs and mohw-nas's own
  empirical testing ("all successful runs used `crossOriginIsolated ===
  false`") both confirm it's unneeded for `OPFSCoopSyncVFS`, but retiring
  genuinely working, hard-won production infrastructure (ticket 018 on
  the sibling map) on the strength of a claim not yet independently
  reproduced against eregisters itself is deferred to a later,
  post-launch verification pass — not decided here.
- **Data preservation: reuse the existing copy-and-verify migration
  pattern** (`migrate-from-dexie.ts`/`migrate-from-sqlite.ts`), not an
  attempt to make wa-sqlite open op-sqlite's existing raw OPFS file
  directly (op-sqlite's on-disk file layout under a logical name like
  `"eregisters-metadata"` is internal/proprietary to op-sqlite, not
  something to rely on being readable by a different driver). Keep
  op-sqlite alive as a one-time read source, open a fresh wa-sqlite-
  backed database, copy every row across via the existing row-adapters
  (both sides already speak `SqlDriver`), verify counts, drop the old
  file on success — the same shape already proven twice this session.
- **Testing floor: Node-mockable tests for the driver adapter's SQL-
  generation logic only.** Real wa-sqlite execution (Worker + real OPFS
  + Web Locks) can't be faithfully faked in Node — mohw-nas hit the same
  wall and verifies via a Playwright browser harness eregisters doesn't
  have today. Standing up that harness is real, valuable, separately-
  scoped work, not a blocker for this map.
- **Scope stays tight to the driver swap** — mohw-nas's broader
  coordination architecture (generation/revision tokens, mutation-ID
  reconciliation, coordinated cross-tab reset, 5-second visibility-poll
  refresh) is NOT imported. eregisters already solves cross-tab
  reactivity differently (idempotent UID-keyed upserts throughout,
  the `reloadSignal` pattern). Whether true multi-tab concurrency exposes
  any real race eregisters' existing sync model doesn't already handle
  is a real open question, but a follow-up one — not this map's
  destination.

## Not yet specified

- Whether eregisters' `wa-sqlite`-backed file needs any workspace/user
  scoping in its naming the way mohw-nas's did (multi-tenant across
  DHIS2 servers within one browser profile) — eregisters' current
  op-sqlite usage is a single fixed logical name
  (`"eregisters-metadata"`), so this may just stay simple, but not
  confirmed sharp enough to ticket yet.
- Whether/when to retire the COOP/COEP header-injection mechanism —
  explicitly deferred above, revisit once wa-sqlite is verified working
  in eregisters' own real production deployment.
- Whether a Playwright-based browser test harness gets built —
  explicitly out of this map's scope; a real, separate future effort if
  wanted.
- Whether true multi-tab concurrency exposes any cross-tab race
  eregisters' existing sync/UI model doesn't already handle (flagged
  above as a real question, not yet sharp enough to specify).

## Out of scope

- mohw-nas's fresh-start/no-legacy-import approach — does not apply;
  eregisters has real production data.
- mohw-nas's broader coordination architecture (generation tokens,
  mutation-ID reconciliation, coordinated reset, visibility-poll
  refresh) — a different, much larger destination than this map's.
