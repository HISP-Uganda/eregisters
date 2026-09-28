import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Flex, Input, InputNumber, Select, Typography } from "antd";
import React from "react";
import type { ComputedColumnRange } from "../../../analytics/computed-columns";
import type { AnalyticsColumn } from "../../../analytics/types";
import { Draft, newRange } from "./draft";

const { Text } = Typography;

const MIN_OPERATOR_OPTIONS = [
    { value: true, label: "≥" },
    { value: false, label: ">" },
];
const MAX_OPERATOR_OPTIONS = [
    { value: true, label: "≤" },
    { value: false, label: "<" },
];

/** One range: its bounds (each inclusive or not; no max = "and above") and label. */
function RangeRow({
    range,
    canRemove,
    onChange,
    onRemove,
}: {
    range: ComputedColumnRange;
    canRemove: boolean;
    onChange: (patch: Partial<ComputedColumnRange>) => void;
    onRemove: () => void;
}) {
    return (
        <Flex gap={8} align="center" wrap>
            <Select
                style={{ width: 60 }}
                value={range.minInclusive}
                options={MIN_OPERATOR_OPTIONS}
                onChange={(value) => onChange({ minInclusive: value })}
            />
            <InputNumber
                style={{ width: 80 }}
                placeholder="Min"
                value={range.min}
                onChange={(value) => onChange({ min: value ?? 0 })}
            />
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                to
            </Text>
            <Select
                style={{ width: 60 }}
                value={range.maxInclusive}
                options={MAX_OPERATOR_OPTIONS}
                disabled={range.max === null}
                onChange={(value) => onChange({ maxInclusive: value })}
            />
            <InputNumber
                style={{ width: 80 }}
                placeholder="and above"
                value={range.max}
                onChange={(value) => onChange({ max: value ?? null })}
            />
            <Input
                style={{ flex: 1, minWidth: 140 }}
                placeholder="Display value"
                value={range.label}
                onChange={(event) => onChange({ label: event.target.value })}
            />
            <Button danger type="text" icon={<DeleteOutlined />} disabled={!canRemove} onClick={onRemove} />
        </Flex>
    );
}

/** The form for one computed column: name, source column, ranges, fallback. */
export function DraftEditor({
    draft,
    error,
    numericColumns,
    onChange,
    onCancel,
    onSave,
}: {
    draft: Draft;
    error: string | null;
    numericColumns: AnalyticsColumn[];
    onChange: (draft: Draft) => void;
    onCancel: () => void;
    onSave: () => void;
}) {
    const setRanges = (ranges: ComputedColumnRange[]) => onChange({ ...draft, ranges });
    return (
        <Flex vertical gap="middle">
            {error && <Alert type="error" showIcon title={error} />}
            <Flex vertical gap={4}>
                <Text strong>Name</Text>
                <Input
                    placeholder="e.g. Age group"
                    value={draft.name}
                    onChange={(event) => onChange({ ...draft, name: event.target.value })}
                />
            </Flex>
            <Flex vertical gap={4}>
                <Text strong>Source column</Text>
                <Select
                    showSearch
                    placeholder="Pick a numeric column"
                    value={draft.sourceColumnKey}
                    options={numericColumns.map((column) => ({ value: column.key, label: column.label }))}
                    filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => onChange({ ...draft, sourceColumnKey: value })}
                />
            </Flex>
            <Flex vertical gap={4}>
                <Text strong>Ranges</Text>
                <Flex vertical gap={8}>
                    {draft.ranges.map((range) => (
                        <RangeRow
                            key={range.id}
                            range={range}
                            canRemove={draft.ranges.length > 1}
                            onChange={(patch) =>
                                setRanges(draft.ranges.map((r) => (r.id === range.id ? { ...r, ...patch } : r)))
                            }
                            onRemove={() => setRanges(draft.ranges.filter((r) => r.id !== range.id))}
                        />
                    ))}
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => setRanges([...draft.ranges, newRange()])}
                        style={{ alignSelf: "flex-start" }}
                    >
                        Add range
                    </Button>
                </Flex>
            </Flex>
            <Flex vertical gap={4}>
                <Text strong>Fallback value</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Shown when a row's value matches none of the ranges above.
                </Text>
                <Input
                    placeholder="e.g. Other"
                    value={draft.fallbackLabel}
                    onChange={(event) => onChange({ ...draft, fallbackLabel: event.target.value })}
                />
            </Flex>
            <Flex justify="flex-end" gap={8}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={onSave}>
                    Save
                </Button>
            </Flex>
        </Flex>
    );
}
