import { useDataEngine } from "@dhis2/app-runtime";
import { createRoute } from "@tanstack/react-router";
import {
    Button,
    Divider,
    Flex,
    InputNumber,
    message,
    Typography,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { db } from "../db";
import { useUIConfig } from "../hooks/useUIConfig";
import { DEFAULT_DATA_PULL_PAGE_SIZE } from "../schemas";
import { AdminRoute } from "./admin";

dayjs.extend(relativeTime);

export const AdminAppSettingsRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/app-settings",
    component: AppSettings,
});

function AppSettings() {
    const engine = useDataEngine();
    const uiConfig = useUIConfig();
    const [broadcastingApp, setBroadcastingApp] = useState(false);
    const [broadcastingMetadata, setBroadcastingMetadata] = useState(false);
    const [savingPageSize, setSavingPageSize] = useState(false);
    const [pageSize, setPageSize] = useState<number>(
        uiConfig.dataPullPageSize ?? DEFAULT_DATA_PULL_PAGE_SIZE,
    );

    useEffect(() => {
        setPageSize(uiConfig.dataPullPageSize ?? DEFAULT_DATA_PULL_PAGE_SIZE);
    }, [uiConfig.dataPullPageSize]);

    async function saveConfig(patch: Partial<typeof uiConfig>) {
        const updated = { ...uiConfig, ...patch };
        try {
            await engine.mutate({
                type: "update",
                resource: "dataStore/eregisters",
                id: "ui-config",
                data: updated,
            });
        } catch {
            await engine.mutate({
                type: "create",
                resource: "dataStore/eregisters",
                data: { key: "ui-config", value: updated },
            });
        }
        await db.uiConfig.put({ id: "main", config: updated });
    }

    async function savePageSize() {
        setSavingPageSize(true);
        try {
            await saveConfig({ dataPullPageSize: pageSize });
            message.success("Data pull page size saved");
        } catch {
            message.error("Failed to save page size");
        } finally {
            setSavingPageSize(false);
        }
    }

    async function broadcast(type: "app" | "metadata") {
        const setter =
            type === "app" ? setBroadcastingApp : setBroadcastingMetadata;
        setter(true);
        try {
            const timestamp = new Date().toISOString();
            const updated = {
                ...uiConfig,
                reloadSignal: {
                    ...uiConfig.reloadSignal,
                    [type]: { timestamp },
                },
            };
            try {
                await engine.mutate({
                    type: "update",
                    resource: "dataStore/eregisters",
                    id: "ui-config",
                    data: updated,
                });
            } catch {
                await engine.mutate({
                    type: "create",
                    resource: "dataStore/eregisters",
                    data: { key: "ui-config", value: updated },
                });
            }
            await db.uiConfig.put({ id: "main", config: updated });
            message.success("Broadcast sent");
        } catch {
            message.error("Failed to broadcast signal");
        } finally {
            setter(false);
        }
    }

    const appTs = uiConfig.reloadSignal.app?.timestamp;
    const metadataTs = uiConfig.reloadSignal.metadata?.timestamp;

    return (
        <Flex vertical gap={24} style={{ maxWidth: 520 }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
                App Settings
            </Typography.Title>

            <Flex vertical gap={8}>
                <Typography.Text strong>Data Pull Page Size</Typography.Text>
                <Typography.Text type="secondary">
                    Number of tracked entities fetched per page when pulling
                    data from DHIS2. Higher values mean fewer requests but
                    larger payloads. Default is {DEFAULT_DATA_PULL_PAGE_SIZE}.
                </Typography.Text>
                <Flex gap={12} align="center">
                    <InputNumber
                        min={1}
                        max={1000}
                        value={pageSize}
                        onChange={(value) =>
                            setPageSize(value ?? DEFAULT_DATA_PULL_PAGE_SIZE)
                        }
                    />
                    <Button
                        type="primary"
                        loading={savingPageSize}
                        onClick={savePageSize}
                    >
                        Save
                    </Button>
                </Flex>
            </Flex>

            <Divider style={{ margin: 0 }} />

            <Flex vertical gap={8}>
                <Typography.Text strong>Force App Reload</Typography.Text>
                <Typography.Text type="secondary">
                    Sends a banner to all currently-online users asking them to
                    reload the page. Use after deploying a new app version.
                </Typography.Text>
                <Flex gap={12} align="center">
                    <Button
                        type="primary"
                        loading={broadcastingApp}
                        onClick={() => broadcast("app")}
                        style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                    >
                        Broadcast Reload Request
                    </Button>
                    {appTs && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Last broadcast: {dayjs(appTs).fromNow()}
                        </Typography.Text>
                    )}
                </Flex>
            </Flex>

            <Divider style={{ margin: 0 }} />

            <Flex vertical gap={8}>
                <Typography.Text strong>Force Metadata Refresh</Typography.Text>
                <Typography.Text type="secondary">
                    Sends a banner asking all currently-online users to pull the
                    latest metadata from DHIS2. Use after updating program rules
                    or data elements.
                </Typography.Text>
                <Flex gap={12} align="center">
                    <Button
                        type="primary"
                        loading={broadcastingMetadata}
                        onClick={() => broadcast("metadata")}
                        style={{ background: "#0ea5e9", borderColor: "#0ea5e9" }}
                    >
                        Broadcast Metadata Refresh
                    </Button>
                    {metadataTs && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Last broadcast: {dayjs(metadataTs).fromNow()}
                        </Typography.Text>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}
