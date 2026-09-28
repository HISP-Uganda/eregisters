import { CaretRightOutlined, FolderAddOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Tabs, Tooltip, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { useMetadata } from "../../hooks/useMetadata";
import { afterGroup, LayoutGroup, sectionBounds } from "./layout";
import { LayoutGroupCard } from "./layout-group-card";
import { AvailableElements, SectionList, SectionListItem, SectionNameModal } from "./section-panels";
import { LayoutEditor, useLayoutEditor } from "./use-layout-editor";

type SectionKind = "stages" | "program";

/** The DHIS2 sections of one kind, and each one's elements with labels. */
function useSections(kind: SectionKind) {
    const { program, trackedEntityAttributes, dataElements } = useMetadata();
    return useMemo(() => {
        const elements = new Map<string, Array<{ id: string; label: string }>>();
        const sections: SectionListItem[] = [];
        if (kind === "stages") {
            for (const stage of program.programStages) {
                for (const s of stage.programStageSections) {
                    sections.push({ id: s.id, name: s.name, stageName: stage.name });
                    elements.set(
                        s.id,
                        s.dataElements.map((de) => {
                            const full = dataElements.get(de.id);
                            return { id: de.id, label: full?.formName || full?.name || de.id };
                        }),
                    );
                }
            }
        } else {
            for (const s of program.programSections) {
                sections.push({ id: s.id, name: s.name });
                elements.set(
                    s.id,
                    s.trackedEntityAttributes.map((tea) => {
                        const attr = trackedEntityAttributes.get(tea.id);
                        return { id: tea.id, label: attr?.displayFormName || attr?.name || tea.id };
                    }),
                );
            }
        }
        return { sections, elements };
    }, [kind, program, dataElements, trackedEntityAttributes]);
}

function LayoutGroups({
    editor,
    labels,
    onInsertSection,
    onRenameSection,
}: {
    editor: LayoutEditor;
    labels: Map<string, string>;
    onInsertSection: (at: number) => void;
    onRenameSection: (start: number) => void;
}) {
    const { groups, layout, activeSectionId, expandedSectionId } = editor;
    const bounds = sectionBounds(groups);
    const withStart = (group: LayoutGroup, act: (start: number) => void) => () => {
        if (group.sectionIndex !== null) act(group.sectionIndex);
    };
    return (
        <Flex vertical gap={10}>
            {groups.map((group, position) => {
                const isRoot = group.sectionId === null;
                if (isRoot && group.elements.length === 0) return null;
                return (
                    <LayoutGroupCard
                        key={group.sectionId ?? "__root"}
                        group={group}
                        isActive={activeSectionId === group.sectionId}
                        isCollapsed={!isRoot && expandedSectionId !== group.sectionId}
                        onToggleCollapse={isRoot ? undefined : () => editor.toggleExpanded(group.sectionId!)}
                        isFirstSection={bounds.first === position}
                        isLastSection={bounds.last === position}
                        labels={labels}
                        onSelect={() => editor.setActiveSectionId(group.sectionId)}
                        sectionActions={{
                            onRename: withStart(group, onRenameSection),
                            onDelete: withStart(group, editor.removeItem),
                            onMoveUp: withStart(group, (start) => editor.moveSection(start, -1)),
                            onMoveDown: withStart(group, (start) => editor.moveSection(start, 1)),
                            onInsertAfter: () => onInsertSection(afterGroup(layout, group)),
                            onStyleChange: (patch) =>
                                withStart(group, (start) => editor.styleSection(start, patch))(),
                        }}
                        elementActions={{
                            onMoveElement: editor.moveElement,
                            onRemoveElement: editor.removeItem,
                        }}
                    />
                );
            })}
        </Flex>
    );
}

/**
 * The form layout builder: pick a DHIS2 section, then order its elements
 * and add headers between them. Stored in the app's UI config, not in
 * DHIS2 metadata.
 */
export function SectionLayoutScreen() {
    const [kind, setKind] = useState<SectionKind>("stages");
    const [sectionId, setSectionId] = useState<string | null>(null);
    const { sections, elements } = useSections(kind);
    const editor = useLayoutEditor(sectionId);
    /** The "add section" popup: where it goes and the name typed so far. */
    const [adding, setAdding] = useState<{ at: number; name: string } | null>(null);
    const [renaming, setRenaming] = useState<{ start: number; name: string } | null>(null);

    const sectionElements = (sectionId && elements.get(sectionId)) || [];
    const labels = useMemo(() => new Map(sectionElements.map((e) => [e.id, e.label])), [sectionElements]);
    const used = new Set(editor.layout.filter((s) => s.kind === "element").map((s) => s.id));
    const available = sectionElements.filter((e) => !used.has(e.id));
    const activeName = editor.activeSectionId
        ? editor.groups.find((g) => g.sectionId === editor.activeSectionId)?.sectionName ?? "…"
        : null;

    const confirmAdd = () => {
        const name = adding?.name.trim();
        if (!adding || !name) return;
        editor.insertSection(adding.at, name);
        setAdding(null);
    };
    const confirmRename = () => {
        const name = renaming?.name.trim();
        if (!renaming || !name) return;
        editor.renameSection(renaming.start, name);
        setRenaming(null);
    };
    const openRename = (start: number) => {
        const item = editor.layout[start];
        if (item.kind === "section") setRenaming({ start, name: item.name });
    };

    return (
        <Flex vertical gap={16} style={{ flex: 1, minHeight: 0, height: "100%" }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
                Section Layout
            </Typography.Title>
            <Typography.Text type="secondary">
                Build a form by ordering data elements and inserting section headers between them. Changes
                are stored locally and do not modify DHIS2 metadata.
            </Typography.Text>

            <Tabs
                activeKey={kind}
                onChange={(k) => {
                    setKind(k as SectionKind);
                    setSectionId(null);
                }}
                items={[
                    { key: "stages", label: "Program Stage Sections" },
                    { key: "program", label: "Program Sections" },
                ]}
            />

            <Flex gap={16} align="stretch" style={{ flex: 1, minHeight: 0 }}>
                <div style={{ width: 240, flexShrink: 0, overflowY: "auto" }}>
                    <SectionList sections={sections} selectedId={sectionId} onSelect={setSectionId} />
                </div>

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    {!sectionId ? (
                        <Typography.Text type="secondary">Select a section to build its form</Typography.Text>
                    ) : (
                        <Flex gap={16} align="stretch" style={{ flex: 1, minHeight: 0 }}>
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    border: "1px solid #f0f0f0",
                                    borderRadius: 6,
                                    padding: 12,
                                    background: "#fafafa",
                                    overflowY: "auto",
                                }}
                            >
                                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                                    <Flex vertical gap={0}>
                                        <Typography.Text strong>Form layout</Typography.Text>
                                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                            Click a section to make it active — new elements will be added
                                            inside it. If nothing is active, elements go before any section.
                                        </Typography.Text>
                                    </Flex>
                                    <Flex gap={4}>
                                        <Tooltip title="Collapse expanded section">
                                            <Button
                                                size="small"
                                                icon={<CaretRightOutlined />}
                                                onClick={editor.collapseAll}
                                                disabled={editor.expandedSectionId === null}
                                            />
                                        </Tooltip>
                                        <Button
                                            size="small"
                                            icon={<FolderAddOutlined />}
                                            onClick={() => setAdding({ at: editor.layout.length, name: "" })}
                                        >
                                            Add section
                                        </Button>
                                    </Flex>
                                </Flex>
                                {editor.layout.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Empty — add sections and elements from the right"
                                    />
                                ) : (
                                    <LayoutGroups
                                        editor={editor}
                                        labels={labels}
                                        onInsertSection={(at) => setAdding({ at, name: "" })}
                                        onRenameSection={openRename}
                                    />
                                )}
                            </div>
                            <AvailableElements elements={available} target={activeName} onAdd={editor.addElement} />
                        </Flex>
                    )}

                    {sectionId && (
                        <Flex
                            gap={8}
                            style={{
                                marginTop: 16,
                                position: "sticky",
                                bottom: 0,
                                background: "#fff",
                                padding: "12px 0",
                                borderTop: "1px solid #f0f0f0",
                                zIndex: 2,
                            }}
                        >
                            <Button
                                type="primary"
                                loading={editor.saving}
                                onClick={editor.save}
                                style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                            >
                                Save
                            </Button>
                        </Flex>
                    )}
                </div>
            </Flex>

            <SectionNameModal
                title="Add section header"
                name={adding?.name ?? null}
                onNameChange={(name) => setAdding((prev) => (prev ? { ...prev, name } : prev))}
                onOk={confirmAdd}
                onCancel={() => setAdding(null)}
            />
            <SectionNameModal
                title="Rename section"
                name={renaming?.name ?? null}
                onNameChange={(name) => setRenaming((prev) => (prev ? { ...prev, name } : prev))}
                onOk={confirmRename}
                onCancel={() => setRenaming(null)}
            />
        </Flex>
    );
}
