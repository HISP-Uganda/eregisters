import {
    DeleteOutlined,
    FolderOpenOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Alert, Button, Empty, Flex, Input, Modal, Typography } from "antd";
import React, { useState } from "react";
import type { SavedLineListView } from "../../analytics/saved-views";
import { useIsMobile } from "../../hooks/useIsMobile";

const { Text } = Typography;

/**
 * "Save this view / reopen a saved view" for the Line List — a named,
 * persisted snapshot of the current filters/columns/table state (see
 * `analytics/saved-views.ts`'s doc comment for how this differs from the
 * one-shot, unnamed `AnalyticsRestoredState` round trip).
 */
export function SavedViewsModal({
    views,
    onSave,
    onLoad,
    onDelete,
    buildSnapshot,
}: {
    views: SavedLineListView[];
    onSave: (view: SavedLineListView) => void;
    onLoad: (view: SavedLineListView) => void;
    onDelete: (id: string) => void;
    /** Captures the caller's current filters/columns/table state — called
     * only at the moment the user confirms a save, so it always reflects
     * whatever's on screen right then, not whatever it was when the modal
     * opened. */
    buildSnapshot: () => Omit<SavedLineListView, "id" | "name" | "createdAt">;
}) {
    const [open, setOpen] = useState(false);
    const [savingAs, setSavingAs] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useIsMobile();

    const startSave = () => {
        setSavingAs("");
        setError(null);
    };
    const cancelSave = () => {
        setSavingAs(null);
        setError(null);
    };
    const confirmSave = () => {
        const name = (savingAs ?? "").trim();
        if (!name) {
            setError("Give this view a name.");
            return;
        }
        onSave({
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString(),
            ...buildSnapshot(),
        });
        setSavingAs(null);
        setError(null);
    };
    const load = (view: SavedLineListView) => {
        onLoad(view);
        setOpen(false);
    };

    return (
        <>
            <Button
                icon={<FolderOpenOutlined />}
                onClick={() => {
                    setOpen(true);
                    setSavingAs(null);
                    setError(null);
                }}
            >
                Saved views
                {views.length > 0 ? ` (${views.length})` : ""}
            </Button>
            <Modal
                title="Saved views"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={isMobile ? "94%" : 480}
            >
                <Flex vertical gap="middle">
                    {error && <Alert type="error" showIcon title={error} />}
                    {savingAs !== null ? (
                        <Flex vertical gap={8}>
                            <Text strong>Name</Text>
                            <Input
                                autoFocus
                                placeholder="e.g. This month's TB clients"
                                value={savingAs}
                                onChange={(event) =>
                                    setSavingAs(event.target.value)
                                }
                                onPressEnter={confirmSave}
                            />
                            <Flex justify="flex-end" gap={8}>
                                <Button onClick={cancelSave}>Cancel</Button>
                                <Button type="primary" onClick={confirmSave}>
                                    Save
                                </Button>
                            </Flex>
                        </Flex>
                    ) : (
                        <>
                            {views.length === 0 ? (
                                <Empty description="No saved views yet" />
                            ) : (
                                <Flex vertical gap={8}>
                                    {views.map((view) => (
                                        <Flex
                                            key={view.id}
                                            align="center"
                                            justify="space-between"
                                            style={{
                                                border: "1px solid #f0f0f0",
                                                borderRadius: 6,
                                                padding: "8px 12px",
                                            }}
                                        >
                                            <Flex
                                                vertical
                                                gap={0}
                                                style={{
                                                    minWidth: 0,
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => load(view)}
                                            >
                                                <Text strong>
                                                    {view.name}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: 12 }}
                                                >
                                                    {new Date(
                                                        view.createdAt,
                                                    ).toLocaleString()}
                                                </Text>
                                            </Flex>
                                            <Button
                                                danger
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    onDelete(view.id)
                                                }
                                            />
                                        </Flex>
                                    ))}
                                </Flex>
                            )}
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={startSave}
                            >
                                Save current view
                            </Button>
                        </>
                    )}
                </Flex>
            </Modal>
        </>
    );
}
