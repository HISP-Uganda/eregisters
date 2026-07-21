# HMIS Form Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship four coordinated changes to the aggregate HMIS report flow: draft persistence + DHIS2-native verified state, per-form editable-scope allowlist, ancestor-aware org-unit search, and disabled-cell contrast fix.

**Architecture:**
- Persist typed values to a new Dexie table `hmisDrafts` (debounced) so refreshing does not lose work.
- Persist verified state via DHIS2 `completeDataSetRegistrations` (native mechanism), cached locally so offline reloads still know.
- Constrain manual entry by adding `editableScope` to `HmisFormConfig` and gating cell `disabled` at render time.
- Enhance the org-unit `TreeSelect` with a custom `filterTreeNode` that matches against precomputed ancestor lineage.

**Tech Stack:** React 18, TypeScript, Ant Design 6, TanStack Router (hash history), Dexie (IndexedDB), Vitest, `@dhis2/app-runtime` `useDataEngine`. Package manager: `pnpm@10.13.1` (never `npm`/`yarn`).

**Spec:** `docs/superpowers/specs/2026-07-21-hmis-form-hardening-design.md`

---

## Pre-flight

Before touching anything, verify the baseline is clean.

- [ ] **Step 1: Confirm working tree matches expected state.**

Run: `git status -sb`

Expected: on `main`, ahead of any remote is fine; no dirty files that would conflict with tasks below (existing `M` markers on modified components/configs from prior work are OK).

- [ ] **Step 2: Run the Vitest suite once as a baseline.**

Run: `pnpm test:vitest`

Expected: all tests pass (the `no-duplicate-headers.test.ts` suite is the reference — every config should already pass it). If any test fails, stop and investigate before starting.

- [ ] **Step 3: Confirm dev server boots (optional but recommended).**

Run: `pnpm start` in a background terminal, wait for `Compiled successfully`, kill it. Confirms the DHIS2 app scripts still build.

---

## File Map

| File | Status | What changes |
|---|---|---|
| `src/components/HmisForm.tsx` | Modify | Section 4 color; Section 2 render gate; Section 1 debounce + props + button state; remove re-seed `useEffect` |
| `src/routes/reports.tsx` | Modify | Section 3: lineage index + custom `filterTreeNode` using extracted pure `matchOrgUnit` |
| `src/routes/org-unit-search.test.ts` | Create | Section 3 predicate test |
| `src/db/index.ts` | Modify | Section 1: register `hmisDrafts` table + `.version(3)` |
| `src/db/hmis-drafts.ts` | Create | Section 1: pure helpers (`mergeDraftAndServer`, `combineIsVerified`) + Dexie read/write |
| `src/db/hmis-drafts.test.ts` | Create | Section 1: unit tests for pure helpers |
| `src/form-configs/types.ts` | Modify | Section 2: add `HmisEditableScope` type + optional `editableScope` field |
| `src/form-configs/Hmis033b.config.ts` | Modify | Section 2: allowlist |
| `src/form-configs/Hmis1050203.config.ts` | Modify | Section 2: allowlist |
| `src/form-configs/Hmis1050609.config.ts` | Modify | Section 2: `mode: "all"` |
| `src/form-configs/Hmis10501.config.ts` | Modify | Section 2: `mode: "none"` |
| `src/form-configs/Hmis1050405.config.ts` | Modify | Section 2: `mode: "none"` |
| `src/form-configs/Hmis10510.config.ts` | Modify | Section 2: `mode: "none"` |
| `src/form-configs/Hmis106A0102.config.ts` | Modify | Section 2: `mode: "none"` |
| `src/form-configs/Hmis106A03.config.ts` | Modify | Section 2: `mode: "none"` |
| `src/form-configs/Hmis106A04.config.ts` | Modify | Section 2: `mode: "none"` |
| `src/form-configs/Hmis108.config.ts` | Modify | Section 2: `mode: "none"` |
| `src/form-configs/editable-scope.test.ts` | Create | Section 2: allowlist row-coverage test |
| `src/routes/reports.data-set.tsx` | Modify | Section 1: loader triple-fetch; `onSave` verifies via `completeDataSetRegistrations`; local write |

**Ordering rationale:**
- **Section 4** first — trivial CSS proves the branch/setup works and produces one clean commit.
- **Section 3** second — pure function + one TreeSelect prop, no cross-dependencies with other sections.
- **Section 2** third — types + configs + renderer gate. Renderer gate lands before Section 1 so we don't rewrite the same code twice.
- **Section 1** last — largest surface, depends on the props already threaded from Section 2's renderer work.

---

## Section 4 — Disabled cell text color

### Task 4.1: Bump disabled-cell text to black

**Files:**
- Modify: `src/components/HmisForm.tsx:150-154`

- [ ] **Step 1: Apply the CSS change.**

Edit `src/components/HmisForm.tsx`, in the `HmisFormStyles` inline style block, change:

```css
.hmis105-field.ant-input-disabled {
  background-color: #e6e6e6 !important;
  color: #333 !important;
  cursor: not-allowed !important;
}
```

to:

```css
.hmis105-field.ant-input-disabled {
  background-color: #e6e6e6 !important;
  color: #000 !important;
  cursor: not-allowed !important;
}
```

- [ ] **Step 2: Verify the file still typechecks.**

Run: `pnpm exec tsc --noEmit`

Expected: no errors (or same baseline as before the change).

- [ ] **Step 3: Commit.**

```bash
git add src/components/HmisForm.tsx
git commit -m "style: bump disabled HMIS field text to pure black"
```

---

## Section 3 — Org-unit search enhancement

### Task 3.1: Write the failing test for `matchOrgUnit`

**Files:**
- Create: `src/routes/org-unit-search.test.ts`

- [ ] **Step 1: Create the test file.**

```ts
import { describe, expect, it } from "vitest";
import { buildOrgUnitSearchIndex, matchOrgUnit } from "./org-unit-search";

const fixture = [
    { id: "root", name: "Uganda", path: "/root" },
    {
        id: "kampala",
        name: "Kampala District",
        path: "/root/kampala",
        parent: { id: "root" },
    },
    {
        id: "kawempe",
        name: "Kawempe HC IV",
        path: "/root/kampala/kawempe",
        parent: { id: "kampala" },
    },
    {
        id: "gulu",
        name: "Gulu District",
        path: "/root/gulu",
        parent: { id: "root" },
    },
];

describe("matchOrgUnit", () => {
    const index = buildOrgUnitSearchIndex(fixture);

    it("matches own name case-insensitively", () => {
        expect(matchOrgUnit(index, "kawempe", "KAWEMPE")).toBe(true);
        expect(matchOrgUnit(index, "kawempe", "kawempe")).toBe(true);
    });

    it("matches an ancestor's name (district query surfaces child facility)", () => {
        expect(matchOrgUnit(index, "kawempe", "kampala")).toBe(true);
    });

    it("does not match unrelated names", () => {
        expect(matchOrgUnit(index, "kawempe", "gulu")).toBe(false);
    });

    it("tolerates extra whitespace", () => {
        expect(matchOrgUnit(index, "kawempe", "  kampala   district  ")).toBe(
            true,
        );
    });

    it("returns true for empty/whitespace-only query", () => {
        expect(matchOrgUnit(index, "kawempe", "")).toBe(true);
        expect(matchOrgUnit(index, "kawempe", "   ")).toBe(true);
    });

    it("returns false for an unknown node id", () => {
        expect(matchOrgUnit(index, "nonexistent", "kampala")).toBe(false);
    });
});
```

- [ ] **Step 2: Run the test to verify it fails.**

Run: `pnpm exec vitest run src/routes/org-unit-search.test.ts`

Expected: FAIL — module `./org-unit-search` does not exist.

### Task 3.2: Implement the pure `matchOrgUnit` helper

**Files:**
- Create: `src/routes/org-unit-search.ts`

- [ ] **Step 1: Write the helper.**

```ts
export interface OrgUnitLike {
    id: string;
    name: string;
    path: string;
}

export type OrgUnitSearchIndex = Map<string, string>;

/**
 * Precompute a lowercase lineage string ("great-grand > grand > parent > self")
 * for each org unit so `matchOrgUnit` becomes a plain substring check.
 */
export function buildOrgUnitSearchIndex(
    units: OrgUnitLike[],
): OrgUnitSearchIndex {
    const byId = new Map(units.map((u) => [u.id, u]));
    return new Map(
        units.map((u) => {
            const lineage = u.path
                .split("/")
                .slice(1)
                .map((id) => byId.get(id)?.name ?? "")
                .filter(Boolean)
                .join(" > ")
                .toLowerCase();
            return [u.id, lineage];
        }),
    );
}

export function matchOrgUnit(
    index: OrgUnitSearchIndex,
    nodeId: string,
    rawInput: string,
): boolean {
    const q = rawInput.trim().toLowerCase().replace(/\s+/g, " ");
    if (!q) return true;
    const lineage = index.get(nodeId);
    if (lineage === undefined) return false;
    return lineage.includes(q);
}
```

- [ ] **Step 2: Run the test to verify it passes.**

Run: `pnpm exec vitest run src/routes/org-unit-search.test.ts`

Expected: PASS — all six cases green.

- [ ] **Step 3: Commit.**

```bash
git add src/routes/org-unit-search.ts src/routes/org-unit-search.test.ts
git commit -m "feat: extract pure ancestor-aware org unit search helper"
```

### Task 3.3: Wire the helper into the org-unit TreeSelect

**Files:**
- Modify: `src/routes/reports.tsx`

- [ ] **Step 1: Add imports at the top of the file.**

Add to the existing `useState` import:

```ts
import React, { useEffect, useMemo, useState } from "react";
```

And a new import for the helper:

```ts
import { buildOrgUnitSearchIndex, matchOrgUnit } from "./org-unit-search";
```

- [ ] **Step 2: Build the search index inside the `Reports()` component.**

Immediately after the `const [expanded, setExpanded] = useState<SafeKey[]>([]);` line, add:

```ts
const orgUnitSearchIndex = useMemo(
    () => buildOrgUnitSearchIndex(organisationUnits),
    [organisationUnits],
);
```

- [ ] **Step 3: Replace `showSearch={{ filterTreeNode: true }}` with the custom predicate.**

Find the `<TreeSelect>` for the Organisation `Form.Item`. Replace:

```tsx
showSearch={{ filterTreeNode: true }}
```

with:

```tsx
showSearch
filterTreeNode={(input, node) =>
    matchOrgUnit(orgUnitSearchIndex, node.id as string, input)
}
```

Leave every other prop on the `TreeSelect` untouched.

- [ ] **Step 4: Typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: no new errors.

- [ ] **Step 5: Manual smoke test.**

Boot the dev server: `pnpm start`. Navigate to `/reports`, open the Organisation dropdown, type `kampala` (lowercase) — Kampala district and its descendants should surface. Type `KAWEMPE` — Kawempe HC should still match. Empty the input — full tree returns.

- [ ] **Step 6: Commit.**

```bash
git add src/routes/reports.tsx
git commit -m "feat: ancestor-aware, case-insensitive org unit search"
```

---

## Section 2 — Editable-scope allowlist

### Task 2.1: Extend `HmisFormConfig` with `editableScope`

**Files:**
- Modify: `src/form-configs/types.ts`

- [ ] **Step 1: Add the new type and field.**

At the end of `src/form-configs/types.ts` (before the existing `HmisFormConfig` interface), add:

```ts
export type HmisEditableScope =
    | { mode: "all" }
    | { mode: "none" }
    | { mode: "allowlist"; allow: RegExp[] };
```

Then find `HmisFormConfig` and add the optional field:

```ts
export interface HmisFormConfig {
    id: string;
    title: string;
    tabs: HmisTabConfig[];
    editableScope?: HmisEditableScope;
}
```

Backward compatibility: configs without the field are treated as `{ mode: "all" }` by the renderer.

- [ ] **Step 2: Typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: no errors (nothing yet consumes the new field).

- [ ] **Step 3: Commit.**

```bash
git add src/form-configs/types.ts
git commit -m "feat: add HmisEditableScope to HmisFormConfig"
```

### Task 2.2: Write the failing allowlist coverage test

**Files:**
- Create: `src/form-configs/editable-scope.test.ts`

- [ ] **Step 1: Write the test.**

```ts
import { describe, expect, it } from "vitest";
import * as Hmis033b from "./Hmis033b.config";
import * as Hmis10501 from "./Hmis10501.config";
import * as Hmis1050203 from "./Hmis1050203.config";
import * as Hmis1050405 from "./Hmis1050405.config";
import * as Hmis1050609 from "./Hmis1050609.config";
import * as Hmis10510 from "./Hmis10510.config";
import * as Hmis106A0102 from "./Hmis106A0102.config";
import * as Hmis106A03 from "./Hmis106A03.config";
import * as Hmis106A04 from "./Hmis106A04.config";
import * as Hmis108 from "./Hmis108.config";
import type { HmisFormConfig } from "./types";

const modules = {
    Hmis033b,
    Hmis10501,
    Hmis1050203,
    Hmis1050405,
    Hmis1050609,
    Hmis10510,
    Hmis106A0102,
    Hmis106A03,
    Hmis106A04,
    Hmis108,
};

const isFormConfig = (v: unknown): v is HmisFormConfig =>
    !!v &&
    typeof v === "object" &&
    Array.isArray((v as { tabs?: unknown }).tabs);

const configs: HmisFormConfig[] = Array.from(
    new Set(
        Object.values(modules).flatMap((m) =>
            Object.values(m).filter(isFormConfig),
        ),
    ),
);

function firstTitledCell(config: HmisFormConfig): string[] {
    const titles: string[] = [];
    for (const tab of config.tabs) {
        for (const section of tab.sections) {
            for (const row of section.rows) {
                const titled = row.cells.find(
                    (c) => typeof c.title === "string" && c.title.length > 0,
                );
                if (titled?.title) titles.push(titled.title);
            }
        }
    }
    return titles;
}

describe("editableScope allowlists cover at least one row", () => {
    for (const cfg of configs) {
        const scope = cfg.editableScope;
        if (!scope || scope.mode !== "allowlist") continue;

        it(`${cfg.id} has ≥1 row whose title matches an allow regex`, () => {
            const titles = firstTitledCell(cfg);
            const matched = titles.filter((t) =>
                scope.allow.some((re) => re.test(t)),
            );
            expect(
                matched.length,
                `no row in ${cfg.id} matched any of ${scope.allow.map((r) => r.source).join(", ")}`,
            ).toBeGreaterThan(0);
        });
    }
});

describe("editableScope is present on every config", () => {
    // Establishes that every form has an explicit mode — new forms must decide.
    for (const cfg of configs) {
        it(`${cfg.id} declares editableScope`, () => {
            expect(cfg.editableScope, `${cfg.id} missing editableScope`).toBeDefined();
        });
    }
});
```

- [ ] **Step 2: Run the test to verify it fails.**

Run: `pnpm exec vitest run src/form-configs/editable-scope.test.ts`

Expected: FAIL — every config fails "declares editableScope" because none of them have the field yet.

### Task 2.3: Add `editableScope` to every form config

**Files:**
- Modify: all 10 files under `src/form-configs/Hmis*.config.ts`

Each config exports a single `HmisFormConfig` object. Add `editableScope` as a top-level field on that object.

- [ ] **Step 1: `Hmis033b.config.ts` → allowlist.**

Add to the exported config object:

```ts
editableScope: {
    mode: "allowlist",
    allow: [/033B-TR0[1-8]/, /033B-RV(0[1-9]|10)/],
},
```

- [ ] **Step 2: `Hmis1050203.config.ts` → allowlist.**

```ts
editableScope: {
    mode: "allowlist",
    allow: [/105-WT(0[1-9]|1[0-2])/],
},
```

- [ ] **Step 3: `Hmis1050609.config.ts` → mode all.**

```ts
editableScope: { mode: "all" },
```

- [ ] **Step 4: `Hmis10501.config.ts` → mode none.**

```ts
editableScope: { mode: "none" },
```

- [ ] **Step 5: `Hmis1050405.config.ts` → mode none.**

```ts
editableScope: { mode: "none" },
```

- [ ] **Step 6: `Hmis10510.config.ts` → mode none.**

```ts
editableScope: { mode: "none" },
```

- [ ] **Step 7: `Hmis106A0102.config.ts` → mode none.**

```ts
editableScope: { mode: "none" },
```

- [ ] **Step 8: `Hmis106A03.config.ts` → mode none.**

```ts
editableScope: { mode: "none" },
```

- [ ] **Step 9: `Hmis106A04.config.ts` → mode none.**

```ts
editableScope: { mode: "none" },
```

- [ ] **Step 10: `Hmis108.config.ts` → mode none.**

```ts
editableScope: { mode: "none" },
```

- [ ] **Step 11: Run the coverage test.**

Run: `pnpm exec vitest run src/form-configs/editable-scope.test.ts`

Expected: PASS — allowlists match rows in 033B and 1050203; every config declares a scope.

- [ ] **Step 12: Run the full Vitest suite.**

Run: `pnpm test:vitest`

Expected: all tests pass.

- [ ] **Step 13: Commit.**

```bash
git add src/form-configs/*.config.ts src/form-configs/editable-scope.test.ts
git commit -m "feat: add editableScope to every HMIS form config"
```

### Task 2.4: Gate cell `disabled` on `rowEditable`

**Files:**
- Modify: `src/components/HmisForm.tsx`

The renderer chain is `InnerHmisForm` → tab body → `SectionTable` → `renderRow` → `RenderCell` → `FieldCell`. We compute `rowEditable` inside `SectionTable`'s per-row iteration (where we have both the row cells and the config scope in scope) and pass it down.

- [ ] **Step 1: Add a helper at module scope.**

Near the top of `src/components/HmisForm.tsx` (after `cleanNumericValue`), add:

```ts
function isRowEditable(
    row: HmisRowConfig,
    scope: HmisEditableScope | undefined,
): boolean {
    if (!scope || scope.mode === "all") return true;
    if (scope.mode === "none") return false;
    const identifying = row.cells.find(
        (c) => typeof c.title === "string" && c.title.length > 0,
    );
    if (!identifying?.title) return false;
    return scope.allow.some((re) => re.test(identifying.title!));
}
```

Import the type:

```ts
import type {
    HmisCellConfig,
    HmisEditableScope,
    HmisFormConfig,
    HmisFormValues,
    HmisRowConfig,
    HmisSectionConfig,
    setValue,
} from "../form-configs/types";
```

- [ ] **Step 2: Thread `editableScope` through `SectionTable` and `renderRow`.**

`SectionTable` currently receives `section`, `values`, `readOnly`, `setValue`, `attributeOptionCombo`. Add `editableScope`:

```ts
const SectionTable: React.FC<{
    section: HmisSectionConfig;
    values: HmisFormValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
    editableScope: HmisEditableScope | undefined;
}> = ({
    section,
    values,
    readOnly,
    setValue,
    attributeOptionCombo,
    editableScope,
}) => {
```

Inside `SectionTable`, when calling `renderRow`, pass `rowEditable`:

```ts
{bodyRows.map((row) =>
    renderRow(
        row,
        frozenColumns,
        values,
        readOnly,
        setValue,
        attributeOptionCombo,
        carry,
        isRowEditable(row, editableScope),
    ),
)}
```

Do the same for the `headRows.map(...)` call. Header rows are subheads (row.type === "subhead") that carry column labels — they contain label cells (`text` only, no `title`) and no data-entry `field` cells. `isRowEditable` on such a row returns `false` under `mode: "allowlist"` or `"none"` (no titled cell to match), which is harmless because there are no fields to disable. Passing `true` unconditionally is equivalent and clearer about the intent (header row → no editability decision required):

```ts
{headRows.map((row) =>
    renderRow(
        row,
        frozenColumns,
        values,
        readOnly,
        setValue,
        attributeOptionCombo,
        carry,
        true,
    ),
)}
```

- [ ] **Step 3: Update `renderRow` signature and pass `rowEditable` to `RenderCell`.**

Find the `renderRow` function (before `SectionTable`). Add `rowEditable: boolean` as the final parameter and pass it through the loop:

```ts
const renderRow = (
    row: HmisRowConfig,
    frozenColumns: number,
    values: HmisFormValues,
    readOnly: boolean,
    setValue: setValue,
    attributeOptionCombo: string,
    carry: RowSpanCarry,
    rowEditable: boolean,
): React.ReactNode => {
    // ...existing body...
    // In the RenderCell call, add rowEditable:
    return (
        <RenderCell
            key={`${row.key}-${cell.key}-${index}`}
            cell={cell}
            values={values}
            readOnly={readOnly}
            setValue={setValue}
            attributeOptionCombo={attributeOptionCombo}
            stickyLeft={stickyLeft}
            rowEditable={rowEditable}
        />
    );
```

- [ ] **Step 4: Add `rowEditable` to `RenderCell` and `FieldCell`.**

`RenderCell` type:

```ts
const RenderCell: React.FC<{
    cell: HmisCellConfig;
    values: HmisFormValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
    stickyLeft?: number;
    rowEditable: boolean;
}> = ({
    cell,
    values,
    readOnly,
    setValue,
    attributeOptionCombo,
    stickyLeft,
    rowEditable,
}) => {
```

Inside `RenderCell` where `<FieldCell />` is rendered, add the prop:

```tsx
<FieldCell
    cell={cell}
    values={values}
    readOnly={readOnly}
    setValue={setValue}
    attributeOptionCombo={attributeOptionCombo}
    rowEditable={rowEditable}
/>
```

`FieldCell` type + disabled logic:

```ts
const FieldCell: React.FC<{
    cell: HmisCellConfig;
    values: HmisFormValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
    rowEditable: boolean;
}> = ({
    cell,
    values,
    readOnly,
    setValue,
    attributeOptionCombo,
    rowEditable,
}) => {
    // ...unchanged early return for cells without dataElement...

    return (
        <InputNumber
            className="hmis105-field"
            inputMode="numeric"
            title={cell.title ?? key}
            value={values.getOrInsert(key, "")}
            disabled={readOnly || !!cell.disabled || !rowEditable}
            style={{ width: "100%" }}
            onChange={(value) => {
                setValue({
                    attributeOptionCombo: cell.attributeOptionCombo!,
                    dataElement: cell.dataElement!,
                    categoryOptionCombo: cell.categoryOptionCombo!,
                    value: cleanNumericValue(value),
                });
            }}
        />
    );
};
```

- [ ] **Step 5: Pass `config.editableScope` from `InnerHmisForm` into each `SectionTable`.**

Inside `InnerHmisForm`, find where tab bodies map `sections`:

```tsx
{tab.sections.map((section) => (
    <SectionTable
        key={section.key}
        section={section}
        values={values}
        readOnly={readOnly}
        setValue={setValue}
        attributeOptionCombo={attributeOptionCombo}
        editableScope={config.editableScope}
    />
))}
```

- [ ] **Step 6: Typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: no errors.

- [ ] **Step 7: Full test run.**

Run: `pnpm test:vitest`

Expected: all tests pass. Editable-scope test still green.

- [ ] **Step 8: Manual smoke test in browser.**

Run: `pnpm start`. Visit `/reports/hmis`, pick org unit + period.
- Load `HMIS 033B` → confirm TR01–TR08 and RV01–RV10 input rows are enabled, other rows are disabled with black text on grey.
- Load `HMIS 105:02-03` → confirm WT01–WT12 rows (all sub-cells) are enabled, others disabled.
- Load `HMIS 105:06-09` → all cells enabled.
- Load any other form (e.g. `HMIS 105:01`) → all cells disabled.

- [ ] **Step 9: Commit.**

```bash
git add src/components/HmisForm.tsx
git commit -m "feat: gate HMIS cell input on per-form editable scope"
```

---

## Section 1 — Draft persistence & verified state

Largest section. Split into five sub-tasks:
- **1.1** Dexie schema + pure helpers with unit tests.
- **1.2** Loader reads local draft + `completeDataSetRegistrations`; merges.
- **1.3** Draft autosave (debounced write from `HmisForm`).
- **1.4** Verify path (`onSave` posts values + registers completion + writes local row).
- **1.5** Button state matrix in `HmisForm`.

### Task 1.1: Dexie schema + pure helpers with tests

**Files:**
- Modify: `src/db/index.ts`
- Create: `src/db/hmis-drafts.ts`
- Create: `src/db/hmis-drafts.test.ts`

- [ ] **Step 1: Write the failing test.**

Create `src/db/hmis-drafts.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { HmisDraft } from "./hmis-drafts";
import { combineIsVerified, mergeDraftAndServer } from "./hmis-drafts";

const emptyDraft = (over: Partial<HmisDraft> = {}): HmisDraft => ({
    id: "ds_p_ou_aoc",
    dataSet: "ds",
    period: "p",
    orgUnit: "ou",
    attributeOptionCombo: "aoc",
    values: {},
    isVerified: false,
    updatedAt: 0,
    syncStatus: "draft",
    ...over,
});

describe("mergeDraftAndServer", () => {
    it("returns server values when there is no draft", () => {
        const server = new Map([["key1", "42"]]);
        expect(mergeDraftAndServer(undefined, server)).toEqual(server);
    });

    it("returns server values when draft has none", () => {
        const draft = emptyDraft();
        const server = new Map([["key1", "42"]]);
        const merged = mergeDraftAndServer(draft, server);
        expect(merged.get("key1")).toBe("42");
    });

    it("draft values take precedence over server for the same key", () => {
        const draft = emptyDraft({ values: { key1: "99" } });
        const server = new Map([["key1", "42"]]);
        expect(mergeDraftAndServer(draft, server).get("key1")).toBe("99");
    });

    it("union of keys: draft-only + server-only keys both survive", () => {
        const draft = emptyDraft({ values: { key1: "99" } });
        const server = new Map([["key2", "42"]]);
        const merged = mergeDraftAndServer(draft, server);
        expect(merged.get("key1")).toBe("99");
        expect(merged.get("key2")).toBe("42");
    });
});

describe("combineIsVerified", () => {
    it("true when only local flag is set", () => {
        expect(combineIsVerified(true, false)).toBe(true);
    });
    it("true when only server flag is set", () => {
        expect(combineIsVerified(false, true)).toBe(true);
    });
    it("true when both flags are set", () => {
        expect(combineIsVerified(true, true)).toBe(true);
    });
    it("false when neither flag is set", () => {
        expect(combineIsVerified(false, false)).toBe(false);
    });
    it("treats server undefined (unknown) as false — falls back to local", () => {
        expect(combineIsVerified(false, undefined)).toBe(false);
        expect(combineIsVerified(true, undefined)).toBe(true);
    });
});
```

- [ ] **Step 2: Run test to verify it fails.**

Run: `pnpm exec vitest run src/db/hmis-drafts.test.ts`

Expected: FAIL — module `./hmis-drafts` does not exist.

- [ ] **Step 3: Create `src/db/hmis-drafts.ts` with the interface + pure helpers.**

```ts
import { db } from "./index";

export interface HmisDraft {
    id: string;
    dataSet: string;
    period: string;
    orgUnit: string;
    attributeOptionCombo: string;
    values: Record<string, string>;
    isVerified: boolean;
    verifiedAt?: number;
    updatedAt: number;
    syncStatus: "draft" | "pending" | "synced";
}

export function draftId(input: {
    dataSet: string;
    period: string;
    orgUnit: string;
    attributeOptionCombo: string;
}): string {
    return `${input.dataSet}_${input.period}_${input.orgUnit}_${input.attributeOptionCombo}`;
}

export function mergeDraftAndServer(
    draft: HmisDraft | undefined,
    server: Map<string, string>,
): Map<string, string> {
    const merged = new Map(server);
    if (draft) {
        for (const [k, v] of Object.entries(draft.values)) {
            merged.set(k, v);
        }
    }
    return merged;
}

export function combineIsVerified(
    local: boolean,
    server: boolean | undefined,
): boolean {
    return local || server === true;
}

export async function getHmisDraft(
    id: string,
): Promise<HmisDraft | undefined> {
    return db.hmisDrafts.get(id);
}

export async function upsertHmisDraft(row: HmisDraft): Promise<void> {
    await db.hmisDrafts.put(row);
}

export async function patchHmisDraft(
    id: string,
    patch: Partial<HmisDraft>,
): Promise<void> {
    const existing = await db.hmisDrafts.get(id);
    if (!existing) return;
    await db.hmisDrafts.put({ ...existing, ...patch });
}
```

- [ ] **Step 4: Register the table on the Dexie class.**

Edit `src/db/index.ts`:

Import the type:

```ts
import type { HmisDraft } from "./hmis-drafts";
```

`import type` is stripped at compile time so there is no runtime circular reference between `db/index.ts` (which is the source of the `db` singleton) and `db/hmis-drafts.ts` (which imports `db` at runtime). Do NOT change the `import type` to a value import — that would introduce an initialization-order bug where `db` could be `undefined` when `hmis-drafts.ts` is loaded first (e.g. by a test).

Add the table property inside `RegisterDatabase` (alongside the other `!:` fields):

```ts
hmisDrafts!: Table<HmisDraft, string>;
```

Add version 3 to the constructor, after the `this.version(2).stores({ uiConfig: "id" });` line:

```ts
this.version(3).stores({
    hmisDrafts: "id, dataSet, period, orgUnit, syncStatus",
});
```

Do not touch the version 1 or version 2 blocks.

- [ ] **Step 5: Run the test to verify it passes.**

Run: `pnpm exec vitest run src/db/hmis-drafts.test.ts`

Expected: PASS.

- [ ] **Step 6: Typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: no errors.

- [ ] **Step 7: Commit.**

```bash
git add src/db/index.ts src/db/hmis-drafts.ts src/db/hmis-drafts.test.ts
git commit -m "feat: add hmisDrafts Dexie table + merge helpers"
```

### Task 1.2a: Expose the DHIS2 engine via router context

**Files:**
- Modify: `src/routes/__root.tsx`
- Modify: `src/router.tsx`
- Modify: `src/App.tsx`

Loaders don't have hook access, so we can't call `useDataEngine()` from Task 1.2b's loader. We add `engine` to the router context so the loader can use `context.engine.query(...)` — the same instance the component already uses via `useDataEngine`. This is preferred over a raw `fetch("../../../api/...")` because the DHIS2 app mount depth is not stable, and `engine.query` transparently handles auth, base URL, and error shapes.

- [ ] **Step 1: Add `engine` to `RootRoute`'s context generic.**

Edit `src/routes/__root.tsx` around line 54. `@dhis2/app-runtime` may not export a `DataEngine` named type across versions, so derive it from `useDataEngine`'s return type inline (this always works regardless of what the package exports):

```ts
type DataEngine = ReturnType<typeof import("@dhis2/app-runtime").useDataEngine>;

export const RootRoute = createRootRouteWithContext<{
    syncActor: ReturnType<typeof SyncContext.useActorRef>;
    engine: DataEngine;
}>()({
    // ...unchanged body
});
```

- [ ] **Step 2: Initialize the field in `router.tsx`.**

In `src/router.tsx`, extend the `context:` initializer:

```ts
context: {
    syncActor: undefined!,
    engine: undefined!,
},
```

- [ ] **Step 3: Thread engine through `App.tsx`.**

In `src/App.tsx`, `Main`:

```tsx
const Main = () => {
    const syncActor = SyncContext.useActorRef();
    const engine = useDataEngine();
    return (
        <RouterProvider router={router} context={{ syncActor, engine }} />
    );
};
```

- [ ] **Step 4: Typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: no new errors.

- [ ] **Step 5: Commit.**

```bash
git add src/routes/__root.tsx src/router.tsx src/App.tsx
git commit -m "chore: expose DHIS2 engine via router context for loader access"
```

### Task 1.2b: Loader reads local draft + `completeDataSetRegistrations`

**Files:**
- Modify: `src/routes/reports.data-set.tsx`

The loader currently fetches ereports values only. Extend to also read the local draft and call DHIS2 `completeDataSetRegistrations` via `context.engine.query`.

- [ ] **Step 1: Extend the loader return type.**

At the top of `src/routes/reports.data-set.tsx`, add imports:

```ts
import {
    combineIsVerified,
    draftId,
    getHmisDraft,
    mergeDraftAndServer,
    type HmisDraft,
} from "../db/hmis-drafts";
```

- [ ] **Step 2: Verify `loaderDeps` includes `attribution`.**

Read `src/routes/reports.data-set.tsx` and confirm the existing `loaderDeps` line includes `attribution` in both the destructure and return:

```ts
loaderDeps: ({
    search: { attribution, dataSet, orgUnit, period, periodType },
}) => ({ attribution, dataSet, orgUnit, period, periodType }),
```

It already does at the time of writing — if a prior task changed it, restore it. Do not proceed to Step 3 until this is verified.

- [ ] **Step 3: Replace the loader body.**

Replace the existing `loader: async ({ deps: { dataSet, orgUnit, period } }) => { ... }` with:

```ts
loader: async ({
    context,
    deps: { dataSet, orgUnit, period, attribution },
}) => {
    const empty = {
        initialValues: new Map<string, string>(),
        isVerified: false,
        syncStatus: "draft" as HmisDraft["syncStatus"],
    };
    if (
        orgUnit === undefined ||
        period === undefined ||
        dataSet === undefined ||
        attribution === undefined
    ) {
        return empty;
    }

    const id = draftId({
        dataSet,
        period,
        orgUnit,
        attributeOptionCombo: attribution,
    });

    const [serverValues, serverVerified, draft] = await Promise.all([
        fetchServerValues(dataSet, orgUnit, period),
        fetchServerVerified(context.engine, dataSet, orgUnit, period, attribution),
        getHmisDraft(id).catch(() => undefined),
    ]);

    return {
        initialValues: mergeDraftAndServer(draft, serverValues),
        isVerified: combineIsVerified(
            draft?.isVerified ?? false,
            serverVerified,
        ),
        syncStatus: draft?.syncStatus ?? "draft",
    };
},
```

- [ ] **Step 4: Add the two fetch helpers (module scope, above `Reports`).**

```ts
async function fetchServerValues(
    dataSet: string,
    orgUnit: string,
    period: string,
): Promise<Map<string, string>> {
    const params = new URLSearchParams({
        source: "hmis_dvs",
        period,
        dataset: dataSet,
        orgunit: orgUnit,
    });
    try {
        const response = await fetch(
            `https://eregisters.health.go.ug/ereports/query?${params.toString()}`,
            { headers: { "x-api-key": "LnwYPc0EnRKIqjKaQabQWGIN31ranjYt" } },
        );
        if (!response.ok) return new Map();
        const data = await response.json();
        return new Map<string, string>(
            data.dataValues.map(
                ({
                    dataElement,
                    attributeOptionCombo,
                    categoryOptionCombo,
                    value,
                }: any) => [
                    `${dataElement}_${categoryOptionCombo}_${attributeOptionCombo}`,
                    value,
                ],
            ),
        );
    } catch {
        return new Map();
    }
}

interface DataEngineLike {
    query: (q: Record<string, any>) => Promise<any>;
}

async function fetchServerVerified(
    engine: DataEngineLike,
    dataSet: string,
    orgUnit: string,
    period: string,
    attribution: string,
): Promise<boolean | undefined> {
    try {
        const result = await engine.query({
            registrations: {
                resource: "completeDataSetRegistrations",
                params: {
                    dataSet,
                    period,
                    orgUnit,
                    children: false,
                },
            },
        });
        const list: Array<{
            attributeOptionCombo?: string;
            completed?: boolean;
        }> =
            result?.registrations?.completeDataSetRegistrations ?? [];
        return list.some(
            (r) =>
                r.attributeOptionCombo === attribution &&
                r.completed === true,
        );
    } catch (err) {
        console.warn(
            "completeDataSetRegistrations read failed — treating verified state as unknown:",
            err,
        );
        return undefined;
    }
}
```

Uses the engine from router context (Task 1.2a) — no fragile relative path.

- [ ] **Step 5: Update the component to consume the new shape.**

Inside `function Reports()`, replace:

```ts
const data = DataSetReportRoute.useLoaderData();
```

with:

```ts
const { initialValues, isVerified, syncStatus } =
    DataSetReportRoute.useLoaderData();
```

Then in every form component instance in the `dataSets` record, replace `initialValues={data}` with:

```tsx
initialValues={initialValues}
isVerified={isVerified}
syncStatus={syncStatus}
```

Do this for every form (`Hmis033bForm`, `Hmis10501Form`, …, `Hmis108Form`).

- [ ] **Step 6: Typecheck (expect errors we fix in Task 1.5).**

Run: `pnpm exec tsc --noEmit`

Expected: errors on `isVerified` / `syncStatus` props not being on `HmisFormProps`. This is expected — we add them in Task 1.5. **Do not commit yet.**

### Task 1.3: Draft autosave (debounced write)

**Files:**
- Modify: `src/components/HmisForm.tsx`

The debounce lives inside `InnerHmisForm`. We need `dataSet` to build the draft key, which is currently not passed to `HmisForm`. We'll add it as a new prop.

- [ ] **Step 1: Extend `HmisFormProps`.**

At the top of `HmisForm.tsx`:

```ts
import type { HmisDraft } from "../db/hmis-drafts";
```

Extend the interface:

```ts
export interface HmisFormProps {
    period?: string;
    orgUnit?: string;
    dataSet?: string;
    initialValues?: HmisFormValues;
    readOnly?: boolean;
    config: HmisFormConfig;
    onSave?: (payload: { ... }) => void | Promise<void>;
    attributeOptionCombo: string;
    isVerified?: boolean;
    syncStatus?: HmisDraft["syncStatus"];
}
```

- [ ] **Step 2: Import the draft helpers inside `HmisForm.tsx`.**

```ts
import {
    draftId,
    getHmisDraft,
    patchHmisDraft,
    upsertHmisDraft,
} from "../db/hmis-drafts";
```

- [ ] **Step 3: Remove the re-seed `useEffect`.**

Find and delete (spec Section 1 explicitly requires this):

```ts
React.useEffect(() => {
    setValues(initialValues ?? new Map());
}, [initialValues]);
```

- [ ] **Step 4: Add the debounced draft writer.**

Inside `InnerHmisForm`, after `const [values, setValues] = React.useState<HmisFormValues>(initialValues ?? new Map());`, add:

```ts
const draftKey =
    dataSet && period && orgUnit && attributeOptionCombo
        ? draftId({
              dataSet,
              period,
              orgUnit,
              attributeOptionCombo,
          })
        : undefined;

const draftTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
const latestValuesRef = React.useRef<HmisFormValues>(values);

// Keep the latest-values ref in sync so the unmount flush writes fresh data.
React.useEffect(() => {
    latestValuesRef.current = values;
}, [values]);

const flushDraft = React.useCallback(
    async (nextValues: HmisFormValues) => {
        if (!draftKey || !dataSet || !period || !orgUnit) return;
        const existing = await getHmisDraft(draftKey);
        await upsertHmisDraft({
            id: draftKey,
            dataSet,
            period,
            orgUnit,
            attributeOptionCombo,
            values: Object.fromEntries(nextValues),
            isVerified: existing?.isVerified ?? false,
            verifiedAt: existing?.verifiedAt,
            updatedAt: Date.now(),
            syncStatus:
                existing?.syncStatus === "synced"
                    ? "draft"
                    : existing?.syncStatus ?? "draft",
        });
    },
    [draftKey, dataSet, period, orgUnit, attributeOptionCombo],
);

// Final flush on unmount — only when there's a pending timer to avoid a
// redundant write when the user has already stopped typing for 500 ms.
// If an in-flight `flushDraft` promise from an earlier timer is still
// resolving when unmount fires, both writes carry the same `values` payload
// (via `latestValuesRef`), and Dexie's `put` is last-write-wins on the same
// primary key — safe by construction, not by ordering.
React.useEffect(() => {
    return () => {
        if (draftTimerRef.current !== null) {
            clearTimeout(draftTimerRef.current);
            draftTimerRef.current = null;
            void flushDraft(latestValuesRef.current);
        }
    };
    // Intentionally not depending on flushDraft — this effect is a lifecycle
    // hook, not a data effect. flushDraft is closed over via useRef pattern.
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

- [ ] **Step 5: Route `setValue` through the debounced writer.**

Update the existing `setValue` `useCallback`. The timer callback nulls the ref before firing so the unmount cleanup can distinguish "pending timer" from "already fired":

```ts
const setValue = React.useCallback(
    ({
        dataElement,
        categoryOptionCombo,
        value,
    }: {
        dataElement: string;
        categoryOptionCombo: string;
        value: string;
    }) => {
        setValues((previous) => {
            const next = new Map(previous).set(
                dataValueKey(
                    dataElement,
                    categoryOptionCombo,
                    attributeOptionCombo,
                ),
                value,
            );
            if (draftTimerRef.current !== null) {
                clearTimeout(draftTimerRef.current);
            }
            draftTimerRef.current = setTimeout(() => {
                draftTimerRef.current = null;
                void flushDraft(next);
            }, 500);
            return next;
        });
    },
    [attributeOptionCombo, flushDraft],
);
```

- [ ] **Step 6: Typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: still errors from Task 1.2 (`isVerified`/`syncStatus` on wrappers) — that's fine. No *new* errors from this task.

### Task 1.4: Verify path via `completeDataSetRegistrations`

**Files:**
- Modify: `src/routes/reports.data-set.tsx`

- [ ] **Step 1: Update the `onSave` function.**

Replace the existing `onSave` with:

```ts
const onSave = async (values: {
    period?: string | undefined;
    orgUnit?: string | undefined;
    dataValues: {
        dataElement: string;
        categoryOptionCombo: string;
        value: string;
        attributeOptionCombo: string;
    }[];
}) => {
    if (!dataSet || !period || !orgUnit || !attribution) {
        message.error("Missing dataset/period/organisation before verifying.");
        return;
    }
    const id = draftId({
        dataSet,
        period,
        orgUnit,
        attributeOptionCombo: attribution,
    });
    const now = Date.now();

    try {
        await engine.mutate({
            resource: "dataValueSets",
            data: {
                ...values,
                dataSet,
                completionDate: new Date().toISOString(),
                period,
                orgUnit,
                attributeOptionCombo: attribution,
            },
            type: "create",
            params: { async: true },
        });

        await engine.mutate({
            resource: "completeDataSetRegistrations",
            type: "create",
            data: {
                completeDataSetRegistrations: [
                    {
                        dataSet,
                        period,
                        organisationUnit: orgUnit,
                        attributeOptionCombo: attribution,
                        completed: true,
                        date: new Date().toISOString(),
                    },
                ],
            },
        });

        await upsertHmisDraft({
            id,
            dataSet,
            period,
            orgUnit,
            attributeOptionCombo: attribution,
            values: {},
            isVerified: true,
            verifiedAt: now,
            updatedAt: now,
            syncStatus: "synced",
        });

        message.success("Report Verified Successfully");
    } catch (err) {
        const existing = await getHmisDraft(id);
        await upsertHmisDraft({
            id,
            dataSet,
            period,
            orgUnit,
            attributeOptionCombo: attribution,
            values:
                existing?.values ??
                Object.fromEntries(
                    values.dataValues.map((dv) => [
                        `${dv.dataElement}_${dv.categoryOptionCombo}_${dv.attributeOptionCombo}`,
                        dv.value,
                    ]),
                ),
            isVerified: true,
            verifiedAt: now,
            updatedAt: now,
            syncStatus: "pending",
        });
        message.error("Verification queued — will sync when online.");
        console.error("Verify failed:", err);
    }
};
```

- [ ] **Step 2: Add missing imports.**

Add to the imports at the top:

```ts
import { getHmisDraft, upsertHmisDraft } from "../db/hmis-drafts";
```

- [ ] **Step 3: Force a loader refetch after verify.**

TanStack Router refetches on navigation but not on same-URL state changes. The verify path mutates local + server state that the loader consumed, so we need to invalidate the loader cache.

Version check first — confirm `@tanstack/react-router@^1.169` (already in `package.json`) exposes `useRouter().invalidate()`. Quick check: `pnpm exec node -e 'console.log(Object.keys(require("@tanstack/react-router")))'` should list `useRouter`. If it does not exist in the installed version, use `router.load({ purge: true })` or navigate to the same URL with a bump on a search key.

Add:

```ts
import { useRouter } from "@tanstack/react-router";
```

Inside `Reports()`:

```ts
const router = useRouter();
```

At the end of the try block and the catch block (before the success/error toast), add:

```ts
await router.invalidate();
```

- [ ] **Step 4: Typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: still Task 1.5's pending errors on `isVerified`/`syncStatus` props. No new errors from this task.

### Task 1.5: Button state matrix + prop threading

**Files:**
- Modify: `src/components/HmisForm.tsx`

The prop already exists after Task 1.3. Now consume it in the button.

- [ ] **Step 1: Import the icon.**

At the top of `HmisForm.tsx`:

```ts
import { CheckCircleOutlined } from "@ant-design/icons";
```

- [ ] **Step 2: Destructure the new props inside `InnerHmisForm`.**

```ts
const InnerHmisForm: React.FC<HmisFormProps> = ({
    period,
    orgUnit,
    dataSet,
    initialValues,
    readOnly = false,
    config,
    onSave,
    attributeOptionCombo,
    isVerified = false,
    syncStatus = "draft",
}) => {
```

- [ ] **Step 3: Compute effective read-only.**

Just after the destructuring, add:

```ts
const effectiveReadOnly = readOnly || (isVerified && syncStatus === "synced");
```

**Change the value passed at exactly two sites** inside the body of `InnerHmisForm` — nowhere else. This is *not* a rename or find-and-replace: every other `readOnly` in the file is a locally-scoped parameter on `FieldCell` / `RenderCell` / `renderRow` / `SectionTable` and MUST stay untouched.

1. In the `tab.sections.map(...)` inside `InnerHmisForm`, on the `<SectionTable>` element, change the prop from `readOnly={readOnly}` to `readOnly={effectiveReadOnly}`.
2. In the `Card`'s `extra` Button, change `disabled={readOnly}` to `disabled={effectiveReadOnly}`.

Confirm with: `grep -n "effectiveReadOnly" src/components/HmisForm.tsx` — expect exactly three matches (the `const` definition + the two prop/attr sites).

- [ ] **Step 4: Replace the button.**

Find the `<Button ...>Mark Report as Verified</Button>` in the `Card` `extra`. Replace with:

```tsx
{isVerified && syncStatus === "synced" ? (
    <Button
        type="default"
        icon={<CheckCircleOutlined />}
        disabled
    >
        Verified and Submitted
    </Button>
) : (
    <Button
        type="default"
        onClick={handleSave}
        disabled={effectiveReadOnly}
        loading={loading}
    >
        {isVerified && syncStatus === "pending"
            ? "Retry Verification"
            : "Mark Report as Verified"}
    </Button>
)}
```

- [ ] **Step 5: Thread `dataSet` from the route to each form wrapper.**

In `src/routes/reports.data-set.tsx`, inside the `dataSets` record, add `dataSet={dataSet}` to every form component instance:

```tsx
<Hmis033bForm
    attributeOptionCombo={"HllvX50cXC0"}
    orgUnit={orgUnit}
    dataSet={dataSet}
    initialValues={initialValues}
    isVerified={isVerified}
    syncStatus={syncStatus}
    period={period}
    onSave={onSave}
/>
```

Do this for all 10 form components. `dataSet` is already in scope in `Reports()` via `DataSetReportRoute.useSearch()`.

- [ ] **Step 6: Full typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: **no errors.**

- [ ] **Step 7: Full test suite.**

Run: `pnpm test:vitest`

Expected: all tests pass.

- [ ] **Step 8: Manual QA (dev server against dev DHIS2 instance).**

Follow the spec's QA plan:
1. Pick a form with an editable row (e.g. HMIS 105:06-09). Type values into an editable cell, hard-refresh the browser — values reappear (draft persistence).
2. Try to type into a disabled cell — nothing happens.
3. Click "Mark Report as Verified" → success toast → button flips to "Verified and Submitted" with check icon, is disabled, all fields become read-only.
4. Refresh the browser — button still reads "Verified and Submitted".
5. Open DevTools → Network → Offline. Edit a report with `syncStatus: "draft"`, click Verify → error toast "Verification queued — will sync when online." Button re-renders as "Retry Verification". Refresh (still offline) — same state persists. Return online, click Retry — success.
6. Search org-unit tree: `Kampala` finds Kampala + descendants; `KAWEMPE` finds Kawempe.
7. Visual check: disabled cells render pure black text on grey background.

- [ ] **Step 9: Commit all Section 1 changes together (they only make sense as a set).**

```bash
git add src/components/HmisForm.tsx src/routes/reports.data-set.tsx
git commit -m "feat: persist HMIS drafts + verify state via completeDataSetRegistrations"
```

---

## Post-flight

- [ ] **Full typecheck.**

Run: `pnpm exec tsc --noEmit`

Expected: no errors.

- [ ] **Full Vitest suite.**

Run: `pnpm test:vitest`

Expected: all tests pass — `no-duplicate-headers.test.ts`, `editable-scope.test.ts`, `org-unit-search.test.ts`, `hmis-drafts.test.ts`.

- [ ] **Production build.**

Run: `pnpm build`

Expected: `d2-app-scripts` completes; `scripts/patch-sw.js` runs in `postbuild`; no errors.

- [ ] **Push branch and open PR** (only if the human requests it — do not push autonomously).

---

## Rollback

If any task lands in a broken state:
- `git log --oneline main..HEAD` to see task-level commits.
- Each Section 4, Section 3, Section 2 task committed independently — revert individually with `git revert <sha>`.
- Section 1 is one atomic commit (data-model wiring only makes sense as a set). Revert with `git revert <sha>`.
- The Dexie `.version(3)` addition is safe to roll back: if version 3 never ran, no schema migration happened. If it did run, the table remains but is unused — Dexie tolerates unreferenced tables.

---

## Notes for the implementer

- **Do not use `npm` or `yarn`.** Use `pnpm` for every install/script/test invocation — `package.json` declares `pnpm@10.13.1`.
- **DHIS2 API path in the loader** uses `../../../api/...` relative — the DHIS2 app is hosted under `/api/apps/<app>/index.html`. If your dev environment uses a different mount, adjust the path or use an absolute URL to the dev proxy target.
- **Circular type import** in `src/db/index.ts` (importing `HmisDraft` from `./hmis-drafts` which itself imports `db` from `./index`) is fine because `import type` erases at runtime.
- **Do not** refactor unrelated code in `HmisForm.tsx` — the file is long but focused. Confine edits to what tasks specify.
- **Do not** modify `no-duplicate-headers.test.ts` — it should continue to pass unchanged.
- **Auto-generated configs:** the `Hmis*.config.ts` files carry a comment noting they are auto-generated. The `editableScope` field is a hand-added metadata annotation — if configs are regenerated in the future, `editableScope` values will need to be re-applied. Consider extracting them to a sidecar in a follow-up if regeneration becomes routine.
