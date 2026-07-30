import { Button, Empty, Flex, List, Typography } from "antd";
import React from "react";
import type { FormConfigDoc } from "../../form-configs/v2-types";
import { attachTemplate } from "./reducers";

export function TemplatesPanel({
    doc,
    formId,
    tabKey,
    onChange,
}: {
    doc: FormConfigDoc;
    formId: string | null;
    tabKey: string | null;
    onChange: (next: FormConfigDoc) => void;
}) {
    const templateIds = Object.keys(doc.templates);
    return (
        <div
            style={{
                width: 280,
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
                    renderItem={(id) => (
                        <List.Item
                            actions={[
                                formId && tabKey ? (
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
                                ) : null,
                            ]}
                        >
                            <Flex vertical gap={0}>
                                <span>{doc.templates[id].title || id}</span>
                                <Typography.Text
                                    type="secondary"
                                    style={{ fontSize: 11 }}
                                >
                                    {id}
                                </Typography.Text>
                            </Flex>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
}
