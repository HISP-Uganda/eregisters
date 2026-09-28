import { draftId, getHmisDraft, mergeDraftAndServer } from "../../db/hmis-drafts";

/** A report's identity: which data set, for which facility and period. */
export type ReportIdentity = {
    dataSet?: string;
    orgUnit?: string;
    period?: string;
    /** The attribute option combo (e.g. nationality), from the URL. */
    attribution?: string;
};

interface DataEngineLike {
    query: (q: Record<string, any>) => Promise<any>;
}

/**
 * Data sets whose forms use a fixed attribute option combo (no selector in
 * the UI). The one place the loader, verify/revoke and the forms agree on it.
 */
export const FIXED_ATTRIBUTION: Record<string, string> = {
    C4oUitImBPK: "HllvX50cXC0", // HMIS 033B
};

/** The attribute option combo a report uses: the URL's, else its data set's fixed one. */
export function resolveAttribution(dataSet: string | undefined, attribution: string | undefined): string | undefined {
    if (attribution) return attribution;
    if (!dataSet) return undefined;
    return FIXED_ATTRIBUTION[dataSet];
}

/** An error as a short message for the user (DHIS2's `details.message` first). */
export function describeError(err: unknown): string {
    if (err && typeof err === "object") {
        const details = (err as { details?: { message?: string } }).details;
        if (details?.message) return details.message;
        const message = (err as { message?: unknown }).message;
        if (typeof message === "string" && message) return message;
    }
    if (err instanceof Error) return err.message;
    return String(err);
}

type ServerDataValue = {
    dataElement: string;
    categoryOptionCombo: string;
    attributeOptionCombo?: string | null;
    value: string;
};

/**
 * Server values keyed as the form keys them. A value without an attribute
 * option combo takes the report's, so the keys still match the form's.
 */
export function toFormValues(dataValues: ServerDataValue[], defaultAttribution?: string): Map<string, string> {
    return new Map(
        dataValues.map(({ dataElement, categoryOptionCombo, attributeOptionCombo, value }) => [
            `${dataElement}_${categoryOptionCombo}_${attributeOptionCombo ?? defaultAttribution ?? ""}`,
            value,
        ]),
    );
}

/**
 * The DHIS2 route that forwards to the "ereports" query service. DHIS2
 * adds the service's API key on the server, so the browser never holds it
 * — see wayfinder map "Keep the ereports API key out of the browser".
 */
export const EREPORTS_ROUTE = "ereports-query";

/** The report's submitted values, via the ereports route. Unreachable or failing: no values. */
async function fetchServerValues(
    engine: DataEngineLike,
    dataSet: string,
    orgUnit: string,
    period: string,
    defaultAttribution?: string,
): Promise<Map<string, string>> {
    try {
        const result = await engine.query({
            values: {
                resource: `routes/${EREPORTS_ROUTE}/run`,
                params: { source: "hmis_dvs", period, dataset: dataSet, orgunit: orgUnit },
            },
        });
        return toFormValues(result?.values?.dataValues ?? [], defaultAttribution);
    } catch {
        return new Map();
    }
}

/** Whether DHIS2 has the report marked complete ("verified"), by whom and when. */
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
                params: { dataSet, period, orgUnit, children: false },
            },
        });
        const list: Array<{ attributeOptionCombo?: string; completed?: boolean; storedBy?: string; date?: string }> =
            result?.registrations?.completeDataSetRegistrations ?? [];
        const match = list.find((r) => r.attributeOptionCombo === attribution && r.completed === true);
        return { verified: !!match, verifiedAt: match?.date, verifiedBy: match?.storedBy };
    } catch (err) {
        console.warn("completeDataSetRegistrations read failed — treating verified state as unknown:", err);
        return { verified: false };
    }
}

export type LoadedReport = {
    initialValues: Map<string, string>;
    isVerified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
};

/**
 * What the report opens with: the server's values with this device's
 * unsent draft on top, and whether it's verified. Without an attribute
 * option combo only the server's values are known.
 */
export async function loadReport(engine: DataEngineLike, { dataSet, orgUnit, period, attribution }: ReportIdentity): Promise<LoadedReport> {
    if (orgUnit === undefined || period === undefined || dataSet === undefined) {
        return { initialValues: new Map(), isVerified: false };
    }
    const effectiveAttribution = resolveAttribution(dataSet, attribution);
    const serverValues = await fetchServerValues(engine, dataSet, orgUnit, period, effectiveAttribution);
    if (!effectiveAttribution) {
        return { initialValues: serverValues, isVerified: false };
    }
    const id = draftId({ dataSet, period, orgUnit, attributeOptionCombo: effectiveAttribution });
    const [serverVerified, draft] = await Promise.all([
        fetchServerVerified(engine, dataSet, orgUnit, period, effectiveAttribution),
        getHmisDraft(id).catch(() => undefined),
    ]);
    return {
        initialValues: mergeDraftAndServer(draft, serverValues),
        isVerified: serverVerified.verified,
        verifiedAt: serverVerified.verifiedAt,
        verifiedBy: serverVerified.verifiedBy,
    };
}
