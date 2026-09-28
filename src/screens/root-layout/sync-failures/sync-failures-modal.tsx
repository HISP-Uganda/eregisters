import { CloudUploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Button, Empty, Modal, Space, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo } from "react";
import { useMetadata } from "../../../hooks/useMetadata";
import { SyncContext } from "../../../machines/sync";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../../schemas";
import { clientColumns, enrollmentColumns, eventColumns } from "./failure-columns";
import { buildNameLookup } from "./name-lookup";

function failureTab<T extends object>(key: string, label: string, rows: T[], rowKey: keyof T & string, columns: ColumnsType<T>) {
    return {
        key,
        label: (
            <Space>
                {label} <Tag color="red">{rows.length}</Tag>
            </Space>
        ),
        children:
            rows.length === 0 ? (
                <Empty description={`No failed ${label.toLowerCase()}`} />
            ) : (
                <Table
                    rowKey={rowKey}
                    size="small"
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    columns={columns}
                    dataSource={rows}
                />
            ),
    };
}

/**
 * Every record whose push failed — events, enrollments, clients — with
 * the error in plain words, a way to open the record and fix it, and
 * "Retry push".
 */
export function SyncFailuresModal({
    open,
    onClose,
    failedEvents,
    failedEnrollments,
    failedTrackedEntities,
}: {
    open: boolean;
    onClose: () => void;
    failedEvents: FlattenedEvent[];
    failedEnrollments: FlattenedEnrollment[];
    failedTrackedEntities: FlattenedTrackedEntity[];
}) {
    const syncActor = SyncContext.useActorRef();
    const navigate = useNavigate();
    const { program, dataElements, trackedEntityAttributes, optionSets } = useMetadata();

    const names = useMemo(
        () => buildNameLookup({ program, dataElements, trackedEntityAttributes, optionSets }),
        [dataElements, trackedEntityAttributes, optionSets, program],
    );
    const displayAttributeIds = useMemo(
        () =>
            program.programTrackedEntityAttributes
                .filter((ptea) => ptea.displayInList)
                .slice(0, 2)
                .map((ptea) => ptea.trackedEntityAttribute.id),
        [program],
    );
    const stageNames = useMemo(() => new Map(program.programStages.map((s) => [s.id, s.name] as const)), [program]);

    // Opening a record closes this; the client's page shows its form or event.
    const openRecord = (trackedEntity: string, search: { edit: "client" } | { event: string }) => {
        navigate({ to: "/tracked-entity/$trackedEntity", params: { trackedEntity }, search });
        onClose();
    };
    const openClient = (r: { trackedEntity: string }) => openRecord(r.trackedEntity, { edit: "client" });

    const totalFailures = failedTrackedEntities.length + failedEnrollments.length + failedEvents.length;

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
                <Tabs
                    defaultActiveKey="events"
                    items={[
                        failureTab(
                            "events",
                            "Events",
                            failedEvents,
                            "event",
                            eventColumns(names, stageNames, (r) => {
                                if (r.trackedEntity) openRecord(r.trackedEntity, { event: r.event });
                            }),
                        ),
                        failureTab(
                            "enrollments",
                            "Enrollments",
                            failedEnrollments,
                            "enrollment",
                            enrollmentColumns(names, openClient),
                        ),
                        failureTab(
                            "clients",
                            "Clients",
                            failedTrackedEntities,
                            "trackedEntity",
                            clientColumns(names, displayAttributeIds, openClient),
                        ),
                    ]}
                />
            )}
        </Modal>
    );
}
