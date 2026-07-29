import {
    CloudUploadOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { useNavigate } from "@tanstack/react-router";
import {
    Button,
    Collapse,
    Empty,
    Modal,
    Space,
    Table,
    Tabs,
    Tag,
    Typography,
} from "antd";
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
import { humanizeSyncError } from "../utils/sync-error-messages";

const { Text, Paragraph } = Typography;

function ErrorCell({
    error,
    names,
}: {
    error?: string | null;
    names?: Map<string, string>;
}) {
    if (!error) return <Text type="secondary">—</Text>;
    const { friendly, technical } = humanizeSyncError(error, names);
    return (
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Paragraph
                style={{
                    marginBottom: 0,
                    whiteSpace: "pre-wrap",
                    color: "#ff4d4f",
                    fontSize: 13,
                }}
            >
                {friendly}
            </Paragraph>
            {technical ? (
                <Collapse
                    ghost
                    size="small"
                    items={[
                        {
                            key: "tech",
                            label: (
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    Technical details
                                </Text>
                            ),
                            children: (
                                <Paragraph
                                    copyable={{ text: technical }}
                                    style={{
                                        marginBottom: 0,
                                        whiteSpace: "pre-wrap",
                                        color: "#8c8c8c",
                                        fontSize: 11,
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {technical}
                                </Paragraph>
                            ),
                        },
                    ]}
                />
            ) : null}
        </Space>
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
    const navigate = useNavigate();
    const {
        program,
        dataElements,
        trackedEntityAttributes,
        optionSets,
    } = useMetadata();

    const nameLookup = useMemo(() => {
        const map = new Map<string, string>();
        const optionSetNames = new Map<string, string>();
        const optionSetConsumers = new Map<string, Set<string>>();

        const noteConsumer = (optionSetId: string, consumer: string) => {
            const set =
                optionSetConsumers.get(optionSetId) ?? new Set<string>();
            set.add(consumer);
            optionSetConsumers.set(optionSetId, set);
        };

        for (const de of dataElements.values()) {
            const deName = de.formName || de.name;
            map.set(de.id, deName);
            if (de.optionSet) {
                optionSetNames.set(de.optionSet.id, de.optionSet.name);
                noteConsumer(de.optionSet.id, deName);
            }
        }
        for (const tea of trackedEntityAttributes.values()) {
            const teaName = tea.displayFormName || tea.name;
            map.set(tea.id, teaName);
            if (tea.optionSet) {
                optionSetNames.set(tea.optionSet.id, tea.optionSet.name);
                noteConsumer(tea.optionSet.id, teaName);
            }
        }
        for (const [optionSetId, options] of optionSets.entries()) {
            const optionSetName =
                options.find((o) => o.optionSetName)?.optionSetName ??
                optionSetNames.get(optionSetId);
            if (optionSetName) optionSetNames.set(optionSetId, optionSetName);
            for (const opt of options) {
                map.set(
                    opt.id,
                    optionSetName ? `${opt.name} (${optionSetName})` : opt.name,
                );
            }
        }
        for (const [optionSetId, name] of optionSetNames.entries()) {
            const consumers = optionSetConsumers.get(optionSetId);
            if (consumers && consumers.size > 0) {
                map.set(
                    optionSetId,
                    `${name} — used by ${Array.from(consumers).join(", ")}`,
                );
            } else {
                map.set(optionSetId, name);
            }
        }
        for (const stage of program?.programStages ?? []) {
            map.set(stage.id, stage.name);
            for (const section of stage.programStageSections ?? []) {
                map.set(section.id, section.displayName || section.name);
            }
        }
        return map;
    }, [dataElements, trackedEntityAttributes, optionSets, program]);

    const openClient = (trackedEntity: string) => {
        navigate({
            to: "/tracked-entity/$trackedEntity",
            params: { trackedEntity },
            search: { edit: "client" },
        });
        onClose();
    };

    const openEvent = (trackedEntity: string | undefined, event: string) => {
        if (!trackedEntity) return;
        navigate({
            to: "/tracked-entity/$trackedEntity",
            params: { trackedEntity },
            search: { event },
        });
        onClose();
    };

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
            render: (_, r) => <ErrorCell error={r.syncError} names={nameLookup} />,
        },
        {
            title: "Last attempt",
            key: "lastSynced",
            width: 140,
            render: (_, r) => <LastAttemptCell ts={r.lastSynced} />,
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, r) => (
                <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => openClient(r.trackedEntity)}
                >
                    Open
                </Button>
            ),
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
            render: (_, r) => <ErrorCell error={r.syncError} names={nameLookup} />,
        },
        {
            title: "Last attempt",
            key: "lastSynced",
            width: 140,
            render: (_, r) => <LastAttemptCell ts={r.lastSynced} />,
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, r) => (
                <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => openClient(r.trackedEntity)}
                >
                    Open
                </Button>
            ),
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
            render: (_, r) => <ErrorCell error={r.syncError} names={nameLookup} />,
        },
        {
            title: "Last attempt",
            key: "lastSynced",
            width: 140,
            render: (_, r) => <LastAttemptCell ts={r.lastSynced} />,
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, r) => (
                <Button
                    size="small"
                    icon={<EditOutlined />}
                    disabled={!r.trackedEntity}
                    onClick={() => openEvent(r.trackedEntity, r.event)}
                >
                    Open
                </Button>
            ),
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
