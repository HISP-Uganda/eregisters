import React, { useEffect } from "react";

import { Card, Form, FormInstance } from "antd";
import { useUIConfig } from "../hooks/useUIConfig";
import { EventContext } from "../machines";
import { ProgramStage } from "../schemas";
import { buildCurrentDataElements } from "../utils/utils";
import { DataElementRenderer } from "./data-element-renderer";
import { SubsectionGroups } from "./subsection-groups";

export default function ProgramStageForm({
    form,
    programStage,
}: {
    form: FormInstance;
    programStage: ProgramStage;
}) {
    const eventActor = EventContext.useActorRef();
    const ruleResult = EventContext.useSelector((a) => a.context.ruleResult);
    const currentDataElements = buildCurrentDataElements(programStage);
    const uiConfig = useUIConfig();

    const specimenType = Form.useWatch("kTslIUl8qja", form);
    const onFieldChange = (dataElement: string, value: any) => {
        eventActor.send({
            type: "FIELD_CHANGED",
            formData: {
                ...form.getFieldsValue(),
                [dataElement]: value,
            },
        });
    };

    useEffect(() => {
        eventActor.send({
            type: "FIELD_CHANGED",
            formData: {
                ...form.getFieldsValue(),
                kTslIUl8qja: specimenType,
            },
        });
    }, [specimenType]);

    return (
        <Card>
            {programStage.programStageSections.flatMap((section) => {
                if (ruleResult.hiddenSections.includes(section.id)) return [];
                return (
                    <SubsectionGroups
                        key={section.id}
                        items={section.dataElements}
                        subsections={uiConfig.subsections[section.id]}
                        formLayout={uiConfig.formLayouts?.[section.id]}
                        getId={(de) => de.id}
                        sectionKey={section.id}
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
                );
            })}
        </Card>
    );
}
