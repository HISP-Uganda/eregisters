# Tracker Analytics Line List and Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a top-level Analytics area with a parent-event-centric line list and configurable pivot view over the same local tracker dataset.

**Architecture:** Put tracker analytics domain logic in pure modules under `src/analytics/` and keep React components thin. Build a column registry from DHIS2 metadata, build parent-event rows from local tracked entities/enrollments/events, then render the same rows through line-list and pivot tabs. Use antd for controls/tables and SheetJS `xlsx` for one-sheet export.

**Tech Stack:** React 19, TypeScript, TanStack Router, TanStack DB live queries, Dexie-backed collections, antd v6 Table/Tabs/Select/DatePicker/Transfer, dayjs, lodash, Vitest, SheetJS `xlsx`.

---

## File Structure

- Create `src/analytics/types.ts` for shared analytics row/column/pivot types.
- Create `src/analytics/date-buckets.ts` for exact/week/month/quarter/year date dimension keys.
- Create `src/analytics/value-format.ts` for display/raw value normalization and option labels.
- Create `src/analytics/column-registry.ts` for metadata-driven column definitions and grouped paths.
- Create `src/analytics/parent-event-dataset.ts` for parent-event row generation and child event slotting.
- Create `src/analytics/pivot-engine.ts` for pure pivot aggregation.
- Create `src/analytics/xlsx-export.ts` for one-sheet workbook export.
- Create `src/analytics/*.test.ts` files for pure logic coverage.
- Create `src/routes/analytics.tsx` for the top-level Analytics screen.
- Create `src/components/analytics/analytics-filter-bar.tsx` for program/org/date/parent-stage controls.
- Create `src/components/analytics/line-list-table.tsx` for the grouped antd line-list table.
- Create `src/components/analytics/column-chooser.tsx` for grouped column selection.
- Create `src/components/analytics/pivot-builder.tsx` for configurable pivot controls and result table.
- Modify `src/router.tsx` to add `AnalyticsRoute`.
- Modify `src/routes/__root.tsx` to add an Analytics nav entry.
- Modify `package.json`/`pnpm-lock.yaml` by installing `xlsx`.

---

### Task 1: Install XLSX Dependency

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install SheetJS**

Run:

```bash
pnpm add xlsx
```

Expected: `package.json` contains `"xlsx"` under `dependencies`, and `pnpm-lock.yaml` is updated.

- [ ] **Step 2: Verify dependency import**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: The repo may still show the existing `@tanstack/db` version-skew errors in `src/collections/*.ts`. There must be no error saying `Cannot find module 'xlsx'`.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add xlsx export dependency"
```

---

### Task 2: Define Analytics Types

**Files:**
- Create: `src/analytics/types.ts`

- [ ] **Step 1: Create shared types**

Create `src/analytics/types.ts` with:

```ts
import type {
    DataElement,
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    Program,
    ProgramStage,
    TrackedEntityAttribute,
} from "../schemas";

export type AnalyticsSource =
    | "trackedEntity"
    | "enrollment"
    | "parentEvent"
    | "childEvent";

export type AnalyticsValueKind =
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "datetime"
    | "time"
    | "unknown";

export interface AnalyticsCell {
    raw: unknown;
    display: string;
}

export interface AnalyticsRow {
    id: string;
    trackedEntity: FlattenedTrackedEntity;
    enrollment: FlattenedEnrollment | undefined;
    parentEvent: FlattenedEvent;
    childEventsByStage: Record<string, FlattenedEvent[]>;
    values: Record<string, AnalyticsCell>;
}

export interface AnalyticsColumn {
    key: string;
    label: string;
    source: AnalyticsSource;
    sourceFieldId: string;
    valueKind: AnalyticsValueKind;
    groupPath: string[];
    optionSetId?: string;
    defaultVisible: boolean;
    pivot: {
        canUseAsDimension: boolean;
        canUseAsMeasure: boolean;
        canUseForDistinctCount: boolean;
    };
}

export interface AnalyticsMetadata {
    program: Program;
    trackedEntityAttributes: Map<string, TrackedEntityAttribute>;
    dataElements: Map<string, DataElement>;
    optionSets: Map<
        string,
        Array<{
            id: string;
            name: string;
            code: string;
            optionSet: string;
            optionSetName?: string;
            sortOrder: number;
        }>
    >;
}

export interface AnalyticsDatasetInput {
    metadata: AnalyticsMetadata;
    trackedEntities: FlattenedTrackedEntity[];
    enrollments: FlattenedEnrollment[];
    events: FlattenedEvent[];
    orgUnit: string;
    programId: string;
    parentStageId: string;
    startDate: string;
    endDate: string;
}

export interface AnalyticsDataset {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    parentStage: ProgramStage;
}

export type DateBucket = "exact" | "week" | "month" | "quarter" | "year";

export type PivotAggregation =
    | "count"
    | "sum"
    | "avg"
    | "min"
    | "max"
    | "distinctCount";

export interface PivotDimension {
    columnKey: string;
    dateBucket?: DateBucket;
}

export interface PivotMeasure {
    id: string;
    label: string;
    aggregation: PivotAggregation;
    columnKey?: string;
}

export interface PivotConfig {
    rows: PivotDimension[];
    columns: PivotDimension[];
    measures: PivotMeasure[];
}

export interface PivotResultCell {
    values: Record<string, number>;
}

export interface PivotResult {
    rowHeaders: string[];
    columnHeaders: string[];
    rowKeys: string[][];
    columnKeys: string[][];
    cells: Record<string, PivotResultCell>;
}
```

- [ ] **Step 2: Typecheck focused file**

Run:

```bash
pnpm exec tsc --noEmit --pretty false
```

Expected: Existing `@tanstack/db` collection errors may appear. There must be no error referencing `src/analytics/types.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/analytics/types.ts
git commit -m "feat(analytics): define tracker analytics types"
```

---

### Task 3: Date Bucket Utilities

**Files:**
- Create: `src/analytics/date-buckets.ts`
- Create: `src/analytics/date-buckets.test.ts`

- [ ] **Step 1: Write failing date bucket tests**

Create `src/analytics/date-buckets.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import { bucketDate } from "./date-buckets";

describe("bucketDate", () => {
    it("returns Missing for blank dates", () => {
        expect(bucketDate("", "month")).toEqual({
            key: "Missing",
            label: "Missing",
        });
        expect(bucketDate(undefined, "year")).toEqual({
            key: "Missing",
            label: "Missing",
        });
    });

    it("formats exact, week, month, quarter, and year buckets", () => {
        expect(bucketDate("2026-08-26", "exact")).toEqual({
            key: "2026-08-26",
            label: "2026-08-26",
        });
        expect(bucketDate("2026-08-26", "week")).toEqual({
            key: "2026W35",
            label: "Week 35 2026",
        });
        expect(bucketDate("2026-08-26", "month")).toEqual({
            key: "2026-08",
            label: "August 2026",
        });
        expect(bucketDate("2026-08-26", "quarter")).toEqual({
            key: "2026Q3",
            label: "Q3 2026",
        });
        expect(bucketDate("2026-08-26", "year")).toEqual({
            key: "2026",
            label: "2026",
        });
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:vitest src/analytics/date-buckets.test.ts
```

Expected: FAIL with an import error for `./date-buckets`.

- [ ] **Step 3: Implement date buckets**

Create `src/analytics/date-buckets.ts` with:

```ts
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import type { DateBucket } from "./types";

dayjs.extend(isoWeek);

export interface BucketedDate {
    key: string;
    label: string;
}

export function bucketDate(value: unknown, bucket: DateBucket): BucketedDate {
    if (value === undefined || value === null || value === "") {
        return { key: "Missing", label: "Missing" };
    }

    const parsed = dayjs(String(value));
    if (!parsed.isValid()) return { key: "Missing", label: "Missing" };

    switch (bucket) {
        case "exact":
            return {
                key: parsed.format("YYYY-MM-DD"),
                label: parsed.format("YYYY-MM-DD"),
            };
        case "week":
            return {
                key: `${parsed.isoWeekYear()}W${parsed.isoWeek()}`,
                label: `Week ${parsed.isoWeek()} ${parsed.isoWeekYear()}`,
            };
        case "month":
            return {
                key: parsed.format("YYYY-MM"),
                label: parsed.format("MMMM YYYY"),
            };
        case "quarter": {
            const quarter = Math.floor(parsed.month() / 3) + 1;
            return {
                key: `${parsed.year()}Q${quarter}`,
                label: `Q${quarter} ${parsed.year()}`,
            };
        }
        case "year":
            return {
                key: parsed.format("YYYY"),
                label: parsed.format("YYYY"),
            };
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
pnpm test:vitest src/analytics/date-buckets.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/analytics/date-buckets.ts src/analytics/date-buckets.test.ts
git commit -m "feat(analytics): add date bucket dimensions"
```

---

### Task 4: Value Formatting

**Files:**
- Create: `src/analytics/value-format.ts`
- Create: `src/analytics/value-format.test.ts`

- [ ] **Step 1: Write failing value-format tests**

Create `src/analytics/value-format.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import { displayValue, valueKindFromDhis2 } from "./value-format";

const optionSets = new Map([
    [
        "gender",
        [
            {
                id: "M",
                name: "Male",
                code: "M",
                optionSet: "gender",
                sortOrder: 1,
            },
            {
                id: "F",
                name: "Female",
                code: "F",
                optionSet: "gender",
                sortOrder: 2,
            },
        ],
    ],
]);

describe("displayValue", () => {
    it("maps option ids and comma-separated multi-values to option names", () => {
        expect(displayValue("M", "gender", optionSets)).toBe("Male");
        expect(displayValue("M,F", "gender", optionSets)).toBe("Male, Female");
    });

    it("uses Missing for blank display values", () => {
        expect(displayValue("", undefined, optionSets)).toBe("Missing");
        expect(displayValue(null, undefined, optionSets)).toBe("Missing");
    });
});

describe("valueKindFromDhis2", () => {
    it("maps DHIS2 value types to analytics value kinds", () => {
        expect(valueKindFromDhis2("NUMBER")).toBe("number");
        expect(valueKindFromDhis2("INTEGER")).toBe("number");
        expect(valueKindFromDhis2("BOOLEAN")).toBe("boolean");
        expect(valueKindFromDhis2("DATE")).toBe("date");
        expect(valueKindFromDhis2("DATETIME")).toBe("datetime");
        expect(valueKindFromDhis2("TIME")).toBe("time");
        expect(valueKindFromDhis2("TEXT")).toBe("string");
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:vitest src/analytics/value-format.test.ts
```

Expected: FAIL with an import error for `./value-format`.

- [ ] **Step 3: Implement value formatting**

Create `src/analytics/value-format.ts` with:

```ts
import type { AnalyticsValueKind } from "./types";

type OptionSets = Map<
    string,
    Array<{
        id: string;
        name: string;
        code: string;
        optionSet: string;
        optionSetName?: string;
        sortOrder: number;
    }>
>;

export function valueKindFromDhis2(
    valueType: string | undefined,
): AnalyticsValueKind {
    switch (valueType) {
        case "NUMBER":
        case "INTEGER":
        case "INTEGER_POSITIVE":
        case "INTEGER_NEGATIVE":
        case "INTEGER_ZERO_OR_POSITIVE":
        case "PERCENTAGE":
        case "UNIT_INTERVAL":
            return "number";
        case "BOOLEAN":
        case "TRUE_ONLY":
            return "boolean";
        case "DATE":
            return "date";
        case "DATETIME":
            return "datetime";
        case "TIME":
            return "time";
        case "TEXT":
        case "LONG_TEXT":
        case "LETTER":
        case "PHONE_NUMBER":
        case "EMAIL":
        case "URL":
            return "string";
        default:
            return "unknown";
    }
}

export function displayValue(
    raw: unknown,
    optionSetId: string | undefined,
    optionSets: OptionSets,
): string {
    if (raw === undefined || raw === null || raw === "") return "Missing";

    const text = String(raw);
    if (!optionSetId) return text;

    const options = optionSets.get(optionSetId) ?? [];
    const byIdOrCode = new Map<string, string>();
    for (const option of options) {
        byIdOrCode.set(option.id, option.name);
        byIdOrCode.set(option.code, option.name);
    }

    return text
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => byIdOrCode.get(part) ?? part)
        .join(", ");
}

export function numericValue(raw: unknown): number | undefined {
    if (raw === undefined || raw === null || raw === "") return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
pnpm test:vitest src/analytics/value-format.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/analytics/value-format.ts src/analytics/value-format.test.ts
git commit -m "feat(analytics): add display value formatting"
```

---

### Task 5: Column Registry

**Files:**
- Create: `src/analytics/column-registry.ts`
- Create: `src/analytics/column-registry.test.ts`

- [ ] **Step 1: Write failing registry tests**

Create `src/analytics/column-registry.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import type { AnalyticsMetadata } from "./types";
import { buildColumnRegistry } from "./column-registry";

const metadata = {
    program: {
        id: "program",
        name: "Program",
        programType: "WITH_REGISTRATION",
        selectEnrollmentDatesInFuture: false,
        selectIncidentDatesInFuture: false,
        organisationUnits: [],
        trackedEntityType: {
            id: "tet",
            featureType: "NONE",
            trackedEntityTypeAttributes: [],
        },
        programTrackedEntityAttributes: [
            {
                id: "ptea-name",
                sortOrder: 1,
                mandatory: false,
                displayInList: true,
                renderOptionsAsRadio: false,
                searchable: true,
                allowFutureDate: false,
                trackedEntityAttribute: {
                    id: "firstName",
                    name: "First name",
                    displayFormName: "First name",
                    valueType: "TEXT",
                    confidential: false,
                    unique: false,
                    generated: false,
                    pattern: "",
                    optionSetValue: false,
                },
            },
        ],
        programSections: [
            {
                id: "registration",
                name: "Registration Details",
                displayName: "Registration Details",
                sortOrder: 1,
                trackedEntityAttributes: [{ id: "firstName" }],
            },
        ],
        programStages: [
            {
                id: "visit",
                name: "Visit",
                repeatable: true,
                programStageDataElements: [
                    {
                        id: "psde-weight",
                        compulsory: false,
                        allowFutureDate: false,
                        dataElement: {
                            id: "weight",
                            name: "Weight",
                            displayFormName: "Weight",
                            code: "weight",
                            valueType: "NUMBER",
                            confidential: false,
                            optionSetValue: false,
                            generated: false,
                            unique: false,
                            pattern: "",
                        },
                    },
                ],
                programStageSections: [
                    {
                        id: "triage",
                        name: "Triage",
                        displayName: "Triage",
                        sortOrder: 1,
                        dataElements: [
                            {
                                id: "weight",
                                name: "Weight",
                                displayFormName: "Weight",
                                code: "weight",
                                valueType: "NUMBER",
                                confidential: false,
                                optionSetValue: false,
                                generated: false,
                                unique: false,
                                pattern: "",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    trackedEntityAttributes: new Map(),
    dataElements: new Map(),
    optionSets: new Map(),
} satisfies AnalyticsMetadata;

describe("buildColumnRegistry", () => {
    it("includes system ids and section-grouped parent event data values", () => {
        const columns = buildColumnRegistry({
            metadata,
            parentStageId: "visit",
            childStageSlotCounts: new Map(),
        });

        expect(columns.find((c) => c.key === "trackedEntity.trackedEntity"))
            ?.groupPath).toEqual(["System IDs"]);
        expect(columns.find((c) => c.key === "parentEvent.event")?.groupPath)
            .toEqual(["System IDs"]);
        expect(columns.find((c) => c.key === "te.attribute.firstName")?.groupPath)
            .toEqual(["Tracked Entity", "Registration Details"]);
        expect(columns.find((c) => c.key === "parentEvent.dataValue.weight")?.groupPath)
            .toEqual(["Parent Event", "Visit", "Triage"]);
        expect(columns.find((c) => c.key === "te.attribute.firstName")?.defaultVisible)
            .toBe(true);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:vitest src/analytics/column-registry.test.ts
```

Expected: FAIL with an import error for `./column-registry`.

- [ ] **Step 3: Implement the column registry**

Create `src/analytics/column-registry.ts` with these exported functions:

```ts
import type { AnalyticsColumn, AnalyticsMetadata } from "./types";
import { valueKindFromDhis2 } from "./value-format";

interface RegistryInput {
    metadata: AnalyticsMetadata;
    parentStageId: string;
    childStageSlotCounts: Map<string, number>;
}

function column(input: Omit<AnalyticsColumn, "pivot"> & {
    canMeasure?: boolean;
}): AnalyticsColumn {
    return {
        ...input,
        pivot: {
            canUseAsDimension: true,
            canUseAsMeasure: input.canMeasure ?? false,
            canUseForDistinctCount: true,
        },
    };
}

export function buildColumnRegistry({
    metadata,
    parentStageId,
    childStageSlotCounts,
}: RegistryInput): AnalyticsColumn[] {
    const parentStage = metadata.program.programStages.find(
        (stage) => stage.id === parentStageId,
    );
    if (!parentStage) {
        throw new Error(`Parent stage ${parentStageId} was not found`);
    }

    const columns: AnalyticsColumn[] = [
        column({
            key: "trackedEntity.trackedEntity",
            label: "Tracked Entity ID",
            source: "trackedEntity",
            sourceFieldId: "trackedEntity",
            valueKind: "string",
            groupPath: ["System IDs"],
            defaultVisible: true,
        }),
        column({
            key: "enrollment.enrollment",
            label: "Enrollment ID",
            source: "enrollment",
            sourceFieldId: "enrollment",
            valueKind: "string",
            groupPath: ["System IDs"],
            defaultVisible: true,
        }),
        column({
            key: "parentEvent.event",
            label: "Parent Event ID",
            source: "parentEvent",
            sourceFieldId: "event",
            valueKind: "string",
            groupPath: ["System IDs"],
            defaultVisible: true,
        }),
    ];

    for (const field of [
        "trackedEntityType",
        "orgUnit",
        "syncStatus",
        "createdAt",
        "updatedAt",
    ]) {
        columns.push(
            column({
                key: `trackedEntity.${field}`,
                label: field,
                source: "trackedEntity",
                sourceFieldId: field,
                valueKind: field.endsWith("At") ? "datetime" : "string",
                groupPath: ["Tracked Entity", "System"],
                defaultVisible: false,
            }),
        );
    }

    for (const field of [
        "program",
        "trackedEntity",
        "orgUnit",
        "status",
        "enrolledAt",
        "occurredAt",
        "syncStatus",
        "createdAt",
        "updatedAt",
    ]) {
        columns.push(
            column({
                key: `enrollment.${field}`,
                label: field,
                source: "enrollment",
                sourceFieldId: field,
                valueKind: field.endsWith("At") ? "datetime" : "string",
                groupPath: ["Enrollment", "System"],
                defaultVisible: false,
            }),
        );
    }

    for (const field of [
        "program",
        "programStage",
        "enrollment",
        "trackedEntity",
        "orgUnit",
        "status",
        "occurredAt",
        "syncStatus",
        "createdAt",
        "updatedAt",
        "parentEvent",
    ]) {
        columns.push(
            column({
                key: `parentEvent.${field}`,
                label: field,
                source: "parentEvent",
                sourceFieldId: field,
                valueKind: field.endsWith("At") ? "datetime" : "string",
                groupPath: ["Parent Event", "System"],
                defaultVisible: field === "occurredAt",
            }),
        );
    }

    const attributeSections = new Map<string, string>();
    for (const section of metadata.program.programSections ?? []) {
        for (const attribute of section.trackedEntityAttributes ?? []) {
            attributeSections.set(attribute.id, section.displayName || section.name);
        }
    }

    for (const ptea of metadata.program.programTrackedEntityAttributes ?? []) {
        const tea = ptea.trackedEntityAttribute;
        const section = attributeSections.get(tea.id) ?? "Ungrouped Attributes";
        columns.push(
            column({
                key: `te.attribute.${tea.id}`,
                label: tea.displayFormName || tea.name,
                source: "trackedEntity",
                sourceFieldId: tea.id,
                valueKind: valueKindFromDhis2(tea.valueType),
                optionSetId: tea.optionSet?.id,
                groupPath: ["Tracked Entity", section],
                defaultVisible: Boolean(ptea.displayInList),
                canMeasure: valueKindFromDhis2(tea.valueType) === "number",
            }),
        );
    }

    for (const psde of parentStage.programStageDataElements ?? []) {
        const de = psde.dataElement;
        const section = findStageSection(parentStage, de.id) ?? "Ungrouped Parent Event";
        const valueKind = valueKindFromDhis2(de.valueType);
        columns.push(
            column({
                key: `parentEvent.dataValue.${de.id}`,
                label: de.formName || de.displayFormName || de.name,
                source: "parentEvent",
                sourceFieldId: de.id,
                valueKind,
                optionSetId: de.optionSet?.id,
                groupPath: ["Parent Event", parentStage.name, section],
                defaultVisible: true,
                canMeasure: valueKind === "number",
            }),
        );
    }

    for (const [stageId, slotCount] of childStageSlotCounts.entries()) {
        const stage = metadata.program.programStages.find((s) => s.id === stageId);
        if (!stage) continue;
        for (let slot = 1; slot <= slotCount; slot++) {
            columns.push(
                column({
                    key: `childEvent.${stageId}.${slot}.event`,
                    label: `${stage.name} ${slot} Event ID`,
                    source: "childEvent",
                    sourceFieldId: "event",
                    valueKind: "string",
                    groupPath: ["Child Events", stage.name, `Slot ${slot}`, "System"],
                    defaultVisible: false,
                }),
            );
            for (const psde of stage.programStageDataElements ?? []) {
                const de = psde.dataElement;
                const section = findStageSection(stage, de.id) ?? "Ungrouped Child Event";
                const valueKind = valueKindFromDhis2(de.valueType);
                columns.push(
                    column({
                        key: `childEvent.${stageId}.${slot}.dataValue.${de.id}`,
                        label: `${stage.name} ${slot} ${de.formName || de.displayFormName || de.name}`,
                        source: "childEvent",
                        sourceFieldId: de.id,
                        valueKind,
                        optionSetId: de.optionSet?.id,
                        groupPath: ["Child Events", stage.name, `Slot ${slot}`, section],
                        defaultVisible: false,
                        canMeasure: valueKind === "number",
                    }),
                );
            }
        }
    }

    return columns;
}

function findStageSection(
    stage: AnalyticsMetadata["program"]["programStages"][number],
    dataElementId: string,
): string | undefined {
    const section = (stage.programStageSections ?? []).find((s) =>
        (s.dataElements ?? []).some((de) => de.id === dataElementId),
    );
    return section ? section.displayName || section.name : undefined;
}
```

- [ ] **Step 4: Run registry test**

Run:

```bash
pnpm test:vitest src/analytics/column-registry.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/analytics/column-registry.ts src/analytics/column-registry.test.ts
git commit -m "feat(analytics): build sectioned column registry"
```

---

### Task 6: Parent-Event Dataset Builder

**Files:**
- Create: `src/analytics/parent-event-dataset.ts`
- Create: `src/analytics/parent-event-dataset.test.ts`

- [ ] **Step 1: Write failing dataset tests**

Create `src/analytics/parent-event-dataset.test.ts` with fixtures that assert:

```ts
import { describe, expect, it } from "vitest";
import type {
    AnalyticsMetadata,
} from "./types";
import { buildParentEventDataset } from "./parent-event-dataset";

const metadata = makeMetadata();

describe("buildParentEventDataset", () => {
    it("builds parent event rows with parent fields, ids, and child slots", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ou",
            programId: "program",
            parentStageId: "visit",
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [
                trackedEntity("te1", { firstName: "Jane" }),
            ],
            enrollments: [enrollment("enr1", "te1")],
            events: [
                event("visit1", "visit", "te1", {
                    enrollment: "enr1",
                    dataValues: { occurredAt: "2026-08-26", weight: 51 },
                }),
                event("lab1", "lab", "te1", {
                    enrollment: "enr1",
                    parentEvent: "visit1",
                    dataValues: { result: "P" },
                }),
                event("lab2", "lab", "te1", {
                    enrollment: "enr1",
                    parentEvent: "visit1",
                    dataValues: { result: "N" },
                }),
            ],
        });

        expect(dataset.rows).toHaveLength(1);
        expect(dataset.rows[0].values["trackedEntity.trackedEntity"].raw).toBe("te1");
        expect(dataset.rows[0].values["enrollment.enrollment"].raw).toBe("enr1");
        expect(dataset.rows[0].values["parentEvent.event"].raw).toBe("visit1");
        expect(dataset.rows[0].values["parentEvent.dataValue.weight"].raw).toBe(51);
        expect(dataset.rows[0].values["childEvent.lab.1.event"].raw).toBe("lab1");
        expect(dataset.rows[0].values["childEvent.lab.2.event"].raw).toBe("lab2");
        expect(dataset.columns.some((c) => c.key === "childEvent.lab.2.dataValue.result")).toBe(true);
    });

    it("excludes deleted parent events and parent events outside the date range", () => {
        const dataset = buildParentEventDataset({
            metadata,
            orgUnit: "ou",
            programId: "program",
            parentStageId: "visit",
            startDate: "2026-08-01",
            endDate: "2026-08-31",
            trackedEntities: [trackedEntity("te1", {})],
            enrollments: [enrollment("enr1", "te1")],
            events: [
                event("deleted", "visit", "te1", {
                    enrollment: "enr1",
                    syncStatus: "deleted",
                    dataValues: { occurredAt: "2026-08-26" },
                }),
                event("september", "visit", "te1", {
                    enrollment: "enr1",
                    dataValues: { occurredAt: "2026-09-01" },
                }),
            ],
        });

        expect(dataset.rows).toEqual([]);
    });
});
```

Append fixture helpers in the same test file:

```ts
function makeMetadata(): AnalyticsMetadata {
    const visitStage = {
        id: "visit",
        name: "Visit",
        repeatable: true,
        programStageDataElements: [
            {
                id: "psde-weight",
                compulsory: false,
                allowFutureDate: false,
                dataElement: dataElement("weight", "Weight", "NUMBER"),
            },
        ],
        programStageSections: [
            {
                id: "triage",
                name: "Triage",
                displayName: "Triage",
                sortOrder: 1,
                dataElements: [dataElement("weight", "Weight", "NUMBER")],
            },
        ],
    };
    const labStage = {
        id: "lab",
        name: "Lab",
        repeatable: true,
        programStageDataElements: [
            {
                id: "psde-result",
                compulsory: false,
                allowFutureDate: false,
                dataElement: dataElement("result", "Result", "TEXT"),
            },
        ],
        programStageSections: [
            {
                id: "results",
                name: "Results",
                displayName: "Results",
                sortOrder: 1,
                dataElements: [dataElement("result", "Result", "TEXT")],
            },
        ],
    };

    return {
        program: {
            id: "program",
            name: "Program",
            programType: "WITH_REGISTRATION",
            selectEnrollmentDatesInFuture: false,
            selectIncidentDatesInFuture: false,
            organisationUnits: [],
            trackedEntityType: {
                id: "tet",
                featureType: "NONE",
                trackedEntityTypeAttributes: [],
            },
            programTrackedEntityAttributes: [
                {
                    id: "ptea-firstName",
                    sortOrder: 1,
                    mandatory: false,
                    displayInList: true,
                    renderOptionsAsRadio: false,
                    searchable: true,
                    allowFutureDate: false,
                    trackedEntityAttribute: {
                        id: "firstName",
                        name: "First name",
                        displayFormName: "First name",
                        valueType: "TEXT",
                        confidential: false,
                        unique: false,
                        generated: false,
                        pattern: "",
                        optionSetValue: false,
                    },
                },
            ],
            programSections: [],
            programStages: [visitStage, labStage],
        },
        trackedEntityAttributes: new Map(),
        dataElements: new Map(),
        optionSets: new Map(),
    };
}

function dataElement(id: string, name: string, valueType: string) {
    return {
        id,
        name,
        displayFormName: name,
        formName: name,
        code: id,
        valueType,
        confidential: false,
        optionSetValue: false,
        generated: false,
        unique: false,
        pattern: "",
    };
}

function trackedEntity(id: string, attributes: Record<string, unknown>) {
    return {
        trackedEntity: id,
        trackedEntityType: "tet",
        createdAt: "2026-08-01",
        updatedAt: "2026-08-01",
        orgUnit: "ou",
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        attributes,
        syncStatus: "synced" as const,
        lastSynced: "",
        version: 1,
    };
}

function enrollment(id: string, te: string) {
    return {
        enrollment: id,
        createdAt: "2026-08-01",
        updatedAt: "2026-08-01",
        trackedEntity: te,
        program: "program",
        status: "ACTIVE",
        orgUnit: "ou",
        enrolledAt: "2026-08-01",
        occurredAt: "2026-08-01",
        followUp: false,
        deleted: false,
        attributes: {},
        syncStatus: "synced" as const,
        lastSynced: "",
        version: 1,
    };
}

function event(
    id: string,
    stage: string,
    te: string,
    overrides: Record<string, unknown> = {},
) {
    return {
        event: id,
        status: "ACTIVE",
        program: "program",
        programStage: stage,
        enrollment: "enr1",
        trackedEntity: te,
        orgUnit: "ou",
        occurredAt: "2026-08-26",
        followUp: false,
        deleted: false,
        createdAt: "2026-08-01",
        updatedAt: "2026-08-01",
        dataValues: {},
        syncStatus: "synced" as const,
        lastSynced: "",
        version: 1,
        ...overrides,
    };
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:vitest src/analytics/parent-event-dataset.test.ts
```

Expected: FAIL with an import error for `./parent-event-dataset`.

- [ ] **Step 3: Implement parent-event dataset builder**

Create `src/analytics/parent-event-dataset.ts` with:

```ts
import dayjs from "dayjs";
import type {
    AnalyticsCell,
    AnalyticsColumn,
    AnalyticsDataset,
    AnalyticsDatasetInput,
} from "./types";
import { buildColumnRegistry } from "./column-registry";
import { displayValue } from "./value-format";

export function buildParentEventDataset(
    input: AnalyticsDatasetInput,
): AnalyticsDataset {
    const parentStage = input.metadata.program.programStages.find(
        (stage) => stage.id === input.parentStageId,
    );
    if (!parentStage) {
        throw new Error(`Parent stage ${input.parentStageId} was not found`);
    }

    const trackedEntityById = new Map(
        input.trackedEntities.map((te) => [te.trackedEntity, te]),
    );
    const enrollmentById = new Map(
        input.enrollments.map((enrollment) => [enrollment.enrollment, enrollment]),
    );

    const parentEvents = input.events.filter((event) => {
        if (event.syncStatus === "deleted") return false;
        if (event.deleted) return false;
        if (event.orgUnit !== input.orgUnit) return false;
        if (event.program !== input.programId) return false;
        if (event.programStage !== input.parentStageId) return false;
        const occurredAt = effectiveOccurredAt(event);
        return isWithinDateRange(occurredAt, input.startDate, input.endDate);
    });

    const childEventsByParent = new Map<string, typeof input.events>();
    for (const event of input.events) {
        if (!event.parentEvent) continue;
        if (event.syncStatus === "deleted" || event.deleted) continue;
        const list = childEventsByParent.get(event.parentEvent) ?? [];
        list.push(event);
        childEventsByParent.set(event.parentEvent, list);
    }

    const slotCounts = new Map<string, number>();
    for (const parent of parentEvents) {
        const grouped = groupChildrenByStage(childEventsByParent.get(parent.event) ?? []);
        for (const [stageId, children] of Object.entries(grouped)) {
            slotCounts.set(stageId, Math.max(slotCounts.get(stageId) ?? 0, children.length));
        }
    }

    const columns = buildColumnRegistry({
        metadata: input.metadata,
        parentStageId: input.parentStageId,
        childStageSlotCounts: slotCounts,
    });

    const rows = parentEvents.map((parentEvent) => {
        const childEventsByStage = groupChildrenByStage(
            childEventsByParent.get(parentEvent.event) ?? [],
        );
        const trackedEntity = trackedEntityById.get(parentEvent.trackedEntity);
        if (!trackedEntity) {
            throw new Error(`Tracked entity ${parentEvent.trackedEntity} was not found`);
        }
        const enrollment = enrollmentById.get(parentEvent.enrollment);
        const values = buildRowValues({
            columns,
            trackedEntity,
            enrollment,
            parentEvent,
            childEventsByStage,
            optionSets: input.metadata.optionSets,
        });
        return {
            id: parentEvent.event,
            trackedEntity,
            enrollment,
            parentEvent,
            childEventsByStage,
            values,
        };
    });

    return { columns, rows, parentStage };
}

function effectiveOccurredAt(event: { occurredAt: string; dataValues: Record<string, unknown> }) {
    return String(event.dataValues.occurredAt ?? event.occurredAt);
}

function isWithinDateRange(value: string, startDate: string, endDate: string): boolean {
    const date = dayjs(value);
    if (!date.isValid()) return false;
    return (
        (date.isSame(dayjs(startDate), "day") || date.isAfter(dayjs(startDate), "day")) &&
        (date.isSame(dayjs(endDate), "day") || date.isBefore(dayjs(endDate), "day"))
    );
}

function groupChildrenByStage(events: Array<{ programStage: string; occurredAt: string; event: string }>) {
    const grouped: Record<string, typeof events> = {};
    for (const event of events.slice().sort(compareEvents)) {
        grouped[event.programStage] = grouped[event.programStage] ?? [];
        grouped[event.programStage].push(event);
    }
    return grouped;
}

function compareEvents(a: { occurredAt: string; event: string }, b: { occurredAt: string; event: string }) {
    const byDate = dayjs(a.occurredAt).valueOf() - dayjs(b.occurredAt).valueOf();
    return byDate === 0 ? a.event.localeCompare(b.event) : byDate;
}

function buildRowValues({
    columns,
    trackedEntity,
    enrollment,
    parentEvent,
    childEventsByStage,
    optionSets,
}: {
    columns: AnalyticsColumn[];
    trackedEntity: Record<string, unknown> & { attributes: Record<string, unknown> };
    enrollment: (Record<string, unknown> & { attributes: Record<string, unknown> }) | undefined;
    parentEvent: Record<string, unknown> & { dataValues: Record<string, unknown> };
    childEventsByStage: Record<string, Array<Record<string, unknown> & { dataValues: Record<string, unknown> }>>;
    optionSets: Parameters<typeof displayValue>[2];
}): Record<string, AnalyticsCell> {
    const values: Record<string, AnalyticsCell> = {};
    for (const column of columns) {
        const raw = readRawValue(column.key, trackedEntity, enrollment, parentEvent, childEventsByStage);
        values[column.key] = {
            raw,
            display: displayValue(raw, column.optionSetId, optionSets),
        };
    }
    return values;
}

function readRawValue(
    key: string,
    trackedEntity: Record<string, unknown> & { attributes: Record<string, unknown> },
    enrollment: (Record<string, unknown> & { attributes: Record<string, unknown> }) | undefined,
    parentEvent: Record<string, unknown> & { dataValues: Record<string, unknown> },
    childEventsByStage: Record<string, Array<Record<string, unknown> & { dataValues: Record<string, unknown> }>>,
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
        return parentEvent.dataValues[key.replace("parentEvent.dataValue.", "")];
    }
    if (key.startsWith("parentEvent.")) {
        return parentEvent[key.replace("parentEvent.", "")];
    }
    if (key.startsWith("childEvent.")) {
        const [, stageId, slotText, fieldType, fieldId] = key.split(".");
        const child = childEventsByStage[stageId]?.[Number(slotText) - 1];
        if (!child) return undefined;
        return fieldType === "dataValue" ? child.dataValues[fieldId] : child[fieldType];
    }
    return undefined;
}
```

- [ ] **Step 4: Run dataset tests**

Run:

```bash
pnpm test:vitest src/analytics/parent-event-dataset.test.ts src/analytics/column-registry.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/analytics/parent-event-dataset.ts src/analytics/parent-event-dataset.test.ts
git commit -m "feat(analytics): build parent event dataset"
```

---

### Task 7: Pivot Engine

**Files:**
- Create: `src/analytics/pivot-engine.ts`
- Create: `src/analytics/pivot-engine.test.ts`

- [ ] **Step 1: Write failing pivot tests**

Create `src/analytics/pivot-engine.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import type { AnalyticsColumn, AnalyticsRow } from "./types";
import { buildPivot } from "./pivot-engine";

const columns: AnalyticsColumn[] = [
    col("sex", "Sex", "string"),
    col("month", "Visit date", "date"),
    col("weight", "Weight", "number"),
    col("trackedEntity", "Tracked Entity ID", "string"),
];

const rows: AnalyticsRow[] = [
    row("r1", { sex: "Female", month: "2026-08-01", weight: 50, trackedEntity: "te1" }),
    row("r2", { sex: "Female", month: "2026-08-10", weight: 60, trackedEntity: "te1" }),
    row("r3", { sex: "", month: "2026-09-01", weight: 70, trackedEntity: "te2" }),
];

describe("buildPivot", () => {
    it("counts rows and distinct tracked entities with Missing dimension bucket", () => {
        const result = buildPivot({
            columns,
            rows,
            config: {
                rows: [{ columnKey: "sex" }],
                columns: [{ columnKey: "month", dateBucket: "month" }],
                measures: [
                    { id: "rows", label: "Rows", aggregation: "count" },
                    {
                        id: "clients",
                        label: "Clients",
                        aggregation: "distinctCount",
                        columnKey: "trackedEntity",
                    },
                ],
            },
        });

        expect(result.rowKeys).toEqual([["Female"], ["Missing"]]);
        expect(result.columnKeys).toEqual([["August 2026"], ["September 2026"]]);
        expect(result.cells["Female||August 2026"].values.rows).toBe(2);
        expect(result.cells["Female||August 2026"].values.clients).toBe(1);
        expect(result.cells["Missing||September 2026"].values.rows).toBe(1);
    });

    it("computes numeric summaries", () => {
        const result = buildPivot({
            columns,
            rows,
            config: {
                rows: [{ columnKey: "sex" }],
                columns: [],
                measures: [
                    { id: "sum", label: "Sum", aggregation: "sum", columnKey: "weight" },
                    { id: "avg", label: "Avg", aggregation: "avg", columnKey: "weight" },
                    { id: "min", label: "Min", aggregation: "min", columnKey: "weight" },
                    { id: "max", label: "Max", aggregation: "max", columnKey: "weight" },
                ],
            },
        });

        expect(result.cells["Female||"].values.sum).toBe(110);
        expect(result.cells["Female||"].values.avg).toBe(55);
        expect(result.cells["Female||"].values.min).toBe(50);
        expect(result.cells["Female||"].values.max).toBe(60);
    });
});

function col(
    key: string,
    label: string,
    valueKind: AnalyticsColumn["valueKind"],
): AnalyticsColumn {
    return {
        key,
        label,
        source: "parentEvent",
        sourceFieldId: key,
        valueKind,
        groupPath: ["Test"],
        defaultVisible: true,
        pivot: {
            canUseAsDimension: true,
            canUseAsMeasure: valueKind === "number",
            canUseForDistinctCount: true,
        },
    };
}

function row(id: string, values: Record<string, unknown>): AnalyticsRow {
    return {
        id,
        trackedEntity: {} as AnalyticsRow["trackedEntity"],
        enrollment: undefined,
        parentEvent: {} as AnalyticsRow["parentEvent"],
        childEventsByStage: {},
        values: Object.fromEntries(
            Object.entries(values).map(([key, raw]) => [
                key,
                {
                    raw,
                    display:
                        raw === undefined || raw === null || raw === ""
                            ? "Missing"
                            : String(raw),
                },
            ]),
        ),
    };
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:vitest src/analytics/pivot-engine.test.ts
```

Expected: FAIL with an import error for `./pivot-engine`.

- [ ] **Step 3: Implement pivot engine**

Create `src/analytics/pivot-engine.ts` with:

```ts
import { bucketDate } from "./date-buckets";
import { numericValue } from "./value-format";
import type {
    AnalyticsColumn,
    AnalyticsRow,
    PivotConfig,
    PivotDimension,
    PivotMeasure,
    PivotResult,
} from "./types";

const SEP = "||";

export function buildPivot({
    columns,
    rows,
    config,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    config: PivotConfig;
}): PivotResult {
    const columnByKey = new Map(columns.map((column) => [column.key, column]));
    const groupedRows = new Map<string, AnalyticsRow[]>();
    const rowKeyMap = new Map<string, string[]>();
    const columnKeyMap = new Map<string, string[]>();

    for (const row of rows) {
        const rowKey = dimensionLabels(row, config.rows, columnByKey);
        const columnKey = dimensionLabels(row, config.columns, columnByKey);
        const cellKey = makeCellKey(rowKey, columnKey);
        groupedRows.set(cellKey, [...(groupedRows.get(cellKey) ?? []), row]);
        rowKeyMap.set(rowKey.join(SEP), rowKey);
        columnKeyMap.set(columnKey.join(SEP), columnKey);
    }

    const cells: PivotResult["cells"] = {};
    for (const [cellKey, cellRows] of groupedRows.entries()) {
        cells[cellKey] = {
            values: Object.fromEntries(
                config.measures.map((measure) => [
                    measure.id,
                    aggregate(cellRows, measure),
                ]),
            ),
        };
    }

    return {
        rowHeaders: config.rows.map((dimension) => labelForDimension(dimension, columnByKey)),
        columnHeaders: config.columns.map((dimension) => labelForDimension(dimension, columnByKey)),
        rowKeys: Array.from(rowKeyMap.values()),
        columnKeys: Array.from(columnKeyMap.values()),
        cells,
    };
}

function labelForDimension(
    dimension: PivotDimension,
    columnByKey: Map<string, AnalyticsColumn>,
): string {
    const column = columnByKey.get(dimension.columnKey);
    if (!column) return dimension.columnKey;
    return dimension.dateBucket ? `${column.label} (${dimension.dateBucket})` : column.label;
}

function dimensionLabels(
    row: AnalyticsRow,
    dimensions: PivotDimension[],
    columnByKey: Map<string, AnalyticsColumn>,
): string[] {
    return dimensions.map((dimension) => {
        const column = columnByKey.get(dimension.columnKey);
        const cell = row.values[dimension.columnKey];
        if (dimension.dateBucket && column?.valueKind === "date") {
            return bucketDate(cell?.raw, dimension.dateBucket).label;
        }
        const display = cell?.display;
        return display === undefined || display === null || display === "" ? "Missing" : display;
    });
}

function makeCellKey(rowKey: string[], columnKey: string[]): string {
    return `${rowKey.join(SEP)}${SEP}${columnKey.join(SEP)}`;
}

function aggregate(rows: AnalyticsRow[], measure: PivotMeasure): number {
    switch (measure.aggregation) {
        case "count":
            return rows.length;
        case "distinctCount":
            return new Set(
                rows.map((row) =>
                    measure.columnKey ? row.values[measure.columnKey]?.raw : row.id,
                ),
            ).size;
        case "sum":
            return numericValues(rows, measure).reduce((sum, value) => sum + value, 0);
        case "avg": {
            const values = numericValues(rows, measure);
            return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
        }
        case "min": {
            const values = numericValues(rows, measure);
            return values.length ? Math.min(...values) : 0;
        }
        case "max": {
            const values = numericValues(rows, measure);
            return values.length ? Math.max(...values) : 0;
        }
    }
}

function numericValues(rows: AnalyticsRow[], measure: PivotMeasure): number[] {
    if (!measure.columnKey) return [];
    return rows.flatMap((row) => {
        const value = numericValue(row.values[measure.columnKey!]?.raw);
        return value === undefined ? [] : [value];
    });
}
```

- [ ] **Step 4: Run pivot tests**

Run:

```bash
pnpm test:vitest src/analytics/pivot-engine.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/analytics/pivot-engine.ts src/analytics/pivot-engine.test.ts
git commit -m "feat(analytics): add pivot aggregation engine"
```

---

### Task 8: XLSX Export

**Files:**
- Create: `src/analytics/xlsx-export.ts`
- Create: `src/analytics/xlsx-export.test.ts`

- [ ] **Step 1: Write failing XLSX tests**

Create `src/analytics/xlsx-export.test.ts` with:

```ts
import { describe, expect, it, vi } from "vitest";
import { buildLineListSheetRows } from "./xlsx-export";
import type { AnalyticsColumn, AnalyticsRow } from "./types";

describe("buildLineListSheetRows", () => {
    it("returns header and display values for selected visible columns", () => {
        const columns = [
            column("trackedEntity.trackedEntity", "Tracked Entity ID"),
            column("parentEvent.event", "Parent Event ID"),
        ];
        const rows = [
            row("visit1", {
                "trackedEntity.trackedEntity": "te1",
                "parentEvent.event": "visit1",
            }),
        ];

        expect(buildLineListSheetRows(columns, rows)).toEqual([
            ["Tracked Entity ID", "Parent Event ID"],
            ["te1", "visit1"],
        ]);
    });
});

function column(key: string, label: string): AnalyticsColumn {
    return {
        key,
        label,
        source: "parentEvent",
        sourceFieldId: key,
        valueKind: "string",
        groupPath: ["Test"],
        defaultVisible: true,
        pivot: {
            canUseAsDimension: true,
            canUseAsMeasure: false,
            canUseForDistinctCount: true,
        },
    };
}

function row(id: string, values: Record<string, string>): AnalyticsRow {
    return {
        id,
        trackedEntity: {} as AnalyticsRow["trackedEntity"],
        enrollment: undefined,
        parentEvent: {} as AnalyticsRow["parentEvent"],
        childEventsByStage: {},
        values: Object.fromEntries(
            Object.entries(values).map(([key, display]) => [
                key,
                { raw: display, display },
            ]),
        ),
    };
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:vitest src/analytics/xlsx-export.test.ts
```

Expected: FAIL with an import error for `./xlsx-export`.

- [ ] **Step 3: Implement XLSX helpers**

Create `src/analytics/xlsx-export.ts` with:

```ts
import * as XLSX from "xlsx";
import type { AnalyticsColumn, AnalyticsRow, PivotResult } from "./types";

export function buildLineListSheetRows(
    columns: AnalyticsColumn[],
    rows: AnalyticsRow[],
): string[][] {
    return [
        columns.map((column) => column.label),
        ...rows.map((row) =>
            columns.map((column) => row.values[column.key]?.display ?? ""),
        ),
    ];
}

export function exportRowsToXlsx({
    fileName,
    sheetName,
    rows,
}: {
    fileName: string;
    sheetName: string;
    rows: string[][];
}) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
}

export function buildPivotSheetRows(result: PivotResult): string[][] {
    const measureIds = Array.from(
        new Set(
            Object.values(result.cells).flatMap((cell) =>
                Object.keys(cell.values),
            ),
        ),
    );
    const header = [
        ...result.rowHeaders,
        ...result.columnKeys.flatMap((columnKey) =>
            measureIds.map((measure) =>
                [...columnKey, measure].filter(Boolean).join(" / "),
            ),
        ),
    ];
    const rows = result.rowKeys.map((rowKey) => [
        ...rowKey,
        ...result.columnKeys.flatMap((columnKey) => {
            const key = `${rowKey.join("||")}||${columnKey.join("||")}`;
            return measureIds.map((measure) =>
                String(result.cells[key]?.values[measure] ?? 0),
            );
        }),
    ]);
    return [header, ...rows];
}
```

- [ ] **Step 4: Run XLSX test**

Run:

```bash
pnpm test:vitest src/analytics/xlsx-export.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/analytics/xlsx-export.ts src/analytics/xlsx-export.test.ts
git commit -m "feat(analytics): add one sheet xlsx export helpers"
```

---

### Task 9: Analytics Route and Data Query

**Files:**
- Create: `src/routes/analytics.tsx`
- Modify: `src/router.tsx`
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Add route skeleton**

Create `src/routes/analytics.tsx` with:

```tsx
import { BarChartOutlined } from "@ant-design/icons";
import { createRoute } from "@tanstack/react-router";
import { and, eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import { Alert, Flex, Tabs, Typography } from "antd";
import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";
import { Spinner } from "../components/spinner";
import { useMetadata } from "../hooks/useMetadata";
import { buildParentEventDataset } from "../analytics/parent-event-dataset";
import { RootRoute } from "./__root";

const { Title, Text } = Typography;

export const AnalyticsRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/analytics",
    component: Analytics,
    pendingComponent: Spinner,
});

function Analytics() {
    const metadata = useMetadata();
    const { program, orgUnit } = metadata;
    const [parentStageId, setParentStageId] = useState(
        program.programStages.find((stage) => stage.id === "K2nxbE9ubSs")?.id ??
            program.programStages[0]?.id,
    );
    const [dateRange, setDateRange] = useState<[string, string]>([
        dayjs().startOf("month").format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD"),
    ]);

    const { data: trackedEntities = [] } = useLiveSuspenseQuery(
        (q) =>
            q.from({ trackedEntity: trackedEntitiesCollection }).where(({ trackedEntity }) =>
                and(
                    eq(trackedEntity.orgUnit, orgUnit),
                    not(eq(trackedEntity.syncStatus, "deleted")),
                ),
            ),
        [orgUnit],
    );
    const { data: enrollments = [] } = useLiveSuspenseQuery(
        (q) =>
            q.from({ enrollment: enrollmentsCollection }).where(({ enrollment }) =>
                and(
                    eq(enrollment.orgUnit, orgUnit),
                    eq(enrollment.program, program.id),
                    not(eq(enrollment.syncStatus, "deleted")),
                ),
            ),
        [orgUnit, program.id],
    );
    const { data: events = [] } = useLiveSuspenseQuery(
        (q) =>
            q.from({ event: eventsCollection }).where(({ event }) =>
                and(
                    eq(event.orgUnit, orgUnit),
                    eq(event.program, program.id),
                    not(eq(event.syncStatus, "deleted")),
                ),
            ),
        [orgUnit, program.id],
    );

    const dataset = useMemo(() => {
        if (!parentStageId) return undefined;
        return buildParentEventDataset({
            metadata,
            trackedEntities,
            enrollments,
            events,
            orgUnit,
            programId: program.id,
            parentStageId,
            startDate: dateRange[0],
            endDate: dateRange[1],
        });
    }, [metadata, trackedEntities, enrollments, events, orgUnit, program.id, parentStageId, dateRange]);

    if (!parentStageId || !dataset) {
        return <Alert type="warning" message="No program stage is available for analytics." />;
    }

    return (
        <Flex vertical gap={12} style={{ padding: 12, minHeight: "calc(100vh - 80px)" }}>
            <Flex align="center" gap={8}>
                <BarChartOutlined style={{ fontSize: 22, color: "#1677ff" }} />
                <Title level={3} style={{ margin: 0 }}>Analytics</Title>
                <Text type="secondary">{dataset.rows.length} parent event rows</Text>
            </Flex>
            <div data-testid="analytics-filters">
                Filters go here
            </div>
            <Tabs
                items={[
                    { key: "line-list", label: "Line List", children: <div data-testid="line-list-tab">Line list goes here</div> },
                    { key: "pivot", label: "Pivot", children: <div data-testid="pivot-tab">Pivot goes here</div> },
                ]}
            />
        </Flex>
    );
}
```

- [ ] **Step 2: Register route**

Modify `src/router.tsx`:

```tsx
import { AnalyticsRoute } from "./routes/analytics";
```

and update `routeTree`:

```tsx
const routeTree = RootRoute.addChildren([
    IndexRoute,
    TrackedEntitiesRoute.addChildren([TrackedEntitiesIndexRoute]),
    TrackedEntityRoute,
    AnalyticsRoute,
    ReportsRoute.addChildren([DataSetReportRoute]),
    AdminRoute.addChildren([AdminSectionLayoutRoute, AdminAppSettingsRoute]),
]);
```

- [ ] **Step 3: Add navigation entry**

Modify `src/routes/__root.tsx` imports:

```tsx
import {
    BarChartOutlined,
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    HomeOutlined,
    MenuOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
```

Add this link before Reports in `navItems`:

```tsx
<Link to="/analytics" onClick={() => setDrawerOpen(false)}>
    <SyncButton
        tooltip="Open Analytics"
        icon={<BarChartOutlined />}
        isLoading={false}
        idleLabel="Analytics"
        loadingLabel="Analytics"
        lastTime="Line list & pivot"
        onClick={() => {}}
        disabled={!hasProgram}
    />
</Link>
```

- [ ] **Step 4: Verify route compiles in build**

Run:

```bash
pnpm build
```

Expected: Build completes. Existing chunk-size and DHIS2 update-check warnings are acceptable.

- [ ] **Step 5: Commit**

```bash
git add src/routes/analytics.tsx src/router.tsx src/routes/__root.tsx
git commit -m "feat(analytics): add analytics route shell"
```

---

### Task 10: Filter Bar Component

**Files:**
- Create: `src/components/analytics/analytics-filter-bar.tsx`
- Modify: `src/routes/analytics.tsx`

- [ ] **Step 1: Create filter bar component**

Create `src/components/analytics/analytics-filter-bar.tsx` with:

```tsx
import { DatePicker, Flex, Form, Select } from "antd";
import dayjs from "dayjs";
import React from "react";
import type { ProgramStage } from "../../schemas";

const { RangePicker } = DatePicker;

export function AnalyticsFilterBar({
    programName,
    orgUnitName,
    stages,
    parentStageId,
    dateRange,
    onParentStageChange,
    onDateRangeChange,
}: {
    programName: string;
    orgUnitName: string;
    stages: ProgramStage[];
    parentStageId: string;
    dateRange: [string, string];
    onParentStageChange: (stageId: string) => void;
    onDateRangeChange: (range: [string, string]) => void;
}) {
    return (
        <Flex gap={12} wrap align="end">
            <Form.Item label="Program" style={{ marginBottom: 0 }}>
                <Select
                    disabled
                    value={programName}
                    style={{ width: 260 }}
                    options={[{ label: programName, value: programName }]}
                />
            </Form.Item>
            <Form.Item label="Organisation" style={{ marginBottom: 0 }}>
                <Select
                    disabled
                    value={orgUnitName}
                    style={{ width: 260 }}
                    options={[{ label: orgUnitName, value: orgUnitName }]}
                />
            </Form.Item>
            <Form.Item label="Parent Stage" style={{ marginBottom: 0 }}>
                <Select
                    showSearch
                    optionFilterProp="label"
                    value={parentStageId}
                    style={{ width: 260 }}
                    options={stages.map((stage) => ({
                        label: stage.name,
                        value: stage.id,
                    }))}
                    onChange={onParentStageChange}
                />
            </Form.Item>
            <Form.Item label="Date Range" style={{ marginBottom: 0 }}>
                <RangePicker
                    value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                    format="YYYY-MM-DD"
                    onChange={(_, strings) => {
                        if (strings[0] && strings[1]) {
                            onDateRangeChange([strings[0], strings[1]]);
                        }
                    }}
                />
            </Form.Item>
        </Flex>
    );
}
```

- [ ] **Step 2: Wire filter bar**

In `src/routes/analytics.tsx`, import:

```tsx
import { AnalyticsFilterBar } from "../components/analytics/analytics-filter-bar";
```

Replace the `<div data-testid="analytics-filters">` block with:

```tsx
<AnalyticsFilterBar
    programName={program.name}
    orgUnitName={metadata.orgUnitName}
    stages={program.programStages}
    parentStageId={parentStageId}
    dateRange={dateRange}
    onParentStageChange={setParentStageId}
    onDateRangeChange={setDateRange}
/>
```

- [ ] **Step 3: Build**

Run:

```bash
pnpm build
```

Expected: Build completes.

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/analytics-filter-bar.tsx src/routes/analytics.tsx
git commit -m "feat(analytics): add analytics filter bar"
```

---

### Task 11: Column Chooser and Line List Table

**Files:**
- Create: `src/components/analytics/column-chooser.tsx`
- Create: `src/components/analytics/line-list-table.tsx`
- Modify: `src/routes/analytics.tsx`

- [ ] **Step 1: Create column chooser**

Create `src/components/analytics/column-chooser.tsx` with:

```tsx
import { Button, Drawer, Transfer } from "antd";
import React, { useMemo, useState } from "react";
import type { AnalyticsColumn } from "../../analytics/types";

export function ColumnChooser({
    columns,
    visibleKeys,
    onChange,
}: {
    columns: AnalyticsColumn[];
    visibleKeys: string[];
    onChange: (keys: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const dataSource = useMemo(
        () =>
            columns.map((column) => ({
                key: column.key,
                title: column.label,
                description: column.groupPath.join(" / "),
            })),
        [columns],
    );

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                Columns ({visibleKeys.length})
            </Button>
            <Drawer
                title="Choose columns"
                open={open}
                onClose={() => setOpen(false)}
                width={760}
            >
                <Transfer
                    dataSource={dataSource}
                    targetKeys={visibleKeys}
                    onChange={(nextKeys) => onChange(nextKeys.map(String))}
                    render={(item) => `${item.description} / ${item.title}`}
                    showSearch
                    listStyle={{ width: 330, height: 520 }}
                    titles={["Available", "Visible"]}
                />
            </Drawer>
        </>
    );
}
```

- [ ] **Step 2: Create line list table**

Create `src/components/analytics/line-list-table.tsx` with:

```tsx
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";
import type { AnalyticsColumn, AnalyticsRow } from "../../analytics/types";
import {
    buildLineListSheetRows,
    exportRowsToXlsx,
} from "../../analytics/xlsx-export";
import { ColumnChooser } from "./column-chooser";

const { Text } = Typography;

export function LineListTable({
    columns,
    rows,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
}) {
    const [visibleKeys, setVisibleKeys] = useState(
        columns.filter((column) => column.defaultVisible).map((column) => column.key),
    );
    const [search, setSearch] = useState("");

    const visibleColumns = useMemo(
        () => columns.filter((column) => visibleKeys.includes(column.key)),
        [columns, visibleKeys],
    );
    const filteredRows = useMemo(() => {
        const needle = search.trim().toLowerCase();
        if (!needle) return rows;
        return rows.filter((row) =>
            visibleColumns.some((column) =>
                (row.values[column.key]?.display ?? "")
                    .toLowerCase()
                    .includes(needle),
            ),
        );
    }, [rows, search, visibleColumns]);

    const tableColumns = useMemo(
        () => buildAntdColumns(visibleColumns),
        [visibleColumns],
    );

    return (
        <Flex vertical gap={10}>
            <Flex justify="space-between" align="center" wrap gap={8}>
                <Space>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search visible columns"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        style={{ width: 280 }}
                    />
                    <ColumnChooser
                        columns={columns}
                        visibleKeys={visibleKeys}
                        onChange={setVisibleKeys}
                    />
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={() =>
                            exportRowsToXlsx({
                                fileName: "tracker-line-list.xlsx",
                                sheetName: "Line List",
                                rows: buildLineListSheetRows(visibleColumns, filteredRows),
                            })
                        }
                    >
                        Export XLSX
                    </Button>
                </Space>
                <Text type="secondary">
                    {filteredRows.length} of {rows.length} rows
                </Text>
            </Flex>
            <Table<AnalyticsRow>
                rowKey="id"
                size="small"
                columns={tableColumns}
                dataSource={filteredRows}
                scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
                pagination={{ pageSize: 25, showSizeChanger: true }}
            />
        </Flex>
    );
}

function buildAntdColumns(columns: AnalyticsColumn[]): ColumnsType<AnalyticsRow> {
    return columns.map((column) => ({
        key: column.key,
        title: column.groupPath.length
            ? `${column.groupPath.join(" / ")} / ${column.label}`
            : column.label,
        width: 180,
        sorter: (a, b) =>
            String(a.values[column.key]?.display ?? "").localeCompare(
                String(b.values[column.key]?.display ?? ""),
            ),
        render: (_, row) => row.values[column.key]?.display ?? "",
    }));
}
```

- [ ] **Step 3: Wire line-list tab**

In `src/routes/analytics.tsx`, import:

```tsx
import { LineListTable } from "../components/analytics/line-list-table";
```

Replace the line-list tab child with:

```tsx
<LineListTable columns={dataset.columns} rows={dataset.rows} />
```

- [ ] **Step 4: Run tests and build**

Run:

```bash
pnpm test:vitest src/analytics/xlsx-export.test.ts
pnpm build
```

Expected: Test passes and build completes.

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/column-chooser.tsx src/components/analytics/line-list-table.tsx src/routes/analytics.tsx
git commit -m "feat(analytics): render parent event line list"
```

---

### Task 12: Pivot Builder UI

**Files:**
- Create: `src/components/analytics/pivot-builder.tsx`
- Modify: `src/routes/analytics.tsx`

- [ ] **Step 1: Create pivot builder component**

Create `src/components/analytics/pivot-builder.tsx` with:

```tsx
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";
import { buildPivot } from "../../analytics/pivot-engine";
import {
    buildPivotSheetRows,
    exportRowsToXlsx,
} from "../../analytics/xlsx-export";
import type {
    AnalyticsColumn,
    AnalyticsRow,
    DateBucket,
    PivotAggregation,
    PivotConfig,
} from "../../analytics/types";

const { Text } = Typography;

export function PivotBuilder({
    columns,
    rows,
}: {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
}) {
    const dimensionOptions = columns
        .filter((column) => column.pivot.canUseAsDimension)
        .map((column) => ({
            label: `${column.groupPath.join(" / ")} / ${column.label}`,
            value: column.key,
        }));
    const measureColumnOptions = columns
        .filter((column) => column.pivot.canUseAsMeasure)
        .map((column) => ({
            label: `${column.groupPath.join(" / ")} / ${column.label}`,
            value: column.key,
        }));
    const distinctColumnOptions = columns
        .filter((column) => column.pivot.canUseForDistinctCount)
        .map((column) => ({
            label: `${column.groupPath.join(" / ")} / ${column.label}`,
            value: column.key,
        }));

    const [config, setConfig] = useState<PivotConfig>({
        rows: [],
        columns: [],
        measures: [{ id: "rows", label: "Rows", aggregation: "count" }],
    });

    const result = useMemo(
        () => buildPivot({ columns, rows, config }),
        [columns, rows, config],
    );

    const tableRows = useMemo(() => pivotTableRows(result, config), [result, config]);
    const tableColumns = useMemo(() => pivotTableColumns(result, config), [result, config]);

    return (
        <Flex vertical gap={12}>
            <Flex gap={8} wrap align="end">
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    placeholder="Row dimensions"
                    style={{ minWidth: 300 }}
                    options={dimensionOptions}
                    value={config.rows.map((dimension) => dimension.columnKey)}
                    onChange={(keys) =>
                        setConfig((prev) => ({
                            ...prev,
                            rows: keys.map((columnKey) => ({ columnKey })),
                        }))
                    }
                />
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    placeholder="Column dimensions"
                    style={{ minWidth: 300 }}
                    options={dimensionOptions}
                    value={config.columns.map((dimension) => dimension.columnKey)}
                    onChange={(keys) =>
                        setConfig((prev) => ({
                            ...prev,
                            columns: keys.map((columnKey) => ({ columnKey })),
                        }))
                    }
                />
                <Select
                    placeholder="Date bucket"
                    style={{ width: 160 }}
                    options={["exact", "week", "month", "quarter", "year"].map((value) => ({
                        label: value,
                        value,
                    }))}
                    onChange={(bucket: DateBucket) =>
                        setConfig((prev) => ({
                            ...prev,
                            rows: prev.rows.map((dimension) => ({ ...dimension, dateBucket: bucket })),
                            columns: prev.columns.map((dimension) => ({ ...dimension, dateBucket: bucket })),
                        }))
                    }
                />
                <Select
                    placeholder="Add measure"
                    style={{ width: 260 }}
                    options={[
                        { label: "Count rows", value: "count:" },
                        ...measureColumnOptions.flatMap((option) =>
                            (["sum", "avg", "min", "max"] as PivotAggregation[]).map((agg) => ({
                                label: `${agg} / ${option.label}`,
                                value: `${agg}:${option.value}`,
                            })),
                        ),
                        ...distinctColumnOptions.map((option) => ({
                            label: `distinct count / ${option.label}`,
                            value: `distinctCount:${option.value}`,
                        })),
                    ]}
                    onChange={(value) => {
                        const [aggregation, columnKey] = String(value).split(":");
                        setConfig((prev) => ({
                            ...prev,
                            measures: [
                                ...prev.measures,
                                {
                                    id: `${aggregation}-${columnKey || "rows"}-${prev.measures.length}`,
                                    label: columnKey ? `${aggregation} ${columnKey}` : "Rows",
                                    aggregation: aggregation as PivotAggregation,
                                    columnKey: columnKey || undefined,
                                },
                            ],
                        }));
                    }}
                />
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() =>
                        exportRowsToXlsx({
                            fileName: "tracker-pivot.xlsx",
                            sheetName: "Pivot",
                            rows: buildPivotSheetRows(result),
                        })
                    }
                >
                    Export XLSX
                </Button>
            </Flex>
            <Text type="secondary">
                Blank dimension values are grouped as Missing.
            </Text>
            <Table
                size="small"
                rowKey="key"
                columns={tableColumns}
                dataSource={tableRows}
                scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
                pagination={false}
            />
        </Flex>
    );
}

function pivotTableRows(
    result: ReturnType<typeof buildPivot>,
    config: PivotConfig,
) {
    return result.rowKeys.map((rowKey) => {
        const record: Record<string, string | number> = {
            key: rowKey.join("||"),
        };
        config.rows.forEach((_, index) => {
            record[`row-${index}`] = rowKey[index] ?? "";
        });
        for (const columnKey of result.columnKeys) {
            const cellKey = `${rowKey.join("||")}||${columnKey.join("||")}`;
            for (const measure of config.measures) {
                record[[...columnKey, measure.id].join("||")] =
                    result.cells[cellKey]?.values[measure.id] ?? 0;
            }
        }
        return record;
    });
}

function pivotTableColumns(
    result: ReturnType<typeof buildPivot>,
    config: PivotConfig,
): ColumnsType<Record<string, string | number>> {
    return [
        ...result.rowHeaders.map((header, index) => ({
            key: `row-${index}`,
            title: header,
            dataIndex: `row-${index}`,
            fixed: "left" as const,
            width: 180,
        })),
        ...result.columnKeys.flatMap((columnKey) =>
            config.measures.map((measure) => ({
                key: [...columnKey, measure.id].join("||"),
                title: [...columnKey, measure.label].join(" / "),
                dataIndex: [...columnKey, measure.id].join("||"),
                width: 160,
            })),
        ),
    ];
}
```

- [ ] **Step 2: Wire pivot tab**

In `src/routes/analytics.tsx`, import:

```tsx
import { PivotBuilder } from "../components/analytics/pivot-builder";
```

Replace the pivot tab child with:

```tsx
<PivotBuilder columns={dataset.columns} rows={dataset.rows} />
```

- [ ] **Step 3: Run pivot tests and build**

Run:

```bash
pnpm test:vitest src/analytics/pivot-engine.test.ts src/analytics/xlsx-export.test.ts
pnpm build
```

Expected: Tests pass and build completes.

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/pivot-builder.tsx src/routes/analytics.tsx
git commit -m "feat(analytics): add configurable pivot tab"
```

---

### Task 13: Polish Grouped Headers and Defaults

**Files:**
- Modify: `src/components/analytics/line-list-table.tsx`
- Modify: `src/components/analytics/column-chooser.tsx`
- Add tests only if pure helper extraction is needed.

- [ ] **Step 1: Extract grouped antd column helper**

In `src/components/analytics/line-list-table.tsx`, replace the flat `buildAntdColumns` with a grouped-column implementation:

```tsx
function buildAntdColumns(columns: AnalyticsColumn[]): ColumnsType<AnalyticsRow> {
    const root: Array<any> = [];

    for (const analyticsColumn of columns) {
        let level = root;
        for (const group of analyticsColumn.groupPath) {
            let existing = level.find((item) => item.key === group);
            if (!existing) {
                existing = { key: group, title: group, children: [] };
                level.push(existing);
            }
            level = existing.children;
        }
        level.push({
            key: analyticsColumn.key,
            title: analyticsColumn.label,
            width: 180,
            sorter: (a: AnalyticsRow, b: AnalyticsRow) =>
                String(a.values[analyticsColumn.key]?.display ?? "").localeCompare(
                    String(b.values[analyticsColumn.key]?.display ?? ""),
                ),
            render: (_: unknown, row: AnalyticsRow) =>
                row.values[analyticsColumn.key]?.display ?? "",
        });
    }

    return root as ColumnsType<AnalyticsRow>;
}
```

- [ ] **Step 2: Add quick column chooser actions**

In `src/components/analytics/column-chooser.tsx`, add footer actions inside `Drawer` before `Transfer`:

```tsx
<div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
    <Button onClick={() => onChange(columns.filter((c) => c.defaultVisible).map((c) => c.key))}>
        Reset defaults
    </Button>
    <Button onClick={() => onChange(columns.map((c) => c.key))}>
        Show all
    </Button>
    <Button onClick={() => onChange([])}>
        Hide all
    </Button>
</div>
```

- [ ] **Step 3: Build**

Run:

```bash
pnpm build
```

Expected: Build completes and antd Table grouped headers render.

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/line-list-table.tsx src/components/analytics/column-chooser.tsx
git commit -m "feat(analytics): polish column grouping controls"
```

---

### Task 14: Full Verification

**Files:**
- No source edits expected unless verification exposes a defect.

- [ ] **Step 1: Run analytics tests**

Run:

```bash
pnpm test:vitest src/analytics
```

Expected: All analytics tests pass.

- [ ] **Step 2: Run full Vitest suite**

Run:

```bash
pnpm test:vitest
```

Expected: All Vitest tests pass.

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm build
```

Expected: Build completes. Existing warnings about large chunks, skipped precache files, and DHIS2 CLI update-check permissions are acceptable.

- [ ] **Step 4: Typecheck**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: If the existing `@tanstack/db` 0.6.5 vs 0.6.14 collection errors remain, document them in the final handoff. There must be no errors referencing `src/analytics`, `src/routes/analytics.tsx`, or `src/components/analytics`.

- [ ] **Step 5: Commit verification-only fixes**

If fixes were needed:

```bash
git add src/analytics src/components/analytics src/routes/analytics.tsx src/router.tsx src/routes/__root.tsx
git commit -m "fix(analytics): resolve verification issues"
```

If no fixes were needed, do not create an empty commit.

---

## Self-Review Checklist

- Spec coverage: tasks cover Analytics route, filter bar, parent-event dataset, system IDs, parent event fields/data values, child slots, section grouping, label/raw values, line-list table, custom pivot, date buckets, Missing bucket, XLSX one-sheet export, and tests.
- Test-first flow: pure date/value/registry/dataset/pivot/xlsx modules all start with failing Vitest tests.
- Dependency risk: `xlsx` is isolated to `src/analytics/xlsx-export.ts`.
- UI risk: antd Table, Tabs, Select, DatePicker RangePicker, Drawer, and Transfer are used through documented props.
- Known repo risk: `pnpm exec tsc --noEmit` may continue to report existing `@tanstack/db` version-skew errors in collection files; implementation must ensure no new analytics errors are added.
