Type: prototype
Status: resolved

## Question

What does the admin "configure which program stages can be a child of which other stage" screen look like and how does it behave, for a single program? This needs to settle, alongside the visual/interaction design:

- The exact shape of the stored config value (it will be written to a new DHIS2 dataStore key, `dataStore/eregisters/stage-hierarchy`, most likely something like `Record<programId, { parentStageId: string; childStageId: string }[]>` — but confirm/refine this while prototyping, since [Analytics filter/dataset shape for stage-hierarchy-driven joins](02-analytics-filter-dataset-shape.md) and [Line-list stage picker UI](03-line-list-stage-picker-ui.md) both build on whatever shape lands here).
- How an admin adds/removes a pair (per-stage multi-select of legal children? a matrix/grid of all stage×stage combinations? something else), given pairs are many-to-many and scoped per program.
- What happens for degenerate cases: a stage picked as its own child; a stage configured as both direct parent and direct child of the same other stage. Does the UI block these, warn, or allow them silently?
- Where this screen lives in the existing `/admin` nav (`src/routes/admin.tsx`'s `ADMIN_ITEMS`), reusing the existing `ALL`-authority gate.
- The read-modify-write mechanics against `dataStore/eregisters` (mirror the existing "try update, catch → create" idiom in `admin.app-settings.tsx`/`admin.section-layout.tsx`), plus mirroring into a new Dexie table for immediate local reactivity — reuse the `pullUIConfig`/`useUIConfig` pattern in `src/machines/sync.ts` / `src/hooks/useUIConfig.ts` as the template for the pull side.

Use `/prototype` to raise the fidelity of this discussion with a rough concrete UI to react to, and `/grilling` for anything that needs a decision the prototype doesn't settle on its own.

## Answer

**Structure — Variant A won: per-stage children checklist.** A table with one row per program stage; each row has a multi-select of "legal child stages" for that stage. Degenerate-case policy: **hard-exclude** — a stage's own id, and any stage that would form a two-stage cycle (already configured as this stage's child pointing back), are simply not offered as selectable options. No warning UI needed since the invalid states are unreachable.

**Config shape confirmed and simplified from the map's original guess.** `useMetadata().program` is a single object, not a list — this app operates against exactly one active tracker program, not a program switcher. So the stored value does **not** need a `Record<programId, ...>` wrapper; it's a flat array for the one active program:

```ts
interface StagePair {
  parentStageId: string;
  childStageId: string;
}
type StageHierarchyConfig = StagePair[];
```

**Where it lives:** new admin nav entry under the existing `/admin` route (`ADMIN_ITEMS` in `src/routes/admin.tsx`), gated by the existing `ALL`-authority check — no new permission tier.

**Sync mechanics confirmed via prototyping against the real admin shell:** new DHIS2 dataStore key `dataStore/eregisters/stage-hierarchy`, read via a new `fromPromise` actor mirroring `pullUIConfig` (`src/machines/sync.ts:806-821`) chained into `metadataSync` as a new state mirroring `pullingUIConfig` (`sync.ts:1617-1629`), cached in a new dedicated Dexie table (not folded into `uiConfig`), exposed via a new `liveQuery` hook mirroring `useUIConfig`. Admin-route write-back mirrors the existing "try `update`, catch → `create`" `engine.mutate` idiom in `admin.app-settings.tsx`/`admin.section-layout.tsx`.

**Asset:** the full 3-variant prototype (all built and clickable, not just described) is preserved on the throwaway branch `prototype/stage-relations-admin` (commit `3dcb22a`), not on main. It includes Variant B (stage×stage matrix, visually-disabled invalid cells) and Variant C (explicit pair-list builder, allow+warn-on-cycle) for reference if the "hard-exclude" policy or the checklist structure ever needs revisiting.
