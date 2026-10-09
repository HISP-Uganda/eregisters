import { Flex, Grid, Splitter, Typography } from "antd";
import React, { useCallback, useMemo, useRef } from "react";
import { useModalState } from "@/hooks/useModalState";
import { SyncContext } from "@/machines/sync";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "@/schemas";
import { createVisit, deleteClient, deleteVisit, resendVisit } from "./actions";
import { clientForEditing } from "./client";
import { ClientHeader } from "./client-header";
import { ClientModal } from "./client-modal";
import { ProfilePanel } from "./profile-panel";
import { useClientRecords } from "./use-client-records";
import { useFormMetadata } from "./use-form-metadata";
import { ClientSearch, useModalsFromSearch } from "./use-modals-from-search";
import { VisitModal } from "./visit-modal";
import { VisitsCard, visitsTableKey } from "./visits-card";

type ScreenProps = {
    tei: string;
    search: ClientSearch;
    /** A visit or client form closed: drop `?event`/`?edit` (or go back to analytics). */
    onModalClosed: () => void;
    /** Leave for the client list. */
    onBack: () => void;
};

/** One client's page: header, visits, profile, and the visit/client forms. */
export function TrackedEntityScreen(props: ScreenProps) {
    const { trackedEntity, enrollment, visits, allEnrollmentEvents } =
        useClientRecords(props.tei);

    // The client can disappear while open (deleted here or by a sync), so
    // "not found" is decided before any hook of the client view runs.
    if (trackedEntity === undefined || enrollment === undefined) {
        return <Typography.Text>No tracked Entity or Enrollment found</Typography.Text>;
    }
    return (
        <ClientView
            {...props}
            trackedEntity={trackedEntity}
            enrollment={enrollment}
            visits={visits}
            allEnrollmentEvents={allEnrollmentEvents}
        />
    );
}

function ClientView({
    search,
    onModalClosed,
    onBack,
    trackedEntity,
    enrollment,
    visits,
    allEnrollmentEvents,
}: ScreenProps & {
    trackedEntity: FlattenedTrackedEntity;
    enrollment: FlattenedEnrollment;
    visits: FlattenedEvent[];
    allEnrollmentEvents: FlattenedEvent[];
}) {
    const syncActor = SyncContext.useActorRef();
    const pushData = useCallback(() => syncActor.send({ type: "PUSH_DATA" }), [syncActor]);
    const { teaLabels } = useFormMetadata();
    const isMobile = !Grid.useBreakpoint().lg;
    const visitModal = useModalState<FlattenedEvent>();
    const clientModal = useModalState<FlattenedTrackedEntity>();

    useModalsFromSearch({
        search,
        trackedEntity,
        enrollment,
        allEnrollmentEvents,
        openVisit: visitModal.openModal,
        openClient: clientModal.openModal,
    });

    const { openModal: openVisitModal } = visitModal;
    // The table re-renders only when what it shows changes (an open visit
    // autosaves on every change), so its rows can be older than the stored
    // visits: open the latest one.
    const latestVisits = useRef(visits);
    latestVisits.current = visits;
    const tableKey = visitsTableKey(visits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tableVisits = useMemo(() => visits, [tableKey]);
    const openVisit = useCallback(
        (visit: FlattenedEvent) =>
            openVisitModal(latestVisits.current.find((v) => v.event === visit.event) ?? visit, enrollment),
        [openVisitModal, enrollment],
    );
    const addVisit = useCallback(async () => {
        const visit = await createVisit(trackedEntity, enrollment);
        openVisitModal(visit, enrollment, true);
    }, [trackedEntity, enrollment, openVisitModal]);
    const resend = useCallback((visit: FlattenedEvent) => resendVisit(visit.event, pushData), [pushData]);
    const remove = useCallback((visit: FlattenedEvent) => deleteVisit(visit.event, pushData), [pushData]);

    const visitsCard = (
        <VisitsCard
            visits={tableVisits}
            onOpen={openVisit}
            onResend={resend}
            onDelete={remove}
            onAdd={addVisit}
        />
    );
    const profilePanel = (
        <ProfilePanel
            trackedEntity={trackedEntity}
            enrollment={enrollment}
            labels={teaLabels}
            onEdit={() =>
                clientModal.openModal(clientForEditing(trackedEntity, enrollment), enrollment)
            }
            onDelete={async () => {
                if (await deleteClient(trackedEntity.trackedEntity, pushData)) onBack();
            }}
        />
    );

    return (
        <Flex style={{ padding: "8px 0" }} vertical gap={5}>
            <ClientHeader trackedEntity={trackedEntity} isMobile={isMobile} onBack={onBack} />

            {isMobile ? (
                <Flex vertical gap={16} style={{ padding: 10, overflow: "auto" }}>
                    {profilePanel}
                    {visitsCard}
                </Flex>
            ) : (
                <Splitter style={{ height: "calc(100vh - 181px)" }}>
                    <Splitter.Panel style={{ padding: "0 10px" }}>{visitsCard}</Splitter.Panel>
                    <Splitter.Panel
                        defaultSize="25%"
                        style={{ padding: "0 10px" }}
                        collapsible={{ start: true, end: true, showCollapsibleIcon: true }}
                    >
                        {profilePanel}
                    </Splitter.Panel>
                </Splitter>
            )}

            <VisitModal
                visit={visitModal.data}
                isOpen={visitModal.isOpen}
                isNew={visitModal.isNew}
                onClose={() => {
                    visitModal.closeModal();
                    onModalClosed();
                }}
                trackedEntity={trackedEntity}
                enrollment={enrollment}
                allEnrollmentEvents={allEnrollmentEvents}
            />
            <ClientModal
                client={clientModal.data}
                isOpen={clientModal.isOpen}
                onClose={() => {
                    clientModal.closeModal();
                    onModalClosed();
                }}
                enrollment={enrollment}
            />
        </Flex>
    );
}
