import { Card, Flex, Row } from "antd";
import React, { ReactNode } from "react";
import { FormLayoutItem, SectionStyle, SubsectionConfig } from "../schemas";

type Group<T> = {
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

export function SubsectionGroups<T extends { id: string }>({
    items,
    subsections,
    formLayout,
    getId,
    renderElement,
    sectionKey,
    hiddenFields,
    rowGutter = [16, 16],
}: {
    items: T[];
    subsections: SubsectionConfig[] | undefined;
    formLayout?: FormLayoutItem[] | undefined;
    getId: (item: T) => string;
    renderElement: (item: T, groupLength: number) => ReactNode;
    sectionKey: string;
    /**
     * IDs of fields the caller considers hidden — used only to decide whether
     * an *entire* subsection card should be dropped (when every one of its
     * children is in this set). Cell-level hiding is still delegated to the
     * caller's `renderElement`. `undefined` = no cards are dropped.
     */
    hiddenFields?: Iterable<string>;
    rowGutter?: [number, number];
}) {
    const hiddenSet = React.useMemo(
        () =>
            hiddenFields instanceof Set
                ? hiddenFields
                : new Set(hiddenFields ?? []),
        [hiddenFields],
    );
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
            {groups.map(({ label, items: groupItems, style }) => {
                const key = `${sectionKey}::${label ?? "__unassigned"}`;
                const row = (
                    <Row gutter={rowGutter}>
                        {groupItems.map((item) =>
                            renderElement(item, groupItems.length),
                        )}
                    </Row>
                );
                if (groupItems.length === 0) {
                    return null;
                }
                if (label === null) {
                    return <React.Fragment key={key}>{row}</React.Fragment>;
                }

                if (
                    hiddenSet.size > 0 &&
                    groupItems.every((a) => hiddenSet.has(a.id))
                ) {
                    return null;
                }
                const cardStyle: React.CSSProperties = {
                    borderRadius: 4,
                    borderColor: style?.borderColor,
                };
                const headerStyle: React.CSSProperties = {
                    background: style?.headerBg,
                    color: style?.titleColor,
                    borderBottomColor: style?.borderColor,
                };
                return (
                    <Card
                        key={key}
                        title={
                            <span
                                style={{
                                    color: style?.titleColor,
                                }}
                            >
                                {label}
                            </span>
                        }
                        type="inner"
                        size="small"
                        style={cardStyle}
                        styles={{ header: headerStyle }}
                    >
                        {row}
                    </Card>
                );
            })}
        </Flex>
    );
}
