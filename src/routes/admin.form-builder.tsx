import { useDataEngine } from "@dhis2/app-runtime";
import { createRoute } from "@tanstack/react-router";
import {
    App,
    Button,
    Flex,
    Input,
    List,
    Modal,
    Space,
    Tabs,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    readLocalFormConfigs,
    writeServerFormConfigs,
} from "../db/form-config-doc";
import type { FormConfigDoc } from "../form-configs/v2-types";
import { EMPTY_FORM_CONFIG_DOC } from "../form-configs/v2-types";
import { AdminRoute } from "./admin";
import { SectionEditor } from "./admin.form-builder/section-editor";
import {
    addTab,
    deleteTab,
    moveTab,
    renameTab,
} from "./admin.form-builder/reducers";
import { TemplateEditor } from "./admin.form-builder/template-editor";
import { TemplatesPanel } from "./admin.form-builder/templates-panel";

export const AdminFormBuilderRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/form-builder",
    component: FormBuilder,
});

function FormBuilder() {
    const { message } = App.useApp();
    const engine = useDataEngine();
    const [doc, setDoc] = useState<FormConfigDoc>(EMPTY_FORM_CONFIG_DOC);
    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
    const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
    const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
        null,
    );
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [renameModal, setRenameModal] = useState<{
        tabKey: string;
        label: string;
    } | null>(null);

    useEffect(() => {
        void readLocalFormConfigs().then(setDoc);
    }, []);

    const formIds = Object.keys(doc.forms).sort();
    const form = selectedFormId ? doc.forms[selectedFormId] : undefined;

    useEffect(() => {
        if (form && !activeTabKey && form.tabs[0])
            setActiveTabKey(form.tabs[0].key);
    }, [form, activeTabKey]);

    const apply = (next: FormConfigDoc) => {
        setDoc(next);
        setDirty(true);
    };

    const save = async () => {
        setSaving(true);
        try {
            await writeServerFormConfigs(engine, doc);
            setDirty(false);
            message.success("Form configs saved");
        } catch (err) {
            console.error(err);
            message.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    const activeTab = form?.tabs.find((t) => t.key === activeTabKey) ?? null;

    return (
        <Flex
            vertical
            gap={16}
            style={{ flex: 1, minHeight: 0, height: "100%" }}
        >
            <Typography.Title level={4} style={{ margin: 0 }}>
                Form Builder
            </Typography.Title>

            <Flex gap={16} align="stretch" style={{ flex: 1, minHeight: 0 }}>
                <div
                    style={{
                        width: 240,
                        flexShrink: 0,
                        overflowY: "auto",
                    }}
                >
                    <List
                        bordered
                        size="small"
                        dataSource={formIds}
                        renderItem={(id) => (
                            <List.Item
                                style={{
                                    cursor: "pointer",
                                    background:
                                        selectedFormId === id
                                            ? "#ede9fe"
                                            : undefined,
                                    fontWeight:
                                        selectedFormId === id ? 600 : undefined,
                                }}
                                onClick={() => {
                                    setSelectedFormId(id);
                                    setActiveTabKey(null);
                                }}
                            >
                                {doc.forms[id].title || id}
                            </List.Item>
                        )}
                    />
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
                    {editingTemplateId ? (
                        <div
                            style={{
                                flex: 1,
                                minHeight: 0,
                                overflow: "auto",
                            }}
                        >
                            <TemplateEditor
                                doc={doc}
                                templateId={editingTemplateId}
                                onChange={apply}
                            />
                        </div>
                    ) : !form ? (
                        <Typography.Text type="secondary">
                            Select a form to edit.
                        </Typography.Text>
                    ) : (
                        <>
                            <Tabs
                                activeKey={activeTabKey ?? undefined}
                                onChange={setActiveTabKey}
                                items={form.tabs.map((t) => ({
                                    key: t.key,
                                    label: t.label,
                                }))}
                                tabBarExtraContent={
                                    <Space size="small">
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                const label =
                                                    window.prompt("Tab label");
                                                if (label)
                                                    apply(
                                                        addTab(
                                                            doc,
                                                            form.id,
                                                            label,
                                                        ),
                                                    );
                                            }}
                                        >
                                            + Tab
                                        </Button>
                                        {activeTab && (
                                            <>
                                                <Button
                                                    size="small"
                                                    onClick={() =>
                                                        setRenameModal({
                                                            tabKey: activeTab.key,
                                                            label:
                                                                activeTab.label,
                                                        })
                                                    }
                                                >
                                                    Rename
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        const idx =
                                                            form.tabs.findIndex(
                                                                (t) =>
                                                                    t.key ===
                                                                    activeTab.key,
                                                            );
                                                        apply(
                                                            moveTab(
                                                                doc,
                                                                form.id,
                                                                idx,
                                                                -1,
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    ← Move
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        const idx =
                                                            form.tabs.findIndex(
                                                                (t) =>
                                                                    t.key ===
                                                                    activeTab.key,
                                                            );
                                                        apply(
                                                            moveTab(
                                                                doc,
                                                                form.id,
                                                                idx,
                                                                1,
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    Move →
                                                </Button>
                                                <Button
                                                    size="small"
                                                    danger
                                                    onClick={() =>
                                                        apply(
                                                            deleteTab(
                                                                doc,
                                                                form.id,
                                                                activeTab.key,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </Space>
                                }
                            />

                            <div
                                style={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflow: "auto",
                                }}
                            >
                                <SectionEditor
                                    doc={doc}
                                    formId={form.id}
                                    tabKey={activeTabKey}
                                    onChange={apply}
                                />
                            </div>
                        </>
                    )}
                </div>

                <TemplatesPanel
                    doc={doc}
                    formId={selectedFormId}
                    tabKey={activeTabKey}
                    editingTemplateId={editingTemplateId}
                    onEditTemplate={setEditingTemplateId}
                    onChange={apply}
                />
            </Flex>

            {selectedFormId && (
                <Flex
                    gap={8}
                    style={{
                        position: "sticky",
                        bottom: 0,
                        background: "#fff",
                        padding: "12px 0",
                        borderTop: "1px solid #f0f0f0",
                    }}
                >
                    <Button
                        type="primary"
                        loading={saving}
                        disabled={!dirty}
                        onClick={save}
                    >
                        Save
                    </Button>
                    {dirty && (
                        <Typography.Text type="warning">
                            Unsaved changes
                        </Typography.Text>
                    )}
                </Flex>
            )}

            <Modal
                open={renameModal !== null}
                title="Rename tab"
                onCancel={() => setRenameModal(null)}
                onOk={() => {
                    if (renameModal && form) {
                        apply(
                            renameTab(
                                doc,
                                form.id,
                                renameModal.tabKey,
                                renameModal.label.trim(),
                            ),
                        );
                    }
                    setRenameModal(null);
                }}
            >
                <Input
                    value={renameModal?.label ?? ""}
                    onChange={(e) =>
                        setRenameModal((prev) =>
                            prev ? { ...prev, label: e.target.value } : prev,
                        )
                    }
                />
            </Modal>
        </Flex>
    );
}
