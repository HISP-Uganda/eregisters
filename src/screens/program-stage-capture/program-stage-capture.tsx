import { ExperimentOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Grid, Table, Typography } from "antd";
import type { TableProps } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useMetadata } from "@/hooks/useMetadata";
import { useModalState } from "@/hooks/useModalState";
import { SyncContext } from "@/machines/sync";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
    ProgramStage,
} from "@/schemas";
import { createStageEvent, deleteStageEvent } from "./actions";
import { SELECT_WRAP_CSS } from "./editable-cell";
import { InlineEventEditor } from "./inline-event-editor";
import { InlineRow, inlineRowProps } from "./inline-row";
import { CaptureMode, stageDataElementIds, StageFormContext } from "./stage";
import { stageColumns } from "./stage-columns";
import { StageEventModal } from "./stage-event-modal";
import { useStageEvents } from "./use-stage-events";

/**
 * A visit's events of one program stage: a table with "Add", and entry in
 * one of three modes (see `CaptureMode`).
 */
export function ProgramStageCapture({
    programStage,
    trackedEntity,
    mainEvent: visit,
    captureMode = "modal",
    enrollment,
}: {
    programStage: ProgramStage;
    trackedEntity: FlattenedTrackedEntity;
    /** The visit these events belong to. */
    mainEvent: FlattenedEvent;
    captureMode?: CaptureMode;
    enrollment: FlattenedEnrollment;
}) {
    const isMobile = !Grid.useBreakpoint().lg;
    const modal = useModalState<FlattenedEvent>();
    const { dataElements, optionSets, programRuleVariables, programRules } = useMetadata();
    const syncActor = SyncContext.useActorRef();
    const pushData = useCallback(() => syncActor.send({ type: "PUSH_DATA" }), [syncActor]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const { events, ruleEvents } = useStageEvents(programStage, visit, trackedEntity.trackedEntity);

    const stageDataElements = useMemo(() => stageDataElementIds(programStage), [programStage]);
    const context: StageFormContext = useMemo(
        () => ({
            programStage,
            enrollment,
            trackedEntity,
            stageDataElements,
            programRules,
            programRuleVariables,
            allEnrollmentEvents: ruleEvents,
        }),
        [programStage, enrollment, trackedEntity, stageDataElements, programRules, programRuleVariables, ruleEvents],
    );

    const toggleExpanded = (event: string) =>
        setExpandedRowKeys((prev) =>
            prev.includes(event) ? prev.filter((k) => k !== event) : [...prev, event],
        );
    const openView = (event: FlattenedEvent) =>
        modal.openModal(
            { ...event, dataValues: { ...event.dataValues, occurredAt: event.occurredAt } },
            enrollment,
        );

    const handleCreate = async () => {
        const event = await createStageEvent({
            trackedEntity,
            enrollment,
            programStage: programStage.id,
            visit,
        });
        if (captureMode === "modal") modal.openModal(event, enrollment, true);
        else if (captureMode === "inline-expand") setExpandedRowKeys((prev) => [...prev, event.event]);
        // inline-row: the new row appears with blank cells ready for entry.
    };

    const columns = stageColumns({
        programStage,
        captureMode,
        isMobile,
        dataElements,
        optionSets,
        isExpanded: (event) => expandedRowKeys.includes(event),
        onView: openView,
        onToggleExpanded: toggleExpanded,
        onDelete: (event) => deleteStageEvent(event.event, pushData),
    });

    // A row click opens the event as its mode's action button does; inline
    // rows are edited in place, so their rows carry their event instead.
    const onRow: TableProps<FlattenedEvent>["onRow"] =
        captureMode === "inline-row"
            ? (event) => inlineRowProps(context, event)
            : (event) => ({
                  onClick: () =>
                      captureMode === "modal" ? openView(event) : toggleExpanded(event.event),
                  style: { cursor: "pointer" },
              });

    const expandable: TableProps<FlattenedEvent>["expandable"] =
        captureMode === "inline-expand"
            ? {
                  expandedRowKeys,
                  onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
                  showExpandColumn: false,
                  expandedRowRender: (event) => (
                      <InlineEventEditor
                          context={context}
                          event={event}
                          visit={visit}
                          onDone={() =>
                              setExpandedRowKeys((prev) => prev.filter((k) => k !== event.event))
                          }
                      />
                  ),
              }
            : undefined;

    return (
        <>
            {captureMode === "inline-row" && <style>{SELECT_WRAP_CSS}</style>}
            <Table
                columns={columns}
                dataSource={events}
                pagination={false}
                rowKey="event"
                scroll={{ x: "max-content" }}
                expandable={expandable}
                components={captureMode === "inline-row" ? { body: { row: InlineRow } } : undefined}
                onRow={onRow}
                title={() => (
                    <Flex style={{ width: "100%" }} justify="space-between" align="center">
                        <Flex align="center" gap="small">
                            <ExperimentOutlined style={{ fontSize: 28, color: "#7c3aed" }} />
                            <Typography.Text strong style={{ fontSize: 14 }}>
                                {programStage.name}
                            </Typography.Text>
                        </Flex>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="middle"
                            onClick={handleCreate}
                            style={{ background: "#7c3aed", borderColor: "#7c3aed", borderRadius: 6 }}
                        >
                            {isMobile ? "Add" : `Add ${programStage.name}`}
                        </Button>
                    </Flex>
                )}
            />

            {captureMode === "modal" && (
                <StageEventModal
                    context={context}
                    event={modal.data}
                    isOpen={modal.isOpen}
                    isNew={modal.isNew}
                    visit={visit}
                    onClose={modal.closeModal}
                    onAddAnother={async () => {
                        modal.closeModal();
                        await handleCreate();
                    }}
                />
            )}
        </>
    );
}
