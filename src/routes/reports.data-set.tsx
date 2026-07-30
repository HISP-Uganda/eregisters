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
    defaultAttributeOptionCombo?: string,
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
                    `${dataElement}_${categoryOptionCombo}_${
                        attributeOptionCombo ??
                        defaultAttributeOptionCombo ??
                        ""
                    }`,
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
): Promise<{ verified: boolean; verifiedAt?: string; verifiedBy?: string }> {
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
            storedBy?: string;
            date?: string;
        }> = result?.registrations?.completeDataSetRegistrations ?? [];
        const match = list.find(
            (r) =>
                r.attributeOptionCombo === attribution && r.completed === true,
        );
        return {
            verified: !!match,
            verifiedAt: match?.date,
            verifiedBy: match?.storedBy,
        };
    } catch (err) {
        console.warn(
            "completeDataSetRegistrations read failed — treating verified state as unknown:",
            err,
        );
        return { verified: false };
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
            verifiedAt: undefined as string | undefined,
            verifiedBy: undefined as string | undefined,
            syncStatus: "draft" as HmisDraft["syncStatus"],
            pendingVerificationAction: null as
                | "verify"
                | "revoke"
                | null,
        };
        if (
            orgUnit === undefined ||
            period === undefined ||
            dataSet === undefined
        ) {
            return empty;
        }

        // Resolve the AOC the form will actually use for key lookups. For 033B
        // this is a hardcoded default; for other forms it comes from the URL.
        // We pass it to fetchServerValues so that if the server row omits or
        // nullifies attributeOptionCombo, we fall back to the effective one —
        // otherwise keys built here won't match keys built by FieldCell.
        const effectiveAttribution = resolveAttribution(dataSet, attribution);
        const serverValues = await fetchServerValues(
            dataSet,
            orgUnit,
            period,
            effectiveAttribution,
        );

        // Verified state + local draft are keyed by AOC. If we still cannot
        // resolve one, skip those reads and return the server values as-is.
        if (!effectiveAttribution) {
            return {
                initialValues: serverValues,
                isVerified: false,
                verifiedAt: undefined as string | undefined,
                verifiedBy: undefined as string | undefined,
                syncStatus: "draft" as HmisDraft["syncStatus"],
                pendingVerificationAction: null as
                    | "verify"
                    | "revoke"
                    | null,
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
            isVerified: serverVerified.verified,
            verifiedAt: serverVerified.verifiedAt,
            verifiedBy: serverVerified.verifiedBy,
            syncStatus: draft?.syncStatus ?? "draft",
            pendingVerificationAction:
                draft?.pendingVerificationAction ?? null,
        };
    },
});

function Reports() {
    const { message } = App.useApp();
    const engine = useDataEngine();
    const { dataSet, attribution, orgUnit, period } =
        DataSetReportRoute.useSearch();
    const {
        initialValues,
        isVerified,
        verifiedAt,
        verifiedBy,
        syncStatus,
        pendingVerificationAction,
    } = DataSetReportRoute.useLoaderData();
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
            message.error(
                "Missing dataset/period/organisation before verifying.",
            );
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
            const dataValueSetsPayload = {
                ...values,
                dataSet,
                completionDate: new Date().toISOString(),
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
            };

            const response = await engine.mutate({
                resource: "dataValueSets",
                data: dataValueSetsPayload,
                type: "create",
                params: { async: false },
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
                pendingVerificationAction: null,
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
                pendingVerificationAction: "verify",
            });
            await router.invalidate();
            message.error("Verification queued — will sync when online.");
            console.error("Verify failed:", err);
        }
    };

    const onRevoke = async () => {
        const effectiveAttribution = resolveAttribution(dataSet, attribution);
        if (!dataSet || !period || !orgUnit || !effectiveAttribution) {
            message.error(
                "Missing dataset/period/organisation before revoking.",
            );
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
                resource: "completeDataSetRegistrations",
                type: "create",
                data: {
                    completeDataSetRegistrations: [
                        {
                            dataSet,
                            period,
                            organisationUnit: orgUnit,
                            attributeOptionCombo: effectiveAttribution,
                            completed: false,
                            date: new Date().toISOString(),
                        },
                    ],
                },
            });

            const existing = await getHmisDraft(id);
            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values: existing?.values ?? {},
                isVerified: false,
                verifiedAt: undefined,
                updatedAt: now,
                syncStatus: "synced",
                pendingVerificationAction: null,
            });

            await router.invalidate();
            message.success("Verification revoked");
        } catch (err) {
            const existing = await getHmisDraft(id);
            await upsertHmisDraft({
                id,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo: effectiveAttribution,
                values: existing?.values ?? {},
                isVerified: existing?.isVerified ?? true,
                verifiedAt: existing?.verifiedAt,
                updatedAt: now,
                syncStatus: "pending",
                pendingVerificationAction: "revoke",
            });
            await router.invalidate();
            message.error("Revocation queued — will sync when online.");
            console.error("Revoke failed:", err);
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
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        RtEYsASU7PG: (
            <Hmis10501Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        ic1BSWhGOso: (
            <Hmis1050203Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        nGkMm2VBT4G: (
            <Hmis1050405Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        VDhwrW9DiC1: (
            <Hmis1050609Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        quMWqLxzcfO: (
            <Hmis10510Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        dFRD2A5fdvn: (
            <Hmis106A0102Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        DFMoIONIalm: (
            <Hmis106A03Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        GwSIuQVi8b2: (
            <Hmis106A04Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
        EBqVAQRmiPm: (
            <Hmis108Form
                attributeOptionCombo={attribution ?? ""}
                dataSet={dataSet}
                orgUnit={orgUnit}
                initialValues={initialValues}
                isVerified={isVerified}
                verifiedAt={verifiedAt}
                verifiedBy={verifiedBy}
                pendingVerificationAction={pendingVerificationAction}
                syncStatus={syncStatus}
                period={period}
                onSave={onSave}
                onRevoke={onRevoke}
            />
        ),
    };

    // Key the form on the report-identifying tuple so React remounts when the
    // user changes period, org unit, dataset, or nationality. Remount resets
    // useState from the loader's fresh initialValues and lets the debounce
    // cleanup effect flush any pending draft with the *previous* closure
    // (correct old key + values). Loader re-invocations that keep the tuple
    // the same do not remount, so unsaved typing is preserved.
    const form = dataSets[dataSet ?? ""];
    if (!form) return null;
    const remountKey = `${dataSet ?? ""}|${period ?? ""}|${orgUnit ?? ""}|${attribution ?? ""}`;
    return React.cloneElement(form as React.ReactElement, { key: remountKey });
}
