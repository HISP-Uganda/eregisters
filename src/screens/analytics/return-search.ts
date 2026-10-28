import type { AnalyticsFilters } from "@/components/analytics/analytics-filter-bar";
import type { LineListTableState } from "@/components/analytics/line-list-table";

/**
 * The page's selections, carried to a record opened from the line list
 * and handed back on return (`?restore=`), so they aren't lost.
 */
export interface AnalyticsRestoredState {
    filters: AnalyticsFilters;
    visibleColumnKeys: string[];
    tab: string;
    tableState?: LineListTableState;
}

/**
 * Keep ordinary snapshots in the URL; put unusually large selections in
 * same-tab storage so no filter can be silently discarded.
 */
export const MAX_RETURN_SEARCH_LENGTH = 8000;

export function encodeReturnSearch(snapshot: AnalyticsRestoredState): string {
    const encoded = JSON.stringify(snapshot);
    if (encoded.length <= MAX_RETURN_SEARCH_LENGTH) return encoded;
    const key = `analytics-return:${crypto.randomUUID()}`;
    try {
        sessionStorage.setItem(key, encoded);
    } catch {
        throw new Error("Could not save the line-list filters for return navigation.");
    }
    return JSON.stringify({ sessionKey: key });
}

/** The snapshot from `?restore=`, or null when absent or unreadable. */
export function decodeReturnSearch(restore: string | undefined): AnalyticsRestoredState | null {
    return decodeReturnSearchResult(restore).snapshot;
}

export function decodeReturnSearchResult(restore: string | undefined): {
    snapshot: AnalyticsRestoredState | null;
    error: string | null;
} {
    if (!restore) return { snapshot: null, error: null };
    try {
        const parsed: unknown = JSON.parse(restore);
        if (parsed && typeof parsed === "object" && "sessionKey" in parsed) {
            const key = (parsed as { sessionKey: unknown }).sessionKey;
            if (typeof key !== "string" || !key.startsWith("analytics-return:")) throw new Error("Invalid return key");
            const stored = sessionStorage.getItem(key);
            if (!stored) throw new Error("Missing return selection");
            const snapshot = JSON.parse(stored) as AnalyticsRestoredState;
            return { snapshot, error: null };
        }
        return { snapshot: parsed as AnalyticsRestoredState, error: null };
    } catch {
        return { snapshot: null, error: "Could not restore the previous line-list filters. Please load a saved list or select the filters again." };
    }
}

/** Consume after the route mounts, so React can safely repeat its initial render. */
export function consumeReturnSearch(restore: string | undefined): void {
    if (!restore) return;
    try {
        const parsed: unknown = JSON.parse(restore);
        if (parsed && typeof parsed === "object" && "sessionKey" in parsed) {
            const key = (parsed as { sessionKey: unknown }).sessionKey;
            if (typeof key === "string" && key.startsWith("analytics-return:")) sessionStorage.removeItem(key);
        }
    } catch { /* Invalid snapshots have no storage key to consume. */ }
}
