import { createRoute, Outlet } from "@tanstack/react-router";
import { Flex, Form, Select, TreeSelect } from "antd";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import { every, isArray, orderBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import PeriodPicker from "../components/period-picker";
import { Spinner } from "../components/spinner";
import { useMetadata } from "../hooks/useMetadata";
import { CategoryOptionCombo, DataSet, ReportSchema } from "../schemas";
import { RootRoute } from "./__root";
import { SafeKey } from "antd/es/table/interface";
import { buildOrgUnitSearchIndex, matchOrgUnit } from "./org-unit-search";

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

    const [expanded, setExpanded] = useState<SafeKey[]>([]);
    const [orgUnitSearch, setOrgUnitSearch] = useState("");

    const orgUnitSearchIndex = useMemo(
        () => buildOrgUnitSearchIndex(organisationUnits),
        [organisationUnits],
    );

    const orgUnitTreeData = useMemo(
        () =>
            orderBy(organisationUnits, "name", "asc").map((a) => ({
                title: a.name,
                id: a.id,
                value: a.id,
                pId: a.parent?.id,
            })),
        [organisationUnits],
    );

    useEffect(() => {
        const search = organisationUnits.find(({ id }) => id === orgUnit);
        if (!search) return;
        const lineage = search.path.split("/").slice(1, -1);
        setExpanded((prev) => {
            const next = new Set<SafeKey>(prev);
            for (const id of lineage) next.add(id);
            return Array.from(next);
        });
    }, [orgUnit, organisationUnits]);

    return (
        <Flex vertical style={{ padding: 5 }}>
            <Flex gap={10}>
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
                                to: "/reports/hmis",
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
                        showSearch
                        allowClear
                        placeholder="Search organisation…"
                        treeNodeFilterProp="title"
                        treeData={orgUnitTreeData}
                        style={{ width: 400 }}
                        filterTreeNode={(input, node) =>
                            matchOrgUnit(
                                orgUnitSearchIndex,
                                node.id as string,
                                input,
                            )
                        }
                        value={orgUnit}
                        searchValue={orgUnitSearch}
                        onSearch={setOrgUnitSearch}
                        {...(orgUnitSearch.trim()
                            ? {}
                            : {
                                  treeExpandedKeys: expanded,
                                  onTreeExpand: setExpanded,
                              })}
                        onChange={(value) => {
                            navigate({
                                to: "/reports/hmis",
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
                                to: "/reports/hmis",
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
                            onChange={(value) => {
                                navigate({
                                    to: "/reports/hmis",
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
            <Outlet />
        </Flex>
    );
}
