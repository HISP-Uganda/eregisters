import { and, eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import { Badge, Flex, Tabs, Typography } from "antd";
import React, { Key, useState } from "react";
import { FlattenedEvent, FlattenedTrackedEntity } from "../schemas";
import { createEmptyEvent } from "../utils/utils";
import Relation from "./relation";
import { SyncStatusComp } from "./sync-status-comp";

import {
    enrollmentsCollection,
    eventsCollection,
    trackedEntitiesCollection,
} from "../collections";

const RELATIONSHIP_TABS_CLASS = "eregisters-relationship-tabs";
const RELATIONSHIP_TABS_CSS = `
.${RELATIONSHIP_TABS_CLASS} .ant-tabs-nav {
    margin-bottom: 12px !important;
}
.${RELATIONSHIP_TABS_CLASS} .ant-tabs-tab {
    border: 1.5px solid #94a3b8 !important;
    background: #ffffff !important;
    padding: 8px 14px !important;
    margin-right: 6px !important;
    border-radius: 6px 6px 0 0 !important;
    transition: background-color 120ms ease,
        border-color 120ms ease,
        box-shadow 120ms ease,
        transform 120ms ease;
}
.${RELATIONSHIP_TABS_CLASS} .ant-tabs-tab:hover {
    border-color: #a78bfa !important;
    background: #f5f3ff !important;
}
.${RELATIONSHIP_TABS_CLASS} .ant-tabs-tab-active {
    border: 2px solid #7c3aed !important;
    background: #ede9fe !important;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.18) !important;
    transform: translateY(-1px);
}
.${RELATIONSHIP_TABS_CLASS} .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #4c1d95 !important;
}
`;

const getChildParts = (
    to: FlattenedTrackedEntity["attributes"],
): { name: string; dob: string } => {
    const firstName = to["KSq9EyZ8ZFi"];
    const surname = to["TWPNbc9O2nK"];
    const dob = to["Y3DE5CZWySr"];
    const name = `${firstName || "Unknown"} ${surname || ""}`.trim();
    return {
        name: name.length > 0 ? name : "Unknown",
        dob: dob ? String(dob) : "No DOB",
    };
};

export default function RelationshipEvent({
    section,
    trackedEntity: tei,
    mainEvent,
}: {
    section: string;
    trackedEntity: FlattenedTrackedEntity;
    mainEvent: FlattenedEvent;
}) {
    const [activeKey, setActiveKey] = useState<string>("");

    const { data: children } = useLiveSuspenseQuery((q) =>
        q
            .from({ trackedEntity: trackedEntitiesCollection })
            .where(({ trackedEntity }) =>
                and(
                    eq(trackedEntity.parentEntity, tei.trackedEntity),
                    not(eq(trackedEntity.syncStatus, "deleted")),
                ),
            ),
    );

    const { data: events } = useLiveSuspenseQuery((q) =>
        q
            .from({ event: eventsCollection })
            .where(({ event }) =>
                and(
                    eq(event.parentEvent, mainEvent.event),
                    not(eq(event.syncStatus, "deleted")),
                ),
            ),
    );
    const { data: enrollment } = useLiveSuspenseQuery((q) =>
        q
            .from({ enrollment: enrollmentsCollection })
            .where(({ enrollment }) =>
                eq(enrollment.trackedEntity, tei.trackedEntity),
            )
            .findOne(),
    );

    if (children.length === 0) {
        return null;
    }

    const onChange = async (activeKey: Key) => {
        const current = events.find((x) => x.trackedEntity === activeKey);
        const currentChild = children.find(
            ({ trackedEntity }) => trackedEntity === activeKey,
        );

        if (current === undefined && currentChild && enrollment) {
            const newEvent = createEmptyEvent({
                trackedEntity: currentChild.trackedEntity,
                program: enrollment.program,
                orgUnit: enrollment.orgUnit,
                enrollment: enrollment.enrollment,
                programStage: "K2nxbE9ubSs",
                dataValues: {
                    occurredAt:
                        mainEvent.dataValues["occurredAt"] ||
                        mainEvent.occurredAt,

                    UuxHHVp5CnF:
                        section === "Maternity" ? "Newborn" : "Postnatal",
                    mrKZWf2WMIC: "Child Health Services",
                },
                parentEvent: mainEvent.event,
            });
            const tx = eventsCollection.insert(newEvent);
            await tx.isPersisted.promise;
        }
        setActiveKey(() => String(activeKey));
    };
    return (
        <Flex vertical gap={8}>
            <style>{RELATIONSHIP_TABS_CSS}</style>
            <Flex align="center" gap={8}>
                <Typography.Title level={4}>
                    Newborns
                </Typography.Title>
                <Badge
                    count={children.length}
                    style={{
                        backgroundColor: "#7c3aed",
                    }}
                />
            </Flex>
            <Tabs
                className={RELATIONSHIP_TABS_CLASS}
                type="card"
                hideAdd
                items={children.map((trackedEntity) => {
                    const { name, dob } = getChildParts(
                        trackedEntity.attributes,
                    );
                    const isActive =
                        activeKey === trackedEntity.trackedEntity;
                    return {
                        key: trackedEntity.trackedEntity,
                        closeIcon: trackedEntity.syncStatus === "draft",
                        label: (
                            <Flex
                                vertical
                                gap={2}
                                style={{ padding: "2px 4px", minWidth: 160 }}
                            >
                                <Flex align="center" gap={8}>
                                    <Typography.Text
                                        strong
                                        style={{
                                            fontSize: isActive ? 14 : 13,
                                            fontWeight: isActive ? 800 : 600,
                                            color: isActive
                                                ? "#4c1d95"
                                                : "#1f2937",
                                            letterSpacing: isActive
                                                ? 0.2
                                                : undefined,
                                        }}
                                        ellipsis={{ tooltip: name }}
                                    >
                                        {name}
                                    </Typography.Text>
                                    <SyncStatusComp
                                        syncStatus={trackedEntity.syncStatus}
                                    />
                                </Flex>
                                <Typography.Text
                                    style={{
                                        fontSize: 11,
                                        lineHeight: 1.2,
                                        color: isActive ? "#6d28d9" : "#4b5563",
                                        fontWeight: isActive ? 600 : 500,
                                    }}
                                >
                                    {dob}
                                </Typography.Text>
                            </Flex>
                        ),
                        destroyOnHidden: true,
                        children: (
                            <Relation
                                key={trackedEntity.trackedEntity}
                                section={section}
                                mainEvent={mainEvent}
                                trackedEntity={trackedEntity}
                            />
                        ),
                    };
                })}
                onChange={onChange}
                activeKey={activeKey}
            />
        </Flex>
    );
}
