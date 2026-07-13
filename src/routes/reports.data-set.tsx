import { createRoute } from "@tanstack/react-router";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import React from "react";
import Hmis033bForm from "../components/Hmis033bForm";
import { Spinner } from "../components/spinner";
import { SyncContext } from "../machines";
import { ReportsRoute } from "./reports";
import { AggregateData } from "../schemas";
import Hmis106A03Form from "../components/Hmis106A03";
import Hmis105Section1Form from "../components/Hmis10501";
import Hmis1050203Form from "../components/Hmis1050203";
import Hmis1050405Form from "../components/Hmis1050405";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

export const DataSetReportRoute = createRoute({
    getParentRoute: () => ReportsRoute,
    path: "/$dataSet",
    component: Reports,
    pendingComponent: Spinner,
    loaderDeps: ({
        search: { attribution, dataSet, orgUnit, period, periodType },
    }) => ({ attribution, dataSet, orgUnit, period, periodType }),
    loader: async ({
        deps: { attribution, dataSet, orgUnit, period, periodType },
    }) => {
        if (
            orgUnit === undefined ||
            period === undefined ||
            dataSet === undefined
        ) {
            throw new Error("OrgUnit,Data set or period not specified");
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
            throw new Error("Something went wrong");
        }
        const data = await response.json();
				console.log(data)

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
    const { dataSet, attribution, orgUnit,period } = DataSetReportRoute.useSearch();
    const data = DataSetReportRoute.useLoaderData();

    if (dataSet === "C4oUitImBPK") {
        return (
            <Hmis033bForm
                attributeOptionCombo={"HllvX50cXC0"}
                orgUnit={orgUnit}
                initialValues={data}
                period={period}
            />
        );
    }

    if (dataSet === "DFMoIONIalm") {
        return (
            <Hmis106A03Form
                attributeOptionCombo={"HllvX50cXC0"}
								initialValues={data}
            />
        );
    }
    if (dataSet === "RtEYsASU7PG") {
        return (
            <Hmis105Section1Form
                attributeOptionCombo={attribution ?? "HllvX50cXC0"}
                initialValues={data}
            />
        );
    }
    if (dataSet === "ic1BSWhGOso") {
        return (
            <Hmis1050203Form
                attributeOptionCombo={attribution ?? "HllvX50cXC0"}
                initialValues={data}
            />
        );
    }
    if (dataSet === "nGkMm2VBT4G") {
        return (
            <Hmis1050405Form
                attributeOptionCombo={attribution ?? "HllvX50cXC0"}
                initialValues={data}
            />
        );
    }
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
