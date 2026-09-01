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
    | "childEvent"
    | "computed";

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
    linkedParentByStage: Record<string, FlattenedEvent>;
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
    /**
     * When set, columns sharing the same chooserKey are collapsed into a
     * single checkbox in the column chooser (used for child-event data
     * elements that repeat per slot) instead of one checkbox per column.
     */
    chooserKey?: string;
    /** Label to show for the collapsed chooser checkbox; falls back to `label`. */
    chooserLabel?: string;
    /**
     * Set on columns synthesized by a computed-column definition (see
     * `computed-columns.ts`) rather than derived from program metadata.
     * Excluded from xlsx export; never usable as a Pivot dimension/measure.
     */
    isComputed?: boolean;
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
    /** Service-type codes selected in the Analytics filter bar (the same
     * vocabulary as the main event's Service Type field, `mrKZWf2WMIC`).
     * Empty means no service filtering/restriction is applied — see
     * `parent-event-dataset.ts` for how this narrows both rows and which
     * service-gated child-stage columns are offered. */
    selectedServiceTypes: string[];
}

export interface AnalyticsDataset {
    columns: AnalyticsColumn[];
    rows: AnalyticsRow[];
    mainStage: ProgramStage;
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
