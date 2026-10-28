import { and, eq, not, useLiveQuery } from "@tanstack/react-db";
import dayjs from "dayjs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getEventsCollection, getTrackedEntitiesCollection, readQuickVisitSummaries } from "@/db/collections";
import { useCollectionReady } from "@/hooks/useCollectionReady";
import { useMetadata } from "@/hooks/useMetadata";
import type { FlattenedTrackedEntity } from "@/schemas";
import { MAIN_STAGE } from "@/screens/tracked-entity/client";

/** The client lists a stats card opens in place of the search results. */
export const CLIENT_LISTS = ["all", "registeredToday", "visitsToday"] as const;
export type ClientList = (typeof CLIENT_LISTS)[number];

export const CLIENT_LIST_TITLES: Record<ClientList, string> = {
    all: "Total Clients",
    registeredToday: "Registered Today",
    visitsToday: "Visits Today",
};

/** A date's time in ms; date-only values are local midnight, as dayjs reads them. NaN if unreadable. */
function timeOf(date: string | undefined) {
    if (!date) return NaN;
    return Date.parse(date.length === 10 ? `${date}T00:00:00` : date);
}

/** Each card's colour, carried into the table when its list is shown. */
export const CLIENT_LIST_COLORS: Record<ClientList, string> = {
    all: "#1f4788",
    registeredToday: "#52c41a",
    visitsToday: "#08979c",
};

/** Whether `date` falls on the local day `day` (`YYYY-MM-DD`). */
export function isOnDay(date: string | undefined, day: string) {
    return onDay(day)(date);
}

/** A test for the local day `day`, built once for many dates. */
function onDay(day: string) {
    const start = timeOf(day);
    const end = dayjs(day).add(1, "day").valueOf();
    return (date: string | undefined) => {
        const at = timeOf(date);
        return at >= start && at < end;
    };
}

/** Clients registered on `day`. */
export function registeredOn(clients: FlattenedTrackedEntity[], day: string) {
    const test = onDay(day);
    return clients.filter((client) => test(client.createdAt));
}

/** Clients with a visit whose Visit Date is `day`: each client once, however many visits. */
export function visitedOn(
    clients: FlattenedTrackedEntity[],
    visits: Visit[],
    day: string,
) {
    const test = onDay(day);
    const visited = new Set(visits.filter((visit) => test(visit.occurredAt)).map((v) => v.trackedEntity));
    return clients.filter((client) => visited.has(client.trackedEntity));
}

type Visit = { trackedEntity: string; occurredAt: string; createdAt?: string; createdAtClient?: string };

/**
 * Each client's Last Visit: when their most recently created visit was
 * created (the device's time, else the server's; a visit with neither
 * falls back to its Visit Date). `at` is that time, for sorting.
 */
export function latestVisits(visits: Visit[]) {
    const latest = new Map<string, { at: number; date: string }>();
    for (const visit of visits) {
        const created = visit.createdAtClient || visit.createdAt;
        const date = created && !Number.isNaN(timeOf(created)) ? created : visit.occurredAt;
        const at = timeOf(date);
        if (Number.isNaN(at)) continue;
        const current = latest.get(visit.trackedEntity);
        if (!current || at > current.at) latest.set(visit.trackedEntity, { at, date });
    }
    return latest;
}

export type LastVisits = ReturnType<typeof latestVisits>;

/** Clients by most recent Last Visit first; those never visited last, in their existing order. */
export function byLastVisit(clients: FlattenedTrackedEntity[], lastVisits: LastVisits) {
    const at = (client: FlattenedTrackedEntity) => lastVisits.get(client.trackedEntity)?.at ?? -Infinity;
    return [...clients].sort((a, b) => {
        const diff = at(b) - at(a);
        return Number.isNaN(diff) ? 0 : diff;
    });
}

export interface ClientLists {
    /** Each list sorted by most recent Last Visit. */
    lists: Record<ClientList, FlattenedTrackedEntity[]>;
    lastVisits: LastVisits;
    /** Clients are still loading into memory. */
    loading: boolean;
    /** Visits are still loading (they start once clients have). */
    visitsLoading: boolean;
    /** Card counts, available from the quick visit read before the lists are. */
    counts: Record<ClientList, number | undefined>;
}

/**
 * This facility's clients (not drafts, not deleted) and the card lists
 * drawn from them. Non-suspending. Visits are queried only once clients
 * have loaded, so the client list isn't competing with them.
 */
export function useClientListsSource(): ClientLists {
    const { orgUnit } = useMetadata();
    const trackedEntities = getTrackedEntitiesCollection();
    const events = getEventsCollection();
    const clientsReady = useCollectionReady(trackedEntities);

    const { data: clients = [], isLoading: loading } = useLiveQuery(
        (q) =>
            q
                .from({ trackedEntity: trackedEntities })
                .where(({ trackedEntity }) =>
                    and(
                        not(eq(trackedEntity.syncStatus, "draft")),
                        not(eq(trackedEntity.syncStatus, "deleted")),
                        eq(trackedEntity.orgUnit, orgUnit),
                    ),
                ),
        [orgUnit],
    );
    // A quick read of the facility's visits from storage, used until the
    // events collection has loaded them all (it starts once clients have).
    const [quickVisits, setQuickVisits] = useState<Visit[] | undefined>();
    useEffect(() => {
        let active = true;
        const read = readQuickVisitSummaries(MAIN_STAGE, orgUnit);
        if (!read) return;
        read.then(
            (rows) => active && setQuickVisits(rows),
            () => undefined, // the collection still loads them
        );
        return () => {
            active = false;
        };
    }, [orgUnit]);
    const eventsReady = useCollectionReady(events);

    const { data: liveVisits = [], isLoading: visitsQueryLoading } = useLiveQuery(
        (q) =>
            clientsReady
                ? q
                      .from({ event: events })
                      .where(({ event }) =>
                          and(
                              eq(event.programStage, MAIN_STAGE),
                              not(eq(event.syncStatus, "draft")),
                              not(eq(event.syncStatus, "deleted")),
                          ),
                      )
                      .select(({ event }) => ({
                          trackedEntity: event.trackedEntity,
                          occurredAt: event.occurredAt,
                          createdAt: event.createdAt,
                          createdAtClient: event.createdAtClient,
                      }))
                : undefined,
        [clientsReady],
    );

    const liveReady = clientsReady && eventsReady && !visitsQueryLoading;
    const visits = liveReady || !quickVisits ? liveVisits : quickVisits;

    const today = dayjs().format("YYYY-MM-DD");
    const lastVisits = useMemo(() => latestVisits(visits), [visits]);
    const lists = useMemo(() => {
        const all = byLastVisit(clients, lastVisits);
        return {
            all,
            registeredToday: registeredOn(all, today),
            visitsToday: visitedOn(all, visits, today),
        };
    }, [clients, visits, lastVisits, today]);
    const visitsLoading = loading || (!liveReady && !quickVisits);
    const counts = {
        all: loading ? undefined : lists.all.length,
        registeredToday: loading ? undefined : lists.registeredToday.length,
        visitsToday: !visitsLoading
            ? lists.visitsToday.length
            : quickVisits
              ? new Set(quickVisits.filter((v) => isOnDay(v.occurredAt, today)).map((v) => v.trackedEntity)).size
              : undefined,
    };
    return { lists, lastVisits, loading, visitsLoading, counts };
}

export const ClientListsContext = createContext<ClientLists | null>(null);

/** The card lists, from the clients page that provides them. */
export function useClientLists(): ClientLists {
    const lists = useContext(ClientListsContext);
    if (!lists) throw new Error("useClientLists needs ClientListsContext");
    return lists;
}
