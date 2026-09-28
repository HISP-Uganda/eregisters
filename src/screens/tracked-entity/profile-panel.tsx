import { CaretRightOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Collapse, Descriptions, Flex, Popconfirm, Typography } from "antd";
import React from "react";
import { FlattenedEnrollment, FlattenedTrackedEntity } from "../../schemas";
import { profileEntries } from "./client";

/** The client's attributes, with edit and delete. */
export function ProfilePanel({
    trackedEntity,
    enrollment,
    labels,
    onEdit,
    onDelete,
}: {
    trackedEntity: FlattenedTrackedEntity;
    enrollment: FlattenedEnrollment;
    labels: Map<string, string>;
    onEdit: () => void;
    onDelete: () => Promise<void>;
}) {
    const items = profileEntries(trackedEntity, enrollment, labels).map(
        ({ key, label, value }) => ({
            key,
            label,
            children: <Typography.Text>{value}</Typography.Text>,
        }),
    );

    return (
        <Collapse
            expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{ backgroundColor: "white" }}
            items={[
                {
                    key: "1",
                    label: "Person Profile",
                    children: <Descriptions bordered column={1} items={items} />,
                    extra: (
                        <Flex gap="small" align="center">
                            <Button icon={<EditOutlined />} size="small" onClick={onEdit}>
                                Edit
                            </Button>
                            <Popconfirm
                                title="Delete Client"
                                description="Are you sure you want to delete this client and all their visits? This cannot be undone."
                                okText="Delete"
                                okType="danger"
                                onConfirm={onDelete}
                            >
                                <Button danger icon={<DeleteOutlined />} size="small">
                                    Delete Client
                                </Button>
                            </Popconfirm>
                        </Flex>
                    ),
                },
            ]}
            styles={{ body: { padding: 0, margin: 0 } }}
        />
    );
}
