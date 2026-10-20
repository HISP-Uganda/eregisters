import { eventForCapture } from "@/program-rules/save-actions";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Flex, Form, message, Modal } from "antd";
import React, { useState } from "react";
import ProgramStageForm from "@/components/program-stage-form";
import { EventContext } from "@/machines";
import { EventRuleAwareForm } from "@/components/rule-aware-form";
import { assertRuleSaveAllowed } from "@/program-rules/save-actions";
import { FlattenedEvent, ProgramRuleResult } from "@/schemas";
import { cancelDataModal } from "@/utils/record-cascades";
import { saveStageEvent } from "./actions";
import { eventFormInput, StageFormContext } from "./stage";

/**
 * The form under an expanded row in inline-expand mode — the same form
 * machine and `ProgramStageForm` as the popup, so rules and sections
 * behave identically.
 */
export function InlineEventEditor({
    context,
    event,
    visit,
    onDone,
}: {
    context: StageFormContext;
    event: FlattenedEvent;
    visit: FlattenedEvent;
    onDone: () => void;
}) {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult>();
    const [confirmation, confirmationHolder] = Modal.useModal();
    const stageName = context.programStage.name;
    const captureEvent = eventForCapture(event, visit.dataValues?.occurredAt);

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            assertRuleSaveAllowed(ruleResult, true);
            if (ruleResult?.completionWarnings?.length) {
                const accepted = await new Promise<boolean>((resolve) => {
                    confirmation.confirm({
                        title: "Complete this event?",
                        content: ruleResult.completionWarnings!.map(warning => warning.content).join("; "),
                        okText: "Complete",
                        onOk: () => { resolve(true); },
                        onCancel: () => { resolve(false); },
                    });
                });
                if (!accepted) return;
            }
            await saveStageEvent(event.event, { occurredAt: captureEvent.dataValues.occurredAt, ...values }, visit.event, ruleResult, true);
            message.success(`Saved ${stageName}`);
            onDone();
        } catch (err) {
            console.error("Inline save failed:", err);
            // A rejected validateFields() can point at a field that isn't
            // visible (one a program rule just hid or showed), and then antd
            // shows nothing — the save would just silently not happen.
            if (err && typeof err === "object" && "errorFields" in err) {
                message.error(
                    "Some required fields are missing — please check the form and try again.",
                );
            } else {
                message.error(err instanceof Error ? err.message : `Failed to save ${stageName}`);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async () => {
        await cancelDataModal(event);
        onDone();
    };

    return (
        <EventContext.Provider
            key={event.event}
            options={{ input: eventFormInput(context, captureEvent, form) }}
        >
            <Form form={form} layout="vertical" preserve={false} initialValues={captureEvent.dataValues}>
                {confirmationHolder}
                <EventRuleAwareForm onRuleResult={setRuleResult}>
                    <ProgramStageForm form={form} programStage={context.programStage} />
                </EventRuleAwareForm>
                <Flex gap={8} justify="flex-end" style={{ marginTop: 12 }}>
                    <Button icon={<CloseOutlined />} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={saving}
                        disabled={!ruleResult || !!ruleResult.errors.length}
                        onClick={() => handleSave()}
                        style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                    >
                        Save
                    </Button>
                </Flex>
            </Form>
        </EventContext.Provider>
    );
}
