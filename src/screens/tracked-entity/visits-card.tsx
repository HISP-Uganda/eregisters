import {
    CalendarOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SendOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Card, Flex, Popconfirm, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { SyncStatusComp } from "@/components/sync-status-comp";
import { SyncContext } from "@/machines/sync";
import { FlattenedEvent } from "@/schemas";

function renderTags(text: string | string[] | undefined, color: string) {
    if (!text) return null;
    const tags = Array.isArray(text) ? text : text.split(",");
    return (
        <Flex gap="small" align="center" wrap>
            {tags.map((tag) => (
                <Tag key={tag} color={color}>
                    {tag.toUpperCase()}
                </Tag>
            ))}
        </Flex>
    );
}

type VisitHandlers = {
    onOpen: (visit: FlattenedEvent) => void;
    onResend: (visit: FlattenedEvent) => Promise<void>;
    onDelete: (visit: FlattenedEvent) => Promise<void>;
};

function VisitActions({ visit, onOpen, onResend, onDelete }: VisitHandlers & { visit: FlattenedEvent }) {
    return (
        <Flex
            gap="small"
            align="center"
            // The row itself is clickable (see the Table's `onRow`) — stop
            // the click here so these buttons don't also open the visit.
            onClick={(e) => e.stopPropagation()}
        >
            <Button icon={<EditOutlined />} onClick={() => onOpen(visit)}>
                Edit
            </Button>
            {(visit.syncStatus === "synced" || visit.syncStatus === "failed") && (
                <Popconfirm
                    title="Resend visit"
                    description="Resend this visit and all its child events to DHIS2 with their current values?"
                    okText="Resend"
                    onConfirm={() => onResend(visit)}
                >
                    <Button icon={<SendOutlined />}>Resend</Button>
                </Popconfirm>
            )}
            <Popconfirm
                title="Delete Event"
                description="Are you sure you want to delete this event? This will sync the deletion to DHIS2."
                okText="Delete"
                okType="danger"
                onConfirm={() => onDelete(visit)}
            >
                <Button danger icon={<DeleteOutlined />}>
                    Delete
                </Button>
            </Popconfirm>
        </Flex>
    );
}

function visitColumns(handlers: VisitHandlers): TableProps<FlattenedEvent>["columns"] {
    return [
        {
            title: "Visit Date",
            dataIndex: ["dataValues", "occurredAt"],
            key: "date",
            render: (date) => dayjs(date).format("MMM DD, YYYY"),
        },
        {
            title: "Services",
            dataIndex: ["dataValues", "mrKZWf2WMIC"],
            key: "services",
            render: (text) => renderTags(text, "blue"),
            width: "300px",
        },
        {
            title: "Immunization",
            dataIndex: ["dataValues", "ZuYU54N4pjS"],
            key: "immunization",
            render: (text) => renderTags(text, "green"),
            width: "300px",
        },
        { title: "Referral", dataIndex: ["dataValues", "EzGu4kzZZTz"], key: "referral" },
        { title: "Weight", dataIndex: ["dataValues", "scpPwoNsS27"], key: "weight" },
        { title: "Height", dataIndex: ["dataValues", "uIFJ94mZt0S"], key: "height" },
        {
            title: "Sync Status",
            dataIndex: "syncStatus",
            key: "syncStatus",
            width: 120,
            render: (text) => <SyncStatusComp syncStatus={text} />,
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, visit) => <VisitActions visit={visit} {...handlers} />,
        },
    ];
}

/** The client's visits: a table with open, resend and delete, and "Add new visit". */
export function VisitsCard({
    visits,
    onAdd,
    ...handlers
}: VisitHandlers & {
    visits: FlattenedEvent[];
    onAdd: () => void;
}) {
    const connectivityStatus = SyncContext.useSelector(
        (a) => a.context.connectivityStatus,
    );
    const { onOpen, onResend, onDelete } = handlers;
    const columns = useMemo(
        () => visitColumns({ onOpen, onResend, onDelete }),
        [onOpen, onResend, onDelete],
    );

    return (
        <Card
            title={
                <Space>
                    <CalendarOutlined />
                    <span>Client Visits</span>
                    {connectivityStatus === "offline" && <Tag color="red">Offline</Tag>}
                    {connectivityStatus === "degraded" && (
                        <Tag color="orange">Server slow — retrying</Tag>
                    )}
                </Space>
            }
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                    Add new visit
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={visits}
                pagination={false}
                rowKey="event"
                scroll={{ x: "max-content" }}
                onRow={(visit) => ({
                    onClick: () => onOpen(visit),
                    style: { cursor: "pointer" },
                })}
            />
        </Card>
    );
}
