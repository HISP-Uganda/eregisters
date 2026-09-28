import {
    BarChartOutlined,
    CloudDownloadOutlined,
    CloudUploadOutlined,
    HomeOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Flex, Tooltip, Typography } from "antd";
import React from "react";
import { SyncContext } from "../../machines/sync";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import { PushDataButton, SplitSyncButton, SyncButton } from "./sync-buttons";
import { SyncErrorsButton } from "./sync-errors-button";
import { useSyncStatus } from "./use-shell-state";

const { Text } = Typography;

function HomeLink({ orgUnitName, enabled, onNavigate }: { orgUnitName?: string; enabled: boolean; onNavigate: () => void }) {
    const name = orgUnitName ?? "Loading...";
    if (enabled) {
        return (
            <Link to="/" onClick={onNavigate}>
                <Flex align="center" justify="center" gap={5}>
                    <HomeOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                    <Text strong>{name}</Text>
                </Flex>
            </Link>
        );
    }
    return (
        <Tooltip title="Disabled — no program assigned to your org unit">
            <Flex align="center" justify="center" gap={5}>
                <HomeOutlined style={{ fontSize: 20, color: "#bfbfbf" }} />
                <Text style={{ color: "#8c8c8c" }} strong>
                    {name}
                </Text>
            </Flex>
        </Tooltip>
    );
}

/** A header link styled as a button (reports, line lists, admin). */
function LinkButton({ to, icon, label, caption, onNavigate }: {
    to: "/reports" | "/analytics" | "/admin/section-layout";
    icon: React.ReactNode;
    label: string;
    caption: string;
    onNavigate?: () => void;
}) {
    return (
        <Link to={to} onClick={onNavigate}>
            <SyncButton
                tooltip={label}
                icon={icon}
                isLoading={false}
                idleLabel={label}
                loadingLabel=""
                lastTime={caption}
                onClick={() => {}}
            />
        </Link>
    );
}

/** The header's navigation and sync buttons — in the header bar, or stacked in the drawer. */
export function NavItems({
    vertical,
    orgUnitName,
    records,
    stageNames,
    fromServerTime,
    onNavigate,
    onOpenFailures,
}: {
    vertical: boolean;
    orgUnitName?: string;
    records: {
        pendingCount: number;
        failedEvents: FlattenedEvent[];
        failedEnrollments: FlattenedEnrollment[];
        failedTrackedEntities: FlattenedTrackedEntity[];
    };
    stageNames: Map<string, string>;
    /** A server timestamp as "3 hours ago". */
    fromServerTime: (serverTimestamp: string) => string;
    /** A link was followed: close the drawer. */
    onNavigate: () => void;
    onOpenFailures: () => void;
}) {
    const syncActor = SyncContext.useActorRef();
    const status = useSyncStatus();

    return (
        <Flex align={vertical ? "flex-start" : "center"} justify="center" gap={vertical ? 16 : 15} vertical={vertical}>
            <HomeLink orgUnitName={orgUnitName} enabled={Boolean(status.hasProgram)} onNavigate={onNavigate} />
            <SplitSyncButton
                tooltip="Pull data changes since last sync"
                icon={<CloudDownloadOutlined />}
                isLoading={status.syncingData}
                idleLabel="Pull Data"
                loadingLabel="Pulling..."
                lastTime={status.lastDataPull ? fromServerTime(status.lastDataPull) : undefined}
                primaryAction={() => syncActor.send({ type: "START_DATA_SYNC" })}
                disabled={!status.hasProgram}
            />
            <SplitSyncButton
                tooltip="Sync metadata changes since last sync"
                icon={<ReloadOutlined />}
                isLoading={status.syncingMetadata}
                idleLabel="Sync Metadata"
                loadingLabel="Syncing..."
                lastTime={status.lastMetadataPull ? fromServerTime(status.lastMetadataPull) : undefined}
                primaryAction={() => syncActor.send({ type: "START_METADATA_SYNC" })}
                type="primary"
            />
            <PushDataButton
                isLoading={status.pushingData}
                lastDataPush={status.lastDataPush}
                pendingCount={records.pendingCount}
                disabled={!status.hasProgram}
                onPush={() => syncActor.send({ type: "PUSH_DATA" })}
            />
            <SyncErrorsButton
                failedEvents={records.failedEvents}
                failedEnrollments={records.failedEnrollments}
                failedTrackedEntities={records.failedTrackedEntities}
                onOpenAll={onOpenFailures}
                stageNameMap={stageNames}
            />
            <LinkButton to="/reports" icon={<CloudUploadOutlined />} label="Verify Reports" caption="View reports" />
            <LinkButton
                to="/analytics"
                icon={<BarChartOutlined />}
                label="Line Lists"
                caption="Line list and pivot"
                onNavigate={onNavigate}
            />
            {status.isAdmin && (
                <LinkButton
                    to="/admin/section-layout"
                    icon={<CloudUploadOutlined />}
                    label="Administration"
                    caption="Admin"
                    onNavigate={onNavigate}
                />
            )}
        </Flex>
    );
}
