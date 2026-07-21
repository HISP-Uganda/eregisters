import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DownOutlined,
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

import { useConfig } from "@dhis2/app-runtime";
import { eq, or, useLiveSuspenseQuery } from "@tanstack/react-db";
import { waitFor } from "xstate";
import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";
import { Spinner } from "../components/spinner";
import { useMetadata } from "../hooks/useMetadata";
import { useUIConfig } from "../hooks/useUIConfig";
import { SyncContext } from "../machines/sync";
import {
    isDataPullLoading,
    isDataPushLoading,
    isMetadataSyncLoading,
} from "../machines/sync-metadata-mode";

dayjs.extend(relativeTime);

const { Header } = Layout;
const { Title, Text } = Typography;

export const RootRoute = createRootRouteWithContext<{
    syncActor: ReturnType<typeof SyncContext.useActorRef>;
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
}) {
    return (
        <Tooltip title={tooltip}>
            <Button
                icon={icon}
                loading={isLoading}
                onClick={onClick}
                type={type}
                danger={danger}
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
}) {
    return (
        <Space.Compact>
            <Tooltip title={tooltip}>
                <Button
                    icon={icon}
                    loading={isLoading}
                    onClick={primaryAction}
                    type={type}
                    danger={danger}
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
                    icon={<DownOutlined />}
                    style={{ height: "auto", padding: "4px 6px" }}
                />
            </Dropdown>
        </Space.Compact>
    );
}

function LayoutWithDrafts() {
    const syncActor = SyncContext.useActorRef();
    const { orgUnitName } = useMetadata();
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
            <Link to="/" onClick={() => setDrawerOpen(false)}>
                <Flex align="center" justify="center" gap={5}>
                    <HomeOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                    <Text strong>{orgUnitName ?? "Loading..."}</Text>
                </Flex>
            </Link>
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
            <Tooltip title="Push Data">
                <Badge
                    count={
                        pendingEnrollments.length +
                        pendingEvents.length +
                        pendingTrackedEntities.length
                    }
                    style={{ backgroundColor: "#faad14" }}
                    title="Pending entities to sync"
                    showZero
                >
                    <SyncButton
                        tooltip="Push Data"
                        icon={<CloudUploadOutlined />}
                        isLoading={pushingData}
                        idleLabel="Push Data"
                        loadingLabel="Pushing..."
                        lastTime={
                            lastDataPush
                                ? dayjs(lastDataPush).fromNow()
                                : undefined
                        }
                        onClick={() => syncActor.send({ type: "PUSH_DATA" })}
                        danger
                    />
                </Badge>
            </Tooltip>
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
                            onClick={() => window.location.reload()}
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
        </Layout>
    );
}
