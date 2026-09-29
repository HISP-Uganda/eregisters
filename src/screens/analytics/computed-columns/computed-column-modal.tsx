import { CalculatorOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Modal, Typography } from "antd";
import React, { useState } from "react";
import type { ComputedColumnDefinition } from "@/analytics/computed-columns";
import type { AnalyticsColumn } from "@/analytics/types";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Draft, draftError, emptyDraft, toDefinition, toDraft } from "./draft";
import { DraftEditor } from "./draft-editor";

const { Text } = Typography;

function DefinitionList({
    definitions,
    canAdd,
    onAdd,
    onEdit,
    onDelete,
}: {
    definitions: ComputedColumnDefinition[];
    canAdd: boolean;
    onAdd: () => void;
    onEdit: (definition: ComputedColumnDefinition) => void;
    onDelete: (id: string) => void;
}) {
    return (
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
                            style={{ border: "1px solid #f0f0f0", borderRadius: 6, padding: "8px 12px" }}
                        >
                            <Flex vertical gap={0}>
                                <Text strong>{definition.name}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {definition.ranges.length} range
                                    {definition.ranges.length === 1 ? "" : "s"} &middot; fallback &ldquo;
                                    {definition.fallbackLabel}&rdquo;
                                </Text>
                            </Flex>
                            <Flex gap={4}>
                                <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(definition)} />
                                <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => onDelete(definition.id)}
                                />
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            )}
            <Button type="dashed" icon={<PlusOutlined />} onClick={onAdd} disabled={!canAdd}>
                Add computed column
            </Button>
            {!canAdd && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    No numeric columns are available in this program to compute from.
                </Text>
            )}
        </Flex>
    );
}

/**
 * Computed columns: a label derived from a numeric column by ranges
 * (e.g. an age group from age), listed, added and edited here.
 */
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

    const startDraft = (next: Draft | null) => {
        setDraft(next);
        setError(null);
    };
    const saveDraft = () => {
        if (!draft) return;
        const problem = draftError(draft);
        if (problem) {
            setError(problem);
            return;
        }
        onSave(toDefinition(draft, programId));
        startDraft(null);
    };

    return (
        <>
            <Button
                icon={<CalculatorOutlined />}
                onClick={() => {
                    setOpen(true);
                    startDraft(null);
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
                    <DraftEditor
                        draft={draft}
                        error={error}
                        numericColumns={numericColumns}
                        onChange={setDraft}
                        onCancel={() => startDraft(null)}
                        onSave={saveDraft}
                    />
                ) : (
                    <DefinitionList
                        definitions={definitions}
                        canAdd={numericColumns.length > 0}
                        onAdd={() => startDraft(emptyDraft())}
                        onEdit={(definition) => startDraft(toDraft(definition))}
                        onDelete={onDelete}
                    />
                )}
            </Modal>
        </>
    );
}
