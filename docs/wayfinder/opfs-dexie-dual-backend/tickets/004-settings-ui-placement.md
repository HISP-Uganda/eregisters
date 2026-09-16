---
title: Per-device backend setting - UI placement and states
type: wayfinder:prototype
status: closed
assignee: claude-session
blocked_by: []
---

## Question

Where does the manual per-device override live, and what are its states?
`src/routes/admin.app-settings.tsx` is the structurally obvious home
(general app settings, gated on `authorities.includes("ALL")` per
`admin.tsx`) — but this is a *per-device* setting, not a synced admin
preference, which is an unusual shape for that screen (everything else
there presumably reads/writes through `config-rows.ts` against the one
shared SQLite DB, which is backend-local by definition — a device on the
Dexie path can't read a setting stored via SQL `config-rows.ts`, and vice
versa). Where does a setting that must survive *and be readable before*
the backend is chosen actually live — `localStorage`, independent of
either backend?

States to design for: "Auto (detected: <backend>)" as default, "Force
IndexedDB", "Force SQLite/OPFS" — plus how the UI communicates the
one-time data-copy that switching triggers (progress, confirmation,
what happens if the copy fails partway).

Use the `/prototype` skill to raise fidelity here — a rough mockup of the
settings screen and the switch-confirmation flow.

## Answer

**Not admin-gated.** Grilled first: `admin.app-settings.tsx` is
restricted to `authorities.includes("ALL")`, but this is a per-device
workaround (e.g. a field worker's specific tablet failing OPFS init),
not an org-wide policy — that worker is very unlikely to be an org
admin, and gating it there would force every affected device through an
admin intermediary for something that only ever affects that one device.
Decided: available to any signed-in user, own-device only.

**Placement**: a new item in the app's existing nav `Drawer`
(`src/routes/__root.tsx`, opened from the header menu button) — not a
new route or screen. No new chrome needed.

**Persistence**: `localStorage`, not `config-rows.ts` — it has to be
readable *before* either backend initializes (per ticket 001's
selection-point design), and it's per-device, never synced.

**States** (prototyped —
[artifact](https://claude.ai/artifact/B2LLpaxAjCbg9TwxW6TXTA), 5 states,
confirmed as-is): a 3-option radio — "Auto" (default, shows what was
actually detected this session, e.g. "detected: SQLite" — not a static
label), "Force IndexedDB", "Force SQLite" (each showing a live "current"
pill for whichever is actually active). Selecting a different option
opens a confirmation modal naming the actual record count about to be
copied and warning not to close the app mid-copy. Confirming shows a
migration-style progress view (mirrors `publishMigrationProgress`'s
existing `checking → copying → verifying → done/failed` phases from
`migrate-from-dexie.ts`, reused for the reverse direction per ticket
003) with a per-table checklist. On failure: names which table/row range
it failed at, confirms explicitly that nothing switched and no data was
lost (ticket 003's copy-and-verify-before-drop design guarantees this),
and offers "Try again" or "Keep &lt;current backend&gt;".
