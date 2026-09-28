import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import React from "react";
import { DataElement, FlattenedEvent, ProgramStage } from "../../schemas";
import { saveStageEventDate, saveStageEventValue } from "./actions";
import { EditableCell, OptionRow } from "./editable-cell";
import { InlineEditableCell } from "./inline-row";
import { CaptureMode, eventDate } from "./stage";

/** The option set whose codes the table shows as names (medicines). */
const MEDICINES_OPTION_SET = "Fm205YyFeRg";

type ColumnOptions = {
    programStage: ProgramStage;
    captureMode: CaptureMode;
    isMobile: boolean;
    dataElements: Map<string, DataElement>;
    optionSets: Map<string, OptionRow[]>;
    isExpanded: (event: string) => boolean;
    onView: (event: FlattenedEvent) => void;
    onToggleExpanded: (event: string) => void;
    onDelete: (event: FlattenedEvent) => Promise<void>;
};

function dateColumn(isInlineRow: boolean) {
    return {
        title: "Date",
        key: "date",
        width: 120,
        render: (_: unknown, row: FlattenedEvent) =>
            isInlineRow ? (
                // The date follows the visit's; shown, not edited.
                <EditableCell
                    valueType="DATE"
                    value={eventDate(row)}
                    onCommit={(v) => saveStageEventDate(row.event, v)}
                    disabled
                />
            ) : (
                dayjs(eventDate(row)).format("MMM DD, YYYY")
            ),
    };
}

function dataElementColumns(
    { programStage, dataElements, optionSets }: ColumnOptions,
    isInlineRow: boolean,
) {
    const medicines = new Map(
        optionSets.get(MEDICINES_OPTION_SET)?.map(({ code, name }) => [code, name]),
    );
    return programStage.programStageSections.flatMap((section) =>
        section.dataElements.map((de) => {
            const dataElement = dataElements.get(de.id)!;
            const optionSetId = dataElement.optionSet?.id;
            const options = optionSetId ? optionSets.get(optionSetId) : undefined;
            return {
                title: dataElement.formName || dataElement.name,
                key: de.id,
                dataIndex: ["dataValues", de.id],
                render: (value: unknown, row: FlattenedEvent): React.ReactNode => {
                    if (isInlineRow) {
                        return (
                            <InlineEditableCell
                                dataElementId={de.id}
                                valueType={dataElement.valueType}
                                options={options}
                                persist={(v) => saveStageEventValue(row.event, de.id, v)}
                            />
                        );
                    }
                    const code = value == null ? "" : String(value);
                    return medicines.get(code) ?? code;
                },
                responsive: ["md" as const],
                width: isInlineRow ? "40%" : undefined,
                ellipsis: false,
            };
        }),
    );
}

function actionColumn(o: ColumnOptions) {
    const size = o.isMobile ? "small" : "middle";
    return {
        title: "Action",
        key: "action",
        width: o.isMobile ? 80 : 100,
        fixed: "right" as const,
        render: (_: unknown, record: FlattenedEvent) => (
            <Flex
                gap="small"
                align="center"
                // The row itself is clickable — stop the click here so these
                // buttons don't also open or expand the row.
                onClick={(e) => e.stopPropagation()}
            >
                <Popconfirm
                    title="Delete Event"
                    description="Are you sure you want to delete this event? This will sync the deletion to DHIS2."
                    okText="Delete"
                    okType="danger"
                    onConfirm={() => o.onDelete(record)}
                >
                    <Button danger icon={<DeleteOutlined />} size={size}>
                        {!o.isMobile && "Delete"}
                    </Button>
                </Popconfirm>
                {o.captureMode === "modal" && (
                    <Button icon={<EyeOutlined />} size={size} onClick={() => o.onView(record)}>
                        {!o.isMobile && "View"}
                    </Button>
                )}
                {o.captureMode === "inline-expand" && (
                    <Button
                        icon={<EditOutlined />}
                        size={size}
                        onClick={() => o.onToggleExpanded(record.event)}
                    >
                        {!o.isMobile && (o.isExpanded(record.event) ? "Close" : "Edit")}
                    </Button>
                )}
            </Flex>
        ),
    };
}

/** The stage table's columns: date, one per data element, sync status, actions. */
export function stageColumns(o: ColumnOptions): TableProps<FlattenedEvent>["columns"] {
    const isInlineRow = o.captureMode === "inline-row";
    return [
        dateColumn(isInlineRow),
        ...dataElementColumns(o, isInlineRow),
        {
            title: "Sync Status",
            dataIndex: "syncStatus",
            key: "syncStatus",
            width: 120,
            responsive: ["lg" as const],
        },
        actionColumn(o),
    ];
}
