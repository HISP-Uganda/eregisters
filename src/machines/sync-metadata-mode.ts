export type MetadataSyncMode = "full" | "incremental";
export type DataPullMode = "full" | "incremental";
export type DataPushMode = "direct" | "batch";

export function shouldUseLastUpdatedFilter(
    mode: MetadataSyncMode,
    lastMetadataPull: string | undefined,
) {
    return mode === "incremental" && lastMetadataPull !== undefined;
}

export function isMetadataSyncLoading(
    isMetadataSyncActive: boolean,
    _lastMetadataPull: string | undefined,
) {
    return isMetadataSyncActive;
}

export function shouldUseLastDataPull(
    mode: DataPullMode,
    lastDataPull: string | undefined,
) {
    return mode === "incremental" && lastDataPull !== undefined;
}

/**
 * Reads the DHIS2 server clock out of a `system/info` response. This is the
 * value the Android SDK uses as the `updatedAfter` boundary for incremental
 * tracker pulls — the server date, never the device clock (see
 * `SystemInfoCall`/`TrackedEntityInstanceLastUpdatedManager` in the Android
 * SDK). Returns `undefined` when the response has no usable `serverDate` so
 * callers can keep the previous boundary rather than advancing with an
 * untrusted timestamp.
 */
export function extractServerDate(
    response: { info?: { serverDate?: string } } | undefined,
): string | undefined {
    const serverDate = response?.info?.serverDate;
    return typeof serverDate === "string" && serverDate.length > 0
        ? serverDate
        : undefined;
}

/**
 * Picks the boundary to persist after a successful incremental data pull. The
 * Android SDK captures the server date *before* the pull and stores it only
 * once the pull succeeds; if we could not read a server date we deliberately
 * keep the previous boundary instead of falling back to the device clock —
 * at worst the next pull re-fetches an overlap, but no server-side update is
 * ever skipped.
 */
export function resolveNextDataPull(
    serverDate: string | undefined,
    previousLastDataPull: string | undefined,
) {
    return serverDate ?? previousLastDataPull;
}

export function isDataPullLoading(
    isDataPullActive: boolean,
    _lastDataPull: string | undefined,
) {
    return isDataPullActive;
}

export function isDataPushLoading(isDataPushActive: boolean) {
    return isDataPushActive;
}

export function shouldRecordDataPush({ processed }: { processed: number }) {
    return processed > 0;
}

function extractTrackerJobId(response: unknown) {
    const value = response as {
        id?: string;
        location?: string;
        response?: {
            id?: string;
            location?: string;
        };
    };
    const id = value.response?.id ?? value.id;
    if (id) {
        return id;
    }

    const location = value.response?.location ?? value.location;
    const match = location?.match(/\/tracker\/jobs\/([^/?#]+)/);
    if (match?.[1]) {
        return match[1];
    }

    throw new Error("DHIS2 tracker async response did not include a job id");
}

function isTrackerJobComplete(jobLogs: unknown) {
    const logs = Array.isArray(jobLogs) ? jobLogs : [jobLogs];
    return logs.some((log) => {
        const value = log as {
            completed?: boolean;
            jobStatus?: string;
            status?: string;
            message?: string;
        };
        const status = value.status ?? value.jobStatus;
        return (
            value.completed === true ||
            status === "COMPLETED" ||
            status === "SUCCESS" ||
            value.message?.toLowerCase().includes("import complete") === true
        );
    });
}

export function shouldContinueDataPull({
    receivedCount,
    pageSize,
    pager,
}: {
    receivedCount: number;
    pageSize: number;
    pager?: {
        page?: number;
        pageSize?: number;
        pageCount?: number;
        total?: number;
        nextPage?: string;
    };
}) {
    if (receivedCount === 0) {
        return false;
    }

    if (pager) {
        if (pager.page !== undefined && pager.pageCount !== undefined) {
            return pager.page < pager.pageCount;
        }
        if (pager.total !== undefined && pager.page !== undefined) {
            const effectivePageSize = pager.pageSize ?? pageSize;
            return pager.page * effectivePageSize < pager.total;
        }
        return pager.nextPage !== undefined;
    }

    return receivedCount === pageSize;
}

/**
 * What a data checkpoint was taken for — the program and org unit the
 * pull was scoped to (wayfinder ticket "Retire Pull All Data behind an
 * admin \"Reset sync checkpoint\" (Phase 3)", Q2). A checkpoint for a
 * different scope says nothing about the current one: a user moved to a
 * new org unit must pull its full history, not only changes since the old
 * org unit's checkpoint.
 */
export function pullScopeKey(program: string, orgUnit: string): string {
    return `${program}:${orgUnit}`;
}

/**
 * The stored checkpoint, if it belongs to `scope`. Rows written before
 * scopes were recorded carry none and are trusted — forcing every device
 * into a full re-download on upgrade would be the very load this avoids.
 */
export function checkpointForScope(
    syncState: { lastPullAt?: string; pullScope?: string } | undefined,
    scope: string,
): string | undefined {
    if (!syncState?.lastPullAt) return undefined;
    if (syncState.pullScope !== undefined && syncState.pullScope !== scope) {
        return undefined;
    }
    return syncState.lastPullAt;
}

/** How far before the stored checkpoint each incremental pull starts. */
export const PULL_OVERLAP_MINUTES = 5;

const NAIVE_SERVER_DATE =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;

/**
 * The `updatedAfter` actually sent: the stored checkpoint minus
 * `minutes` — wayfinder ticket "Should Pull Data query with a safety
 * overlap window?". Closes the gap where a server import stamps
 * `lastUpdated` just before our `system/info` read but commits after it;
 * merges are idempotent, so the overlap only re-downloads a few rows.
 *
 * Pure wall-clock arithmetic on DHIS2's zone-less server date — never a
 * timezone conversion (the server reads a zone-less value in its own
 * zone; converting through UTC would shift the bound by the zone offset).
 * Anything not in that exact shape is sent unchanged.
 */
export function withPullOverlap(
    checkpoint: string,
    minutes: number = PULL_OVERLAP_MINUTES,
): string {
    const m = NAIVE_SERVER_DATE.exec(checkpoint);
    if (!m) return checkpoint;
    const [, y, mo, d, h, mi, s, frac] = m;
    const ms = frac === undefined ? 0 : Number(frac.padEnd(3, "0"));
    // Date.UTC is used only as a calendar calculator (handles day/month/
    // year rollover); the value is formatted straight back, zone-free.
    const t = new Date(
        Date.UTC(+y, +mo - 1, +d, +h, +mi, +s, ms) - minutes * 60_000,
    );
    const p2 = (n: number) => String(n).padStart(2, "0");
    const base = `${t.getUTCFullYear()}-${p2(t.getUTCMonth() + 1)}-${p2(t.getUTCDate())}T${p2(t.getUTCHours())}:${p2(t.getUTCMinutes())}:${p2(t.getUTCSeconds())}`;
    return frac === undefined
        ? base
        : `${base}.${String(t.getUTCMilliseconds()).padStart(3, "0")}`;
}

