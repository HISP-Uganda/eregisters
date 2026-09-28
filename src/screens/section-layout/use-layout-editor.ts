import { useDataEngine } from "@dhis2/app-runtime";
import { saveToDataStore } from "../../db/app-data-store";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useMetadataStore } from "../../hooks/useMetadataStore";
import { useUIConfig } from "../../hooks/useUIConfig";
import { SectionStyle } from "../../schemas";
import {
    Layout,
    layoutGroups,
    layoutToSubsections,
    savedLayout,
    withElementAdded,
    withElementMoved,
    withoutItem,
    withSectionInserted,
    withSectionMoved,
    withSectionRenamed,
    withSectionStyle,
} from "./layout";

/**
 * The layout being edited for one section: loaded from the UI config when
 * the section changes, edited in memory, saved to the dataStore's
 * `ui-config` (and the local copy) on Save.
 */
export function useLayoutEditor(sectionId: string | null) {
    const uiConfig = useUIConfig();
    const engine = useDataEngine();
    const metadataStore = useMetadataStore();
    const [layout, setLayout] = useState<Layout>([]);
    /** The section new elements go into; null: before the first section. */
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    /** The one section shown open; the others show a count. */
    const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setActiveSectionId(null);
        setExpandedSectionId(null);
        setLayout(savedLayout(uiConfig, sectionId));
    }, [sectionId, uiConfig.formLayouts, uiConfig.subsections]);

    const groups = useMemo(() => layoutGroups(layout), [layout]);

    // The active section was removed: fall back to "before the first section".
    useEffect(() => {
        if (activeSectionId === null) return;
        if (!groups.some((g) => g.sectionId === activeSectionId)) setActiveSectionId(null);
    }, [activeSectionId, groups]);

    const edit = (change: (layout: Layout) => Layout) => setLayout(change);

    async function save() {
        if (!sectionId) return;
        setSaving(true);
        try {
            const updated = {
                ...uiConfig,
                formLayouts: { ...(uiConfig.formLayouts ?? {}), [sectionId]: layout },
                subsections: { ...uiConfig.subsections, [sectionId]: layoutToSubsections(layout) },
            };
            await saveToDataStore(engine, "ui-config", updated);
            await metadataStore.putRow("ui_config", { id: "main", config: updated });
            message.success("Form layout saved");
        } catch {
            message.error("Failed to save form layout");
        } finally {
            setSaving(false);
        }
    }

    return {
        layout,
        groups,
        activeSectionId,
        setActiveSectionId,
        expandedSectionId,
        toggleExpanded: (id: string) => setExpandedSectionId((prev) => (prev === id ? null : id)),
        collapseAll: () => setExpandedSectionId(null),
        saving,
        save,
        addElement: (id: string) => edit((l) => withElementAdded(l, id, activeSectionId)),
        removeItem: (index: number) => edit((l) => withoutItem(l, index)),
        moveElement: (index: number, delta: -1 | 1) => edit((l) => withElementMoved(l, index, delta)),
        moveSection: (start: number, delta: -1 | 1) => edit((l) => withSectionMoved(l, start, delta)),
        styleSection: (start: number, patch: Partial<SectionStyle>) =>
            edit((l) => withSectionStyle(l, start, patch)),
        renameSection: (start: number, name: string) => edit((l) => withSectionRenamed(l, start, name)),
        insertSection: (at: number, name: string) =>
            edit((l) => withSectionInserted(l, at, crypto.randomUUID(), name)),
    };
}

export type LayoutEditor = ReturnType<typeof useLayoutEditor>;
