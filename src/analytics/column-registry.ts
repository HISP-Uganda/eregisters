import type { AnalyticsColumn, AnalyticsMetadata } from "./types";
import { valueKindFromDhis2 } from "./value-format";

interface RegistryInput {
    metadata: AnalyticsMetadata;
    parentStageId: string;
    childStageSlotCounts: Map<string, number>;
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
        const tea = ptea.trackedEntityAttribute;
        const section =
            attributeSections.get(tea.id) ?? "Ungrouped Attributes";
        const valueKind = valueKindFromDhis2(tea.valueType);
        columns.push(
            column({
                key: `te.attribute.${tea.id}`,
                label: tea.formName || tea.displayFormName || tea.name,
                source: "trackedEntity",
                sourceFieldId: tea.id,
                valueKind,
                optionSetId: tea.optionSet?.id,
                groupPath: ["Tracked Entity", section],
                defaultVisible: Boolean(ptea.displayInList),
                canMeasure: valueKind === "number",
            }),
        );
    }

    for (const psde of parentStage.programStageDataElements ?? []) {
        const de = psde.dataElement;
        const valueKind = valueKindFromDhis2(de.valueType);
        columns.push(
            column({
                key: `parentEvent.dataValue.${de.id}`,
                label: de.formName || de.name,
                source: "parentEvent",
                sourceFieldId: de.id,
                valueKind,
                optionSetId: de.optionSet?.id,
                groupPath: ["Parent Event"],
                defaultVisible: true,
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
                    label: `${stage.name} ${slot} Event ID`,
                    source: "childEvent",
                    sourceFieldId: "event",
                    valueKind: "string",
                    groupPath: [
                        "Child Events",
                        stage.name,
                        `Slot ${slot}`,
                        "System",
                    ],
                    defaultVisible: false,
                }),
            );

            for (const psde of stage.programStageDataElements ?? []) {
                const de = psde.dataElement;
                const section =
                    findStageSection(stage, de.id) ?? "Ungrouped Child Event";
                const valueKind = valueKindFromDhis2(de.valueType);
                columns.push(
                    column({
                        key: `childEvent.${stageId}.${slot}.dataValue.${de.id}`,
                        label: `${stage.name} ${slot} ${de.formName || de.name}`,
                        source: "childEvent",
                        sourceFieldId: de.id,
                        valueKind,
                        optionSetId: de.optionSet?.id,
                        groupPath: [
                            "Child Events",
                            stage.name,
                            `Slot ${slot}`,
                            section,
                        ],
                        defaultVisible: false,
                        canMeasure: valueKind === "number",
                    }),
                );
            }
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
              : "Parent Event";

    for (const field of fields) {
        columns.push(
            column({
                key: `${source}.${field}`,
                label: field,
                source,
                sourceFieldId: field,
                valueKind: field.endsWith("At") ? "datetime" : "string",
                groupPath:
                    source === "parentEvent" ? [groupName] : [groupName, "System"],
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
