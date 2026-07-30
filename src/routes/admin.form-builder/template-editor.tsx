import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from "@ant-design/icons";
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
    Typography,
} from "antd";
import React from "react";
import type {
    CellV2,
    FormConfigDoc,
    SectionV2,
} from "../../form-configs/v2-types";
import {
    deleteColumnInTemplate,
    insertColumnInTemplate,
    insertRowInTemplate,
    moveColumnInTemplate,
    renameColumnInTemplate,
    setCellInTemplate,
} from "./reducers";

export function TemplateEditor({
    doc,
    templateId,
    onChange,
}: {
    doc: FormConfigDoc;
    templateId: string;
    onChange: (next: FormConfigDoc) => void;
}) {
    const template = doc.templates[templateId];
    if (!template) return null;

    return (
        <Card
            size="small"
            title={
                <Flex gap={8} align="center">
                    <span>Editing template:</span>
                    <Typography.Text strong>{template.title}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        {templateId}
                    </Typography.Text>
                </Flex>
            }
            extra={
                <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() =>
                        onChange(insertRowInTemplate(doc, templateId))
                    }
                >
                    Row
                </Button>
            }
        >
            <ColumnsStrip
                doc={doc}
                templateId={templateId}
                template={template}
                onChange={onChange}
            />
            <TemplateTable
                doc={doc}
                templateId={templateId}
                template={template}
                onChange={onChange}
            />
        </Card>
    );
}

function ColumnsStrip({
    doc,
    templateId,
    template,
    onChange,
}: {
    doc: FormConfigDoc;
    templateId: string;
    template: SectionV2;
    onChange: (next: FormConfigDoc) => void;
}) {
    return (
        <Flex
            gap={4}
            wrap
            style={{
                marginBottom: 8,
                padding: 6,
                background: "#fafafa",
                border: "1px dashed #d9d9d9",
                borderRadius: 4,
            }}
            align="center"
        >
            <Typography.Text
                type="secondary"
                style={{ fontSize: 11, marginRight: 4 }}
            >
                Columns:
            </Typography.Text>
            {template.columns.length === 0 && (
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    none — add one →
                </Typography.Text>
            )}
            {template.columns.map((c, i) => (
                <Space.Compact key={c.key} size="small">
                    <Button
                        size="small"
                        icon={<ArrowLeftOutlined />}
                        disabled={i === 0}
                        onClick={() =>
                            onChange(
                                moveColumnInTemplate(doc, templateId, i, -1),
                            )
                        }
                    />
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            const next = window.prompt(
                                "Column title",
                                c.title ?? "",
                            );
                            if (next !== null)
                                onChange(
                                    renameColumnInTemplate(
                                        doc,
                                        templateId,
                                        c.key,
                                        next,
                                    ),
                                );
                        }}
                    >
                        {c.title ?? c.key}
                    </Button>
                    <Button
                        size="small"
                        icon={<ArrowRightOutlined />}
                        disabled={i === template.columns.length - 1}
                        onClick={() =>
                            onChange(
                                moveColumnInTemplate(doc, templateId, i, 1),
                            )
                        }
                    />
                    <Popconfirm
                        title="Delete this column and all its cells?"
                        onConfirm={() =>
                            onChange(
                                deleteColumnInTemplate(doc, templateId, c.key),
                            )
                        }
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space.Compact>
            ))}
            <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                    const title = window.prompt("Column title");
                    if (title !== null)
                        onChange(
                            insertColumnInTemplate(doc, templateId, title),
                        );
                }}
            >
                Column
            </Button>
        </Flex>
    );
}

function TemplateTable({
    doc,
    templateId,
    template,
    onChange,
}: {
    doc: FormConfigDoc;
    templateId: string;
    template: SectionV2;
    onChange: (next: FormConfigDoc) => void;
}) {
    if (template.columns.length === 0) {
        return <Empty description="Add a column to start" />;
    }
    const columns = template.columns.map((c) => ({
        title: c.title ?? c.key,
        dataIndex: c.key,
        key: c.key,
        onCell: (row: Record<string, CellV2 | string>) => {
            const cell = row[c.key];
            if (typeof cell === "string" || !cell) return {};
            return cell.rowSpan || cell.colSpan
                ? { rowSpan: cell.rowSpan, colSpan: cell.colSpan }
                : {};
        },
        render: (
            cell: CellV2 | undefined,
            row: Record<string, CellV2 | string>,
        ) => (
            <TemplateCellEditor
                cell={cell}
                onChange={(next) =>
                    onChange(
                        setCellInTemplate(
                            doc,
                            templateId,
                            row.__key as string,
                            c.key,
                            next,
                        ),
                    )
                }
            />
        ),
    }));
    const dataSource = template.rows.map((r) => ({
        key: r.key,
        __key: r.key,
        ...r.cells,
    }));
    return (
        <Table
            size="small"
            pagination={false}
            columns={columns as any}
            dataSource={dataSource as any}
        />
    );
}

function TemplateCellEditor({
    cell,
    onChange,
}: {
    cell: CellV2 | undefined;
    onChange: (next: CellV2 | null) => void;
}) {
    const kind = cell?.kind ?? "label";
    return (
        <Space size={4} direction="vertical" style={{ width: "100%" }}>
            <Select
                size="small"
                value={kind}
                style={{ width: "100%" }}
                onChange={(k) =>
                    onChange({ ...(cell ?? {}), kind: k as CellV2["kind"] })
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
