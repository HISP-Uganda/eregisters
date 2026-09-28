import { EditOutlined } from "@ant-design/icons";
import { Button, Collapse, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../../schemas";
import { humanizeSyncError } from "../../../utils/sync-error-messages";

const { Text, Paragraph } = Typography;

/** A sync error in plain words, with DHIS2's own text behind "Technical details". */
function ErrorCell({ error, names }: { error?: string | null; names: Map<string, string> }) {
    if (!error) return <Text type="secondary">—</Text>;
    const { friendly, technical } = humanizeSyncError(error, names);
    return (
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Paragraph style={{ marginBottom: 0, whiteSpace: "pre-wrap", color: "#ff4d4f", fontSize: 13 }}>
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

function Identity({ title, detail }: { title: React.ReactNode; detail: React.ReactNode }) {
    return (
        <Space direction="vertical" size={0}>
            <Text strong>{title}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
                {detail}
            </Text>
        </Space>
    );
}

type Row = { syncError?: string | null; lastSynced?: string };

/** The columns every failure table shares: the error, when it was last tried, and "Open". */
function sharedColumns<T extends Row>(
    names: Map<string, string>,
    onOpen: (row: T) => void,
    canOpen: (row: T) => boolean = () => true,
): ColumnsType<T> {
    return [
        {
            title: "Error",
            key: "error",
            render: (_, r) => <ErrorCell error={r.syncError} names={names} />,
        },
        {
            title: "Last attempt",
            key: "lastSynced",
            width: 140,
            render: (_, r) =>
                r.lastSynced ? (
                    <Text style={{ fontSize: 12 }} type="secondary">
                        {dayjs(r.lastSynced).fromNow()}
                    </Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, r) => (
                <Button size="small" icon={<EditOutlined />} disabled={!canOpen(r)} onClick={() => onOpen(r)}>
                    Open
                </Button>
            ),
        },
    ];
}

export function eventColumns(
    names: Map<string, string>,
    stageNames: Map<string, string>,
    onOpen: (event: FlattenedEvent) => void,
): ColumnsType<FlattenedEvent> {
    return [
        {
            title: "Event",
            key: "identity",
            render: (_, r) => (
                <Identity
                    title={stageNames.get(r.programStage) ?? r.programStage}
                    detail={`${r.event}${r.occurredAt ? ` · ${dayjs(r.occurredAt).format("YYYY-MM-DD")}` : ""}`}
                />
            ),
        },
        ...sharedColumns<FlattenedEvent>(names, onOpen, (r) => Boolean(r.trackedEntity)),
    ];
}

export function enrollmentColumns(
    names: Map<string, string>,
    onOpen: (enrollment: FlattenedEnrollment) => void,
): ColumnsType<FlattenedEnrollment> {
    return [
        {
            title: "Enrollment",
            key: "identity",
            render: (_, r) => <Identity title={r.enrollment} detail={`Client ${r.trackedEntity}`} />,
        },
        ...sharedColumns<FlattenedEnrollment>(names, onOpen),
    ];
}

export function clientColumns(
    names: Map<string, string>,
    /** The attributes that name a client (the program's first two list columns). */
    displayAttributeIds: string[],
    onOpen: (client: FlattenedTrackedEntity) => void,
): ColumnsType<FlattenedTrackedEntity> {
    return [
        {
            title: "Client",
            key: "identity",
            render: (_, r) => (
                <Identity
                    title={displayAttributeIds.map((id) => r.attributes?.[id]).filter(Boolean).join(" ") || "—"}
                    detail={r.trackedEntity}
                />
            ),
        },
        ...sharedColumns<FlattenedTrackedEntity>(names, onOpen),
    ];
}
