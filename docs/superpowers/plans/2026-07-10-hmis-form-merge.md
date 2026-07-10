# HMIS Form Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge `HmisNativeForm` into `HmisForm` — one component, one config schema (`HmisFormConfig`), two bugs fixed.

**Architecture:** Keep `HmisForm.tsx` as the survivor. Fix two bugs in it and add minor features that the native form had. Migrate `Hmis033b.config.ts` programmatically from `HmisNativeFormDefinition` to `HmisFormConfig` using a Node.js script. Update `Hmis033bForm.tsx` to use `HmisForm`. Delete `HmisNativeForm.tsx`.

**Tech Stack:** React 18, TypeScript 6, Ant Design 5, Yarn (package manager). TypeScript compiler (`npx tsc --noEmit`) is the primary verification tool.

**Spec:** `docs/superpowers/specs/2026-07-10-hmis-form-merge-design.md`

---

## Pre-flight: Baseline error count

Before touching anything, record the current TypeScript error count so you know what you started with.

- [ ] Run `npx tsc --noEmit 2>&1 | grep -c "error TS"`

Expected: `6` (all `HmisFormValues` not exported from `HmisForm`). Any other errors are unexpected — stop and investigate before continuing.

---

## File Map

| File | Status | What changes |
|------|--------|-------------|
| `src/form-configs/types.ts` | Modify | Remove 5 Native types; add `verticalAlign` to style; make `columns` optional |
| `src/components/HmisForm.tsx` | Modify | 6 fixes: export `HmisFormValues`, fix 2 bugs, add `cell.disabled`, update `getCellStyle`, fix useCallback dep array, rename CSS prefix |
| `src/form-configs/Hmis033b.config.ts` | Migrate | Programmatic transformation from `HmisNativeFormDefinition` → `HmisFormConfig` |
| `src/components/Hmis033bForm.tsx` | Modify | Swap all imports and update local type alias |
| `src/components/HmisNativeForm.tsx` | Delete | Replaced by `HmisForm` |
| `scripts/migrate-hmis033b.js` | Temp | Created in Task 3, deleted after use |

---

## Task 1: Update `src/form-configs/types.ts`

**Files:**
- Modify: `src/form-configs/types.ts`

This task must be done first — `getCellStyle` in Task 2 depends on `verticalAlign` being present in the type.

- [ ] **Step 1: Remove the five Native types**

Delete these five interfaces/types from `src/form-configs/types.ts` (they start just below `export type HmisFormValues`):

```
HmisNativeFormCell
HmisNativeFormRow
HmisNativeFormSection
HmisNativeFormTab
HmisNativeFormDefinition
```

After deletion, the file should jump from `export type HmisFormValues = Map<string, string>;` directly to `export type HmisRowType = ...`.

- [ ] **Step 2: Add `verticalAlign` to `HmisCellConfig.style`**

Find the `style?` block inside `HmisCellConfig` (currently has `align`, `background`, `width`) and add `verticalAlign`:

```ts
style?: {
    align?: string;
    background?: string;
    width?: string;
    verticalAlign?: "top" | "middle" | "bottom";
};
```

- [ ] **Step 3: Make `columns` optional in `HmisSectionConfig`**

Find `columns: HmisColumnConfig[];` inside `HmisSectionConfig` and add `?`:

```ts
columns?: HmisColumnConfig[];
```

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit 2>&1`

Expected: same 6 pre-existing errors about `HmisFormValues`, nothing new. If you see new errors, fix them before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/form-configs/types.ts
git commit -m "refactor: update types for HmisForm/HmisNativeForm merge

- add verticalAlign to HmisCellConfig.style
- make HmisSectionConfig.columns optional
- remove HmisNativeForm* types (deleted with HmisNativeForm.tsx in later step)"
```

---

## Task 2: Fix `src/components/HmisForm.tsx`

**Files:**
- Modify: `src/components/HmisForm.tsx`

Six changes. Apply them all before running TypeScript, since CSS rename touches many lines.

- [ ] **Step 1: Re-export `HmisFormValues` (fixes 6 pre-existing TS errors)**

`HmisFormValues` is imported from types but not re-exported. Six wrapper components import it from `HmisForm`. Add this line immediately after the existing imports:

```ts
export type { HmisFormValues } from "../form-configs/types";
```

- [ ] **Step 2: Fix `handleSave` (Map iteration bug)**

Find the `handleSave` function. It currently has:
```ts
const dataValues = Object.entries(values)
```

Replace with:
```ts
const dataValues = Array.from(values.entries())
```

- [ ] **Step 3: Fix `setValue` state updater (data-loss bug)**

Find the `setValue` callback inside `InnerHmisForm`. It currently has:
```ts
setValues((previous) => ({
    ...previous,
    [dataValueKey(
        dataElement,
        categoryOptionCombo,
        attributeOptionCombo,
    )]: value,
}));
```

Replace the entire `setValues` call with:
```ts
setValues((previous) =>
    new Map(previous).set(
        dataValueKey(
            dataElement,
            categoryOptionCombo,
            attributeOptionCombo,
        ),
        value,
    ),
);
```

- [ ] **Step 4: Add `cell.disabled` to `FieldCell`**

Find the `<Input>` inside `FieldCell`. It currently has `disabled={readOnly}`. Replace with:
```tsx
disabled={readOnly || !!cell.disabled}
```

- [ ] **Step 5: Update `getCellStyle` (add `width` and `verticalAlign`)**

Find the `getCellStyle` function. Replace its body:
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

- [ ] **Step 6: Fix `useCallback` dependency array for `setValue`**

The `setValue` callback closes over `attributeOptionCombo` from props but its dep array is `[]`, causing a stale-closure bug if the prop changes. Find the `React.useCallback` call for `setValue` and update:

```ts
// before
    },
    [],
);
// after
    },
    [attributeOptionCombo],
);
```

Note: `tabPlacement="start"` in `<Tabs>` is the correct Ant Design v5 API (renders tabs on the left in LTR). Do **not** change it.

- [ ] **Step 7: Rename CSS prefix `hmis105` → `hmis-form`**

Inside the `HmisFormStyles` component, replace all CSS class names. Use find-and-replace:

| Before | After |
|--------|-------|
| `hmis105-form-table` | `hmis-form-table` |
| `hmis105-section-title-row` | `hmis-form-section-title-row` |
| `hmis105-section-row` | `hmis-form-section-row` |
| `hmis105-subhead-row` | `hmis-form-subhead-row` |
| `hmis105-data-row` | `hmis-form-data-row` |
| `hmis105-label-row` | `hmis-form-label-row` |
| `hmis105-field` | `hmis-form-field` |
| `hmis105-tabs` | `hmis-form-tabs` |

Apply the same rename to all JSX `className` and `className={...}` props in the component, and to `getRowClassName`'s return values.

- [ ] **Step 8: Verify TypeScript**

Run: `npx tsc --noEmit 2>&1`

Expected: **zero errors**. The 6 pre-existing errors should now be resolved by the re-export in Step 1.

- [ ] **Step 9: Commit**

```bash
git add src/components/HmisForm.tsx
git commit -m "fix: resolve HmisForm bugs and prepare for HmisNativeForm merge

- re-export HmisFormValues (fixes 6 TS2614 errors in wrapper components)
- fix handleSave: Object.entries(Map) always returns [] - use Array.from
- fix setValue: spreading a Map produces {} discarding all values
- add cell.disabled support in FieldCell
- update getCellStyle to include width and verticalAlign
- fix useCallback dep array: add attributeOptionCombo
- rename CSS prefix hmis105 to hmis-form"
```

---

## Task 3: Migrate `src/form-configs/Hmis033b.config.ts`

**Files:**
- Create: `scripts/migrate-hmis033b.js` (temp)
- Modify: `src/form-configs/Hmis033b.config.ts`

The config is ~2682 lines with 255 label cells, 165 background cells, 143 inputName entries, and 10 subhead rows. A migration script is safer and faster than manual editing.

- [ ] **Step 1: Create the migration script**

Create `scripts/migrate-hmis033b.js`:

```js
#!/usr/bin/env node
// Migrates Hmis033b.config.ts from HmisNativeFormDefinition to HmisFormConfig.
// Run once from the project root: node scripts/migrate-hmis033b.js
// Delete this file after use.

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/form-configs/Hmis033b.config.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract the JSON body: from the first '{' after '= ' to the last '};'
const startIdx = content.indexOf('= {') + 2; // points to '{'
const endIdx = content.lastIndexOf('};') + 1; // points to '}' before ';'
const jsonStr = content.slice(startIdx, endIdx);
const data = JSON.parse(jsonStr);

// Transform
data.tabs = data.tabs.map((tab) => ({
    ...tab,
    sections: tab.sections.map((section) => {
        // Rename colSpan -> columnCount; derive from rows if absent
        const columnCount =
            section.colSpan ??
            Math.max(
                ...section.rows.map((row) =>
                    row.cells.reduce((sum, cell) => sum + (cell.colSpan ?? 1), 0),
                ),
            );

        // Drop width and colSpan from source (HmisNativeFormSection has both;
        // HmisSectionConfig has neither — confirmed: HmisNativeForm never reads
        // section.width in its render output, so dropping it is visually safe)
        const { colSpan, width, ...sectionRest } = section;

        return {
            ...sectionRest,
            columnCount,
            rows: section.rows.map((row) => {
                // Map className to type; drop className
                const { className, ...rowRest } = row;
                const type =
                    className === 'section-subhead' ? 'subhead' : undefined;

                return {
                    ...rowRest,
                    ...(type !== undefined ? { type } : {}),
                    cells: row.cells.map((cell, cIdx) => {
                        // Destructure out all Native-only properties
                        const {
                            label,
                            background,
                            verticalAlign,
                            inputName,
                            isTotal,
                            align,
                            className: cellClassName,
                            width: cellWidth,
                            ...cellRest
                        } = cell;

                        const kind = cellRest.dataElement ? 'field' : 'label';
                        const key = `${row.key}-cell-${cIdx}`;

                        // Build style object from moved properties
                        const style = {};
                        if (background !== undefined) style.background = background;
                        if (verticalAlign !== undefined)
                            style.verticalAlign = verticalAlign;
                        if (cellWidth !== undefined) style.width = cellWidth;

                        return {
                            key,
                            kind,
                            ...(label !== undefined ? { text: label } : {}),
                            ...(Object.keys(style).length > 0 ? { style } : {}),
                            ...cellRest,
                        };
                    }),
                };
            }),
        };
    }),
}));

const newContent =
    `import type { HmisFormConfig } from './types';\n\n` +
    `export const HMIS_033B_CONFIG: HmisFormConfig = ${JSON.stringify(data, null, 2)};\n\n` +
    `export default HMIS_033B_CONFIG;\n`;

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Migration complete. Delete scripts/migrate-hmis033b.js when done.');
```

- [ ] **Step 2: Run the migration script**

```bash
node scripts/migrate-hmis033b.js
```

Expected output: `Migration complete. Delete scripts/migrate-hmis033b.js when done.`

- [ ] **Step 3: Spot-check the migrated file**

Verify the output looks correct:

```bash
# Should show 'HmisFormConfig', not 'HmisNativeFormDefinition'
head -3 src/form-configs/Hmis033b.config.ts

# Should show 'HMIS_033B_CONFIG', not 'HMIS_033B_NATIVE_CONFIG'
grep "export const" src/form-configs/Hmis033b.config.ts

# Should show 0 occurrences of 'inputName'
grep -c '"inputName"' src/form-configs/Hmis033b.config.ts

# Should show 0 occurrences of '"label":' at cell level
# (tab-level "label" keys still exist and are expected)
grep -c '"label":' src/form-configs/Hmis033b.config.ts

# Should show '"kind"' entries
grep -c '"kind"' src/form-configs/Hmis033b.config.ts

# Should show '"type": "subhead"' (was '"className": "section-subhead"')
grep -c '"type": "subhead"' src/form-configs/Hmis033b.config.ts
```

Expected:
- `inputName` count: `0`
- `label` count: small number (only tab-level labels remain, not cell labels)
- `kind` count: same as original cell count (every cell gets one)
- `type: "subhead"` count: `10`

- [ ] **Step 4: Delete the migration script**

```bash
rm scripts/migrate-hmis033b.js
```

- [ ] **Step 5: Run TypeScript (expect errors about Hmis033bForm only)**

```bash
npx tsc --noEmit 2>&1
```

Expected: errors only in `src/components/Hmis033bForm.tsx` (still imports Native types). No errors in `Hmis033b.config.ts` itself. If you see errors inside `Hmis033b.config.ts`, the migration script produced invalid output — inspect the file and fix the script.

- [ ] **Step 6: Commit**

```bash
git add src/form-configs/Hmis033b.config.ts
git commit -m "refactor: migrate Hmis033b config to HmisFormConfig schema

- rename export HMIS_033B_NATIVE_CONFIG -> HMIS_033B_CONFIG
- rename colSpan -> columnCount on sections
- map row className: section-subhead -> type: subhead
- add key and kind to every cell
- rename cell label -> text
- move background/verticalAlign into style object
- drop inputName (unused in rendering)"
```

---

## Task 4: Update `src/components/Hmis033bForm.tsx`

**Files:**
- Modify: `src/components/Hmis033bForm.tsx`

The current file (14 lines):
```tsx
import React from "react";
import { HMIS_033B_NATIVE_CONFIG } from "../form-configs/Hmis033b.config";
import type { HmisNativeFormDefinition } from "../form-configs/types";
import HmisNativeForm, { type HmisNativeFormProps } from "./HmisNativeForm";

type Hmis033bFormProps = Omit<HmisNativeFormProps, "config"> & {
    config?: HmisNativeFormDefinition;
};

const Hmis033bForm = ({
    config = HMIS_033B_NATIVE_CONFIG,
    ...props
}: Hmis033bFormProps) => <HmisNativeForm config={config} {...props} />;

export default Hmis033bForm;
```

- [ ] **Step 1: Replace the entire file contents**

```tsx
import React from "react";
import { HMIS_033B_CONFIG } from "../form-configs/Hmis033b.config";
import type { HmisFormConfig } from "../form-configs/types";
import HmisForm, { type HmisFormProps } from "./HmisForm";

type Hmis033bFormProps = Omit<HmisFormProps, "config"> & {
    config?: HmisFormConfig;
};

const Hmis033bForm = ({
    config = HMIS_033B_CONFIG,
    ...props
}: Hmis033bFormProps) => <HmisForm config={config} {...props} />;

export default Hmis033bForm;
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors. If errors appear in `Hmis033bForm.tsx`, inspect them — most likely a type mismatch between `HmisFormProps` and the passed props.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hmis033bForm.tsx
git commit -m "refactor: update Hmis033bForm to use HmisForm and HmisFormConfig"
```

---

## Task 5: Delete `HmisNativeForm.tsx` and final verification

**Files:**
- Delete: `src/components/HmisNativeForm.tsx`

- [ ] **Step 1: Delete the file**

```bash
git rm src/components/HmisNativeForm.tsx
```

- [ ] **Step 2: Final TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: **zero errors**. If any errors appear, they will name the file and line — fix them before committing.

- [ ] **Step 3: Confirm no remaining references to Native types or HmisNativeForm**

```bash
grep -r "HmisNativeForm\|HmisNativeFormDefinition\|HmisNativeFormCell\|HMIS_033B_NATIVE_CONFIG" src/ --include="*.ts" --include="*.tsx"
```

Expected: no output (zero matches).

- [ ] **Step 4: Final commit**

```bash
git commit -m "refactor: delete HmisNativeForm — fully replaced by HmisForm

HmisForm now serves all HMIS form types.
HmisNativeForm had two bugs (Map iteration in handleSave,
no-rerender in setValue) that are fixed in HmisForm."
```

---

## Done

At this point:
- One component (`HmisForm`) serves all HMIS forms
- One schema (`HmisFormConfig`) covers all configs
- Two bugs fixed (silent zero-submission, data-loss on keystrokes)
- All 8 existing wrappers unchanged and still passing TypeScript
- `Hmis033bForm` wrapper now uses `HmisForm` with the migrated config
