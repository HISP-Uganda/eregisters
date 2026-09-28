import { FetchError } from "@dhis2/app-runtime";
import { Engine } from "../schemas";

export const PING_TIMEOUT_MS = 5000;

export type ReachabilityFailureReason =
    | "timeout"
    | "network"
    | "server-error"
    | "access";

export type ReachabilityResult =
    | { reachable: true }
    | { reachable: false; reason: ReachabilityFailureReason };

export type ConnectivityStatus = "healthy" | "degraded" | "offline";

/**
 * @dhis2/data-engine's fetchData always throws FetchError with type:'network'
 * for a rejected fetch — including one we abort ourselves — with the raw
 * caught error preserved in `details`. There is no other way to tell "we
 * gave up waiting" apart from "the connection is actually down".
 */
export async function withAbortTimeout<T>(
    timeoutMs: number,
    fn: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fn(controller.signal);
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Per-call time limits for the sync code's DHIS2 requests — wayfinder
 * ticket "Apply withAbortTimeout to the remaining unprotected sync calls".
 * The data engine buffers the whole response, so these bound total time,
 * not inactivity: each is generous enough for its payload on a slow rural
 * link, and only exists so a hung server can't block sync (and, since the
 * cross-tab sync locks, every tab's sync) forever. A timeout surfaces as a
 * normal failure — `classifyFetchError` calls it "timeout".
 */
export const SYNC_TIMEOUTS_MS = {
    /** Small reads: system/info, dataStore config, org unit, data sets. */
    probe: 30_000,
    /** One tracker pull page (tracked entities with enrollments/events). */
    pullPage: 60_000,
    /** Whole metadata collections (option sets, rules, …): can be megabytes. */
    bulkMetadata: 180_000,
    /**
     * The tracker import POST carrying every pending row. Aborting it may
     * leave the server to commit anyway; the rows stay pending and the next
     * push re-sends them (CREATE_AND_UPDATE by UID), so nothing is lost.
     */
    trackerImport: 300_000,
} as const;

type EngineQuery = Parameters<Engine["query"]>[0];
type EngineMutation = Parameters<Engine["mutate"]>[0];

export function queryWithTimeout(
    engine: Engine,
    query: EngineQuery,
    timeoutMs: number,
): ReturnType<Engine["query"]> {
    return withAbortTimeout(timeoutMs, (signal) =>
        engine.query(query, { signal }),
    );
}

export function mutateWithTimeout(
    engine: Engine,
    mutation: EngineMutation,
    timeoutMs: number,
): ReturnType<Engine["mutate"]> {
    return withAbortTimeout(timeoutMs, (signal) =>
        engine.mutate(mutation, { signal }),
    );
}

export function classifyFetchError(error: unknown): ReachabilityFailureReason {
    if (error instanceof FetchError) {
        if (error.type === "access") {
            return "access";
        }
        if (error.type === "network") {
            const details = error.details as { name?: string } | undefined;
            return details?.name === "AbortError" ? "timeout" : "network";
        }
        return "server-error";
    }
    return "network";
}

export function toConnectivityStatus(
    result: ReachabilityResult,
): ConnectivityStatus {
    if (result.reachable) {
        return "healthy";
    }
    return result.reason === "network" ? "offline" : "degraded";
}

export async function isDhis2Reachable(
    engine: Engine,
): Promise<ReachabilityResult> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return { reachable: false, reason: "network" };
    }

    try {
        await withAbortTimeout(PING_TIMEOUT_MS, (signal) =>
            engine.query(
                { ping: { resource: "me", params: { fields: "id" } } },
                { signal },
            ),
        );
        return { reachable: true };
    } catch (error) {
        return { reachable: false, reason: classifyFetchError(error) };
    }
}
