# Form Config Shared Types Extraction

**Date:** 2026-07-08
**Status:** Approved

## Problem

Eight of the nine files in `src/form-configs/` each re-declare the same ~50-line block of TypeScript types verbatim. Any change to the shape of a cell, row, or section must be made in 8 places. The types are named `Hmis105*` but are used in `Hmis106A*` forms too, making the names misleading.

Additionally, there are minor inconsistencies across the copies: some files omit `disabled` and `total` on `Hmis105CellConfig`, and only `Hmis10510.config.ts` defines and uses `style.width`.

## Goal

Extract the duplicated types into a single shared file with generic names. All 8 config files import from that file. The component that consumes these types is updated to match.

## Out of Scope

`Hmis033bNative.config.ts` uses a different shape (`HmisNativeForm*`) with no duplication — it is left untouched.

## Design

### New file: `src/form-configs/types.ts`

Single source of truth for all shared HMIS form config types. Uses the superset of all fields across the 8 existing files (all fields are optional where any file omitted them, so no existing data is broken).

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

### Rename mapping

| Old name (per-file) | New shared name |
| --- | --- |
| `Hmis105CellKind` | `HmisCellKind` |
| `Hmis105RowType` | `HmisRowType` |
| `Hmis105CellConfig` | `HmisCellConfig` |
| `Hmis105RowConfig` | `HmisRowConfig` |
| `Hmis105ColumnConfig` | `HmisColumnConfig` |
| `Hmis105SectionConfig` | `HmisSectionConfig` |
| `Hmis105TabConfig` | `HmisTabConfig` |
| `Hmis105FormConfig` | `HmisFormConfig` |

### Changes to 8 config files

Files: `Hmis10501.config.ts`, `Hmis1050203.config.ts`, `Hmis1050405.config.ts`, `Hmis1050609.config.ts`, `Hmis10510.config.ts`, `Hmis106A0102.config.ts`, `Hmis106A03.config.ts`, `Hmis106A04.config.ts`

Each file:

1. Removes the local type block (~50 lines at the top of each file).

1. Adds an import from the shared types file:

```typescript
import type { HmisCellConfig, HmisRowConfig, HmisColumnConfig, HmisSectionConfig, HmisTabConfig, HmisFormConfig } from './types';
```

1. Adds an explicit type annotation to the exported config constant (all 8 constants are currently untyped plain objects):

```typescript
export const HMIS_XXX_CONFIG: HmisFormConfig = { ... }
```

### Changes to `src/components/Hmis10501.tsx`

Updates its imports from the config file to the shared types file:

```typescript
// Before
import {
  type Hmis105CellConfig,
  type Hmis105FormConfig,
  type Hmis105RowConfig,
  type Hmis105SectionConfig,
} from '../form-configs/Hmis10501.config';

// After
import type {
  HmisCellConfig,
  HmisFormConfig,
  HmisRowConfig,
  HmisSectionConfig,
} from '../form-configs/types';
```

All usages of the old type names inside the component are renamed to match.

## Files Changed

| File | Change |
| --- | --- |
| `src/form-configs/types.ts` | Created |
| `src/form-configs/Hmis10501.config.ts` | Remove local types, import from `./types`, type the constant |
| `src/form-configs/Hmis1050203.config.ts` | Same |
| `src/form-configs/Hmis1050405.config.ts` | Same |
| `src/form-configs/Hmis1050609.config.ts` | Same |
| `src/form-configs/Hmis10510.config.ts` | Same |
| `src/form-configs/Hmis106A0102.config.ts` | Same |
| `src/form-configs/Hmis106A03.config.ts` | Same |
| `src/form-configs/Hmis106A04.config.ts` | Same |
| `src/components/Hmis10501.tsx` | Update imports to use shared types |

## Success Criteria

- `src/form-configs/types.ts` exists and exports all 8 shared types under their generic names.
- Each of the 8 config files imports from `./types` and contains no local `interface Hmis105*` or `type Hmis105*` declarations.
- `src/components/Hmis10501.tsx` imports from `../form-configs/types` (not from a config file) and uses the renamed types.
- TypeScript compilation passes with no errors (`tsc --noEmit`).
