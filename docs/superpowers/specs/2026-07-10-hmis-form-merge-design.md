# HMIS Form Merge Design

**Date:** 2026-07-10
**Scope:** Merge `HmisNativeForm` into `HmisForm` — one component, one config schema

---

## Background

Two near-identical form components exist in the codebase:

- `src/components/HmisForm.tsx` — used by 8 wrapper components (Hmis10501, Hmis1050203, Hmis1050405, Hmis1050609, Hmis10510, Hmis106A0102, Hmis106A03, Hmis106A04), each backed by large config files totalling ~158k lines
- `src/components/HmisNativeForm.tsx` — used by 1 wrapper component (Hmis033bForm), backed by `Hmis033b.config.ts` (~2.6k lines)

Both share the same visual shell (teal Card, left Tabs, Save button, period/orgUnit display), the same `dataValueKey` function, the same `ConfigProvider`/`App` wrapping, and the same `setValue` type. They diverge only in their cell/row/section config schemas and have two shared bugs.

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

Add `verticalAlign` (used in Hmis033b cells):

```ts
style?: {
    align?: string;
    background?: string;
    width?: string;
    verticalAlign?: "top" | "middle" | "bottom";
};
```

### Make `columns` optional in `HmisSectionConfig`

`columns` is required today but never used in rendering. Hmis033b sections won't have it:

```ts
columns?: HmisColumnConfig[];
```

### Everything else stays unchanged

`HmisFormValues`, `setValue`, `HmisCellKind`, `HmisRowType`, `HmisCellConfig`, `HmisRowConfig`, `HmisColumnConfig`, `HmisSectionConfig`, `HmisTabConfig`, `HmisFormConfig`.

---

## Section 2 — HmisForm.tsx fixes (`src/components/HmisForm.tsx`)

Five targeted changes:

### 1. Fix `handleSave` (Map iteration bug)

`Object.entries()` on a `Map` always returns `[]`. Replace:

```ts
// before
const dataValues = Object.entries(values)
// after
const dataValues = Array.from(values.entries())
```

### 2. Fix `setValue` state updater (Map mutation bug)

Spreading a Map into an object produces `{}`. Replace:

```ts
// before
setValues((previous) => ({
    ...previous,
    [dataValueKey(...)]: value,
}));
// after
setValues((previous) => new Map(previous).set(dataValueKey(...), value));
```

### 3. Add `cell.disabled` to `FieldCell`

`HmisCellConfig` already has `disabled?: boolean` but the component ignores it. Hmis033b has greyed-out total cells with `disabled: true`:

```ts
// before
disabled={readOnly}
// after
disabled={readOnly || !!cell.disabled}
```

### 4. Update `getCellStyle`

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

All CSS class names inside the injected `<style>` block and JSX are renamed (e.g. `hmis105-form-table` → `hmis-form-table`, `hmis105-field` → `hmis-form-field`, `hmis105-tabs` → `hmis-form-tabs`). The styles are self-contained — no external CSS is affected.

---

## Section 3 — Hmis033b.config.ts migration (`src/form-configs/Hmis033b.config.ts`)

The file shape changes from `HmisNativeFormDefinition` to `HmisFormConfig`. Size stays the same (~2.6k lines). All transformations are mechanical.

### Top level

| Before | After |
|--------|-------|
| `import type { HmisNativeFormDefinition }` | `import type { HmisFormConfig }` |
| `export const HMIS_033B_NATIVE_CONFIG: HmisNativeFormDefinition` | `export const HMIS_033B_CONFIG: HmisFormConfig` |

### Per section

| Before | After |
|--------|-------|
| `colSpan?: number` (optional, used for section title colspan) | `columnCount: number` (computed: max effective column count across rows in that section) |
| `width?: string` | Drop (not in `HmisSectionConfig`) |
| _(absent)_ | `columns: []` (required by type, unused in rendering) |

`columnCount` is derived by scanning each section's rows and summing `colSpan` values (defaulting to 1) for the row with the most columns.

### Per row

| Before (`className`) | After (`type`) |
|----------------------|----------------|
| `"section-subhead"` | `"subhead"` |
| _(absent)_ | `"data"` (default, no change needed since `type` defaults to data in `getRowClassName`) |

### Per cell

| Before | After |
|--------|-------|
| _(absent)_ | `key: "${rowKey}-cell-${index}"` |
| _(absent)_ | `kind: "field"` if cell has `dataElement`, else `"label"` |
| `label: "..."` | `text: "..."` |
| `background: "..."` | `style: { background: "..." }` |
| `verticalAlign: "top"` | `style: { verticalAlign: "top" }` |
| `inputName: "..."` | Drop (not in `HmisCellConfig`, not used in rendering) |
| `dataElement`, `categoryOptionCombo`, `inputId`, `title`, `disabled`, `colSpan`, `rowSpan` | Keep as-is |

When `background` and `verticalAlign` appear on the same cell, merge them into a single `style` object.

### Hmis033bForm.tsx

- `import HmisNativeForm` → `import HmisForm`
- `import type { HmisNativeFormDefinition }` → `import type { HmisFormConfig }`
- `import type { HmisNativeFormProps }` → `import type { HmisFormProps }`
- Update prop types in `Hmis033bFormProps` accordingly
- Update the import of `HMIS_033B_NATIVE_CONFIG` → `HMIS_033B_CONFIG`

---

## Section 4 — Files deleted and overall impact

### Delete

- `src/components/HmisNativeForm.tsx`

### Modified files

| File | Change |
|------|--------|
| `src/form-configs/types.ts` | Remove 5 Native types; expand `HmisCellConfig.style`; make `columns` optional |
| `src/components/HmisForm.tsx` | 5 fixes/enhancements; CSS class rename |
| `src/form-configs/Hmis033b.config.ts` | Full mechanical migration to `HmisFormConfig` |
| `src/components/Hmis033bForm.tsx` | Swap imports and prop types |

### Untouched (8 wrapper components + 8 config files)

`Hmis10501`, `Hmis1050203`, `Hmis1050405`, `Hmis1050609`, `Hmis10510`, `Hmis106A0102`, `Hmis106A03`, `Hmis106A04` — and all their `*.config.ts` files.

### Net result

One component (`HmisForm`), one config schema (`HmisFormConfig`), two bugs fixed, zero regressions to existing forms.
