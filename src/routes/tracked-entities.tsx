import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import {
    Button,
    Card,
    Col,
    Flex,
    Form,
    Grid,
    Layout,
    Row,
    Statistic,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { DataElementField } from "@/components/data-element-field";
import { ClientSchema } from "@/schemas";
import { RootRoute } from "./__root";

import dayjs from "dayjs";
import { countClients, subscribeClientWrites, type ClientCounts } from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";

const { Content } = Layout;

/**
 * The org unit's client count and how many were registered today, kept
 * current as clients are written (including by a pull).
 */
function useClientCounts(orgUnit: string) {
    const [counts, setCounts] = useState<ClientCounts>({ total: 0, recentCreatedAt: [] });
    useEffect(() => {
        let current = true;
        const refresh = () => {
            const since = dayjs().subtract(2, "day").format("YYYY-MM-DD");
            countClients(orgUnit, since)
                .then((next) => {
                    if (current) setCounts(next);
                })
                .catch((error) => console.warn("Counting clients failed", error));
        };
        refresh();
        const unsubscribe = subscribeClientWrites(refresh);
        return () => {
            current = false;
            unsubscribe();
        };
    }, [orgUnit]);
    const today = dayjs().format("YYYY-MM-DD");
    return {
        total: counts.total,
        registeredToday: counts.recentCreatedAt.filter((at) => dayjs(at).format("YYYY-MM-DD") === today).length,
    };
}
const { Title } = Typography;
export const TrackedEntitiesRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/tracked-entities",
    beforeLoad: ({ context: { syncActor } }) => {
        const organizationUnits =
            syncActor.getSnapshot().context.userInfo.organisationUnits;
        const programs = organizationUnits.flatMap((a) => a.programs);
        if (programs.length === 0) {
            throw redirect({ to: "/reports" });
        }
    },
    component: TrackedEntities,
    validateSearch: ClientSchema,
});

function TrackedEntities() {
    const { program, trackedEntityAttributes, optionSets, orgUnit } =
        useMetadata();
    const [form] = Form.useForm();

    const { total, registeredToday } = useClientCounts(orgUnit);
    const navigate = TrackedEntitiesRoute.useNavigate();
    const { search } = TrackedEntitiesRoute.useSearch();

    const handleClear = () => {
        form.resetFields();
        navigate({
            search: (prev) => ({ ...prev, search: undefined }),
        });
    };

    const onStageSubmit = (values: any) => {
        navigate({
            search: (prev) => {
                return {
                    ...prev,
                    search: values,
                };
            },
        });
    };

    const onFieldChange = () => {};

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;

    const statsSection = (
        <Flex gap={8} style={{ marginBottom: 8 }}>
            <Card variant="borderless" style={{ flex: 1 }}>
                <Statistic
                    title="Total Clients"
                    value={total}
                    prefix={<UserOutlined />}
                    styles={{
                        content: { color: "#1f4788" },
                    }}
                />
            </Card>
            <Card variant="borderless" style={{ flex: 1 }}>
                <Statistic
                    title="Registered Today"
                    value={registeredToday}
                    prefix={<CalendarOutlined />}
                    styles={{
                        content: { color: "#52c41a" },
                    }}
                />
            </Card>
        </Flex>
    );

    return (
        <Content
            style={{
                padding: "16px",
            }}
        >
            <Row gutter={[16, 16]}>
                {isMobile && <Col span={24}>{statsSection}</Col>}
                <Col xs={24} lg={8}>
                    <Card
                        title={<Title level={4}>Search clients</Title>}
                        variant="borderless"
                        style={{
                            height: isMobile
                                ? undefined
                                : "calc(100vh - 144px)",
                        }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onStageSubmit}
                            style={{ margin: 0, padding: 0 }}
                            initialValues={search}
                        >
                            <Row gutter={[16, 16]}>
                                {program?.programTrackedEntityAttributes.flatMap(
                                    ({
                                        trackedEntityAttribute: { id },
                                        searchable,
                                    }) => {
                                        if (!searchable) {
                                            return [];
                                        }
                                        const current =
                                            trackedEntityAttributes.get(id);

                                        if (current === undefined) {
                                            return [];
                                        }
                                        const optionSet =
                                            current.optionSet?.id ?? "";

                                        const finalOptions =
                                            optionSets.get(optionSet) ?? [];

                                        return (
                                            <DataElementField
                                                key={id}
                                                dataElement={current}
                                                hidden={false}
                                                finalOptions={finalOptions}
                                                messages={[]}
                                                warnings={[]}
                                                errors={[]}
                                                required={false}
                                                xs={24}
                                                sm={24}
                                                md={24}
                                                lg={24}
                                                xl={24}
                                                form={form}
                                                onFieldChange={onFieldChange}
                                            />
                                        );
                                    },
                                )}
                                <Col span={24}>
                                    <Flex align="center" gap={20}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Search
                                        </Button>
                                        <Button onClick={handleClear}>
                                            Clear
                                        </Button>
                                    </Flex>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} lg={16}>
                    {!isMobile && statsSection}
                    <Outlet />
                </Col>
            </Row>
        </Content>
    );
}
