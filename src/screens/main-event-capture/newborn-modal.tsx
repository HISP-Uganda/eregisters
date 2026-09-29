import { Form } from "antd";
import React, { useMemo } from "react";
import { DataModal } from "@/components/data-modal";
import { TrackedEntityRuleAwareForm } from "@/components/rule-aware-form";
import { TrackerRegistration } from "@/components/tracker-registration";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";
import { useTrackedEntitySaveBlock } from "@/hooks/useTrackedEntitySaveBlock";
import { TrackedEntityContext } from "@/machines";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "@/schemas";
import { cancelDataModal } from "@/utils/record-cascades";
import { newbornFirstVisit, newbornFromMother } from "./newborn";

/** Stores a new child and enrollment (from `newbornFromMother`) locally. */
export async function startNewborn(
    mother: FlattenedTrackedEntity,
    visitValues: Record<string, any>,
) {
    const { client, enrollment } = newbornFromMother(mother, visitValues);
    await getTrackedEntitiesCollection().utils.insertLocally(client);
    await getEnrollmentsCollection().utils.insertLocally(enrollment);
    return { client, enrollment };
}

/** Links the child to the mother, keeps its attributes, and adds its first visit. */
async function saveNewborn(
    child: FlattenedTrackedEntity,
    enrollment: FlattenedEnrollment,
    values: Record<string, any>,
    mother: FlattenedTrackedEntity,
    motherVisit: FlattenedEvent,
) {
    await getTrackedEntitiesCollection().update(child.trackedEntity, (draft) => {
        draft.parentEntity = mother.trackedEntity;
    }).isPersisted.promise;
    await getEnrollmentsCollection().update(enrollment.enrollment, (draft) => {
        draft.attributes = child.attributes;
    }).isPersisted.promise;
    await getEventsCollection().insert(newbornFirstVisit(enrollment, values, motherVisit.event))
        .isPersisted.promise;
}

/** The "New Born Child" registration popup, opened from the mother's visit. */
export function NewbornModal({
    child,
    enrollment,
    isOpen,
    onClose,
    mother,
    motherVisit,
    onAddAnother,
}: {
    child: FlattenedTrackedEntity | null;
    enrollment: FlattenedEnrollment | null;
    isOpen: boolean;
    onClose: () => void;
    mother: FlattenedTrackedEntity;
    motherVisit: FlattenedEvent;
    /** Saved with "add another" (twins): close this child and start the next. */
    onAddAnother: () => Promise<void>;
}) {
    const { program, programRules, programRuleVariables } = useMetadata();
    const { saveBlockFor, onRuleResult } = useTrackedEntitySaveBlock({
        ...(child?.attributes ?? {}),
        ...(enrollment?.attributes ?? {}),
    });
    const programAttributes = useMemo(
        () =>
            new Set(
                program.programTrackedEntityAttributes.map(
                    ({ trackedEntityAttribute }) => trackedEntityAttribute.id,
                ),
            ),
        [],
    );

    return (
        <DataModal<FlattenedTrackedEntity>
            open={isOpen}
            data={child}
            onClose={onClose}
            onCancel={() => cancelDataModal(child!)}
            hasAddAnother={true}
            enrollment={enrollment}
            onSave={async ({ values, addAnother }) => {
                if (child && values && enrollment) {
                    await saveNewborn(child, enrollment, values, mother, motherVisit);
                    if (addAnother) await onAddAnother();
                }
            }}
            title="New Born Child"
            submitButtonText="Save Child"
            saveBlockFor={saveBlockFor}
        >
            {(form) =>
                child ? (
                    <TrackedEntityContext.Provider
                        key={child.trackedEntity}
                        options={{
                            input: {
                                programRules,
                                programRuleVariables,
                                program: "ueBhWkWll5v",
                                trackedEntity: child,
                                validDataElements: programAttributes,
                                form,
                            },
                        }}
                    >
                        <TrackedEntityRuleAwareForm onRuleResult={onRuleResult}>
                            <Form
                                form={form}
                                layout="vertical"
                                preserve={false}
                                initialValues={child.attributes}
                            >
                                <TrackerRegistration trackedEntity={child} form={form} />
                            </Form>
                        </TrackedEntityRuleAwareForm>
                    </TrackedEntityContext.Provider>
                ) : null
            }
        </DataModal>
    );
}
