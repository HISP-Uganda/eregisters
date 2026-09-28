import { Card, Col, Form, FormInstance, Row, Select } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { DataElementField } from "../../components/data-element-field";
import { useMetadata } from "../../hooks/useMetadata";
import { ProgramRuleResult } from "../../schemas";
import { createGetValueProps, createNormalize, FORM_ROW_GUTTER } from "../../utils/form-fields";
import { SERVICE_TYPE } from "./visit-tabs";

const SERVICE_TYPES_OPTION_SET = "QwsvSPpnRul";

/** The visit date as a form field (it isn't a data element). */
const VISIT_DATE_FIELD = {
    code: "occurredAt",
    id: "occurredAt",
    confidential: false,
    name: "occurredAt",
    valueType: "DATE",
    displayFormName: "Visit Date",
    generated: false,
    optionSetValue: false,
    unique: true,
    pattern: "",
    formName: "Visit Date",
};

type ServiceType = { id: string; name: string; code: string; optionSet: string };

/**
 * The service types offered, less those program rules hide. Hidden ones
 * are filtered from what was offered before, so an option once hidden
 * stays out until the rules hide none.
 */
function useServiceTypes(ruleResult: ProgramRuleResult): ServiceType[] {
    const { optionSets } = useMetadata();
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(
        optionSets.get(SERVICE_TYPES_OPTION_SET) ?? [],
    );
    const hidden = ruleResult.hiddenOptions[SERVICE_TYPE];
    useEffect(() => {
        if (hidden?.length > 0) {
            setServiceTypes((prev) => prev.filter((o) => !hidden.includes(o.id)));
        } else {
            setServiceTypes(optionSets.get(SERVICE_TYPES_OPTION_SET) ?? []);
        }
    }, [hidden, optionSets]);
    return serviceTypes;
}

/** The visit's date and service types, above the stage tabs. */
export function VisitHeader({
    form,
    ruleResult,
    onFieldChange,
}: {
    form: FormInstance;
    ruleResult: ProgramRuleResult;
    onFieldChange: (dataElement: string, value: any) => void;
}) {
    const serviceTypes = useServiceTypes(ruleResult);
    return (
        <Card size="small" styles={{ body: { padding: 10, margin: 0 } }}>
            <Row gutter={FORM_ROW_GUTTER}>
                <DataElementField
                    dataElement={VISIT_DATE_FIELD}
                    hidden={false}
                    finalOptions={[]}
                    messages={[]}
                    warnings={[]}
                    errors={[]}
                    required={true}
                    form={form}
                    xs={24}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    disabledDate={(date) => date.isAfter(dayjs())}
                    onFieldChange={onFieldChange}
                />
                <Col xs={24} lg={12}>
                    <Form.Item
                        label="Service Type"
                        name={SERVICE_TYPE}
                        rules={[{ required: true, message: "Please select service type!" }]}
                        getValueProps={createGetValueProps("MULTI_TEXT")}
                        normalize={createNormalize("MULTI_TEXT")}
                    >
                        <Select
                            style={{ width: "100%" }}
                            options={serviceTypes}
                            fieldNames={{ label: "name", value: "code" }}
                            allowClear
                            mode="multiple"
                            placeholder="Select services"
                            showSearch={{
                                filterOption: (input, option) =>
                                    option
                                        ? option.name.toLowerCase().includes(input.toLowerCase()) ||
                                          option.code.toLowerCase().includes(input.toLowerCase())
                                        : false,
                            }}
                            onChange={(value) => onFieldChange(SERVICE_TYPE, value)}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
}
