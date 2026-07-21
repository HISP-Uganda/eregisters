import { createRoute, useRouter } from "@tanstack/react-router";

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
import {
    combineIsVerified,
    draftId,
    getHmisDraft,
    mergeDraftAndServer,
    upsertHmisDraft,
    type HmisDraft,
} from "../db/hmis-drafts";
import { ReportsRoute } from "./reports";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

async function fetchServerValues(
    dataSet: string,
    orgUnit: string,
    period: string,
): Promise<Map<string, string>> {
    const params = new URLSearchParams({
        source: "hmis_dvs",
        period,
        dataset: dataSet,
        orgunit: orgUnit,
    });
    try {
        const response = await fetch(
            `https://eregisters.health.go.ug/ereports/query?${params.toString()}`,
            { headers: { "x-api-key": "LnwYPc0EnRKIqjKaQabQWGIN31ranjYt" } },
        );
        if (!response.ok) return new Map();
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
    } catch {
        return new Map();
    }
}

interface DataEngineLike {
    query: (q: Record<string, any>) => Promise<any>;
}

// 033B uses a hardcoded attributeOptionCombo (no Nationality selector in the UI);
// other datasets carry the AOC via the `attribution` search param. This helper is
// the single source of truth so the loader, verify path, and form wrappers agree.
const HARDCODED_AOC_BY_DATASET: Record<string, string> = {
    C4oUitImBPK: "HllvX50cXC0",
};

function resolveAttribution(
    dataSet: string | undefined,
    attribution: string | undefined,
): string | undefined {
    if (attribution) return attribution;
    if (!dataSet) return undefined;
    return HARDCODED_AOC_BY_DATASET[dataSet];
}

async function fetchServerVerified(
    engine: DataEngineLike,
    dataSet: string,
    orgUnit: string,
    period: string,
    attribution: string,
): Promise<boolean | undefined> {
    try {
        const result = await engine.query({
            registrations: {
                resource: "completeDataSetRegistrations",
                params: {
                    dataSet,
                    period,
                    orgUnit,
                    children: false,
                },
            },
        });
        const list: Array<{
            attributeOptionCombo?: string;
            completed?: boolean;
        }> =
            result?.registrations?.completeDataSetRegistrations ?? [];
        return list.some(
            (r) =>
                r.attributeOptionCombo === attribution &&
                r.completed === true,
        );
    } catch (err) {
        console.warn(
            "completeDataSetRegistrations read failed — treating verified state as unknown:",
            err,
        );
        return undefined;
    }
}

export const DataSetReportRoute = createRoute({
    getParentRoute: () => ReportsRoute,
    path: "/hmis",
    component: Reports,
    pendingComponent: Spinner,
    loaderDeps: ({
        search: { attribution, dataSet, orgUnit, period, periodType },
    }) => ({ attribution, dataSet, orgUnit, period, periodType }),
    loader: async ({
        context,
        deps: { dataSet, orgUnit, period, attribution },
    }) => {
        const empty = {
            initialValues: new Map<string, string>(),
            isVerified: false,
            syncStatus: "draft" as HmisDraft["syncStatus"],
        };
        if (
            orgUnit === undefined ||
            period === undefined ||
            dataSet === undefined
        ) {
            return empty;
        }

        // Server values (ereports) do not depend on AOC — always fetch.
        const serverValues = await fetchServerValues(dataSet, orgUnit, period);

        // Verified state + local draft are keyed by AOC, which for 033B is
        // hardcoded rather than URL-provided. If we still cannot resolve one,
        // just skip those reads and return the server values as-is.
        const effectiveAttribution = resolveAttribution(dataSet, attribution);
        if (!effectiveAttribution) {
            return {
                initialValues: serverValues,
                isVerified: false,
                syncStatus: "draft" as HmisDraft["syncStatus"],
            };
        }

        const id = draftId({
            dataSet,
            period,
            orgUnit,
            attributeOptionCombo: effectiveAttribution,
        });

        const [serverVerified, draft] = await Promise.all([
            fetchServerVerified(
                context.engine,
                dataSet,
                orgUnit,
                period,
                effectiveAttribution,
            ),
            getHmisDraft(id).catch(() => undefined),
        ]);

        return {
            initialValues: mergeDraftAndServer(draft, serverValues),
            isVerified: combineIsVerified(
                draft?.isVerified ?? false,
                serverVerified,
            ),
            syncStatus: draft?.syncStatus ?? "draft",
        };
    },
});

function Reports() {
    const { message } = App.useApp();
    const engine = useDataEngine();
    const { dataSet, attribution, orgUnit, period } =
        DataSetReportRoute.useSearch();
    const { initialValues, isVerified, syncStatus } =
        DataSetReportRoute.useLoaderData();
    const router = useRouter();


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
        const effectiveAttribution = resolveAttribution(dataSet, attribution);
        if (!dataSet || !period || !orgUnit || !effectiveAttribution) {
            message.error("Missing dataset/period/organisation before verifying.");
            return;
        }
        const id = draftId({
            dataSet,
            period,
            orgUnit,
            attributeOptionCombo: effectiveAttribution,
        });
        const now = Date.now();

        try {
            await engine.mutate({
                resource: "dataValueSets",
                data: {
                    ...values,
                    dataSet,
                    completionDate: new Date().toISOString(),
                    period,
                    orgUnit,
                    attributeOptionCombo: effectiveAttribution,
                },
                type: "create",
                params: { async: true },
            });

            await engine.mutate({
                resource: "completeDataSetRegistrations",
                type: "create",
                data: {
                    completeDataSetRegistrations: [
                        {
                            dataSet,
                            period,
                            organisationUnit: orgUnit,
                            attributeOptionCombo: effectiveAttribution,
                            completed: true,
                            date: new Date().toISOString(),
                        },
                    ],
                },
            });

            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values: {},
                isVerified: true,
                verifiedAt: now,
                updatedAt: now,
                syncStatus: "synced",
            });

            await router.invalidate();
            message.success("Report Verified Successfully");
        } catch (err) {
            const existing = await getHmisDraft(id);
            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values:
                    existing?.values ??
                    Object.fromEntries(
                        values.dataValues.map((dv) => [
                            `${dv.dataElement}_${dv.categoryOptionCombo}_${dv.attributeOptionCombo}`,
                            dv.value,
                        ]),
                    ),
                isVerified: true,
                verifiedAt: now,
                updatedAt: now,
                syncStatus: "pending",
            });
            await router.invalidate();
            message.error("Verification queued — will sync when online.");
            console.error("Verify failed:", err);
        }
    };

    const dataSets: Record<string, ReactNode> = {
        C4oUitImBPK: (
            <Hmis033bForm
                attributeOptionCombo={"HllvX50cXC0"}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        RtEYsASU7PG: (
            <Hmis10501Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        ic1BSWhGOso: (
            <Hmis1050203Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        nGkMm2VBT4G: (
            <Hmis1050405Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        VDhwrW9DiC1: (
            <Hmis1050609Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        quMWqLxzcfO: (
            <Hmis10510Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        dFRD2A5fdvn: (
            <Hmis106A0102Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        DFMoIONIalm: (
            <Hmis106A03Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        GwSIuQVi8b2: (
            <Hmis106A04Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
        EBqVAQRmiPm: (
            <Hmis108Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
            />
        ),
    };

    return dataSets[dataSet ?? ""];
}
