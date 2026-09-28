import { and, eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import { Form } from "antd";
import React, { useState } from "react";
import { DataModal } from "../../components/data-modal";
import { MainEventCapture } from "../main-event-capture/main-event-capture";
import { EventRuleAwareForm } from "../../components/rule-aware-form";
import { getEventsCollection } from "../../db/collections";
import { useMetadata } from "../../hooks/useMetadata";
import { EventContext } from "../../machines";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    ProgramRuleResult,
} from "../../schemas";
import { cancelDataModal } from "../../utils/record-cascades";
import { computeSaveBlock } from "../../utils/save-block";
import { saveVisit } from "./actions";
import { MAIN_STAGE, PROGRAM } from "./client";
import { useFormMetadata } from "./use-form-metadata";

/** The add/edit visit form, with the visit stage's program rules. */
export function VisitModal({
    visit,
    isOpen,
    isNew,
    onClose,
    trackedEntity,
    enrollment,
    allEnrollmentEvents,
}: {
    visit: FlattenedEvent | null;
    isOpen: boolean;
    isNew: boolean;
    onClose: () => void;
    trackedEntity: FlattenedTrackedEntity;
    enrollment: FlattenedEnrollment;
    allEnrollmentEvents: FlattenedEvent[];
}) {
    const { orgUnit, programRules, programRuleVariables } = useMetadata();
    const { mainStageDataElements, eventMandatoryIds, dataElementLabels } =
        useFormMetadata();
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult | null>(null);

    /** The open visit as stored now, for its sync status. */
    const { data: storedVisit } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ events: getEventsCollection() })
                .where(({ events }) =>
                    and(
                        eq(events.event, visit?.event),
                        eq(events.orgUnit, orgUnit),
                        not(eq(events.syncStatus, "deleted")),
                    ),
                )
                .findOne(),
        [visit?.event],
    );

    return (
        <DataModal<FlattenedEvent>
            open={isOpen}
            status={storedVisit?.syncStatus}
            data={visit}
            onClose={onClose}
            onCancel={() => cancelDataModal(visit!)}
            enrollment={enrollment}
            onSave={async ({ values }) => {
                if (values && visit) {
                    await saveVisit(visit, values, trackedEntity);
                }
            }}
            title={isNew ? "New Visit" : "Edit Visit"}
            submitButtonText="Save Visit"
            saveBlockFor={(values) =>
                computeSaveBlock({
                    metadataMandatoryIds: ["occurredAt", "mrKZWf2WMIC", ...eventMandatoryIds],
                    ruleMandatoryIds: ruleResult?.mandatoryFields ?? [],
                    hiddenIds: ruleResult?.hiddenFields ?? [],
                    values: { ...(visit?.dataValues ?? {}), ...values },
                    labels: new Map([...dataElementLabels, ["occurredAt", "Visit Date"]]),
                    errors: (ruleResult?.errors ?? []).map((e) => e.content),
                })
            }
        >
            {(form) =>
                visit ? (
                    <EventContext.Provider
                        options={{
                            input: {
                                programRules,
                                programRuleVariables,
                                enrollment,
                                event: visit,
                                program: PROGRAM,
                                programStage: MAIN_STAGE,
                                trackedEntity,
                                validDataElements: mainStageDataElements,
                                form,
                                allEnrollmentEvents: allEnrollmentEvents.map((e) => ({
                                    event: e.event,
                                    programStage: e.programStage,
                                    occurredAt: e.occurredAt,
                                    dataValues: e.dataValues,
                                })),
                            },
                        }}
                    >
                        <EventRuleAwareForm onRuleResult={setRuleResult}>
                            <Form
                                form={form}
                                layout="vertical"
                                preserve={false}
                                initialValues={visit.dataValues}
                            >
                                <MainEventCapture
                                    form={form}
                                    enrollment={enrollment}
                                    trackedEntity={trackedEntity}
                                    mainEvent={visit}
                                />
                            </Form>
                        </EventRuleAwareForm>
                    </EventContext.Provider>
                ) : null
            }
        </DataModal>
    );
}
