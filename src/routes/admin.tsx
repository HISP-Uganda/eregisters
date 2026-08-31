import {
    ApartmentOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {
    createRoute,
    Link,
    Outlet,
    redirect,
    useMatches,
} from "@tanstack/react-router";
import { Layout, Menu, Typography } from "antd";
import React, { useMemo } from "react";
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

const ADMIN_ITEMS = [
    {
        key: "section-layout",
        path: "/admin/section-layout",
        icon: <AppstoreOutlined />,
        label: "Section Layout",
    },
    {
        key: "app-settings",
        path: "/admin/app-settings",
        icon: <SettingOutlined />,
        label: "App Settings",
    },
    {
        key: "stage-relations",
        path: "/admin/stage-relations",
        icon: <ApartmentOutlined />,
        label: "Stage Relations",
    },
];

function AdminLayout() {
    const matches = useMatches();
    const selectedKey = useMemo(() => {
        const paths = matches.map((m) => m.pathname);
        const hit = ADMIN_ITEMS.find((item) =>
            paths.some((p) => p.startsWith(item.path)),
        );
        return hit?.key;
    }, [matches]);

    return (
        <Layout
            style={{
                height: "calc(100vh - 112px)",
                background: "#fff",
            }}
        >
            <Sider
                width={220}
                theme="light"
                breakpoint="lg"
                collapsedWidth={0}
                style={{
                    background: "#fafafa",
                    borderRight: "1px solid #f0f0f0",
                    overflow: "hidden",
                }}
            >
                <Typography.Text
                    style={{
                        display: "block",
                        padding: "16px 16px 8px",
                        color: "#8c8c8c",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                    }}
                >
                    Admin
                </Typography.Text>
                <Menu
                    mode="inline"
                    theme="light"
                    selectedKeys={selectedKey ? [selectedKey] : []}
                    style={{ background: "transparent", borderRight: 0 }}
                    items={ADMIN_ITEMS.map((item) => ({
                        key: item.key,
                        icon: item.icon,
                        label: <Link to={item.path}>{item.label}</Link>,
                    }))}
                />
            </Sider>
            <Content
                style={{
                    padding: 24,
                    background: "#fff",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Outlet />
            </Content>
        </Layout>
    );
}
