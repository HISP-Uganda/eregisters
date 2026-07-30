# DataModal save-gate: block on mandatory-missing + rule errors

## Context

`DataModal` is the shared modal used by tracked entity registration, tracked entity edit, event edit, and any future tracker form. Today its Save button disables only when a hardcoded `requiredFields?: string[]` prop lists all-non-empty:

```ts
const isSubmitDisabled =
    requiredFields?.some((f) => !watchedValues[f]) ?? false;
```

Only one call site actually passes anything (`tracked-entity.tsx` for `["occurredAt", "mrKZWf2WMIC"]`). Every other modal lets the user click Save regardless of:

- DHIS2 metadata mandatory fields (`programTrackedEntityAttributes[].mandatory`, `programStageDataElements[].compulsory`)
- Program-rule–driven `ruleResult.mandatoryFields`
- Program-rule `ERROR` messages in `ruleResult.errors` — even when more than one

The user's request: block Save until every applicable mandatory field is filled and every rule error is resolved, and tell the user what's still missing via a tooltip on the disabled button. Hidden fields (`ruleResult.hiddenFields`) never block, even if metadata-mandatory.

## Design

### 1. Data shape

```ts
// src/utils/save-block.ts
export type BlockItem = { id: string; label: string };
export type SaveBlock = { missing: BlockItem[]; errors: string[] };

export function computeSaveBlock(input: {
    metadataMandatoryIds: string[];
    ruleMandatoryIds: string[];
    hiddenIds: string[];
    values: Record<string, unknown>;
    labels: Map<string, string>;
    errors: string[];
}): SaveBlock;
```

Behaviour:
- `missing = uniq(metadataMandatoryIds ∪ ruleMandatoryIds) − hiddenIds`, filtered by `isEmpty(values[id])` where empty means `undefined`, `null`, empty string, whitespace-only string, or empty array.
- Each missing id becomes `{ id, label: labels.get(id) ?? id }`.
- `errors` passed through verbatim — the caller already flattened them (`ruleResult.errors.map(e => e.message)`).

Pure, framework-free, small enough to unit-test exhaustively.

### 2. `DataModal` prop change

Replace `requiredFields?: string[]` with:

```ts
saveBlockFor?: (values: Record<string, unknown>) => SaveBlock;
```

`DataModal` already subscribes to the whole form via `Form.useWatch((v) => v, form)`. It calls `saveBlockFor(watchedValues)` inside that subscriber and derives:

```tsx
const block = saveBlockFor?.(watchedValues);
const disabled = loading || Boolean(
    block && (block.missing.length > 0 || block.errors.length > 0)
);
```

The Save button (and "Save & add another") is wrapped in an antd `Tooltip` that only renders content when disabled and `block` has entries:

```
Fill: First name, Date of birth
Fix: Date must be in the past; Weight must be greater than 0
```

Lines are omitted when the corresponding array is empty. Tooltip is `title=""` when Save is enabled, so no visual noise.

`requiredFields` is removed — one call site to migrate, no back-compat shim.

### 3. Call sites

Four modals; each computes `saveBlockFor` once, from the metadata + machine snapshot it already has, then passes it to `DataModal`.

For each modal, the caller builds:

- `metadataMandatoryIds` — for TE modals: `program.programTrackedEntityAttributes.filter(a => a.mandatory).map(a => a.trackedEntityAttribute.id)`. For event modals: the current `programStage.programStageDataElements.filter(psde => psde.compulsory).map(psde => psde.dataElement.id)`.
- `ruleMandatoryIds`, `hiddenIds`, `errors` — from `TrackedEntityContext.useSelector(s => s.context.ruleResult)` or `EventContext.useSelector(...)`.
- `labels` — `Map<string, string>` from `useMetadata()`'s `trackedEntityAttributes` / `dataElements`, preferring `displayFormName` / `formName` and falling back to `name`, then id.

Then `saveBlockFor = (values) => computeSaveBlock({ metadataMandatoryIds, ruleMandatoryIds, hiddenIds, values, labels, errors })`.

Files:
- `src/routes/tracked-entity.tsx` — event `DataModal` and TE-edit `DataModal`.
- `src/components/no-patient-card.tsx` — registration `DataModal`.
- `src/components/main-event-capture.tsx` — child-TE `DataModal`.

### 4. Testing

`src/utils/save-block.test.ts` covers:

- Missing metadata-mandatory blocks; filling it unblocks.
- Missing rule-mandatory blocks; hidden mandatory does not.
- Metadata + rule mandatory de-duplicate.
- Whitespace-only and empty-array values count as missing.
- `errors` propagates verbatim; multiple errors preserved in order.
- Unknown id in `metadataMandatoryIds` falls back to `label = id`.

Manual verification:

1. Open TE registration; leave a required attribute empty → Save disabled, tooltip lists the field.
2. Fill it → Save enabled.
3. Add a program rule that emits `ERROR` on some condition → Save disabled with the error's message in tooltip; resolve → enabled.
4. Introduce a program rule that hides a metadata-mandatory field → Save enabled (hidden overrides mandatory).
5. Two rule errors + one missing mandatory at once → tooltip shows both lines.

### 5. Files touched

- **New** `src/utils/save-block.ts`, `src/utils/save-block.test.ts`
- **Modify** `src/components/data-modal.tsx` (swap prop, wrap buttons in `Tooltip`)
- **Modify** `src/routes/tracked-entity.tsx`, `src/components/no-patient-card.tsx`, `src/components/main-event-capture.tsx` (build `saveBlockFor`)

## Out of scope

- Blocking the HMIS report verify button (separate flow).
- Auto-scrolling to the first missing field on click attempt.
- Inline field-level red highlighting driven by `saveBlock` (rule-driven mandatory highlighting is a separate concern; today it comes from per-field logic in the renderer).
