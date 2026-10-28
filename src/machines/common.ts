import { FormInstance } from "antd";
import { ProgramRuleResult } from "@/schemas";
import { assertEvent } from "xstate";

export type FormEvent =
    | { type: "FIELD_CHANGED"; formData: Record<string, any> }
    | { type: "EXECUTE_RULES" }
    | { type: "RULES_COMPLETE"; result: ProgramRuleResult }
    | { type: "PERSIST_COMPLETE" }
    | { type: "RESET" };

export function mergeChangedField(
    { context, event }: { context: { formData: Record<string, any> }; event: FormEvent },
) {
    assertEvent(event, "FIELD_CHANGED");
    return { ...context.formData, ...event.formData };
}
export function mergeFormData(
    persisted: Record<string, any>,
    current: Record<string, any>,
) {
    return { ...persisted, ...current };
}

/** Keep rule inputs, rendered values and the next persisted form in agreement. */
export function applyRuleResultsToForm(ruleResult: ProgramRuleResult, form: FormInstance,
    previousData: Record<string, any> = {}) {
    const updates = { ...ruleResult.assignments };
    for (const id of ruleResult.hiddenFields) updates[id] = undefined;
    if (Object.keys(updates).length) form.setFieldsValue(updates);
    return {
        previousAssignments: { ...ruleResult.assignments },
        formData: { ...previousData, ...updates },
    };
}
