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
    /** Omitted when it would push the snapshot past `MAX_RETURN_SEARCH_LENGTH`. */
    tableState?: LineListTableState;
}

/**
 * Headroom far below any browser's URL limit (Chrome ~2MB, Firefox ~65K,
 * Safari tens of thousands). The table's column filters/sort are the only
 * part that grows with the data (one entry per selected filter value), so
 * they're what's dropped if the snapshot ever gets this large.
 */
export const MAX_RETURN_SEARCH_LENGTH = 8000;

export function encodeReturnSearch(snapshot: AnalyticsRestoredState): string {
    const encoded = JSON.stringify(snapshot);
    if (encoded.length <= MAX_RETURN_SEARCH_LENGTH) return encoded;
    return JSON.stringify({ ...snapshot, tableState: undefined } satisfies AnalyticsRestoredState);
}

/** The snapshot from `?restore=`, or null when absent or unreadable. */
export function decodeReturnSearch(restore: string | undefined): AnalyticsRestoredState | null {
    if (!restore) return null;
    try {
        return JSON.parse(restore) as AnalyticsRestoredState;
    } catch {
        return null;
    }
}
