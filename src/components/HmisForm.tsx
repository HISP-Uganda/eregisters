import { App, Card, ConfigProvider, Tabs, Typography } from "antd";
import React, { useState } from "react";
import type { HmisFormConfig, HmisFormValues } from "@/form-configs/types";
import { HMIS_FORM_CSS } from "./hmis-form/hmis-form-css";
import { SectionTable } from "./hmis-form/section-table";
import { TEAL } from "./hmis-form/theme";
import { useHmisDraft } from "./hmis-form/use-hmis-draft";
import { toDataValues } from "./hmis-form/values";
import { VerifyActions } from "./hmis-form/verify-actions";

export type { HmisFormValues } from "@/form-configs/types";

export interface HmisFormProps {
    period?: string;
    orgUnit?: string;
    dataSet?: string;
    initialValues?: HmisFormValues;
    readOnly?: boolean;
    config: HmisFormConfig;
    onSave?: (payload: {
        period?: string;
        orgUnit?: string;
        dataValues: Array<{
            dataElement: string;
            categoryOptionCombo: string;
            value: string;
            attributeOptionCombo: string;
        }>;
    }) => void | Promise<void>;
    attributeOptionCombo: string;
    isVerified?: boolean;
    onRevoke?: () => void | Promise<void>;
    verifiedAt?: string | number;
    verifiedBy?: string;
}

function InnerHmisForm({
    period,
    orgUnit,
    dataSet,
    initialValues,
    readOnly = false,
    config,
    onSave,
    attributeOptionCombo,
    isVerified = false,
    onRevoke,
    verifiedAt,
    verifiedBy,
}: HmisFormProps) {
    const { message } = App.useApp();
    const [saving, setSaving] = useState(false);
    const { values, setValue } = useHmisDraft({ initialValues, dataSet, period, orgUnit, attributeOptionCombo });

    // Verifying submits every filled-in value. A verified report stays
    // editable and can be re-submitted.
    const handleVerify = async () => {
        setSaving(true);
        const dataValues = toDataValues(values);
        const payload = { period, orgUnit, dataValues, attributeOptionCombo };
        if (onSave) {
            await onSave(payload);
        } else {
            message.success(`Prepared ${dataValues.length} data value(s) for submission.`);
        }
        setSaving(false);
    };

    const items = config.tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        children: (
            <div
                className="hmis105-tab-scroll"
                tabIndex={0}
                style={{
                    maxHeight: "calc(100vh - 260px)",
                    overflow: "auto",
                    overscrollBehavior: "contain",
                    padding: "0 10px",
                    outline: "none",
                }}
            >
                {tab.sections.map((section) => (
                    <SectionTable
                        key={section.key}
                        section={section}
                        values={values}
                        readOnly={readOnly}
                        setValue={setValue}
                        attributeOptionCombo={attributeOptionCombo}
                        editableScope={config.editableScope}
                    />
                ))}
            </div>
        ),
    }));

    return (
        <Card
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            styles={{ body: { margin: 0, padding: "10px 0" }, header: { background: TEAL, flexShrink: 0 } }}
            title={
                <Typography.Title level={4} style={{ margin: 0, color: "#fff" }}>
                    {config.title}
                </Typography.Title>
            }
            extra={
                <VerifyActions
                    period={period}
                    readOnly={readOnly}
                    isVerified={isVerified}
                    verifiedBy={verifiedBy}
                    verifiedAt={verifiedAt}
                    saving={saving}
                    onVerify={handleVerify}
                    onRevoke={onRevoke}
                />
            }
        >
            <style>{HMIS_FORM_CSS}</style>
            <Tabs
                className="hmis105-tabs"
                style={{ height: "100%" }}
                tabPlacement="start"
                defaultActiveKey="tab1"
                type="card"
                items={items}
                tabBarStyle={{ width: 220, minWidth: 220 }}
                styles={{ content: { margin: 0, padding: 0 } }}
            />
        </Card>
    );
}

/**
 * An HMIS aggregate report as its paper form — tabs of sections of
 * number cells — laid out by `config` (see `src/form-configs`), saved as a
 * local draft as it's filled in, and submitted by "Mark Report as Verified".
 */
const HmisForm: React.FC<HmisFormProps> = (props) => (
    <ConfigProvider
        theme={{
            token: { colorPrimary: TEAL, borderRadius: 4 },
            components: {
                Tabs: {
                    itemColor: "#4a5b60",
                    itemHoverColor: TEAL,
                    itemSelectedColor: "#ffffff",
                    inkBarColor: "transparent",
                },
                Card: { headerBg: TEAL },
            },
        }}
    >
        <InnerHmisForm {...props} />
    </ConfigProvider>
);

export default HmisForm;
