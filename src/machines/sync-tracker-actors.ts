import type { useDataEngine } from "@dhis2/app-runtime";
import {
    isDhis2Reachable,
    toConnectivityStatus,
    type ConnectivityStatus,
} from "./network-reachability";
import {
    transformEnrollment,
    transformEvent,
    transformTrackedEntity,
} from "../db/transformers";
import type { SqlDriver } from "../db/sqlite/driver-types";
import {
    deleteEnrollmentCascade,
    deleteEventCascade,
    deleteTrackedEntityCascade,
} from "../db/sqlite/delete-cascade";
import {
    applyPushResults,
    type PushResultUpdate,
} from "../db/sqlite/push-results";
import { findEnrollmentsBySyncStatusIn } from "../db/sqlite/row-adapters/enrollments";
import { findEventsBySyncStatusIn } from "../db/sqlite/row-adapters/events";
import { findTrackedEntitiesBySyncStatusIn } from "../db/sqlite/row-adapters/tracked-entities";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "../db/sqlite/tracker-collections-instance";
import {
    DataElement,
    Dhis2Report,
    Enrollment,
    Event,
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedOptionSet,
    FlattenedTrackedEntity,
    TrackedEntity,
    TrackedEntityAttribute,
    Engine,
} from "../schemas";

/**
 * SQL-touching bodies for `src/machines/sync.ts`'s tracker push/delete/batch
 * actors, extracted for the same reason Phase 1's `sync-metadata-actors.ts`
 * extracted the metadata ones: `sync.ts` is explicitly load-bearing/fragile
 * per root `CLAUDE.md`, and this keeps the new SQL logic testable without
 * spinning up the whole XState machine. `syncReportToLocal`/
 * `syncDeleteToLocal` are moved here near-verbatim from `sync.ts` (same
 * business logic — reachability checks, tracker-import payload
 * construction, error-report parsing, the E1082/E1113/E1114
 * already-deleted special-casing) with only the local write-back step
 * (step 7) swapped from Dexie collection calls to the SQLite equivalents.
 */

type SyncSubResult = {
    succeeded: number;
    failed: number;
    connectivityStatus?: ConnectivityStatus;
};
type SyncUpsertResult = SyncSubResult & { processed: number };

async function submitTrackerImportAndWaitForReport({
    engine,
    data,
    params,
}: {
    engine: Engine;
    data: any;
    params: Record<string, any>;
}): Promise<Dhis2Report> {
    return (await engine.mutate({
        resource: "tracker",
        type: "create",
        data,
        params: { ...params, async: false },
    })) as unknown as Dhis2Report;
}

export async function syncReportToLocal({
    entities,
    engine,
    sqlDriver,
    validAttributeIds,
    validDataElementsByStage,
    dataElements,
    trackedEntityAttributes,
    optionSets,
}: {
    entities: Array<
        FlattenedTrackedEntity | FlattenedEnrollment | FlattenedEvent
    >;
    engine: Engine;
    sqlDriver: SqlDriver;
    validAttributeIds: Set<string>;
    validDataElementsByStage: Map<string, Set<string>>;
    dataElements: Map<string, DataElement> | undefined;
    trackedEntityAttributes: Map<string, TrackedEntityAttribute> | undefined;
    optionSets: Map<string, FlattenedOptionSet[]> | undefined;
}): Promise<SyncUpsertResult> {
    const reachability = await isDhis2Reachable(engine);
    if (!reachability.reachable) {
        return {
            processed: 0,
            succeeded: 0,
            failed: 0,
            connectivityStatus: toConnectivityStatus(reachability),
        };
    }

    const payload = entities.reduce<{
        trackedEntities: TrackedEntity[];
        enrollments: Enrollment[];
        events: Event[];
    }>(
        (acc, entity) => {
            if ("trackedEntityType" in entity) {
                acc.trackedEntities.push(
                    transformTrackedEntity(
                        entity,
                        validAttributeIds,
                        trackedEntityAttributes,
                        optionSets,
                    ),
                );
            } else if ("enrolledAt" in entity) {
                acc.enrollments.push(
                    transformEnrollment(
                        entity,
                        validAttributeIds,
                        trackedEntityAttributes,
                        optionSets,
                    ),
                );
            } else if ("event" in entity) {
                const stageIds =
                    validDataElementsByStage.get(entity.programStage) ??
                    new Set<string>();
                acc.events.push(
                    transformEvent(entity, stageIds, dataElements, optionSets),
                );
            }
            return acc;
        },
        { trackedEntities: [], enrollments: [], events: [] },
    );
    const response = await submitTrackerImportAndWaitForReport({
        engine,
        data: payload,
        params: {
            importStrategy: "CREATE_AND_UPDATE",
            atomicMode: "OBJECT",
            skipPatternValidation: "true",
            skipSideEffects: "true",
        },
    });
    const failedResponses = new Map<string, string>();
    for (const err of response.validationReport.errorReports) {
        const line = err.errorCode
            ? `[${err.errorCode}] ${err.message}`
            : err.message;
        const existing = failedResponses.get(err.uid);
        failedResponses.set(err.uid, existing ? `${existing}\n${line}` : line);
    }

    const syncedEvents = new Set(
        response.bundleReport.typeReportMap.EVENT.objectReports.map(
            (a) => a.uid,
        ),
    );
    const syncedEnrollments = new Set(
        response.bundleReport.typeReportMap.ENROLLMENT.objectReports.map(
            (a) => a.uid,
        ),
    );
    const syncedEntities = new Set(
        response.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports.map(
            (a) => a.uid,
        ),
    );

    const updatedEntities: FlattenedTrackedEntity[] = entities.flatMap((a) => {
        if ("trackedEntityType" in a && failedResponses.has(a.trackedEntity)) {
            return {
                ...a,
                syncStatus: "failed",
                lastSynced: new Date().toISOString(),
                syncError: failedResponses.get(a.trackedEntity),
            };
        } else if (
            "trackedEntityType" in a &&
            syncedEntities.has(a.trackedEntity)
        ) {
            return {
                ...a,
                syncStatus: "synced",
                lastSynced: new Date().toISOString(),
                syncError: null,
            };
        }
        return [];
    });

    const updatedEnrolments: FlattenedEnrollment[] = entities.flatMap((a) => {
        if ("enrolledAt" in a && failedResponses.has(a.enrollment)) {
            return {
                ...a,
                syncStatus: "failed",
                lastSynced: new Date().toISOString(),
                syncError: failedResponses.get(a.enrollment),
            };
        } else if ("enrolledAt" in a && syncedEnrollments.has(a.enrollment)) {
            return {
                ...a,
                syncStatus: "synced",
                lastSynced: new Date().toISOString(),
                syncError: null,
            };
        }
        return [];
    });

    const updatedEvents: FlattenedEvent[] = entities.flatMap((a) => {
        if ("event" in a && failedResponses.has(a.event)) {
            return {
                ...a,
                syncStatus: "failed",
                lastSynced: new Date().toISOString(),
                syncError: failedResponses.get(a.event),
            };
        } else if ("event" in a && syncedEvents.has(a.event)) {
            return {
                ...a,
                syncStatus: "synced",
                lastSynced: new Date().toISOString(),
                syncError: null,
            };
        }
        return [];
    });

    function toUpdate<
        T extends { syncStatus: string; syncError?: string | null },
    >(rows: T[], getKey: (r: T) => string): PushResultUpdate[] {
        return rows.map((r) => ({
            key: getKey(r),
            syncStatus: r.syncStatus as "synced" | "failed",
            syncError: r.syncError ?? null,
        }));
    }

    // ONE atomic transaction across all three tables (push-results.ts) —
    // real correctness improvement over 3 separate Dexie writes. Bypasses
    // the collection adapters' own write path, so each touched collection
    // needs an explicit refresh() to pick the change back up.
    await applyPushResults(sqlDriver, {
        trackedEntities: toUpdate(updatedEntities, (r) => r.trackedEntity),
        enrollments: toUpdate(updatedEnrolments, (r) => r.enrollment),
        events: toUpdate(updatedEvents, (r) => r.event),
    });
    await Promise.all([
        getTrackedEntitiesCollection().utils.refresh(),
        getEnrollmentsCollection().utils.refresh(),
        getEventsCollection().utils.refresh(),
    ]);

    return {
        processed: entities.length,
        succeeded:
            syncedEntities.size + syncedEnrollments.size + syncedEvents.size,
        failed: failedResponses.size,
        connectivityStatus: "healthy" as const,
    };
}

export async function syncDeleteToLocal({
    deletedEvents,
    deletedTrackedEntities,
    deletedEnrollments,
    engine,
    sqlDriver,
}: {
    deletedEvents: FlattenedEvent[];
    deletedTrackedEntities: FlattenedTrackedEntity[];
    deletedEnrollments: FlattenedEnrollment[];
    engine: Engine;
    sqlDriver: SqlDriver;
}): Promise<SyncSubResult> {
    const hasAnything =
        deletedEvents.length > 0 ||
        deletedTrackedEntities.length > 0 ||
        deletedEnrollments.length > 0;
    if (!hasAnything) return { succeeded: 0, failed: 0 };

    const reachability = await isDhis2Reachable(engine);
    if (!reachability.reachable) {
        return {
            succeeded: 0,
            failed: 0,
            connectivityStatus: toConnectivityStatus(reachability),
        };
    }

    const deletedTeIds = new Set(
        deletedTrackedEntities.map((te) => te.trackedEntity),
    );

    const payload: Record<string, unknown> = {};
    if (deletedTrackedEntities.length > 0) {
        payload.trackedEntities = deletedTrackedEntities.map((te) => ({
            trackedEntity: te.trackedEntity,
        }));
    }
    if (deletedEnrollments.length > 0) {
        payload.enrollments = deletedEnrollments
            .filter((e) => !deletedTeIds.has(e.trackedEntity))
            .map((e) => ({ enrollment: e.enrollment }));
    }
    if (deletedEvents.length > 0) {
        payload.events = deletedEvents
            .filter((e) => !deletedTeIds.has(e.trackedEntity))
            .map((e) => ({ event: e.event }));
    }

    const response = await submitTrackerImportAndWaitForReport({
        engine,
        data: payload,
        params: { importStrategy: "DELETE", atomicMode: "OBJECT" },
    });

    // E1114 = TE already deleted, E1082 = Event already deleted, E1113 = Enrollment already deleted
    const ALREADY_DELETED_CODES = new Set(["E1082", "E1113", "E1114"]);

    const cleanupTeUids = new Set(
        response.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports.map(
            (r) => r.uid,
        ),
    );
    const cleanupEnrollmentUids = new Set(
        response.bundleReport.typeReportMap.ENROLLMENT.objectReports.map(
            (r) => r.uid,
        ),
    );
    const cleanupEventUids = new Set(
        response.bundleReport.typeReportMap.EVENT.objectReports.map(
            (r) => r.uid,
        ),
    );

    let realFailures = 0;
    for (const err of response.validationReport.errorReports) {
        if (ALREADY_DELETED_CODES.has(err.errorCode)) {
            if (err.trackerType === "TRACKED_ENTITY")
                cleanupTeUids.add(err.uid);
            else if (err.trackerType === "ENROLLMENT")
                cleanupEnrollmentUids.add(err.uid);
            else if (err.trackerType === "EVENT") cleanupEventUids.add(err.uid);
        } else {
            realFailures++;
        }
    }

    // Atomic cascading deletes (delete-cascade.ts) — each call handles its
    // own whole subtree in one transaction, so no pre-fetch of children is
    // needed here (unlike utils.ts's recursive soft/hard-delete walk, which
    // needs to inspect each child individually).
    let touchedTE = false;
    let touchedEnrollment = false;
    let touchedEvent = false;

    for (const te of deletedTrackedEntities) {
        if (cleanupTeUids.has(te.trackedEntity)) {
            await deleteTrackedEntityCascade(sqlDriver, te.trackedEntity);
            touchedTE = touchedEnrollment = touchedEvent = true;
        }
    }

    for (const enrollment of deletedEnrollments) {
        if (
            cleanupEnrollmentUids.has(enrollment.enrollment) &&
            !deletedTeIds.has(enrollment.trackedEntity)
        ) {
            await deleteEnrollmentCascade(sqlDriver, enrollment.enrollment);
            touchedEnrollment = touchedEvent = true;
        }
    }

    for (const event of deletedEvents) {
        if (
            cleanupEventUids.has(event.event) &&
            !deletedTeIds.has(event.trackedEntity)
        ) {
            await deleteEventCascade(sqlDriver, event.event);
            touchedEvent = true;
        }
    }

    await Promise.all([
        touchedTE ? getTrackedEntitiesCollection().utils.refresh() : null,
        touchedEnrollment ? getEnrollmentsCollection().utils.refresh() : null,
        touchedEvent ? getEventsCollection().utils.refresh() : null,
    ]);

    return {
        succeeded:
            cleanupTeUids.size +
            cleanupEnrollmentUids.size +
            cleanupEventUids.size,
        failed: realFailures,
        connectivityStatus: "healthy" as const,
    };
}

export async function processBatchSync(input: {
    sqlDriver: SqlDriver;
    engine: Engine;
    validAttributeIds: Set<string>;
    validDataElementsByStage: Map<string, Set<string>>;
    dataElements: Map<string, DataElement> | undefined;
    trackedEntityAttributes: Map<string, TrackedEntityAttribute> | undefined;
    optionSets: Map<string, FlattenedOptionSet[]> | undefined;
}): Promise<SyncUpsertResult> {
    const {
        sqlDriver,
        engine,
        validAttributeIds,
        validDataElementsByStage,
        dataElements,
        trackedEntityAttributes,
        optionSets,
    } = input;

    const [
        pendingTEs,
        pendingEnrollmentsRaw,
        pendingEventsRaw,
        deletedTEs,
        deletedEnrollments,
        deletedEvents,
    ] = await Promise.all([
        findTrackedEntitiesBySyncStatusIn(sqlDriver, ["pending", "failed"]),
        findEnrollmentsBySyncStatusIn(sqlDriver, ["pending", "failed"]),
        findEventsBySyncStatusIn(sqlDriver, ["pending", "failed"]),
        findTrackedEntitiesBySyncStatusIn(sqlDriver, ["deleted"]),
        findEnrollmentsBySyncStatusIn(sqlDriver, ["deleted"]),
        findEventsBySyncStatusIn(sqlDriver, ["deleted"]),
    ]);
    const pendingEnrollments = pendingEnrollmentsRaw.filter(
        (e) => !!e.enrolledAt,
    );
    const pendingEvents = pendingEventsRaw.filter((e) => !!e.occurredAt);

    if (
        pendingTEs.length === 0 &&
        pendingEnrollments.length === 0 &&
        pendingEvents.length === 0 &&
        deletedEvents.length === 0 &&
        deletedTEs.length === 0 &&
        deletedEnrollments.length === 0
    ) {
        return { processed: 0, succeeded: 0, failed: 0 };
    }

    let upsertResult: SyncUpsertResult = {
        processed: 0,
        succeeded: 0,
        failed: 0,
    };
    if (
        pendingTEs.length > 0 ||
        pendingEnrollments.length > 0 ||
        pendingEvents.length > 0
    ) {
        upsertResult = await syncReportToLocal({
            entities: [...pendingTEs, ...pendingEnrollments, ...pendingEvents],
            engine,
            sqlDriver,
            validAttributeIds,
            validDataElementsByStage,
            dataElements,
            trackedEntityAttributes,
            optionSets,
        });
    }

    let deleteResult: SyncSubResult = { succeeded: 0, failed: 0 };
    if (
        deletedEvents.length > 0 ||
        deletedTEs.length > 0 ||
        deletedEnrollments.length > 0
    ) {
        deleteResult = await syncDeleteToLocal({
            deletedEvents,
            deletedTrackedEntities: deletedTEs,
            deletedEnrollments,
            engine,
            sqlDriver,
        });
    }

    return {
        processed:
            upsertResult.processed +
            deleteResult.succeeded +
            deleteResult.failed,
        succeeded: upsertResult.succeeded + deleteResult.succeeded,
        failed: upsertResult.failed + deleteResult.failed,
        connectivityStatus:
            deleteResult.connectivityStatus ?? upsertResult.connectivityStatus,
    };
}
