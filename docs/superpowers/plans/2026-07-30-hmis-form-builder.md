# HMIS Form Builder — Implementation Plan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins add / remove / reorder tabs, sections, rows, and cells for HMIS reports from within the app, backed by a shared DHIS2 dataStore doc, without touching the runtime renderer.

**Architecture:** Introduce a v2 data model (`FormConfigDoc { forms, templates }`) close to antd Table shape (columns[] + rows{cells by column key}). A converter turns the 10 bundled legacy configs into v2; a back-converter `renderV2AsLegacy` produces the legacy shape at runtime so `HmisForm` doesn't change. All admin edits flow through pure reducers and get saved to `dataStore/eregisters/hmis-form-configs`. Section reuse works via `SectionSlot` refs to shared templates.

**Tech Stack:** React 18, TanStack Router, DHIS2 App Runtime (`useDataEngine`), Dexie 4, antd v6, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-30-hmis-form-builder-design.md`

---

## File map

**New**
- `src/form-configs/v2-types.ts` — the v2 type surface (`FormConfigDoc`, `FormV2`, `TabV2`, `SectionSlot`, `SectionV2`, `ColumnV2`, `RowV2`, `CellV2`).
- `src/form-configs/convert-to-v2.ts` (+ test) — legacy `HmisFormConfig` → `FormV2`.
- `src/form-configs/render-v2-as-legacy.ts` (+ test) — v2 → legacy shape the current renderer knows, resolving `ref` sections against `templates`.
- `src/form-configs/bundled.ts` — a `BUNDLED: Record<string, HmisFormConfig>` map wiring every existing config file, plus `BUNDLED_FORM_IDS`.
- `src/form-configs/get-form-config.ts` — resolver used by wrappers.
- `src/db/form-config-doc.ts` — typed dataStore read/write + a Dexie mirror table `hmisFormConfigs`.
- `src/hooks/useHmisFormConfigs.ts` — hook subscribing to the Dexie mirror.
- `src/utils/ensure-form-configs-seeded.ts` — first-run seed helper.
- `src/routes/admin.form-builder.tsx` — the editor route (skeleton + composition).
- `src/routes/admin.form-builder/reducers.ts` (+ test) — pure state reducers.
- `src/routes/admin.form-builder/section-editor.tsx` — the section card (columns, rows, cells) — kept out of the top-level route to keep files focused.
- `src/routes/admin.form-builder/templates-panel.tsx` — right-hand templates library.

**Modify**
- `src/App.tsx` — call `ensureFormConfigsSeeded(engine)` after user + org unit are known.
- `src/routes/admin.tsx` — add `"form-builder"` nav item.
- `src/db/index.ts` — declare the new Dexie table.
- Ten form wrappers (`src/components/Hmis033b.tsx`, `Hmis10501.tsx`, `Hmis1050203.tsx`, `Hmis1050405.tsx`, `Hmis1050609.tsx`, `Hmis10510.tsx`, `Hmis106A0102.tsx`, `Hmis106A03.tsx`, `Hmis106A04.tsx`, `Hmis108.tsx`) — call `getFormConfig(id, doc)` instead of the direct bundled import.
- `src/router.tsx` — register the new route.

**Left untouched (Phase 1)**
- `src/components/HmisForm.tsx` — still consumes the legacy shape.
- All ten `src/form-configs/Hmis*.config.ts` — remain as first-run seed.

---

## Task 1: v2 type surface

**Files:**
- Create: `src/form-configs/v2-types.ts`

- [ ] **Step 1: Write the types**

```ts
import type { HmisEditableScope } from "./types";

export type CellV2 = {
    kind: "label" | "field";
    text?: string;
    dataElement?: string;
    categoryOptionCombo?: string;
    attributeOptionCombo?: string;
    disabled?: boolean;
    total?: boolean;
    rowSpan?: number;
    colSpan?: number;
    style?: {
        background?: string;
        align?: "left" | "center" | "right";
        verticalAlign?: "top" | "middle" | "bottom";
    };
};

export type ColumnV2 = {
    key: string;
    title?: string;
    width?: number;
    children?: ColumnV2[];
};

export type RowV2 = {
    key: string;
    type?: "data" | "label" | "subhead";
    cells: Record<string, CellV2>;
};

export type SectionV2 = {
    key: string;
    title: string;
    frozenColumns?: number;
    columns: ColumnV2[];
    rows: RowV2[];
};

export type SectionSlot =
    | { kind: "inline"; section: SectionV2 }
    | {
          kind: "ref";
          templateId: string;
          overrides?: Partial<Pick<SectionV2, "title" | "frozenColumns">>;
      };

export type TabV2 = { key: string; label: string; sections: SectionSlot[] };

export type FormV2 = {
    id: string;
    title: string;
    editableScope?: HmisEditableScope;
    tabs: TabV2[];
};

export type FormConfigDoc = {
    version: 2;
    forms: Record<string, FormV2>;
    templates: Record<string, SectionV2>;
};

export const EMPTY_FORM_CONFIG_DOC: FormConfigDoc = {
    version: 2,
    forms: {},
    templates: {},
};
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|Hmis108|src/collections/" | head`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/form-configs/v2-types.ts
git commit -m "feat(hmis-form-builder): add v2 type surface"
```

---

## Task 2: Bundled registry + resolver stub

**Files:**
- Create: `src/form-configs/bundled.ts`
- Create: `src/form-configs/get-form-config.ts`

- [ ] **Step 1: Write `bundled.ts`**

```ts
import type { HmisFormConfig } from "./types";
import { HMIS_033B_CONFIG } from "./Hmis033b.config";
import { HMIS_105_01_SECTION_1_CONFIG } from "./Hmis10501.config";
import { HMIS_105_02_03_CONFIG } from "./Hmis1050203.config";
import { HMIS_105_04_05_CONFIG } from "./Hmis1050405.config";
import { HMIS_105_06_09_CONFIG } from "./Hmis1050609.config";
import { HMIS_105_10_CONFIG } from "./Hmis10510.config";
import { HMIS_106A_01_02_CONFIG } from "./Hmis106A0102.config";
import { HMIS_106A_03_CONFIG } from "./Hmis106A03.config";
import { HMIS_106A_04_CONFIG } from "./Hmis106A04.config";
import { HMIS_108_CONFIG } from "./Hmis108.config";

export const BUNDLED: Record<string, HmisFormConfig> = {
    [HMIS_033B_CONFIG.id]: HMIS_033B_CONFIG,
    [HMIS_105_01_SECTION_1_CONFIG.id]: HMIS_105_01_SECTION_1_CONFIG,
    [HMIS_105_02_03_CONFIG.id]: HMIS_105_02_03_CONFIG,
    [HMIS_105_04_05_CONFIG.id]: HMIS_105_04_05_CONFIG,
    [HMIS_105_06_09_CONFIG.id]: HMIS_105_06_09_CONFIG,
    [HMIS_105_10_CONFIG.id]: HMIS_105_10_CONFIG,
    [HMIS_106A_01_02_CONFIG.id]: HMIS_106A_01_02_CONFIG,
    [HMIS_106A_03_CONFIG.id]: HMIS_106A_03_CONFIG,
    [HMIS_106A_04_CONFIG.id]: HMIS_106A_04_CONFIG,
    [HMIS_108_CONFIG.id]: HMIS_108_CONFIG,
};

export const BUNDLED_FORM_IDS = Object.keys(BUNDLED);
```

**Note:** the exact exported constant names above may differ. Confirm each by opening the `.config.ts` file and matching the top-level `export const …_CONFIG`.

- [ ] **Step 2: Write `get-form-config.ts` (stub — resolver used by wrappers)**

```ts
import type { HmisFormConfig } from "./types";
import type { FormConfigDoc } from "./v2-types";
import { BUNDLED } from "./bundled";
import { renderV2AsLegacy } from "./render-v2-as-legacy";

export function getFormConfig(
    id: string,
    doc: FormConfigDoc | undefined,
): HmisFormConfig {
    const v2 = doc?.forms?.[id];
    if (v2) return renderV2AsLegacy(v2, doc!.templates);
    return BUNDLED[id];
}
```

`renderV2AsLegacy` doesn't exist yet — that's fine, Task 4 adds it. TypeScript will error until then, but we won't run tsc between Steps 2 and Step 3.

- [ ] **Step 3: Commit (skip typecheck — resolver's dep lands in Task 4)**

```bash
git add src/form-configs/bundled.ts src/form-configs/get-form-config.ts
git commit -m "feat(hmis-form-builder): bundle registry + resolver stub"
```

---

## Task 3: Converter legacy → v2

**Files:**
- Create: `src/form-configs/convert-to-v2.ts`
- Create: `src/form-configs/convert-to-v2.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import type { HmisFormConfig } from "./types";
import { convertLegacyForm } from "./convert-to-v2";

const legacy: HmisFormConfig = {
    id: "test-form",
    title: "Test form",
    editableScope: { mode: "all" },
    tabs: [
        {
            key: "t1",
            label: "Tab 1",
            sections: [
                {
                    key: "s1",
                    title: "Section 1",
                    columnCount: 2,
                    columns: [
                        { key: "c0", index: 0 },
                        { key: "c1", index: 1 },
                    ],
                    rows: [
                        {
                            key: "r1",
                            cells: [
                                {
                                    key: "r1c0",
                                    kind: "label",
                                    text: "Male",
                                },
                                {
                                    key: "r1c1",
                                    kind: "field",
                                    dataElement: "DE1",
                                    categoryOptionCombo: "COC1",
                                    colSpan: 2,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

describe("convertLegacyForm", () => {
    it("produces v2 with columns keyed by column.key and cells keyed by column.key", () => {
        const v2 = convertLegacyForm(legacy);
        expect(v2.id).toBe("test-form");
        expect(v2.title).toBe("Test form");
        expect(v2.editableScope).toEqual({ mode: "all" });
        expect(v2.tabs[0].sections[0]).toEqual({
            kind: "inline",
            section: {
                key: "s1",
                title: "Section 1",
                frozenColumns: undefined,
                columns: [
                    { key: "c0", title: undefined, width: undefined },
                    { key: "c1", title: undefined, width: undefined },
                ],
                rows: [
                    {
                        key: "r1",
                        type: undefined,
                        cells: {
                            c0: { kind: "label", text: "Male" },
                            c1: {
                                kind: "field",
                                dataElement: "DE1",
                                categoryOptionCombo: "COC1",
                                colSpan: 2,
                            },
                        },
                    },
                ],
            },
        });
    });

    it("drops blank cells (no text and no dataElement)", () => {
        const withBlank: HmisFormConfig = {
            ...legacy,
            tabs: [
                {
                    ...legacy.tabs[0],
                    sections: [
                        {
                            ...legacy.tabs[0].sections[0],
                            rows: [
                                {
                                    key: "r1",
                                    cells: [
                                        { key: "r1c0", kind: "label" },
                                        {
                                            key: "r1c1",
                                            kind: "field",
                                            dataElement: "DE1",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const v2 = convertLegacyForm(withBlank);
        const slot = v2.tabs[0].sections[0];
        if (slot.kind !== "inline") throw new Error("expected inline");
        expect(Object.keys(slot.section.rows[0].cells)).toEqual(["c1"]);
    });
});
```

- [ ] **Step 2: Run — expect failure**

Run: `pnpm exec vitest run src/form-configs/convert-to-v2.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement converter**

```ts
import type {
    HmisCellConfig,
    HmisColumnConfig,
    HmisFormConfig,
    HmisRowConfig,
    HmisSectionConfig,
} from "./types";
import type {
    CellV2,
    ColumnV2,
    FormV2,
    RowV2,
    SectionSlot,
    SectionV2,
    TabV2,
} from "./v2-types";

function convertCell(legacy: HmisCellConfig): CellV2 {
    return {
        kind: legacy.kind,
        text: legacy.text,
        dataElement: legacy.dataElement,
        categoryOptionCombo: legacy.categoryOptionCombo,
        attributeOptionCombo: legacy.attributeOptionCombo,
        disabled: legacy.disabled,
        total: legacy.total,
        rowSpan: legacy.rowSpan,
        colSpan: legacy.colSpan,
        style: legacy.style
            ? {
                  background: legacy.style.background,
                  align: legacy.style.align as CellV2["style"] extends infer S
                      ? S extends { align?: infer A }
                          ? A
                          : never
                      : never,
                  verticalAlign: legacy.style.verticalAlign,
              }
            : undefined,
    };
}

function isBlankCell(cell: HmisCellConfig): boolean {
    return !cell.text && !cell.dataElement && !cell.title;
}

function convertColumn(legacy: HmisColumnConfig): ColumnV2 {
    return { key: legacy.key, title: undefined, width: legacy.width };
}

function convertRow(
    legacy: HmisRowConfig,
    columns: HmisColumnConfig[],
): RowV2 {
    const cells: Record<string, CellV2> = {};
    legacy.cells.forEach((cell, index) => {
        if (isBlankCell(cell)) return;
        const col = columns[index];
        if (!col) return;
        cells[col.key] = convertCell(cell);
    });
    return { key: legacy.key, type: legacy.type, cells };
}

function convertSection(legacy: HmisSectionConfig): SectionV2 {
    const columns = legacy.columns ?? [];
    return {
        key: legacy.key,
        title: legacy.title,
        frozenColumns: legacy.frozenColumns,
        columns: columns.map(convertColumn),
        rows: legacy.rows.map((r) => convertRow(r, columns)),
    };
}

function convertTab(legacy: HmisFormConfig["tabs"][number]): TabV2 {
    return {
        key: legacy.key,
        label: legacy.label,
        sections: legacy.sections.map(
            (s): SectionSlot => ({ kind: "inline", section: convertSection(s) }),
        ),
    };
}

export function convertLegacyForm(legacy: HmisFormConfig): FormV2 {
    return {
        id: legacy.id,
        title: legacy.title,
        editableScope: legacy.editableScope,
        tabs: legacy.tabs.map(convertTab),
    };
}
```

- [ ] **Step 4: Run — expect pass**

Run: `pnpm exec vitest run src/form-configs/convert-to-v2.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/form-configs/convert-to-v2.ts src/form-configs/convert-to-v2.test.ts
git commit -m "feat(hmis-form-builder): converter legacy -> v2"
```

---

## Task 4: Back-converter v2 → legacy + round-trip test

**Files:**
- Create: `src/form-configs/render-v2-as-legacy.ts`
- Create: `src/form-configs/render-v2-as-legacy.test.ts`

- [ ] **Step 1: Failing test — round-trip a real bundled config**

```ts
import { describe, expect, it } from "vitest";
import { BUNDLED } from "./bundled";
import { convertLegacyForm } from "./convert-to-v2";
import { renderV2AsLegacy } from "./render-v2-as-legacy";
import type { HmisCellConfig, HmisFormConfig } from "./types";

function normaliseCell(c: HmisCellConfig) {
    return {
        kind: c.kind,
        text: c.text,
        dataElement: c.dataElement,
        categoryOptionCombo: c.categoryOptionCombo,
        colSpan: c.colSpan,
        rowSpan: c.rowSpan,
    };
}

function normalise(config: HmisFormConfig) {
    return config.tabs.map((t) =>
        t.sections.map((s) =>
            s.rows.map((r) =>
                (s.columns ?? []).map((_col, i) => {
                    const cell = r.cells[i];
                    if (!cell) return null;
                    if (!cell.text && !cell.dataElement && !cell.title)
                        return null;
                    return normaliseCell(cell);
                }),
            ),
        ),
    );
}

describe("renderV2AsLegacy round-trip", () => {
    it.each(Object.keys(BUNDLED))(
        "%s: convert then back preserves cell data",
        (id) => {
            const legacy = BUNDLED[id];
            const v2 = convertLegacyForm(legacy);
            const back = renderV2AsLegacy(v2, {});
            expect(normalise(back)).toEqual(normalise(legacy));
        },
    );

    it("inlines a ref against templates", () => {
        const back = renderV2AsLegacy(
            {
                id: "f",
                title: "f",
                tabs: [
                    {
                        key: "t",
                        label: "t",
                        sections: [
                            {
                                kind: "ref",
                                templateId: "tpl1",
                                overrides: { title: "Overridden" },
                            },
                        ],
                    },
                ],
            },
            {
                tpl1: {
                    key: "tpl1",
                    title: "Original",
                    columns: [{ key: "c0" }],
                    rows: [
                        {
                            key: "r0",
                            cells: { c0: { kind: "label", text: "hi" } },
                        },
                    ],
                },
            },
        );
        expect(back.tabs[0].sections[0].title).toBe("Overridden");
        expect(back.tabs[0].sections[0].rows[0].cells[0]).toMatchObject({
            kind: "label",
            text: "hi",
        });
    });
});
```

- [ ] **Step 2: Run — expect failure**

Run: `pnpm exec vitest run src/form-configs/render-v2-as-legacy.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement back-converter**

```ts
import type {
    HmisCellConfig,
    HmisColumnConfig,
    HmisFormConfig,
    HmisRowConfig,
    HmisSectionConfig,
} from "./types";
import type {
    CellV2,
    ColumnV2,
    FormV2,
    RowV2,
    SectionSlot,
    SectionV2,
    TabV2,
} from "./v2-types";

function backCell(v2: CellV2, key: string): HmisCellConfig {
    return {
        key,
        kind: v2.kind,
        text: v2.text,
        dataElement: v2.dataElement,
        categoryOptionCombo: v2.categoryOptionCombo,
        attributeOptionCombo: v2.attributeOptionCombo,
        disabled: v2.disabled,
        total: v2.total,
        rowSpan: v2.rowSpan,
        colSpan: v2.colSpan,
        style: v2.style,
    };
}

function placeholderCell(key: string): HmisCellConfig {
    return { key, kind: "label" };
}

function backColumn(v2: ColumnV2, index: number): HmisColumnConfig {
    return { key: v2.key, index, width: v2.width };
}

function backRow(
    v2: RowV2,
    columns: ColumnV2[],
    sectionKey: string,
): HmisRowConfig {
    return {
        key: v2.key,
        type: v2.type,
        cells: columns.map((c) => {
            const cell = v2.cells[c.key];
            return cell
                ? backCell(cell, `${sectionKey}-${v2.key}-${c.key}`)
                : placeholderCell(`${sectionKey}-${v2.key}-${c.key}`);
        }),
    };
}

function backSection(v2: SectionV2): HmisSectionConfig {
    return {
        key: v2.key,
        title: v2.title,
        columnCount: v2.columns.length,
        frozenColumns: v2.frozenColumns,
        columns: v2.columns.map(backColumn),
        rows: v2.rows.map((r) => backRow(r, v2.columns, v2.key)),
    };
}

function resolveSlot(
    slot: SectionSlot,
    templates: Record<string, SectionV2>,
): SectionV2 | null {
    if (slot.kind === "inline") return slot.section;
    const tpl = templates[slot.templateId];
    if (!tpl) return null;
    return { ...tpl, ...slot.overrides };
}

export function renderV2AsLegacy(
    form: FormV2,
    templates: Record<string, SectionV2>,
): HmisFormConfig {
    return {
        id: form.id,
        title: form.title,
        editableScope: form.editableScope,
        tabs: form.tabs.map(
            (t: TabV2) => ({
                key: t.key,
                label: t.label,
                sections: t.sections
                    .map((slot) => resolveSlot(slot, templates))
                    .filter((s): s is SectionV2 => s !== null)
                    .map(backSection),
            }),
        ),
    };
}
```

- [ ] **Step 4: Run — expect pass**

Run: `pnpm exec vitest run src/form-configs/render-v2-as-legacy.test.ts`
Expected: PASS (all 10 bundled configs round-trip + ref inlining).

If any bundled config fails round-trip, add a targeted normalisation to `normalise()` (e.g. dropping cells with only `title` set) rather than mutating the converter — the goal is that no *data* is lost, not that every incidental field survives.

- [ ] **Step 5: Full suite**

Run: `pnpm test:vitest`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/form-configs/render-v2-as-legacy.ts src/form-configs/render-v2-as-legacy.test.ts
git commit -m "feat(hmis-form-builder): back-converter v2 -> legacy with round-trip test"
```

---

## Task 5: DataStore doc helpers + Dexie mirror + hook

**Files:**
- Create: `src/db/form-config-doc.ts`
- Modify: `src/db/index.ts`
- Create: `src/hooks/useHmisFormConfigs.ts`

- [ ] **Step 1: Extend Dexie schema**

In `src/db/index.ts`, add a table declaration and bump the Dexie version:

```ts
// Alongside existing table declarations:
hmisFormConfigs!: Table<{ id: "main"; doc: FormConfigDoc }, "main">;

// In the `.version(N)` chain, add a new version with:
hmisFormConfigs: "id",
```

(Use the next unused version number. Check existing `.version()` calls at the bottom of the file.)

Import `FormConfigDoc` from `../form-configs/v2-types`.

- [ ] **Step 2: Write `form-config-doc.ts`**

```ts
import { db } from "./index";
import type { DataEngine } from "@dhis2/app-runtime/services/datastore";
import type { FormConfigDoc } from "../form-configs/v2-types";
import { EMPTY_FORM_CONFIG_DOC } from "../form-configs/v2-types";

const DS_NAMESPACE = "eregisters";
const DS_KEY = "hmis-form-configs";

export async function readServerFormConfigs(
    engine: { query: DataEngine["query"] } | any,
): Promise<FormConfigDoc | null> {
    try {
        const res = await engine.query({
            doc: {
                resource: `dataStore/${DS_NAMESPACE}/${DS_KEY}`,
            },
        });
        return (res.doc as FormConfigDoc) ?? null;
    } catch (err) {
        // 404 on first run — no doc yet.
        return null;
    }
}

export async function writeServerFormConfigs(
    engine: any,
    doc: FormConfigDoc,
): Promise<void> {
    try {
        await engine.mutate({
            type: "update",
            resource: `dataStore/${DS_NAMESPACE}`,
            id: DS_KEY,
            data: doc,
        });
    } catch {
        await engine.mutate({
            type: "create",
            resource: `dataStore/${DS_NAMESPACE}`,
            data: { key: DS_KEY, value: doc },
        });
    }
    await db.hmisFormConfigs.put({ id: "main", doc });
}

export async function readLocalFormConfigs(): Promise<FormConfigDoc> {
    const row = await db.hmisFormConfigs.get("main");
    return row?.doc ?? EMPTY_FORM_CONFIG_DOC;
}

export async function writeLocalFormConfigs(doc: FormConfigDoc): Promise<void> {
    await db.hmisFormConfigs.put({ id: "main", doc });
}
```

- [ ] **Step 3: Write `useHmisFormConfigs.ts`**

```ts
import { liveQuery } from "dexie";
import { useEffect, useState } from "react";
import { db } from "../db";
import { EMPTY_FORM_CONFIG_DOC } from "../form-configs/v2-types";
import type { FormConfigDoc } from "../form-configs/v2-types";

export function useHmisFormConfigs(): FormConfigDoc {
    const [doc, setDoc] = useState<FormConfigDoc>(EMPTY_FORM_CONFIG_DOC);
    useEffect(() => {
        const obs = liveQuery(() => db.hmisFormConfigs.get("main"));
        const sub = obs.subscribe({
            next: (row) => setDoc(row?.doc ?? EMPTY_FORM_CONFIG_DOC),
        });
        return () => sub.unsubscribe();
    }, []);
    return doc;
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|Hmis108|src/collections/" | head`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/db/form-config-doc.ts src/db/index.ts src/hooks/useHmisFormConfigs.ts
git commit -m "feat(hmis-form-builder): dataStore doc helpers + Dexie mirror + hook"
```

---

## Task 6: First-run seed + wire into App boot

**Files:**
- Create: `src/utils/ensure-form-configs-seeded.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the seed helper**

```ts
import { BUNDLED, BUNDLED_FORM_IDS } from "../form-configs/bundled";
import { convertLegacyForm } from "../form-configs/convert-to-v2";
import type { FormConfigDoc } from "../form-configs/v2-types";
import {
    readServerFormConfigs,
    writeServerFormConfigs,
    writeLocalFormConfigs,
} from "../db/form-config-doc";

export async function ensureFormConfigsSeeded(engine: any): Promise<void> {
    const remote = await readServerFormConfigs(engine);
    if (remote && remote.version === 2) {
        await writeLocalFormConfigs(remote);
        return;
    }
    const seeded: FormConfigDoc = {
        version: 2,
        forms: Object.fromEntries(
            BUNDLED_FORM_IDS.map((id) => [id, convertLegacyForm(BUNDLED[id])]),
        ),
        templates: {},
    };
    await writeServerFormConfigs(engine, seeded);
}
```

- [ ] **Step 2: Call it from `App.tsx` boot**

Locate the effect / useDataQuery that already handles user + org unit resolution. Add (after the user info + engine are available):

```ts
useEffect(() => {
    void ensureFormConfigsSeeded(engine);
}, [engine]);
```

Import `ensureFormConfigsSeeded` from `./utils/ensure-form-configs-seeded`.

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|Hmis108|src/collections/" | head`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/utils/ensure-form-configs-seeded.ts
git commit -m "feat(hmis-form-builder): first-run dataStore seed on boot"
```

---

## Task 7: Wire wrappers through the resolver

**Files:**
- Modify: all ten `src/components/Hmis*.tsx` wrappers

- [ ] **Step 1: Refactor one wrapper as the pattern**

Update `src/components/Hmis10501.tsx` to:

```tsx
import React from "react";
import { getFormConfig } from "../form-configs/get-form-config";
import { useHmisFormConfigs } from "../hooks/useHmisFormConfigs";
import { HMIS_105_01_SECTION_1_CONFIG } from "../form-configs/Hmis10501.config";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Props = Omit<HmisFormProps, "config">;

const Hmis10501Form = (props: Props) => {
    const doc = useHmisFormConfigs();
    const config = getFormConfig(HMIS_105_01_SECTION_1_CONFIG.id, doc);
    return <HmisForm config={config} {...props} />;
};

export default Hmis10501Form;
```

- [ ] **Step 2: Repeat for the other nine wrappers**

`Hmis033b.tsx`, `Hmis1050203.tsx`, `Hmis1050405.tsx`, `Hmis1050609.tsx`, `Hmis10510.tsx`, `Hmis106A0102.tsx`, `Hmis106A03.tsx`, `Hmis106A04.tsx`, `Hmis108.tsx` — same shape, swapping the id constant.

- [ ] **Step 3: Typecheck + tests**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|Hmis108|src/collections/" | head && pnpm test:vitest`
Expected: no tsc errors from wrappers; all tests pass.

- [ ] **Step 4: Manual sanity check**

Run: `pnpm start`
Load one HMIS report in the browser → confirm it renders identically (dataStore doc is being read + back-converted; visual should be unchanged since round-trip is data-preserving).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hmis*.tsx
git commit -m "feat(hmis-form-builder): wrappers resolve config via dataStore doc"
```

---

## Task 8: Editor state reducers

**Files:**
- Create: `src/routes/admin.form-builder/reducers.ts`
- Create: `src/routes/admin.form-builder/reducers.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import {
    addSection,
    addTab,
    attachTemplate,
    deleteTab,
    detachTemplate,
    extractTemplate,
    insertRow,
    moveTab,
    renameTab,
    setCell,
} from "./reducers";
import type { FormConfigDoc, FormV2 } from "../../form-configs/v2-types";

function baseDoc(): FormConfigDoc {
    return {
        version: 2,
        forms: {
            f1: {
                id: "f1",
                title: "Form 1",
                tabs: [
                    {
                        key: "t1",
                        label: "Tab 1",
                        sections: [
                            {
                                kind: "inline",
                                section: {
                                    key: "s1",
                                    title: "Section 1",
                                    columns: [{ key: "c0" }],
                                    rows: [
                                        {
                                            key: "r1",
                                            cells: {
                                                c0: {
                                                    kind: "label",
                                                    text: "a",
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        },
        templates: {},
    };
}

describe("editor reducers", () => {
    it("addTab appends a new tab with a generated key", () => {
        const next = addTab(baseDoc(), "f1", "New Tab");
        expect(next.forms.f1.tabs).toHaveLength(2);
        expect(next.forms.f1.tabs[1].label).toBe("New Tab");
    });

    it("renameTab updates label", () => {
        const next = renameTab(baseDoc(), "f1", "t1", "Renamed");
        expect(next.forms.f1.tabs[0].label).toBe("Renamed");
    });

    it("moveTab swaps neighbours", () => {
        const withTwo = addTab(baseDoc(), "f1", "Second");
        const moved = moveTab(withTwo, "f1", 1, -1);
        expect(moved.forms.f1.tabs[0].label).toBe("Second");
    });

    it("deleteTab removes the tab", () => {
        const next = deleteTab(baseDoc(), "f1", "t1");
        expect(next.forms.f1.tabs).toHaveLength(0);
    });

    it("addSection appends an inline section to a tab", () => {
        const next = addSection(baseDoc(), "f1", "t1", "New Section");
        const t = next.forms.f1.tabs[0];
        expect(t.sections).toHaveLength(2);
        const s = t.sections[1];
        if (s.kind !== "inline") throw new Error("expected inline");
        expect(s.section.title).toBe("New Section");
    });

    it("insertRow adds a row to a section", () => {
        const next = insertRow(baseDoc(), "f1", "t1", 0);
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.rows).toHaveLength(2);
    });

    it("setCell writes into a cell", () => {
        const next = setCell(baseDoc(), "f1", "t1", 0, "r1", "c0", {
            kind: "field",
            dataElement: "DE1",
        });
        const s = next.forms.f1.tabs[0].sections[0];
        if (s.kind !== "inline") throw new Error();
        expect(s.section.rows[0].cells.c0).toEqual({
            kind: "field",
            dataElement: "DE1",
        });
    });

    it("extractTemplate + attachTemplate + detachTemplate round-trip", () => {
        const extracted = extractTemplate(baseDoc(), "f1", "t1", 0, "shared-1");
        expect(extracted.templates["shared-1"].key).toBe("s1");
        const slot = extracted.forms.f1.tabs[0].sections[0];
        expect(slot.kind).toBe("ref");

        const attached = attachTemplate(extracted, "f1", "t1", "shared-1");
        expect(attached.forms.f1.tabs[0].sections).toHaveLength(2);
        const newSlot =
            attached.forms.f1.tabs[0].sections[1];
        expect(newSlot.kind).toBe("ref");

        const detached = detachTemplate(attached, "f1", "t1", 1);
        const detachedSlot = detached.forms.f1.tabs[0].sections[1];
        expect(detachedSlot.kind).toBe("inline");
    });
});
```

- [ ] **Step 2: Run — expect failure**

Run: `pnpm exec vitest run src/routes/admin.form-builder/reducers.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement reducers**

```ts
import type {
    CellV2,
    FormConfigDoc,
    FormV2,
    SectionSlot,
    SectionV2,
    TabV2,
} from "../../form-configs/v2-types";

const uid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `k${Math.random().toString(36).slice(2, 10)}`;

function withForm(
    doc: FormConfigDoc,
    formId: string,
    fn: (f: FormV2) => FormV2,
): FormConfigDoc {
    const form = doc.forms[formId];
    if (!form) return doc;
    return { ...doc, forms: { ...doc.forms, [formId]: fn(form) } };
}

function withTab(
    form: FormV2,
    tabKey: string,
    fn: (t: TabV2) => TabV2,
): FormV2 {
    return {
        ...form,
        tabs: form.tabs.map((t) => (t.key === tabKey ? fn(t) : t)),
    };
}

function withSection(
    tab: TabV2,
    index: number,
    fn: (s: SectionV2) => SectionV2,
): TabV2 {
    return {
        ...tab,
        sections: tab.sections.map((slot, i) => {
            if (i !== index) return slot;
            if (slot.kind === "inline")
                return { kind: "inline", section: fn(slot.section) };
            return slot; // refs are read-only via reducers other than detach
        }),
    };
}

export function addTab(
    doc: FormConfigDoc,
    formId: string,
    label: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) => ({
        ...f,
        tabs: [...f.tabs, { key: uid(), label, sections: [] }],
    }));
}

export function renameTab(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    label: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => ({ ...t, label })),
    );
}

export function moveTab(
    doc: FormConfigDoc,
    formId: string,
    index: number,
    delta: -1 | 1,
): FormConfigDoc {
    return withForm(doc, formId, (f) => {
        const tabs = [...f.tabs];
        const target = index + delta;
        if (target < 0 || target >= tabs.length) return f;
        [tabs[index], tabs[target]] = [tabs[target], tabs[index]];
        return { ...f, tabs };
    });
}

export function deleteTab(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) => ({
        ...f,
        tabs: f.tabs.filter((t) => t.key !== tabKey),
    }));
}

export function addSection(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    title: string,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => ({
            ...t,
            sections: [
                ...t.sections,
                {
                    kind: "inline",
                    section: { key: uid(), title, columns: [], rows: [] },
                },
            ],
        })),
    );
}

export function insertRow(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => ({
                ...s,
                rows: [...s.rows, { key: uid(), cells: {} }],
            })),
        ),
    );
}

export function setCell(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    rowKey: string,
    columnKey: string,
    cell: CellV2 | null,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) =>
            withSection(t, sectionIndex, (s) => ({
                ...s,
                rows: s.rows.map((r) => {
                    if (r.key !== rowKey) return r;
                    const cells = { ...r.cells };
                    if (cell === null) delete cells[columnKey];
                    else cells[columnKey] = cell;
                    return { ...r, cells };
                }),
            })),
        ),
    );
}

export function extractTemplate(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
    templateId: string,
): FormConfigDoc {
    const form = doc.forms[formId];
    if (!form) return doc;
    const tab = form.tabs.find((t) => t.key === tabKey);
    if (!tab) return doc;
    const slot = tab.sections[sectionIndex];
    if (!slot || slot.kind !== "inline") return doc;
    const templates = { ...doc.templates, [templateId]: slot.section };
    return withForm(
        { ...doc, templates },
        formId,
        (f) =>
            withTab(f, tabKey, (t) => ({
                ...t,
                sections: t.sections.map((s, i) =>
                    i === sectionIndex
                        ? ({ kind: "ref", templateId } as SectionSlot)
                        : s,
                ),
            })),
    );
}

export function attachTemplate(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    templateId: string,
): FormConfigDoc {
    if (!doc.templates[templateId]) return doc;
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => ({
            ...t,
            sections: [...t.sections, { kind: "ref", templateId }],
        })),
    );
}

export function detachTemplate(
    doc: FormConfigDoc,
    formId: string,
    tabKey: string,
    sectionIndex: number,
): FormConfigDoc {
    return withForm(doc, formId, (f) =>
        withTab(f, tabKey, (t) => {
            const slot = t.sections[sectionIndex];
            if (!slot || slot.kind !== "ref") return t;
            const tpl = doc.templates[slot.templateId];
            if (!tpl) return t;
            const section: SectionV2 = { ...tpl, ...slot.overrides };
            return {
                ...t,
                sections: t.sections.map((s, i) =>
                    i === sectionIndex ? { kind: "inline", section } : s,
                ),
            };
        }),
    );
}
```

- [ ] **Step 4: Run — expect pass**

Run: `pnpm exec vitest run src/routes/admin.form-builder/reducers.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/admin.form-builder/reducers.ts src/routes/admin.form-builder/reducers.test.ts
git commit -m "feat(hmis-form-builder): editor state reducers with tests"
```

---

## Task 9: Admin route skeleton + form/tab management

**Files:**
- Create: `src/routes/admin.form-builder.tsx`
- Modify: `src/router.tsx`
- Modify: `src/routes/admin.tsx`

- [ ] **Step 1: Register route**

In `src/router.tsx`, add:

```ts
import { AdminFormBuilderRoute } from "./routes/admin.form-builder";
// … in the route tree wiring:
AdminRoute.addChildren([AdminSectionLayoutRoute, AdminAppSettingsRoute, AdminFormBuilderRoute])
```

(Exact wiring depends on how the admin subtree is composed today — mirror the existing section-layout registration.)

In `src/routes/admin.tsx`, add to `ADMIN_ITEMS`:

```ts
{
    key: "form-builder",
    path: "/admin/form-builder",
    icon: <FormOutlined />,
    label: "Form Builder",
},
```

Import `FormOutlined` from `@ant-design/icons`.

- [ ] **Step 2: Write the route component (form list + tab strip)**

```tsx
import { createRoute } from "@tanstack/react-router";
import { useDataEngine } from "@dhis2/app-runtime";
import {
    App,
    Button,
    Flex,
    Input,
    List,
    Modal,
    Space,
    Tabs,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { AdminRoute } from "./admin";
import {
    readLocalFormConfigs,
    writeServerFormConfigs,
} from "../db/form-config-doc";
import type { FormConfigDoc } from "../form-configs/v2-types";
import { EMPTY_FORM_CONFIG_DOC } from "../form-configs/v2-types";
import {
    addTab,
    deleteTab,
    moveTab,
    renameTab,
} from "./admin.form-builder/reducers";
import { SectionEditor } from "./admin.form-builder/section-editor";
import { TemplatesPanel } from "./admin.form-builder/templates-panel";

export const AdminFormBuilderRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/form-builder",
    component: FormBuilder,
});

function FormBuilder() {
    const { message } = App.useApp();
    const engine = useDataEngine();
    const [doc, setDoc] = useState<FormConfigDoc>(EMPTY_FORM_CONFIG_DOC);
    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
    const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [renameModal, setRenameModal] = useState<{
        tabKey: string;
        label: string;
    } | null>(null);

    useEffect(() => {
        void readLocalFormConfigs().then(setDoc);
    }, []);

    const formIds = Object.keys(doc.forms).sort();
    const form = selectedFormId ? doc.forms[selectedFormId] : undefined;

    useEffect(() => {
        if (form && !activeTabKey && form.tabs[0])
            setActiveTabKey(form.tabs[0].key);
    }, [form, activeTabKey]);

    const apply = (next: FormConfigDoc) => {
        setDoc(next);
        setDirty(true);
    };

    const save = async () => {
        setSaving(true);
        try {
            await writeServerFormConfigs(engine, doc);
            setDirty(false);
            message.success("Form configs saved");
        } catch (err) {
            console.error(err);
            message.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Flex vertical gap={16} style={{ flex: 1, minHeight: 0, height: "100%" }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
                Form Builder
            </Typography.Title>

            <Flex gap={16} align="stretch" style={{ flex: 1, minHeight: 0 }}>
                <div style={{ width: 240, flexShrink: 0, overflowY: "auto" }}>
                    <List
                        bordered
                        size="small"
                        dataSource={formIds}
                        renderItem={(id) => (
                            <List.Item
                                style={{
                                    cursor: "pointer",
                                    background:
                                        selectedFormId === id
                                            ? "#ede9fe"
                                            : undefined,
                                    fontWeight:
                                        selectedFormId === id ? 600 : undefined,
                                }}
                                onClick={() => {
                                    setSelectedFormId(id);
                                    setActiveTabKey(null);
                                }}
                            >
                                {doc.forms[id].title || id}
                            </List.Item>
                        )}
                    />
                </div>

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    {!form ? (
                        <Typography.Text type="secondary">
                            Select a form to edit.
                        </Typography.Text>
                    ) : (
                        <>
                            <Tabs
                                activeKey={activeTabKey ?? undefined}
                                onChange={setActiveTabKey}
                                items={form.tabs.map((t) => ({
                                    key: t.key,
                                    label: t.label,
                                }))}
                                tabBarExtraContent={
                                    <Space size="small">
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                const label =
                                                    window.prompt(
                                                        "Tab label",
                                                    );
                                                if (!label) return;
                                                apply(
                                                    addTab(
                                                        doc,
                                                        form.id,
                                                        label,
                                                    ),
                                                );
                                            }}
                                        >
                                            + Tab
                                        </Button>
                                        {activeTabKey && (
                                            <>
                                                <Button
                                                    size="small"
                                                    onClick={() =>
                                                        setRenameModal({
                                                            tabKey: activeTabKey,
                                                            label:
                                                                form.tabs.find(
                                                                    (t) =>
                                                                        t.key ===
                                                                        activeTabKey,
                                                                )?.label ?? "",
                                                        })
                                                    }
                                                >
                                                    Rename
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        const idx =
                                                            form.tabs.findIndex(
                                                                (t) =>
                                                                    t.key ===
                                                                    activeTabKey,
                                                            );
                                                        apply(
                                                            moveTab(
                                                                doc,
                                                                form.id,
                                                                idx,
                                                                -1,
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    ← Move
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        const idx =
                                                            form.tabs.findIndex(
                                                                (t) =>
                                                                    t.key ===
                                                                    activeTabKey,
                                                            );
                                                        apply(
                                                            moveTab(
                                                                doc,
                                                                form.id,
                                                                idx,
                                                                1,
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    Move →
                                                </Button>
                                                <Button
                                                    size="small"
                                                    danger
                                                    onClick={() =>
                                                        apply(
                                                            deleteTab(
                                                                doc,
                                                                form.id,
                                                                activeTabKey,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </Space>
                                }
                            />

                            <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                                <SectionEditor
                                    doc={doc}
                                    formId={form.id}
                                    tabKey={activeTabKey}
                                    onChange={apply}
                                />
                            </div>
                        </>
                    )}
                </div>

                <TemplatesPanel
                    doc={doc}
                    formId={selectedFormId}
                    tabKey={activeTabKey}
                    onChange={apply}
                />
            </Flex>

            {selectedFormId && (
                <Flex
                    gap={8}
                    style={{
                        position: "sticky",
                        bottom: 0,
                        background: "#fff",
                        padding: "12px 0",
                        borderTop: "1px solid #f0f0f0",
                    }}
                >
                    <Button
                        type="primary"
                        loading={saving}
                        disabled={!dirty}
                        onClick={save}
                    >
                        Save
                    </Button>
                    {dirty && (
                        <Typography.Text type="warning">
                            Unsaved changes
                        </Typography.Text>
                    )}
                </Flex>
            )}

            <Modal
                open={renameModal !== null}
                title="Rename tab"
                onCancel={() => setRenameModal(null)}
                onOk={() => {
                    if (renameModal && form)
                        apply(
                            renameTab(
                                doc,
                                form.id,
                                renameModal.tabKey,
                                renameModal.label.trim(),
                            ),
                        );
                    setRenameModal(null);
                }}
            >
                <Input
                    value={renameModal?.label ?? ""}
                    onChange={(e) =>
                        setRenameModal((prev) =>
                            prev ? { ...prev, label: e.target.value } : prev,
                        )
                    }
                />
            </Modal>
        </Flex>
    );
}
```

- [ ] **Step 3: Typecheck (expect missing child imports)**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|Hmis108|src/collections/" | head`
Expected: errors about `SectionEditor` / `TemplatesPanel` missing — Task 10 & 11 add them.

- [ ] **Step 4: Commit skeleton**

```bash
git add src/routes/admin.form-builder.tsx src/routes/admin.tsx src/router.tsx
git commit -m "feat(hmis-form-builder): admin route skeleton + form/tab management"
```

---

## Task 10: SectionEditor — sections, columns, rows, cells

**Files:**
- Create: `src/routes/admin.form-builder/section-editor.tsx`

- [ ] **Step 1: Write it**

```tsx
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Flex, Input, Popconfirm, Select, Space, Table, Tag, Typography } from "antd";
import React, { useState } from "react";
import type {
    CellV2,
    FormConfigDoc,
    SectionV2,
} from "../../form-configs/v2-types";
import {
    addSection,
    detachTemplate,
    extractTemplate,
    insertRow,
    setCell,
} from "./reducers";

export function SectionEditor({
    doc,
    formId,
    tabKey,
    onChange,
}: {
    doc: FormConfigDoc;
    formId: string;
    tabKey: string | null;
    onChange: (next: FormConfigDoc) => void;
}) {
    if (!tabKey) return null;
    const form = doc.forms[formId];
    const tab = form.tabs.find((t) => t.key === tabKey);
    if (!tab) return null;

    return (
        <Flex vertical gap={12}>
            <Flex justify="space-between">
                <Typography.Text strong>Sections</Typography.Text>
                <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        const title = window.prompt("Section title");
                        if (title)
                            onChange(addSection(doc, formId, tabKey, title));
                    }}
                >
                    Add section
                </Button>
            </Flex>

            {tab.sections.length === 0 && (
                <Empty description="No sections in this tab yet." />
            )}

            {tab.sections.map((slot, index) => {
                const section: SectionV2 | null =
                    slot.kind === "inline"
                        ? slot.section
                        : { ...doc.templates[slot.templateId], ...slot.overrides };
                if (!section) {
                    return (
                        <Card key={index} size="small" title="(missing template)" />
                    );
                }
                const isRef = slot.kind === "ref";
                return (
                    <Card
                        key={`${section.key}-${index}`}
                        size="small"
                        title={
                            <Space>
                                <span>{section.title}</span>
                                {isRef && (
                                    <Tag color="purple">Template</Tag>
                                )}
                            </Space>
                        }
                        extra={
                            <Space>
                                {isRef ? (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            onChange(
                                                detachTemplate(
                                                    doc,
                                                    formId,
                                                    tabKey,
                                                    index,
                                                ),
                                            )
                                        }
                                    >
                                        Detach
                                    </Button>
                                ) : (
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            const id = window.prompt(
                                                "Template id",
                                            );
                                            if (id)
                                                onChange(
                                                    extractTemplate(
                                                        doc,
                                                        formId,
                                                        tabKey,
                                                        index,
                                                        id,
                                                    ),
                                                );
                                        }}
                                    >
                                        Extract as template
                                    </Button>
                                )}
                                <Button
                                    size="small"
                                    icon={<PlusOutlined />}
                                    disabled={isRef}
                                    onClick={() =>
                                        onChange(insertRow(doc, formId, tabKey, index))
                                    }
                                >
                                    Row
                                </Button>
                            </Space>
                        }
                    >
                        <SectionTable
                            doc={doc}
                            formId={formId}
                            tabKey={tabKey}
                            sectionIndex={index}
                            section={section}
                            readOnly={isRef}
                            onChange={onChange}
                        />
                    </Card>
                );
            })}
        </Flex>
    );
}

function SectionTable({
    doc,
    formId,
    tabKey,
    sectionIndex,
    section,
    readOnly,
    onChange,
}: {
    doc: FormConfigDoc;
    formId: string;
    tabKey: string;
    sectionIndex: number;
    section: SectionV2;
    readOnly: boolean;
    onChange: (next: FormConfigDoc) => void;
}) {
    const columns = section.columns.map((c) => ({
        title: c.title ?? c.key,
        dataIndex: c.key,
        key: c.key,
        onCell: (row: any) => {
            const cell: CellV2 | undefined = row[c.key];
            return cell?.rowSpan || cell?.colSpan
                ? { rowSpan: cell.rowSpan, colSpan: cell.colSpan }
                : {};
        },
        render: (cell: CellV2 | undefined, row: any) => (
            <CellEditor
                cell={cell}
                readOnly={readOnly}
                onChange={(next) =>
                    onChange(
                        setCell(
                            doc,
                            formId,
                            tabKey,
                            sectionIndex,
                            row.__key,
                            c.key,
                            next,
                        ),
                    )
                }
            />
        ),
    }));

    const dataSource = section.rows.map((r) => ({
        key: r.key,
        __key: r.key,
        ...r.cells,
    }));

    return (
        <Table
            size="small"
            pagination={false}
            columns={columns}
            dataSource={dataSource}
        />
    );
}

function CellEditor({
    cell,
    readOnly,
    onChange,
}: {
    cell: CellV2 | undefined;
    readOnly: boolean;
    onChange: (next: CellV2 | null) => void;
}) {
    if (readOnly) {
        return (
            <Typography.Text style={{ fontSize: 11 }}>
                {cell?.text ?? cell?.dataElement ?? ""}
            </Typography.Text>
        );
    }
    const kind = cell?.kind ?? "label";
    return (
        <Space size={4} direction="vertical" style={{ width: "100%" }}>
            <Select
                size="small"
                value={kind}
                style={{ width: "100%" }}
                onChange={(k) =>
                    onChange({
                        ...(cell ?? {}),
                        kind: k as CellV2["kind"],
                    })
                }
                options={[
                    { value: "label", label: "Label" },
                    { value: "field", label: "Field" },
                ]}
            />
            {kind === "label" ? (
                <Input
                    size="small"
                    value={cell?.text ?? ""}
                    onChange={(e) =>
                        onChange({
                            kind: "label",
                            text: e.target.value,
                            colSpan: cell?.colSpan,
                            rowSpan: cell?.rowSpan,
                        })
                    }
                />
            ) : (
                <>
                    <Input
                        size="small"
                        placeholder="dataElement"
                        value={cell?.dataElement ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...(cell ?? { kind: "field" }),
                                kind: "field",
                                dataElement: e.target.value,
                            })
                        }
                    />
                    <Input
                        size="small"
                        placeholder="COC"
                        value={cell?.categoryOptionCombo ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...(cell ?? { kind: "field" }),
                                kind: "field",
                                categoryOptionCombo: e.target.value,
                            })
                        }
                    />
                </>
            )}
            <Space size={4}>
                <Input
                    size="small"
                    placeholder="colSpan"
                    style={{ width: 70 }}
                    value={cell?.colSpan ?? ""}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        onChange({
                            ...(cell ?? { kind }),
                            colSpan: Number.isFinite(v) && v > 0 ? v : undefined,
                        });
                    }}
                />
                <Input
                    size="small"
                    placeholder="rowSpan"
                    style={{ width: 70 }}
                    value={cell?.rowSpan ?? ""}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        onChange({
                            ...(cell ?? { kind }),
                            rowSpan: Number.isFinite(v) && v > 0 ? v : undefined,
                        });
                    }}
                />
                {cell && (
                    <Popconfirm
                        title="Clear cell?"
                        onConfirm={() => onChange(null)}
                    >
                        <Button
                            size="small"
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                )}
            </Space>
        </Space>
    );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|Hmis108|src/collections/" | head`
Expected: only errors related to `TemplatesPanel` missing (Task 11 fixes them).

- [ ] **Step 3: Commit**

```bash
git add src/routes/admin.form-builder/section-editor.tsx
git commit -m "feat(hmis-form-builder): section/column/row/cell editor"
```

---

## Task 11: TemplatesPanel

**Files:**
- Create: `src/routes/admin.form-builder/templates-panel.tsx`

- [ ] **Step 1: Write it**

```tsx
import { Button, Empty, Flex, List, Typography } from "antd";
import React from "react";
import type { FormConfigDoc } from "../../form-configs/v2-types";
import { attachTemplate } from "./reducers";

export function TemplatesPanel({
    doc,
    formId,
    tabKey,
    onChange,
}: {
    doc: FormConfigDoc;
    formId: string | null;
    tabKey: string | null;
    onChange: (next: FormConfigDoc) => void;
}) {
    const templateIds = Object.keys(doc.templates);
    return (
        <div
            style={{
                width: 280,
                flexShrink: 0,
                borderLeft: "1px solid #f0f0f0",
                padding: 12,
                overflowY: "auto",
            }}
        >
            <Typography.Text strong>Templates</Typography.Text>
            {templateIds.length === 0 ? (
                <Empty description="No templates yet — extract a section to make one." />
            ) : (
                <List
                    size="small"
                    dataSource={templateIds}
                    renderItem={(id) => (
                        <List.Item
                            actions={[
                                formId && tabKey ? (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            onChange(
                                                attachTemplate(
                                                    doc,
                                                    formId,
                                                    tabKey,
                                                    id,
                                                ),
                                            )
                                        }
                                    >
                                        Insert
                                    </Button>
                                ) : null,
                            ]}
                        >
                            <Flex vertical gap={0}>
                                <span>{doc.templates[id].title || id}</span>
                                <Typography.Text
                                    type="secondary"
                                    style={{ fontSize: 11 }}
                                >
                                    {id}
                                </Typography.Text>
                            </Flex>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
}
```

- [ ] **Step 2: Typecheck + tests**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|Hmis108|src/collections/" | head && pnpm test:vitest`
Expected: no `admin.form-builder*` errors; all tests pass.

- [ ] **Step 3: Manual smoke test**

Run: `pnpm start` → sign in as admin → open `/admin/form-builder`.

Verify:
1. Form list populated (10 forms).
2. Selecting a form shows its tabs; renaming/adding tabs works.
3. Adding a section, adding a row, editing a cell (label/field/COC/colSpan) works.
4. Extract-as-template moves the section into the right-hand panel; clicking Insert re-attaches it.
5. Save button POSTs to dataStore; refreshing loads it back; opening the corresponding HMIS report still renders (unchanged data).

- [ ] **Step 4: Commit**

```bash
git add src/routes/admin.form-builder/templates-panel.tsx
git commit -m "feat(hmis-form-builder): templates panel"
```

---

## Task 12: End-to-end verification

- [ ] **Step 1: Two-browser round-trip**

Browser A (admin) — add a tab to `Hmis 105:01` called "Testing", Save.
Browser B — refresh, open `/admin/form-builder`, confirm the tab is present. Open the HMIS 105:01 report — confirm the extra empty tab appears alongside the original tabs (rendered as-is by back-converter).

- [ ] **Step 2: Round-trip a real edit**

Add a row to an existing section, put a label in the first cell, Save.
Open the HMIS report → confirm the new label appears in the rendered table.
Remove the row, Save, refresh → confirm it's gone.

- [ ] **Step 3: Template reuse**

Extract a small section as template `shared-attendance`. Attach it to a second tab. Edit the template's title in place (via detach → edit → re-extract, or via direct dataStore edit for now — full in-place template editing is a follow-up). Confirm both attachment points update.

- [ ] **Step 4: Final commit if manual tweaks were needed**

```bash
git add -A
git commit -m "chore(hmis-form-builder): manual verification fixes"
```

---

## Rollback

- Revert commits from Tasks 6 & 7 first (ensures wrappers stop reading from dataStore before the doc/table are dropped). Then revert the rest in reverse order. Dexie mirror table can be left in place (unindexed rows do no harm); if you want it gone, add a `version()` bump that deletes it.

## Follow-ups (out of scope for this plan)

- Native antd-Table renderer inside `HmisForm` consuming v2 directly, deleting `renderV2AsLegacy`, converter, and bundled `.config.ts` files (Phase 2 spec).
- In-editor UI for nested (grouped) column headers.
- In-editor template *editing* (currently must extract-detach-re-extract or edit dataStore directly).
- `Where used` view for templates + delete-blocked-when-referenced.
