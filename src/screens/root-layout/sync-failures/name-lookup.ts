import type { useMetadata } from "../../../hooks/useMetadata";

type Metadata = Pick<
    ReturnType<typeof useMetadata>,
    "program" | "dataElements" | "trackedEntityAttributes" | "optionSets"
>;

/**
 * Readable names for the ids DHIS2 puts in its sync errors (data
 * elements, attributes, options, option sets, stages and sections), so
 * `humanizeSyncError` can say "Attribute: Surname" instead of an id. An
 * option set also says which fields use it.
 */
export function buildNameLookup({ program, dataElements, trackedEntityAttributes, optionSets }: Metadata) {
    const names = new Map<string, string>();
    const optionSetNames = new Map<string, string>();
    const optionSetUsers = new Map<string, Set<string>>();
    const noteUser = (optionSetId: string, user: string) => {
        const users = optionSetUsers.get(optionSetId) ?? new Set<string>();
        users.add(user);
        optionSetUsers.set(optionSetId, users);
    };

    for (const de of dataElements.values()) {
        const deName = de.formName || de.name;
        names.set(de.id, `Data element: ${deName}`);
        if (de.optionSet) {
            optionSetNames.set(de.optionSet.id, de.optionSet.name);
            noteUser(de.optionSet.id, deName);
        }
    }
    for (const tea of trackedEntityAttributes.values()) {
        const teaName = tea.displayFormName || tea.name;
        names.set(tea.id, `Attribute: ${teaName}`);
        if (tea.optionSet) {
            optionSetNames.set(tea.optionSet.id, tea.optionSet.name);
            noteUser(tea.optionSet.id, teaName);
        }
    }
    for (const ptea of program?.programTrackedEntityAttributes ?? []) {
        const id = ptea.trackedEntityAttribute.id;
        const tea = trackedEntityAttributes.get(id);
        if (!names.has(id) && tea) names.set(id, `Attribute: ${tea.displayFormName || tea.name}`);
    }
    for (const [optionSetId, options] of optionSets.entries()) {
        const optionSetName =
            options.find((o) => o.optionSetName)?.optionSetName ?? optionSetNames.get(optionSetId);
        if (optionSetName) optionSetNames.set(optionSetId, optionSetName);
        for (const opt of options) {
            names.set(opt.id, optionSetName ? `${opt.name} (${optionSetName})` : opt.name);
        }
    }
    for (const [optionSetId, name] of optionSetNames.entries()) {
        const users = optionSetUsers.get(optionSetId);
        names.set(optionSetId, users && users.size > 0 ? `${name} — used by ${Array.from(users).join(", ")}` : name);
    }
    for (const stage of program?.programStages ?? []) {
        names.set(stage.id, stage.name);
        for (const section of stage.programStageSections ?? []) {
            names.set(section.id, section.displayName || section.name);
        }
    }
    return names;
}
