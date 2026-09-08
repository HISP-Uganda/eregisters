import { FetchError } from "@dhis2/app-runtime";
import type { useDataEngine } from "@dhis2/app-runtime";

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
    engine: ReturnType<typeof useDataEngine>,
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
