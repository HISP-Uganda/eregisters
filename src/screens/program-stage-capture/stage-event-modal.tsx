import { Form } from "antd";
import React, { useMemo, useState } from "react";
import { DataModal } from "@/components/data-modal";
import ProgramStageForm from "@/components/program-stage-form";
import { EventRuleAwareForm } from "@/components/rule-aware-form";
import { useMetadata } from "@/hooks/useMetadata";
import { EventContext } from "@/machines";
import { FlattenedEvent, ProgramRuleResult } from "@/schemas";
import { cancelDataModal } from "@/utils/record-cascades";
import { computeSaveBlock } from "@/utils/save-block";
import { saveStageEvent } from "./actions";
import { eventFormInput, StageFormContext, stageLabels, stageMandatoryIds } from "./stage";

/** The popup form for one event of the stage (modal mode). */
export function StageEventModal({
    context,
    event,
    isOpen,
    isNew,
    visit,
    onClose,
    onAddAnother,
}: {
    context: StageFormContext;
    event: FlattenedEvent | null;
    isOpen: boolean;
    isNew: boolean;
    visit: FlattenedEvent;
    onClose: () => void;
    /** Saved with "add another": close this event and start the next. */
    onAddAnother: () => Promise<void>;
}) {
    const { programStage } = context;
    const { dataElements } = useMetadata();
    const mandatoryIds = useMemo(() => stageMandatoryIds(programStage), [programStage]);
    const labels = useMemo(() => stageLabels(programStage, dataElements), [programStage, dataElements]);
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult | null>(null);

    return (
        <DataModal<FlattenedEvent>
            open={isOpen}
            data={event}
            onClose={onClose}
            onCancel={() => cancelDataModal(event!)}
            enrollment={context.enrollment}
            onSave={async ({ values, addAnother }) => {
                if (values && event) {
                    await saveStageEvent(event.event, values, visit.event);
                    if (addAnother) await onAddAnother();
                }
            }}
            title={isNew ? programStage.name : `Edit ${programStage.name}`}
            submitButtonText={`Save ${programStage.name}`}
            hasAddAnother={true}
            saveBlockFor={(values) =>
                computeSaveBlock({
                    metadataMandatoryIds: mandatoryIds,
                    ruleMandatoryIds: ruleResult?.mandatoryFields ?? [],
                    hiddenIds: ruleResult?.hiddenFields ?? [],
                    values: { ...(event?.dataValues ?? {}), ...values },
                    labels,
                    errors: (ruleResult?.errors ?? []).map((e) => e.content),
                })
            }
        >
            {(form) =>
                event ? (
                    <EventContext.Provider
                        key={event.event}
                        options={{ input: eventFormInput(context, event, form) }}
                    >
                        <EventRuleAwareForm onRuleResult={setRuleResult}>
                            <Form
                                form={form}
                                layout="vertical"
                                preserve={false}
                                initialValues={event.dataValues}
                            >
                                <ProgramStageForm form={form} programStage={programStage} />
                            </Form>
                        </EventRuleAwareForm>
                    </EventContext.Provider>
                ) : null
            }
        </DataModal>
    );
}
