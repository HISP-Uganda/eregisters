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
    mainStageId: string;
    childStageIds: string[];
    startDate: string;
    endDate: string;
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
