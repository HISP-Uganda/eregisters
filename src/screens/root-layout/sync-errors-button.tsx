import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Flex, Tooltip, Typography } from "antd";
import type { MenuProps } from "antd";
import React from "react";
import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "@/schemas";
import { FailurePreview, failurePreview } from "./failures";

const { Text } = Typography;

function FailureMenuItem({ typeLabel, typeColor, title, subtitle, error }: FailurePreview) {
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
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                        {subtitle}
                    </Text>
                )}
            </Flex>
            <Text style={{ fontSize: 11, color: "#ff4d4f", whiteSpace: "normal", lineHeight: 1.3 }}>
                {error}
            </Text>
        </Flex>
    );
}

function menuItems(
    failed: Parameters<typeof failurePreview>[0],
    stageNames: Map<string, string>,
    total: number,
    onOpenAll: () => void,
): MenuProps["items"] {
    if (total === 0) {
        return [
            {
                key: "no-failures",
                label: (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        No failed records
                    </Text>
                ),
                disabled: true,
            },
        ];
    }
    const { items, remaining } = failurePreview(failed, stageNames);
    return [
        ...items.map((item) => ({
            key: item.key,
            label: <FailureMenuItem {...item} />,
            onClick: onOpenAll,
        })),
        ...(remaining > 0
            ? [
                  { key: "more-divider", type: "divider" as const },
                  {
                      key: "more",
                      label: (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                              …and {remaining} more
                          </Text>
                      ),
                      onClick: onOpenAll,
                  },
              ]
            : []),
        { key: "all-divider", type: "divider" as const },
        {
            key: "view-all",
            label: (
                <Flex align="center" gap={8}>
                    <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                    <Text strong>View all failures ({total})</Text>
                </Flex>
            ),
            onClick: onOpenAll,
        },
    ];
}

/** The header's "Errors" button: a preview of failed records, and "View all". */
export function SyncErrorsButton({
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
    const failed = { events: failedEvents, enrollments: failedEnrollments, trackedEntities: failedTrackedEntities };
    const failedCount = failedEvents.length + failedEnrollments.length + failedTrackedEntities.length;
    const hasFailures = failedCount > 0;
    return (
        <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
                items: menuItems(failed, stageNameMap, failedCount, onOpenAll),
                style: { maxWidth: 420, maxHeight: 480, overflowY: "auto" },
            }}
        >
            <Tooltip title={hasFailures ? "Click to view failed records and their errors" : "No sync errors"}>
                <Badge count={failedCount} style={{ backgroundColor: "#ff4d4f" }} title="Failed sync records" showZero>
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
                                <span style={{ fontSize: 10, lineHeight: 1, color: "#8c8c8c" }}>
                                    {failedCount === 1 ? "1 failed record" : `${failedCount} failed records`}
                                </span>
                            </Flex>
                            <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                        </Flex>
                    </Button>
                </Badge>
            </Tooltip>
        </Dropdown>
    );
}
