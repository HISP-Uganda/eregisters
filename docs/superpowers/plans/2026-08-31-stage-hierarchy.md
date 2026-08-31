# Stage Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the analytics line list's unrestricted "pick any stage as parent, any others as children" model with an admin-configured, per-program allow-list of legal parent→child stage pairs, and let the line list's single-stage picker derive one-to-many (parent), one-to-one (child), or both joins from that config.

**Architecture:** A new DHIS2 dataStore key (`dataStore/eregisters/stage-hierarchy`) holds a flat `{ parentStageId, childStageId }[]` for the app's one active program, synced into a new Dexie table via a new XState actor mirroring the existing `pullUIConfig`/`ui-config` pattern in `src/machines/sync.ts`. A new admin screen (mirroring `admin.app-settings.tsx`'s read-modify-write pattern) lets an `ALL`-authority admin edit it. The analytics dataset builder (`parent-event-dataset.ts`/`column-registry.ts`) gains a symmetric "one-to-one parent" flattening path alongside the existing "one-to-many children" path, keyed by a new `linkedParent.<stageId>.*` column prefix (the existing `parentEvent.*` prefix, meaning "the picked stage's own event," is untouched). The line-list filter bar collapses `mainStageId`+`childStageIds` into `selectedStageId` + a narrowed `childStageIds`, with the Stage select's own option labels showing each stage's inferred role.

**Tech Stack:** React, TanStack Router, XState v5, Dexie, `@dhis2/app-runtime` (`useDataEngine`), antd v6, Vitest.

**Decisions this plan implements (do not re-litigate — see `.scratch/stage-hierarchy/` for the full rationale of each):**
- [Admin screen for configuring stage parent/child pairs](../../../.scratch/stage-hierarchy/issues/01-admin-stage-pair-config-screen.md)
- [Analytics filter/dataset shape for stage-hierarchy-driven joins](../../../.scratch/stage-hierarchy/issues/02-analytics-filter-dataset-shape.md)
- [Line-list stage picker UI](../../../.scratch/stage-hierarchy/issues/03-line-list-stage-picker-ui.md)

Two throwaway branches hold working reference UI code (do not merge, just consult): `prototype/stage-relations-admin` (admin screen, `src/routes/admin.stage-relations.tsx` on that branch) and `prototype/stage-picker-line-list` (line-list picker, `src/components/analytics/stage-picker-variants.prototype.tsx` + `WIRING.prototype.md` on that branch).

---

## File Structure

| File | Change |
|---|---|
| `src/schemas.ts` | Add `StagePair`, `StageHierarchyConfig`, `emptyStageHierarchyConfig` |
| `src/db/index.ts` | Add `stageHierarchy` Dexie table, version bump |
| `src/hooks/useStageHierarchyConfig.ts` | New — mirrors `useUIConfig.ts` |
| `src/machines/sync.ts` | New `pullStageHierarchy` actor + `pullingStageHierarchy` state, chained after `pullingUIConfig` |
| `src/routes/admin.stage-relations.tsx` | New — the real admin screen (Variant A) |
| `src/routes/admin.tsx` | Add nav entry |
| `src/router.tsx` | Wire the new admin child route |
| `src/analytics/types.ts` | Extend `AnalyticsDatasetInput`, `AnalyticsRow`, registry input types |
| `src/analytics/column-registry.ts` | Rename `mainStageId` param docs stay, add `realizedParentStageIds`, generate `linkedParent.<stageId>.*` columns |
| `src/analytics/parent-event-dataset.ts` | Rename `mainStageId` → `selectedStageId`, add `legalParentStageIds`, compute realized parent stages from real data, flatten one-to-one |
| `src/components/analytics/analytics-filter-bar.tsx` | `mainStageId` → `selectedStageId`, Variant A annotated Select, scoped/hidden child field |
| `src/routes/analytics.tsx` | Wire `useStageHierarchyConfig`, derive `legalParentStageIds`, pass `pairs` to filter bar |

No changes needed to `src/components/analytics/line-list-table.tsx` — `MAIN_EVENT_ID_KEY`/`TRACKED_ENTITY_ID_KEY` reference `parentEvent.event`/`trackedEntity.trackedEntity`, both untouched by this effort (ticket 02's decision).

---

### Task 1: Schema + Dexie table for the stage-hierarchy config

**Files:**
- Modify: `src/schemas.ts`
- Modify: `src/db/index.ts`

- [ ] **Step 1: Add the config type to `src/schemas.ts`**

Add near `UIConfig`/`emptyUIConfig` (around line 743):

```ts
export interface StagePair {
    parentStageId: string;
    childStageId: string;
}

export type StageHierarchyConfig = StagePair[];

export const emptyStageHierarchyConfig: StageHierarchyConfig = [];
```

- [ ] **Step 2: Add the Dexie table**

In `src/db/index.ts`, add the import (alongside the existing `UIConfig` import at the top):

```ts
import {
    // ...existing imports...
    StageHierarchyConfig,
    UIConfig,
} from "../schemas";
```

Add the table field next to `uiConfig` (around line 110):

```ts
uiConfig!: Table<{ id: string; config: UIConfig }, string>;
stageHierarchy!: Table<{ id: string; config: StageHierarchyConfig }, string>;
```

Add a new version bump after `.version(3)` (around line 137-139):

```ts
this.version(4).stores({
    stageHierarchy: "id",
});
```

- [ ] **Step 3: Verify it compiles**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep -E "schemas\.ts|db/index\.ts"`
Expected: no output (no errors)

- [ ] **Step 4: Commit**

```bash
git add src/schemas.ts src/db/index.ts
git commit -m "feat(stage-hierarchy): add config type and Dexie table"
```

---

### Task 2: `useStageHierarchyConfig` hook

**Files:**
- Create: `src/hooks/useStageHierarchyConfig.ts`

Mirror `src/hooks/useUIConfig.ts` exactly, swapping in the new table/type. No test file — this codebase has no existing tests for its live-query hooks (`useUIConfig.ts` has none either); the hook is exercised indirectly wherever it's used later in this plan.

- [ ] **Step 1: Write the hook**

```ts
import { liveQuery } from "dexie";
import { useEffect, useState } from "react";
import { db } from "../db";
import { emptyStageHierarchyConfig, StageHierarchyConfig } from "../schemas";

export const useStageHierarchyConfig = (): StageHierarchyConfig => {
    const [config, setConfig] = useState<StageHierarchyConfig>(
        emptyStageHierarchyConfig,
    );

    useEffect(() => {
        const obs = liveQuery(() => db.stageHierarchy.get("main"));
        const sub = obs.subscribe({
            next: (row) => setConfig(row?.config ?? emptyStageHierarchyConfig),
        });
        return () => sub.unsubscribe();
    }, []);

    return config;
};
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep useStageHierarchyConfig`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useStageHierarchyConfig.ts
git commit -m "feat(stage-hierarchy): add useStageHierarchyConfig hook"
```

---

### Task 3: Sync machine — pull the config from dataStore

**Files:**
- Modify: `src/machines/sync.ts`

This mirrors the existing `pullUIConfig` actor / `pullingUIConfig` state exactly, chained as a new step between `pullingUIConfig` and `queryingIndexDB` so a metadata sync always refreshes both.

- [ ] **Step 1: Add the import**

Near the top imports (around line 7, alongside `emptyUIConfig`):

```ts
import {
    // ...existing imports...
    emptyStageHierarchyConfig,
    emptyUIConfig,
    StageHierarchyConfig,
    // ...
} from "../schemas";
```

- [ ] **Step 2: Add `stageHierarchyConfig` to the machine context type**

Find the context interface field `uiConfig: UIConfig;` (around line 194) and add directly after it:

```ts
uiConfig: UIConfig;
stageHierarchyConfig: StageHierarchyConfig;
```

- [ ] **Step 3: Add the `pullStageHierarchy` actor**

In the `actors: { ... }` block (around line 587), directly after the existing `pullUIConfig` actor definition (ends around line 819), add:

```ts
pullStageHierarchy: fromPromise<
    StageHierarchyConfig,
    { engine: ReturnType<typeof useDataEngine> }
>(async ({ input: { engine } }) => {
    try {
        const result = (await engine.query({
            stageHierarchy: {
                resource: "dataStore/eregisters/stage-hierarchy",
            },
        })) as { stageHierarchy: StageHierarchyConfig };
        await db.stageHierarchy.bulkPut([
            { id: "main", config: result.stageHierarchy },
        ]);
        return result.stageHierarchy;
    } catch {
        await db.stageHierarchy.bulkPut([
            { id: "main", config: emptyStageHierarchyConfig },
        ]);
        return emptyStageHierarchyConfig;
    }
}),
```

- [ ] **Step 4: Add `stageHierarchyConfig` to the initial context**

Find `uiConfig: emptyUIConfig,` in the context initializer (around line 1428) and add directly after:

```ts
uiConfig: emptyUIConfig,
stageHierarchyConfig: emptyStageHierarchyConfig,
```

- [ ] **Step 5: Chain a new `pullingStageHierarchy` state**

Find the `pullingUIConfig` state (around line 1617-1629):

```ts
pullingUIConfig: {
    invoke: {
        src: "pullUIConfig",
        input: ({ context: { engine } }) => ({ engine }),
        onDone: {
            target: "queryingIndexDB",
            actions: assign(({ event }) => ({
                uiConfig: event.output,
            })),
        },
        onError: "queryingIndexDB",
    },
},
```

Change its `onDone`/`onError` targets to point at the new state, and add the new state right after it:

```ts
pullingUIConfig: {
    invoke: {
        src: "pullUIConfig",
        input: ({ context: { engine } }) => ({ engine }),
        onDone: {
            target: "pullingStageHierarchy",
            actions: assign(({ event }) => ({
                uiConfig: event.output,
            })),
        },
        onError: "pullingStageHierarchy",
    },
},
pullingStageHierarchy: {
    invoke: {
        src: "pullStageHierarchy",
        input: ({ context: { engine } }) => ({ engine }),
        onDone: {
            target: "queryingIndexDB",
            actions: assign(({ event }) => ({
                stageHierarchyConfig: event.output,
            })),
        },
        onError: "queryingIndexDB",
    },
},
```

- [ ] **Step 6: Run the existing sync machine test**

Run: `pnpm exec vitest run src/machines/sync.test.ts`
Expected: PASS (3 tests) — this test doesn't exercise the new state directly, it's a regression check that the machine still constructs/type-checks correctly.

- [ ] **Step 7: Verify full typecheck**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep "sync\.ts"`
Expected: no output

- [ ] **Step 8: Commit**

```bash
git add src/machines/sync.ts
git commit -m "feat(stage-hierarchy): pull stage-hierarchy config during metadata sync"
```

---

### Task 4: Admin screen — configure stage parent/child pairs

**Files:**
- Create: `src/routes/admin.stage-relations.tsx`
- Modify: `src/routes/admin.tsx`
- Modify: `src/router.tsx`

Reference the resolved decision in [Admin screen for configuring stage parent/child pairs](../../../.scratch/stage-hierarchy/issues/01-admin-stage-pair-config-screen.md) and Variant A's logic in `src/components/analytics/stage-picker-variants.prototype.tsx` / `src/routes/admin.stage-relations.tsx` on the `prototype/stage-relations-admin` branch (`git show prototype/stage-relations-admin:src/routes/admin.stage-relations.tsx` to view it) — this task turns that prototype into the real screen: real data (`useMetadata().program.programStages`, `useStageHierarchyConfig()`), real save (`engine.mutate` to dataStore, mirroring `admin.app-settings.tsx`), no `?variant=` switcher, only the winning structure (per-stage children checklist, hard-exclude invalid options).

- [ ] **Step 1: Write the admin route**

```tsx
import { useDataEngine } from "@dhis2/app-runtime";
import { createRoute } from "@tanstack/react-router";
import { Button, Flex, message, Select, Table, Typography } from "antd";
import React, { useState } from "react";
import { db } from "../db";
import { useMetadata } from "../hooks/useMetadata";
import { useStageHierarchyConfig } from "../hooks/useStageHierarchyConfig";
import type { StagePair } from "../schemas";
import { AdminRoute } from "./admin";

export const AdminStageRelationsRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/stage-relations",
    component: StageRelations,
});

interface Stage {
    id: string;
    name: string;
}

function childrenOf(stageId: string, pairs: StagePair[]) {
    return pairs
        .filter((p) => p.parentStageId === stageId)
        .map((p) => p.childStageId);
}

function isReverseOf(
    stageId: string,
    candidateChildId: string,
    pairs: StagePair[],
) {
    return pairs.some(
        (p) =>
            p.parentStageId === candidateChildId && p.childStageId === stageId,
    );
}

function StageRelations() {
    const engine = useDataEngine();
    const { program } = useMetadata();
    const savedConfig = useStageHierarchyConfig();
    const [pairs, setPairs] = useState<StagePair[]>(savedConfig);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const stages: Stage[] = program.programStages;

    // Re-sync local state whenever the live-queried saved config changes
    // (e.g. another admin saved elsewhere), but only while there are no
    // unsaved local edits.
    React.useEffect(() => {
        if (!dirty) setPairs(savedConfig);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedConfig]);

    const setChildrenOf = (stageId: string, childIds: string[]) => {
        setPairs((prev) => [
            ...prev.filter((p) => p.parentStageId !== stageId),
            ...childIds.map((childStageId) => ({
                parentStageId: stageId,
                childStageId,
            })),
        ]);
        setDirty(true);
    };

    const save = async () => {
        setSaving(true);
        try {
            try {
                await engine.mutate({
                    type: "update",
                    resource: "dataStore/eregisters",
                    id: "stage-hierarchy",
                    data: pairs,
                });
            } catch {
                await engine.mutate({
                    type: "create",
                    resource: "dataStore/eregisters",
                    data: { key: "stage-hierarchy", value: pairs },
                });
            }
            await db.stageHierarchy.put({ id: "main", config: pairs });
            setDirty(false);
            message.success("Stage relations saved");
        } catch {
            message.error("Failed to save stage relations");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Flex vertical gap={20} style={{ maxWidth: 780 }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
                Stage Relations
            </Typography.Title>
            <Typography.Text type="secondary">
                Configure which program stages may be a child of which other
                stage, for <b>{program.name}</b>. Until a stage has a
                relation configured here, the analytics line list treats it
                as unrestricted.
            </Typography.Text>

            <Table
                size="small"
                pagination={false}
                rowKey="id"
                dataSource={stages}
                columns={[
                    { title: "Stage", dataIndex: "name", width: 200 },
                    {
                        title: "Legal child stages",
                        render: (_: unknown, stage: Stage) => (
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="No children configured — unrestricted"
                                value={childrenOf(stage.id, pairs)}
                                onChange={(childIds: string[]) =>
                                    setChildrenOf(stage.id, childIds)
                                }
                                options={stages
                                    .filter((s) => s.id !== stage.id)
                                    .filter(
                                        (s) =>
                                            !isReverseOf(stage.id, s.id, pairs),
                                    )
                                    .map((s) => ({
                                        label: s.name,
                                        value: s.id,
                                    }))}
                            />
                        ),
                    },
                ]}
            />

            <Flex>
                <Button type="primary" loading={saving} onClick={save}>
                    Save
                </Button>
            </Flex>
        </Flex>
    );
}
```

- [ ] **Step 2: Add the nav entry in `src/routes/admin.tsx`**

Add `ExperimentOutlined` (or another distinct icon — `ApartmentOutlined` reads better semantically for a hierarchy screen) to the icon import, and a new `ADMIN_ITEMS` entry:

```ts
import {
    ApartmentOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from "@ant-design/icons";
```

```ts
const ADMIN_ITEMS = [
    // ...existing entries...
    {
        key: "stage-relations",
        path: "/admin/stage-relations",
        icon: <ApartmentOutlined />,
        label: "Stage Relations",
    },
];
```

- [ ] **Step 3: Wire the route in `src/router.tsx`**

```ts
import { AdminStageRelationsRoute } from "./routes/admin.stage-relations";
```

```ts
AdminRoute.addChildren([
    AdminSectionLayoutRoute,
    AdminAppSettingsRoute,
    AdminStageRelationsRoute,
]),
```

- [ ] **Step 4: Verify it compiles**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep -E "admin\.stage-relations|admin\.tsx|router\.tsx"`
Expected: no output

- [ ] **Step 5: Manual smoke test**

Run: `pnpm start`, log in as a user with the `ALL` authority, navigate to **Admin → Stage Relations**, configure a pair, click Save, reload the page, confirm the pair persisted (both via the DHIS2 dataStore — check `<dhis2-instance>/api/dataStore/eregisters/stage-hierarchy` — and via the local Dexie table surviving a refresh).

- [ ] **Step 6: Commit**

```bash
git add src/routes/admin.stage-relations.tsx src/routes/admin.tsx src/router.tsx
git commit -m "feat(stage-hierarchy): add admin screen for configuring stage pairs"
```

---

### Task 5: `column-registry.ts` — generate one-to-one `linkedParent.*` columns

**Files:**
- Modify: `src/analytics/types.ts`
- Modify: `src/analytics/column-registry.ts`
- Modify: `src/analytics/column-registry.test.ts`

This task only changes column *generation*. Task 6 wires real data into it. Work test-first: extend the existing test file, watch it fail, then implement.

- [ ] **Step 1: Extend `RegistryInput` in `src/analytics/column-registry.ts`**

```ts
interface RegistryInput {
    metadata: AnalyticsMetadata;
    mainStageId: string;
    childStageSlotCounts: Map<string, number>;
    /** Parent stages actually realized in the real event data for the
     * selected stage (computed by parent-event-dataset.ts from the
     * configured legal parents) — NOT the full configured legal-parent
     * set. One flat (non-slotted) linkedParent.<stageId>.* column group is
     * generated per entry. Empty when the selected stage has no configured
     * parent or no matching events exist yet. */
    realizedParentStageIds?: string[];
}
```

- [ ] **Step 2: Write the failing test**

Add to `src/analytics/column-registry.test.ts`, inside the existing `describe("buildColumnRegistry", ...)` block:

```ts
it("adds one flat linkedParent column group per realized parent stage, no slotting", () => {
    const columns = buildColumnRegistry({
        metadata,
        mainStageId: "followup001",
        childStageSlotCounts: new Map(),
        realizedParentStageIds: ["visit000001"],
    });

    expect(
        columns.find((c) => c.key === "linkedParent.visit000001.event")
            ?.groupPath,
    ).toEqual(["Linked Parent", "Visit", "System"]);
    expect(
        columns.find(
            (c) => c.key === "linkedParent.visit000001.dataValue.weightuid01",
        )?.groupPath,
    ).toEqual(["Linked Parent", "Visit", "Triage"]);
    expect(
        columns.find(
            (c) => c.key === "linkedParent.visit000001.dataValue.weightuid01",
        )?.label,
    ).toBe("Weight");
    // no slot suffix anywhere, unlike childEvent columns
    expect(
        columns.some((c) => /^linkedParent\..*\.\d+\./.test(c.key)),
    ).toBe(false);
});

it("adds no linkedParent columns when no parent stage is realized", () => {
    const columns = buildColumnRegistry({
        metadata,
        mainStageId: "followup001",
        childStageSlotCounts: new Map(),
    });

    expect(columns.some((c) => c.key.startsWith("linkedParent."))).toBe(
        false,
    );
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `pnpm exec vitest run src/analytics/column-registry.test.ts`
Expected: FAIL — `linkedParent.*` columns not found (they don't exist yet)

- [ ] **Step 4: Implement in `src/analytics/column-registry.ts`**

Add a new loop mirroring the existing child-stage loop (around line 157-200), but flat (no slot dimension). Place it after that loop, before `return columns;`:

```ts
for (const stageId of realizedParentStageIds ?? []) {
    const stage = metadata.program.programStages.find((s) => s.id === stageId);
    if (!stage) continue;

    columns.push(
        column({
            key: `linkedParent.${stageId}.event`,
            label: "Event ID",
            source: "parentEvent",
            sourceFieldId: "event",
            valueKind: "string",
            groupPath: ["Linked Parent", stage.name, "System"],
            defaultVisible: false,
        }),
    );

    for (const psde of stage.programStageDataElements ?? []) {
        const de =
            metadata.dataElements.get(psde.dataElement.id) ??
            psde.dataElement;
        const section = findStageSection(stage, de.id) ?? "Ungrouped";
        const valueKind = valueKindFromDhis2(de.valueType);
        const deLabel = labelFrom(de.name, de.formName, de.id);
        columns.push(
            column({
                key: `linkedParent.${stageId}.dataValue.${de.id}`,
                label: deLabel,
                source: "parentEvent",
                sourceFieldId: de.id,
                valueKind,
                optionSetId: de.optionSet?.id,
                groupPath: ["Linked Parent", stage.name, section],
                defaultVisible: false,
                canMeasure: valueKind === "number",
            }),
        );
    }
}
```

Update the function signature to destructure the new field:

```ts
export function buildColumnRegistry({
    metadata,
    mainStageId,
    childStageSlotCounts,
    realizedParentStageIds,
}: RegistryInput): AnalyticsColumn[] {
```

`source: "parentEvent"` here is a reuse of the existing `AnalyticsSource` union (the value just marks "this column reads from an event object, not a tracked-entity/enrollment field" — it does not collide with the `parentEvent.*` column-*key* prefix, which is a different, unrelated string). If this reuse feels confusing when you're in the code, it's fine to leave a one-line comment noting the two are unrelated namespaces; don't introduce a new `AnalyticsSource` variant for this — that's out of scope.

- [ ] **Step 5: Run it to verify it passes**

Run: `pnpm exec vitest run src/analytics/column-registry.test.ts`
Expected: PASS (all tests, including the two new ones)

- [ ] **Step 6: Commit**

```bash
git add src/analytics/column-registry.ts src/analytics/column-registry.test.ts
git commit -m "feat(stage-hierarchy): generate linkedParent columns for realized parent stages"
```

---

### Task 6: `parent-event-dataset.ts` — resolve the real one-to-one join

**Files:**
- Modify: `src/analytics/types.ts`
- Modify: `src/analytics/parent-event-dataset.ts`
- Modify: `src/analytics/parent-event-dataset.test.ts`

This is the core join-logic task. `selectedEvents` (renamed from `mainEvents`) are events in the currently-picked stage. For each `legalParentStageId` passed in, look up each selected event's *actual* `event.parentEvent` FK target; if that target's own `programStage` matches a legal parent stage id, that stage is "realized," and its data gets flattened onto the row as `linkedParent.<stageId>.*` — exactly one match per row (never a slot), since a real event has exactly one `parentEvent`.

- [ ] **Step 1: Update types in `src/analytics/types.ts`**

`AnalyticsRow` (around line 32): add the new field alongside `childEventsByStage`:

```ts
export interface AnalyticsRow {
    id: string;
    trackedEntity: FlattenedTrackedEntity;
    enrollment: FlattenedEnrollment | undefined;
    parentEvent: FlattenedEvent;
    childEventsByStage: Record<string, FlattenedEvent[]>;
    linkedParentByStage: Record<string, FlattenedEvent>;
    values: Record<string, AnalyticsCell>;
}
```

`AnalyticsDatasetInput` (around line 88): rename `mainStageId` to `selectedStageId`, add `legalParentStageIds`:

```ts
export interface AnalyticsDatasetInput {
    metadata: AnalyticsMetadata;
    trackedEntities: FlattenedTrackedEntity[];
    enrollments: FlattenedEnrollment[];
    events: FlattenedEvent[];
    orgUnit: string;
    programId: string;
    selectedStageId: string;
    childStageIds: string[];
    /** The selected stage's configured legal parent stages (from the
     * admin-configured stage-hierarchy pairs) — a candidate list. The
     * dataset builder narrows this down at build time to whichever of
     * these are actually realized by real event data (see
     * `parent-event-dataset.ts`), which is what actually drives column
     * generation. Empty when the selected stage has no configured parent. */
    legalParentStageIds: string[];
    startDate: string;
    endDate: string;
}
```

`AnalyticsDataset` (around line 101) keeps `mainStage: ProgramStage` as-is — that field name refers to "the anchor stage's metadata object" and isn't part of the `mainStageId` rename (it's a return value, not a filter concept); leave it.

- [ ] **Step 2: Write the failing test**

Add to `src/analytics/parent-event-dataset.test.ts`. Note the existing tests all pass `mainStageId`/no `legalParentStageIds` — **update every existing call site in this file** to use `selectedStageId: ...` instead of `mainStageId: ...` and add `legalParentStageIds: []` (empty array — no linkedParent behavior expected for those, they test the existing one-to-many path). Then add:

```ts
it("flattens exactly one realized parent stage's data as linkedParent columns, one-to-one", () => {
    const dataset = buildParentEventDataset({
        metadata,
        orgUnit: "ouuid000001",
        programId: "programuid1",
        selectedStageId: "labstage001",
        childStageIds: [],
        legalParentStageIds: ["visit000001"],
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        trackedEntities: [trackedEntity("teuid000001", {})],
        enrollments: [enrollment("enroll00001", "teuid000001")],
        events: [
            event("visit000001", "visit000001", "teuid000001", {
                enrollment: "enroll00001",
                dataValues: { weightuid01: 51 },
            }),
            event("lab00000001", "labstage001", "teuid000001", {
                enrollment: "enroll00001",
                parentEvent: "visit000001",
                dataValues: { resultuid01: "P" },
            }),
        ],
    });

    expect(dataset.rows).toHaveLength(1);
    expect(dataset.rows[0].id).toBe("lab00000001");
    expect(
        dataset.rows[0].values["linkedParent.visit000001.dataValue.weightuid01"]
            .raw,
    ).toBe(51);
    expect(dataset.rows[0].values["linkedParent.visit000001.event"].raw).toBe(
        "visit000001",
    );
    expect(
        dataset.columns.some(
            (c) => c.key === "linkedParent.visit000001.dataValue.weightuid01",
        ),
    ).toBe(true);
});

it("does not flatten a legal parent stage that has no realized events", () => {
    const dataset = buildParentEventDataset({
        metadata,
        orgUnit: "ouuid000001",
        programId: "programuid1",
        selectedStageId: "labstage001",
        childStageIds: [],
        legalParentStageIds: ["visit000001"],
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        trackedEntities: [trackedEntity("teuid000001", {})],
        enrollments: [enrollment("enroll00001", "teuid000001")],
        events: [
            // lab event with NO parentEvent set at all
            event("lab00000001", "labstage001", "teuid000001", {
                enrollment: "enroll00001",
                dataValues: { resultuid01: "P" },
            }),
        ],
    });

    expect(dataset.rows).toHaveLength(1);
    expect(
        dataset.columns.some((c) => c.key.startsWith("linkedParent.")),
    ).toBe(false);
    expect(dataset.rows[0].linkedParentByStage).toEqual({});
});
```

You'll need a `labstage001` main-stage row anchor — reuse `makeMetadata()`'s existing `labstage001` stage (already has `programStageDataElements: [{ dataElement: result }]` — `resultuid01`), and `visit000001` already has the `weightuid01` data element. No metadata changes needed for these two new tests.

- [ ] **Step 3: Run it to verify it fails**

Run: `pnpm exec vitest run src/analytics/parent-event-dataset.test.ts`
Expected: FAIL (compile error first — `selectedStageId`/`legalParentStageIds` don't exist on the input type yet; then, once the type-only rename is done as an intermediate step, a real assertion failure — `linkedParent.*` values are `undefined`)

- [ ] **Step 4: Implement in `src/analytics/parent-event-dataset.ts`**

Rename `mainStageId` → `selectedStageId` throughout this file (the parameter, the "not found" error message, and every `input.mainStageId` reference). Then add the one-to-one resolution:

After the existing `childEventsByParent` map is built (around line 51-59), add an all-events lookup and the realized-parent-stage detection:

```ts
const eventById = new Map(input.events.map((event) => [event.event, event]));
const legalParentStageIds = new Set(input.legalParentStageIds);

function resolveLinkedParent(selectedEvent: typeof input.events[number]) {
    if (!selectedEvent.parentEvent) return undefined;
    const parent = eventById.get(selectedEvent.parentEvent);
    if (!parent) return undefined;
    if (parent.syncStatus === "deleted" || parent.deleted) return undefined;
    if (!legalParentStageIds.has(parent.programStage)) return undefined;
    return parent;
}
```

Compute which legal parent stages are actually realized, before building columns (mirroring how `slotCounts` is computed before `buildColumnRegistry` is called):

```ts
const realizedParentStageIds = new Set<string>();
for (const selectedEvent of mainEvents) {
    const parent = resolveLinkedParent(selectedEvent);
    if (parent) realizedParentStageIds.add(parent.programStage);
}
```

Update the `buildColumnRegistry` call (around line 74-78) to pass the realized set:

```ts
const columns = buildColumnRegistry({
    metadata: input.metadata,
    mainStageId: input.selectedStageId,
    childStageSlotCounts: slotCounts,
    realizedParentStageIds: [...realizedParentStageIds],
});
```

Update row-building (around line 80-106) to compute and attach `linkedParentByStage`:

```ts
const rows = mainEvents.map((parentEvent) => {
    const trackedEntity =
        trackedEntityById.get(parentEvent.trackedEntity) ??
        fallbackTrackedEntity(parentEvent);

    const childEventsByStage = groupChildrenByStage(
        childEventsByParent.get(parentEvent.event) ?? [],
    );
    const linkedParent = resolveLinkedParent(parentEvent);
    const linkedParentByStage: Record<string, RecordWithDataValues> = {};
    if (linkedParent) {
        linkedParentByStage[linkedParent.programStage] = linkedParent;
    }
    const enrollment = enrollmentById.get(parentEvent.enrollment);
    const values = buildRowValues({
        columns,
        trackedEntity,
        enrollment,
        parentEvent,
        childEventsByStage,
        linkedParentByStage,
        optionSets: input.metadata.optionSets,
    });

    return {
        id: parentEvent.event,
        trackedEntity,
        enrollment,
        parentEvent,
        childEventsByStage,
        linkedParentByStage,
        values,
    };
});
```

Update `buildRowValues` and `readRawValue` to accept and read `linkedParentByStage`:

```ts
function buildRowValues({
    columns,
    trackedEntity,
    enrollment,
    parentEvent,
    childEventsByStage,
    linkedParentByStage,
    optionSets,
}: {
    columns: AnalyticsColumn[];
    trackedEntity: RecordWithAttributes;
    enrollment: RecordWithAttributes | undefined;
    parentEvent: RecordWithDataValues;
    childEventsByStage: Record<string, RecordWithDataValues[]>;
    linkedParentByStage: Record<string, RecordWithDataValues>;
    optionSets: Parameters<typeof displayValue>[2];
}): Record<string, AnalyticsCell> {
    const values: Record<string, AnalyticsCell> = {};
    for (const column of columns) {
        const raw = readRawValue(
            column.key,
            trackedEntity,
            enrollment,
            parentEvent,
            childEventsByStage,
            linkedParentByStage,
        );
        values[column.key] = {
            raw,
            display: displayValue(raw, column.optionSetId, optionSets),
        };
    }
    return values;
}

function readRawValue(
    key: string,
    trackedEntity: RecordWithAttributes,
    enrollment: RecordWithAttributes | undefined,
    parentEvent: RecordWithDataValues,
    childEventsByStage: Record<string, RecordWithDataValues[]>,
    linkedParentByStage: Record<string, RecordWithDataValues>,
) {
    if (key.startsWith("te.attribute.")) {
        return trackedEntity.attributes[key.replace("te.attribute.", "")];
    }
    if (key.startsWith("trackedEntity.")) {
        return trackedEntity[key.replace("trackedEntity.", "")];
    }
    if (key.startsWith("enrollment.")) {
        return enrollment?.[key.replace("enrollment.", "")];
    }
    if (key.startsWith("parentEvent.dataValue.")) {
        return parentEvent.dataValues[
            key.replace("parentEvent.dataValue.", "")
        ];
    }
    if (key.startsWith("parentEvent.")) {
        return parentEvent[key.replace("parentEvent.", "")];
    }
    if (key.startsWith("linkedParent.")) {
        const [, stageId, fieldType, fieldId] = key.split(".");
        const parent = linkedParentByStage[stageId];
        if (!parent) return undefined;
        return fieldType === "dataValue"
            ? parent.dataValues[fieldId]
            : parent[fieldType];
    }
    if (key.startsWith("childEvent.")) {
        const [, stageId, slotText, fieldType, fieldId] = key.split(".");
        const child = childEventsByStage[stageId]?.[Number(slotText) - 1];
        if (!child) return undefined;
        return fieldType === "dataValue"
            ? child.dataValues[fieldId]
            : child[fieldType];
    }
    return undefined;
}
```

Note the `linkedParent.<stageId>.event` key: with the split-by-`.` logic above, `key.split(".")` on `"linkedParent.visit000001.event"` gives `["linkedParent", "visit000001", "event", undefined]` — `fieldType` is `"event"`, not `"dataValue"`, so it falls into the `parent[fieldType]` branch, i.e. `parent["event"]` — correct, matches the column-registry task's `sourceFieldId: "event"` column.

- [ ] **Step 5: Run it to verify it passes**

Run: `pnpm exec vitest run src/analytics/parent-event-dataset.test.ts`
Expected: PASS (all tests, including the two new ones)

- [ ] **Step 6: Run the full suite to check for regressions**

Run: `pnpm exec vitest run`
Expected: PASS, all files (this will also catch any other file still calling `buildParentEventDataset`/`buildColumnRegistry` with the old `mainStageId` field name that this task didn't already fix — fix any such call sites now)

- [ ] **Step 7: Commit**

```bash
git add src/analytics/types.ts src/analytics/parent-event-dataset.ts src/analytics/parent-event-dataset.test.ts
git commit -m "feat(stage-hierarchy): resolve one-to-one linkedParent join from real event data"
```

---

### Task 7: `AnalyticsFilterBar` — Variant A picker

**Files:**
- Modify: `src/components/analytics/analytics-filter-bar.tsx`

Reference: [Line-list stage picker UI](../../../.scratch/stage-hierarchy/issues/03-line-list-stage-picker-ui.md)'s decision, and `src/components/analytics/stage-picker-variants.prototype.tsx`'s `StagePickerVariantA` on the `prototype/stage-picker-line-list` branch (`git show prototype/stage-picker-line-list:src/components/analytics/stage-picker-variants.prototype.tsx`) for the exact interaction this task makes real.

- [ ] **Step 1: Rename `mainStageId` to `selectedStageId` in `AnalyticsFilters`**

```ts
export interface AnalyticsFilters {
    programId: string;
    selectedStageId: string;
    childStageIds: string[];
    startDate: string;
    endDate: string;
    rangeType: AnalyticsRangeType;
    periodId?: string;
}
```

- [ ] **Step 2: Add a `pairs` prop and role-describing helper**

Add the import and prop:

```ts
import type { StagePair } from "../../schemas";
```

```ts
export function AnalyticsFilterBar({
    program,
    pairs,
    filters,
    onChange,
}: {
    program: Program;
    pairs: StagePair[];
    filters: AnalyticsFilters;
    onChange: (filters: AnalyticsFilters) => void;
}) {
```

Add helpers above the component (or inside it, above the `return`):

```ts
function legalChildrenOf(stageId: string, pairs: StagePair[]) {
    return pairs
        .filter((p) => p.parentStageId === stageId)
        .map((p) => p.childStageId);
}

function legalParentsOf(stageId: string, pairs: StagePair[]) {
    return pairs
        .filter((p) => p.childStageId === stageId)
        .map((p) => p.parentStageId);
}

function describeRole(
    stageId: string,
    pairs: StagePair[],
    stageName: (id: string) => string | undefined,
) {
    const children = legalChildrenOf(stageId, pairs);
    const parents = legalParentsOf(stageId, pairs);
    const parts: string[] = [];
    if (parents.length > 0) {
        parts.push(`child of ${parents.map(stageName).join(", ")}`);
    }
    if (children.length > 0) {
        parts.push(`parent of ${children.length} stage(s)`);
    }
    return parts.length > 0 ? ` — ${parts.join(", ")}` : "";
}
```

- [ ] **Step 3: Replace the "Program Stage" and "Related Stages" fields**

Replace the existing block (currently around line 76-112):

```tsx
<Form.Item label="Program Stage" layout="vertical">
    <Select
        style={fieldStyle(320)}
        value={filters.selectedStageId}
        placeholder="Stage"
        options={program.programStages.map((stage) => ({
            value: stage.id,
            label: `${stage.name}${describeRole(
                stage.id,
                pairs,
                (id) => program.programStages.find((s) => s.id === id)?.name,
            )}`,
        }))}
        onChange={(selectedStageId) =>
            onChange({ ...filters, selectedStageId, childStageIds: [] })
        }
    />
</Form.Item>
{legalChildrenOf(filters.selectedStageId, pairs).length > 0 && (
    <Form.Item label="Include child stages" layout="vertical">
        <Select
            mode="multiple"
            style={fieldStyle(300)}
            value={filters.childStageIds}
            placeholder="Child stages"
            options={legalChildrenOf(filters.selectedStageId, pairs).map(
                (id) => ({
                    value: id,
                    label: program.programStages.find((s) => s.id === id)
                        ?.name,
                }),
            )}
            onChange={(childStageIds) =>
                onChange({ ...filters, childStageIds })
            }
        />
    </Form.Item>
)}
```

Note: when `pairs` is empty (no admin config exists for this program yet), `legalChildrenOf` always returns `[]`, so the "Include child stages" field never renders and the Stage select's option labels are all unannotated — this is the "looks identical to today, minus the second field" degenerate behavior the ticket settled on. If that's judged too big a capability loss for unconfigured programs (losing the child-stage picker entirely until an admin configures something), flag it back to the map rather than silently改 deviating — but per the ticket's resolution this is the agreed behavior, not an oversight.

- [ ] **Step 4: Verify it compiles**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep "analytics-filter-bar"`
Expected: no output (fixing this file will surface a compile error in `analytics.tsx` for `mainStageId` — that's Task 8, expected for now)

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/analytics-filter-bar.tsx
git commit -m "feat(stage-hierarchy): show inferred stage role inline in the picker"
```

---

### Task 8: Wire it all together in `analytics.tsx`

**Files:**
- Modify: `src/routes/analytics.tsx`

This is the integration task — it will not compile until this is done (Task 7 renamed `mainStageId` to `selectedStageId` in the shared `AnalyticsFilters` type, which `analytics.tsx` also uses).

- [ ] **Step 1: Import the new hook**

```ts
import { useStageHierarchyConfig } from "../hooks/useStageHierarchyConfig";
```

- [ ] **Step 2: Rename every `mainStageId`/`defaultStage` reference to `selectedStageId`**

In `AnalyticsPage`, rename the `filters` initializer field (`mainStageId: defaultStage` → `selectedStageId: defaultStage`) and every other `filters.mainStageId` read (the `buildParentEventDataset` call, the restored-state fallback). `defaultStage` itself (the variable computed from `program.programStages[0]?.id`) keeps its name — only the `AnalyticsFilters` field it seeds changes. Note: the `useLiveSuspenseQuery` dependency arrays in this file only reference `filters.programId`, not the stage field — nothing to change there, don't go looking for a rename that isn't needed.

- [ ] **Step 3: Get the config and derive `legalParentStageIds`**

Add near the top of `AnalyticsPage`, alongside the other `useMetadata()`-derived values:

```ts
const stageHierarchyPairs = useStageHierarchyConfig();
const legalParentStageIds = useMemo(
    () =>
        stageHierarchyPairs
            .filter((p) => p.childStageId === filters.selectedStageId)
            .map((p) => p.parentStageId),
    [stageHierarchyPairs, filters.selectedStageId],
);
```

**Must be memoized, not a plain `const`.** An un-memoized derivation here gets a new array reference on every render; since it later sits in the `dataset` `useMemo`'s dependency array (Step 4), that defeats the memo entirely — `dataset` recomputes every render, which cascades into `computedRows` recomputing every render, which the `useEffect` that syncs `filteredRows` treats as "changed" every time, calling `setFilteredRows` on every render and triggering an infinite re-render loop starting at mount. (This was caught in code review after an earlier draft of this plan specified the un-memoized form — if you're implementing from a stale copy of this plan, use the `useMemo` version above.)

- [ ] **Step 4: Pass `legalParentStageIds` into the `buildParentEventDataset` call**

Find the `buildParentEventDataset({...})` call (inside the `dataset` `useMemo`) and add the new field, renaming `mainStageId` to `selectedStageId`:

```ts
buildParentEventDataset({
    metadata: { program, trackedEntityAttributes, dataElements, optionSets },
    trackedEntities,
    enrollments,
    events,
    orgUnit,
    programId: filters.selectedStageId ? filters.programId : filters.programId,
    selectedStageId: filters.selectedStageId,
    childStageIds: filters.childStageIds,
    legalParentStageIds,
    startDate: filters.startDate,
    endDate: filters.endDate,
})
```

(The odd-looking `programId` line above is a copy-paste guard — just keep the existing `programId: filters.programId` line as it already is; only add `selectedStageId`/`legalParentStageIds` and rename `mainStageId` → `selectedStageId`. Don't duplicate the `programId` line.)

Also add `legalParentStageIds` and `stageHierarchyPairs` to the `useMemo`'s dependency array.

- [ ] **Step 5: Pass `pairs` into `AnalyticsFilterBar`**

```tsx
<AnalyticsFilterBar
    program={program}
    pairs={stageHierarchyPairs}
    filters={filters}
    onChange={setFilters}
/>
```

- [ ] **Step 6: Verify it compiles**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep -E "analytics\.tsx|analytics-filter-bar|parent-event-dataset"`
Expected: no output

- [ ] **Step 7: Run the full test suite**

Run: `pnpm exec vitest run`
Expected: PASS, all files, 0 failures

- [ ] **Step 8: Manual verification — both the unconfigured and configured cases**

Run: `pnpm start`.
1. **Unconfigured program** (no pairs saved yet in Admin → Stage Relations): open Analytics, confirm the Stage select shows every stage unannotated and there's no "Include child stages" field for any of them — matches today's absence-of-restriction behavior at the join level (you can still pick a stage and see its own data; you just can't add child columns until an admin configures a pair, per the ticket's agreed tradeoff).
2. **Configure a pair**: in Admin → Stage Relations, make stage B a legal child of stage A. Back in Analytics, pick stage A — its option label should now read "A — parent of 1 stage(s)" and the "Include child stages" field should appear with only B selectable; picking B in it should show B's data elements as `childEvent.*` columns (existing one-to-many behavior, now scoped).
3. **One-to-one**: pick stage B directly as the main Stage. Confirm its option label reads "B — child of A", the "Include child stages" field is absent (B has no configured children), and A's data elements appear as new `linkedParent.<A-id>.*` columns in the column chooser, populated correctly for rows where a real `parentEvent` link exists.
4. **Both**: if you have a 3-stage chain available (A → B → C), pick B and confirm both the `linkedParent.<A-id>.*` columns (one-to-one, from A) and `childEvent.<C-id>.*` columns (one-to-many, to C) appear together on the same rows.

- [ ] **Step 9: Commit**

```bash
git add src/routes/analytics.tsx
git commit -m "feat(stage-hierarchy): wire stage-hierarchy config into the line-list picker and dataset builder"
```

---

### Task 9: Final review and handoff

- [ ] **Step 1: Full regression pass**

Run: `pnpm exec vitest run`
Expected: PASS, all files, 0 failures

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: only the pre-existing unrelated `@tanstack/db` version-mismatch errors in `src/collections/*.ts` (confirmed pre-existing before this effort — do not attempt to fix them as part of this plan)

- [ ] **Step 2: Confirm nothing outside this plan's file list changed**

Run: `git diff --stat main...HEAD`
Expected: only the files listed in "File Structure" above (plus their test files)

- [ ] **Step 3: Dispatch a final code-reviewer subagent for the entire branch diff**, per `superpowers:subagent-driven-development`'s process.

- [ ] **Step 4: Use `superpowers:finishing-a-development-branch`** to wrap up (rebase/merge decision, PR, worktree cleanup) once the final review is clean.
