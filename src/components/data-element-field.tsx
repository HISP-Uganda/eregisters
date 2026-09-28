import { Col, DatePickerProps, Form, FormInstance } from "antd";
import React from "react";
import {
    DataElement,
    FlattenedEvent,
    FlattenedTrackedEntity,
    Message,
    OptionSet,
    RenderType,
    TrackedEntityAttribute,
} from "../schemas";
import { createGetValueProps, createNormalize } from "../utils/form-fields";
import { FieldInput, OPTION_SELECT_WRAP_CSS } from "./data-element-field/field-inputs";
import { fieldKind, takesFullRow, VILLAGE_CASCADED_FIELDS } from "./data-element-field/field-kind";
import DobPicker from "./dob-picker";

type Props = {
    dataElement: DataElement | TrackedEntityAttribute;
    hidden: boolean;
    finalOptions?: OptionSet["options"];
    errors: Array<Message>;
    messages: Array<Message>;
    warnings: Array<Message>;
    required: boolean;
    sm?: number;
    lg?: number;
    span?: number;
    md?: number;
    xs?: number;
    xl?: number;
    form: FormInstance<FlattenedTrackedEntity | FlattenedEvent>;
    customLabel?: string;
    onFieldChange: (dataElementId: string, value: any) => void;
    desktopRenderType?: RenderType["type"];
    disabled?: boolean;
    disabledDate?: DatePickerProps["disabledDate"];
};

/** Rule errors and warnings as the Form.Item's help and status. */
function feedback(errors: Message[], warnings: Message[]) {
    const all = [...errors, ...warnings];
    return {
        help: all.length > 0 ? all.map((e) => e.content).join(", ") : undefined,
        validateStatus: errors.length > 0 ? ("error" as const) : warnings.length > 0 ? ("warning" as const) : undefined,
        hasFeedback: all.length > 0,
    };
}

function Field({
    dataElement,
    finalOptions,
    errors,
    warnings,
    required,
    sm,
    lg,
    md,
    xs,
    xl,
    form,
    customLabel,
    desktopRenderType,
    onFieldChange,
    disabledDate,
    disabled = false,
}: Props) {
    const label = customLabel || dataElement.formName || dataElement.name;

    if (dataElement.valueType === "AGE") {
        return (
            <Col key={dataElement.id} sm={{ span: sm }} md={{ span: md }} lg={{ span: lg }} xs={{ span: xs }} xl={{ span: xl }}>
                <DobPicker form={form} dataElement={dataElement} onFieldChange={onFieldChange} label={label} />
            </Col>
        );
    }

    const kind = fieldKind(dataElement, desktopRenderType);
    const full = takesFullRow(kind, finalOptions?.length ?? 0);
    const span = (value?: number) => ({ span: full ? 24 : value });
    return (
        <Col key={dataElement.id} sm={span(sm)} md={span(md)} lg={span(lg)} xs={{ span: xs }} xl={span(xl)}>
            {/* A sibling of Form.Item, which needs a single child. */}
            {(kind === "select" || kind === "multiSelect") && <style>{OPTION_SELECT_WRAP_CSS}</style>}
            <Form.Item
                key={dataElement.id}
                label={dataElement.valueType === "BOOLEAN" ? null : `${label}`}
                name={dataElement.id}
                required={required}
                rules={[{ required, message: `${label} is required` }]}
                getValueProps={createGetValueProps(dataElement.valueType)}
                normalize={createNormalize(dataElement.valueType)}
                {...feedback(errors, warnings)}
                style={{ padding: 0, margin: 0 }}
            >
                <FieldInput
                    kind={kind}
                    dataElement={dataElement}
                    options={finalOptions}
                    disabled={disabled || VILLAGE_CASCADED_FIELDS.has(dataElement.id)}
                    vertical={desktopRenderType === "VERTICAL_RADIOBUTTONS"}
                    form={form}
                    disabledDate={disabledDate}
                    onFieldChange={onFieldChange}
                />
            </Form.Item>
        </Col>
    );
}

/**
 * One data element or attribute as a form field, with the input its value
 * type (or option set, render type) calls for and the program rules'
 * errors and warnings. Renders nothing when `hidden`.
 */
export const DataElementField = React.memo<Props>((props) => (props.hidden ? null : <Field {...props} />));
