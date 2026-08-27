import {
    CalculatorOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Button,
    Empty,
    Flex,
    Input,
    InputNumber,
    Modal,
    Select,
    Typography,
} from "antd";
import React, { useState } from "react";
import type {
    ComputedColumnDefinition,
    ComputedColumnRange,
} from "../../analytics/computed-columns";
import { findGap, findOverlappingRanges } from "../../analytics/computed-columns";
import type { AnalyticsColumn } from "../../analytics/types";
import { useIsMobile } from "../../hooks/useIsMobile";

const { Text } = Typography;

type Draft = {
    id: string;
    name: string;
    sourceColumnKey: string | undefined;
    ranges: ComputedColumnRange[];
    fallbackLabel: string;
};

function emptyDraft(): Draft {
    return {
        id: crypto.randomUUID(),
        name: "",
        sourceColumnKey: undefined,
        ranges: [
            {
                id: crypto.randomUUID(),
                min: 0,
                minInclusive: true,
                max: null,
                maxInclusive: true,
                label: "",
            },
        ],
        fallbackLabel: "Other",
    };
}

const MIN_OPERATOR_OPTIONS = [
    { value: true, label: "≥" },
    { value: false, label: ">" },
];
const MAX_OPERATOR_OPTIONS = [
    { value: true, label: "≤" },
    { value: false, label: "<" },
];

function toDraft(definition: ComputedColumnDefinition): Draft {
    return {
        id: definition.id,
        name: definition.name,
        sourceColumnKey: definition.sourceColumnKey,
        ranges: definition.ranges,
        fallbackLabel: definition.fallbackLabel,
    };
}

export function ComputedColumnModal({
    programId,
    numericColumns,
    definitions,
    onSave,
    onDelete,
}: {
    programId: string;
    /** Eligible source columns — numeric-typed, not themselves computed. */
    numericColumns: AnalyticsColumn[];
    definitions: ComputedColumnDefinition[];
    onSave: (definition: ComputedColumnDefinition) => void;
    onDelete: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useIsMobile();

    const startNew = () => {
        setDraft(emptyDraft());
        setError(null);
    };
    const startEdit = (definition: ComputedColumnDefinition) => {
        setDraft(toDraft(definition));
        setError(null);
    };
    const cancelDraft = () => {
        setDraft(null);
        setError(null);
    };

    const updateRange = (id: string, patch: Partial<ComputedColumnRange>) => {
        setDraft((prev) =>
            prev
                ? {
                      ...prev,
                      ranges: prev.ranges.map((range) =>
                          range.id === id ? { ...range, ...patch } : range,
                      ),
                  }
                : prev,
        );
    };
    const addRange = () => {
        setDraft((prev) =>
            prev
                ? {
                      ...prev,
                      ranges: [
                          ...prev.ranges,
                          {
                              id: crypto.randomUUID(),
                              min: 0,
                              minInclusive: true,
                              max: null,
                              maxInclusive: true,
                              label: "",
                          },
                      ],
                  }
                : prev,
        );
    };
    const removeRange = (id: string) => {
        setDraft((prev) =>
            prev
                ? { ...prev, ranges: prev.ranges.filter((range) => range.id !== id) }
                : prev,
        );
    };

    const saveDraft = () => {
        if (!draft) return;
        if (!draft.name.trim()) {
            setError("Give this computed column a name.");
            return;
        }
        if (!draft.sourceColumnKey) {
            setError("Pick a source column.");
            return;
        }
        if (draft.ranges.length === 0) {
            setError("Add at least one range.");
            return;
        }
        for (const range of draft.ranges) {
            if (!range.label.trim()) {
                setError("Every range needs a display value.");
                return;
            }
            if (range.max !== null && range.max < range.min) {
                setError("A range's maximum can't be less than its minimum.");
                return;
            }
            if (
                range.max !== null &&
                range.max === range.min &&
                !(range.minInclusive && range.maxInclusive)
            ) {
                setError(
                    `Range "${range.label}" can never match anything — its bounds exclude the only value they share.`,
                );
                return;
            }
        }
        const overlap = findOverlappingRanges(draft.ranges);
        if (overlap) {
            setError(
                `Ranges "${overlap[0].label || overlap[0].min}" and "${overlap[1].label || overlap[1].min}" overlap.`,
            );
            return;
        }
        const gap = findGap(draft.ranges);
        if (gap) {
            setError(
                `There's a gap between "${gap[0].label || gap[0].min}" and "${gap[1].label || gap[1].min}" — some values would match neither and fall to the fallback. Adjust their bounds so they touch (e.g. one ends where the next begins).`,
            );
            return;
        }
        if (!draft.fallbackLabel.trim()) {
            setError("Set a fallback value for rows outside every range.");
            return;
        }

        onSave({
            id: draft.id,
            programId,
            name: draft.name.trim(),
            sourceColumnKey: draft.sourceColumnKey,
            ranges: draft.ranges,
            fallbackLabel: draft.fallbackLabel.trim(),
        });
        setDraft(null);
        setError(null);
    };

    return (
        <>
            <Button
                icon={<CalculatorOutlined />}
                onClick={() => {
                    setOpen(true);
                    setDraft(null);
                    setError(null);
                }}
            >
                Computed columns
                {definitions.length > 0 ? ` (${definitions.length})` : ""}
            </Button>
            <Modal
                title="Computed columns"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={isMobile ? "94%" : 640}
            >
                {draft ? (
                    <Flex vertical gap="middle">
                        {error && <Alert type="error" showIcon title={error} />}
                        <Flex vertical gap={4}>
                            <Text strong>Name</Text>
                            <Input
                                placeholder="e.g. Age group"
                                value={draft.name}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        name: event.target.value,
                                    })
                                }
                            />
                        </Flex>
                        <Flex vertical gap={4}>
                            <Text strong>Source column</Text>
                            <Select
                                showSearch
                                placeholder="Pick a numeric column"
                                value={draft.sourceColumnKey}
                                options={numericColumns.map((column) => ({
                                    value: column.key,
                                    label: column.label,
                                }))}
                                filterOption={(input, option) =>
                                    (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                onChange={(value) =>
                                    setDraft({
                                        ...draft,
                                        sourceColumnKey: value,
                                    })
                                }
                            />
                        </Flex>
                        <Flex vertical gap={4}>
                            <Text strong>Ranges</Text>
                            <Flex vertical gap={8}>
                                {draft.ranges.map((range) => (
                                    <Flex
                                        key={range.id}
                                        gap={8}
                                        align="center"
                                        wrap
                                    >
                                        <Select
                                            style={{ width: 60 }}
                                            value={range.minInclusive}
                                            options={MIN_OPERATOR_OPTIONS}
                                            onChange={(value) =>
                                                updateRange(range.id, {
                                                    minInclusive: value,
                                                })
                                            }
                                        />
                                        <InputNumber
                                            style={{ width: 80 }}
                                            placeholder="Min"
                                            value={range.min}
                                            onChange={(value) =>
                                                updateRange(range.id, {
                                                    min: value ?? 0,
                                                })
                                            }
                                        />
                                        <Text
                                            type="secondary"
                                            style={{ whiteSpace: "nowrap" }}
                                        >
                                            to
                                        </Text>
                                        <Select
                                            style={{ width: 60 }}
                                            value={range.maxInclusive}
                                            options={MAX_OPERATOR_OPTIONS}
                                            disabled={range.max === null}
                                            onChange={(value) =>
                                                updateRange(range.id, {
                                                    maxInclusive: value,
                                                })
                                            }
                                        />
                                        <InputNumber
                                            style={{ width: 80 }}
                                            placeholder="and above"
                                            value={range.max}
                                            onChange={(value) =>
                                                updateRange(range.id, {
                                                    max: value ?? null,
                                                })
                                            }
                                        />
                                        <Input
                                            style={{ flex: 1, minWidth: 140 }}
                                            placeholder="Display value"
                                            value={range.label}
                                            onChange={(event) =>
                                                updateRange(range.id, {
                                                    label: event.target.value,
                                                })
                                            }
                                        />
                                        <Button
                                            danger
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            disabled={draft.ranges.length <= 1}
                                            onClick={() =>
                                                removeRange(range.id)
                                            }
                                        />
                                    </Flex>
                                ))}
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={addRange}
                                    style={{ alignSelf: "flex-start" }}
                                >
                                    Add range
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex vertical gap={4}>
                            <Text strong>Fallback value</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Shown when a row's value matches none of the
                                ranges above.
                            </Text>
                            <Input
                                placeholder="e.g. Other"
                                value={draft.fallbackLabel}
                                onChange={(event) =>
                                    setDraft({
                                        ...draft,
                                        fallbackLabel: event.target.value,
                                    })
                                }
                            />
                        </Flex>
                        <Flex justify="flex-end" gap={8}>
                            <Button onClick={cancelDraft}>Cancel</Button>
                            <Button type="primary" onClick={saveDraft}>
                                Save
                            </Button>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex vertical gap="middle">
                        {definitions.length === 0 ? (
                            <Empty description="No computed columns yet" />
                        ) : (
                            <Flex vertical gap={8}>
                                {definitions.map((definition) => (
                                    <Flex
                                        key={definition.id}
                                        align="center"
                                        justify="space-between"
                                        style={{
                                            border: "1px solid #f0f0f0",
                                            borderRadius: 6,
                                            padding: "8px 12px",
                                        }}
                                    >
                                        <Flex vertical gap={0}>
                                            <Text strong>
                                                {definition.name}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 12 }}
                                            >
                                                {definition.ranges.length} range
                                                {definition.ranges.length === 1
                                                    ? ""
                                                    : "s"}{" "}
                                                &middot; fallback &ldquo;
                                                {definition.fallbackLabel}
                                                &rdquo;
                                            </Text>
                                        </Flex>
                                        <Flex gap={4}>
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() =>
                                                    startEdit(definition)
                                                }
                                            />
                                            <Button
                                                danger
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    onDelete(definition.id)
                                                }
                                            />
                                        </Flex>
                                    </Flex>
                                ))}
                            </Flex>
                        )}
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={startNew}
                            disabled={numericColumns.length === 0}
                        >
                            Add computed column
                        </Button>
                        {numericColumns.length === 0 && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                No numeric columns are available in this program
                                to compute from.
                            </Text>
                        )}
                    </Flex>
                )}
            </Modal>
        </>
    );
}
