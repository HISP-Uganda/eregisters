import type { Program, ProgramStage, UIConfig } from "../schemas";
import { groupByLayout, groupBySubsections } from "../utils/subsection-grouping";
import type { AnalyticsColumn, AnalyticsMetadata } from "./types";
import { valueKindFromDhis2 } from "./value-format";

/** The two `UIConfig` fields this file actually needs — callers pass the
 * whole `UIConfig` (from `useUIConfig()`), but narrowing the parameter
 * type keeps this module decoupled from `UIConfig`'s other, unrelated
 * fields (reloadSignal, storageBackendPolicy, etc). */
type SubsectionLayoutConfig = Partial<
    Pick<UIConfig, "subsections" | "formLayouts">
>;

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
    /** Admin-configured subsection layout (`admin.section-layout.tsx`),
     * keyed by `programStageSection`/`programSection` id — the same data
     * `subsection-groups.tsx` renders as cards on the capture form. When a
     * section has one configured, its columns are further ordered/grouped
     * by subsection instead of stopping at section-level; a section with
     * none configured behaves exactly as before. */
    uiConfig?: SubsectionLayoutConfig;
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

/** Stable sort by DHIS2's `sortOrder` (as configured in Maintenance),
 * treating a missing value as "last" — cached metadata pulled before
 * `sortOrder` was added to the field list won't have it yet. */
function bySortOrder<T extends { sortOrder?: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
    });
}

interface SectionedItem<T> {
    item: T;
    /** Section display label, or undefined when the item is in no section
     * (renders as "Ungrouped"/"Ungrouped Attributes" by the caller). */
    sectionLabel: string | undefined;
    /** Subsection display label, or null when the item's section has no
     * configured subsection layout, or the item isn't referenced by it. */
    subsectionLabel: string | null;
}

/**
 * Reorders (and, when configured, further sub-groups) one section's worth
 * of items by the admin-configured subsection layout for `sectionId` —
 * `formLayouts` preferred over the legacy `subsections`, matching
 * `subsection-groups.tsx`'s own precedence. No layout configured for this
 * section: items pass through in their given (DHIS2 section) order,
 * unlabeled.
 */
function withSubsections<T>(
    sectionId: string,
    items: T[],
    getId: (item: T) => string,
    uiConfig: SubsectionLayoutConfig | undefined,
): Array<{ item: T; subsectionLabel: string | null }> {
    const formLayout = uiConfig?.formLayouts?.[sectionId];
    const subsections = uiConfig?.subsections?.[sectionId];
    if ((!formLayout || formLayout.length === 0) && !subsections?.length) {
        return items.map((item) => ({ item, subsectionLabel: null }));
    }
    const groups =
        formLayout && formLayout.length > 0
            ? groupByLayout(items, formLayout, getId)
            : groupBySubsections(items, subsections, getId);
    return groups.flatMap((group) =>
        group.items.map((item) => ({ item, subsectionLabel: group.label })),
    );
}

/**
 * Orders a stage's `programStageDataElements` by each data element's
 * position within its `programStageSections` (walked in section
 * `sortOrder`, matching how program-stage-capture.tsx/basic-form.tsx etc.
 * already render sections/fields) instead of the stage-wide PSDE
 * `sortOrder`, which can legitimately diverge from a section's own
 * internal order — then, within each section, further orders/labels by
 * subsection (see `withSubsections`). A data element in no section falls
 * back to `bySortOrder`, appended after every sectioned element, with no
 * subsection label.
 */
function orderDataElementsBySection(
    stage: ProgramStage,
    psdes: ProgramStage["programStageDataElements"],
    uiConfig: SubsectionLayoutConfig | undefined,
): SectionedItem<ProgramStage["programStageDataElements"][number]>[] {
    const byDataElementId = new Map(psdes.map((psde) => [psde.dataElement.id, psde]));
    const getId = (psde: ProgramStage["programStageDataElements"][number]) =>
        psde.dataElement.id;
    const ordered: SectionedItem<
        ProgramStage["programStageDataElements"][number]
    >[] = [];
    const seen = new Set<string>();
    for (const section of bySortOrder(stage.programStageSections ?? [])) {
        const sectionPsdes: ProgramStage["programStageDataElements"] = [];
        for (const de of section.dataElements ?? []) {
            const psde = byDataElementId.get(de.id);
            if (psde && !seen.has(de.id)) {
                sectionPsdes.push(psde);
                seen.add(de.id);
            }
        }
        if (sectionPsdes.length === 0) continue;
        const sectionLabel = section.displayName || section.name;
        for (const { item, subsectionLabel } of withSubsections(
            section.id,
            sectionPsdes,
            getId,
            uiConfig,
        )) {
            ordered.push({ item, sectionLabel, subsectionLabel });
        }
    }
    for (const psde of bySortOrder(psdes)) {
        if (!seen.has(psde.dataElement.id)) {
            ordered.push({
                item: psde,
                sectionLabel: undefined,
                subsectionLabel: null,
            });
            seen.add(psde.dataElement.id);
        }
    }
    return ordered;
}

/**
 * Same idea as `orderDataElementsBySection`, for the profile's
 * `programTrackedEntityAttributes`/`programSections`.
 */
function orderAttributesBySection(
    program: Program,
    pteas: Program["programTrackedEntityAttributes"],
    uiConfig: SubsectionLayoutConfig | undefined,
): SectionedItem<Program["programTrackedEntityAttributes"][number]>[] {
    const byAttributeId = new Map(
        pteas.map((ptea) => [ptea.trackedEntityAttribute.id, ptea]),
    );
    const getId = (ptea: Program["programTrackedEntityAttributes"][number]) =>
        ptea.trackedEntityAttribute.id;
    const ordered: SectionedItem<
        Program["programTrackedEntityAttributes"][number]
    >[] = [];
    const seen = new Set<string>();
    for (const section of bySortOrder(program.programSections ?? [])) {
        const sectionPteas: Program["programTrackedEntityAttributes"] = [];
        for (const attribute of section.trackedEntityAttributes ?? []) {
            const ptea = byAttributeId.get(attribute.id);
            if (ptea && !seen.has(attribute.id)) {
                sectionPteas.push(ptea);
                seen.add(attribute.id);
            }
        }
        if (sectionPteas.length === 0) continue;
        const sectionLabel = section.displayName || section.name;
        for (const { item, subsectionLabel } of withSubsections(
            section.id,
            sectionPteas,
            getId,
            uiConfig,
        )) {
            ordered.push({ item, sectionLabel, subsectionLabel });
        }
    }
    for (const ptea of bySortOrder(pteas)) {
        if (!seen.has(ptea.trackedEntityAttribute.id)) {
            ordered.push({
                item: ptea,
                sectionLabel: undefined,
                subsectionLabel: null,
            });
            seen.add(ptea.trackedEntityAttribute.id);
        }
    }
    return ordered;
}

function column(
    input: Omit<AnalyticsColumn, "pivot" | "defaultVisible"> & {
        canMeasure?: boolean;
    },
): AnalyticsColumn {
    const { canMeasure = false, ...columnInput } = input;
    return {
        ...columnInput,
        // Nothing is selected by default — users opt into the columns they
        // want via the column chooser rather than starting from a curated set.
        defaultVisible: false,
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
    uiConfig,
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

    const columns: AnalyticsColumn[] = [];

    for (const { item: ptea, sectionLabel, subsectionLabel } of orderAttributesBySection(
        metadata.program,
        metadata.program.programTrackedEntityAttributes ?? [],
        uiConfig,
    )) {
        // For now, an attribute not in any programSection is simply
        // omitted rather than falling into an "Ungrouped Attributes"
        // bucket — revisit if/when there's a real place to put it.
        if (sectionLabel === undefined) continue;
        const tea =
            metadata.trackedEntityAttributes.get(
                ptea.trackedEntityAttribute.id,
            ) ?? ptea.trackedEntityAttribute;
        const section = sectionLabel;
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
                groupPath: subsectionLabel
                    ? ["Profile", section, subsectionLabel]
                    : ["Profile", section],
                canMeasure: valueKind === "number",
            }),
        );
    }

    for (const { item: psde, sectionLabel, subsectionLabel } of orderDataElementsBySection(
        mainStage,
        mainStage.programStageDataElements ?? [],
        uiConfig,
    )) {
        const de = metadata.dataElements.get(psde.dataElement.id) ?? psde.dataElement;
        // For now, a data element not in any programStageSection is simply
        // omitted rather than falling into an "Ungrouped" bucket.
        if (sectionLabel === undefined) continue;
        if (!sectionAllowed(sectionLabel)) continue;
        const section = sectionLabel;
        const valueKind = valueKindFromDhis2(de.valueType);
        columns.push(
            column({
                key: `parentEvent.dataValue.${de.id}`,
                label: labelFrom(de.name, de.formName, de.id),
                source: "parentEvent",
                sourceFieldId: de.id,
                valueKind,
                optionSetId: de.optionSet?.id,
                groupPath: subsectionLabel
                    ? [mainStage.name, section, subsectionLabel]
                    : [mainStage.name, section],
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
                    groupPath: [stage.name, "System"],
                    chooserKey: `childEvent.${stageId}.event`,
                    chooserLabel: "Event ID",
                }),
            );

            for (const { item: psde, sectionLabel, subsectionLabel } of orderDataElementsBySection(
                stage,
                stage.programStageDataElements ?? [],
                uiConfig,
            )) {
                const de =
                    metadata.dataElements.get(psde.dataElement.id) ??
                    psde.dataElement;
                // For now, a data element not in any programStageSection is
                // simply omitted rather than falling into an "Ungrouped" bucket.
                if (sectionLabel === undefined) continue;
                if (!sectionAllowed(sectionLabel)) continue;
                const section = sectionLabel;
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
                        groupPath: subsectionLabel
                            ? [stage.name, section, subsectionLabel]
                            : [stage.name, section],
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
            }),
        );

        for (const { item: psde, sectionLabel, subsectionLabel } of orderDataElementsBySection(
            stage,
            stage.programStageDataElements ?? [],
            uiConfig,
        )) {
            const de =
                metadata.dataElements.get(psde.dataElement.id) ??
                psde.dataElement;
            // For now, a data element not in any programStageSection is
            // simply omitted rather than falling into an "Ungrouped" bucket.
            if (sectionLabel === undefined) continue;
            if (!sectionAllowed(sectionLabel)) continue;
            const section = sectionLabel;
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
                    groupPath: subsectionLabel
                        ? ["Linked Parent", stage.name, section, subsectionLabel]
                        : ["Linked Parent", stage.name, section],
                    canMeasure: valueKind === "number",
                }),
            );
        }
    }

    // System/identifier columns last — they're implementation details users
    // rarely need and shouldn't compete with the record's actual data for
    // the front of the column list/chooser.
    columns.push(
        column({
            key: "trackedEntity.trackedEntity",
            label: "Record ID",
            source: "trackedEntity",
            sourceFieldId: "trackedEntity",
            valueKind: "string",
            groupPath: ["System IDs"],
        }),
        column({
            key: "enrollment.enrollment",
            label: "Enrollment ID",
            source: "enrollment",
            sourceFieldId: "enrollment",
            valueKind: "string",
            groupPath: ["System IDs"],
        }),
        column({
            key: "parentEvent.event",
            label: "Event ID",
            source: "parentEvent",
            sourceFieldId: "event",
            valueKind: "string",
            groupPath: ["System IDs"],
        }),
    );

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
        "Profile",
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
        "Enrollment",
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
        mainStage.name,
        {
            ...USER_FIELD_LABELS,
            occurredAt: mainStage.executionDateLabel ?? "Report Date",
        },
    );

    return columns;
}

function addSystemColumns(
    columns: AnalyticsColumn[],
    source: "trackedEntity" | "enrollment" | "parentEvent",
    fields: string[],
    groupName: string,
    labelOverrides: Record<string, string> = {},
) {
    for (const field of fields) {
        columns.push(
            column({
                key: `${source}.${field}`,
                label: labelOverrides[field] ?? field,
                source,
                sourceFieldId: field,
                valueKind: field.endsWith("At") ? "datetime" : "string",
                groupPath: [groupName, "System"],
            }),
        );
    }
}

function labelFrom(...candidates: Array<string | undefined>): string {
    for (const candidate of candidates) {
        const label = candidate?.trim();
        if (label) return label;
    }
    return "";
}
