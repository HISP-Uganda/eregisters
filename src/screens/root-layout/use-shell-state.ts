import { eq, or, useLiveSuspenseQuery } from "@tanstack/react-db";
import { useEffect, useMemo, useState } from "react";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "../../db/collections";
import { useUIConfig } from "../../hooks/useUIConfig";
import { SyncContext } from "../../machines/sync";
import {
    isDataPullLoading,
    isDataPushLoading,
    isMetadataSyncLoading,
} from "../../machines/sync-metadata-mode";
import { shouldShowMetadataReload } from "../../utils/reload-signals";
import { parseServerTime } from "../../utils/server-time";

/** What the header shows about syncing: what's running, when each last ran, who may do what. */
export function useSyncStatus() {
    const syncingMetadata = SyncContext.useSelector((snapshot) =>
        // `syncing` spans the whole flow: lock, pull, delete/save, configs.
        isMetadataSyncLoading(snapshot.matches({ metadataSync: "syncing" }), snapshot.context.lastMetadataPull),
    );
    // The whole pull flow — clearing the checkpoint for a re-download, the
    // pull, saving the new checkpoint — so Pull Data stays disabled until done.
    const syncingData = SyncContext.useSelector((snapshot) =>
        isDataPullLoading(
            snapshot.matches({ dataPull: "resettingCheckpoint" }) ||
                snapshot.matches({ dataPull: "syncing" }) ||
                snapshot.matches({ dataPull: "updateLastDataPull" }),
            snapshot.context.lastDataPull,
        ),
    );
    const pushingData = SyncContext.useSelector((snapshot) =>
        isDataPushLoading(snapshot.matches({ dataSync: "batchSync" })),
    );
    const lastDataPull = SyncContext.useSelector((a) => a.context.lastDataPull);
    const lastDataPush = SyncContext.useSelector((a) => a.context.lastDataPush);
    const lastMetadataPull = SyncContext.useSelector((a) => a.context.lastMetadataPull);
    const storageBackend = SyncContext.useSelector((snapshot) => snapshot.context.backend);
    const isAdmin = SyncContext.useSelector((a) => a.context.userInfo?.authorities?.includes("ALL"));
    const hasProgram = SyncContext.useSelector(
        (a) => a.context.userInfo.organisationUnits.flatMap((a) => a.programs).length > 0,
    );
    return {
        syncingMetadata,
        syncingData,
        pushingData,
        lastDataPull,
        lastDataPush,
        lastMetadataPull,
        storageBackend,
        isAdmin,
        hasProgram,
    };
}

/** Records waiting to be pushed (new, changed or deleted) and those whose push failed. */
export function useRecordsToSync() {
    const trackedEntities = getTrackedEntitiesCollection();
    const enrollments = getEnrollmentsCollection();
    const events = getEventsCollection();

    const { data: pendingTrackedEntities } = useLiveSuspenseQuery((q) =>
        q
            .from({ trackedEntities })
            .where(({ trackedEntities }) =>
                or(eq(trackedEntities.syncStatus, "pending"), eq(trackedEntities.syncStatus, "deleted")),
            ),
    );
    const { data: pendingEnrollments } = useLiveSuspenseQuery((q) =>
        q
            .from({ enrollments })
            .where(({ enrollments }) =>
                or(eq(enrollments.syncStatus, "pending"), eq(enrollments.syncStatus, "deleted")),
            ),
    );
    const { data: pendingEvents } = useLiveSuspenseQuery((q) =>
        q
            .from({ events })
            .where(({ events }) => or(eq(events.syncStatus, "pending"), eq(events.syncStatus, "deleted"))),
    );
    const { data: failedTrackedEntities } = useLiveSuspenseQuery((q) =>
        q.from({ trackedEntities }).where(({ trackedEntities }) => eq(trackedEntities.syncStatus, "failed")),
    );
    const { data: failedEnrollments } = useLiveSuspenseQuery((q) =>
        q.from({ enrollments }).where(({ enrollments }) => eq(enrollments.syncStatus, "failed")),
    );
    const { data: failedEvents } = useLiveSuspenseQuery((q) =>
        q.from({ events }).where(({ events }) => eq(events.syncStatus, "failed")),
    );

    return {
        pendingCount: pendingEnrollments.length + pendingEvents.length + pendingTrackedEntities.length,
        failedEvents,
        failedEnrollments,
        failedTrackedEntities,
    };
}

const LAST_SEEN_METADATA_SIGNAL = "eregisters.lastSeenMetadataSignal";

/**
 * The admin's "refresh metadata" broadcast, for a device that hasn't yet
 * synced since it was sent (see utils/reload-signals.ts). Re-checked every
 * minute. `dismiss` records it as seen so it doesn't come back.
 */
export function useMetadataReloadBanner(lastMetadataPull: string | undefined, serverTimeZoneId: string | undefined) {
    const uiConfig = useUIConfig();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const lastMetadataPullAt = lastMetadataPull
            ? parseServerTime(lastMetadataPull, serverTimeZoneId).toISOString()
            : undefined;
        function check() {
            setShow(
                shouldShowMetadataReload({
                    signalAt: uiConfig.reloadSignal.metadata?.timestamp,
                    lastSeen: localStorage.getItem(LAST_SEEN_METADATA_SIGNAL),
                    lastMetadataPullAt,
                }),
            );
        }
        check();
        const interval = setInterval(check, 60_000);
        return () => clearInterval(interval);
    }, [uiConfig.reloadSignal, lastMetadataPull, serverTimeZoneId]);

    const dismiss = () => {
        const ts = uiConfig.reloadSignal.metadata?.timestamp;
        if (ts) localStorage.setItem(LAST_SEEN_METADATA_SIGNAL, ts);
        setShow(false);
    };
    return { show, dismiss };
}

/** Tells the sync machine when the browser goes on- or offline. */
export function useConnectivityEvents() {
    const syncActor = SyncContext.useActorRef();
    useEffect(() => {
        const handleOnline = () => syncActor.send({ type: "NETWORK_RECONNECT" });
        const handleOffline = () => syncActor.send({ type: "SET_CONNECTIVITY_STATUS", status: "offline" });
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [syncActor]);
}

/** Program stage names by id. */
export function useStageNames(program: { programStages: Array<{ id: string; name: string }> } | undefined) {
    return useMemo(() => new Map((program?.programStages ?? []).map((s) => [s.id, s.name])), [program]);
}
