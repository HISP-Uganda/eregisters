import { MenuOutlined } from "@ant-design/icons";
import { useConfig } from "@dhis2/app-runtime";
import { Outlet } from "@tanstack/react-router";
import { useSelector } from "@xstate/react";
import { Alert, Button, Drawer, Flex, Grid, Layout, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import { StorageFallbackNotice } from "@/components/storage-boot-screen";
import { getStoreKey } from "@/db/store-names";
import { useMetadata } from "@/hooks/useMetadata";
import { bootView } from "@/machines/storage-boot";
import { getStorageBootActor } from "@/machines/storage-boot-actor";
import { SyncContext } from "@/machines/sync";
import { parseServerTime } from "@/utils/server-time";
import { NavItems } from "./nav-items";
import { SyncFailuresModal } from "./sync-failures/sync-failures-modal";
import {
    useConnectivityEvents,
    useMetadataReloadBanner,
    useRecordsToSync,
    useStageNames,
    useSyncStatus,
} from "./use-shell-state";

const { Title, Text } = Typography;

/**
 * The running build and local store, for testers and support (wayfinder
 * "Where should the app show which version it is running?").
 */
function AppVersion({ version, storageBackend }: { version: string; storageBackend: string | undefined }) {
    const facilityStore = getStoreKey();
    return (
        <Tooltip
            title={
                <>
                    Version {version}
                    <br />
                    Storage: {storageBackend === "sqlite" ? "SQLite" : "IndexedDB"}
                    <br />
                    Local store: {facilityStore ? `facility ${facilityStore}` : "default (first facility on this device)"}
                </>
            }
        >
            <Text type="secondary" style={{ fontSize: 12, cursor: "default" }}>
                v{version}
            </Text>
        </Tooltip>
    );
}

function MetadataReloadBanner({ onSync, onDismiss }: { onSync: () => void; onDismiss: () => void }) {
    return (
        <Alert
            type="info"
            title="Metadata update available — program rules or forms may have changed."
            action={
                <Button size="small" type="primary" onClick={onSync}>
                    Sync now
                </Button>
            }
            closable={{ onClose: onDismiss }}
            style={{ borderRadius: 0 }}
        />
    );
}

/** The app shell: header with navigation and sync controls, notices, and the page. */
export function RootLayout() {
    const syncActor = SyncContext.useActorRef();
    const { orgUnitName, program } = useMetadata();
    const stageNames = useStageNames(program);
    const storageView = useSelector(getStorageBootActor(), bootView);
    const { lastMetadataPull, storageBackend } = useSyncStatus();
    const records = useRecordsToSync();
    const { systemInfo, appVersion } = useConfig();
    const serverTimeZoneId = systemInfo?.serverTimeZoneId;
    const metadataReload = useMetadataReloadBanner(lastMetadataPull, serverTimeZoneId);
    useConnectivityEvents();

    const [failuresOpen, setFailuresOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    const isLarge = !screens.xl;

    const navItems = (vertical: boolean) => (
        <NavItems
            vertical={vertical}
            orgUnitName={orgUnitName}
            records={records}
            stageNames={stageNames}
            fromServerTime={(ts) => parseServerTime(ts, serverTimeZoneId).fromNow()}
            onNavigate={() => setDrawerOpen(false)}
            onOpenFailures={() => setFailuresOpen(true)}
        />
    );

    return (
        <Layout style={{ minHeight: "calc(100vh - 48px)", background: "#f0f2f5" }}>
            <Layout.Header
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
                    <Title level={isMobile ? 5 : 3} style={{ margin: 0, color: "#1f4788" }}>
                        Medical <Text style={{ fontWeight: 300 }}>eRegistry</Text>
                    </Title>
                    {appVersion?.full && <AppVersion version={appVersion.full} storageBackend={storageBackend} />}
                </Flex>
                {isMobile || isLarge ? (
                    <Button type="text" icon={<MenuOutlined style={{ fontSize: 20 }} />} onClick={() => setDrawerOpen(true)} />
                ) : (
                    navItems(false)
                )}
            </Layout.Header>
            <Drawer title="Navigation" placement="right" onClose={() => setDrawerOpen(false)} open={drawerOpen} size={280}>
                {navItems(true)}
            </Drawer>
            <StorageFallbackNotice view={storageView} />
            {metadataReload.show && (
                <MetadataReloadBanner
                    onSync={() => {
                        // Incremental: only what changed since the last
                        // metadata sync, not a full wipe and re-download.
                        syncActor.send({ type: "START_METADATA_SYNC" });
                        metadataReload.dismiss();
                    }}
                    onDismiss={metadataReload.dismiss}
                />
            )}
            <Outlet />
            <SyncFailuresModal
                open={failuresOpen}
                onClose={() => setFailuresOpen(false)}
                failedEvents={records.failedEvents}
                failedEnrollments={records.failedEnrollments}
                failedTrackedEntities={records.failedTrackedEntities}
            />
        </Layout>
    );
}
