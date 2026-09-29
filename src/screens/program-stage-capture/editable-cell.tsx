import { DatePicker, Input, InputNumber, Select, Switch } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

export type OptionRow = {
    id: string;
    name: string;
    code: string;
    optionSet: string;
    sortOrder: number;
};

const NUMERIC_TYPES = new Set([
    "NUMBER",
    "INTEGER",
    "INTEGER_POSITIVE",
    "INTEGER_ZERO_OR_POSITIVE",
    "INTEGER_NEGATIVE",
]);

const SELECT_WRAP_CLASS = "eregisters-editable-select";
const SELECT_WRAP_POPUP_CLASS = `${SELECT_WRAP_CLASS}-dropdown`;
/**
 * Full-text wrapping for both the selected value and every dropdown
 * option — HMIS/DHIS2 option labels are often long sentences, and antd's
 * default ellipsis leaves them impossible to tell apart. Render once
 * wherever editable cells are shown.
 */
export const SELECT_WRAP_CSS = `
.${SELECT_WRAP_CLASS}.ant-select-single {
    height: auto !important;
    min-height: 24px;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector {
    height: auto !important;
    min-height: 24px;
    padding-top: 2px !important;
    padding-bottom: 2px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector .ant-select-selection-item {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    line-height: 1.3 !important;
    padding: 2px 0 !important;
    max-width: 100% !important;
    min-width: 0 !important;
    word-break: break-word !important;
    flex: 1 1 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector .ant-select-selection-search {
    top: 2px !important;
    max-width: 100% !important;
    min-width: 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector .ant-select-selection-search-input {
    max-width: 100% !important;
}
.${SELECT_WRAP_POPUP_CLASS} .ant-select-item {
    height: auto !important;
    min-height: 32px;
    padding: 6px 12px !important;
}
.${SELECT_WRAP_POPUP_CLASS} .ant-select-item-option-content {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    line-height: 1.35 !important;
    word-break: break-word !important;
}
`;

const wrapped = (lineHeight: number, display: string): React.CSSProperties => ({
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight,
    display,
});

function OptionCell({
    value,
    options,
    onChange,
}: {
    value: unknown;
    options: OptionRow[];
    onChange: (next: string | null) => void;
}) {
    return (
        <Select
            size="small"
            allowClear
            showSearch
            className={SELECT_WRAP_CLASS}
            popupClassName={SELECT_WRAP_POPUP_CLASS}
            style={{ minWidth: 160, width: "100%" }}
            value={value === undefined || value === null ? undefined : String(value)}
            onChange={(v) => onChange(v ?? null)}
            options={options.map((o) => ({ label: o.name, value: o.code }))}
            filterOption={(input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
            }
            optionRender={(option) => <span style={wrapped(1.35, "block")}>{option.label}</span>}
            labelRender={(labelProps) => (
                <span style={wrapped(1.3, "inline-block")}>{labelProps.label}</span>
            )}
        />
    );
}

/** `min`/`max` for a numeric value type. */
function numberBounds(valueType: string) {
    return {
        min:
            valueType === "INTEGER_POSITIVE"
                ? 1
                : valueType === "INTEGER_ZERO_OR_POSITIVE"
                  ? 0
                  : undefined,
        max: valueType === "INTEGER_NEGATIVE" ? -1 : undefined,
    };
}

/**
 * One editable table cell, by value type. Commits on change (select,
 * switch, date) or on blur (typed input). Knows nothing of program rules —
 * `InlineEditableCell` adds that.
 */
export function EditableCell({
    valueType,
    value,
    options,
    onCommit,
    disabledDate,
    disabled = false,
}: {
    valueType: string;
    value: unknown;
    options?: OptionRow[];
    onCommit: (next: unknown) => void;
    disabledDate?: (d: dayjs.Dayjs) => boolean;
    disabled?: boolean;
}) {
    const [local, setLocal] = useState<unknown>(value);
    useEffect(() => setLocal(value), [value]);

    const commit = (next: unknown) => {
        if (next === value) return;
        onCommit(next);
    };
    const set = (next: unknown) => {
        setLocal(next);
        commit(next);
    };

    if (options && options.length > 0) {
        return <OptionCell value={local} options={options} onChange={set} />;
    }
    if (valueType === "DATE") {
        const date = local ? dayjs(String(local)) : null;
        return (
            <DatePicker
                size="small"
                style={{ width: "100%" }}
                value={date && date.isValid() ? date : null}
                disabledDate={disabledDate ?? ((d) => d.isAfter(dayjs()))}
                onChange={(v) => set(v ? v.format("YYYY-MM-DD") : null)}
                disabled={disabled}
            />
        );
    }
    if (valueType === "BOOLEAN" || valueType === "TRUE_ONLY") {
        return <Switch size="small" checked={Boolean(local)} onChange={set} />;
    }
    if (NUMERIC_TYPES.has(valueType)) {
        return (
            <InputNumber
                size="small"
                style={{ width: "100%" }}
                value={local === undefined || local === null || local === "" ? null : Number(local)}
                {...numberBounds(valueType)}
                onChange={(v) => setLocal(v ?? null)}
                onBlur={() => commit(local ?? null)}
            />
        );
    }
    if (valueType === "LONG_TEXT") {
        return (
            <Input.TextArea
                size="small"
                autoSize={{ minRows: 1, maxRows: 3 }}
                value={local == null ? "" : String(local)}
                onChange={(e) => setLocal(e.target.value)}
                onBlur={() => commit(local ?? null)}
            />
        );
    }
    return (
        <Input
            size="small"
            value={local == null ? "" : String(local)}
            onChange={(e) => setLocal(e.target.value)}
            onBlur={() => commit(local ?? null)}
            onPressEnter={(e) => commit((e.target as HTMLInputElement).value ?? null)}
        />
    );
}
