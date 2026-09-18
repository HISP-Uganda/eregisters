import { Card, Flex, Row } from "antd";
import React, { ReactNode } from "react";
import { FormLayoutItem, SubsectionConfig } from "../schemas";
import { groupByLayout, groupBySubsections } from "../utils/subsection-grouping";
import { FORM_ROW_GUTTER } from "../utils/utils";

export { groupByLayout, groupBySubsections };

export function SubsectionGroups<T extends { id: string }>({
    items,
    subsections,
    formLayout,
    getId,
    renderElement,
    sectionKey,
    hiddenFields,
    rowGutter = FORM_ROW_GUTTER,
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
