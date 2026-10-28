import { captureEventStatus } from "@/program-rules/save-actions";
import type { RuleEnvironment } from "@/program-rules/history";
import { createActorContext } from "@xstate/react";
import { FormInstance } from "antd";
import { assign, fromPromise, setup } from "xstate";
import { getEventsCollection } from "@/db/collections";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    ProgramRule,
    ProgramRuleResult,
    ProgramRuleVariable,
} from "@/schemas";
import { createEmptyProgramRuleResult, programRuleResultsEqual } from "@/program-rules/rule-results";
import { EventForRules, executeProgramRules } from "@/program-rules/execute-program-rules";

import { applyRuleResultsToForm, mergeChangedField, mergeFormData, FormEvent } from "./common";
import { whileSaving } from "@/app-update/unsaved-work";
export const eventFormMachine = setup({
    types: {
        events: {} as FormEvent,
        context: {} as {
            formData: Record<string, any>;
            ruleResult: ProgramRuleResult;
            errors: Record<string, string>;
            programRules: ProgramRule[];
            programRuleVariables: ProgramRuleVariable[];
            trackedEntity: FlattenedTrackedEntity;
            enrollment: FlattenedEnrollment;
            event: FlattenedEvent;
            program: string;
            programStage: string;
            validDataElements: Set<string>;
            form: FormInstance;
            ruleEnvironment?: RuleEnvironment;
            persistenceError: string | null;
            previousAssignments: Record<string, any>;
            allEnrollmentEvents: EventForRules[];
            hasPendingChanges: boolean;
        },
        input: {} as {
            programRules: ProgramRule[];
            programRuleVariables: ProgramRuleVariable[];
            event: FlattenedEvent;
            enrollment: FlattenedEnrollment;
            programStage: string;
            trackedEntity: FlattenedTrackedEntity;
            validDataElements: Set<string>;
            program: string;
            form: FormInstance;
            ruleEnvironment?: RuleEnvironment;
            allEnrollmentEvents: EventForRules[];
        },
    },
    actions: {
        updateForm: ({ context: { form, event } }) => {
            form.setFieldsValue(event.dataValues);
        },
        updateFormData: assign(({ context }) => ({
            formData: mergeFormData(context.event.dataValues, context.formData),
        })),
        updateField: assign({ formData: mergeChangedField }),
        applyRuleResults: assign(({ context }) =>
            applyRuleResultsToForm(context.ruleResult, context.form, context.formData),
        ),
        executeRulesSync: assign(({ context }) => {
            const {
                programRules,
                programRuleVariables,
                program,
                ruleResult,
                formData,
            } = context;

            const result = executeProgramRules({
                ruleEnvironment: context.ruleEnvironment,
                orgUnit: context.event.orgUnit,
                dataValues: {
                    ...formData,
                    ...ruleResult.assignments,
                },
                programRuleVariables,
                programRules,
                program,
                attributeValues: context.trackedEntity?.attributes || {},
                programStage: context.programStage,
                allEnrollmentEvents: context.allEnrollmentEvents,
                currentEventId: context.event.event,
                currentEventCreatedAt: context.event.createdAt,
                enrollment: context.event.enrollment,
            });

            return {
                ruleResult: programRuleResultsEqual(result, ruleResult)
                    ? ruleResult
                    : result,
            };
        }),
    },
    actors: {
        persist: fromPromise(
            async ({
                input: { event, formData },
            }: {
                input: {
                    event: FlattenedEvent;
                    formData: Record<string, any>;
                };
            }) => {
                const latest = getEventsCollection().get(event.event) ?? event;
                await whileSaving("saving an event", () =>
                    getEventsCollection().utils.insertLocally({
                        ...latest,
                        status: captureEventStatus(latest.status, formData),
                        ...(formData.occurredAt ? { occurredAt: formData.occurredAt } : {}),
                        dataValues: {
                            ...latest.dataValues,
                            ...formData,
                        },
                    }),
                );
            },
        ),
    },
}).createMachine({
    id: "event-form",
    initial: "initial",
    context: ({
        input: {
            event,
            programRuleVariables,
            programRules,
            enrollment,
            trackedEntity,
            validDataElements,
            programStage,
            program,
            form,
            ruleEnvironment,
            allEnrollmentEvents,
        },
    }) => {
        return {
            formData: {},
            errors: {},
            programRuleVariables,
            event,
            programRules,
            program,
            enrollment,
            programStage,
            trackedEntity,
            validDataElements,
            form,
            ruleEnvironment,
            allEnrollmentEvents,
            ruleResult: createEmptyProgramRuleResult(),
            persistenceError: null,
            previousAssignments: {},
            hasPendingChanges: false,
        };
    },
    states: {
        initial: {
            entry: ["updateFormData", "updateForm"],
            always: {
                target: "editing",
            },
        },
        editing: {
            entry: ["executeRulesSync", "applyRuleResults"],
            on: {
                FIELD_CHANGED: {
                    target: "persisting",
                    actions: ["updateField", "executeRulesSync", "applyRuleResults"],
                },
            },
        },
        persisting: {
            entry: assign({ hasPendingChanges: false }),
            on: {
                FIELD_CHANGED: {
                    actions: [
                        "updateField",
                        "executeRulesSync",
                        "applyRuleResults",
                        assign({ hasPendingChanges: true }),
                    ],
                },
            },
            invoke: {
                src: "persist",
                input: ({ context }) => ({
                    formData: { ...context.formData, ...context.form.getFieldsValue() },
                    event: context.event,
                }),
                onDone: [
                    {
                        guard: ({ context }) => context.hasPendingChanges,
                        target: "persisting",
                        reenter: true,
                    },
                    { target: "editing" },
                ],
                onError: {
                    target: "editing",
                    actions: assign({
                        errors: ({ event }: { event: any }) => {
                            return {
                                persist:
                                    event.error?.message || "Persist failed",
                            };
                        },
                    }),
                },
            },
        },
    },
});

export const EventContext = createActorContext(eventFormMachine);
