import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    ExperimentOutlined,
    EyeOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { and, eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import {
    Button,
    DatePicker,
    Flex,
    Form,
    Grid,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Switch,
    Table,
    TableProps,
    Typography,
    message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useMetadata } from "../hooks/useMetadata";
import { useModalState } from "../hooks/useModalState";
import { EventContext } from "../machines";
import { SyncContext } from "../machines/sync";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    ProgramStage,
} from "../schemas";
import {
    cancelDataModal,
    createEmptyEvent,
    deleteEventWithChildren,
} from "../utils/utils";
import { DataModal } from "./data-modal";
import ProgramStageForm from "./program-stage-form";
import { EventRuleAwareForm } from "./rule-aware-form";
import { computeSaveBlock } from "../utils/save-block";
import type { ProgramRuleResult } from "../schemas";

import {
    enrollmentsCollection,
    trackedEntitiesCollection,
    eventsCollection,
} from "../collections";

const { Text } = Typography;

type CaptureMode = "modal" | "inline-expand" | "inline-row";

type OptionRow = {
    id: string;
    name: string;
    code: string;
    optionSet: string;
    sortOrder: number;
};

const NUMERIC_TYPES = new Set([
    "NUMBER",
    "INTEGER",
    "INTEGER_POSITIVE",
    "INTEGER_ZERO_OR_POSITIVE",
    "INTEGER_NEGATIVE",
]);

const SELECT_WRAP_CLASS = "eregisters-editable-select";
const SELECT_WRAP_POPUP_CLASS = `${SELECT_WRAP_CLASS}-dropdown`;
// Full-text wrapping for both the selected-value chip and every dropdown
// option row — needed because HMIS/DHIS2 option labels are often long
// sentences and default antd Select ellipses them so aggressively that the
// data-entry user can't tell options apart.
const SELECT_WRAP_CSS = `
.${SELECT_WRAP_CLASS}.ant-select-single {
    height: auto !important;
    min-height: 24px;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector {
    height: auto !important;
    min-height: 24px;
    padding-top: 2px !important;
    padding-bottom: 2px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector .ant-select-selection-item {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    line-height: 1.3 !important;
    padding: 2px 0 !important;
    max-width: 100% !important;
    min-width: 0 !important;
    word-break: break-word !important;
    flex: 1 1 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector .ant-select-selection-search {
    top: 2px !important;
    max-width: 100% !important;
    min-width: 0 !important;
}
.${SELECT_WRAP_CLASS}.ant-select-single .ant-select-selector .ant-select-selection-search-input {
    max-width: 100% !important;
}
.${SELECT_WRAP_POPUP_CLASS} .ant-select-item {
    height: auto !important;
    min-height: 32px;
    padding: 6px 12px !important;
}
.${SELECT_WRAP_POPUP_CLASS} .ant-select-item-option-content {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    line-height: 1.35 !important;
    word-break: break-word !important;
}
`;

// EditableCell — used only by `captureMode="inline-row"`. Commits on blur / on
// change (Select, Switch, DatePicker). Not aware of program rules by design;
// stages that rely on rule-driven visibility should use "modal" or
// "inline-expand" instead.
const EditableCell: React.FC<{
    valueType: string;
    value: unknown;
    options?: OptionRow[];
    onCommit: (next: unknown) => void;
    disabledDate?: (d: dayjs.Dayjs) => boolean;
    disabled?: boolean;
}> = ({
    valueType,
    value,
    options,
    onCommit,
    disabledDate,
    disabled = false,
}) => {
    const [local, setLocal] = useState<unknown>(value);
    useEffect(() => setLocal(value), [value]);

    const commit = (next: unknown) => {
        if (next === value) return;
        onCommit(next);
    };

    if (options && options.length > 0) {
        return (
            <Select
                size="small"
                allowClear
                showSearch
                className={SELECT_WRAP_CLASS}
                popupClassName={SELECT_WRAP_POPUP_CLASS}
                style={{ minWidth: 160, width: "100%" }}
                value={
                    local === undefined || local === null
                        ? undefined
                        : String(local)
                }
                onChange={(v) => {
                    setLocal(v ?? null);
                    commit(v ?? null);
                }}
                options={options.map((o) => ({
                    label: o.name,
                    value: o.code,
                }))}
                filterOption={(input, option) =>
                    (option?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
                optionRender={(option) => (
                    <span
                        style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            lineHeight: 1.35,
                            display: "block",
                        }}
                    >
                        {option.label}
                    </span>
                )}
                labelRender={(labelProps) => (
                    <span
                        style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            lineHeight: 1.3,
                            display: "inline-block",
                        }}
                    >
                        {labelProps.label}
                    </span>
                )}
            />
        );
    }

    if (valueType === "DATE") {
        const dayjsValue = local ? dayjs(String(local)) : null;
        return (
            <DatePicker
                size="small"
                style={{ width: "100%" }}
                value={dayjsValue && dayjsValue.isValid() ? dayjsValue : null}
                disabledDate={disabledDate ?? ((d) => d.isAfter(dayjs()))}
                onChange={(v) => {
                    const iso = v ? v.format("YYYY-MM-DD") : null;
                    setLocal(iso);
                    commit(iso);
                }}
                disabled={disabled}
            />
        );
    }

    if (valueType === "BOOLEAN" || valueType === "TRUE_ONLY") {
        return (
            <Switch
                size="small"
                checked={Boolean(local)}
                onChange={(v) => {
                    setLocal(v);
                    commit(v);
                }}
            />
        );
    }

    if (NUMERIC_TYPES.has(valueType)) {
        const min =
            valueType === "INTEGER_POSITIVE"
                ? 1
                : valueType === "INTEGER_ZERO_OR_POSITIVE"
                  ? 0
                  : undefined;
        const max = valueType === "INTEGER_NEGATIVE" ? -1 : undefined;
        return (
            <InputNumber
                size="small"
                style={{ width: "100%" }}
                value={
                    local === undefined || local === null || local === ""
                        ? null
                        : Number(local)
                }
                min={min}
                max={max}
                onChange={(v) => setLocal(v ?? null)}
                onBlur={() => commit(local ?? null)}
            />
        );
    }

    if (valueType === "LONG_TEXT") {
        return (
            <Input.TextArea
                size="small"
                autoSize={{ minRows: 1, maxRows: 3 }}
                value={local == null ? "" : String(local)}
                onChange={(e) => setLocal(e.target.value)}
                onBlur={() => commit(local ?? null)}
            />
        );
    }

    return (
        <Input
            size="small"
            value={local == null ? "" : String(local)}
            onChange={(e) => setLocal(e.target.value)}
            onBlur={() => commit(local ?? null)}
            onPressEnter={(e) =>
                commit((e.target as HTMLInputElement).value ?? null)
            }
        />
    );
};

// InlineEventEditor — the expanded-row body for `captureMode="inline-expand"`.
// Reuses the exact same context + ProgramStageForm the modal uses, so program
// rules, sections, subsections, etc. all behave identically to the modal.
const InlineEventEditor: React.FC<{
    event: FlattenedEvent;
    enrollment: FlattenedEnrollment;
    trackedEntity: FlattenedTrackedEntity;
    programStage: ProgramStage;
    mainStageDataElements: Set<string>;
    programRules: ReturnType<typeof useMetadata>["programRules"];
    programRuleVariables: ReturnType<
        typeof useMetadata
    >["programRuleVariables"];
    allEnrollmentEvents: Array<{
        event: string;
        programStage: string;
        occurredAt: string;
        dataValues: Record<string, unknown>;
    }>;
    onDone: () => void;
    mainEvent: FlattenedEvent;
}> = ({
    event,
    enrollment,
    trackedEntity,
    programStage,
    mainStageDataElements,
    programRules,
    programRuleVariables,
    allEnrollmentEvents,
    onDone,
    mainEvent,
}) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            const tx = eventsCollection.update(event.event, (draft) => {
                draft.dataValues = values;
                draft.syncStatus = "draft";
                draft.parentEvent = mainEvent.event;
            });
            await tx.isPersisted.promise;
            message.success(`Saved ${programStage.name}`);
            onDone();
        } catch (err) {
            console.error("Inline save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async () => {
        await cancelDataModal(event);
        onDone();
    };

    return (
        <EventContext.Provider
            key={event.event}
            options={{
                input: {
                    programRules,
                    programRuleVariables,
                    enrollment,
                    event,
                    program: "ueBhWkWll5v",
                    programStage: programStage.id,
                    trackedEntity,
                    validDataElements: mainStageDataElements,
                    form,
                    allEnrollmentEvents,
                },
            }}
        >
            <Form
                form={form}
                layout="vertical"
                preserve={false}
                initialValues={event.dataValues}
            >
                <ProgramStageForm form={form} programStage={programStage} />
                <Flex gap={8} justify="flex-end" style={{ marginTop: 12 }}>
                    <Button icon={<CloseOutlined />} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={saving}
                        onClick={handleSave}
                        style={{
                            background: "#7c3aed",
                            borderColor: "#7c3aed",
                        }}
                    >
                        Save
                    </Button>
                </Flex>
            </Form>
        </EventContext.Provider>
    );
};

// Per-row EventContext for inline-row mode. Each row spawns its own event-form
// actor + antd Form so program rules re-evaluate per event as the user types.
const InlineRowProvider: React.FC<{
    event: FlattenedEvent;
    enrollment: FlattenedEnrollment;
    trackedEntity: FlattenedTrackedEntity;
    programStage: ProgramStage;
    mainStageDataElements: Set<string>;
    programRules: ReturnType<typeof useMetadata>["programRules"];
    programRuleVariables: ReturnType<
        typeof useMetadata
    >["programRuleVariables"];
    allEnrollmentEvents: Array<{
        event: string;
        programStage: string;
        occurredAt: string;
        dataValues: Record<string, unknown>;
    }>;
    children: React.ReactNode;
}> = ({
    event,
    enrollment,
    trackedEntity,
    programStage,
    mainStageDataElements,
    programRules,
    programRuleVariables,
    allEnrollmentEvents,
    children,
}) => {
    const [form] = Form.useForm();
    return (
        <EventContext.Provider
            key={event.event}
            options={{
                input: {
                    programRules,
                    programRuleVariables,
                    enrollment,
                    event,
                    program: "ueBhWkWll5v",
                    programStage: programStage.id,
                    trackedEntity,
                    validDataElements: mainStageDataElements,
                    form,
                    allEnrollmentEvents,
                },
            }}
        >
            <Form
                form={form}
                component={false}
                preserve={false}
                initialValues={event.dataValues}
            >
                {children}
            </Form>
        </EventContext.Provider>
    );
};

// Rule-aware cell inside `inline-row`. Consumes the row's EventContext so
// program-rule hidden/mandatory results apply per-row, and dispatches
// FIELD_CHANGED after every commit so downstream rules re-evaluate.
const InlineEditableCell: React.FC<{
    dataElementId: string;
    valueType: string;
    options?: OptionRow[];
    persist: (value: unknown) => Promise<void>;
}> = ({ dataElementId, valueType, options, persist }) => {
    const eventActor = EventContext.useActorRef();
    const ruleResult = EventContext.useSelector(
        (s) => s.context.ruleResult,
    );
    const form = EventContext.useSelector((s) => s.context.form);
    const currentValue = Form.useWatch(dataElementId, form);
    const isHidden = ruleResult?.hiddenFields.includes(dataElementId) ?? false;
    const isEffectivelyEmpty =
        currentValue === undefined ||
        currentValue === null ||
        currentValue === "" ||
        (Array.isArray(currentValue) && currentValue.length === 0);

    if (isHidden && isEffectivelyEmpty) {
        return (
            <Typography.Text
                type="secondary"
                style={{ fontSize: 11, fontStyle: "italic" }}
            >
                —
            </Typography.Text>
        );
    }

    return (
        <EditableCell
            valueType={valueType}
            value={currentValue}
            options={options}
            disabled={isHidden}
            onCommit={async (v) => {
                form?.setFieldValue(dataElementId, v);
                await persist(v);
                eventActor.send({
                    type: "FIELD_CHANGED",
                    formData: {
                        ...(form?.getFieldsValue() ?? {}),
                        [dataElementId]: v,
                    },
                });
            }}
        />
    );
};

export const ProgramStageCapture: React.FC<{
    programStage: ProgramStage;
    trackedEntity: FlattenedTrackedEntity;
    mainEvent: FlattenedEvent;
    captureMode?: CaptureMode;
    enrollment: FlattenedEnrollment;
}> = ({
    programStage,
    trackedEntity,
    mainEvent,
    captureMode = "modal",
    enrollment,
}) => {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    const { data, isOpen, isNew, openModal, closeModal } =
        useModalState<FlattenedEvent>();
    const { dataElements, optionSets, programRuleVariables, programRules } =
        useMetadata();
    const syncActor = SyncContext.useActorRef();

    const isInlineExpand = captureMode === "inline-expand";
    const isInlineRow = captureMode === "inline-row";

    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    const mainStageDataElements = useMemo(
        () =>
            new Set(
                programStage.programStageDataElements.map(
                    (psde) => psde.dataElement.id,
                ) ?? [],
            ),
        [programStage],
    );

    const stageMandatoryIds = useMemo(
        () =>
            programStage.programStageDataElements
                .filter((psde) => psde.compulsory)
                .map((psde) => psde.dataElement.id),
        [programStage],
    );
    const stageLabels = useMemo(() => {
        const m = new Map<string, string>();
        for (const psde of programStage.programStageDataElements) {
            const de = dataElements.get(psde.dataElement.id);
            if (de) m.set(de.id, de.formName || de.name);
        }
        return m;
    }, [programStage, dataElements]);
    const [stageRuleResult, setStageRuleResult] =
        useState<ProgramRuleResult | null>(null);

    const handleCreate = async () => {
        const newEvent = createEmptyEvent({
            trackedEntity: trackedEntity.trackedEntity,
            program: enrollment.program,
            orgUnit: enrollment.orgUnit,
            enrollment: enrollment.enrollment,
            programStage: programStage.id,
            occurredAt:
                mainEvent.dataValues["occurredAt"] || mainEvent.occurredAt,
            dataValues: {
                occurredAt:
                    mainEvent.dataValues["occurredAt"] || mainEvent.occurredAt,
            },
            parentEvent: mainEvent.event,
        });
        const tx = eventsCollection.insert(newEvent);
        await tx.isPersisted.promise;
        if (captureMode === "modal") {
            openModal(newEvent, enrollment, true);
        } else if (isInlineExpand) {
            setExpandedRowKeys((prev) => [...prev, newEvent.event]);
        }
        // inline-row: the new draft row appears with editable blank cells
        // ready for entry — no explicit UI transition needed.
    };

    const { data: events } = useLiveSuspenseQuery((q) =>
        q.from({ event: eventsCollection }).where(({ event }) => {
            return and(
                eq(event.programStage, programStage.id),
                eq(event.parentEvent, mainEvent.event),
                not(eq(event.syncStatus, "deleted")),
            );
        }),
    );

    // The mainEvent prop is a snapshot from a parent render; when the user
    // edits & saves the Visit Date on the parent form, the parent may re-pass
    // an updated prop OR may not (e.g. modal was already unmounted). Read the
    // authoritative occurredAt from Dexie so this component always sees the
    // latest value.
    const { data: liveMainEvent } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ event: eventsCollection })
                .where(({ event }) => eq(event.event, mainEvent.event))
                .findOne(),
        [mainEvent.event],
    );

    const { data: allEnrollmentEventsRaw } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ events: eventsCollection })
                .where(({ events }) =>
                    and(
                        eq(events.trackedEntity, trackedEntity.trackedEntity),
                        not(eq(events.syncStatus, "deleted")),
                    ),
                )
                .orderBy(({ events }) => events.occurredAt, "asc"),
        [trackedEntity.trackedEntity],
    );

    const medicines = new Map(
        optionSets.get("Fm205YyFeRg")?.map(({ code, name }) => [code, name]),
    );

    // Keep child events' occurredAt in sync with the parent visit date.
    // When the user edits the "Visit Date" on the main event and saves it,
    // every child event under it should reflect that new date (both for the
    // Date column display and for the outbound DHIS2 push).
    const authoritativeMain = liveMainEvent ?? mainEvent;
    const parentVisitDate =
        (authoritativeMain.dataValues?.["occurredAt"] as string | undefined) ||
        authoritativeMain.occurredAt;
    useEffect(() => {
        if (!parentVisitDate) return;
        for (const child of events) {
            const childDate =
                (child.dataValues?.["occurredAt"] as string | undefined) ||
                child.occurredAt;
            if (childDate === parentVisitDate) continue;
            void eventsCollection
                .update(child.event, (draft) => {
                    draft.occurredAt = parentVisitDate;
                    draft.dataValues.occurredAt = parentVisitDate;
                    if (draft.syncStatus === "synced") {
                        draft.syncStatus = "draft";
                    }
                })
                .isPersisted.promise.catch((err) => {
                    console.error(
                        "Failed to cascade visit date to child event",
                        child.event,
                        err,
                    );
                });
        }
    }, [parentVisitDate, events]);

    const commitCellChange = async (
        eventId: string,
        dataElementId: string,
        value: unknown,
    ) => {
        const tx = eventsCollection.update(eventId, (draft) => {
            draft.dataValues[dataElementId] = value;
            draft.syncStatus = "draft";
        });
        await tx.isPersisted.promise;
    };

    const commitOccurredAt = async (eventId: string, value: unknown) => {
        const tx = eventsCollection.update(eventId, (draft) => {
            draft.occurredAt = (value as string) ?? draft.occurredAt;
            draft.dataValues.occurredAt = value;
            draft.syncStatus = "draft";
        });
        await tx.isPersisted.promise;
    };

    const columns: TableProps<FlattenedEvent>["columns"] = [
        {
            title: "Date",
            key: "date",
						width:120,
            render: (_, row) => {
                if (isInlineRow) {
                    return (
                        <EditableCell
                            valueType="DATE"
                            value={
                                row.dataValues["occurredAt"] || row.occurredAt
                            }
                            onCommit={(v) => commitOccurredAt(row.event, v)}
                            disabled
                        />
                    );
                }
                return dayjs(
                    row.dataValues["occurredAt"] || row.occurredAt,
                ).format("MMM DD, YYYY");
            },
        },
        ...programStage.programStageSections.flatMap((section) => {
            return section.dataElements.map((de, index) => {
                const currentDataElement = dataElements.get(de.id)!;
                const optionSetId = currentDataElement.optionSet?.id;
                const options = optionSetId
                    ? optionSets.get(optionSetId)
                    : undefined;

                let width: number | undefined = undefined;

                if (index === 0) {
                    width = 400;
                }
                return {
                    title:
                        currentDataElement.formName || currentDataElement.name,
                    key: de.id,
                    dataIndex: ["dataValues", de.id],
                    // width,
                    render: (
                        value: unknown,
                        row: FlattenedEvent,
                    ): React.ReactNode => {
                        if (isInlineRow) {
                            return (
                                <InlineEditableCell
                                    dataElementId={de.id}
                                    valueType={currentDataElement.valueType}
                                    options={options}
                                    persist={(v) =>
                                        commitCellChange(row.event, de.id, v)
                                    }
                                />
                            );
                        }
                        const code = value == null ? "" : String(value);
                        return medicines.get(code) ?? code;
                    },
                    responsive: ["md" as const],
                    width: isInlineRow ? "40%" : undefined,
                    ellipsis: false,
                    // onCell: isInlineRow
                    //     ? () => ({
                    //           style: {
                    //               width: 220,
                    //               minWidth: 220,
                    //               maxWidth: 220,
                    //               verticalAlign: "top" as const,
                    //           },
                    //       })
                    //     : undefined,
                };
            });
        }),
        {
            title: "Sync Status",
            dataIndex: "syncStatus",
            key: "syncStatus",
            width: 120,
            responsive: ["lg" as const],
        },
        {
            title: "Action",
            key: "action",
            width: isMobile ? 80 : 100,
            fixed: "right",
            render: (_, record) => (
                <Flex gap="small" align="center">
                    <Popconfirm
                        title="Delete Event"
                        description="Are you sure you want to delete this event? This will sync the deletion to DHIS2."
                        okText="Delete"
                        okType="danger"
                        onConfirm={async () => {
                            try {
                                const { markedDeleted } =
                                    await deleteEventWithChildren(record.event);
                                if (markedDeleted.length > 0) {
                                    syncActor.send({ type: "PUSH_DATA" });
                                }
                                message.success("Event deleted");
                            } catch (error) {
                                console.error("Failed to delete event:", error);
                                message.error("Failed to delete event");
                            }
                        }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size={isMobile ? "small" : "middle"}
                        >
                            {!isMobile && "Delete"}
                        </Button>
                    </Popconfirm>
                    {captureMode === "modal" && (
                        <Button
                            icon={<EyeOutlined />}
                            size={isMobile ? "small" : "middle"}
                            onClick={() =>
                                openModal(
                                    {
                                        ...record,
                                        dataValues: {
                                            ...record.dataValues,
                                            occurredAt: record.occurredAt,
                                        },
                                    },
                                    enrollment,
                                )
                            }
                        >
                            {!isMobile && "View"}
                        </Button>
                    )}
                    {isInlineExpand && (
                        <Button
                            icon={<EditOutlined />}
                            size={isMobile ? "small" : "middle"}
                            onClick={() =>
                                setExpandedRowKeys((prev) =>
                                    prev.includes(record.event)
                                        ? prev.filter((k) => k !== record.event)
                                        : [...prev, record.event],
                                )
                            }
                        >
                            {!isMobile &&
                                (expandedRowKeys.includes(record.event)
                                    ? "Close"
                                    : "Edit")}
                        </Button>
                    )}
                </Flex>
            ),
        },
    ];

    const inlineEnrollmentEvents = useMemo(
        () =>
            allEnrollmentEventsRaw.map((e) => ({
                event: e.event,
                programStage: e.programStage,
                occurredAt: e.occurredAt,
                dataValues: e.dataValues,
            })),
        [allEnrollmentEventsRaw],
    );
    const eventsByKey = useMemo(
        () => new Map(events.map((e) => [e.event, e])),
        [events],
    );

    // For inline-row, wrap each <tr> in a per-row EventContext + Form so
    // program rules apply per event. `component={false}` on the Form and
    // Provider are context-only wrappers, so the <tr> stays a direct child
    // of <tbody> and antd Table markup remains valid.
    const rowComponents: TableProps<FlattenedEvent>["components"] = isInlineRow
        ? {
              body: {
                  row: (rowProps: {
                      "data-row-key"?: string;
                      children?: React.ReactNode;
                  } & React.HTMLAttributes<HTMLTableRowElement>) => {
                      const key = rowProps["data-row-key"];
                      const row = key ? eventsByKey.get(key) : undefined;
                      if (!row) return <tr {...rowProps} />;
                      return (
                          <InlineRowProvider
                              event={row}
                              enrollment={enrollment}
                              trackedEntity={trackedEntity}
                              programStage={programStage}
                              mainStageDataElements={mainStageDataElements}
                              programRules={programRules}
                              programRuleVariables={programRuleVariables}
                              allEnrollmentEvents={inlineEnrollmentEvents}
                          >
                              <tr {...rowProps} />
                          </InlineRowProvider>
                      );
                  },
              },
          }
        : undefined;

    const expandable: TableProps<FlattenedEvent>["expandable"] = isInlineExpand
        ? {
              expandedRowKeys,
              onExpandedRowsChange: (keys) =>
                  setExpandedRowKeys(keys as string[]),
              showExpandColumn: false,
              expandedRowRender: (record) => (
                  <InlineEventEditor
                      event={record}
                      enrollment={enrollment}
                      trackedEntity={trackedEntity}
                      programStage={programStage}
                      mainStageDataElements={mainStageDataElements}
                      programRules={programRules}
                      programRuleVariables={programRuleVariables}
                      allEnrollmentEvents={inlineEnrollmentEvents}
                      mainEvent={mainEvent}
                      onDone={() =>
                          setExpandedRowKeys((prev) =>
                              prev.filter((k) => k !== record.event),
                          )
                      }
                  />
              ),
          }
        : undefined;

    return (
        <>
            {isInlineRow && <style>{SELECT_WRAP_CSS}</style>}
            <Table
                columns={columns}
                dataSource={events}
                pagination={false}
                rowKey="event"
                scroll={{ x: "max-content" }}
                expandable={expandable}
                components={rowComponents}
                title={() => {
                    return (
                        <Flex
                            style={{
                                width: "100%",
                            }}
                            justify="space-between"
                            align="center"
                        >
                            <Flex align="center" gap="small">
                                <ExperimentOutlined
                                    style={{
                                        fontSize: 28,
                                        color: "#7c3aed",
                                    }}
                                />
                                <Text
                                    strong
                                    style={{
                                        fontSize: 14,
                                    }}
                                >
                                    {programStage.name}
                                </Text>
                            </Flex>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="middle"
                                onClick={handleCreate}
                                style={{
                                    background: "#7c3aed",
                                    borderColor: "#7c3aed",
                                    borderRadius: 6,
                                }}
                            >
                                {isMobile ? "Add" : `Add ${programStage.name}`}
                            </Button>
                        </Flex>
                    );
                }}
            />

            {captureMode === "modal" && (
                <DataModal<FlattenedEvent>
                    open={isOpen}
                    data={data}
                    onClose={closeModal}
                    onCancel={() => cancelDataModal(data!)}
                    enrollment={enrollment}
                    onSave={async ({ values, addAnother }) => {
                        if (values && data) {
                            const tx = eventsCollection.update(
                                data.event,
                                (draft) => {
                                    draft.dataValues = values;
                                    draft.syncStatus = "draft";
                                    draft.parentEvent = mainEvent.event;
                                },
                            );
                            await tx.isPersisted.promise;
                            if (addAnother) {
                                closeModal();
                                await handleCreate();
                            }
                        }
                    }}
                    title={
                        isNew ? programStage.name : `Edit ${programStage.name}`
                    }
                    submitButtonText={`Save ${programStage.name}`}
                    hasAddAnother={true}
                    saveBlockFor={(values) =>
                        computeSaveBlock({
                            metadataMandatoryIds: stageMandatoryIds,
                            ruleMandatoryIds:
                                stageRuleResult?.mandatoryFields ?? [],
                            hiddenIds: stageRuleResult?.hiddenFields ?? [],
                            values,
                            labels: stageLabels,
                            errors: (stageRuleResult?.errors ?? []).map(
                                (e) => e.content,
                            ),
                        })
                    }
                >
                    {(form) => {
                        if (data) {
                            return (
                                <EventContext.Provider
                                    key={data.event}
                                    options={{
                                        input: {
                                            programRules,
                                            programRuleVariables,
                                            enrollment,
                                            event: data!,
                                            program: "ueBhWkWll5v",
                                            programStage: programStage.id,
                                            trackedEntity,
                                            validDataElements:
                                                mainStageDataElements,
                                            form,
                                            allEnrollmentEvents:
                                                allEnrollmentEventsRaw.map(
                                                    (e) => ({
                                                        event: e.event,
                                                        programStage:
                                                            e.programStage,
                                                        occurredAt:
                                                            e.occurredAt,
                                                        dataValues:
                                                            e.dataValues,
                                                    }),
                                                ),
                                        },
                                    }}
                                >
                                    <EventRuleAwareForm
                                        onRuleResult={setStageRuleResult}
                                    >
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            preserve={false}
                                            initialValues={data?.dataValues}
                                        >
                                            <ProgramStageForm
                                                form={form}
                                                programStage={programStage}
                                            />
                                        </Form>
                                    </EventRuleAwareForm>
                                </EventContext.Provider>
                            );
                        }
                    }}
                </DataModal>
            )}
        </>
    );
};
