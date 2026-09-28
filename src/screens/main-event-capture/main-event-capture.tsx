import { Collapse, Flex, Form, FormInstance, Grid, Tabs } from "antd";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMetadata } from "../../hooks/useMetadata";
import { useModalState } from "../../hooks/useModalState";
import { useUIConfig } from "../../hooks/useUIConfig";
import { EventContext } from "../../machines";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";
import { NewbornModal, startNewborn } from "./newborn-modal";
import { VisitHeader } from "./visit-header";
import { SERVICE_TYPE, visitTabItems } from "./visit-tabs";

/** Answering it (a live birth) opens the newborn's registration. */
const LIVE_BIRTH = "REWqohCg4Km";

/**
 * Values program rules must see as soon as they change, including when a
 * rule itself assigns them (a field's own onChange doesn't fire then).
 */
const RULE_INPUTS = ["zzZ7nE2sbY4", "nxthjrx18Y0", "RltyVq1d11i", SERVICE_TYPE, "zxJ9SDZtKUS"];

function useRerunRulesOnInputs(form: FormInstance) {
    const eventActor = EventContext.useActorRef();
    const weightForAge = Form.useWatch("zzZ7nE2sbY4", form);
    const bmi = Form.useWatch("nxthjrx18Y0", form);
    const bmiForAge = Form.useWatch("RltyVq1d11i", form);
    const services = Form.useWatch(SERVICE_TYPE, form);
    const ageAtVisit = Form.useWatch("zxJ9SDZtKUS", form);
    const values = [weightForAge, bmi, bmiForAge, services, ageAtVisit];

    useEffect(() => {
        if (values.every((v) => v === undefined)) return;
        eventActor.send({
            type: "FIELD_CHANGED",
            formData: {
                ...form.getFieldsValue(),
                ...Object.fromEntries(RULE_INPUTS.map((id, i) => [id, values[i]])),
            },
        });
    }, values);

    return { services };
}

/** The visit form's body: date and services, the stage tabs, and newborn registration. */
export function MainEventCapture({
    form,
    trackedEntity,
    mainEvent,
    enrollment,
}: {
    form: FormInstance;
    trackedEntity: FlattenedTrackedEntity;
    mainEvent: FlattenedEvent;
    enrollment: FlattenedEnrollment;
}) {
    const newborn = useModalState<FlattenedTrackedEntity>();
    const { program } = useMetadata();
    const uiConfig = useUIConfig();
    const [activeKey, setActiveKey] = useState<string>("K2nxbE9ubSs-bnV62fxQmoE");
    const isMobile = !Grid.useBreakpoint().lg;
    const eventActor = EventContext.useActorRef();
    const ruleResult = EventContext.useSelector((state) => state.context.ruleResult);
    const { services } = useRerunRulesOnInputs(form);

    const { openModal: openNewborn } = newborn;
    const createChild = useCallback(async () => {
        const { client, enrollment } = await startNewborn(trackedEntity, form.getFieldsValue());
        openNewborn(client, enrollment);
    }, [trackedEntity, form, openNewborn]);

    const onFieldChange = useCallback(
        async (dataElement: string, value: any) => {
            eventActor.send({
                type: "FIELD_CHANGED",
                formData: { ...form.getFieldsValue(), [dataElement]: value },
            });
            if (dataElement === LIVE_BIRTH && !isEmpty(value)) {
                await createChild();
            }
        },
        [eventActor, form, createChild],
    );

    const tabItems = useMemo(
        () =>
            visitTabItems(program.programStages, {
                trackedEntity,
                mainEvent,
                enrollment,
                ruleResult,
                uiConfig,
                form,
                services,
                onFieldChange,
            }),
        [ruleResult, services, onFieldChange, program, trackedEntity, mainEvent, enrollment, form, uiConfig.subsections],
    );

    return (
        <Flex vertical gap={10} style={{ width: "100%" }}>
            <VisitHeader form={form} ruleResult={ruleResult} onFieldChange={onFieldChange} />
            {isMobile ? (
                <Collapse
                    accordion
                    activeKey={activeKey}
                    onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
                    items={tabItems}
                />
            ) : (
                <Tabs
                    tabPlacement="start"
                    items={tabItems}
                    tabBarStyle={{ background: "#fff", borderRadius: 0 }}
                    styles={{
                        content: {
                            maxHeight: "63vh",
                            overflow: "auto",
                            padding: 0,
                            margin: 0,
                            borderRadius: 0,
                            marginLeft: 8,
                        },
                        header: { maxHeight: "63vh", overflow: "auto" },
                    }}
                    onChange={setActiveKey}
                    activeKey={activeKey}
                />
            )}

            <NewbornModal
                child={newborn.data}
                enrollment={newborn.enrollment}
                isOpen={newborn.isOpen}
                onClose={newborn.closeModal}
                mother={trackedEntity}
                motherVisit={mainEvent}
                onAddAnother={async () => {
                    newborn.closeModal();
                    await createChild();
                }}
            />
        </Flex>
    );
}
