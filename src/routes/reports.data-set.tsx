import { createRoute, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import React from "react";
import { Spinner } from "../components/spinner";
import { DataSetReportScreen } from "../screens/data-set-report/data-set-report-screen";
import { loadReport } from "../screens/data-set-report/report-data";
import { ReportsRoute } from "./reports";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

export const DataSetReportRoute = createRoute({
    getParentRoute: () => ReportsRoute,
    path: "/hmis",
    component: DataSetReportPage,
    pendingComponent: Spinner,
    loaderDeps: ({ search: { attribution, dataSet, orgUnit, period, periodType } }) => ({
        attribution,
        dataSet,
        orgUnit,
        period,
        periodType,
    }),
    loader: ({ context, deps }) => loadReport(context.engine, deps),
});

/** Binds the report to the URL (which report) and the loader (its values). */
function DataSetReportPage() {
    const { dataSet, attribution, orgUnit, period } = DataSetReportRoute.useSearch();
    const report = DataSetReportRoute.useLoaderData();
    const router = useRouter();
    return (
        <DataSetReportScreen
            identity={{ dataSet, attribution, orgUnit, period }}
            report={report}
            onChanged={() => router.invalidate()}
        />
    );
}
