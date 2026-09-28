import { Form } from "antd";
import React, { useState } from "react";
import { DataModal } from "../../components/data-modal";
import { TrackedEntityRuleAwareForm } from "../../components/rule-aware-form";
import { TrackerRegistration } from "../../components/tracker-registration";
import { useMetadata } from "../../hooks/useMetadata";
import { TrackedEntityContext } from "../../machines";
import {
    FlattenedEnrollment,
    FlattenedTrackedEntity,
    ProgramRuleResult,
} from "../../schemas";
import { cancelDataModal } from "../../utils/record-cascades";
import { computeSaveBlock } from "../../utils/save-block";
import { saveClient } from "./actions";
import { PROGRAM } from "./client";
import { useFormMetadata } from "./use-form-metadata";

/** The edit-client form, with the registration's program rules. */
export function ClientModal({
    client,
    isOpen,
    onClose,
    enrollment,
}: {
    /** The client as `clientForEditing` loads it. */
    client: FlattenedTrackedEntity | null;
    isOpen: boolean;
    onClose: () => void;
    enrollment: FlattenedEnrollment;
}) {
    const { programRules, programRuleVariables } = useMetadata();
    const { mainStageDataElements, teaMandatoryIds, teaLabels } = useFormMetadata();
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult | null>(null);

    return (
        <DataModal<FlattenedTrackedEntity>
            open={isOpen}
            data={client}
            onClose={onClose}
            onCancel={() => cancelDataModal(client!)}
            enrollment={enrollment}
            onSave={async ({ values }) => {
                if (client && values) {
                    await saveClient(client, values, enrollment);
                }
            }}
            title="Edit Client"
            submitButtonText="Save Client"
            saveBlockFor={(values) =>
                computeSaveBlock({
                    metadataMandatoryIds: teaMandatoryIds,
                    ruleMandatoryIds: ruleResult?.mandatoryFields ?? [],
                    hiddenIds: ruleResult?.hiddenFields ?? [],
                    values: {
                        ...(client?.attributes ?? {}),
                        ...(enrollment?.attributes ?? {}),
                        ...(enrollment?.enrolledAt
                            ? { enrolledAt: enrollment.enrolledAt }
                            : {}),
                        ...values,
                    },
                    labels: teaLabels,
                    errors: (ruleResult?.errors ?? []).map((e) => e.content),
                })
            }
        >
            {(form) => (
                <TrackedEntityContext.Provider
                    options={{
                        input: {
                            programRules,
                            programRuleVariables,
                            program: PROGRAM,
                            trackedEntity: client!,
                            validDataElements: mainStageDataElements,
                            form,
                        },
                    }}
                >
                    <TrackedEntityRuleAwareForm onRuleResult={setRuleResult}>
                        <Form
                            form={form}
                            layout="vertical"
                            preserve={false}
                            initialValues={client?.attributes}
                        >
                            <TrackerRegistration trackedEntity={client!} form={form} />
                        </Form>
                    </TrackedEntityRuleAwareForm>
                </TrackedEntityContext.Provider>
            )}
        </DataModal>
    );
}
