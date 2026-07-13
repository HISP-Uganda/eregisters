import { SettingOutlined, AppstoreOutlined } from "@ant-design/icons";
import { createRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Layout, Menu, Typography } from "antd";
import React from "react";
import { SyncContext } from "../machines/sync";
import { RootRoute } from "./__root";

const { Sider, Content } = Layout;

export const AdminRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/admin",
    beforeLoad: ({ context: { syncActor } }) => {
        const authorities =
            syncActor.getSnapshot().context.userInfo?.authorities ?? [];
        if (!authorities.includes("ALL")) {
            throw redirect({ to: "/" });
        }
    },
    component: AdminLayout,
});

function AdminLayout() {
    return (
        <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
            <Sider
                width={200}
                style={{ background: "#1e1b4b" }}
                breakpoint="lg"
                collapsedWidth={0}
            >
                <div
                    style={{
                        padding: "16px 12px 8px",
                        color: "#a5b4fc",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                    }}
                >
                    Admin
                </div>
                <Menu
                    mode="inline"
                    theme="dark"
                    style={{ background: "#1e1b4b", borderRight: 0 }}
                    items={[
                        {
                            key: "section-layout",
                            icon: <AppstoreOutlined />,
                            label: (
                                <Link to="/admin/section-layout">
                                    Section Layout
                                </Link>
                            ),
                        },
                        {
                            key: "app-settings",
                            icon: <SettingOutlined />,
                            label: (
                                <Link to="/admin/app-settings">
                                    App Settings
                                </Link>
                            ),
                        },
                    ]}
                />
            </Sider>
            <Content style={{ padding: 24, background: "#fff" }}>
                <Outlet />
            </Content>
        </Layout>
    );
}
