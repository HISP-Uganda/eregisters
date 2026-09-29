import { CloudUploadOutlined } from "@ant-design/icons";
import { Badge, Button, Flex, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";

dayjs.extend(relativeTime);

const NO_PROGRAM = "Disabled — no program assigned";

type SyncButtonProps = {
    tooltip: string;
    icon: React.ReactNode;
    isLoading: boolean;
    idleLabel: string;
    loadingLabel: string;
    /** A second line, e.g. when it last ran. */
    lastTime?: string;
    onClick: () => void;
    type?: "primary" | "default";
    danger?: boolean;
    disabled?: boolean;
};

function ButtonLabel({ isLoading, idleLabel, loadingLabel, lastTime }: Omit<SyncButtonProps, "tooltip" | "icon" | "onClick">) {
    return (
        <Flex vertical align="flex-start" gap={0}>
            <span>{isLoading ? loadingLabel : idleLabel}</span>
            {lastTime && (
                <Typography.Text type="secondary" style={{ fontSize: 10, lineHeight: 1 }}>
                    {lastTime}
                </Typography.Text>
            )}
        </Flex>
    );
}

/** A header button with a two-line label. */
export function SyncButton(props: SyncButtonProps) {
    const { tooltip, icon, isLoading, onClick, type, danger, disabled } = props;
    return (
        <Tooltip title={disabled ? NO_PROGRAM : tooltip}>
            <Button
                icon={icon}
                loading={isLoading}
                onClick={onClick}
                type={type}
                danger={danger}
                disabled={disabled}
                style={{ height: "auto", padding: "4px 12px" }}
            >
                <ButtonLabel {...props} />
            </Button>
        </Tooltip>
    );
}

/** A sync button that can't be pressed again while its sync runs. */
export function SplitSyncButton({ primaryAction, ...props }: Omit<SyncButtonProps, "onClick"> & { primaryAction: () => void }) {
    const { tooltip, icon, isLoading, type, danger, disabled } = props;
    return (
        <Tooltip title={disabled ? NO_PROGRAM : tooltip}>
            <Button
                icon={icon}
                loading={isLoading}
                onClick={primaryAction}
                type={type}
                danger={danger}
                disabled={disabled || isLoading}
                style={{ height: "auto", padding: "4px 12px" }}
            >
                <ButtonLabel {...props} />
            </Button>
        </Tooltip>
    );
}

/** "Push Data", with the number of records waiting to go. */
export function PushDataButton({
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
        <Tooltip title={disabled ? NO_PROGRAM : "Push pending records to the server"}>
            <Badge count={pendingCount} style={{ backgroundColor: "#faad14" }} title="Pending entities to sync" showZero>
                <SyncButton
                    tooltip="Push Data"
                    icon={<CloudUploadOutlined />}
                    isLoading={isLoading}
                    idleLabel="Push Data"
                    loadingLabel="Pushing..."
                    lastTime={lastDataPush ? dayjs(lastDataPush).fromNow() : undefined}
                    onClick={onPush}
                    danger
                    disabled={disabled}
                />
            </Badge>
        </Tooltip>
    );
}
