import type { TrackedEntity } from "../schemas";
import { FetchError } from "@dhis2/app-runtime";
import { classifyFetchError } from "./network-reachability";

/**
 * The one `sync.pullData` log line per pull attempt (IMPLEMENTATION_PLAN
 * R8) — wayfinder ticket "What does the sync.pullData log line record?
 * (Phase 2)". `mode` is what was actually SENT (with or without
 * `updatedAfter`), so an accidental full pull is visible at a glance.
 * Counts only — never record contents or ids.
 */
export interface PullDataSummary {
    outcome: "ok" | "offline" | "error";
    error?: string;
    mode: "incremental" | "full";
    /** The stored checkpoint the pull started from. */
    checkpointFrom: string | null;
    /** What was actually sent — `checkpointFrom` minus the overlap window. */
    updatedAfter: string | null;
    checkpointTo: string | null;
    serverTotal?: number;
    fetched: { trackedEntities: number; enrollments: number; events: number };
    pages: number;
    pageSize: number;
    durationMs: number;
}

/** Adds one page's tracked entities, and the enrollments/events nested in them, to `fetched`. */
export function countFetched(
    fetched: PullDataSummary["fetched"],
    page: Pick<TrackedEntity, "enrollments">[],
): void {
    fetched.trackedEntities += page.length;
    for (const te of page) {
        for (const enrollment of te.enrollments ?? []) {
            fetched.enrollments += 1;
            fetched.events += enrollment.events?.length ?? 0;
        }
    }
}

/**
 * A DHIS2 network failure is "offline" (same rule as the connectivity
 * indicator); anything else — timeouts, access, 5xx, or a local bug such
 * as a storage error — is "error". `classifyFetchError` alone would call
 * every non-FetchError "network", mislabelling local failures as offline.
 */
export function pullFailureOutcome(error: unknown): "offline" | "error" {
    return error instanceof FetchError && classifyFetchError(error) === "network"
        ? "offline"
        : "error";
}

export function logPullData(summary: PullDataSummary): void {
    console.info("sync.pullData", summary);
}
