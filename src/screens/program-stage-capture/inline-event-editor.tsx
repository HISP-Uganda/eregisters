import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Flex, Form, message } from "antd";
import React, { useState } from "react";
import ProgramStageForm from "../../components/program-stage-form";
import { EventContext } from "../../machines";
import { FlattenedEvent } from "../../schemas";
import { cancelDataModal } from "../../utils/record-cascades";
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
    const stageName = context.programStage.name;

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            await saveStageEvent(event.event, values, visit.event);
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
                message.error(`Failed to save ${stageName}`);
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
            options={{ input: eventFormInput(context, event, form) }}
        >
            <Form form={form} layout="vertical" preserve={false} initialValues={event.dataValues}>
                <ProgramStageForm form={form} programStage={context.programStage} />
                <Flex gap={8} justify="flex-end" style={{ marginTop: 12 }}>
                    <Button icon={<CloseOutlined />} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={saving}
                        onClick={handleSave}
                        style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                    >
                        Save
                    </Button>
                </Flex>
            </Form>
        </EventContext.Provider>
    );
}
