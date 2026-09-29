import { draftId, getHmisDraft, upsertHmisDraft } from "@/db/hmis-drafts";
import { ReportIdentity, resolveAttribution } from "./report-data";

type Engine = {
    mutate: (mutation: any) => Promise<unknown>;
};

type DataValue = {
    dataElement: string;
    categoryOptionCombo: string;
    value: string;
    attributeOptionCombo: string;
};

/** The report's full identity, or null when a part is missing. */
function fullIdentity({ dataSet, period, orgUnit, attribution }: ReportIdentity) {
    const attributeOptionCombo = resolveAttribution(dataSet, attribution);
    if (!dataSet || !period || !orgUnit || !attributeOptionCombo) return null;
    return {
        dataSet,
        period,
        orgUnit,
        attributeOptionCombo,
        id: draftId({ dataSet, period, orgUnit, attributeOptionCombo }),
    };
}

function completeRegistration(r: NonNullable<ReturnType<typeof fullIdentity>>, completed: boolean) {
    return {
        resource: "completeDataSetRegistrations",
        type: "create",
        data: {
            completeDataSetRegistrations: [
                {
                    dataSet: r.dataSet,
                    period: r.period,
                    organisationUnit: r.orgUnit,
                    attributeOptionCombo: r.attributeOptionCombo,
                    completed,
                    date: new Date().toISOString(),
                },
            ],
        },
    };
}

/**
 * Verifying: sends the values to DHIS2, marks the report complete, and
 * records it locally as verified and synced (the draft's values cleared).
 * Returns false when the report's identity is incomplete; throws on a
 * failed request.
 */
export async function verifyReport(
    engine: Engine,
    identity: ReportIdentity,
    submitted: { period?: string; orgUnit?: string; dataValues: DataValue[] },
): Promise<boolean> {
    const r = fullIdentity(identity);
    if (!r) return false;
    const now = Date.now();
    await engine.mutate({
        resource: "dataValueSets",
        data: {
            ...submitted,
            dataSet: r.dataSet,
            completionDate: new Date().toISOString(),
            period: r.period,
            orgUnit: r.orgUnit,
            attributeOptionCombo: r.attributeOptionCombo,
        },
        type: "create",
        params: { async: false },
    });
    await engine.mutate(completeRegistration(r, true));
    await upsertHmisDraft({
        id: r.id,
        dataSet: r.dataSet,
        period: r.period,
        orgUnit: r.orgUnit,
        attributeOptionCombo: r.attributeOptionCombo,
        values: {},
        isVerified: true,
        verifiedAt: now,
        updatedAt: now,
        syncStatus: "synced",
    });
    return true;
}

/**
 * Revoking: marks the report incomplete in DHIS2 and locally unverified
 * (the draft's values kept). Returns false when the report's identity is
 * incomplete; throws on a failed request.
 */
export async function revokeReport(engine: Engine, identity: ReportIdentity): Promise<boolean> {
    const r = fullIdentity(identity);
    if (!r) return false;
    await engine.mutate(completeRegistration(r, false));
    const existing = await getHmisDraft(r.id);
    await upsertHmisDraft({
        id: r.id,
        dataSet: r.dataSet,
        period: r.period,
        orgUnit: r.orgUnit,
        attributeOptionCombo: r.attributeOptionCombo,
        values: existing?.values ?? {},
        isVerified: false,
        verifiedAt: undefined,
        updatedAt: Date.now(),
        syncStatus: "synced",
    });
    return true;
}
