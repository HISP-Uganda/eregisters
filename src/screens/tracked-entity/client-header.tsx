import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Tag, Typography } from "antd";
import React from "react";
import { SyncStatusComp } from "@/components/sync-status-comp";
import { FlattenedTrackedEntity } from "@/schemas";
import { clientSummary } from "./client";

export function ClientHeader({
    trackedEntity,
    isMobile,
    onBack,
}: {
    trackedEntity: FlattenedTrackedEntity;
    isMobile: boolean;
    onBack: () => void;
}) {
    const { firstName, surname, sex, age } = clientSummary(trackedEntity);
    return (
        <Flex
            vertical={isMobile}
            align={isMobile ? "flex-start" : "center"}
            gap={isMobile ? 4 : 8}
            style={{
                padding: 10,
                borderBottom: "1px solid #f0f0f0",
                background: "#fff",
            }}
        >
            <Button icon={<ArrowLeftOutlined />} type="text" onClick={onBack}>
                Back
            </Button>
            <Flex
                align="center"
                gap={8}
                wrap
                justify="space-between"
                style={{ width: "100%" }}
            >
                <Flex align="center" gap={8}>
                    <UserOutlined
                        style={{
                            fontSize: isMobile ? 16 : 18,
                            color: "#1f4788",
                        }}
                    />
                    <Typography.Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
                        {firstName} {surname}
                    </Typography.Title>
                    {age !== null && <Tag color="blue">{age} yrs</Tag>}
                    <Tag color="purple">{sex}</Tag>

                    <SyncStatusComp syncStatus={trackedEntity.syncStatus} />
                </Flex>
            </Flex>
        </Flex>
    );
}
