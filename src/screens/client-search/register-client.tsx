import { commitEnrollmentRuleActions } from "@/program-rules/commit-actions";
import { assertRuleSaveAllowed } from "@/program-rules/save-actions";
import type { ProgramRuleResult } from "@/schemas";
import { useNavigate } from "@tanstack/react-router";
import { Form } from "antd";
import React from "react";
import { DataModal } from "@/components/data-modal";
import { TrackedEntityRuleAwareForm } from "@/components/rule-aware-form";
import { TrackerRegistration } from "@/components/tracker-registration";
import { getEnrollmentsCollection, getTrackedEntitiesCollection } from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";
import { useModalState } from "@/hooks/useModalState";
import { useProgramAttributeIds } from "@/hooks/useProgramAttributeIds";
import { useTrackedEntitySaveBlock } from "@/hooks/useTrackedEntitySaveBlock";
import { TrackedEntityContext } from "@/machines";
import { FlattenedEnrollment, FlattenedTrackedEntity } from "@/schemas";
import { cancelDataModal } from "@/utils/record-cascades";
import { createEmptyEnrollment, createEmptyTrackedEntity, recordTimestamp } from "@/utils/record-factories";

/** Saves the registration form's values on the new client and its enrollment. */
async function saveRegistration(
    client: FlattenedTrackedEntity,
    enrollment: FlattenedEnrollment,
    values: Record<string, any>,
    ruleResult?: ProgramRuleResult | null,
    complete = false,
) {
    assertRuleSaveAllowed(ruleResult, complete);
    await getTrackedEntitiesCollection().update(client.trackedEntity, (draft) => {
        draft.attributes = { ...client.attributes, ...values };
        draft.syncStatus = "pending";
        draft.updatedAt = recordTimestamp();
    }).isPersisted.promise;
    await getEnrollmentsCollection().update(enrollment.enrollment, (draft) => {
        draft.attributes = { ...enrollment.attributes, ...values };
        if (complete) draft.status = "COMPLETED";
        draft.syncStatus = "pending";
        draft.updatedAt = recordTimestamp();
    }).isPersisted.promise;
    await commitEnrollmentRuleActions(enrollment, values, ruleResult);
}

/**
 * Registering a new client: a draft client and enrollment are stored as
 * the form opens (so rules and cascades can see them), and either saved as
 * pending or — on Cancel — deleted.
 */
export function useClientRegistration() {
    const { orgUnit } = useMetadata();
    const modal = useModalState<FlattenedTrackedEntity>();
    const { openModal } = modal;

    /** Opens the form for a new client, pre-filled with `attributes` (e.g. what was searched for). */
    const start = async (attributes?: Record<string, string>) => {
        const client = createEmptyTrackedEntity({ orgUnit, ...(attributes ? { attributes } : {}) });
        const enrollment = createEmptyEnrollment({
            orgUnit,
            trackedEntity: client.trackedEntity,
            ...(attributes ? { attributes } : {}),
        });
        await getTrackedEntitiesCollection().utils.insertLocally(client);
        await getEnrollmentsCollection().utils.insertLocally(enrollment);
        openModal(client, enrollment);
    };

    return { ...modal, start };
}

/** The "Register New Client" form. Saved: opens the client — or, with "add another", a fresh form. */
export function RegisterClientModal({ registration }: { registration: ReturnType<typeof useClientRegistration> }) {
    const { data: client, enrollment, isOpen, closeModal, start } = registration;
    const navigate = useNavigate();
    const { ruleEnvironment, program, programRules, programRuleVariables } = useMetadata();
    const { saveBlockFor, onRuleResult, ruleResult } = useTrackedEntitySaveBlock({
        ...(client?.attributes ?? {}),
        ...(enrollment?.attributes ?? {}),
    });
    const programAttributes = useProgramAttributeIds(program);

    return (
        <DataModal<FlattenedTrackedEntity>
            open={isOpen}
            data={client}
            onClose={closeModal}
            onCancel={() => cancelDataModal(client!)}
            enrollment={enrollment}
            onSave={async ({ values, addAnother, complete }) => {
                if (!values || !client || !enrollment) return;
                await saveRegistration(client, enrollment, values, ruleResult, complete);
                if (addAnother) {
                    closeModal();
                    await start();
                } else {
                    navigate({ to: "/tracked-entity/$trackedEntity", params: { trackedEntity: client.trackedEntity } });
                }
            }}
            title="Register New Client"
            submitButtonText="Register client"
            completionFeedback={{ errors: (ruleResult?.completionErrors ?? []).map((m) => m.content), warnings: (ruleResult?.completionWarnings ?? []).map((m) => m.content) }}
            hasAddAnother={true}
            saveBlockFor={saveBlockFor}
        >
            {(form) => (
                <TrackedEntityContext.Provider
                    key={client?.trackedEntity || "closed"}
                    options={{
                        input: {
                            ruleEnvironment,
                            programRules,
                            programRuleVariables,
                            program: "ueBhWkWll5v",
                            trackedEntity: client!,
                            validDataElements: programAttributes,
                            form,
                        },
                    }}
                >
                    <TrackedEntityRuleAwareForm onRuleResult={onRuleResult}>
                        <Form form={form} layout="vertical" preserve={false} initialValues={client?.attributes}>
                            <TrackerRegistration trackedEntity={client!} form={form} />
                        </Form>
                    </TrackedEntityRuleAwareForm>
                </TrackedEntityContext.Provider>
            )}
        </DataModal>
    );
}
