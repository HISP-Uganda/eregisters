import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDataEngine } from "@dhis2/app-runtime";
import { createRoute } from "@tanstack/react-router";
import {
    Button,
    Checkbox,
    Collapse,
    Flex,
    Input,
    List,
    message,
    Tabs,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { db } from "../db";
import { useMetadata } from "../hooks/useMetadata";
import { useUIConfig } from "../hooks/useUIConfig";
import { SubsectionConfig } from "../schemas";
import { AdminRoute } from "./admin";

export const AdminSectionLayoutRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/section-layout",
    component: SectionLayout,
});

function SectionLayout() {
    const { program, trackedEntityAttributes, dataElements } = useMetadata();
    const uiConfig = useUIConfig();
    const engine = useDataEngine();
    const [activeTab, setActiveTab] = useState<"stages" | "program">("stages");
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
        null,
    );
    const [subsections, setSubsections] = useState<SubsectionConfig[]>([]);
    const [newName, setNewName] = useState("");
    const [saving, setSaving] = useState(false);

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

    const visibleSections: Array<{ id: string; name: string; stageName?: string }> =
        activeTab === "stages"
            ? allStageSections.map((s) => ({
                  id: s.id,
                  name: s.name,
                  stageName: s.stageName,
              }))
            : allProgramSections.map((s) => ({ id: s.id, name: s.name }));

    useEffect(() => {
        if (selectedSectionId) {
            setSubsections(
                uiConfig.subsections[selectedSectionId]
                    ? JSON.parse(
                          JSON.stringify(
                              uiConfig.subsections[selectedSectionId],
                          ),
                      )
                    : [],
            );
        }
    }, [selectedSectionId, uiConfig.subsections]);

    const selectedSection =
        activeTab === "stages"
            ? allStageSections.find((s) => s.id === selectedSectionId)
            : allProgramSections.find((s) => s.id === selectedSectionId);

    const allElementsInSection: Array<{ id: string; label: string }> =
        selectedSection
            ? activeTab === "stages"
                ? (
                      selectedSection as (typeof allStageSections)[number]
                  ).dataElements.map((de) => ({
                      id: de.id,
                      label:
                          (() => {
                              const full = dataElements.get(de.id);
                              return full?.formName || full?.name || de.id;
                          })(),
                  }))
                : (
                      selectedSection as (typeof allProgramSections)[number]
                  ).trackedEntityAttributes.map((tea) => {
                      const attr = trackedEntityAttributes.get(tea.id);
                      return {
                          id: tea.id,
                          label: attr?.displayFormName || attr?.name || tea.id,
                      };
                  })
            : [];

    const assignedIds = new Set(subsections.flatMap((s) => s.dataElementIds));

    function addSubsection() {
        if (!newName.trim()) return;
        setSubsections((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: newName.trim(),
                dataElementIds: [],
            },
        ]);
        setNewName("");
    }

    function removeSubsection(id: string) {
        setSubsections((prev) => prev.filter((s) => s.id !== id));
    }

    function toggleElement(subsectionId: string, elementId: string) {
        setSubsections((prev) =>
            prev.map((s) => {
                if (s.id === subsectionId) {
                    const has = s.dataElementIds.includes(elementId);
                    return {
                        ...s,
                        dataElementIds: has
                            ? s.dataElementIds.filter((id) => id !== elementId)
                            : [...s.dataElementIds, elementId],
                    };
                }
                return {
                    ...s,
                    dataElementIds: s.dataElementIds.filter(
                        (id) => id !== elementId,
                    ),
                };
            }),
        );
    }

    async function save() {
        if (!selectedSectionId) return;
        setSaving(true);
        try {
            const updated = {
                ...uiConfig,
                subsections: {
                    ...uiConfig.subsections,
                    [selectedSectionId]: subsections,
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
            message.success("Subsections saved");
        } catch {
            message.error("Failed to save subsections");
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
                Split sections into named sub-groups. Changes are stored locally
                and do not modify DHIS2 metadata.
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
                <div style={{ width: 220, flexShrink: 0 }}>
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
                                onClick={() =>
                                    setSelectedSectionId(section.id)
                                }
                            >
                                <Flex vertical gap={0}>
                                    <span>{section.name}</span>
                                    {"stageName" in section && (
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
                            Select a section to configure subsections
                        </Typography.Text>
                    ) : (
                        <Flex vertical gap={12}>
                            <Flex gap={8}>
                                <Input
                                    placeholder="New subsection name…"
                                    value={newName}
                                    onChange={(e) =>
                                        setNewName(e.target.value)
                                    }
                                    onPressEnter={addSubsection}
                                    style={{ maxWidth: 280 }}
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={addSubsection}
                                    disabled={!newName.trim()}
                                >
                                    Add Subsection
                                </Button>
                            </Flex>

                            {subsections.length > 0 ? (
                                <Collapse
                                    items={subsections.map((sub) => ({
                                        key: sub.id,
                                        label: (
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                            >
                                                <span>{sub.name}</span>
                                                <Button
                                                    type="text"
                                                    danger
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeSubsection(
                                                            sub.id,
                                                        );
                                                    }}
                                                />
                                            </Flex>
                                        ),
                                        children: (
                                            <Flex vertical gap={6}>
                                                {allElementsInSection.map(
                                                    (el) => (
                                                        <Checkbox
                                                            key={el.id}
                                                            checked={sub.dataElementIds.includes(
                                                                el.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleElement(
                                                                    sub.id,
                                                                    el.id,
                                                                )
                                                            }
                                                            disabled={
                                                                !sub.dataElementIds.includes(
                                                                    el.id,
                                                                ) &&
                                                                assignedIds.has(
                                                                    el.id,
                                                                )
                                                            }
                                                        >
                                                            {el.label}
                                                        </Checkbox>
                                                    ),
                                                )}
                                            </Flex>
                                        ),
                                    }))}
                                />
                            ) : (
                                <Typography.Text type="secondary">
                                    No subsections yet — add one above
                                </Typography.Text>
                            )}

                            <Button
                                type="primary"
                                loading={saving}
                                onClick={save}
                                style={{
                                    background: "#7c3aed",
                                    borderColor: "#7c3aed",
                                    alignSelf: "flex-start",
                                }}
                            >
                                Save
                            </Button>
                        </Flex>
                    )}
                </div>
            </Flex>
        </Flex>
    );
}
