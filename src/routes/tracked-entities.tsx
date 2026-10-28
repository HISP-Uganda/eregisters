import { CalendarOutlined, MedicineBoxOutlined, UserOutlined } from "@ant-design/icons";
import { createRoute, Outlet } from "@tanstack/react-router";
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
import React from "react";
import { DataElementField } from "@/components/data-element-field";
import { ClientSchema } from "@/schemas";
import { RootRoute } from "./__root";
import { requirePrograms } from "./require-programs";

import { useMetadata } from "@/hooks/useMetadata";
import {
    CLIENT_LIST_COLORS,
    CLIENT_LIST_TITLES,
    type ClientList,
    ClientListsContext,
    useClientListsSource,
} from "@/screens/client-search/client-lists";

const { Content } = Layout;
const { Title } = Typography;
export const TrackedEntitiesRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/tracked-entities",
    beforeLoad: ({ context: { syncActor } }) => requirePrograms(syncActor),
    component: TrackedEntities,
    validateSearch: ClientSchema,
});

function TrackedEntities() {
    const { program, trackedEntityAttributes, optionSets } =
        useMetadata();

    const [form] = Form.useForm();
    const clientLists = useClientListsSource();
    const navigate = TrackedEntitiesRoute.useNavigate();
    const { search, list } = TrackedEntitiesRoute.useSearch();

    const handleClear = () => {
        form.resetFields();
        navigate({
            search: (prev) => ({ ...prev, search: undefined }),
        });
    };

    const onStageSubmit = (values: any) => {
        navigate({
            search: (prev) => ({ ...prev, search: values, list: undefined }),
        });
    };

    // A card lists its clients in place of the search; clicking it again returns to the search.
    const toggleList = (card: ClientList) => {
        form.resetFields();
        navigate({
            search: (prev) => ({ ...prev, search: undefined, list: prev.list === card ? undefined : card }),
        });
    };

    const onFieldChange = () => {};

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    const isPhone = !screens.sm;

    const cards: Array<{ list: ClientList; icon: React.ReactNode; color: string }> = [
        { list: "all", icon: <UserOutlined />, color: CLIENT_LIST_COLORS.all },
        { list: "registeredToday", icon: <CalendarOutlined />, color: CLIENT_LIST_COLORS.registeredToday },
        { list: "visitsToday", icon: <MedicineBoxOutlined />, color: CLIENT_LIST_COLORS.visitsToday },
    ];
    const statsSection = (
        <Flex gap={8} style={{ marginBottom: 8 }}>
            {cards.map((card) => (
                <Card
                    key={card.list}
                    variant="borderless"
                    hoverable
                    size={isMobile ? "small" : undefined}
                    onClick={() => toggleList(card.list)}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        cursor: "pointer",
                        outline: list === card.list ? `2px solid ${card.color}` : undefined,
                    }}
                    aria-pressed={list === card.list}
                >
                    <Statistic
                        title={CLIENT_LIST_TITLES[card.list]}
                        loading={clientLists.counts[card.list] === undefined}
                        value={clientLists.counts[card.list]}
                        prefix={isPhone ? undefined : card.icon}
                        styles={{
                            title: isPhone ? { fontSize: 12, lineHeight: 1.3 } : undefined,
                            content: { color: card.color, fontSize: isPhone ? 20 : undefined },
                        }}
                    />
                </Card>
            ))}
        </Flex>
    );

    const searchForm = (
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
    );

    return (
        <Content
            style={{
                padding: isMobile ? 8 : 16,
            }}
        >
            <Row gutter={isMobile ? [8, 8] : [16, 16]}>
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
                        {searchForm}
                    </Card>
                </Col>
                <Col xs={24} lg={16}>
                    {!isMobile && statsSection}
                    <ClientListsContext.Provider value={clientLists}>
                        <Outlet />
                    </ClientListsContext.Provider>
                </Col>
            </Row>
        </Content>
    );
}
