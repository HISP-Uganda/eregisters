import dayjs from "dayjs";
import { buildColumnRegistry, SERVICE_TYPE_FIELD_ID } from "./column-registry";
import type {
    AnalyticsCell,
    AnalyticsColumn,
    AnalyticsDataset,
    AnalyticsDatasetInput,
} from "./types";
import { displayValue } from "./value-format";

type RecordWithAttributes = Record<string, unknown> & {
    attributes: Record<string, unknown>;
};
type RecordWithDataValues = Record<string, unknown> & {
    dataValues: Record<string, unknown>;
};

const SERVICE_TYPE_OPTION_SET_ID = "QwsvSPpnRul";

function eventServiceTypes(event: RecordWithDataValues): string[] {
    const raw = event.dataValues[SERVICE_TYPE_FIELD_ID];
    if (typeof raw !== "string" || !raw) return [];
    return raw.split(",").filter(Boolean);
}

export function buildParentEventDataset(
    input: AnalyticsDatasetInput,
): AnalyticsDataset {
    const mainStage = input.metadata.program.programStages.find(
        (stage) => stage.id === input.selectedStageId,
    );
    if (!mainStage) {
        throw new Error(`Main stage ${input.selectedStageId} was not found`);
    }
    const selectedChildStageIds = new Set(input.childStageIds);

    const trackedEntityById = new Map(
        input.trackedEntities.map((te) => [te.trackedEntity, te]),
    );
    const enrollmentById = new Map(
        input.enrollments.map((enrollment) => [
            enrollment.enrollment,
            enrollment,
        ]),
    );

    const mainStageEvents = input.events.filter((event) => {
        if (event.syncStatus === "deleted" || event.deleted) return false;
        if (event.orgUnit !== input.orgUnit) return false;
        if (event.program !== input.programId) return false;
        if (event.programStage !== input.selectedStageId) return false;
        return true;
    });

    // Rows are scoped to the selected date range, but which linked-parent /
    // child-event columns exist is not: a column must stay selectable once
    // any linked event exists anywhere for this stage, even if the specific
    // linked record currently falls outside the date filter — otherwise
    // there's no way to discover the column exists in order to widen the
    // date range and see it.
    const selectedServiceTypes = new Set(input.selectedServiceTypes);
    const mainEvents = mainStageEvents.filter((event) => {
        if (
            !isWithinDateRange(
                effectiveOccurredAt(event),
                input.startDate,
                input.endDate,
            )
        )
            return false;
        if (selectedServiceTypes.size === 0) return true;
        return eventServiceTypes(event).some((service) =>
            selectedServiceTypes.has(service),
        );
    });

    const childEventsByParent = new Map<string, typeof input.events>();
    for (const event of input.events) {
        if (!event.parentEvent) continue;
        if (event.syncStatus === "deleted" || event.deleted) continue;
        if (!selectedChildStageIds.has(event.programStage)) continue;
        const existing = childEventsByParent.get(event.parentEvent) ?? [];
        existing.push(event);
        childEventsByParent.set(event.parentEvent, existing);
    }

    const slotCounts = new Map<string, number>();
    for (const parent of mainStageEvents) {
        const grouped = groupChildrenByStage(
            childEventsByParent.get(parent.event) ?? [],
        );
        for (const [stageId, children] of Object.entries(grouped)) {
            slotCounts.set(
                stageId,
                Math.max(slotCounts.get(stageId) ?? 0, children.length),
            );
        }
    }

    const eventById = new Map(input.events.map((event) => [event.event, event]));
    const legalParentStageIds = new Set(input.legalParentStageIds);

    function resolveLinkedParent(selectedEvent: (typeof input.events)[number]) {
        if (!selectedEvent.parentEvent) return undefined;
        const parent = eventById.get(selectedEvent.parentEvent);
        if (!parent) return undefined;
        if (parent.syncStatus === "deleted" || parent.deleted) return undefined;
        if (!legalParentStageIds.has(parent.programStage)) return undefined;
        return parent;
    }

    const realizedParentStageIds = new Set<string>();
    for (const selectedEvent of mainStageEvents) {
        const parent = resolveLinkedParent(selectedEvent);
        if (parent) realizedParentStageIds.add(parent.programStage);
    }

    const columns = buildColumnRegistry({
        metadata: input.metadata,
        mainStageId: input.selectedStageId,
        childStageSlotCounts: slotCounts,
        realizedParentStageIds: [...realizedParentStageIds],
        selectedServiceTypes: input.selectedServiceTypes,
        serviceTypeOptions:
            input.metadata.optionSets.get(SERVICE_TYPE_OPTION_SET_ID) ?? [],
    });

    const rows = mainEvents.map((parentEvent) => {
        const trackedEntity =
            trackedEntityById.get(parentEvent.trackedEntity) ??
            fallbackTrackedEntity(parentEvent);

        const childEventsByStage = groupChildrenByStage(
            childEventsByParent.get(parentEvent.event) ?? [],
        );
        const linkedParent = resolveLinkedParent(parentEvent);
        const linkedParentByStage: Record<string, (typeof input.events)[number]> =
            {};
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

    return { columns, rows, mainStage };
}

function fallbackTrackedEntity(parentEvent: {
    trackedEntity: string;
    orgUnit: string;
    createdAt: string;
    updatedAt: string;
}) {
    return {
        trackedEntity: parentEvent.trackedEntity,
        trackedEntityType: "",
        createdAt: parentEvent.createdAt,
        updatedAt: parentEvent.updatedAt,
        orgUnit: parentEvent.orgUnit,
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        attributes: {},
        syncStatus: "synced" as const,
        lastSynced: "",
        version: 1,
    };
}

function effectiveOccurredAt(event: {
    occurredAt: string;
    dataValues: Record<string, unknown>;
}) {
    return String(event.dataValues.occurredAt ?? event.occurredAt);
}

function isWithinDateRange(
    value: string,
    startDate: string,
    endDate: string,
): boolean {
    const date = dayjs(value);
    if (!date.isValid()) return false;
    return (
        (date.isSame(dayjs(startDate), "day") ||
            date.isAfter(dayjs(startDate), "day")) &&
        (date.isSame(dayjs(endDate), "day") ||
            date.isBefore(dayjs(endDate), "day"))
    );
}

function groupChildrenByStage<
    T extends { programStage: string; occurredAt: string; event: string },
>(events: T[]): Record<string, T[]> {
    const grouped: Record<string, T[]> = {};
    for (const event of events.slice().sort(compareEvents)) {
        grouped[event.programStage] = grouped[event.programStage] ?? [];
        grouped[event.programStage].push(event);
    }
    return grouped;
}

function compareEvents(
    a: { occurredAt: string; event: string },
    b: { occurredAt: string; event: string },
) {
    const byDate = dayjs(a.occurredAt).valueOf() - dayjs(b.occurredAt).valueOf();
    return byDate === 0 ? a.event.localeCompare(b.event) : byDate;
}

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
