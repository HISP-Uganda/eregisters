import { Checkbox, DatePicker, DatePickerProps, FormInstance, Input, InputNumber, Radio, Select } from "antd";
import React, { useCallback } from "react";
import { DataElement, OptionSet, TrackedEntityAttribute } from "@/schemas";
import VillageSelect from "@/components/village-select";
import { FieldKind, NUMBER_INPUT_PROPS } from "./field-kind";

/**
 * Option selects wrap long labels instead of cutting them off — DHIS2
 * option labels are often long sentences that become impossible to tell
 * apart. Rendered as a sibling of the Form.Item (see `DataElementField`).
 */
const OPTION_SELECT_WRAP_CLASS = "eregisters-option-select-wrap";
const OPTION_SELECT_WRAP_POPUP_CLASS = `${OPTION_SELECT_WRAP_CLASS}-dropdown`;
export const OPTION_SELECT_WRAP_CSS = `
.${OPTION_SELECT_WRAP_CLASS} .ant-select-selector {
    height: auto !important;
    min-height: 32px;
}
.${OPTION_SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector .ant-select-selection-item,
.${OPTION_SELECT_WRAP_CLASS}.ant-select-multiple .ant-select-selection-item-content {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    line-height: 1.3 !important;
    word-break: break-word !important;
}
.${OPTION_SELECT_WRAP_POPUP_CLASS} .ant-select-item-option-content {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    line-height: 1.35 !important;
    word-break: break-word !important;
}
`;

// antd v6 shows a single select's value in an <input>, which CSS can't
// wrap — so the selected value and each option are rendered as custom JSX.
const wrapped = (lineHeight: number, display: string): React.CSSProperties => ({
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight,
    display,
});
const labelRender = (labelProps: { label?: React.ReactNode }) => (
    <span style={wrapped(1.3, "inline-block")}>{labelProps.label}</span>
);
const optionRender = (option: { label?: React.ReactNode }) => (
    <span style={wrapped(1.35, "block")}>{option.label}</span>
);
const filterOption = (input: string, option: any) =>
    option
        ? option.name.toLowerCase().includes(input.toLowerCase()) ||
          option.code.toLowerCase().includes(input.toLowerCase())
        : false;

/** Each village picker: the fields it follows (and fills) and whether it filters others. */
const VILLAGE_FIELDS: Record<string, Pick<React.ComponentProps<typeof VillageSelect>, "watchFields" | "filterFields">> = {
    oTI0DLitzFY: {
        watchFields: [
            { fieldId: ["XjgpfkoxffK", "lpAaZa1cKCB", "sOBCVNIm1kX"], label: "District" },
            { fieldId: ["PKuyTiVCR89", "lqbqW3iYmKl", "qbxJxuZCyKu"], label: "Subcounty" },
            { fieldId: ["W87HAtUHJjB", "BiergDUeQra", "SjvgaRn8m7Y"], label: "Parish" },
        ],
        filterFields: ["pixScollYA6", "YoteNDkoIwM"],
    },
    pixScollYA6: {
        watchFields: [
            { fieldId: "lpAaZa1cKCB", label: "District" },
            { fieldId: "lqbqW3iYmKl", label: "Subcounty" },
            { fieldId: "BiergDUeQra", label: "Parish" },
        ],
    },
    YoteNDkoIwM: {
        watchFields: [
            { fieldId: "sOBCVNIm1kX", label: "District" },
            { fieldId: "qbxJxuZCyKu", label: "Subcounty" },
            { fieldId: "SjvgaRn8m7Y", label: "Parish" },
        ],
    },
};

type InputProps = {
    kind: FieldKind;
    dataElement: DataElement | TrackedEntityAttribute;
    options?: OptionSet["options"];
    disabled: boolean;
    vertical: boolean;
    form: FormInstance;
    disabledDate?: DatePickerProps["disabledDate"];
    onFieldChange: (dataElementId: string, value: any) => void;
};

/** Radio buttons; clicking the chosen one again clears it. */
function RadioOptions({
    dataElement,
    options,
    disabled,
    vertical,
    form,
    onFieldChange,
    onChange: formOnChange,
    ...rest
}: Omit<InputProps, "kind"> & { onChange?: (...args: any[]) => void }) {
    const id = dataElement.id;
    const handleChange = useCallback(
        (e: any) => {
            formOnChange?.(e);
            onFieldChange(id, e.target.value);
        },
        [id, onFieldChange, formOnChange],
    );
    const handleClick = useCallback(
        (code: string) => () => {
            if (form.getFieldValue(id) === code) {
                form.setFieldValue(id, undefined);
                onFieldChange(id, undefined);
            }
        },
        [id, form, onFieldChange],
    );
    return (
        // `rest` carries the value Form.Item injects.
        <Radio.Group {...rest} disabled={disabled} vertical={vertical} onChange={handleChange}>
            {options?.map((o) => (
                <Radio key={o.code} value={o.code} onClick={handleClick(o.code)}>
                    {o.name}
                </Radio>
            ))}
        </Radio.Group>
    );
}

/**
 * The input for one field. Form.Item clones this element to inject
 * `value` and `onChange`; every branch passes them on, and an input with
 * its own `onChange` calls the form's first — as antd does when the input
 * is Form.Item's direct child.
 */
export function FieldInput({
    kind,
    dataElement,
    options,
    disabled,
    vertical,
    form,
    disabledDate,
    onFieldChange,
    ...injected
}: InputProps & { onChange?: (...args: any[]) => void }) {
    const id = dataElement.id;
    const then =
        <A extends unknown[]>(handler: (...args: A) => void) =>
        (...args: A) => {
            injected.onChange?.(...args);
            handler(...args);
        };
    const onBlur = (e: { target: { value: unknown } }) => onFieldChange(id, e.target.value);
    const onDate = (format: string) =>
        then((date: { format: (f: string) => string } | null) =>
            onFieldChange(id, date ? date.format(format) : undefined),
        );

    switch (kind) {
        case "village":
            return (
                <VillageSelect
                    {...injected}
                    form={form}
                    fieldId={id}
                    onFieldChange={onFieldChange}
                    {...VILLAGE_FIELDS[id]}
                    syncParentFields
                    allowDirectSearch
                    sortField="village_name"
                />
            );
        case "multiSelect":
        case "select":
            return (
                <Select
                    {...injected}
                    disabled={disabled}
                    className={OPTION_SELECT_WRAP_CLASS}
                    popupClassName={OPTION_SELECT_WRAP_POPUP_CLASS}
                    style={{ width: "100%" }}
                    options={options}
                    fieldNames={{ label: "name", value: "code" }}
                    allowClear
                    {...(kind === "multiSelect"
                        ? {
                              mode: "multiple" as const,
                              menuItemSelectedIcon: (props: { isSelected?: boolean }) => (
                                  <Checkbox checked={props.isSelected} />
                              ),
                          }
                        : {})}
                    onChange={then((value: unknown) => onFieldChange(id, value))}
                    showSearch={{ filterOption }}
                    labelRender={labelRender}
                    optionRender={optionRender}
                />
            );
        case "radio":
            return (
                <RadioOptions
                    {...injected}
                    dataElement={dataElement}
                    options={options}
                    disabled={disabled}
                    vertical={vertical}
                    form={form}
                    onFieldChange={onFieldChange}
                />
            );
        case "boolean":
            return (
                <Checkbox {...injected} disabled={disabled} onChange={then((e: { target: { checked: boolean } }) => onFieldChange(id, e.target.checked))}>
                    {dataElement.formName ?? dataElement.name}
                </Checkbox>
            );
        case "datetime":
            return (
                <DatePicker
                    {...injected}
                    disabled={disabled}
                    style={{ width: "100%" }}
                    showTime
                    onChange={onDate("YYYY-MM-DDTHH:mm:ss")}
                    disabledDate={disabledDate}
                />
            );
        case "date":
            return (
                <DatePicker
                    {...injected}
                    disabled={disabled}
                    style={{ width: "100%" }}
                    onChange={onDate("YYYY-MM-DD")}
                    disabledDate={disabledDate}
                />
            );
        case "longText":
            return <Input.TextArea {...injected} disabled={disabled} rows={4} onBlur={onBlur} />;
        case "number":
            return (
                <InputNumber
                    {...injected}
                    {...NUMBER_INPUT_PROPS[dataElement.valueType]}
                    disabled={disabled}
                    style={{ width: "100%" }}
                    onBlur={onBlur}
                />
            );
        default:
            return <Input {...injected} disabled={disabled} onBlur={onBlur} allowClear />;
    }
}
