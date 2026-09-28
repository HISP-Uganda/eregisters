import { FormLayoutItem, SectionStyle, SubsectionConfig, UIConfig } from "../../schemas";

/**
 * A section's form layout: an ordered list of section headers and the
 * elements under them. Elements before the first header form the "root"
 * group. Every function here returns a new list.
 */
export type Layout = FormLayoutItem[];

/** A header and the elements under it (`sectionId` null: the root group). */
export type LayoutGroup = {
    sectionId: string | null;
    sectionName: string | null;
    /** The header's position in the layout. */
    sectionIndex: number | null;
    sectionStyle: SectionStyle;
    elements: Array<{ id: string; index: number }>;
};

export function subsectionsToLayout(subs: SubsectionConfig[]): Layout {
    return subs.flatMap((sub) => [
        { kind: "section" as const, id: sub.id, name: sub.name },
        ...sub.dataElementIds.map((id) => ({ kind: "element" as const, id })),
    ]);
}

/** The older `subsections` form of a layout (headers lose their colours). */
export function layoutToSubsections(layout: Layout): SubsectionConfig[] {
    const subs: SubsectionConfig[] = [];
    let current: SubsectionConfig | null = null;
    for (const step of layout) {
        if (step.kind === "section") {
            current = { id: step.id, name: step.name, dataElementIds: [] };
            subs.push(current);
        } else if (current) {
            current.dataElementIds.push(step.id);
        }
    }
    return subs;
}

/** A section's saved layout, from `formLayouts` or else the older `subsections`. */
export function savedLayout(uiConfig: UIConfig, sectionId: string | null): Layout {
    if (!sectionId) return [];
    const existing = uiConfig.formLayouts?.[sectionId];
    if (existing && existing.length > 0) return JSON.parse(JSON.stringify(existing));
    const legacy = uiConfig.subsections[sectionId];
    if (legacy && legacy.length > 0) return subsectionsToLayout(legacy);
    return [];
}

export function layoutGroups(layout: Layout): LayoutGroup[] {
    let current: LayoutGroup = {
        sectionId: null,
        sectionName: null,
        sectionIndex: null,
        sectionStyle: {},
        elements: [],
    };
    const groups = [current];
    layout.forEach((step, index) => {
        if (step.kind === "section") {
            current = {
                sectionId: step.id,
                sectionName: step.name,
                sectionIndex: index,
                sectionStyle: {
                    titleColor: step.titleColor,
                    headerBg: step.headerBg,
                    borderColor: step.borderColor,
                },
                elements: [],
            };
            groups.push(current);
        } else {
            current.elements.push({ id: step.id, index });
        }
    });
    return groups;
}

/** Where the section starting at `start` ends (the next header, or the end). */
function sectionEnd(layout: Layout, start: number): number {
    let end = start + 1;
    while (end < layout.length && layout[end].kind !== "section") end++;
    return end;
}

/**
 * Adds an element at the end of the active section — or, with none
 * active (or it's gone), before the first section.
 */
export function withElementAdded(layout: Layout, id: string, activeSectionId: string | null): Layout {
    let insertAt: number;
    if (activeSectionId === null) {
        const firstSection = layout.findIndex((s) => s.kind === "section");
        insertAt = firstSection === -1 ? layout.length : firstSection;
    } else {
        const start = layout.findIndex((s) => s.kind === "section" && s.id === activeSectionId);
        insertAt = start === -1 ? layout.length : sectionEnd(layout, start);
    }
    const next = [...layout];
    next.splice(insertAt, 0, { kind: "element", id });
    return next;
}

/**
 * Removes one item. Removing a header drops only the header — its
 * elements join the group before it.
 */
export function withoutItem(layout: Layout, index: number): Layout {
    return layout.filter((_, i) => i !== index);
}

export function withSectionStyle(layout: Layout, start: number, patch: Partial<SectionStyle>): Layout {
    return layout.map((item, i) => (i === start && item.kind === "section" ? { ...item, ...patch } : item));
}

export function withSectionRenamed(layout: Layout, start: number, name: string): Layout {
    return layout.map((item, i) => (i === start && item.kind === "section" ? { ...item, name } : item));
}

export function withSectionInserted(layout: Layout, at: number, id: string, name: string): Layout {
    const next = [...layout];
    next.splice(at, 0, { kind: "section", id, name });
    return next;
}

/** Moves an element one place, never across a header (that would change its section). */
export function withElementMoved(layout: Layout, index: number, delta: -1 | 1): Layout {
    const target = index + delta;
    if (target < 0 || target >= layout.length) return layout;
    if (layout[target].kind === "section") return layout;
    const next = [...layout];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
}

/** Swaps a section (header and elements) with the section above or below. */
export function withSectionMoved(layout: Layout, start: number, delta: -1 | 1): Layout {
    const end = sectionEnd(layout, start);
    const block = layout.slice(start, end);
    if (delta === -1) {
        let prevStart = start - 1;
        while (prevStart >= 0 && layout[prevStart].kind !== "section") prevStart--;
        if (prevStart < 0) return layout; // already the first section
        return [
            ...layout.slice(0, prevStart),
            ...block,
            ...layout.slice(prevStart, start),
            ...layout.slice(end),
        ];
    }
    if (end >= layout.length) return layout; // already the last section
    const nextEnd = sectionEnd(layout, end);
    return [...layout.slice(0, start), ...layout.slice(end, nextEnd), ...block, ...layout.slice(nextEnd)];
}

/** Where "insert section after" puts a new header for this group. */
export function afterGroup(layout: Layout, group: LayoutGroup): number {
    return group.sectionIndex === null ? group.elements.length : sectionEnd(layout, group.sectionIndex);
}

/** The positions (in `groups`) of the first and last real sections. */
export function sectionBounds(groups: LayoutGroup[]) {
    const first = groups.findIndex((g) => g.sectionId !== null);
    let last = -1;
    for (let i = groups.length - 1; i >= 0; i--) {
        if (groups[i].sectionId !== null) {
            last = i;
            break;
        }
    }
    return { first, last };
}
