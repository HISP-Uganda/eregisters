import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    HomeOutlined,
    MenuOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import {
    createRootRouteWithContext,
    Link,
    Outlet,
} from "@tanstack/react-router";
import {
    Alert,
    Badge,
    Button,
    Drawer,
    Dropdown,
    Flex,
    Grid,
    Layout,
    Space,
    Tooltip,
    Typography,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";

import { eq, or, useLiveSuspenseQuery } from "@tanstack/react-db";
import { waitFor } from "xstate";
import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";
import { Spinner } from "../components/spinner";
import { SyncFailuresModal } from "../components/sync-failures-modal";
import { useMetadata } from "../hooks/useMetadata";
import { useUIConfig } from "../hooks/useUIConfig";
import { SyncContext } from "../machines/sync";
import {
    isDataPullLoading,
    isDataPushLoading,
    isMetadataSyncLoading,
} from "../machines/sync-metadata-mode";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../schemas";

dayjs.extend(relativeTime);

type DataEngine = ReturnType<typeof import("@dhis2/app-runtime").useDataEngine>;

const { Header } = Layout;
const { Title, Text } = Typography;

export const RootRoute = createRootRouteWithContext<{
    syncActor: ReturnType<typeof SyncContext.useActorRef>;
    engine: DataEngine;
}>()({
    component: LayoutWithDrafts,
    pendingComponent: () => (
        <Spinner
            component={<Typography.Text>Loading Metadata</Typography.Text>}
        />
    ),
    loader: async ({ context: { syncActor } }) => {
        await waitFor(syncActor, (snapshot) => {
            return snapshot.matches({ metadataSync: "waiting" });
        });
    },
});

function SyncButton({
    tooltip,
    icon,
    isLoading,
    idleLabel,
    loadingLabel,
    lastTime,
    onClick,
    type,
    danger,
    disabled,
}: {
    tooltip: string;
    icon: React.ReactNode;
    isLoading: boolean;
    idleLabel: string;
    loadingLabel: string;
    lastTime?: string;
    onClick: () => void;
    type?: "primary" | "default";
    danger?: boolean;
    disabled?: boolean;
}) {
    return (
        <Tooltip title={disabled ? "Disabled — no program assigned" : tooltip}>
            <Button
                icon={icon}
                loading={isLoading}
                onClick={onClick}
                type={type}
                danger={danger}
                disabled={disabled}
                style={{ height: "auto", padding: "4px 12px" }}
            >
                <Flex vertical align="flex-start" gap={0}>
                    <span>{isLoading ? loadingLabel : idleLabel}</span>
                    {lastTime && (
                        <Text
                            type="secondary"
                            style={{ fontSize: 10, lineHeight: 1 }}
                        >
                            {lastTime}
                        </Text>
                    )}
                </Flex>
            </Button>
        </Tooltip>
    );
}

function SplitSyncButton({
    tooltip,
    icon,
    isLoading,
    idleLabel,
    loadingLabel,
    lastTime,
    primaryAction,
    dropdownItems,
    type,
    danger,
    disabled,
}: {
    tooltip: string;
    icon: React.ReactNode;
    isLoading: boolean;
    idleLabel: string;
    loadingLabel: string;
    lastTime?: string;
    primaryAction: () => void;
    dropdownItems: Array<{ key: string; label: string; onClick: () => void }>;
    type?: "primary" | "default";
    danger?: boolean;
    disabled?: boolean;
}) {
    return (
        <Space.Compact>
            <Tooltip
                title={disabled ? "Disabled — no program assigned" : tooltip}
            >
                <Button
                    icon={icon}
                    loading={isLoading}
                    onClick={primaryAction}
                    type={type}
                    danger={danger}
                    disabled={disabled}
                    style={{ height: "auto", padding: "4px 12px" }}
                >
                    <Flex vertical align="flex-start" gap={0}>
                        <span>{isLoading ? loadingLabel : idleLabel}</span>
                        {lastTime && (
                            <Text
                                type="secondary"
                                style={{ fontSize: 10, lineHeight: 1 }}
                            >
                                {lastTime}
                            </Text>
                        )}
                    </Flex>
                </Button>
            </Tooltip>
            <Dropdown
                disabled={disabled}
                menu={{
                    items: dropdownItems.map((item) => ({
                        key: item.key,
                        label: item.label,
                        onClick: item.onClick,
                    })),
                }}
            >
                <Button
                    type={type}
                    danger={danger}
                    disabled={disabled}
                    icon={<DownOutlined />}
                    style={{ height: "auto", padding: "4px 6px" }}
                />
            </Dropdown>
        </Space.Compact>
    );
}

function shortId(id: string) {
    if (!id) return "";
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

function firstErrorLine(error?: string | null) {
    if (!error) return "";
    const line = error.split("\n")[0].trim();
    return line.length > 90 ? `${line.slice(0, 90)}…` : line;
}

function FailureMenuItem({
    typeLabel,
    typeColor,
    title,
    subtitle,
    error,
}: {
    typeLabel: string;
    typeColor: string;
    title: string;
    subtitle?: string;
    error: string;
}) {
    return (
        <Flex vertical gap={2} style={{ maxWidth: 380, padding: "4px 0" }}>
            <Flex align="center" gap={6}>
                <span
                    style={{
                        background: typeColor,
                        color: "#fff",
                        fontSize: 10,
                        padding: "0 6px",
                        borderRadius: 3,
                        letterSpacing: 0.4,
                    }}
                >
                    {typeLabel}
                </span>
                <Text strong style={{ fontSize: 12 }}>
                    {title}
                </Text>
                {subtitle && (
                    <Text
                        type="secondary"
                        style={{ fontSize: 11, marginLeft: 4 }}
                    >
                        {subtitle}
                    </Text>
                )}
            </Flex>
            <Text
                style={{
                    fontSize: 11,
                    color: "#ff4d4f",
                    whiteSpace: "normal",
                    lineHeight: 1.3,
                }}
            >
                {error}
            </Text>
        </Flex>
    );
}

function countPill(color: string, text: string | number, bg?: string) {
    return (
        <span
            style={{
                background: bg ?? color,
                color: bg ? color : "#fff",
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
                padding: "2px 6px",
                borderRadius: 10,
                minWidth: 18,
                textAlign: "center",
                display: "inline-block",
                border: bg ? `1px solid ${color}` : undefined,
            }}
        >
            {text}
        </span>
    );
}

function PushDataButton({
    isLoading,
    lastDataPush,
    pendingCount,
    disabled,
    onPush,
}: {
    isLoading: boolean;
    lastDataPush?: string;
    pendingCount: number;
    disabled: boolean;
    onPush: () => void;
}) {
    return (
        <Tooltip
            title={
                disabled
                    ? "Disabled — no program assigned"
                    : "Push pending records to the server"
            }
        >
            <Badge
                count={pendingCount}
                style={{ backgroundColor: "#faad14" }}
                title="Pending entities to sync"
                showZero
            >
                <SyncButton
                    tooltip="Push Data"
                    icon={<CloudUploadOutlined />}
                    isLoading={isLoading}
                    idleLabel="Push Data"
                    loadingLabel="Pushing..."
                    lastTime={
                        lastDataPush ? dayjs(lastDataPush).fromNow() : undefined
                    }
                    onClick={onPush}
                    danger
                    disabled={disabled}
                />
            </Badge>
        </Tooltip>
    );
}

function SyncErrorsButton({
    failedEvents,
    failedEnrollments,
    failedTrackedEntities,
    onOpenAll,
    stageNameMap,
}: {
    failedEvents: FlattenedEvent[];
    failedEnrollments: FlattenedEnrollment[];
    failedTrackedEntities: FlattenedTrackedEntity[];
    onOpenAll: () => void;
    stageNameMap: Map<string, string>;
}) {
    const failedCount =
        failedEvents.length +
        failedEnrollments.length +
        failedTrackedEntities.length;
    const hasFailures = failedCount > 0;
    const MAX_ITEMS = 6;

    const menuItems: Array<{
        key: string;
        label: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
        type?: "divider";
    }> = [];

    if (failedCount === 0) {
        menuItems.push({
            key: "no-failures",
            label: (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    No failed records
                </Text>
            ),
            disabled: true,
        });
    } else {
        let shown = 0;
        for (const ev of failedEvents) {
            if (shown >= MAX_ITEMS) break;
            const stage = stageNameMap.get(ev.programStage) ?? ev.programStage;
            menuItems.push({
                key: `event-${ev.event}`,
                label: (
                    <FailureMenuItem
                        typeLabel="EVENT"
                        typeColor="#7c3aed"
                        title={stage}
                        subtitle={shortId(ev.event)}
                        error={firstErrorLine(ev.syncError)}
                    />
                ),
                onClick: onOpenAll,
            });
            shown++;
        }
        for (const en of failedEnrollments) {
            if (shown >= MAX_ITEMS) break;
            menuItems.push({
                key: `enrollment-${en.enrollment}`,
                label: (
                    <FailureMenuItem
                        typeLabel="ENROLL"
                        typeColor="#0891b2"
                        title={shortId(en.enrollment)}
                        subtitle={`client ${shortId(en.trackedEntity)}`}
                        error={firstErrorLine(en.syncError)}
                    />
                ),
                onClick: onOpenAll,
            });
            shown++;
        }
        for (const te of failedTrackedEntities) {
            if (shown >= MAX_ITEMS) break;
            menuItems.push({
                key: `te-${te.trackedEntity}`,
                label: (
                    <FailureMenuItem
                        typeLabel="CLIENT"
                        typeColor="#ea580c"
                        title={shortId(te.trackedEntity)}
                        error={firstErrorLine(te.syncError)}
                    />
                ),
                onClick: onOpenAll,
            });
            shown++;
        }
        const remaining = failedCount - shown;
        if (remaining > 0) {
            menuItems.push({ key: "more-divider", type: "divider", label: "" });
            menuItems.push({
                key: "more",
                label: (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        …and {remaining} more
                    </Text>
                ),
                onClick: onOpenAll,
            });
        }
        menuItems.push({
            key: "all-divider",
            type: "divider",
            label: "",
        });
        menuItems.push({
            key: "view-all",
            label: (
                <Flex align="center" gap={8}>
                    <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                    <Text strong>View all failures ({failedCount})</Text>
                </Flex>
            ),
            onClick: onOpenAll,
        });
    }
    return (
        <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
                items: menuItems.map((item) =>
                    item.type === "divider"
                        ? { key: item.key, type: "divider" }
                        : {
                              key: item.key,
                              label: item.label,
                              disabled: item.disabled,
                              onClick: item.onClick,
                          },
                ),
                style: {
                    maxWidth: 420,
                    maxHeight: 480,
                    overflowY: "auto",
                },
            }}
        >
            <Tooltip
                title={
                    hasFailures
                        ? "Click to view failed records and their errors"
                        : "No sync errors"
                }
            >
                <Badge
                    count={failedCount}
                    style={{ backgroundColor: "#ff4d4f" }}
                    title="Failed sync records"
                    showZero
                >
                    <Button
                        style={{
                            height: "auto",
                            padding: "4px 12px",
                            whiteSpace: "nowrap",
                            color: hasFailures ? "#ff4d4f" : undefined,
                            borderColor: hasFailures ? "#ff4d4f" : undefined,
                        }}
                    >
                        <Flex align="center" gap={8}>
                            <ExclamationCircleOutlined />
                            <Flex vertical align="flex-start" gap={0}>
                                <span style={{ lineHeight: 1.2 }}>Errors</span>
                                <span
                                    style={{
                                        fontSize: 10,
                                        lineHeight: 1,
                                        color: "#8c8c8c",
                                    }}
                                >
                                    {failedCount === 1
                                        ? "1 failed record"
                                        : `${failedCount} failed records`}
                                </span>
                            </Flex>
                            <DownOutlined
                                style={{ fontSize: 10, marginLeft: 4 }}
                            />
                        </Flex>
                    </Button>
                </Badge>
            </Tooltip>
        </Dropdown>
    );
}

function LayoutWithDrafts() {
    const syncActor = SyncContext.useActorRef();
    const { orgUnitName, program } = useMetadata();
    const stageNameMap = React.useMemo(
        () =>
            new Map((program?.programStages ?? []).map((s) => [s.id, s.name])),
        [program],
    );
    const syncingMetadata = SyncContext.useSelector((snapshot) => {
        return isMetadataSyncLoading(
            snapshot.matches({ metadataSync: "syncing" }) ||
                snapshot.matches({ metadataSync: "deletingMetadata" }) ||
                snapshot.matches({ metadataSync: "savingMetadata" }),
            snapshot.context.lastMetadataPull,
        );
    });

    const syncingData = SyncContext.useSelector((snapshot) =>
        isDataPullLoading(
            snapshot.matches({ dataPull: "syncing" }),
            snapshot.context.lastDataPull,
        ),
    );

    const pushingData = SyncContext.useSelector((snapshot) =>
        isDataPushLoading(snapshot.matches({ dataSync: "batchSync" })),
    );
    const lastDataPull = SyncContext.useSelector((a) => a.context.lastDataPull);
    const lastDataPush = SyncContext.useSelector((a) => a.context.lastDataPush);
    const lastMetadataPull = SyncContext.useSelector(
        (a) => a.context.lastMetadataPull,
    );
    const isAdmin = SyncContext.useSelector((a) =>
        a.context.userInfo?.authorities?.includes("ALL"),
    );
    const hasProgram = SyncContext.useSelector(
        (a) =>
            a.context.userInfo.organisationUnits.flatMap((a) => a.programs)
                .length > 0,
    );
    const uiConfig = useUIConfig();
    const [showAppReload, setShowAppReload] = useState(false);
    const [showMetadataReload, setShowMetadataReload] = useState(false);

    useEffect(() => {
        function checkSignals() {
            const appTs = uiConfig.reloadSignal.app?.timestamp;
            const metaTs = uiConfig.reloadSignal.metadata?.timestamp;
            const lastApp = localStorage.getItem(
                "eregisters.lastSeenAppSignal",
            );
            const lastMeta = localStorage.getItem(
                "eregisters.lastSeenMetadataSignal",
            );
            if (appTs && (!lastApp || appTs > lastApp)) {
                setShowAppReload(true);
            }
            if (metaTs && (!lastMeta || metaTs > lastMeta)) {
                setShowMetadataReload(true);
            }
        }
        checkSignals();
        const interval = setInterval(checkSignals, 60_000);
        return () => clearInterval(interval);
    }, [uiConfig.reloadSignal]);
    const { data: pendingTrackedEntities } = useLiveSuspenseQuery((q) =>
        q
            .from({ trackedEntities: trackedEntitiesCollection })
            .where(({ trackedEntities }) =>
                or(
                    eq(trackedEntities.syncStatus, "pending"),
                    eq(trackedEntities.syncStatus, "deleted"),
                ),
            ),
    );

    const { data: pendingEnrollments } = useLiveSuspenseQuery((q) =>
        q
            .from({ enrollments: enrollmentsCollection })
            .where(({ enrollments }) =>
                or(
                    eq(enrollments.syncStatus, "pending"),
                    eq(enrollments.syncStatus, "deleted"),
                ),
            ),
    );
    const { data: pendingEvents } = useLiveSuspenseQuery((q) =>
        q
            .from({ events: eventsCollection })
            .where(({ events }) =>
                or(
                    eq(events.syncStatus, "pending"),
                    eq(events.syncStatus, "deleted"),
                ),
            ),
    );
    const { data: failedTrackedEntities } = useLiveSuspenseQuery((q) =>
        q
            .from({ trackedEntities: trackedEntitiesCollection })
            .where(({ trackedEntities }) =>
                eq(trackedEntities.syncStatus, "failed"),
            ),
    );
    const { data: failedEnrollments } = useLiveSuspenseQuery((q) =>
        q
            .from({ enrollments: enrollmentsCollection })
            .where(({ enrollments }) => eq(enrollments.syncStatus, "failed")),
    );
    const { data: failedEvents } = useLiveSuspenseQuery((q) =>
        q
            .from({ events: eventsCollection })
            .where(({ events }) => eq(events.syncStatus, "failed")),
    );
    // const failedCount =
    //     failedTrackedEntities.length +
    //     failedEnrollments.length +
    //     failedEvents.length;
    const [failuresOpen, setFailuresOpen] = useState(false);
    useEffect(() => {
        const handleOnline = () =>
            syncActor.send({ type: "NETWORK_RECONNECT" });
        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);
    }, [syncActor]);

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    const isLarge = !screens.xl;
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navItems = (vertical: boolean) => (
        <Flex
            align={vertical ? "flex-start" : "center"}
            justify="center"
            gap={vertical ? 16 : 15}
            vertical={vertical}
        >
            {hasProgram ? (
                <Link to="/" onClick={() => setDrawerOpen(false)}>
                    <Flex align="center" justify="center" gap={5}>
                        <HomeOutlined
                            style={{ fontSize: 20, color: "#1890ff" }}
                        />
                        <Text strong>{orgUnitName ?? "Loading..."}</Text>
                    </Flex>
                </Link>
            ) : (
                <Tooltip title="Disabled — no program assigned to your org unit">
                    <Flex align="center" justify="center" gap={5}>
                        <HomeOutlined
                            style={{ fontSize: 20, color: "#bfbfbf" }}
                        />
                        <Text style={{ color: "#8c8c8c" }} strong>
                            {orgUnitName ?? "Loading..."}
                        </Text>
                    </Flex>
                </Tooltip>
            )}
            <SplitSyncButton
                tooltip="Pull data changes since last sync"
                icon={<CloudDownloadOutlined />}
                isLoading={syncingData}
                idleLabel="Pull Data"
                loadingLabel="Pulling..."
                lastTime={
                    lastDataPull ? dayjs(lastDataPull).fromNow() : undefined
                }
                primaryAction={() =>
                    syncActor.send({ type: "START_DATA_SYNC" })
                }
                dropdownItems={[
                    {
                        key: "full",
                        label: "Pull All Data",
                        onClick: () =>
                            syncActor.send({ type: "FULL_DATA_SYNC" }),
                    },
                ]}
                disabled={!hasProgram}
            />
            <SplitSyncButton
                tooltip="Sync metadata changes since last sync"
                icon={<ReloadOutlined />}
                isLoading={syncingMetadata}
                idleLabel="Sync Metadata"
                loadingLabel="Syncing..."
                lastTime={
                    lastMetadataPull
                        ? dayjs(lastMetadataPull).fromNow()
                        : undefined
                }
                primaryAction={() =>
                    syncActor.send({ type: "START_METADATA_SYNC" })
                }
                dropdownItems={[
                    {
                        key: "full",
                        label: "Full Metadata Sync",
                        onClick: () =>
                            syncActor.send({ type: "FULL_METADATA_SYNC" }),
                    },
                ]}
                type="primary"
            />
            <PushDataButton
                isLoading={pushingData}
                lastDataPush={lastDataPush}
                pendingCount={
                    pendingEnrollments.length +
                    pendingEvents.length +
                    pendingTrackedEntities.length
                }
                disabled={!hasProgram}
                onPush={() => syncActor.send({ type: "PUSH_DATA" })}
            />
            <SyncErrorsButton
                failedEvents={failedEvents}
                failedEnrollments={failedEnrollments}
                failedTrackedEntities={failedTrackedEntities}
                onOpenAll={() => setFailuresOpen(true)}
                stageNameMap={stageNameMap}
            />
            <Link to="/reports">
                <SyncButton
                    tooltip="Verify Reports"
                    icon={<CloudUploadOutlined />}
                    isLoading={pushingData}
                    idleLabel="Verify Reports"
                    loadingLabel="Pushing..."
                    lastTime={"View reports"}
                    onClick={() => {}}
                />
            </Link>
            {isAdmin && (
                <Link
                    to="/admin/section-layout"
                    onClick={() => setDrawerOpen(false)}
                >
                    <SyncButton
                        tooltip="Administration"
                        icon={<CloudUploadOutlined />}
                        isLoading={pushingData}
                        idleLabel="Administration"
                        loadingLabel="Pushing..."
                        lastTime={"Admin"}
                        onClick={() => {}}
                    />
                </Link>
            )}
        </Flex>
    );

    return (
        <Layout
            style={{
                minHeight: "calc(100vh - 48px)",
                background: "#f0f2f5",
            }}
        >
            <Header
                style={{
                    background: "#fff",
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    justifyItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <Flex align="center" gap={isMobile ? "middle" : "large"}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Coat_of_arms_of_Uganda.svg"
                        alt="Uganda Coat of Arms"
                        style={{ height: isMobile ? 36 : 54 }}
                    />
                    <Title
                        level={isMobile ? 5 : 3}
                        style={{ margin: 0, color: "#1f4788" }}
                    >
                        Medical{" "}
                        <Text style={{ fontWeight: 300 }}>eRegistry</Text>
                    </Title>
                </Flex>

                {isMobile || isLarge ? (
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: 20 }} />}
                        onClick={() => setDrawerOpen(true)}
                    />
                ) : (
                    navItems(false)
                )}
            </Header>
            <Drawer
                title="Navigation"
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                size={280}
            >
                {navItems(true)}
            </Drawer>
            {showAppReload && (
                <Alert
                    type="warning"
                    title="Update available — your administrator has pushed a new version."
                    action={
                        <Button
                            size="small"
                            type="primary"
                            style={{
                                background: "#d97706",
                                borderColor: "#d97706",
                            }}
                            onClick={() => {
                                const ts =
                                    uiConfig.reloadSignal.app?.timestamp;
                                if (ts)
                                    localStorage.setItem(
                                        "eregisters.lastSeenAppSignal",
                                        ts,
                                    );
                                setShowAppReload(false);
                                window.location.reload();
                            }}
                        >
                            Reload now
                        </Button>
                    }
                    closable={{
                        onClose: () => {
                            const ts = uiConfig.reloadSignal.app?.timestamp;
                            if (ts)
                                localStorage.setItem(
                                    "eregisters.lastSeenAppSignal",
                                    ts,
                                );
                            setShowAppReload(false);
                        },
                    }}
                    style={{ borderRadius: 0 }}
                />
            )}
            {showMetadataReload && (
                <Alert
                    type="info"
                    title="Metadata update available — program rules or forms may have changed."
                    action={
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                syncActor.send({ type: "FULL_METADATA_SYNC" });
                                const ts =
                                    uiConfig.reloadSignal.metadata?.timestamp;
                                if (ts)
                                    localStorage.setItem(
                                        "eregisters.lastSeenMetadataSignal",
                                        ts,
                                    );
                                setShowMetadataReload(false);
                            }}
                        >
                            Sync now
                        </Button>
                    }
                    closable={{
                        onClose: () => {
                            const ts =
                                uiConfig.reloadSignal.metadata?.timestamp;
                            if (ts)
                                localStorage.setItem(
                                    "eregisters.lastSeenMetadataSignal",
                                    ts,
                                );
                            setShowMetadataReload(false);
                        },
                    }}
                    style={{ borderRadius: 0 }}
                />
            )}
            <Outlet />
            <SyncFailuresModal
                open={failuresOpen}
                onClose={() => setFailuresOpen(false)}
            />
        </Layout>
    );
}
