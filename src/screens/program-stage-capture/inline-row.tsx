import { Form, Typography } from "antd";
import React from "react";
import { EventContext } from "@/machines";
import { FlattenedEvent } from "@/schemas";
import { EditableCell, OptionRow } from "./editable-cell";
import { eventFormInput, StageFormContext } from "./stage";

/**
 * One event's form machine and antd Form around its table row, so program
 * rules run per event as cells change. `component={false}` keeps the Form
 * markup-free: the `<tr>` stays a direct child of `<tbody>`.
 */
function InlineRowProvider({
    context,
    event,
    children,
}: {
    context: StageFormContext;
    event: FlattenedEvent;
    children: React.ReactNode;
}) {
    const [form] = Form.useForm();
    return (
        <EventContext.Provider
            key={event.event}
            options={{ input: eventFormInput(context, event, form) }}
        >
            <Form form={form} component={false} preserve={false} initialValues={event.dataValues}>
                {children}
            </Form>
        </EventContext.Provider>
    );
}

type InlineRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
    /** From `inlineRowProps`, via the table's `onRow`. */
    stageEvent?: FlattenedEvent;
    stageContext?: StageFormContext;
};

/**
 * The table's row component in inline-row mode: each row inside its own
 * form. A stable component (not made per render), so a re-render after a
 * cell is saved doesn't remount the rows and lose their state.
 */
export function InlineRow({ stageEvent, stageContext, ...rowProps }: InlineRowProps) {
    if (!stageEvent || !stageContext) return <tr {...rowProps} />;
    return (
        <InlineRowProvider key={stageEvent.event} context={stageContext} event={stageEvent}>
            <tr {...rowProps} />
        </InlineRowProvider>
    );
}

/** The table's `onRow` in inline-row mode: hands the row its event. */
export function inlineRowProps(context: StageFormContext, event: FlattenedEvent) {
    return { stageEvent: event, stageContext: context } as React.HTMLAttributes<HTMLElement>;
}

/**
 * A rule-aware cell of an inline row: follows the row's program-rule
 * results (a hidden, empty field shows a dash) and re-runs the rules after
 * each commit.
 */
export function InlineEditableCell({
    dataElementId,
    valueType,
    options,
    persist,
}: {
    dataElementId: string;
    valueType: string;
    options?: OptionRow[];
    persist: (value: unknown) => Promise<void>;
}) {
    const eventActor = EventContext.useActorRef();
    const ruleResult = EventContext.useSelector((s) => s.context.ruleResult);
    const form = EventContext.useSelector((s) => s.context.form);
    const currentValue = Form.useWatch(dataElementId, form);
    const isHidden = ruleResult?.hiddenFields.includes(dataElementId) ?? false;
    const isEffectivelyEmpty =
        currentValue === undefined ||
        currentValue === null ||
        currentValue === "" ||
        (Array.isArray(currentValue) && currentValue.length === 0);

    if (isHidden && isEffectivelyEmpty) {
        return (
            <Typography.Text type="secondary" style={{ fontSize: 11, fontStyle: "italic" }}>
                —
            </Typography.Text>
        );
    }

    return (
        <EditableCell
            valueType={valueType}
            value={currentValue}
            options={options}
            disabled={isHidden}
            onCommit={async (v) => {
                form?.setFieldValue(dataElementId, v);
                await persist(v);
                eventActor.send({
                    type: "FIELD_CHANGED",
                    formData: { ...(form?.getFieldsValue() ?? {}), [dataElementId]: v },
                });
            }}
        />
    );
}
