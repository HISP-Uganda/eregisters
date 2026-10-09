import { and, eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import { Form, type FormInstance } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { DataModal } from "@/components/data-modal";
import { MainEventCapture } from "@/screens/main-event-capture/main-event-capture";
import { EventRuleAwareForm } from "@/components/rule-aware-form";
import { getEventsCollection } from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";
import { EventContext } from "@/machines";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    ProgramRuleResult,
} from "@/schemas";
import { cancelDataModal } from "@/utils/record-cascades";
import { computeSaveBlock } from "@/utils/save-block";
import { saveVisit } from "./actions";
import { MAIN_STAGE, PROGRAM } from "./client";
import { useFormMetadata } from "./use-form-metadata";

/**
 * The previous value while the new one has the same content: the client
 * page's live queries can hand over equal records as new objects on every
 * autosave, which would rebuild the form body each time.
 */
function useStableRecord<T>(value: T): T {
    const ref = useRef(value);
    if (ref.current !== value && JSON.stringify(ref.current) !== JSON.stringify(value)) {
        ref.current = value;
    }
    return ref.current;
}

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
    trackedEntity = useStableRecord(trackedEntity);
    enrollment = useStableRecord(enrollment);
    const { mainStageDataElements, eventMandatoryIds, dataElementLabels } =
        useFormMetadata();
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult | null>(null);
    // Built once: the save check runs on every keystroke, and these cover
    // every data element.
    const saveCheckLabels = useMemo(
        () => new Map([...dataElementLabels, ["occurredAt", "Visit Date"]]),
        [dataElementLabels],
    );
    const saveCheckMandatoryIds = useMemo(
        () => ["occurredAt", "mrKZWf2WMIC", ...eventMandatoryIds],
        [eventMandatoryIds],
    );

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

    // The form machine reads its input once, when the form mounts, so the
    // latest events are read from a ref rather than re-rendering the form
    // each time an autosave changes them.
    const allEnrollmentEventsRef = useRef(allEnrollmentEvents);
    allEnrollmentEventsRef.current = allEnrollmentEvents;

    /**
     * The form body. Kept stable (DataModal memoises what it returns), so a
     * rule result, the parent's live queries or the footer re-rendering
     * don't re-render the whole visit form.
     */
    const renderForm = useCallback(
        (form: FormInstance) =>
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
                            allEnrollmentEvents: allEnrollmentEventsRef.current.map((e) => ({
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
            ) : null,
        [visit, enrollment, trackedEntity, programRules, programRuleVariables, mainStageDataElements],
    );

    const saveBlockFor = useCallback(
        (values: Record<string, unknown>) =>
            computeSaveBlock({
                metadataMandatoryIds: saveCheckMandatoryIds,
                ruleMandatoryIds: ruleResult?.mandatoryFields ?? [],
                hiddenIds: ruleResult?.hiddenFields ?? [],
                values: { ...(visit?.dataValues ?? {}), ...values },
                labels: saveCheckLabels,
                errors: (ruleResult?.errors ?? []).map((e) => e.content),
            }),
        [saveCheckMandatoryIds, ruleResult, visit, saveCheckLabels],
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
            saveBlockFor={saveBlockFor}
        >
            {renderForm}
        </DataModal>
    );
}
