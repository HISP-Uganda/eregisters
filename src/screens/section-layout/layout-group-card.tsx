import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CaretRightOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    FolderAddOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Tag, Tooltip, Typography } from "antd";
import React from "react";
import { SectionStyle } from "@/schemas";
import { LayoutGroup } from "./layout";
import { SectionColors } from "./section-colors";

type SectionActions = {
    onRename: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onInsertAfter: () => void;
    onStyleChange: (patch: Partial<SectionStyle>) => void;
};

type ElementActions = {
    onMoveElement: (index: number, delta: -1 | 1) => void;
    onRemoveElement: (index: number) => void;
};

const iconButton = (title: string, icon: React.ReactNode, onClick: () => void, extra: object = {}) => (
    <Tooltip title={title}>
        <Button type="text" size="small" icon={icon} onClick={onClick} {...extra} />
    </Tooltip>
);

function SectionHeaderActions({
    group,
    isFirstSection,
    isLastSection,
    actions,
}: {
    group: LayoutGroup;
    isFirstSection: boolean;
    isLastSection: boolean;
    actions: SectionActions;
}) {
    return (
        <Flex gap={2} onClick={(e) => e.stopPropagation()} role="group">
            {iconButton("Move section up", <ArrowUpOutlined />, actions.onMoveUp, { disabled: isFirstSection })}
            {iconButton("Move section down", <ArrowDownOutlined />, actions.onMoveDown, { disabled: isLastSection })}
            {iconButton("Rename section", <EditOutlined />, actions.onRename)}
            <SectionColors style={group.sectionStyle} onChange={actions.onStyleChange} />
            {iconButton("Insert section after this", <FolderAddOutlined />, actions.onInsertAfter)}
            {iconButton("Remove section (elements move up)", <DeleteOutlined />, actions.onDelete, { danger: true })}
        </Flex>
    );
}

function GroupTitle({
    group,
    isActive,
    isCollapsed,
    onToggleCollapse,
}: {
    group: LayoutGroup;
    isActive: boolean;
    isCollapsed: boolean;
    onToggleCollapse?: () => void;
}) {
    if (group.sectionId === null) {
        return (
            <Flex align="center" gap={8}>
                <Typography.Text type="secondary" italic>
                    Before first section
                </Typography.Text>
            </Flex>
        );
    }
    const count = group.elements.length;
    return (
        <Flex align="center" gap={8}>
            {onToggleCollapse && (
                <Button
                    type="text"
                    size="small"
                    icon={isCollapsed ? <CaretRightOutlined /> : <DownOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleCollapse();
                    }}
                    style={{ marginLeft: -6 }}
                />
            )}
            <Tag color={isActive ? "purple" : "default"}>Section</Tag>
            <Typography.Text strong style={{ color: group.sectionStyle.titleColor }}>
                {group.sectionName}
            </Typography.Text>
            {isActive && (
                <Tag color="green" style={{ marginLeft: 4 }}>
                    Active
                </Tag>
            )}
            {isCollapsed && (
                <Tag style={{ marginLeft: 4 }}>
                    {count} element{count === 1 ? "" : "s"}
                </Tag>
            )}
        </Flex>
    );
}

function GroupElements({
    group,
    labels,
    actions,
}: {
    group: LayoutGroup;
    labels: Map<string, string>;
    actions: ElementActions;
}) {
    if (group.elements.length === 0) {
        return (
            <Typography.Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                No elements yet — select this section, then click <PlusOutlined /> on an available
                element to add here.
            </Typography.Text>
        );
    }
    const small = { height: 18, width: 24 };
    return (
        <Flex vertical gap={4} onClick={(e) => e.stopPropagation()}>
            {group.elements.map((el, position) => {
                const label = labels.get(el.id) ?? `Unknown element (${el.id})`;
                return (
                    <Flex
                        key={`${el.id}-${el.index}`}
                        align="center"
                        gap={8}
                        style={{ padding: "4px 8px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: 4 }}
                    >
                        <Flex vertical gap={0}>
                            <Button
                                type="text"
                                size="small"
                                icon={<ArrowUpOutlined />}
                                disabled={position === 0}
                                onClick={() => actions.onMoveElement(el.index, -1)}
                                style={small}
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<ArrowDownOutlined />}
                                disabled={position === group.elements.length - 1}
                                onClick={() => actions.onMoveElement(el.index, 1)}
                                style={small}
                            />
                        </Flex>
                        <Typography.Text style={{ flex: 1, minWidth: 0 }} ellipsis={{ tooltip: label }}>
                            {label}
                        </Typography.Text>
                        {iconButton("Remove element", <DeleteOutlined />, () => actions.onRemoveElement(el.index), {
                            danger: true,
                        })}
                    </Flex>
                );
            })}
        </Flex>
    );
}

/** One group of the layout: a section header (or the root) and its elements. */
export function LayoutGroupCard({
    group,
    isActive,
    isCollapsed,
    onToggleCollapse,
    isFirstSection,
    isLastSection,
    labels,
    onSelect,
    sectionActions,
    elementActions,
}: {
    group: LayoutGroup;
    isActive: boolean;
    isCollapsed: boolean;
    onToggleCollapse?: () => void;
    isFirstSection: boolean;
    isLastSection: boolean;
    labels: Map<string, string>;
    onSelect: () => void;
    sectionActions: SectionActions;
    elementActions: ElementActions;
}) {
    const isRoot = group.sectionId === null;
    const { borderColor, headerBg } = group.sectionStyle;
    return (
        <Card
            size="small"
            onClick={onSelect}
            style={{
                cursor: "pointer",
                borderColor: borderColor ?? (isActive ? "#7c3aed" : isRoot ? "#d9d9d9" : "#c4b5fd"),
                borderWidth: isActive ? 2 : 1,
                background: isRoot ? "#fff" : isActive ? "#f5f3ff" : "#faf5ff",
            }}
            title={
                <GroupTitle
                    group={group}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={onToggleCollapse}
                />
            }
            extra={
                !isRoot && (
                    <SectionHeaderActions
                        group={group}
                        isFirstSection={isFirstSection}
                        isLastSection={isLastSection}
                        actions={sectionActions}
                    />
                )
            }
            styles={{
                ...(headerBg ? { header: { background: headerBg, borderBottomColor: borderColor } } : {}),
                ...(isCollapsed ? { body: { display: "none" } } : {}),
            }}
        >
            <GroupElements group={group} labels={labels} actions={elementActions} />
        </Card>
    );
}
