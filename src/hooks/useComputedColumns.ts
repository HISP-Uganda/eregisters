import { useCallback, useEffect, useMemo, useState } from "react";
import {
    normalizeDefinition,
    type ComputedColumnDefinition,
} from "../analytics/computed-columns";

const STORAGE_KEY = "eregisters.analytics.computedColumns";

function readAll(): ComputedColumnDefinition[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(normalizeDefinition) : [];
    } catch {
        return [];
    }
}

function writeAll(definitions: ComputedColumnDefinition[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(definitions));
}

/**
 * Computed columns are defined per-program (their source column only
 * exists within one program's schema) and persisted browser-locally —
 * they're a personal analytics convenience, not shared DHIS2 metadata.
 */
export function useComputedColumns(programId: string) {
    const [all, setAll] = useState<ComputedColumnDefinition[]>(() => readAll());

    // Pick up definitions saved by another tab/session.
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY) setAll(readAll());
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const save = useCallback((definition: ComputedColumnDefinition) => {
        setAll((prev) => {
            const next = prev.some((entry) => entry.id === definition.id)
                ? prev.map((entry) =>
                      entry.id === definition.id ? definition : entry,
                  )
                : [...prev, definition];
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

    // Stable reference across renders unless the underlying data actually
    // changes — `all.filter(...)` inline would allocate a new array every
    // render and cascade into an infinite render loop downstream (the
    // Analytics page memoizes off this and syncs it into state via effect).
    const definitions = useMemo(
        () => all.filter((entry) => entry.programId === programId),
        [all, programId],
    );

    return { definitions, save, remove };
}
