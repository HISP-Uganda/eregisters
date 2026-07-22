import { Card, Flex, Row } from "antd";
import React, { ReactNode } from "react";
import { FormLayoutItem, SubsectionConfig } from "../schemas";

export function groupByLayout<T>(
    items: T[],
    layout: FormLayoutItem[],
    getId: (item: T) => string,
): Array<{ label: string | null; items: T[] }> {
    const itemsById = new Map(items.map((item) => [getId(item), item]));
    const used = new Set<string>();
    const groups: Array<{ label: string | null; items: T[] }> = [];
    let current: { label: string | null; items: T[] } = {
        label: null,
        items: [],
    };
    groups.push(current);
    for (const step of layout) {
        if (step.kind === "section") {
            current = { label: step.name, items: [] };
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
): Array<{ label: string | null; items: T[] }> {
    if (!subsections || subsections.length === 0) {
        return items.length === 0 ? [] : [{ label: null, items }];
    }
    const itemsById = new Map(items.map((item) => [getId(item), item]));
    const assignedIds = new Set(subsections.flatMap((s) => s.dataElementIds));
    const groups: Array<{ label: string | null; items: T[] }> = subsections.map(
        (sub) => ({
            label: sub.name,
            items: sub.dataElementIds
                .map((id) => itemsById.get(id))
                .filter((x): x is T => x !== undefined),
        }),
    );
    const unassigned = items.filter((item) => !assignedIds.has(getId(item)));
    if (unassigned.length > 0) {
        groups.push({ label: null, items: unassigned });
    }
    return groups.filter((g) => g.items.length > 0);
}

export function SubsectionGroups<T>({
    items,
    subsections,
    formLayout,
    getId,
    renderElement,
    sectionKey,
    rowGutter = [16, 16],
}: {
    items: T[];
    subsections: SubsectionConfig[] | undefined;
    formLayout?: FormLayoutItem[] | undefined;
    getId: (item: T) => string;
    renderElement: (item: T, groupLength: number) => ReactNode;
    sectionKey: string;
    rowGutter?: [number, number];
}) {
    const groups =
        formLayout && formLayout.length > 0
            ? groupByLayout(items, formLayout, getId)
            : groupBySubsections(items, subsections, getId);
    if (groups.length === 0) return null;
    const hasSubsections = groups.some((g) => g.label !== null);
    if (!hasSubsections) {
        const { items: groupItems } = groups[0];
        return (
            <Row gutter={rowGutter}>
                {groupItems.map((item) =>
                    renderElement(item, groupItems.length),
                )}
            </Row>
        );
    }
    return (
        <Flex vertical gap={12}>
            {groups.map(({ label, items: groupItems }) => {
                const key = `${sectionKey}::${label ?? "__unassigned"}`;
                const row = (
                    <Row gutter={rowGutter}>
                        {groupItems.map((item) =>
                            renderElement(item, groupItems.length),
                        )}
                    </Row>
                );
                if (label === null) {
                    return <React.Fragment key={key}>{row}</React.Fragment>;
                }
                return (
                    <Card
                        key={key}
                        title={label}
                        type="inner"
                        size="small"
                        style={{ borderRadius: 4 }}
                    >
                        {row}
                    </Card>
                );
            })}
        </Flex>
    );
}
