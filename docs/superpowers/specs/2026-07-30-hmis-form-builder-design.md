# HMIS form builder — dataStore-backed editor + antd-Table model

## Context

HMIS form configs live as ~210k lines of hand-written TypeScript across 10 `src/form-configs/*.config.ts` files. Non-developer admins cannot add or remove tabs, sections, or rows without a code change. Many sections repeat verbatim across (and within) forms, and the current positional `cells: HmisCellConfig[]` layout makes it easy to break alignment when editing.

We want:

1. Non-developer admins can add / remove / reorder tabs, sections, rows, cells directly in the running app.
2. Duplicate sections stop being duplicated — the same block can be defined once and included by reference in many forms.
3. The stored shape is close to antd Table (`columns[]` + `dataSource[]` with cell-level `onCell` merging), so both the editor and a future native renderer are simple.

Storage lives in DHIS2 `dataStore/eregisters/hmis-form-configs`. Admins edit in the app; all users share the result on next fetch. Bundled `.config.ts` files stay as the first-run seed.

## Design

### 1. Data model (v2)

```ts
type FormConfigDoc = {
    version: 2;
    forms: Record<string, FormV2>;
    templates: Record<string, SectionV2>;
};

type FormV2 = {
    id: string;
    title: string;
    editableScope?: HmisEditableScope;
    tabs: TabV2[];
};

type TabV2 = { key: string; label: string; sections: SectionSlot[] };

type SectionSlot =
    | { kind: "inline"; section: SectionV2 }
    | {
          kind: "ref";
          templateId: string;
          overrides?: Partial<Pick<SectionV2, "title" | "frozenColumns">>;
      };

type SectionV2 = {
    key: string;
    title: string;
    frozenColumns?: number;
    columns: ColumnV2[];
    rows: RowV2[];
};

type ColumnV2 = {
    key: string;
    title?: string;
    width?: number;
    children?: ColumnV2[]; // grouped headers (data model supports; editor Phase 1 ships flat)
};

type RowV2 = {
    key: string;
    type?: "data" | "label" | "subhead";
    cells: Record<string /* column key */, CellV2>; // sparse
};

type CellV2 = {
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
```

**Cells keyed by column id, not positional.** Editing is simpler (no placeholder cells for gaps), and merged cells describe themselves — an author sets `colSpan: 3` on one cell and the renderer's `onCell` returns `{ colSpan: 0 }` for the next two column slots.

**Section reuse via `SectionSlot`.** `ref` means the section is a live reference to a template — edits to the template propagate to every form that includes it. `overrides` covers the small cosmetic fields we want to vary per usage (title, `frozenColumns`) without breaking the link. Editing anything else on a ref forces "detach" (convert to inline).

### 2. Two-phase rollout

**Phase 1 (this spec):**
- Ship the v2 data model, a converter from the legacy shape, and a `renderV2AsLegacy` back-converter.
- Ship the admin editor (`/admin/form-builder`), which writes v2 into dataStore.
- `HmisForm` continues to consume the legacy shape. A resolver reads v2 from `uiConfig`, back-converts to legacy on the fly, and hands it to `HmisForm`. If no v2 doc is present the bundled default is used unchanged.

**Phase 2 (separate follow-up spec, not implemented here):**
- Rewrite `HmisForm.tsx` to consume `SectionV2` natively via antd `Table` with `columns` + `onCell`.
- Delete `renderV2AsLegacy`, delete the converter, delete the bundled `.config.ts` files.

Phasing keeps the runtime hot path unchanged while the editor is validated against real HMIS reports.

### 3. Editor UI — `/admin/form-builder`

Three-column layout mirroring `admin.section-layout.tsx` (whose height cascade and sticky footer are re-used):

- **Left (240px)** — list of forms in the doc. Buttons: `+ New form`, `Reset from bundled default` (per-form).
- **Middle (flex)** — the selected form:
  - Tab strip at top with add / rename / reorder / delete.
  - Vertical list of section cards inside the active tab. Each card header shows title, kind chip (`Inline` / `Template: <name>`), and actions: move up/down, `Convert to template`, `Detach from template`, `Delete`.
  - Inside each card, a live antd Table preview plus two side panels:
    - **Columns panel** — flat list Phase 1 (add / rename / reorder / width / delete). Nested columns are stored but not editable yet.
    - **Rows panel** — list with add / delete / reorder. Selecting a row opens the cell editor: per declared column pick `label` / `field` / `empty`, set text/DE/COC/AOC/span/style. Span changes update the preview live.
- **Right (280px)** — Templates library. `+ Add template` (from selected section, extracts and converts the slot to a `ref`), rename, delete (blocked if referenced — surface which forms/tabs), `Where used` list. Click-to-insert into the active tab.
- **Sticky footer** — Save (writes the whole `FormConfigDoc` back to dataStore). Dirty indicator.

All editor state changes go through **pure reducers** in `src/routes/admin.form-builder/reducers.ts` — `addTab`, `renameTab`, `moveTab`, `deleteTab`, `addSection`, `insertColumn`, `moveColumn`, `insertRow`, `setCell`, `extractTemplate`, `attachTemplate`, `detachTemplate`. Pure reducers keep the editor testable without mounting the UI.

### 4. Converter (legacy → v2)

`src/form-configs/convert-to-v2.ts` — pure `convertLegacyForm(legacy: HmisFormConfig): FormV2`.

- `HmisSectionConfig.columns` (flat) → `SectionV2.columns` (flat; children left empty).
- Positional `HmisRowConfig.cells[i]` paired with `columns[i].key`; blank cells (no `dataElement`, no `text`) are dropped.
- `colSpan` / `rowSpan` copied verbatim — same semantics as antd Table.
- `HmisFormConfig.editableScope` copied verbatim.

### 5. Renderer resolver (Phase 1 only)

```ts
function getFormConfig(id: string, doc?: FormConfigDoc): HmisFormConfig {
    const v2 = doc?.forms?.[id];
    if (v2) return renderV2AsLegacy(v2, doc!.templates);
    return BUNDLED[id];
}
```

`renderV2AsLegacy` inlines every `ref` (looks up `templates[templateId]`, applies `overrides`, drops the ref wrapper), then reverses the converter: rekey each row's `cells` record into a positional array aligned with the flat `columns[]`, using `{ key: "", kind: "label" }` placeholders where no cell exists for a column, so the existing renderer's positional walker still works.

`HmisForm` today imports `HmisFormConfig` from a bundled file via its wrapper (e.g. `Hmis10501.tsx` imports `HMIS_105_01_SECTION_1_CONFIG`). Each wrapper is edited to instead call `getFormConfig(id, uiConfig.hmisFormConfigs)`. `HmisForm` itself does not change in Phase 1.

### 6. DataStore + first-run seed

- Key: `dataStore/eregisters/hmis-form-configs`. Not shared with existing `ui-config`.
- `src/utils/ensure-form-configs-seeded.ts` runs from `App.tsx` boot: read key; if 404 or `version` missing, convert all 10 bundled configs, POST as a new doc with `version: 2` and empty `templates`. Idempotent.
- Admin-only edit gate reuses the existing `authorities.includes("ALL")` check used by `AdminRoute`.

### 7. Testing

- `convert-to-v2.test.ts` — round-trip: for every bundled legacy config, `convertLegacyForm → renderV2AsLegacy` must produce the same normalised projection `{ (section, row, col) → { dataElement, coc, aoc, text, colSpan, rowSpan, kind } }` as the input. This is the safety net that lets Phase 1 ship without renderer changes.
- `reducers.test.ts` — cover each editor reducer with a small fixture; especially `extractTemplate` / `attachTemplate` / `detachTemplate` round-trips.
- Existing `no-duplicate-headers.test.ts` — extend to also run against the seeded v2 doc.
- Manual: two-browser check that an admin edit in browser A is visible in browser B after refresh; deleting a template blocked when refs exist; converting a section to a template updates every form that references it.

### 8. Files touched

- **New**
  - `src/form-configs/v2-types.ts`
  - `src/form-configs/convert-to-v2.ts` + `.test.ts`
  - `src/form-configs/render-v2-as-legacy.ts`
  - `src/routes/admin.form-builder.tsx`
  - `src/routes/admin.form-builder/reducers.ts` + `reducers.test.ts`
  - `src/db/form-config-doc.ts` (typed read/write helpers)
  - `src/utils/ensure-form-configs-seeded.ts`
- **Modify**
  - `src/routes/admin.tsx` — add "Form Builder" nav item
  - `src/App.tsx` — call `ensureFormConfigsSeeded(engine)` at boot
  - Each of the 10 form wrappers (`Hmis10501.tsx`, `Hmis1050203.tsx`, …) — swap the direct import for a call to `getFormConfig(id, uiConfig.hmisFormConfigs)`
  - `src/hooks/useUIConfig.ts` — expose `hmisFormConfigs` alongside existing keys
- **Left alone** (Phase 1)
  - `src/components/HmisForm.tsx` — no changes; still consumes the legacy shape
  - The 10 bundled `.config.ts` files — remain as the first-run seed

## Out of scope (deliberately)

- Grouped column header editing UI (`ColumnV2.children`) — data model supports it, editor promotes it in a follow-up.
- Program-rule integration for cells.
- JSON import/export of the whole doc.
- Phase 2 native antd-Table renderer — separate spec.
