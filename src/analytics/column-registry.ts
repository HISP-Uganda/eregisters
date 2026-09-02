import type { AnalyticsColumn, AnalyticsMetadata } from "./types";
import { valueKindFromDhis2 } from "./value-format";

/** The main event's Service Type data element — captured directly on the
 * capture form (see main-event-capture.tsx) rather than within its
 * section, but still one of the main stage's own data elements. Shared
 * with parent-event-dataset.ts, which filters/gates on the same field. */
export const SERVICE_TYPE_FIELD_ID = "mrKZWf2WMIC";

/** Friendlier labels for the createdBy/updatedBy system columns, shared
 * across the trackedEntity/enrollment/parentEvent system-column groups. */
const USER_FIELD_LABELS: Record<string, string> = {
    createdBy: "Created By",
    updatedBy: "Last Updated By",
};

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
    /** Service Type codes selected in the Analytics filter bar. Some
     * programStageSections happen to be named after a service (e.g. a
     * section literally called "TB" or "ART") — when one or more services
     * are selected, sections whose name matches a *known* service name are
     * narrowed to only the selected ones; sections that aren't named after
     * any service are left alone. Empty means no filtering. */
    selectedServiceTypes?: string[];
    /** The full Service Type optionSet (codes + names) — the vocabulary
     * used both to recognize which sections are "service sections" and to
     * resolve a selected code to the name a section might be titled with. */
    serviceTypeOptions?: Array<{ code: string; name: string }>;
}

function normalizeServiceLabel(label: string): string {
    return label.trim().toLowerCase();
}

/** True unless `section` is a real, named section that matches a *known*
 * service name/code but isn't among the currently selected ones. Sections
 * that aren't named after any service (system groups, "Ungrouped", etc.)
 * always pass through untouched. */
function sectionPassesServiceFilter(
    section: string | undefined,
    knownServiceLabels: Set<string>,
    selectedServiceLabels: Set<string>,
): boolean {
    if (selectedServiceLabels.size === 0) return true;
    if (!section) return true;
    const normalized = normalizeServiceLabel(section);
    if (!knownServiceLabels.has(normalized)) return true;
    return selectedServiceLabels.has(normalized);
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
    selectedServiceTypes,
    serviceTypeOptions = [],
}: RegistryInput): AnalyticsColumn[] {
    const mainStage = metadata.program.programStages.find(
        (stage) => stage.id === mainStageId,
    );
    if (!mainStage) {
        throw new Error(`Main stage ${mainStageId} was not found`);
    }

    const knownServiceLabels = new Set<string>();
    for (const option of serviceTypeOptions) {
        knownServiceLabels.add(normalizeServiceLabel(option.code));
        knownServiceLabels.add(normalizeServiceLabel(option.name));
    }
    const selectedServiceLabels = new Set<string>();
    for (const code of selectedServiceTypes ?? []) {
        selectedServiceLabels.add(normalizeServiceLabel(code));
        const option = serviceTypeOptions.find((o) => o.code === code);
        if (option) selectedServiceLabels.add(normalizeServiceLabel(option.name));
    }
    const sectionAllowed = (section: string | undefined) =>
        sectionPassesServiceFilter(
            section,
            knownServiceLabels,
            selectedServiceLabels,
        );

    const columns: AnalyticsColumn[] = [
        column({
            key: "trackedEntity.trackedEntity",
            label: "Tracked Entity ID",
            source: "trackedEntity",
            sourceFieldId: "trackedEntity",
            valueKind: "string",
            groupPath: ["System IDs"],
            // Opening a record is now a "View Profile"/"View Visit" button
            // in the fixed Actions column, not a click on the id itself —
            // still available to add back via the column chooser.
            defaultVisible: false,
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
            defaultVisible: false,
        }),
    ];

    addSystemColumns(
        columns,
        "trackedEntity",
        [
            "trackedEntityType",
            "orgUnit",
            "syncStatus",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
        ],
        USER_FIELD_LABELS,
    );
    addSystemColumns(
        columns,
        "enrollment",
        [
            "program",
            "trackedEntity",
            "orgUnit",
            "status",
            "enrolledAt",
            "occurredAt",
            "syncStatus",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
        ],
        USER_FIELD_LABELS,
    );
    addSystemColumns(
        columns,
        "parentEvent",
        [
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
            "createdBy",
            "updatedBy",
            "parentEvent",
        ],
        {
            ...USER_FIELD_LABELS,
            occurredAt: mainStage.executionDateLabel ?? "Report Date",
        },
    );

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
        const rawSection = findStageSection(mainStage, de.id);
        if (!sectionAllowed(rawSection)) continue;
        const section = rawSection ?? "Ungrouped";
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
                defaultVisible: de.id === SERVICE_TYPE_FIELD_ID,
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
                const rawSection = findStageSection(stage, de.id);
                if (!sectionAllowed(rawSection)) continue;
                const section = rawSection ?? "Ungrouped Child Event";
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
            const rawSection = findStageSection(stage, de.id);
            if (!sectionAllowed(rawSection)) continue;
            const section = rawSection ?? "Ungrouped";
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
    labelOverrides: Record<string, string> = {},
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
                label: labelOverrides[field] ?? field,
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
