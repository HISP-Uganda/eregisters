import { UserAddOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import {
    Button,
    Flex,
    Form,
    Grid,
    Modal,
    Spin,
    Tooltip,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import type { SaveBlock } from "../utils/save-block";
import { SyncStatusComp } from "./sync-status-comp";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../schemas";

function renderBlockTooltip(block: SaveBlock): React.ReactNode {
    const lines: string[] = [];
    if (block.missing.length > 0) {
        lines.push(`Fill: ${block.missing.map((m) => m.label).join(", ")}`);
    }
    if (block.errors.length > 0) {
        lines.push(`Fix: ${block.errors.join("; ")}`);
    }
    if (lines.length === 0) return "";
    return <div style={{ whiteSpace: "pre-line" }}>{lines.join("\n")}</div>;
}

interface DataModalProps<T extends FlattenedTrackedEntity | FlattenedEvent> {
    open: boolean;
    data: T | null;
    onClose: () => void;
    onCancel?: () => Promise<void>;
    onSave: (currentInfo: {
        values: Record<string, any>;
        addAnother?: boolean;
    }) => void | Promise<void>;
    enrollment: FlattenedEnrollment | null;
    title?: string;
    children: (form: FormInstance) => React.ReactNode;
    submitButtonText?: string;
    hasAddAnother?: boolean;
    status?: string;
    saveBlockFor?: (values: Record<string, unknown>) => SaveBlock;
}

const { Text } = Typography;

interface ModalContentProps<T extends FlattenedTrackedEntity | FlattenedEvent> {
    children: (form: FormInstance) => React.ReactNode;
    onSave: DataModalProps<T>["onSave"];
    onClose: () => void;
    isMobile: boolean;
    submitButtonText: string;
    hasAddAnother: boolean;
    status: string;
    saveBlockFor?: (values: Record<string, unknown>) => SaveBlock;
    title: React.ReactNode;
    open: boolean;
    onCancel: () => void;
    loading: boolean;
    setLoading: (v: boolean) => void;
}

function ModalContent<T extends FlattenedTrackedEntity | FlattenedEvent>({
    children,
    onSave,
    onClose,
    isMobile,
    submitButtonText,
    hasAddAnother,
    status,
    saveBlockFor,
    title,
    open,
    onCancel,
    loading,
    setLoading,
}: ModalContentProps<T>) {
    const [form] = Form.useForm<T>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const watchedValues: Record<string, any> = Form.useWatch((values) => values, form) ?? {};
    const block = saveBlockFor?.(watchedValues);
    const blocked = Boolean(
        block && (block.missing.length > 0 || block.errors.length > 0),
    );
    const tooltipTitle = blocked && block ? renderBlockTooltip(block) : "";

    const [contentReady, setContentReady] = useState(false);

    useEffect(() => {
        if (open) {
            setContentReady(false);
            const raf = requestAnimationFrame(() => setContentReady(true));
            return () => cancelAnimationFrame(raf);
        } else {
            setContentReady(false);
        }
    }, [open]);

    const handleOk = async (addAnother = false) => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await onSave({ values, addAnother });
            if (!addAnother) {
                onClose();
            }
        } catch (error) {
            console.error("Validation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onCancel={onCancel}
                centered
                destroyOnHidden={true}
                confirmLoading={loading}
                mask={{ closable: false }}
                title={title}
                width="97vw"
                footer={
                    <Flex
                        justify={isMobile ? "center" : "space-between"}
                        align={isMobile ? "stretch" : "center"}
                        vertical={isMobile}
                        gap={isMobile ? 8 : 0}
                        style={{ padding: "8px 0" }}
                    >
                        <SyncStatusComp syncStatus={status} />
                        <Flex
                            gap="middle"
                            vertical={isMobile}
                            style={isMobile ? { width: "100%" } : undefined}
                        >
                            <Button
                                onClick={onCancel}
                                disabled={loading}
                                style={{
                                    borderRadius: 8,
                                    ...(isMobile && { width: "100%" }),
                                }}
                            >
                                Cancel
                            </Button>
                            <Tooltip title={tooltipTitle}>
                                <span>
                                    <Button
                                        type="primary"
                                        onClick={() => handleOk()}
                                        loading={loading}
                                        disabled={blocked || loading}
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
                                            borderColor: "#7c3aed",
                                            borderRadius: 8,
                                            fontWeight: 500,
                                            ...(isMobile
                                                ? {
                                                      width: "100%",
                                                      whiteSpace:
                                                          "normal" as const,
                                                      wordBreak:
                                                          "break-word" as const,
                                                      height: "auto",
                                                      padding: "8px 16px",
                                                  }
                                                : {
                                                      paddingLeft: 32,
                                                      paddingRight: 32,
                                                  }),
                                        }}
                                    >
                                        {submitButtonText}
                                    </Button>
                                </span>
                            </Tooltip>
                            {hasAddAnother && (
                                <Tooltip title={tooltipTitle}>
                                    <span>
                                        <Button
                                            type="primary"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
                                                borderColor: "#7c3aed",
                                                borderRadius: 8,
                                                fontWeight: 500,
                                                ...(isMobile
                                                    ? {
                                                          width: "100%",
                                                          whiteSpace:
                                                              "normal" as const,
                                                          wordBreak:
                                                              "break-word" as const,
                                                          height: "auto",
                                                          padding: "8px 16px",
                                                      }
                                                    : {
                                                          paddingLeft: 32,
                                                          paddingRight: 32,
                                                      }),
                                            }}
                                            onClick={() => handleOk(true)}
                                            loading={loading}
                                            disabled={blocked || loading}
                                        >
                                            {submitButtonText} & add another
                                        </Button>
                                    </span>
                                </Tooltip>
                            )}
                        </Flex>
                    </Flex>
                }
                styles={{
                    body: {
                        maxHeight: "75vh",
                        overflow: "auto",
                    },
                    wrapper: {},
                    container: {
                        backgroundColor: "#f5f5f5",
                    },
                }}
            >
                {contentReady ? (
                    children(form)
                ) : (
                    <Flex
                        justify="center"
                        align="center"
                        style={{ padding: 40 }}
                    >
                        <Spin size="large" />
                    </Flex>
                )}
            </Modal>
        </>
    );
}

export function DataModal<T extends FlattenedTrackedEntity | FlattenedEvent>({
    open,
    onClose,
    onCancel,
    onSave,
    title = "Edit Data",
    children,
    submitButtonText = "Save",
    hasAddAnother = false,
    status = "draft",
    saveBlockFor,
}: DataModalProps<T>) {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const [loading, setLoading] = useState(false);
    const [openCount, setOpenCount] = useState(0);

    useEffect(() => {
        if (open) {
            setOpenCount((c) => c + 1);
        }
    }, [open]);

    const handleCancel = () => {
        onClose();
        onCancel?.();
    };

    const titleNode = (
        <Flex align="center" gap="middle">
            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                        "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                }}
            >
                <UserAddOutlined style={{ fontSize: 20 }} />
            </div>
            <Text strong style={{ fontSize: 18, color: "#1f2937" }}>
                {title}
            </Text>
        </Flex>
    );

    return (
        <ModalContent<T>
            key={openCount}
            open={open}
            onClose={onClose}
            onCancel={handleCancel}
            onSave={onSave}
            isMobile={isMobile}
            submitButtonText={submitButtonText}
            hasAddAnother={hasAddAnother}
            status={status}
            saveBlockFor={saveBlockFor}
            title={titleNode}
            loading={loading}
            setLoading={setLoading}
        >
            {children}
        </ModalContent>
    );
}
