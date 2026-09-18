import { useCallback, useEffect, useMemo, useState } from "react";
import type { SavedLineListView } from "../analytics/saved-views";

const STORAGE_KEY = "eregisters.analytics.savedViews";

function readAll(): SavedLineListView[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeAll(views: SavedLineListView[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
}

/**
 * Saved Line List views — a personal, per-device convenience (like
 * `useComputedColumns`), not synced DHIS2 metadata: browser-local storage,
 * scoped per program since a view's filters/columns only make sense within
 * the program they were saved from.
 */
export function useSavedViews(programId: string) {
    const [all, setAll] = useState<SavedLineListView[]>(() => readAll());

    // Pick up views saved by another tab/session.
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY) setAll(readAll());
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const save = useCallback((view: SavedLineListView) => {
        setAll((prev) => {
            const next = prev.some((entry) => entry.id === view.id)
                ? prev.map((entry) => (entry.id === view.id ? view : entry))
                : [...prev, view];
            writeAll(next);
            return next;
        });
    }, []);

    const remove = useCallback((id: string) => {
        setAll((prev) => {
            const next = prev.filter((entry) => entry.id !== id);
            writeAll(next);
            return next;
        });
    }, []);

    const views = useMemo(
        () => all.filter((entry) => entry.programId === programId),
        [all, programId],
    );

    return { views, save, remove };
}
