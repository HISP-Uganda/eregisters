import type { FormLayoutItem, SectionStyle, SubsectionConfig } from "../schemas";

/**
 * Pure grouping logic shared between `components/subsection-groups.tsx`
 * (renders these groups as UI cards) and `analytics/column-registry.ts`
 * (uses them to order/label line-list columns) — kept in a plain .ts
 * module, not the .tsx component file, so the analytics layer (tested
 * under `environment: "node"`, no DOM) never has to import antd/React.
 */
export type Group<T> = {
    label: string | null;
    items: T[];
    style?: SectionStyle;
};

export function groupByLayout<T>(
    items: T[],
    layout: FormLayoutItem[],
    getId: (item: T) => string,
): Array<Group<T>> {
    const itemsById = new Map(items.map((item) => [getId(item), item]));
    const used = new Set<string>();
    const groups: Array<Group<T>> = [];
    let current: Group<T> = {
        label: null,
        items: [],
    };
    groups.push(current);
    for (const step of layout) {
        if (step.kind === "section") {
            current = {
                label: step.name,
                items: [],
                style: {
                    titleColor: step.titleColor,
                    headerBg: step.headerBg,
                    borderColor: step.borderColor,
                },
            };
            groups.push(current);
        } else {
            const item = itemsById.get(step.id);
            if (item !== undefined && !used.has(step.id)) {
                current.items.push(item);
                used.add(step.id);
            }
        }
    }
    // Trailing group: any items not referenced in layout get appended as
    // unassigned (so admins never accidentally hide a newly-added element).
    const leftovers = items.filter((item) => !used.has(getId(item)));
    if (leftovers.length > 0) {
        if (current.label === null) {
            current.items.push(...leftovers);
        } else {
            groups.push({ label: null, items: leftovers });
        }
    }
    return groups.filter((g) => g.items.length > 0);
}

export function groupBySubsections<T>(
    items: T[],
    subsections: SubsectionConfig[] | undefined,
    getId: (item: T) => string,
): Array<Group<T>> {
    if (!subsections || subsections.length === 0) {
        return items.length === 0 ? [] : [{ label: null, items }];
    }
    const itemsById = new Map(items.map((item) => [getId(item), item]));
    const assignedIds = new Set(subsections.flatMap((s) => s.dataElementIds));
    const groups: Array<Group<T>> = subsections.map((sub) => ({
        label: sub.name,
        items: sub.dataElementIds
            .map((id) => itemsById.get(id))
            .filter((x): x is T => x !== undefined),
    }));
    const unassigned = items.filter((item) => !assignedIds.has(getId(item)));
    if (unassigned.length > 0) {
        groups.push({ label: null, items: unassigned });
    }
    return groups.filter((g) => g.items.length > 0);
}
