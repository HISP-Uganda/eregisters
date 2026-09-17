---
title: Design the op-sqlite -> wa-sqlite migration procedure
type: wayfinder:grilling
status: open
assignee: unassigned
blocked_by: [001-port-wa-sqlite-driver-adapter]
---

## Question

Mirror `migrate-from-dexie.ts`/`migrate-from-sqlite.ts`'s copy-and-verify
shape (per this map's "Data preservation" decision) for op-sqlite ->
wa-sqlite specifically. Real decisions this needs, matching the shape
those two earlier migrations each had to resolve:

- **Completion flag mechanism**: where does "already migrated" get
  recorded, and on which side (old op-sqlite driver, or the new
  wa-sqlite one)? The forward Dexie migration records completion in the
  destination (SQLite `migration_status` table); the reverse one records
  it via `MetadataStore` on the Dexie side. Which shape fits here?
- **Timing**: synchronous-blocking on first boot with the new driver
  (safest, but adds startup latency for the one-time copy), or
  fire-and-forget like the forward Dexie migration (app renders
  immediately, a banner reports progress independently via the existing
  `migration-progress.ts` pub/sub)?
- **Failure handling**: same "retry from scratch next boot, no partial-
  resume" shape as the existing two migrations, or does op-sqlite ->
  wa-sqlite have a reason to differ?
- **Drop-old-on-success**: does the old op-sqlite file get dropped once
  copy-and-verify succeeds (matching both existing migrations'
  destructive-on-success decisions), or does anything here warrant
  keeping it around longer (e.g. as a rollback path if wa-sqlite proves
  unstable in early production)?
- **Trigger**: the map's destination is a full replacement (wa-sqlite
  IS what "sqlite" means going forward, not a third option alongside
  it) — so every device already on the sqlite backend attempts this
  migration automatically the first time it boots with the new driver
  code. Confirm this holds, and decide whether that rollout itself
  needs any staging (e.g. a canary period, or does it just ship on the
  next normal deploy like any other change) — this interacts with real
  production risk given real user data is on the line.

Use `/grilling` and `/domain-modeling` per this map's Notes. Read
`src/db/sqlite/migrate-from-dexie.ts` and `src/db/dexie/migrate-from-sqlite.ts`
in full first — this ticket's decisions should read as "the same shape,
applied to a new pair of endpoints," diverging only where op-sqlite ->
wa-sqlite genuinely differs.

## Answer

(resolve via grilling)
