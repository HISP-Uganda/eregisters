import { createRoute, Outlet } from "@tanstack/react-router";
import { Flex, Form, Select, TreeSelect } from "antd";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import { every, isArray, orderBy } from "lodash";
import React from "react";
import PeriodPicker from "../components/period-picker";
import { Spinner } from "../components/spinner";
import { useMetadata } from "../hooks/useMetadata";
import { CategoryOptionCombo, DataSet, ReportSchema } from "../schemas";
import { RootRoute } from "./__root";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

export const ReportsRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: "/reports",
    component: Reports,
    pendingComponent: Spinner,
    validateSearch: ReportSchema,
});
function Reports() {
    const navigate = ReportsRoute.useNavigate();
    const { dataSets, organisationUnits, categoryOptionCombos } = useMetadata();
    const { dataSet, periodType, orgUnit, period, attribution } =
        ReportsRoute.useSearch();
    return (
        <Flex
            style={{
                padding: 5,
                height: "calc(100vh - 112px)",
                // overflow: "hidden",
            }}
            gap={5}
            vertical
        >
            <Flex gap={10} style={{ flexShrink: 0, flexWrap: "wrap" }}>
                <Form.Item label="Dataset">
                    <Select<string, DataSet>
                        options={dataSets}
                        fieldNames={{ label: "name", value: "id" }}
                        style={{ width: 400 }}
                        value={dataSet}
                        onChange={(value, option) => {
                            const periodType = isArray(option)
                                ? option[0].periodType
                                : option?.periodType;
                            navigate({
                                to: "/reports/$dataSet",
                                params: { dataSet: value },
                                search: (prev) => ({
                                    ...prev,
                                    dataSet: value,
                                    periodType,
                                    period: undefined,
                                }),
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item label="Organisation">
                    <TreeSelect
                        treeDataSimpleMode
                        treeData={orderBy(organisationUnits, "name", "asc").map(
                            (a) => ({
                                title: a.name,
                                id: a.id,
                                value: a.id,
                                pId: a.parent?.id,
                            }),
                        )}
                        style={{ width: 400 }}
                        showSearch={{ filterTreeNode: true }}
                        value={orgUnit}
                        onChange={(value) => {
                            navigate({
                                from: "/reports/$dataSet",
                                search: (prev) => ({
                                    ...prev,
                                    orgUnit: value,
                                }),
                            });
                        }}
                    />
                </Form.Item>

                <Form.Item label="Period">
                    <PeriodPicker
                        periodType={periodType}
                        value={period}
                        onChange={(value) => {
                            navigate({
                                from: "/reports/$dataSet",
                                search: (prev) => ({
                                    ...prev,
                                    period: value,
                                }),
                            });
                        }}
                    />
                </Form.Item>

                {dataSet !== "C4oUitImBPK" && (
                    <Form.Item label="Nationality">
                        <Select<string, CategoryOptionCombo>
                            options={orderBy(
                                categoryOptionCombos.flatMap((a) => {
                                    if (
                                        every(
                                            a.categoryOptions.map(
                                                (a) => a.access.data.write,
                                            ),
                                        )
                                    ) {
                                        return a;
                                    }
                                    return [];
                                }),
                                "name",
                                "asc",
                            )}
                            fieldNames={{ label: "name", value: "id" }}
                            style={{ width: 400 }}
                            value={attribution}
                            onChange={(value, option) => {
                                navigate({
                                    to: "/reports/$dataSet",
                                    params: { dataSet: value },
                                    search: (prev) => ({
                                        ...prev,
                                        attribution: value,
                                    }),
                                });
                            }}
                        />
                    </Form.Item>
                )}
            </Flex>
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Outlet />
            </div>
        </Flex>
    );
}
