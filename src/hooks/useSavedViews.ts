import type { SavedLineListView } from "@/analytics/saved-views";
import { useLocalProgramRecords } from "./useLocalProgramRecords";

const STORAGE_KEY = "eregisters.analytics.savedViews";

/** Saved Line List views are personal, per-program browser-local records. */
export function useSavedViews(programId: string) {
    const { records: views, save, remove } = useLocalProgramRecords<SavedLineListView>(
        STORAGE_KEY, programId,
    );
    return { views, save, remove };
}
