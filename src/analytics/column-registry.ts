import type { AnalyticsColumn, AnalyticsMetadata } from "./types";
import { valueKindFromDhis2 } from "./value-format";

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

function column(
    input: Omit<AnalyticsColumn, "pivot"> & {
        canMeasure?: boolean;
    },
): AnalyticsColumn {
    const { canMeasure = false, ...columnInput } = input;
    return {
        ...columnInput,
        pivot: {
            canUseAsDimension: true,
            canUseAsMeasure: canMeasure,
            canUseForDistinctCount: true,
        },
    };
}

export function buildColumnRegistry({
    metadata,
    mainStageId,
    childStageSlotCounts,
    realizedParentStageIds,
}: RegistryInput): AnalyticsColumn[] {
    const mainStage = metadata.program.programStages.find(
        (stage) => stage.id === mainStageId,
    );
    if (!mainStage) {
        throw new Error(`Main stage ${mainStageId} was not found`);
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
            defaultVisible: false,
        }),
        column({
            key: "parentEvent.event",
            label: "Main Event ID",
            source: "parentEvent",
            sourceFieldId: "event",
            valueKind: "string",
            groupPath: ["System IDs"],
            defaultVisible: true,
        }),
    ];

    addSystemColumns(columns, "trackedEntity", [
        "trackedEntityType",
        "orgUnit",
        "syncStatus",
        "createdAt",
        "updatedAt",
    ]);
    addSystemColumns(columns, "enrollment", [
        "program",
        "trackedEntity",
        "orgUnit",
        "status",
        "enrolledAt",
        "occurredAt",
        "syncStatus",
        "createdAt",
        "updatedAt",
    ]);
    addSystemColumns(columns, "parentEvent", [
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
    ]);

    const attributeSections = new Map<string, string>();
    for (const section of metadata.program.programSections ?? []) {
        for (const attribute of section.trackedEntityAttributes ?? []) {
            attributeSections.set(
                attribute.id,
                section.displayName || section.name,
            );
        }
    }

    for (const ptea of metadata.program.programTrackedEntityAttributes ?? []) {
        const tea =
            metadata.trackedEntityAttributes.get(
                ptea.trackedEntityAttribute.id,
            ) ?? ptea.trackedEntityAttribute;
        const section =
            attributeSections.get(tea.id) ?? "Ungrouped Attributes";
        const valueKind = valueKindFromDhis2(tea.valueType);
        columns.push(
            column({
                key: `te.attribute.${tea.id}`,
                label: labelFrom(
                    tea.name,
                    tea.formName,
                    tea.displayFormName,
                    tea.id,
                ),
                source: "trackedEntity",
                sourceFieldId: tea.id,
                valueKind,
                optionSetId: tea.optionSet?.id,
                groupPath: ["Tracked Entity", section],
                defaultVisible: false,
                canMeasure: valueKind === "number",
            }),
        );
    }

    for (const psde of mainStage.programStageDataElements ?? []) {
        const de = metadata.dataElements.get(psde.dataElement.id) ?? psde.dataElement;
        const section = findStageSection(mainStage, de.id) ?? "Ungrouped";
        const valueKind = valueKindFromDhis2(de.valueType);
        columns.push(
            column({
                key: `parentEvent.dataValue.${de.id}`,
                label: labelFrom(de.name, de.formName, de.id),
                source: "parentEvent",
                sourceFieldId: de.id,
                valueKind,
                optionSetId: de.optionSet?.id,
                groupPath: ["Main Event", mainStage.name, section],
                defaultVisible: false,
                canMeasure: valueKind === "number",
            }),
        );
    }

    for (const [stageId, slotCount] of childStageSlotCounts.entries()) {
        const stage = metadata.program.programStages.find((s) => s.id === stageId);
        if (!stage || slotCount <= 0) continue;
        for (let slot = 1; slot <= slotCount; slot++) {
            columns.push(
                column({
                    key: `childEvent.${stageId}.${slot}.event`,
                    label: `Event ID (${slot})`,
                    source: "childEvent",
                    sourceFieldId: "event",
                    valueKind: "string",
                    groupPath: ["Child Events", stage.name, "System"],
                    defaultVisible: false,
                    chooserKey: `childEvent.${stageId}.event`,
                    chooserLabel: "Event ID",
                }),
            );

            for (const psde of stage.programStageDataElements ?? []) {
                const de =
                    metadata.dataElements.get(psde.dataElement.id) ??
                    psde.dataElement;
                const section =
                    findStageSection(stage, de.id) ?? "Ungrouped Child Event";
                const valueKind = valueKindFromDhis2(de.valueType);
                const deLabel = labelFrom(de.name, de.formName, de.id);
                columns.push(
                    column({
                        key: `childEvent.${stageId}.${slot}.dataValue.${de.id}`,
                        label: `${deLabel} (${slot})`,
                        source: "childEvent",
                        sourceFieldId: de.id,
                        valueKind,
                        optionSetId: de.optionSet?.id,
                        groupPath: ["Child Events", stage.name, section],
                        defaultVisible: false,
                        canMeasure: valueKind === "number",
                        chooserKey: `childEvent.${stageId}.dataValue.${de.id}`,
                        chooserLabel: deLabel,
                    }),
                );
            }
        }
    }

    // "parentEvent" here reuses the existing AnalyticsSource union value
    // meaning "reads from an event object" — unrelated to the
    // "parentEvent.*" column-key prefix used for the main stage above.
    for (const stageId of realizedParentStageIds ?? []) {
        const stage = metadata.program.programStages.find(
            (s) => s.id === stageId,
        );
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

    return columns;
}

function addSystemColumns(
    columns: AnalyticsColumn[],
    source: "trackedEntity" | "enrollment" | "parentEvent",
    fields: string[],
) {
    const groupName =
        source === "trackedEntity"
            ? "Tracked Entity"
            : source === "enrollment"
              ? "Enrollment"
              : "Main Event";

    for (const field of fields) {
        columns.push(
            column({
                key: `${source}.${field}`,
                label: field,
                source,
                sourceFieldId: field,
                valueKind: field.endsWith("At") ? "datetime" : "string",
                groupPath: [groupName, "System"],
                defaultVisible: source === "parentEvent" && field === "occurredAt",
            }),
        );
    }
}

function findStageSection(
    stage: AnalyticsMetadata["program"]["programStages"][number],
    dataElementId: string,
): string | undefined {
    const section = (stage.programStageSections ?? []).find((candidate) =>
        (candidate.dataElements ?? []).some(
            (dataElement) => dataElement.id === dataElementId,
        ),
    );
    return section ? section.displayName || section.name : undefined;
}

function labelFrom(...candidates: Array<string | undefined>): string {
    for (const candidate of candidates) {
        const label = candidate?.trim();
        if (label) return label;
    }
    return "";
}
