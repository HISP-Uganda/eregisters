import type { AnalyticsFilters } from "../components/analytics/analytics-filter-bar";
import type { LineListTableState } from "../components/analytics/line-list-table";

/**
 * A user-named snapshot of the Line List's filters/columns/table state,
 * saved so it can be reopened later — distinct from `AnalyticsRestoredState`
 * (`routes/analytics.tsx`), which is a one-shot, unnamed round trip for
 * "coming back from a record's detail view" and is never persisted.
 */
export interface SavedLineListView {
    id: string;
    programId: string;
    name: string;
    createdAt: string;
    filters: AnalyticsFilters;
    visibleColumnKeys: string[];
    tableState: LineListTableState;
}
