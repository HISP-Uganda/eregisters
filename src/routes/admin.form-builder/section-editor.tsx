import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Empty,
    Flex,
    Input,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from "antd";
import React from "react";
import type {
    CellV2,
    FormConfigDoc,
    SectionV2,
} from "../../form-configs/v2-types";
import {
    addSection,
    detachTemplate,
    extractTemplate,
    insertRow,
    setCell,
} from "./reducers";

export function SectionEditor({
    doc,
    formId,
    tabKey,
    onChange,
}: {
    doc: FormConfigDoc;
    formId: string;
    tabKey: string | null;
    onChange: (next: FormConfigDoc) => void;
}) {
    if (!tabKey) return null;
    const form = doc.forms[formId];
    const tab = form.tabs.find((t) => t.key === tabKey);
    if (!tab) return null;

    return (
        <Flex vertical gap={12}>
            <Flex justify="space-between" align="center">
                <Typography.Text strong>Sections</Typography.Text>
                <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        const title = window.prompt("Section title");
                        if (title)
                            onChange(addSection(doc, formId, tabKey, title));
                    }}
                >
                    Add section
                </Button>
            </Flex>

            {tab.sections.length === 0 && (
                <Empty description="No sections in this tab yet." />
            )}

            {tab.sections.map((slot, index) => {
                const isRef = slot.kind === "ref";
                const section: SectionV2 | null =
                    slot.kind === "inline"
                        ? slot.section
                        : doc.templates[slot.templateId]
                          ? {
                                ...doc.templates[slot.templateId],
                                ...slot.overrides,
                            }
                          : null;
                if (!section) {
                    return (
                        <Card
                            key={index}
                            size="small"
                            title="(missing template)"
                        />
                    );
                }
                return (
                    <Card
                        key={`${section.key}-${index}`}
                        size="small"
                        title={
                            <Space>
                                <span>{section.title}</span>
                                {isRef && <Tag color="purple">Template</Tag>}
                            </Space>
                        }
                        extra={
                            <Space>
                                {isRef ? (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            onChange(
                                                detachTemplate(
                                                    doc,
                                                    formId,
                                                    tabKey,
                                                    index,
                                                ),
                                            )
                                        }
                                    >
                                        Detach
                                    </Button>
                                ) : (
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            const id =
                                                window.prompt("Template id");
                                            if (id)
                                                onChange(
                                                    extractTemplate(
                                                        doc,
                                                        formId,
                                                        tabKey,
                                                        index,
                                                        id,
                                                    ),
                                                );
                                        }}
                                    >
                                        Extract as template
                                    </Button>
                                )}
                                <Button
                                    size="small"
                                    icon={<PlusOutlined />}
                                    disabled={isRef}
                                    onClick={() =>
                                        onChange(
                                            insertRow(
                                                doc,
                                                formId,
                                                tabKey,
                                                index,
                                            ),
                                        )
                                    }
                                >
                                    Row
                                </Button>
                            </Space>
                        }
                    >
                        <SectionTable
                            doc={doc}
                            formId={formId}
                            tabKey={tabKey}
                            sectionIndex={index}
                            section={section}
                            readOnly={isRef}
                            onChange={onChange}
                        />
                    </Card>
                );
            })}
        </Flex>
    );
}

function SectionTable({
    doc,
    formId,
    tabKey,
    sectionIndex,
    section,
    readOnly,
    onChange,
}: {
    doc: FormConfigDoc;
    formId: string;
    tabKey: string;
    sectionIndex: number;
    section: SectionV2;
    readOnly: boolean;
    onChange: (next: FormConfigDoc) => void;
}) {
    const columns = section.columns.map((c) => ({
        title: c.title ?? c.key,
        dataIndex: c.key,
        key: c.key,
        onCell: (row: Record<string, CellV2 | string>) => {
            const cell = row[c.key];
            if (typeof cell === "string" || !cell) return {};
            return cell.rowSpan || cell.colSpan
                ? {
                      rowSpan: cell.rowSpan,
                      colSpan: cell.colSpan,
                  }
                : {};
        },
        render: (
            cell: CellV2 | undefined,
            row: Record<string, CellV2 | string>,
        ) => (
            <CellEditor
                cell={cell}
                readOnly={readOnly}
                onChange={(next) =>
                    onChange(
                        setCell(
                            doc,
                            formId,
                            tabKey,
                            sectionIndex,
                            row.__key as string,
                            c.key,
                            next,
                        ),
                    )
                }
            />
        ),
    }));

    const dataSource = section.rows.map((r) => ({
        key: r.key,
        __key: r.key,
        ...r.cells,
    }));

    if (columns.length === 0) {
        return (
            <Typography.Text type="secondary">
                No columns configured yet.
            </Typography.Text>
        );
    }

    return (
        <Table
            size="small"
            pagination={false}
            columns={columns as any}
            dataSource={dataSource as any}
        />
    );
}

function CellEditor({
    cell,
    readOnly,
    onChange,
}: {
    cell: CellV2 | undefined;
    readOnly: boolean;
    onChange: (next: CellV2 | null) => void;
}) {
    if (readOnly) {
        return (
            <Typography.Text style={{ fontSize: 11 }}>
                {cell?.text ?? cell?.dataElement ?? ""}
            </Typography.Text>
        );
    }
    const kind = cell?.kind ?? "label";
    return (
        <Space size={4} direction="vertical" style={{ width: "100%" }}>
            <Select
                size="small"
                value={kind}
                style={{ width: "100%" }}
                onChange={(k) =>
                    onChange({
                        ...(cell ?? {}),
                        kind: k as CellV2["kind"],
                    })
                }
                options={[
                    { value: "label", label: "Label" },
                    { value: "field", label: "Field" },
                ]}
            />
            {kind === "label" ? (
                <Input
                    size="small"
                    value={cell?.text ?? ""}
                    onChange={(e) =>
                        onChange({
                            kind: "label",
                            text: e.target.value,
                            colSpan: cell?.colSpan,
                            rowSpan: cell?.rowSpan,
                        })
                    }
                />
            ) : (
                <>
                    <Input
                        size="small"
                        placeholder="dataElement"
                        value={cell?.dataElement ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...(cell ?? { kind: "field" }),
                                kind: "field",
                                dataElement: e.target.value,
                            })
                        }
                    />
                    <Input
                        size="small"
                        placeholder="COC"
                        value={cell?.categoryOptionCombo ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...(cell ?? { kind: "field" }),
                                kind: "field",
                                categoryOptionCombo: e.target.value,
                            })
                        }
                    />
                </>
            )}
            <Space size={4}>
                <Input
                    size="small"
                    placeholder="colSpan"
                    style={{ width: 70 }}
                    value={cell?.colSpan ?? ""}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        onChange({
                            ...(cell ?? { kind }),
                            colSpan:
                                Number.isFinite(v) && v > 0 ? v : undefined,
                        });
                    }}
                />
                <Input
                    size="small"
                    placeholder="rowSpan"
                    style={{ width: 70 }}
                    value={cell?.rowSpan ?? ""}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        onChange({
                            ...(cell ?? { kind }),
                            rowSpan:
                                Number.isFinite(v) && v > 0 ? v : undefined,
                        });
                    }}
                />
                {cell && (
                    <Popconfirm
                        title="Clear cell?"
                        onConfirm={() => onChange(null)}
                    >
                        <Button
                            size="small"
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                )}
            </Space>
        </Space>
    );
}
