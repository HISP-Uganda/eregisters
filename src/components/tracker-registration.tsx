import { Card, Flex, Form, FormInstance, Row, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useMetadata } from "../hooks/useMetadata";
import { useUIConfig } from "../hooks/useUIConfig";
import { TrackedEntityContext } from "../machines";
import { FlattenedTrackedEntity } from "../schemas";
import { buildCurrentAttributes, spans } from "../utils/utils";
import { DataElementField } from "./data-element-field";
import { DataElementRenderer } from "./data-element-renderer";

export interface TrackerRegistrationProps {
    trackedEntity: FlattenedTrackedEntity;
    form: FormInstance;
}

export const TrackerRegistration: React.FC<TrackerRegistrationProps> = ({
    form,
}) => {
    const { program } = useMetadata();
    const allAttributes = buildCurrentAttributes(program);
    const uiConfig = useUIConfig();
    const ruleResult = TrackedEntityContext.useSelector(
        (a) => a.context.ruleResult,
    );
    const trackedEntityActor = TrackedEntityContext.useActorRef();
    const initialFormData = TrackedEntityContext.useSelector((a) => ({
        ...a.context.trackedEntity.attributes,
        ...a.context.formData,
    }));
		
    useEffect(() => {
        form.setFieldsValue(initialFormData);
    }, []);

    const ageAtRegistration = Form.useWatch("xcYGVzmcWvi", form);
    const dob = Form.useWatch("Y3DE5CZWySr", form);

    const onFieldChange = (dataElement: string, value: any) => {
        trackedEntityActor.send({
            type: "FIELD_CHANGED",
            formData: {
                ...form.getFieldsValue(),
                [dataElement]: value,
            },
        });
    };

    useEffect(() => {
        if (ageAtRegistration === undefined && dob === undefined) return;
        trackedEntityActor.send({
            type: "FIELD_CHANGED",
            formData: {
                ...form.getFieldsValue(),
                xcYGVzmcWvi: ageAtRegistration,
            },
        });
    }, [ageAtRegistration, dob]);

    return (
        <Flex vertical gap={10}>
            <Card
                title={`Registration Details`}
                style={{ borderRadius: 0 }}
                size="small"
            >
                <Row gutter={[16, 16]}>
                    <DataElementField
                        dataElement={{
                            code: "enrolledAt",
                            id: "enrolledAt",
                            confidential: false,
                            name: "enrolledAt",
                            valueType: "DATE",
                            displayFormName: "Registration Date",
                            generated: false,
                            optionSetValue: false,
                            unique: true,
                            pattern: "",
                            formName: "Registration Date",
                        }}
                        hidden={false}
                        finalOptions={[]}
                        messages={[]}
                        warnings={[]}
                        errors={[]}
                        required={true}
                        form={form}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                        disabledDate={(date) => {
                            if (program.selectEnrollmentDatesInFuture)
                                return true;
                            return date.isAfter(dayjs());
                        }}
                        onFieldChange={onFieldChange}
                    />
                </Row>
            </Card>
            {program.programSections.map(
                ({ name, trackedEntityAttributes: tei, id }) => {
                    const allAreHidden = tei.every(({ id }) =>
                        ruleResult.hiddenFields.includes(id),
                    );
                    if (allAreHidden) return null;
                    const sectionSubsections = uiConfig.subsections[id];
                    return (
                        <Card
                            title={name}
                            key={id}
                            style={{ borderRadius: 0 }}
                            size="small"
                        >
                            {sectionSubsections && sectionSubsections.length > 0 ? (
                                (() => {
                                    const assignedIds = new Set(
                                        sectionSubsections.flatMap(
                                            (s) => s.dataElementIds,
                                        ),
                                    );
                                    const groups: Array<{
                                        label: string | null;
                                        ids: string[];
                                    }> = sectionSubsections.map((sub) => ({
                                        label: sub.name,
                                        ids: tei
                                            .filter(({ id }) =>
                                                sub.dataElementIds.includes(id),
                                            )
                                            .map(({ id }) => id),
                                    }));
                                    const unassigned = tei
                                        .filter(
                                            ({ id }) => !assignedIds.has(id),
                                        )
                                        .map(({ id }) => id);
                                    if (unassigned.length > 0) {
                                        groups.push({
                                            label: null,
                                            ids: unassigned,
                                        });
                                    }
                                    return groups.map(({ label, ids }) =>
                                        ids.length === 0 ? null : (
                                            <React.Fragment
                                                key={label ?? "__unassigned"}
                                            >
                                                {label && (
                                                    <Typography.Text
                                                        type="secondary"
                                                        style={{
                                                            display: "block",
                                                            marginTop: 12,
                                                            marginBottom: 4,
                                                            fontSize: 12,
                                                            textTransform:
                                                                "uppercase",
                                                            letterSpacing: 0.5,
                                                        }}
                                                    >
                                                        {label}
                                                    </Typography.Text>
                                                )}
                                                <Row gutter={[16, 16]}>
                                                    {ids.map((attrId) => (
                                                        <DataElementRenderer
                                                            key={attrId}
                                                            dataElementId={
                                                                attrId
                                                            }
                                                            currentDataElements={
                                                                allAttributes
                                                            }
                                                            ruleResult={
                                                                ruleResult
                                                            }
                                                            sectionLength={
                                                                ids.length
                                                            }
                                                            form={form}
                                                            mode="attribute"
                                                            xl={
                                                                spans.get(
                                                                    attrId,
                                                                ) ?? undefined
                                                            }
                                                            onFieldChange={
                                                                onFieldChange
                                                            }
                                                        />
                                                    ))}
                                                </Row>
                                            </React.Fragment>
                                        ),
                                    );
                                })()
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {tei.map(({ id }) => (
                                        <DataElementRenderer
                                            key={id}
                                            dataElementId={id}
                                            currentDataElements={allAttributes}
                                            ruleResult={ruleResult}
                                            sectionLength={tei.length}
                                            form={form}
                                            mode="attribute"
                                            xl={spans.get(id) ?? undefined}
                                            onFieldChange={onFieldChange}
                                        />
                                    ))}
                                </Row>
                            )}
                        </Card>
                    );
                },
            )}
        </Flex>
    );
};
