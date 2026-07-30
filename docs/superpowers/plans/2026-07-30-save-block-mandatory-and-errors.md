# Save-Block Gate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Disable the Save button in every `DataModal` while there are missing mandatory fields (metadata *or* rule-driven) or unresolved program-rule errors, and tell the user via a tooltip what's still missing.

**Architecture:** A pure `computeSaveBlock` helper takes metadata mandatory ids + rule mandatory ids − hidden ids + current values + rule errors, and returns `{ missing: BlockItem[], errors: string[] }`. `DataModal` swaps its old `requiredFields: string[]` prop for `saveBlockFor(values) => SaveBlock` and wraps the Save button in a `Tooltip` that surfaces the reason. Each of the six call sites builds `saveBlockFor` from `useMetadata()` + its form-machine context.

**Tech Stack:** React 18, XState v5, antd v6, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-30-save-block-mandatory-and-errors-design.md`

---

## File map

**New**
- `src/utils/save-block.ts` — `SaveBlock`, `BlockItem`, `computeSaveBlock`.
- `src/utils/save-block.test.ts` — unit tests.

**Modify**
- `src/components/data-modal.tsx` — swap prop; wrap Save + "Save & add another" in `Tooltip`.
- `src/routes/tracked-entity.tsx` — event modal + TE-edit modal.
- `src/components/program-stage-capture.tsx` — event modal.
- `src/components/no-patient-card.tsx` — registration modal.
- `src/routes/tracked-entities.index.tsx` — registration modal.
- `src/components/main-event-capture.tsx` — child-TE registration modal.

---

## Task 1: `computeSaveBlock` helper + tests

**Files:**
- Create: `src/utils/save-block.ts`
- Create: `src/utils/save-block.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { computeSaveBlock } from "./save-block";

const labels = new Map([
    ["a", "First name"],
    ["b", "Date of birth"],
    ["c", "Weight"],
]);

describe("computeSaveBlock", () => {
    it("empty when nothing mandatory and no errors", () => {
        expect(
            computeSaveBlock({
                metadataMandatoryIds: [],
                ruleMandatoryIds: [],
                hiddenIds: [],
                values: {},
                labels,
                errors: [],
            }),
        ).toEqual({ missing: [], errors: [] });
    });

    it("flags metadata-mandatory when value is undefined", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "a", label: "First name" }]);
    });

    it("flags rule-mandatory when value is empty string", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: [],
            ruleMandatoryIds: ["b"],
            hiddenIds: [],
            values: { b: "" },
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "b", label: "Date of birth" }]);
    });

    it("does not flag hidden mandatory fields", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a"],
            ruleMandatoryIds: ["b"],
            hiddenIds: ["a", "b"],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([]);
    });

    it("dedupes metadata + rule mandatory of same id", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a"],
            ruleMandatoryIds: ["a"],
            hiddenIds: [],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "a", label: "First name" }]);
    });

    it("treats whitespace-only and empty array as missing", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a", "b", "c"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: { a: "   ", b: [], c: null },
            labels,
            errors: [],
        });
        expect(b.missing.map((m) => m.id)).toEqual(["a", "b", "c"]);
    });

    it("filled values do not appear as missing", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["a", "b"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: { a: "Jane", b: "1990-01-01" },
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([]);
    });

    it("errors passed through verbatim, order preserved", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: [],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: {},
            labels,
            errors: ["Must be > 0", "Must be past"],
        });
        expect(b.errors).toEqual(["Must be > 0", "Must be past"]);
    });

    it("unknown id falls back to id as label", () => {
        const b = computeSaveBlock({
            metadataMandatoryIds: ["Zzz"],
            ruleMandatoryIds: [],
            hiddenIds: [],
            values: {},
            labels,
            errors: [],
        });
        expect(b.missing).toEqual([{ id: "Zzz", label: "Zzz" }]);
    });
});
```

- [ ] **Step 2: Run — expect failure**

Run: `pnpm exec vitest run src/utils/save-block.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

```ts
// src/utils/save-block.ts
export type BlockItem = { id: string; label: string };
export type SaveBlock = { missing: BlockItem[]; errors: string[] };

function isEmpty(v: unknown): boolean {
    if (v === undefined || v === null) return true;
    if (typeof v === "string") return v.trim().length === 0;
    if (Array.isArray(v)) return v.length === 0;
    return false;
}

export function computeSaveBlock(input: {
    metadataMandatoryIds: string[];
    ruleMandatoryIds: string[];
    hiddenIds: string[];
    values: Record<string, unknown>;
    labels: Map<string, string>;
    errors: string[];
}): SaveBlock {
    const hidden = new Set(input.hiddenIds);
    const seen = new Set<string>();
    const missing: BlockItem[] = [];
    for (const id of [...input.metadataMandatoryIds, ...input.ruleMandatoryIds]) {
        if (seen.has(id)) continue;
        seen.add(id);
        if (hidden.has(id)) continue;
        if (!isEmpty(input.values[id])) continue;
        missing.push({ id, label: input.labels.get(id) ?? id });
    }
    return { missing, errors: [...input.errors] };
}
```

- [ ] **Step 4: Run — expect pass**

Run: `pnpm exec vitest run src/utils/save-block.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/save-block.ts src/utils/save-block.test.ts
git commit -m "feat(save-block): pure helper deriving missing + errors"
```

---

## Task 2: `DataModal` prop swap + Tooltip

**Files:**
- Modify: `src/components/data-modal.tsx`

- [ ] **Step 1: Update the props interface**

Change `DataModalProps<T>`:
- Remove: `requiredFields?: string[];`
- Add: `saveBlockFor?: (values: Record<string, unknown>) => SaveBlock;`

Import at top:
```ts
import { Tooltip } from "antd";
import type { SaveBlock } from "../utils/save-block";
```

Also update `ModalContentProps<T>` the same way.

- [ ] **Step 2: Replace the `isSubmitDisabled` computation**

Replace:

```ts
const isSubmitDisabled =
    requiredFields?.some((f) => !watchedValues[f]) ?? false;
```

with:

```ts
const block = saveBlockFor?.(watchedValues);
const blocked = Boolean(
    block && (block.missing.length > 0 || block.errors.length > 0),
);
const tooltipTitle = blocked ? renderBlockTooltip(block!) : "";
```

Add module-scope helper (top of file, after imports):

```ts
function renderBlockTooltip(block: SaveBlock): React.ReactNode {
    const lines: string[] = [];
    if (block.missing.length > 0) {
        lines.push(`Fill: ${block.missing.map((m) => m.label).join(", ")}`);
    }
    if (block.errors.length > 0) {
        lines.push(`Fix: ${block.errors.join("; ")}`);
    }
    return lines.length === 0 ? "" : (
        <div style={{ whiteSpace: "pre-line" }}>{lines.join("\n")}</div>
    );
}
```

- [ ] **Step 3: Wrap the Save + "Save & add another" buttons**

Wrap the primary Save button:

```tsx
<Tooltip title={tooltipTitle}>
    <span>
        <Button
            type="primary"
            onClick={() => handleOk()}
            loading={loading}
            disabled={blocked || loading}
            style={{ /* unchanged */ }}
        >
            {submitButtonText}
        </Button>
    </span>
</Tooltip>
```

(Wrapping in `<span>` is required for `Tooltip` on a disabled button — antd swallows events otherwise.)

Do the same for the "Save & add another" button.

- [ ] **Step 4: Propagate the new prop through `DataModal` → `ModalContent`**

In the outer `DataModal` component, remove `requiredFields` from the destructure and the pass-through; add `saveBlockFor`:

```ts
export function DataModal<...>({
    // ...
    saveBlockFor,
}: DataModalProps<T>) {
    // ...
    return (
        <ModalContent<T>
            // ...
            saveBlockFor={saveBlockFor}
        >
            {children}
        </ModalContent>
    );
}
```

- [ ] **Step 5: Typecheck (expect one caller error)**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|src/collections/|Hmis108" | head`
Expected: only an error at `src/routes/tracked-entity.tsx` line ~679 about `requiredFields` being unknown — that's fixed in Task 3.

- [ ] **Step 6: Commit**

```bash
git add src/components/data-modal.tsx
git commit -m "feat(data-modal): swap requiredFields for saveBlockFor + tooltip"
```

---

## Task 3: Wire event modal in `tracked-entity.tsx`

**Files:**
- Modify: `src/routes/tracked-entity.tsx`

- [ ] **Step 1: Add mandatory-id + label extraction near the top of `TrackedEntityComponent`**

After the existing `useMetadata()` destructure, add:

```ts
const eventMandatoryIds = useMemo(
    () =>
        (mainStage?.programStageDataElements ?? [])
            .filter((psde) => psde.compulsory)
            .map((psde) => psde.dataElement.id),
    [mainStage],
);

const dataElementLabels = useMemo(() => {
    const m = new Map<string, string>();
    for (const de of dataElements.values()) {
        m.set(de.id, de.formName || de.name);
    }
    return m;
}, [dataElements]);
```

(`mainStage` already exists in the file; `dataElements` comes from `useMetadata()` — add it to the destructure if it's not already there.)

- [ ] **Step 2: Read rule result for events**

Inside the JSX for the event `DataModal`, before rendering, get the current rule result. The event modal is wrapped in `EventContext.Provider` — read via `EventContext.useSelector` from inside a child component isn't possible up here. Instead, extract mandatory/hidden/errors from `ruleResult` in the child `EventContext.Provider` body OR pass the machine's initial rule result via the input.

Simpler: the caller doesn't have `EventContext` yet — the ruleResult lives inside the machine that's created only inside the modal. So for the event modal, `saveBlockFor` uses metadata only + values, and rule-driven blocks live inside the event form's own UI already. We wire ruleResult by dropping `saveBlockFor` down through the modal's child render prop as an extra function.

**Concrete approach:** in `tracked-entity.tsx`, replace the current `requiredFields={["occurredAt", "mrKZWf2WMIC"]}` with:

```tsx
saveBlockFor={(values) =>
    computeSaveBlock({
        metadataMandatoryIds: eventMandatoryIds,
        ruleMandatoryIds: [],
        hiddenIds: [],
        values,
        labels: dataElementLabels,
        errors: [],
    })
}
```

For rule-driven fields, extend the child render prop. Inside the `<EventContext.Provider>` body, define an inner component that reads `EventContext.useSelector((s) => s.context.ruleResult)` and, via a shared React context or a `useEffect`, publishes the rule result upward. Simpler alternative: expose `EventContext.useActorRef()` snapshot via a small wrapper hook and merge into `saveBlockFor` in the same render.

To keep the change contained, introduce a lightweight bridge:

```tsx
// Inside the DataModal's `children` prop, wrap MainEventCapture:
<EventContext.Provider ...>
    <RuleAwareForm
        renderForm={(ruleResult) => (
            <Form form={form} ... >
                <MainEventCapture ... />
            </Form>
        )}
        onRuleResult={setEventRuleResult /* useState in outer component */}
    />
</EventContext.Provider>
```

`RuleAwareForm` calls `EventContext.useSelector((s) => s.context.ruleResult)`, invokes `onRuleResult` in a `useEffect`, and renders `renderForm(ruleResult)`.

Then `saveBlockFor` reads `eventRuleResult` state:

```tsx
saveBlockFor={(values) =>
    computeSaveBlock({
        metadataMandatoryIds: eventMandatoryIds,
        ruleMandatoryIds: eventRuleResult?.mandatoryFields ?? [],
        hiddenIds: eventRuleResult?.hiddenFields ?? [],
        values,
        labels: dataElementLabels,
        errors: (eventRuleResult?.errors ?? []).map((e) => e.message),
    })
}
```

- [ ] **Step 3: Add the `RuleAwareForm` helper**

Below `TrackedEntityComponent` (or in a small new file `src/routes/tracked-entity/rule-aware-form.tsx` if the file's already crowded), add:

```tsx
import { EventContext } from "../machines";
import type { ProgramRuleResult } from "../schemas";
import { useEffect } from "react";

export function EventRuleAwareForm({
    children,
    onRuleResult,
}: {
    children: (ruleResult: ProgramRuleResult) => React.ReactNode;
    onRuleResult: (r: ProgramRuleResult) => void;
}) {
    const ruleResult = EventContext.useSelector((s) => s.context.ruleResult);
    useEffect(() => {
        onRuleResult(ruleResult);
    }, [ruleResult, onRuleResult]);
    return <>{children(ruleResult)}</>;
}
```

Wrap the current `<Form>...<MainEventCapture ... /></Form>` inside `<EventRuleAwareForm>` so the outer component learns each new `ruleResult`.

- [ ] **Step 4: Remove the old `requiredFields` prop and imports**

Delete `requiredFields={["occurredAt", "mrKZWf2WMIC"]}` from the event `DataModal`.

Add imports:
```ts
import { computeSaveBlock } from "../utils/save-block";
```

- [ ] **Step 5: Typecheck**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|src/collections/|Hmis108" | head`
Expected: no output related to `tracked-entity.tsx`.

- [ ] **Step 6: Commit**

```bash
git add src/routes/tracked-entity.tsx
git commit -m "feat(tracked-entity): save-block gate on event modal"
```

---

## Task 4: Wire TE-edit modal in `tracked-entity.tsx`

**Files:**
- Modify: `src/routes/tracked-entity.tsx`

- [ ] **Step 1: Extract TE metadata mandatory list + labels**

In `TrackedEntityComponent`, add:

```ts
const teaMandatoryIds = useMemo(
    () =>
        (program.programTrackedEntityAttributes ?? [])
            .filter((ptea) => ptea.mandatory)
            .map((ptea) => ptea.trackedEntityAttribute.id),
    [program],
);

const teaLabels = useMemo(() => {
    const m = new Map<string, string>();
    for (const tea of trackedEntityAttributes.values()) {
        m.set(tea.id, tea.displayFormName || tea.name);
    }
    return m;
}, [trackedEntityAttributes]);
```

- [ ] **Step 2: Add a `TrackedEntityRuleAwareForm` bridge**

Same pattern as `EventRuleAwareForm` but reading from `TrackedEntityContext`. Add next to (or alongside) `EventRuleAwareForm`.

```tsx
import { TrackedEntityContext } from "../machines";

export function TrackedEntityRuleAwareForm({
    children,
    onRuleResult,
}: {
    children: (ruleResult: ProgramRuleResult) => React.ReactNode;
    onRuleResult: (r: ProgramRuleResult) => void;
}) {
    const ruleResult = TrackedEntityContext.useSelector(
        (s) => s.context.ruleResult,
    );
    useEffect(() => {
        onRuleResult(ruleResult);
    }, [ruleResult, onRuleResult]);
    return <>{children(ruleResult)}</>;
}
```

Wrap `<Form>...<TrackerRegistration ... /></Form>` inside the TE modal with `TrackedEntityRuleAwareForm`, publishing to a new `teRuleResult` state.

- [ ] **Step 3: Add `saveBlockFor` to the TE modal**

```tsx
saveBlockFor={(values) =>
    computeSaveBlock({
        metadataMandatoryIds: teaMandatoryIds,
        ruleMandatoryIds: teRuleResult?.mandatoryFields ?? [],
        hiddenIds: teRuleResult?.hiddenFields ?? [],
        values,
        labels: teaLabels,
        errors: (teRuleResult?.errors ?? []).map((e) => e.message),
    })
}
```

- [ ] **Step 4: Typecheck + commit**

```bash
pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|src/collections/|Hmis108" | head
git add src/routes/tracked-entity.tsx
git commit -m "feat(tracked-entity): save-block gate on TE-edit modal"
```

---

## Task 5: Wire event modal in `program-stage-capture.tsx`

**Files:**
- Modify: `src/components/program-stage-capture.tsx`

- [ ] **Step 1: Extract stage mandatory ids + labels**

Near the top of the component, using the current `programStage` prop:

```ts
const stageMandatoryIds = useMemo(
    () =>
        (programStage.programStageDataElements ?? [])
            .filter((psde) => psde.compulsory)
            .map((psde) => psde.dataElement.id),
    [programStage],
);

const stageLabels = useMemo(() => {
    const m = new Map<string, string>();
    for (const psde of programStage.programStageDataElements) {
        const de = dataElements.get(psde.dataElement.id);
        if (de) m.set(de.id, de.formName || de.name);
    }
    return m;
}, [programStage, dataElements]);
```

(`dataElements` comes from `useMetadata()` — add to destructure if not present.)

- [ ] **Step 2: Add rule bridge + `saveBlockFor`**

Reuse `EventRuleAwareForm` from Task 3 (export it from `src/routes/tracked-entity/rule-aware-form.tsx`, or move to a shared `src/components/rule-aware-form.tsx`). Publish rule result to a `stageRuleResult` state and pass:

```tsx
saveBlockFor={(values) =>
    computeSaveBlock({
        metadataMandatoryIds: stageMandatoryIds,
        ruleMandatoryIds: stageRuleResult?.mandatoryFields ?? [],
        hiddenIds: stageRuleResult?.hiddenFields ?? [],
        values,
        labels: stageLabels,
        errors: (stageRuleResult?.errors ?? []).map((e) => e.message),
    })
}
```

- [ ] **Step 3: If moving the bridge to a shared file, do it now**

Create `src/components/rule-aware-form.tsx` exporting both `EventRuleAwareForm` and `TrackedEntityRuleAwareForm`. Update the two callers in `tracked-entity.tsx` to import from there.

- [ ] **Step 4: Typecheck + commit**

```bash
pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|src/collections/|Hmis108" | head
git add src/components/program-stage-capture.tsx src/components/rule-aware-form.tsx src/routes/tracked-entity.tsx
git commit -m "feat(program-stage-capture): save-block gate + shared rule-aware bridge"
```

---

## Task 6: Wire the three registration-style modals

**Files:**
- Modify: `src/components/no-patient-card.tsx`
- Modify: `src/routes/tracked-entities.index.tsx`
- Modify: `src/components/main-event-capture.tsx` (child TE modal at ~line 528)

Each of these modals registers a *new* tracked entity (or child TE). All use `TrackedEntityContext.Provider` and share the same mandatory-list logic as Task 4.

- [ ] **Step 1: Add a shared helper hook (DRY)**

Create `src/hooks/useTrackedEntitySaveBlock.ts`:

```ts
import { useMemo, useState, useCallback } from "react";
import { useMetadata } from "./useMetadata";
import { computeSaveBlock, type SaveBlock } from "../utils/save-block";
import type { ProgramRuleResult } from "../schemas";

export function useTrackedEntitySaveBlock() {
    const { program, trackedEntityAttributes } = useMetadata();
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult | null>(
        null,
    );

    const metadataMandatoryIds = useMemo(
        () =>
            (program.programTrackedEntityAttributes ?? [])
                .filter((ptea) => ptea.mandatory)
                .map((ptea) => ptea.trackedEntityAttribute.id),
        [program],
    );

    const labels = useMemo(() => {
        const m = new Map<string, string>();
        for (const tea of trackedEntityAttributes.values()) {
            m.set(tea.id, tea.displayFormName || tea.name);
        }
        return m;
    }, [trackedEntityAttributes]);

    const saveBlockFor = useCallback(
        (values: Record<string, unknown>): SaveBlock =>
            computeSaveBlock({
                metadataMandatoryIds,
                ruleMandatoryIds: ruleResult?.mandatoryFields ?? [],
                hiddenIds: ruleResult?.hiddenFields ?? [],
                values,
                labels,
                errors: (ruleResult?.errors ?? []).map((e) => e.message),
            }),
        [metadataMandatoryIds, ruleResult, labels],
    );

    return { saveBlockFor, onRuleResult: setRuleResult };
}
```

- [ ] **Step 2: Wire `no-patient-card.tsx`**

In the component body:

```ts
const { saveBlockFor, onRuleResult } = useTrackedEntitySaveBlock();
```

Wrap the `<Form>...<TrackerRegistration ... /></Form>` (inside the `TrackedEntityContext.Provider`) with `<TrackedEntityRuleAwareForm onRuleResult={onRuleResult}>{() => <Form>...</Form>}</TrackedEntityRuleAwareForm>`.

Pass `saveBlockFor={saveBlockFor}` on the `<DataModal>`.

- [ ] **Step 3: Wire `tracked-entities.index.tsx` (registration modal at line ~311)**

Same three-line change as Step 2.

- [ ] **Step 4: Wire the child-TE modal in `main-event-capture.tsx` (line ~528)**

Same three-line change.

- [ ] **Step 5: Typecheck + full test suite**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "error TS" | grep -Ev "tanstack.db@0.6|src/collections/|Hmis108" | head && pnpm test:vitest`
Expected: no output for the first; all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useTrackedEntitySaveBlock.ts src/components/no-patient-card.tsx src/routes/tracked-entities.index.tsx src/components/main-event-capture.tsx
git commit -m "feat(save-block): gate registration modals + shared hook"
```

---

## Task 7: Manual verification

- [ ] **Step 1: Run dev server**

`pnpm start`

- [ ] **Step 2: Registration mandatory**

Open `/tracked-entities` → New client → clear a required attribute (e.g. First name). Confirm:
- Save button is disabled (greyed).
- Hovering shows tooltip: `Fill: First name` (or whatever the label is).
- Filling the field re-enables Save.

- [ ] **Step 3: Event mandatory**

Open a client → New visit → clear a required data element. Same behaviour.

- [ ] **Step 4: Rule-driven mandatory**

Trigger a program rule that adds a field to `mandatoryFields` (e.g. a rule saying "if pregnant, tell us the LMP"). Confirm Save disables and tooltip lists the newly-mandatory field. Fill it → Save enables.

- [ ] **Step 5: Multiple rule errors**

Trigger two program-rule `SHOW_ERROR` actions at once (e.g. two invalid values). Confirm tooltip's second line reads `Fix: <error 1>; <error 2>`.

- [ ] **Step 6: Hidden mandatory**

Trigger a rule that hides an otherwise-mandatory field. Confirm Save is not blocked by it.

---

## Rollback

Revert commits from Task 6 down through Task 1 in reverse order. The old `requiredFields` prop is gone; if we need to revert only Task 3 (the one prior caller), we'd have to reinstate the prop temporarily — cleaner to revert the whole feature.

## Follow-ups (out of scope)

- Block the HMIS report "Mark Report as Verified" button by an equivalent save-block on `HmisForm`.
- Auto-scroll the modal body to the first missing field when the user clicks the disabled button (currently the button just doesn't respond).
- Field-level red highlighting driven by `saveBlock.missing` (today, per-field required styling comes from the renderer independently).
