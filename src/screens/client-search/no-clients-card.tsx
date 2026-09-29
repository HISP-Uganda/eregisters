import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Grid, Space, Typography } from "antd";
import React from "react";
import { RegisterClientModal, useClientRegistration } from "./register-client";

/**
 * Shown when a search found nobody (or nothing was searched yet): a
 * prompt, and "Register New Client" pre-filled with what was searched for.
 */
export function NoClientsCard({
    message,
    searchTerms = {},
}: {
    message: string;
    searchTerms?: Record<string, string>;
}) {
    const isMobile = !Grid.useBreakpoint().lg;
    const registration = useClientRegistration();

    return (
        <Card
            variant="borderless"
            style={{
                textAlign: "center",
                height: isMobile ? undefined : "calc(100vh - 144px - 127px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <Typography.Title level={3} style={{ color: "#2c3e50", margin: 0 }}>
                    {message}
                </Typography.Title>
                <Typography.Text
                    style={{
                        fontSize: "16px",
                        color: "#5a6c7d",
                        lineHeight: "1.6",
                        display: "block",
                        maxWidth: "500px",
                        margin: "0 auto",
                    }}
                >
                    Try refining your search criteria or checking registration details before registering a new
                    client.
                </Typography.Text>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => registration.start(searchTerms)}
                    style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
                        borderColor: "#7c3aed",
                        height: "48px",
                        paddingLeft: 32,
                        paddingRight: 32,
                        fontSize: "16px",
                    }}
                >
                    Register New Client
                </Button>
            </Space>
            <RegisterClientModal registration={registration} />
        </Card>
    );
}
