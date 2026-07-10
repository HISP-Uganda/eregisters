# HMIS Form Merge Design

**Date:** 2026-07-10
**Scope:** Merge `HmisNativeForm` into `HmisForm` — one component, one config schema

---

## Background

Two near-identical form components exist in the codebase:

- `src/components/HmisForm.tsx` — used by 8 wrapper components (Hmis10501, Hmis1050203, Hmis1050405, Hmis1050609, Hmis10510, Hmis106A0102, Hmis106A03, Hmis106A04), each backed by large config files totalling ~158k lines
- `src/components/HmisNativeForm.tsx` — used by 1 wrapper component (Hmis033bForm), backed by `Hmis033b.config.ts` (~2.6k lines)

Both share the same visual shell (teal Card, left Tabs, Save button, period/orgUnit display), the same `dataValueKey` function, the same `ConfigProvider`/`App` wrapping, and the same `setValue` type. They diverge only in their cell/row/section config schemas and both have bugs.

**Goal:** Converge on `HmisFormConfig` as the single schema, migrate only `Hmis033b.config.ts`, and delete `HmisNativeForm.tsx`.

---

## Approach

Adopt `HmisFormConfig`/`HmisCellConfig` as the unified schema. Migrate only the small `Hmis033b.config.ts` (2.6k lines). The 8 large HmisFormConfig files (~158k lines combined) are untouched.

---

## Section 1 — Types (`src/form-configs/types.ts`)

### Remove

Delete all five Native-schema types — they become unreferenced after the migration:

- `HmisNativeFormCell`
- `HmisNativeFormRow`
- `HmisNativeFormSection`
- `HmisNativeFormTab`
- `HmisNativeFormDefinition`

### Expand `HmisCellConfig.style`

Add `verticalAlign` (used in Hmis033b cells). `width` is already present:

```ts
style?: {
    align?: string;
    background?: string;
    width?: string;
    verticalAlign?: "top" | "middle" | "bottom";
};
```

### Make `columns` optional in `HmisSectionConfig`

`columns` is required today but never used in rendering. The migrated Hmis033b sections will omit it entirely:

```ts
columns?: HmisColumnConfig[];
```

**Do this before migrating `Hmis033b.config.ts`** — otherwise adding `columns: []` to each section would be required to satisfy the type.

### Everything else stays unchanged

`HmisFormValues`, `setValue`, `HmisCellKind`, `HmisRowType`, `HmisCellConfig`, `HmisRowConfig`, `HmisColumnConfig`, `HmisSectionConfig`, `HmisTabConfig`, `HmisFormConfig`.

---

## Section 2 — HmisForm.tsx fixes (`src/components/HmisForm.tsx`)

Five targeted changes. Do **not** touch `HmisNativeForm.tsx` — it is being deleted, not fixed.

### 1. Fix `handleSave` (Map iteration bug)

`Object.entries()` on a `Map` always returns `[]`, so the current `handleSave` always submits zero data values. Replace:

```ts
// before
const dataValues = Object.entries(values)
// after
const dataValues = Array.from(values.entries())
```

Also update the key split to extract all three parts (the current code already does this correctly in `HmisForm`; verify it matches the `onSave` payload type which includes `attributeOptionCombo`):

```ts
const [dataElement, categoryOptionCombo, attributeOptionCombo] = key.split(COC_SEPARATOR);
return { dataElement, categoryOptionCombo, attributeOptionCombo, value };
```

### 2. Fix `setValue` state updater (data-loss bug)

The current updater spreads a `Map` into a plain object literal — `{ ...map }` produces `{}`, so **all existing values are silently discarded on every keystroke**. Replace:

```ts
// before — data-loss: spreads Map into {}, discarding all values
setValues((previous) => ({
    ...previous,
    [dataValueKey(...)]: value,
}));
// after — correct immutable Map update
setValues((previous) => new Map(previous).set(dataValueKey(...), value));
```

Note: `HmisNativeForm`'s `setValue` has a different bug — it calls `previous.set(key, value)` which mutates the existing Map in-place and returns the same reference, so React does not detect the change and the component does not re-render. That bug lives in the file being deleted; no fix needed there.

The `InnerHmisForm.setValue` callback destructures only `{ dataElement, categoryOptionCombo, value }` from its parameter, ignoring `attributeOptionCombo`. This is intentional: the form-level `attributeOptionCombo` prop is captured in the callback's closure and used in `dataValueKey(...)`. The shared `setValue` type requires the field in the call signature — callers (i.e. `FieldCell`) pass it via `cell.attributeOptionCombo`, which is `undefined` for all 033b cells since none set it. This is safe because the form-level prop is what actually matters. Leave the callback's three-parameter destructure as-is; the non-null assertion (`cell.attributeOptionCombo!`) in `FieldCell` is harmless here.

### 3. Add `cell.disabled` to `FieldCell`

`HmisCellConfig` already has `disabled?: boolean` but the component ignores it. Hmis033b has greyed-out total cells with `disabled: true`:

```ts
// before
disabled={readOnly}
// after
disabled={readOnly || !!cell.disabled}
```

### 4. Update `getCellStyle`

**Depends on Section 1** — `verticalAlign` must be added to `HmisCellConfig.style` before this compiles. Apply Section 1 first.

Add the two style properties now present in `HmisCellConfig.style`:

```ts
function getCellStyle(cell: HmisCellConfig): React.CSSProperties {
    return {
        textAlign: cell.style?.align as React.CSSProperties["textAlign"],
        background: cell.style?.background,
        width: cell.style?.width,
        verticalAlign: cell.style?.verticalAlign,
    };
}
```

### 5. Rename CSS prefix `hmis105` → `hmis-form`

All CSS class names inside the injected `<style>` block and JSX are renamed (e.g. `hmis105-form-table` → `hmis-form-table`, `hmis105-field` → `hmis-form-field`, `hmis105-tabs` → `hmis-form-tabs`). The styles are injected inline via a `<style>` tag — no external CSS files are affected.

### 6. Align `tabPosition`

`HmisForm` currently uses the non-standard `tabPlacement="start"` prop. `HmisNativeForm` uses the correct Ant Design API: `tabPosition="left"`. Change `HmisForm` to `tabPosition="left"` so the visual output for Hmis033b is unchanged after the migration.

---

## Section 3 — Hmis033b.config.ts migration (`src/form-configs/Hmis033b.config.ts`)

The file shape changes from `HmisNativeFormDefinition` to `HmisFormConfig`. Size stays the same (~2.6k lines). All transformations are mechanical.

**Prerequisite:** Complete Section 1 (make `columns` optional in `HmisSectionConfig`) before editing this file.

### Top level

| Before | After |
|--------|-------|
| `import type { HmisNativeFormDefinition }` | `import type { HmisFormConfig }` |
| `export const HMIS_033B_NATIVE_CONFIG: HmisNativeFormDefinition` | `export const HMIS_033B_CONFIG: HmisFormConfig` |
| `export default HMIS_033B_NATIVE_CONFIG` | `export default HMIS_033B_CONFIG` |

### Per section

| Before | After |
|--------|-------|
| `colSpan?: number` (optional) | Rename to `columnCount: number` — all 4 sections in 033b already have `colSpan` set correctly; just rename the key |
| `width?: string` (e.g. `"100%"`) | **Drop entirely** — confirmed: `HmisNativeForm` never reads `section.width` in render; no visual change |
| _(absent)_ | `columns` — **omit entirely** (the field is optional after Section 1) |

If any section lacks a `colSpan` value, derive `columnCount` by scanning its rows: sum each cell's `colSpan` (default 1 if absent) per row, then take the maximum across all rows. Example: `[{colSpan:2},{},{},{},{},{}]` → `2+1+1+1+1+1 = 7`.

### Per row

| Before (`className`) | After (`type`) |
|----------------------|----------------|
| `"section-subhead"` | `"subhead"` |
| _(absent)_ | Omit `type` entirely — `getRowClassName` defaults to `"data"` when `type` is absent |

### Per cell

The following table is complete. Every property in `HmisNativeFormCell` is accounted for:

| Native property | Action | Notes |
|-----------------|--------|-------|
| _(absent)_ | Add `key: "${rowKey}-cell-${index}"` | Required by `HmisCellConfig` |
| _(absent)_ | Add `kind` (`"field"` or `"label"`) | `"field"` if cell has `dataElement`, else `"label"` |
| `label` | Rename to `text` | |
| `background` | Move to `style.background` | Merge with any other `style` properties on the same cell |
| `verticalAlign` | Move to `style.verticalAlign` | Merge with any other `style` properties on the same cell |
| `dataElement` | Keep | |
| `categoryOptionCombo` | Keep | |
| `attributeOptionCombo` | Keep | |
| `title` | Keep | |
| `disabled` | Keep | |
| `colSpan` | Keep | |
| `rowSpan` | Keep | |
| `inputId` | Keep | |
| `inputName` | **Drop** — not in `HmisCellConfig`, not used in rendering | |
| `isTotal` | **Drop** — not present in 033b config data; `HmisCellConfig` has `total` but it is also unused in rendering | |
| `align` | **Drop** — not present in 033b config data; would move to `style.align` if needed in future | |
| `className` | **Drop** — not present in 033b config data; the `HmisNativeFormCell.className` type field was used for per-cell `<td className>`, but no 033b cell uses it | |
| `width` | Move to `style.width` if present | Not confirmed in 033b data, but covered by the schema |

When `background` and `verticalAlign` (and/or `width`) appear on the same cell, combine them into a single `style` object:

```ts
// before
{ background: "#e0e0e0", disabled: true, ... }
// after
{ style: { background: "#e0e0e0" }, disabled: true, kind: "field", key: "...", ... }
```

### Hmis033bForm.tsx

- `import HmisNativeForm` → `import HmisForm`
- `import type { HmisNativeFormDefinition }` → `import type { HmisFormConfig }`
- `import type { HmisNativeFormProps }` → `import type { HmisFormProps }`
- Update the local type alias explicitly: replace `Omit<HmisNativeFormProps, "config"> & { config?: HmisNativeFormDefinition }` with `Omit<HmisFormProps, "config"> & { config?: HmisFormConfig }`
- Update the JSX render line: `<HmisNativeForm ...>` → `<HmisForm ...>`
- Update config import: `HMIS_033B_NATIVE_CONFIG` → `HMIS_033B_CONFIG`

### Breaking change: `onSave` payload

`HmisNativeFormProps.onSave` omitted `attributeOptionCombo` from `dataValues` items. `HmisFormProps.onSave` includes it. The only current call site (`src/routes/reports.tsx`) does not pass `onSave`, so this is low-risk. Audit any new call sites before merging.

---

## Section 4 — Files deleted and overall impact

### Delete

- `src/components/HmisNativeForm.tsx` (includes removal of stray debug `console.log` on line 140)

### Modified files

| File | Change |
|------|--------|
| `src/form-configs/types.ts` | Remove 5 Native types; add `verticalAlign` to `HmisCellConfig.style`; make `columns` optional |
| `src/components/HmisForm.tsx` | 6 fixes/enhancements (bugs, `cell.disabled`, `getCellStyle`, CSS rename, `tabPosition`) |
| `src/form-configs/Hmis033b.config.ts` | Full mechanical migration to `HmisFormConfig` |
| `src/components/Hmis033bForm.tsx` | Swap imports and prop types; update config import name |

### Recommended implementation order

1. `types.ts` — make `columns` optional, add `verticalAlign` to style, remove Native types
2. `HmisForm.tsx` — apply all 6 fixes
3. `Hmis033b.config.ts` — migrate to `HmisFormConfig`
4. `Hmis033bForm.tsx` — swap imports
5. Delete `HmisNativeForm.tsx`
6. Verify TypeScript compiles clean

### Untouched (8 wrapper components + 8 config files)

`Hmis10501`, `Hmis1050203`, `Hmis1050405`, `Hmis1050609`, `Hmis10510`, `Hmis106A0102`, `Hmis106A03`, `Hmis106A04` — and all their `*.config.ts` files.

### Net result

One component (`HmisForm`), one config schema (`HmisFormConfig`), two bugs fixed (data-loss in `setValue`, silent empty submit in `handleSave`), zero regressions to existing forms.
