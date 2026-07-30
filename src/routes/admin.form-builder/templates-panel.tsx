import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, List, Popconfirm, Space, Typography } from "antd";
import React from "react";
import type { FormConfigDoc } from "../../form-configs/v2-types";
import { attachTemplate, deleteTemplate, renameTemplate } from "./reducers";

export function TemplatesPanel({
    doc,
    formId,
    tabKey,
    editingTemplateId,
    onChange,
    onEditTemplate,
}: {
    doc: FormConfigDoc;
    formId: string | null;
    tabKey: string | null;
    editingTemplateId: string | null;
    onChange: (next: FormConfigDoc) => void;
    onEditTemplate: (templateId: string | null) => void;
}) {
    const templateIds = Object.keys(doc.templates);
    return (
        <div
            style={{
                width: 300,
                flexShrink: 0,
                borderLeft: "1px solid #f0f0f0",
                padding: 12,
                overflowY: "auto",
            }}
        >
            <Typography.Text strong>Templates</Typography.Text>
            {templateIds.length === 0 ? (
                <Empty description="No templates yet — extract a section to make one." />
            ) : (
                <List
                    size="small"
                    dataSource={templateIds}
                    renderItem={(id) => {
                        const isEditing = editingTemplateId === id;
                        return (
                            <List.Item
                                style={
                                    isEditing
                                        ? {
                                              background: "#f5f3ff",
                                              borderLeft: "3px solid #7c3aed",
                                              paddingLeft: 8,
                                          }
                                        : undefined
                                }
                            >
                                <Flex
                                    vertical
                                    gap={4}
                                    style={{ width: "100%" }}
                                >
                                    <Flex justify="space-between" gap={4}>
                                        <Flex vertical gap={0}>
                                            <span>
                                                {doc.templates[id].title || id}
                                            </span>
                                            <Typography.Text
                                                type="secondary"
                                                style={{ fontSize: 11 }}
                                            >
                                                {id}
                                            </Typography.Text>
                                        </Flex>
                                    </Flex>
                                    <Space size={4} wrap>
                                        <Button
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() =>
                                                onEditTemplate(
                                                    isEditing ? null : id,
                                                )
                                            }
                                        >
                                            {isEditing ? "Stop" : "Edit"}
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                const next =
                                                    window.prompt(
                                                        "Template title",
                                                        doc.templates[id]
                                                            .title,
                                                    );
                                                if (next !== null)
                                                    onChange(
                                                        renameTemplate(
                                                            doc,
                                                            id,
                                                            next,
                                                        ),
                                                    );
                                            }}
                                        >
                                            Rename
                                        </Button>
                                        {formId && tabKey && (
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    onChange(
                                                        attachTemplate(
                                                            doc,
                                                            formId,
                                                            tabKey,
                                                            id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Insert
                                            </Button>
                                        )}
                                        <Popconfirm
                                            title="Delete template?"
                                            description="Refs to this template in any form will render as empty."
                                            okType="danger"
                                            onConfirm={() => {
                                                if (isEditing)
                                                    onEditTemplate(null);
                                                onChange(
                                                    deleteTemplate(doc, id),
                                                );
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                            />
                                        </Popconfirm>
                                    </Space>
                                </Flex>
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );
}
