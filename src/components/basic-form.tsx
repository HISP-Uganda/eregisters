import { Form, FormInstance, Typography } from "antd";
import React, { useCallback } from "react";
import { useMetadata } from "../hooks/useMetadata";
import { useUIConfig } from "../hooks/useUIConfig";
import { EventContext } from "../machines";
import { buildCurrentDataElements } from "../utils/utils";
import { DataElementRenderer } from "./data-element-renderer";
import { SubsectionGroups } from "./subsection-groups";

export default function BasicForm({
    section,
    form,
}: {
    section: string;
    form: FormInstance;
}) {
    const eventActor = EventContext.useActorRef();
    const { program } = useMetadata();
    const uiConfig = useUIConfig();
    const ruleResult = EventContext.useSelector(
        (state) => state.context.ruleResult,
    );
    const stage = program.programStages.find(({ id }) => id === "K2nxbE9ubSs")!;
    const triageSection = stage.programStageSections.find(
        ({ name }) => name === "Triage",
    );
    const currentDataElements = buildCurrentDataElements(stage);
    const currentSection = stage.programStageSections.find(
        ({ name }) => name === "Child Health Services",
    )!;

    const onFieldChange = useCallback(
        (dataElement: string, value: any) => {
            const allValues = {
                ...form.getFieldsValue(),
                [dataElement]: value,
            };
            eventActor.send({
                type: "FIELD_CHANGED",
                formData: allValues,
            });
        },
        [eventActor, form],
    );
    return (
        <Form form={form} component={false} layout="vertical">
            <Typography.Title level={4} style={{ marginBottom: 16 }}>
                {section}
            </Typography.Title>
            {triageSection && (
                <SubsectionGroups
                    items={triageSection.dataElements}
                    subsections={uiConfig.subsections[triageSection.id]}
                    formLayout={uiConfig.formLayouts?.[triageSection.id]}
                    getId={(de) => de.id}
                    sectionKey={triageSection.id}
                    renderElement={(dataElement, groupLength) => (
                        <DataElementRenderer
                            key={dataElement.id}
                            dataElementId={dataElement.id}
                            currentDataElements={currentDataElements}
                            ruleResult={ruleResult}
                            sectionLength={groupLength}
                            form={form}
                            onFieldChange={onFieldChange}
                        />
                    )}
                />
            )}
            <SubsectionGroups
                items={currentSection.dataElements}
                subsections={uiConfig.subsections[currentSection.id]}
                formLayout={uiConfig.formLayouts?.[currentSection.id]}
                getId={(de) => de.id}
                sectionKey={currentSection.id}
                renderElement={(dataElement, groupLength) => (
                    <DataElementRenderer
                        key={dataElement.id}
                        dataElementId={dataElement.id}
                        currentDataElements={currentDataElements}
                        ruleResult={ruleResult}
                        sectionLength={groupLength}
                        form={form}
                        onFieldChange={onFieldChange}
                    />
                )}
            />
        </Form>
    );
}
