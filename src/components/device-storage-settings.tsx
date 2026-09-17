import { App, Drawer, Flex, Modal, Radio, Tag, Typography } from "antd";
import React, { useState } from "react";
import {
    getBackendSetting,
    hasOpfsCapability,
    setBackendSetting,
    type BackendSetting,
    type StorageBackend,
} from "../db/backend";
import { SyncContext } from "../machines/sync";

const { Text, Paragraph } = Typography;

/**
 * Per-device storage backend setting — wayfinder ticket "Per-device
 * backend setting - UI placement and states"
 * (`docs/wayfinder/opfs-dexie-dual-backend/tickets/004-settings-ui-placement.md`).
 * Placement, persistence, and the 3-option radio + confirm-before-switch
 * flow are built for real and match the ticket's resolved design
 * (prototyped at https://claude.ai/artifact/B2LLpaxAjCbg9TwxW6TXTA).
 *
 * Confirming a switch persists the setting, then reloads the page —
 * `App.tsx`'s bootstrap now branches on the resolved backend (commit
 * `a017cb0`) and, on the reload that lands on Dexie, makes a best-effort
 * attempt to run the real reverse migration
 * (`src/db/dexie/migrate-from-sqlite.ts`) in the background per wayfinder
 * ticket "Wiring the reverse migration to actually execute on a backend
 * switch" (`docs/wayfinder/opfs-dexie-dual-backend/tickets/006-wire-backend-switch-migration.md`).
 * Progress/failure are reported by the existing `MigrationProgressBanner`
 * (same pub/sub the forward direction already used) — this component
 * itself has no progress/per-table-checklist UI of its own, by that
 * ticket's design (reusing the existing banner instead of building a
 * second one).
 */

const BACKEND_LABEL: Record<StorageBackend, string> = {
    sqlite: "SQLite",
    dexie: "IndexedDB",
};

function detectedBackend(): StorageBackend {
    // Lightweight, synchronous hint only — the same capability pre-check
    // `resolveBackend` (src/db/backend.ts) uses as its first, cheap step.
    // Not a full "would SQLite actually init successfully" attempt (that
    // needs a real, side-effecting `initSqlDriver` call) — just enough to
    // show a plausible default label here.
    return hasOpfsCapability() ? "sqlite" : "dexie";
}

const OPTIONS: Array<{ value: BackendSetting; title: string; description: string }> = [
    {
        value: "auto",
        title: "Auto",
        description:
            "Let the app decide. Uses SQLite unless this device can't support it, then falls back to IndexedDB automatically.",
    },
    {
        value: "dexie",
        title: "Force IndexedDB",
        description:
            "Always use the IndexedDB storage path on this device, even if SQLite would work. Useful if this device has had storage problems.",
    },
    {
        value: "sqlite",
        title: "Force SQLite",
        description: "Always use the SQLite storage path on this device.",
    },
];

export function DeviceStorageSettings({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { message } = App.useApp();
    const actualCurrentBackend = SyncContext.useSelector(
        (a) => a.context.backend,
    );
    // No setter needed — confirming a switch reloads the page (see
    // confirmSwitch below), so this never needs to update in place.
    const [setting] = useState<BackendSetting>(() => getBackendSetting());
    const [pendingSetting, setPendingSetting] = useState<BackendSetting | null>(
        null,
    );

    const detected = detectedBackend();

    const handleSelect = (next: BackendSetting) => {
        if (next === setting) return;
        setPendingSetting(next);
    };

    const confirmSwitch = () => {
        if (!pendingSetting) return;
        setBackendSetting(pendingSetting);
        message.success("Storage setting saved — reloading…");
        // A reload is required: App.tsx's bootstrap resolves the backend
        // (and, for a switch to Dexie, attempts the real reverse
        // migration) once, at startup — there's no live hot-swap path.
        window.location.reload();
    };

    return (
        <>
            <Drawer
                title="Device Storage"
                placement="right"
                onClose={onClose}
                open={open}
                size={340}
            >
                <Flex vertical gap="middle">
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        Controls where this device keeps client and visit
                        data before it syncs. This setting only affects this
                        device — other devices signed in to the same account
                        choose independently.
                    </Paragraph>
                    <Radio.Group
                        value={setting}
                        onChange={(e) => handleSelect(e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <Flex vertical gap="small">
                            {OPTIONS.map((option) => (
                                <div
                                    key={option.value}
                                    style={{
                                        border: "1px solid",
                                        borderColor:
                                            setting === option.value
                                                ? "#1677ff"
                                                : "#e5e7eb",
                                        borderRadius: 8,
                                        padding: "10px 12px",
                                        background:
                                            setting === option.value
                                                ? "#e6f4ff"
                                                : undefined,
                                    }}
                                >
                                    <Radio value={option.value}>
                                        <Flex align="center" gap={8}>
                                            <Text strong>{option.title}</Text>
                                            {option.value === "auto" && (
                                                <Tag color="green">
                                                    detected:{" "}
                                                    {BACKEND_LABEL[detected]}
                                                </Tag>
                                            )}
                                            {(option.value === "sqlite" ||
                                                option.value === "dexie") &&
                                                option.value ===
                                                    actualCurrentBackend && (
                                                    <Tag color="blue">
                                                        current
                                                    </Tag>
                                                )}
                                        </Flex>
                                    </Radio>
                                    <Paragraph
                                        type="secondary"
                                        style={{
                                            fontSize: 12,
                                            margin: "4px 0 0 24px",
                                        }}
                                    >
                                        {option.description}
                                    </Paragraph>
                                </div>
                            ))}
                        </Flex>
                    </Radio.Group>
                </Flex>
            </Drawer>

            <Modal
                title={
                    pendingSetting
                        ? `Switch to ${
                              pendingSetting === "auto"
                                  ? "Auto"
                                  : BACKEND_LABEL[pendingSetting]
                          }?`
                        : ""
                }
                open={pendingSetting !== null}
                onCancel={() => setPendingSetting(null)}
                onOk={confirmSwitch}
                okText="Save and reload"
                cancelText="Cancel"
            >
                <Paragraph>
                    This device currently runs on{" "}
                    <Text strong>{BACKEND_LABEL[actualCurrentBackend]}</Text>
                    .
                </Paragraph>
                <Paragraph>
                    The app will reload to apply this. Your existing client
                    and visit data on this device will be copied over
                    automatically in the background after reload — nothing
                    is deleted from{" "}
                    <Text strong>{BACKEND_LABEL[actualCurrentBackend]}</Text>{" "}
                    until the copy is verified. Don&apos;t close the app
                    while a "Upgrading local storage…" banner is showing.
                </Paragraph>
            </Modal>
        </>
    );
}
