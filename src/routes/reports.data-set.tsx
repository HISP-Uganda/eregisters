import { createRoute } from "@tanstack/react-router";

import { useDataEngine } from "@dhis2/app-runtime";
import { App } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import React, { ReactNode } from "react";
import Hmis033bForm from "../components/Hmis033b";
import Hmis10501Form from "../components/Hmis10501";
import Hmis1050203Form from "../components/Hmis1050203";
import Hmis1050405Form from "../components/Hmis1050405";
import Hmis1050609Form from "../components/Hmis1050609";
import Hmis10510Form from "../components/Hmis10510";
import Hmis106A0102Form from "../components/Hmis106A0102";
import Hmis106A03Form from "../components/Hmis106A03";
import Hmis106A04Form from "../components/Hmis106A04";
import Hmis108Form from "../components/Hmis108";
import { Spinner } from "../components/spinner";
import { ReportsRoute } from "./reports";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

export const DataSetReportRoute = createRoute({
    getParentRoute: () => ReportsRoute,
    path: "/hmis",
    component: Reports,
    pendingComponent: Spinner,
    loaderDeps: ({
        search: { attribution, dataSet, orgUnit, period, periodType },
    }) => ({ attribution, dataSet, orgUnit, period, periodType }),
    loader: async ({ deps: { dataSet, orgUnit, period } }) => {
        if (
            orgUnit === undefined ||
            period === undefined ||
            dataSet === undefined
        ) {
            return new Map<string, string>();
        }
        const params = new URLSearchParams({
            source: "hmis_dvs",
            period,
            dataset: dataSet,
            orgunit: orgUnit,
        });
        const response = await fetch(
            `https://eregisters.health.go.ug/ereports/query?${params.toString()}`,
            {
                headers: {
                    "x-api-key": "LnwYPc0EnRKIqjKaQabQWGIN31ranjYt",
                },
            },
        );
        if (!response.ok) {
            return new Map<string, string>();
        }
        const data = await response.json();
        return new Map<string, string>(
            data.dataValues.map(
                ({
                    dataElement,
                    attributeOptionCombo,
                    categoryOptionCombo,
                    value,
                }: any) => [
                    `${dataElement}_${categoryOptionCombo}_${attributeOptionCombo}`,
                    value,
                ],
            ),
        );
    },
});

function Reports() {
    const { message } = App.useApp();
    const engine = useDataEngine();
    const { dataSet, attribution, orgUnit, period } =
        DataSetReportRoute.useSearch();
    const data = DataSetReportRoute.useLoaderData();


    const onSave = async (values: {
        period?: string | undefined;
        orgUnit?: string | undefined;
        dataValues: {
            dataElement: string;
            categoryOptionCombo: string;
            value: string;
            attributeOptionCombo: string;
        }[];
    }) => {
        await engine.mutate({
            resource: "dataValueSets",
            data: {
                ...values,
                dataSet,
                completionDate: new Date().toISOString(),
                period,
                orgUnit,
                attributeOptionCombo: attribution,
            },
            type: "create",
            params: {
                async: true,
            },
        });

        message.success("Report Verified Successfully");
    };

    const dataSets: Record<string, ReactNode> = {
        C4oUitImBPK: (
            <Hmis033bForm
                attributeOptionCombo={"HllvX50cXC0"}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        RtEYsASU7PG: (
            <Hmis10501Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        ic1BSWhGOso: (
            <Hmis1050203Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        nGkMm2VBT4G: (
            <Hmis1050405Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        VDhwrW9DiC1: (
            <Hmis1050609Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        quMWqLxzcfO: (
            <Hmis10510Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        dFRD2A5fdvn: (
            <Hmis106A0102Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        DFMoIONIalm: (
            <Hmis106A03Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        GwSIuQVi8b2: (
            <Hmis106A04Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
        EBqVAQRmiPm: (
            <Hmis108Form
                attributeOptionCombo={attribution ?? ""}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
                onSave={onSave}
            />
        ),
    };

    return dataSets[dataSet ?? ""];
}
