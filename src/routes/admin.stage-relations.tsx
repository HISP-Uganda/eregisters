import { useDataEngine } from "@dhis2/app-runtime";
import { createRoute } from "@tanstack/react-router";
import { Button, Flex, message, Select, Table, Typography } from "antd";
import React, { useState } from "react";
import { db } from "../db";
import { useMetadata } from "../hooks/useMetadata";
import { useStageHierarchyConfig } from "../hooks/useStageHierarchyConfig";
import type { StagePair } from "../schemas";
import { AdminRoute } from "./admin";

export const AdminStageRelationsRoute = createRoute({
    getParentRoute: () => AdminRoute,
    path: "/stage-relations",
    component: StageRelations,
});

interface Stage {
    id: string;
    name: string;
}

function childrenOf(stageId: string, pairs: StagePair[]) {
    return pairs
        .filter((p) => p.parentStageId === stageId)
        .map((p) => p.childStageId);
}

function isReverseOf(
    stageId: string,
    candidateChildId: string,
    pairs: StagePair[],
) {
    return pairs.some(
        (p) =>
            p.parentStageId === candidateChildId && p.childStageId === stageId,
    );
}

function StageRelations() {
    const engine = useDataEngine();
    const { program } = useMetadata();
    const savedConfig = useStageHierarchyConfig();
    const [pairs, setPairs] = useState<StagePair[]>(savedConfig);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const stages: Stage[] = program.programStages;

    // Re-sync local state whenever the live-queried saved config changes
    // (e.g. another admin saved elsewhere), but only while there are no
    // unsaved local edits.
    React.useEffect(() => {
        if (!dirty) setPairs(savedConfig);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedConfig]);

    const setChildrenOf = (stageId: string, childIds: string[]) => {
        setPairs((prev) => [
            ...prev.filter((p) => p.parentStageId !== stageId),
            ...childIds.map((childStageId) => ({
                parentStageId: stageId,
                childStageId,
            })),
        ]);
        setDirty(true);
    };

    const save = async () => {
        setSaving(true);
        try {
            try {
                await engine.mutate({
                    type: "update",
                    resource: "dataStore/eregisters",
                    id: "stage-hierarchy",
                    data: pairs,
                });
            } catch {
                await engine.mutate({
                    type: "create",
                    resource: "dataStore/eregisters",
                    data: { key: "stage-hierarchy", value: pairs },
                });
            }
            await db.stageHierarchy.put({ id: "main", config: pairs });
            setDirty(false);
            message.success("Stage relations saved");
        } catch {
            message.error("Failed to save stage relations");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Flex vertical gap={20} style={{ maxWidth: 780 }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
                Stage Relations
            </Typography.Title>
            <Typography.Text type="secondary">
                Configure which program stages may be a child of which other
                stage, for <b>{program.name}</b>. Until a stage has a
                relation configured here, the analytics line list treats it
                as unrestricted.
            </Typography.Text>

            <Table
                size="small"
                pagination={false}
                rowKey="id"
                dataSource={stages}
                columns={[
                    { title: "Stage", dataIndex: "name", width: 200 },
                    {
                        title: "Legal child stages",
                        render: (_: unknown, stage: Stage) => (
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="No children configured — unrestricted"
                                value={childrenOf(stage.id, pairs)}
                                onChange={(childIds: string[]) =>
                                    setChildrenOf(stage.id, childIds)
                                }
                                options={stages
                                    .filter((s) => s.id !== stage.id)
                                    .filter(
                                        (s) =>
                                            !isReverseOf(stage.id, s.id, pairs),
                                    )
                                    .map((s) => ({
                                        label: s.name,
                                        value: s.id,
                                    }))}
                            />
                        ),
                    },
                ]}
            />

            <Flex>
                <Button type="primary" loading={saving} onClick={save}>
                    Save
                </Button>
            </Flex>
        </Flex>
    );
}
