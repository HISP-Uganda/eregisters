import { Card, FormInstance } from "antd";
import { orderBy } from "lodash";
import React from "react";
import { DataElementRenderer } from "../../components/data-element-renderer";
import RelationshipEvent from "../../components/relationship-event";
import { SubsectionGroups } from "../../components/subsection-groups";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    ProgramRuleResult,
    ProgramStage,
    UIConfig,
} from "../../schemas";
import { buildCurrentDataElements, FORM_ROW_GUTTER } from "../../utils/form-fields";
import { ProgramStageCapture } from "../program-stage-capture/program-stage-capture";

/** The visit's stage tabs, in this order. */
const STAGE_ORDER: Map<string, number> = new Map([
    ["wmPg6qplttg", 0],
    ["VzKe0OzKS8O", 1],
    ["K2nxbE9ubSs", 2],
    ["zKGWob5AZKP", 3],
    ["DA0Yt3V16AN", 4],
    ["opwSN351xGC", 5],
    ["dyt37jxHYGv", 6],
    ["x5x1cHHjg00", 7],
]);

/** The TB/ART follow-up stage: shown only for its services. */
const FOLLOW_UP_STAGE = "opwSN351xGC";
const FOLLOW_UP_SERVICES = ["TB", "DR-TB", "Leprosy", "ART", "HTS"];

/** Stages entered as their own events under the visit (lab tests, medicines). */
const CHILD_EVENT_STAGES = ["zKGWob5AZKP", "DA0Yt3V16AN"];
/** Medicines and Supplies: entered straight in the table's cells. */
const INLINE_ROW_STAGE = "DA0Yt3V16AN";

/** The service type field, shown above the tabs rather than in its section. */
export const SERVICE_TYPE = "mrKZWf2WMIC";

/** Whether the visit's services call for the TB/ART follow-up stage. */
export function showsFollowUpStage(services: unknown): boolean {
    return Boolean(services) &&
        String(services)
            .split(",")
            .some((service) => FOLLOW_UP_SERVICES.includes(service));
}

type TabContext = {
    trackedEntity: FlattenedTrackedEntity;
    mainEvent: FlattenedEvent;
    enrollment: FlattenedEnrollment;
    ruleResult: ProgramRuleResult;
    uiConfig: UIConfig;
    form: FormInstance;
    services: unknown;
    onFieldChange: (dataElement: string, value: any) => void;
};

function stageEventsTab(stage: ProgramStage, c: TabContext) {
    return {
        key: stage.id,
        label: stage.name,
        children: (
            <ProgramStageCapture
                programStage={stage}
                trackedEntity={c.trackedEntity}
                mainEvent={c.mainEvent}
                enrollment={c.enrollment}
                captureMode={stage.id === INLINE_ROW_STAGE ? "inline-row" : "modal"}
            />
        ),
    };
}

/** One tab per visible section of a stage filled in on the visit itself. */
function sectionTabs(stage: ProgramStage, c: TabContext) {
    const currentDataElements = buildCurrentDataElements(stage);
    return orderBy(stage.programStageSections, ["sortOrder"], ["asc"]).flatMap((section) => {
        if (c.ruleResult && c.ruleResult.hiddenSections.includes(section.id)) return [];
        const sectionKey = `${stage.id}-${section.id}`;
        return [
            {
                key: sectionKey,
                label: section.displayName || section.name,
                children: (
                    <Card>
                        <SubsectionGroups
                            items={section.dataElements.filter((de) => de.id !== SERVICE_TYPE)}
                            subsections={c.uiConfig.subsections[section.id]}
                            formLayout={c.uiConfig.formLayouts?.[section.id]}
                            hiddenFields={c.ruleResult.hiddenFields}
                            getId={(de) => de.id}
                            sectionKey={sectionKey}
                            rowGutter={FORM_ROW_GUTTER}
                            renderElement={(dataElement, groupLength) => (
                                <DataElementRenderer
                                    key={dataElement.id}
                                    dataElementId={dataElement.id}
                                    currentDataElements={currentDataElements}
                                    ruleResult={c.ruleResult}
                                    sectionLength={groupLength}
                                    form={c.form}
                                    onFieldChange={c.onFieldChange}
                                />
                            )}
                        />
                        {["Maternity", "Postnatal"].includes(section.name) && (
                            <RelationshipEvent
                                section={section.name}
                                trackedEntity={c.trackedEntity}
                                mainEvent={c.mainEvent}
                            />
                        )}
                    </Card>
                ),
            },
        ];
    });
}

/** The visit form's tabs: each stage's sections, or its events' table. */
export function visitTabItems(stages: ProgramStage[], c: TabContext) {
    const ordered = orderBy(
        stages.map((stage) => ({ ...stage, sortOrder: STAGE_ORDER.get(stage.id) })),
        "sortOrder",
        "asc",
    );
    return ordered.flatMap((stage) => {
        if (stage.id === FOLLOW_UP_STAGE) {
            return showsFollowUpStage(c.services) ? [stageEventsTab(stage, c)] : [];
        }
        if (CHILD_EVENT_STAGES.includes(stage.id)) return [stageEventsTab(stage, c)];
        return sectionTabs(stage, c);
    });
}
