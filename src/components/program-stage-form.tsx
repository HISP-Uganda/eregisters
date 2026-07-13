import React, { useEffect } from "react";

import { Card, Form, FormInstance, Row, Typography } from "antd";
import { useUIConfig } from "../hooks/useUIConfig";
import { EventContext } from "../machines";
import { ProgramStage } from "../schemas";
import { buildCurrentDataElements } from "../utils/utils";
import { DataElementRenderer } from "./data-element-renderer";

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
                const sectionSubsections = uiConfig.subsections[section.id];
                if (sectionSubsections && sectionSubsections.length > 0) {
                    const assignedIds = new Set(
                        sectionSubsections.flatMap((s) => s.dataElementIds),
                    );
                    const groups: Array<{
                        label: string | null;
                        elements: typeof section.dataElements;
                    }> = sectionSubsections.map((sub) => ({
                        label: sub.name,
                        elements: section.dataElements.filter((de) =>
                            sub.dataElementIds.includes(de.id),
                        ),
                    }));
                    const unassigned = section.dataElements.filter(
                        (de) => !assignedIds.has(de.id),
                    );
                    if (unassigned.length > 0) {
                        groups.push({ label: null, elements: unassigned });
                    }
                    return groups.flatMap(({ label, elements }) =>
                        elements.length === 0
                            ? []
                            : [
                                  <React.Fragment key={`${section.id}-${label}`}>
                                      {label && (
                                          <Typography.Text
                                              type="secondary"
                                              style={{
                                                  display: "block",
                                                  marginTop: 12,
                                                  marginBottom: 4,
                                                  fontSize: 12,
                                                  textTransform: "uppercase",
                                                  letterSpacing: 0.5,
                                              }}
                                          >
                                              {label}
                                          </Typography.Text>
                                      )}
                                      <Row gutter={[16, 16]}>
                                          {elements.map((dataElement) => (
                                              <DataElementRenderer
                                                  key={dataElement.id}
                                                  dataElementId={dataElement.id}
                                                  currentDataElements={
                                                      currentDataElements
                                                  }
                                                  ruleResult={ruleResult}
                                                  sectionLength={
                                                      elements.length
                                                  }
                                                  form={form}
                                                  onFieldChange={onFieldChange}
                                              />
                                          ))}
                                      </Row>
                                  </React.Fragment>,
                              ],
                    );
                }
                return (
                    <Row gutter={[16, 16]} key={section.id}>
                        {section.dataElements.map((dataElement) => (
                            <DataElementRenderer
                                key={dataElement.id}
                                dataElementId={dataElement.id}
                                currentDataElements={currentDataElements}
                                ruleResult={ruleResult}
                                sectionLength={section.dataElements.length}
                                form={form}
                                onFieldChange={onFieldChange}
                            />
                        ))}
                    </Row>
                );
            })}
        </Card>
    );
}
