import { App, Drawer, Flex, Modal, Radio, Tag, Typography } from "antd";
import React, { useState } from "react";
import {
    getBackendSetting,
    hasOpfsCapability,
    setBackendSetting,
    type BackendSetting,
    type StorageBackend,
} from "../db/backend";

const { Text, Paragraph } = Typography;

/**
 * Per-device storage backend setting — wayfinder ticket "Per-device
 * backend setting - UI placement and states"
 * (`docs/wayfinder/opfs-dexie-dual-backend/tickets/004-settings-ui-placement.md`).
 * Placement, persistence, and the 3-option radio + confirm-before-switch
 * flow are built for real and match the ticket's resolved design
 * (prototyped at https://claude.ai/artifact/B2LLpaxAjCbg9TwxW6TXTA).
 *
 * What's deliberately NOT real yet: actually executing a switch.
 * `App.tsx`'s bootstrap always initializes SQLite unconditionally and
 * doesn't consult this setting — wiring that in requires making
 * `SyncContext`'s `sqlDriver` input backend-aware across `sync.ts`'s 52
 * direct references to it (see ticket 001's "Not built" note), which is
 * its own separate, carefully-scoped piece of work. Running the reverse
 * migration (`src/db/dexie/migrate-from-sqlite.ts`) for real here, before
 * that wiring exists, would be actively harmful: `App.tsx`'s already-live
 * *forward* migration would see the freshly-copied Dexie data on the very
 * next reload and silently copy it straight back to SQLite, undoing the
 * switch without telling the user. So confirming a switch here only
 * persists the choice (for whenever that wiring lands) — it does not
 * move any data. The prototype's progress/per-table-checklist/failure
 * states aren't built for the same reason: there's no real progress to
 * show yet.
 */

const BACKEND_LABEL: Record<StorageBackend, string> = {
    sqlite: "SQLite",
    dexie: "IndexedDB",
};

/**
 * Which backend this device is ACTUALLY running on right now. Hardcoded
 * to "sqlite" — true unconditionally today, since `App.tsx` never
 * initializes anything else. Replace with a real read (e.g. from
 * `SyncContext`) once the backend-selection wiring above lands.
 */
const ACTUAL_CURRENT_BACKEND: StorageBackend = "sqlite";

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
    const [setting, setSetting] = useState<BackendSetting>(() =>
        getBackendSetting(),
    );
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
        setSetting(pendingSetting);
        setPendingSetting(null);
        message.success("Storage setting saved for this device.");
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
                                                    ACTUAL_CURRENT_BACKEND && (
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
                okText="Save setting"
                cancelText="Cancel"
            >
                <Paragraph>
                    This device currently runs on{" "}
                    <Text strong>{BACKEND_LABEL[ACTUAL_CURRENT_BACKEND]}</Text>
                    .
                </Paragraph>
                <Paragraph>
                    Actually moving your data between storage backends
                    isn&apos;t available in this app version yet — saving
                    this won&apos;t move anything or change what this device
                    uses today. It records your preference so it takes
                    effect automatically once that update ships.
                </Paragraph>
            </Modal>
        </>
    );
}
