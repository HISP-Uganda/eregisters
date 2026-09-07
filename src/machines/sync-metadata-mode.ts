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
