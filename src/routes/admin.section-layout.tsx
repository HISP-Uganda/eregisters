import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CaretRightOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    FolderAddOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useDataEngine } from "@dhis2/app-runtime";
import { createRoute } from "@tanstack/react-router";
import {
    Button,
    Card,
    Empty,
    Flex,
    Input,
    List,
    message,
    Modal,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { db } from "../db";
import { useMetadata } from "../hooks/useMetadata";
import { useUIConfig } from "../hooks/useUIConfig";
import { FormLayoutItem, SubsectionConfig } from "../schemas";
import { AdminRoute } from "./admin";

export const AdminSectionLayoutRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/section-layout",
    component: SectionLayout,
});

function subsectionsToLayout(subs: SubsectionConfig[]): FormLayoutItem[] {
    const layout: FormLayoutItem[] = [];
    for (const sub of subs) {
        layout.push({ kind: "section", id: sub.id, name: sub.name });
        for (const id of sub.dataElementIds) {
            layout.push({ kind: "element", id });
        }
    }
    return layout;
}

function layoutToSubsections(layout: FormLayoutItem[]): SubsectionConfig[] {
    const subs: SubsectionConfig[] = [];
    let current: SubsectionConfig | null = null;
    for (const step of layout) {
        if (step.kind === "section") {
            current = { id: step.id, name: step.name, dataElementIds: [] };
            subs.push(current);
        } else if (current) {
            current.dataElementIds.push(step.id);
        }
    }
    return subs;
}

function SectionLayout() {
    const { program, trackedEntityAttributes, dataElements } = useMetadata();
    const uiConfig = useUIConfig();
    const engine = useDataEngine();
    const [activeTab, setActiveTab] = useState<"stages" | "program">("stages");
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
        null,
    );
    const [layout, setLayout] = useState<FormLayoutItem[]>([]);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
        () => new Set(),
    );
    const [saving, setSaving] = useState(false);

    function toggleCollapsed(sectionId: string) {
        setCollapsedSections((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    }
    const [newSectionModal, setNewSectionModal] = useState<{
        insertAt: number;
        name: string;
    } | null>(null);
    const [renameModal, setRenameModal] = useState<{
        index: number;
        name: string;
    } | null>(null);

    const allStageSections = program.programStages.flatMap((stage) =>
        stage.programStageSections.map((s) => ({
            ...s,
            stageName: stage.name,
            type: "stage" as const,
        })),
    );

    const allProgramSections = program.programSections.map((s) => ({
        ...s,
        type: "program" as const,
    }));

    const visibleSections: Array<{
        id: string;
        name: string;
        stageName?: string;
    }> =
        activeTab === "stages"
            ? allStageSections.map((s) => ({
                  id: s.id,
                  name: s.name,
                  stageName: s.stageName,
              }))
            : allProgramSections.map((s) => ({ id: s.id, name: s.name }));

    useEffect(() => {
        setActiveSectionId(null);
        setCollapsedSections(new Set());
        if (!selectedSectionId) {
            setLayout([]);
            return;
        }
        const existing = uiConfig.formLayouts?.[selectedSectionId];
        if (existing && existing.length > 0) {
            setLayout(JSON.parse(JSON.stringify(existing)));
            return;
        }
        const legacy = uiConfig.subsections[selectedSectionId];
        if (legacy && legacy.length > 0) {
            setLayout(subsectionsToLayout(legacy));
            return;
        }
        setLayout([]);
    }, [selectedSectionId, uiConfig.formLayouts, uiConfig.subsections]);

    const selectedSection =
        activeTab === "stages"
            ? allStageSections.find((s) => s.id === selectedSectionId)
            : allProgramSections.find((s) => s.id === selectedSectionId);

    const allElementsInSection: Array<{ id: string; label: string }> =
        useMemo(() => {
            if (!selectedSection) return [];
            if (activeTab === "stages") {
                return (
                    selectedSection as (typeof allStageSections)[number]
                ).dataElements.map((de) => {
                    const full = dataElements.get(de.id);
                    return {
                        id: de.id,
                        label: full?.formName || full?.name || de.id,
                    };
                });
            }
            return (
                selectedSection as (typeof allProgramSections)[number]
            ).trackedEntityAttributes.map((tea) => {
                const attr = trackedEntityAttributes.get(tea.id);
                return {
                    id: tea.id,
                    label: attr?.displayFormName || attr?.name || tea.id,
                };
            });
        }, [selectedSection, dataElements, trackedEntityAttributes, activeTab]);

    const elementLabelById = useMemo(
        () => new Map(allElementsInSection.map((e) => [e.id, e.label])),
        [allElementsInSection],
    );

    const usedElementIds = new Set(
        layout.filter((s) => s.kind === "element").map((s) => s.id),
    );
    const availableElements = allElementsInSection.filter(
        (e) => !usedElementIds.has(e.id),
    );

    type LayoutGroup = {
        sectionId: string | null;
        sectionName: string | null;
        sectionIndex: number | null;
        elements: Array<{ id: string; index: number }>;
    };

    const groups = useMemo<LayoutGroup[]>(() => {
        const result: LayoutGroup[] = [];
        let current: LayoutGroup = {
            sectionId: null,
            sectionName: null,
            sectionIndex: null,
            elements: [],
        };
        result.push(current);
        layout.forEach((step, index) => {
            if (step.kind === "section") {
                current = {
                    sectionId: step.id,
                    sectionName: step.name,
                    sectionIndex: index,
                    elements: [],
                };
                result.push(current);
            } else {
                current.elements.push({ id: step.id, index });
            }
        });
        return result;
    }, [layout]);

    // Auto-clear active section if it was removed.
    useEffect(() => {
        if (activeSectionId === null) return;
        const stillExists = groups.some((g) => g.sectionId === activeSectionId);
        if (!stillExists) setActiveSectionId(null);
    }, [activeSectionId, groups]);

    function appendElement(id: string) {
        setLayout((prev) => {
            const next = [...prev];
            let insertAt = next.length;
            if (activeSectionId === null) {
                const firstSection = next.findIndex(
                    (s) => s.kind === "section",
                );
                insertAt = firstSection === -1 ? next.length : firstSection;
            } else {
                const sectionIdx = next.findIndex(
                    (s) =>
                        s.kind === "section" && s.id === activeSectionId,
                );
                if (sectionIdx === -1) {
                    insertAt = next.length;
                } else {
                    let end = sectionIdx + 1;
                    while (end < next.length && next[end].kind !== "section") {
                        end++;
                    }
                    insertAt = end;
                }
            }
            next.splice(insertAt, 0, { kind: "element", id });
            return next;
        });
    }

    function removeElement(index: number) {
        setLayout((prev) => prev.filter((_, i) => i !== index));
    }

    function removeSection(sectionStartIndex: number) {
        // Drop only the header — the children fall back to the previous group.
        setLayout((prev) => prev.filter((_, i) => i !== sectionStartIndex));
    }

    function moveElement(index: number, delta: -1 | 1) {
        setLayout((prev) => {
            const next = [...prev];
            const target = index + delta;
            if (target < 0 || target >= next.length) return prev;
            // Do not step across a section header — that would silently move
            // the element into a different section.
            if (next[target].kind === "section") return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    function moveSection(sectionStartIndex: number, delta: -1 | 1) {
        setLayout((prev) => {
            let end = sectionStartIndex + 1;
            while (end < prev.length && prev[end].kind !== "section") end++;
            const block = prev.slice(sectionStartIndex, end);
            const before = prev.slice(0, sectionStartIndex);
            const after = prev.slice(end);
            if (delta === -1) {
                // Swap with previous section block (or the leading root group).
                let prevStart = sectionStartIndex - 1;
                while (
                    prevStart >= 0 &&
                    prev[prevStart].kind !== "section"
                ) {
                    prevStart--;
                }
                if (prevStart < 0) return prev; // already at top
                const prevBlock = prev.slice(prevStart, sectionStartIndex);
                return [
                    ...prev.slice(0, prevStart),
                    ...block,
                    ...prevBlock,
                    ...after,
                ];
            } else {
                if (end >= prev.length) return prev; // already at bottom
                let nextEnd = end + 1;
                while (
                    nextEnd < prev.length &&
                    prev[nextEnd].kind !== "section"
                ) {
                    nextEnd++;
                }
                const nextBlock = prev.slice(end, nextEnd);
                return [...before, ...nextBlock, ...block, ...prev.slice(nextEnd)];
            }
        });
    }

    function openAddSection(insertAt: number) {
        setNewSectionModal({ insertAt, name: "" });
    }

    function confirmAddSection() {
        if (!newSectionModal) return;
        const name = newSectionModal.name.trim();
        if (!name) return;
        setLayout((prev) => {
            const next = [...prev];
            next.splice(newSectionModal.insertAt, 0, {
                kind: "section",
                id: crypto.randomUUID(),
                name,
            });
            return next;
        });
        setNewSectionModal(null);
    }

    function openRename(index: number) {
        const item = layout[index];
        if (item.kind !== "section") return;
        setRenameModal({ index, name: item.name });
    }

    function confirmRename() {
        if (!renameModal) return;
        const name = renameModal.name.trim();
        if (!name) return;
        setLayout((prev) =>
            prev.map((item, i) =>
                i === renameModal.index && item.kind === "section"
                    ? { ...item, name }
                    : item,
            ),
        );
        setRenameModal(null);
    }

    async function save() {
        if (!selectedSectionId) return;
        setSaving(true);
        try {
            const updated = {
                ...uiConfig,
                formLayouts: {
                    ...(uiConfig.formLayouts ?? {}),
                    [selectedSectionId]: layout,
                },
                subsections: {
                    ...uiConfig.subsections,
                    [selectedSectionId]: layoutToSubsections(layout),
                },
            };
            try {
                await engine.mutate({
                    type: "update",
                    resource: "dataStore/eregisters",
                    id: "ui-config",
                    data: updated,
                });
            } catch {
                await engine.mutate({
                    type: "create",
                    resource: "dataStore/eregisters",
                    data: { key: "ui-config", value: updated },
                });
            }
            await db.uiConfig.put({ id: "main", config: updated });
            message.success("Form layout saved");
        } catch {
            message.error("Failed to save form layout");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Flex vertical gap={16}>
            <Typography.Title level={4} style={{ margin: 0 }}>
                Section Layout
            </Typography.Title>
            <Typography.Text type="secondary">
                Build a form by ordering data elements and inserting section
                headers between them. Changes are stored locally and do not
                modify DHIS2 metadata.
            </Typography.Text>

            <Tabs
                activeKey={activeTab}
                onChange={(k) => {
                    setActiveTab(k as "stages" | "program");
                    setSelectedSectionId(null);
                }}
                items={[
                    { key: "stages", label: "Program Stage Sections" },
                    { key: "program", label: "Program Sections" },
                ]}
            />

            <Flex gap={16} align="flex-start">
                <div style={{ width: 240, flexShrink: 0 }}>
                    <List
                        bordered
                        size="small"
                        dataSource={visibleSections}
                        renderItem={(section) => (
                            <List.Item
                                style={{
                                    cursor: "pointer",
                                    background:
                                        selectedSectionId === section.id
                                            ? "#ede9fe"
                                            : undefined,
                                    fontWeight:
                                        selectedSectionId === section.id
                                            ? 600
                                            : undefined,
                                    padding: "8px 12px",
                                }}
                                onClick={() => setSelectedSectionId(section.id)}
                            >
                                <Flex vertical gap={0}>
                                    <span>{section.name}</span>
                                    {"stageName" in section &&
                                        section.stageName && (
                                            <Typography.Text
                                                type="secondary"
                                                style={{ fontSize: 11 }}
                                            >
                                                {section.stageName}
                                            </Typography.Text>
                                        )}
                                </Flex>
                            </List.Item>
                        )}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    {!selectedSectionId ? (
                        <Typography.Text type="secondary">
                            Select a section to build its form
                        </Typography.Text>
                    ) : (
                        <Flex gap={16} align="flex-start">
                            <div
                                style={{
                                    flex: 1,
                                    border: "1px solid #f0f0f0",
                                    borderRadius: 6,
                                    padding: 12,
                                    background: "#fafafa",
                                }}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    style={{ marginBottom: 8 }}
                                >
                                    <Flex vertical gap={0}>
                                        <Typography.Text strong>
                                            Form layout
                                        </Typography.Text>
                                        <Typography.Text
                                            type="secondary"
                                            style={{ fontSize: 11 }}
                                        >
                                            Click a section to make it active —
                                            new elements will be added inside
                                            it. If nothing is active, elements
                                            go before any section.
                                        </Typography.Text>
                                    </Flex>
                                    <Flex gap={4}>
                                        <Tooltip title="Expand all sections">
                                            <Button
                                                size="small"
                                                icon={<DownOutlined />}
                                                onClick={() =>
                                                    setCollapsedSections(
                                                        new Set(),
                                                    )
                                                }
                                                disabled={
                                                    collapsedSections.size === 0
                                                }
                                            />
                                        </Tooltip>
                                        <Tooltip title="Collapse all sections">
                                            <Button
                                                size="small"
                                                icon={<CaretRightOutlined />}
                                                onClick={() => {
                                                    const ids = groups
                                                        .map((g) => g.sectionId)
                                                        .filter(
                                                            (id): id is string =>
                                                                id !== null,
                                                        );
                                                    setCollapsedSections(
                                                        new Set(ids),
                                                    );
                                                }}
                                                disabled={groups.every(
                                                    (g) => g.sectionId === null,
                                                )}
                                            />
                                        </Tooltip>
                                        <Button
                                            size="small"
                                            icon={<FolderAddOutlined />}
                                            onClick={() =>
                                                openAddSection(layout.length)
                                            }
                                        >
                                            Add section
                                        </Button>
                                    </Flex>
                                </Flex>
                                {layout.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Empty — add sections and elements from the right"
                                    />
                                ) : (
                                    <Flex vertical gap={10}>
                                        {groups.map((group, groupIdx) => {
                                            const isRoot = group.sectionId === null;
                                            if (
                                                isRoot &&
                                                group.elements.length === 0
                                            )
                                                return null;
                                            const isActive =
                                                activeSectionId ===
                                                group.sectionId;
                                            return (
                                                <LayoutGroupCard
                                                    key={
                                                        group.sectionId ??
                                                        "__root"
                                                    }
                                                    group={group}
                                                    isActive={isActive}
                                                    isCollapsed={
                                                        group.sectionId !==
                                                            null &&
                                                        collapsedSections.has(
                                                            group.sectionId,
                                                        )
                                                    }
                                                    onToggleCollapse={
                                                        group.sectionId !== null
                                                            ? () =>
                                                                  toggleCollapsed(
                                                                      group.sectionId!,
                                                                  )
                                                            : undefined
                                                    }
                                                    isFirstSection={
                                                        groups.findIndex(
                                                            (g) =>
                                                                g.sectionId !==
                                                                null,
                                                        ) === groupIdx
                                                    }
                                                    isLastSection={(() => {
                                                        for (
                                                            let i = groups.length - 1;
                                                            i >= 0;
                                                            i--
                                                        ) {
                                                            if (
                                                                groups[i]
                                                                    .sectionId !==
                                                                null
                                                            ) {
                                                                return (
                                                                    i ===
                                                                    groupIdx
                                                                );
                                                            }
                                                        }
                                                        return false;
                                                    })()}
                                                    elementLabelById={
                                                        elementLabelById
                                                    }
                                                    onSelect={() => {
                                                        if (isRoot) {
                                                            setActiveSectionId(
                                                                null,
                                                            );
                                                        } else {
                                                            setActiveSectionId(
                                                                group.sectionId,
                                                            );
                                                        }
                                                    }}
                                                    onRename={() =>
                                                        group.sectionIndex !==
                                                            null &&
                                                        openRename(
                                                            group.sectionIndex,
                                                        )
                                                    }
                                                    onDeleteSection={() =>
                                                        group.sectionIndex !==
                                                            null &&
                                                        removeSection(
                                                            group.sectionIndex,
                                                        )
                                                    }
                                                    onMoveSectionUp={() =>
                                                        group.sectionIndex !==
                                                            null &&
                                                        moveSection(
                                                            group.sectionIndex,
                                                            -1,
                                                        )
                                                    }
                                                    onMoveSectionDown={() =>
                                                        group.sectionIndex !==
                                                            null &&
                                                        moveSection(
                                                            group.sectionIndex,
                                                            1,
                                                        )
                                                    }
                                                    onInsertSectionAfter={() =>
                                                        openAddSection(
                                                            (() => {
                                                                if (
                                                                    group.sectionIndex ===
                                                                    null
                                                                ) {
                                                                    return group
                                                                        .elements
                                                                        .length;
                                                                }
                                                                let end =
                                                                    group.sectionIndex +
                                                                    1;
                                                                while (
                                                                    end <
                                                                        layout.length &&
                                                                    layout[end]
                                                                        .kind !==
                                                                        "section"
                                                                ) {
                                                                    end++;
                                                                }
                                                                return end;
                                                            })(),
                                                        )
                                                    }
                                                    onMoveElementUp={(idx) =>
                                                        moveElement(idx, -1)
                                                    }
                                                    onMoveElementDown={(idx) =>
                                                        moveElement(idx, 1)
                                                    }
                                                    onRemoveElement={(idx) =>
                                                        removeElement(idx)
                                                    }
                                                />
                                            );
                                        })}
                                    </Flex>
                                )}
                            </div>

                            <div
                                style={{
                                    width: 260,
                                    border: "1px solid #f0f0f0",
                                    borderRadius: 6,
                                    padding: 12,
                                    background: "#fff",
                                }}
                            >
                                <Typography.Text strong>
                                    Available elements
                                </Typography.Text>
                                <Typography.Paragraph
                                    type="secondary"
                                    style={{ fontSize: 12, marginBottom: 8 }}
                                >
                                    Adds into:{" "}
                                    <Tag
                                        color={
                                            activeSectionId
                                                ? "purple"
                                                : "default"
                                        }
                                    >
                                        {activeSectionId
                                            ? groups.find(
                                                  (g) =>
                                                      g.sectionId ===
                                                      activeSectionId,
                                              )?.sectionName ?? "…"
                                            : "Before first section"}
                                    </Tag>
                                </Typography.Paragraph>
                                {availableElements.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="All elements added"
                                    />
                                ) : (
                                    <Flex vertical gap={4}>
                                        {availableElements.map((el) => (
                                            <Flex
                                                key={el.id}
                                                justify="space-between"
                                                align="center"
                                                gap={8}
                                                style={{
                                                    padding: "4px 8px",
                                                    background: "#f5f5f5",
                                                    borderRadius: 4,
                                                }}
                                            >
                                                <Typography.Text
                                                    style={{ fontSize: 12 }}
                                                    ellipsis={{
                                                        tooltip: el.label,
                                                    }}
                                                >
                                                    {el.label}
                                                </Typography.Text>
                                                <Button
                                                    size="small"
                                                    type="text"
                                                    icon={<PlusOutlined />}
                                                    onClick={() =>
                                                        appendElement(el.id)
                                                    }
                                                />
                                            </Flex>
                                        ))}
                                    </Flex>
                                )}
                            </div>
                        </Flex>
                    )}

                    {selectedSectionId && (
                        <Flex gap={8} style={{ marginTop: 16 }}>
                            <Button
                                type="primary"
                                loading={saving}
                                onClick={save}
                                style={{
                                    background: "#7c3aed",
                                    borderColor: "#7c3aed",
                                }}
                            >
                                Save
                            </Button>
                        </Flex>
                    )}
                </div>
            </Flex>

            <Modal
                open={newSectionModal !== null}
                title="Add section header"
                onCancel={() => setNewSectionModal(null)}
                onOk={confirmAddSection}
                okButtonProps={{
                    disabled: !newSectionModal?.name.trim(),
                }}
                destroyOnHidden
            >
                <Input
                    autoFocus
                    placeholder="Section name…"
                    value={newSectionModal?.name ?? ""}
                    onChange={(e) =>
                        setNewSectionModal((prev) =>
                            prev ? { ...prev, name: e.target.value } : prev,
                        )
                    }
                    onPressEnter={confirmAddSection}
                />
            </Modal>

            <Modal
                open={renameModal !== null}
                title="Rename section"
                onCancel={() => setRenameModal(null)}
                onOk={confirmRename}
                okButtonProps={{
                    disabled: !renameModal?.name.trim(),
                }}
                destroyOnHidden
            >
                <Input
                    autoFocus
                    placeholder="Section name…"
                    value={renameModal?.name ?? ""}
                    onChange={(e) =>
                        setRenameModal((prev) =>
                            prev ? { ...prev, name: e.target.value } : prev,
                        )
                    }
                    onPressEnter={confirmRename}
                />
            </Modal>
        </Flex>
    );
}

type LayoutGroupCardProps = {
    group: {
        sectionId: string | null;
        sectionName: string | null;
        sectionIndex: number | null;
        elements: Array<{ id: string; index: number }>;
    };
    isActive: boolean;
    isCollapsed: boolean;
    onToggleCollapse?: () => void;
    isFirstSection: boolean;
    isLastSection: boolean;
    elementLabelById: Map<string, string>;
    onSelect: () => void;
    onRename: () => void;
    onDeleteSection: () => void;
    onMoveSectionUp: () => void;
    onMoveSectionDown: () => void;
    onInsertSectionAfter: () => void;
    onMoveElementUp: (index: number) => void;
    onMoveElementDown: (index: number) => void;
    onRemoveElement: (index: number) => void;
};

function LayoutGroupCard({
    group,
    isActive,
    isCollapsed,
    onToggleCollapse,
    isFirstSection,
    isLastSection,
    elementLabelById,
    onSelect,
    onRename,
    onDeleteSection,
    onMoveSectionUp,
    onMoveSectionDown,
    onInsertSectionAfter,
    onMoveElementUp,
    onMoveElementDown,
    onRemoveElement,
}: LayoutGroupCardProps) {
    const isRoot = group.sectionId === null;
    return (
        <Card
            size="small"
            onClick={onSelect}
            style={{
                cursor: "pointer",
                borderColor: isActive
                    ? "#7c3aed"
                    : isRoot
                      ? "#d9d9d9"
                      : "#c4b5fd",
                borderWidth: isActive ? 2 : 1,
                background: isRoot ? "#fff" : isActive ? "#f5f3ff" : "#faf5ff",
            }}
            title={
                <Flex align="center" gap={8}>
                    {!isRoot && onToggleCollapse && (
                        <Button
                            type="text"
                            size="small"
                            icon={
                                isCollapsed ? (
                                    <CaretRightOutlined />
                                ) : (
                                    <DownOutlined />
                                )
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleCollapse();
                            }}
                            style={{ marginLeft: -6 }}
                        />
                    )}
                    {isRoot ? (
                        <Typography.Text type="secondary" italic>
                            Before first section
                        </Typography.Text>
                    ) : (
                        <>
                            <Tag color={isActive ? "purple" : "default"}>
                                Section
                            </Tag>
                            <Typography.Text strong>
                                {group.sectionName}
                            </Typography.Text>
                            {isActive && (
                                <Tag color="green" style={{ marginLeft: 4 }}>
                                    Active
                                </Tag>
                            )}
                            {isCollapsed && (
                                <Tag style={{ marginLeft: 4 }}>
                                    {group.elements.length} element
                                    {group.elements.length === 1 ? "" : "s"}
                                </Tag>
                            )}
                        </>
                    )}
                </Flex>
            }
            extra={
                !isRoot && (
                    <Flex
                        gap={2}
                        onClick={(e) => e.stopPropagation()}
                        role="group"
                    >
                        <Tooltip title="Move section up">
                            <Button
                                type="text"
                                size="small"
                                icon={<ArrowUpOutlined />}
                                disabled={isFirstSection}
                                onClick={onMoveSectionUp}
                            />
                        </Tooltip>
                        <Tooltip title="Move section down">
                            <Button
                                type="text"
                                size="small"
                                icon={<ArrowDownOutlined />}
                                disabled={isLastSection}
                                onClick={onMoveSectionDown}
                            />
                        </Tooltip>
                        <Tooltip title="Rename section">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={onRename}
                            />
                        </Tooltip>
                        <Tooltip title="Insert section after this">
                            <Button
                                type="text"
                                size="small"
                                icon={<FolderAddOutlined />}
                                onClick={onInsertSectionAfter}
                            />
                        </Tooltip>
                        <Tooltip title="Remove section (elements move up)">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={onDeleteSection}
                            />
                        </Tooltip>
                    </Flex>
                )
            }
            styles={
                isCollapsed
                    ? { body: { display: "none" } }
                    : undefined
            }
        >
            {group.elements.length === 0 ? (
                <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, fontStyle: "italic" }}
                >
                    No elements yet — select this section, then click{" "}
                    <PlusOutlined /> on an available element to add here.
                </Typography.Text>
            ) : (
                <Flex vertical gap={4} onClick={(e) => e.stopPropagation()}>
                    {group.elements.map((el, elIdx) => (
                        <Flex
                            key={`${el.id}-${el.index}`}
                            align="center"
                            gap={8}
                            style={{
                                padding: "4px 8px",
                                background: "#fff",
                                border: "1px solid #f0f0f0",
                                borderRadius: 4,
                            }}
                        >
                            <Flex vertical gap={0}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<ArrowUpOutlined />}
                                    disabled={elIdx === 0}
                                    onClick={() =>
                                        onMoveElementUp(el.index)
                                    }
                                    style={{ height: 18, width: 24 }}
                                />
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<ArrowDownOutlined />}
                                    disabled={
                                        elIdx === group.elements.length - 1
                                    }
                                    onClick={() =>
                                        onMoveElementDown(el.index)
                                    }
                                    style={{ height: 18, width: 24 }}
                                />
                            </Flex>
                            <Typography.Text
                                style={{ flex: 1, minWidth: 0 }}
                                ellipsis={{
                                    tooltip:
                                        elementLabelById.get(el.id) ??
                                        `Unknown element (${el.id})`,
                                }}
                            >
                                {elementLabelById.get(el.id) ??
                                    `Unknown element (${el.id})`}
                            </Typography.Text>
                            <Tooltip title="Remove element">
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        onRemoveElement(el.index)
                                    }
                                />
                            </Tooltip>
                        </Flex>
                    ))}
                </Flex>
            )}
        </Card>
    );
}
