import { useDataEngine } from "@dhis2/app-runtime";
import { App } from "antd";
import React from "react";
import Hmis033bForm from "../../components/Hmis033b";
import Hmis10501Form from "../../components/Hmis10501";
import Hmis1050203Form from "../../components/Hmis1050203";
import Hmis1050405Form from "../../components/Hmis1050405";
import Hmis1050609Form from "../../components/Hmis1050609";
import Hmis10510Form from "../../components/Hmis10510";
import Hmis106A0102Form from "../../components/Hmis106A0102";
import Hmis106A03Form from "../../components/Hmis106A03";
import Hmis106A04Form from "../../components/Hmis106A04";
import Hmis108Form from "../../components/Hmis108";
import type { HmisFormProps } from "../../components/HmisForm";
import { revokeReport, verifyReport } from "./report-actions";
import { describeError, FIXED_ATTRIBUTION, LoadedReport, ReportIdentity } from "./report-data";

/** Each data set's HMIS form. */
const FORMS: Record<string, React.ComponentType<Omit<HmisFormProps, "config">>> = {
    C4oUitImBPK: Hmis033bForm,
    RtEYsASU7PG: Hmis10501Form,
    ic1BSWhGOso: Hmis1050203Form,
    nGkMm2VBT4G: Hmis1050405Form,
    VDhwrW9DiC1: Hmis1050609Form,
    quMWqLxzcfO: Hmis10510Form,
    dFRD2A5fdvn: Hmis106A0102Form,
    DFMoIONIalm: Hmis106A03Form,
    GwSIuQVi8b2: Hmis106A04Form,
    EBqVAQRmiPm: Hmis108Form,
};

/**
 * One data set report: its HMIS form, opened with the loaded values, and
 * verify / revoke against DHIS2. `onChanged` reloads the report.
 */
export function DataSetReportScreen({
    identity,
    report,
    onChanged,
}: {
    identity: ReportIdentity;
    report: LoadedReport;
    onChanged: () => Promise<void>;
}) {
    const { message } = App.useApp();
    const engine = useDataEngine();
    const { dataSet, orgUnit, period, attribution } = identity;

    const onSave: HmisFormProps["onSave"] = async (values) => {
        try {
            if (!(await verifyReport(engine, identity, values))) {
                message.error("Missing dataset/period/organisation before verifying.");
                return;
            }
            await onChanged();
            message.success("Report Verified Successfully");
        } catch (err) {
            console.error("Verify failed:", err);
            message.error(`Verification failed: ${describeError(err)}`);
        }
    };
    const onRevoke = async () => {
        try {
            if (!(await revokeReport(engine, identity))) {
                message.error("Missing dataset/period/organisation before revoking.");
                return;
            }
            await onChanged();
            message.success("Verification revoked");
        } catch (err) {
            console.error("Revoke failed:", err);
            message.error(`Revocation failed: ${describeError(err)}`);
        }
    };

    const Form = FORMS[dataSet ?? ""];
    if (!Form) return null;
    return (
        <Form
            // Keyed on the report so a different period, facility, data set or
            // nationality remounts it: its state starts from the new values, and
            // a pending draft save flushes under the previous report's key.
            // Reloads of the same report keep what's being typed.
            key={`${dataSet ?? ""}|${period ?? ""}|${orgUnit ?? ""}|${attribution ?? ""}`}
            attributeOptionCombo={FIXED_ATTRIBUTION[dataSet ?? ""] ?? attribution ?? ""}
            dataSet={dataSet}
            orgUnit={orgUnit}
            period={period}
            initialValues={report.initialValues}
            isVerified={report.isVerified}
            verifiedAt={report.verifiedAt}
            verifiedBy={report.verifiedBy}
            onSave={onSave}
            onRevoke={onRevoke}
        />
    );
}
