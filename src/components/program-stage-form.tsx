import React, { useEffect } from "react";

import { Card, Collapse, Form, FormInstance } from "antd";
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

    const sectionItems = programStage.programStageSections.flatMap(
        (section) => {
            if (ruleResult.hiddenSections.includes(section.id)) return [];
            return [
                {
                    key: section.id,
                    label: section.displayName || section.name,
                    children: (
                        <SubsectionGroups
                            items={section.dataElements}
                            subsections={uiConfig.subsections[section.id]}
                            formLayout={uiConfig.formLayouts?.[section.id]}
                            hiddenFields={ruleResult.hiddenFields}
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
                    ),
                },
            ];
        },
    );

    return (
        <Card size="small" styles={{ body: { padding: 8 } }}>
            {sectionItems.length > 0 && (
                <Collapse
                    accordion
                    size="small"
                    defaultActiveKey={sectionItems[0].key}
                    items={sectionItems}
                />
            )}
        </Card>
    );
}
