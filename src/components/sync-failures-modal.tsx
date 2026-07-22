import { CloudUploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { Button, Empty, Modal, Space, Table, Tabs, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";
import { useMetadata } from "../hooks/useMetadata";
import { SyncContext } from "../machines/sync";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../schemas";

const { Text, Paragraph } = Typography;

function ErrorCell({ error }: { error?: string | null }) {
    if (!error) return <Text type="secondary">—</Text>;
    return (
        <Paragraph
            copyable={{ text: error }}
            style={{
                marginBottom: 0,
                whiteSpace: "pre-wrap",
                color: "#ff4d4f",
                fontSize: 12,
            }}
        >
            {error}
        </Paragraph>
    );
}

function LastAttemptCell({ ts }: { ts?: string }) {
    if (!ts) return <Text type="secondary">—</Text>;
    return (
        <Text style={{ fontSize: 12 }} type="secondary">
            {dayjs(ts).fromNow()}
        </Text>
    );
}

export function SyncFailuresModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const syncActor = SyncContext.useActorRef();
    const { program } = useMetadata();

    const displayAttributeIds = useMemo(
        () =>
            program.programTrackedEntityAttributes
                .filter((ptea) => ptea.displayInList)
                .slice(0, 2)
                .map((ptea) => ptea.trackedEntityAttribute.id),
        [program],
    );

    const stageNames = useMemo(
        () =>
            new Map(program.programStages.map((s) => [s.id, s.name] as const)),
        [program],
    );

    const { data: failedTEs = [] } = useLiveSuspenseQuery((q) =>
        q
            .from({ trackedEntities: trackedEntitiesCollection })
            .where(({ trackedEntities }) =>
                eq(trackedEntities.syncStatus, "failed"),
            ),
    );
    const { data: failedEnrollments = [] } = useLiveSuspenseQuery((q) =>
        q
            .from({ enrollments: enrollmentsCollection })
            .where(({ enrollments }) => eq(enrollments.syncStatus, "failed")),
    );
    const { data: failedEvents = [] } = useLiveSuspenseQuery((q) =>
        q
            .from({ events: eventsCollection })
            .where(({ events }) => eq(events.syncStatus, "failed")),
    );

    const teColumns: ColumnsType<FlattenedTrackedEntity> = [
        {
            title: "Client",
            key: "identity",
            render: (_, r) => {
                const parts = displayAttributeIds
                    .map((id) => r.attributes?.[id])
                    .filter(Boolean);
                return (
                    <Space direction="vertical" size={0}>
                        <Text strong>{parts.join(" ") || "—"}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {r.trackedEntity}
                        </Text>
                    </Space>
                );
            },
        },
        {
            title: "Error",
            key: "error",
            render: (_, r) => <ErrorCell error={r.syncError} />,
        },
        {
            title: "Last attempt",
            key: "lastSynced",
            width: 140,
            render: (_, r) => <LastAttemptCell ts={r.lastSynced} />,
        },
    ];

    const enrollmentColumns: ColumnsType<FlattenedEnrollment> = [
        {
            title: "Enrollment",
            key: "identity",
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{r.enrollment}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        Client {r.trackedEntity}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Error",
            key: "error",
            render: (_, r) => <ErrorCell error={r.syncError} />,
        },
        {
            title: "Last attempt",
            key: "lastSynced",
            width: 140,
            render: (_, r) => <LastAttemptCell ts={r.lastSynced} />,
        },
    ];

    const eventColumns: ColumnsType<FlattenedEvent> = [
        {
            title: "Event",
            key: "identity",
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Text strong>
                        {stageNames.get(r.programStage) ?? r.programStage}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {r.event}
                        {r.occurredAt
                            ? ` · ${dayjs(r.occurredAt).format("YYYY-MM-DD")}`
                            : ""}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Error",
            key: "error",
            render: (_, r) => <ErrorCell error={r.syncError} />,
        },
        {
            title: "Last attempt",
            key: "lastSynced",
            width: 140,
            render: (_, r) => <LastAttemptCell ts={r.lastSynced} />,
        },
    ];

    const totalFailures =
        failedTEs.length + failedEnrollments.length + failedEvents.length;

    const tabItems = [
        {
            key: "events",
            label: (
                <Space>
                    Events <Tag color="red">{failedEvents.length}</Tag>
                </Space>
            ),
            children:
                failedEvents.length === 0 ? (
                    <Empty description="No failed events" />
                ) : (
                    <Table
                        rowKey="event"
                        size="small"
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        columns={eventColumns}
                        dataSource={failedEvents}
                    />
                ),
        },
        {
            key: "enrollments",
            label: (
                <Space>
                    Enrollments{" "}
                    <Tag color="red">{failedEnrollments.length}</Tag>
                </Space>
            ),
            children:
                failedEnrollments.length === 0 ? (
                    <Empty description="No failed enrollments" />
                ) : (
                    <Table
                        rowKey="enrollment"
                        size="small"
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        columns={enrollmentColumns}
                        dataSource={failedEnrollments}
                    />
                ),
        },
        {
            key: "clients",
            label: (
                <Space>
                    Clients <Tag color="red">{failedTEs.length}</Tag>
                </Space>
            ),
            children:
                failedTEs.length === 0 ? (
                    <Empty description="No failed clients" />
                ) : (
                    <Table
                        rowKey="trackedEntity"
                        size="small"
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        columns={teColumns}
                        dataSource={failedTEs}
                    />
                ),
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            width={900}
            destroyOnHidden
            title={
                <Space>
                    <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                    <span>Sync failures</span>
                    <Tag color="red">{totalFailures}</Tag>
                </Space>
            }
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
                <Button
                    key="retry"
                    type="primary"
                    danger
                    icon={<CloudUploadOutlined />}
                    disabled={totalFailures === 0}
                    onClick={() => {
                        syncActor.send({ type: "PUSH_DATA" });
                        onClose();
                    }}
                >
                    Retry push
                </Button>,
            ]}
        >
            {totalFailures === 0 ? (
                <Empty description="No sync failures" />
            ) : (
                <Tabs items={tabItems} defaultActiveKey="events" />
            )}
        </Modal>
    );
}
