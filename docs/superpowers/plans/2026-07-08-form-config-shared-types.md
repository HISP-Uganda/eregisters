# Form Config Shared Types Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the duplicated type declarations repeated across 8 form config files into a single `src/form-configs/types.ts` and update all consumers to import from it.

**Architecture:** Create one shared types file with generically-named interfaces, remove the ~50-line local type block from each of the 8 config files, add an import from `./types`, and update the one component that imports these types from the config file directly.

**Tech Stack:** TypeScript — verification is `npx tsc --noEmit` after each task.

**Note on pre-existing TS error:** `reports.tsx` already has a TS error (`Cannot find module '../components/Hmis105Section1Form'`) before this work begins. Do not fix it; just verify it stays the only error throughout.

**Spec:** `docs/superpowers/specs/2026-07-08-form-config-shared-types-design.md`

---

## File Map

| File | Action |
| --- | --- |
| `src/form-configs/types.ts` | Create — single source of truth for all shared types |
| `src/form-configs/Hmis10501.config.ts` | Modify — remove lines 12–62, add import, type the const |
| `src/form-configs/Hmis1050203.config.ts` | Modify — remove lines 13–65, add import, type the const |
| `src/form-configs/Hmis1050405.config.ts` | Modify — remove lines 13–65, add import, type the const |
| `src/form-configs/Hmis1050609.config.ts` | Modify — remove lines 13–65, add import, type the const |
| `src/form-configs/Hmis10510.config.ts` | Modify — remove lines 13–65, add import, type the const |
| `src/form-configs/Hmis106A0102.config.ts` | Modify — remove lines 13–65, add import, type the const |
| `src/form-configs/Hmis106A03.config.ts` | Modify — remove lines 13–65, add import, type the const |
| `src/form-configs/Hmis106A04.config.ts` | Modify — remove lines 13–65, add import, type the const |
| `src/components/Hmis10501.tsx` | Modify — update import source, rename 4 type references |

---

## Task 1: Create `src/form-configs/types.ts`

**Files:**

- Create: `src/form-configs/types.ts`

- [ ] **Step 1: Create the shared types file**

Create `src/form-configs/types.ts` with this exact content:

```typescript
export type HmisCellKind = 'label' | 'field';
export type HmisRowType = 'section' | 'subhead' | 'data' | 'label';

export interface HmisCellConfig {
  key: string;
  kind: HmisCellKind;
  text?: string;
  title?: string;
  dataElement?: string;
  categoryOptionCombo?: string;
  inputId?: string;
  disabled?: boolean;
  total?: boolean;
  colSpan?: number;
  rowSpan?: number;
  style?: {
    align?: string;
    background?: string;
    width?: string;
  };
}

export interface HmisRowConfig {
  key: string;
  type: HmisRowType;
  cells: HmisCellConfig[];
}

export interface HmisColumnConfig {
  key: string;
  index: number;
  width?: number;
}

export interface HmisSectionConfig {
  key: string;
  title: string;
  columnCount: number;
  columns: HmisColumnConfig[];
  rows: HmisRowConfig[];
}

export interface HmisTabConfig {
  key: string;
  label: string;
  sections: HmisSectionConfig[];
}

export interface HmisFormConfig {
  id: string;
  title: string;
  tabs: HmisTabConfig[];
}
```

- [ ] **Step 2: Verify TypeScript still only has the pre-existing error**

Run:

```bash
npx tsc --noEmit 2>&1
```

Expected: exactly one error — `reports.tsx ... Cannot find module '../components/Hmis105Section1Form'`. No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/form-configs/types.ts
git commit -m "feat: add shared form config types"
```

---

## Task 2: Update `Hmis10501.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis10501.config.ts:12-62`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 12–62 (the two `export type` lines, all six `export interface` blocks, and the trailing blank line). The const `HMIS_105_01_SECTION_1_CONFIG` is at line 63 and must not be deleted.

Replace them with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Add a type annotation to the exported constant**

Change:

```typescript
export const HMIS_105_01_SECTION_1_CONFIG = {
```

To:

```typescript
export const HMIS_105_01_SECTION_1_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify TypeScript — still only the pre-existing error**

```bash
npx tsc --noEmit 2>&1
```

Expected: only the `reports.tsx` error. No new errors.

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis10501.config.ts
git commit -m "refactor: remove local types from Hmis10501.config, import from shared types"
```

---

## Task 3: Update `Hmis1050203.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis1050203.config.ts:13-65`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 13–65 (same pattern — two `export type` lines and six `export interface` blocks, ending just before `export const HMIS_105_02_03_CONFIG`).

Replace with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Type the exported constant**

Change:

```typescript
export const HMIS_105_02_03_CONFIG = {
```

To:

```typescript
export const HMIS_105_02_03_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1
```

Expected: only the `reports.tsx` error.

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis1050203.config.ts
git commit -m "refactor: remove local types from Hmis1050203.config, import from shared types"
```

---

## Task 4: Update `Hmis1050405.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis1050405.config.ts:13-65`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 13–65, replace with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Type the exported constant**

```typescript
export const HMIS_105_04_05_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis1050405.config.ts
git commit -m "refactor: remove local types from Hmis1050405.config, import from shared types"
```

---

## Task 5: Update `Hmis1050609.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis1050609.config.ts:13-65`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 13–65, replace with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Type the exported constant**

```typescript
export const HMIS_105_06_09_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis1050609.config.ts
git commit -m "refactor: remove local types from Hmis1050609.config, import from shared types"
```

---

## Task 6: Update `Hmis10510.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis10510.config.ts:13-65`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 13–65 (this file has `style.width` in the local `HmisCellConfig` — delete the whole block; line 66 is a blank separator, leave it). Replace with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Type the exported constant**

```typescript
export const HMIS_105_10_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis10510.config.ts
git commit -m "refactor: remove local types from Hmis10510.config, import from shared types"
```

---

## Task 7: Update `Hmis106A0102.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis106A0102.config.ts:13-65`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 13–65 (line 66 is a blank separator, leave it), replace with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Type the exported constant**

```typescript
export const HMIS_106A_01_02_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis106A0102.config.ts
git commit -m "refactor: remove local types from Hmis106A0102.config, import from shared types"
```

---

## Task 8: Update `Hmis106A03.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis106A03.config.ts:13-65`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 13–65 (line 66 is a blank separator, leave it), replace with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Type the exported constant**

```typescript
export const HMIS_106A_03_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis106A03.config.ts
git commit -m "refactor: remove local types from Hmis106A03.config, import from shared types"
```

---

## Task 9: Update `Hmis106A04.config.ts`

**Files:**

- Modify: `src/form-configs/Hmis106A04.config.ts:13-65`

- [ ] **Step 1: Replace the local type block with an import**

Delete lines 13–65 (line 66 is a blank separator, leave it), replace with:

```typescript
import type {
  HmisCellConfig,
  HmisRowConfig,
  HmisColumnConfig,
  HmisSectionConfig,
  HmisTabConfig,
  HmisFormConfig,
} from './types';
```

- [ ] **Step 2: Type the exported constant**

```typescript
export const HMIS_106A_04_CONFIG: HmisFormConfig = {
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add src/form-configs/Hmis106A04.config.ts
git commit -m "refactor: remove local types from Hmis106A04.config, import from shared types"
```

---

## Task 10: Update `src/components/Hmis10501.tsx`

**Files:**

- Modify: `src/components/Hmis10501.tsx:12-18` (import block) and all type-name usages

- [ ] **Step 1: Replace the import block**

Change lines 12–18:

```typescript
import {
    HMIS_105_01_SECTION_1_CONFIG,
    type Hmis105CellConfig,
    type Hmis105FormConfig,
    type Hmis105RowConfig,
    type Hmis105SectionConfig,
} from "../form-configs/Hmis10501.config";
```

To (keep the config constant import where it is, add a separate types import):

```typescript
import { HMIS_105_01_SECTION_1_CONFIG } from "../form-configs/Hmis10501.config";
import type {
    HmisCellConfig,
    HmisFormConfig,
    HmisRowConfig,
    HmisSectionConfig,
} from "../form-configs/types";
```

- [ ] **Step 2: Rename type references in the component body**

The following four type names appear in the component body and must be renamed:

| Old | New | Locations |
| --- | --- | --- |
| `Hmis105CellConfig` | `HmisCellConfig` | lines 66, 123, 158 |
| `Hmis105FormConfig` | `HmisFormConfig` | line 33 |
| `Hmis105RowConfig` | `HmisRowConfig` | line 53 |
| `Hmis105SectionConfig` | `HmisSectionConfig` | line 192 |

Do NOT rename component names, exported types (`Hmis105Values`, `Hmis105Section1FormProps`), component identifiers (`Hmis105Styles`, `InnerHmis105Section1Form`, `Hmis105Section1Form`), or the prop interface — only the 4 imported type names.

- [ ] **Step 3: Verify — only the pre-existing error remains**

```bash
npx tsc --noEmit 2>&1
```

Expected: only the `reports.tsx` error. No new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hmis10501.tsx
git commit -m "refactor: update Hmis10501 component to import types from shared types file"
```

---

## Task 11: Final verification

- [ ] **Step 1: Confirm no local Hmis105 type declarations remain in any config file**

```bash
grep -rn "^export type Hmis105\|^export interface Hmis105" src/form-configs/
```

Expected: no output.

- [ ] **Step 2: Confirm all 8 config files import from `./types`**

```bash
grep -l "from './types'" src/form-configs/*.config.ts
```

Expected: 8 files listed (all except `Hmis033bNative.config.ts`).

- [ ] **Step 3: Confirm the component imports from the shared types file**

```bash
grep "from.*form-configs/types" src/components/Hmis10501.tsx
```

Expected: one matching line.

- [ ] **Step 4: Final TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: only the pre-existing `reports.tsx` error.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "refactor: form-config shared types extraction complete"
```
