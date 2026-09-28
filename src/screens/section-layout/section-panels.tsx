import { PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Input, List, Modal, Tag, Typography } from "antd";
import React from "react";

/** A section header's name popup, for adding one or renaming one. */
export function SectionNameModal({
    title,
    name,
    onNameChange,
    onOk,
    onCancel,
}: {
    title: string;
    /** null: closed. */
    name: string | null;
    onNameChange: (name: string) => void;
    onOk: () => void;
    onCancel: () => void;
}) {
    return (
        <Modal
            open={name !== null}
            title={title}
            onCancel={onCancel}
            onOk={onOk}
            okButtonProps={{ disabled: !name?.trim() }}
            destroyOnHidden
        >
            <Input
                autoFocus
                placeholder="Section name…"
                value={name ?? ""}
                onChange={(e) => onNameChange(e.target.value)}
                onPressEnter={onOk}
            />
        </Modal>
    );
}

export type SectionListItem = { id: string; name: string; stageName?: string };

/** The DHIS2 sections to pick from. */
export function SectionList({
    sections,
    selectedId,
    onSelect,
}: {
    sections: SectionListItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}) {
    return (
        <List
            bordered
            size="small"
            dataSource={sections}
            renderItem={(section) => (
                <List.Item
                    style={{
                        cursor: "pointer",
                        background: selectedId === section.id ? "#ede9fe" : undefined,
                        fontWeight: selectedId === section.id ? 600 : undefined,
                        padding: "8px 12px",
                    }}
                    onClick={() => onSelect(section.id)}
                >
                    <Flex vertical gap={0}>
                        <span>{section.name}</span>
                        {section.stageName && (
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                {section.stageName}
                            </Typography.Text>
                        )}
                    </Flex>
                </List.Item>
            )}
        />
    );
}

/** The section's elements not yet in the layout, each with "add". */
export function AvailableElements({
    elements,
    target,
    onAdd,
}: {
    elements: Array<{ id: string; label: string }>;
    /** The active section's name; null: before the first section. */
    target: string | null;
    onAdd: (id: string) => void;
}) {
    return (
        <div
            style={{
                width: 260,
                flexShrink: 0,
                border: "1px solid #f0f0f0",
                borderRadius: 6,
                padding: 12,
                background: "#fff",
                overflowY: "auto",
            }}
        >
            <Typography.Text strong>Available elements</Typography.Text>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
                Adds into:{" "}
                <Tag color={target !== null ? "purple" : "default"}>{target ?? "Before first section"}</Tag>
            </Typography.Paragraph>
            {elements.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="All elements added" />
            ) : (
                <Flex vertical gap={4}>
                    {elements.map((el) => (
                        <Flex
                            key={el.id}
                            justify="space-between"
                            align="center"
                            gap={8}
                            style={{ padding: "4px 8px", background: "#f5f5f5", borderRadius: 4 }}
                        >
                            <Typography.Text style={{ fontSize: 12 }} ellipsis={{ tooltip: el.label }}>
                                {el.label}
                            </Typography.Text>
                            <Button size="small" type="text" icon={<PlusOutlined />} onClick={() => onAdd(el.id)} />
                        </Flex>
                    ))}
                </Flex>
            )}
        </div>
    );
}
