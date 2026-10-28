import { useCallback, useEffect, useMemo, useState } from "react";

type ProgramRecord = { id: string; programId: string };

function readAll<T extends ProgramRecord>(key: string, normalize?: (record: T) => T): T[] {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return normalize ? parsed.map(normalize) : parsed;
    } catch {
        return [];
    }
}

/** Browser-local records shared across tabs and filtered to the active program. */
export function useLocalProgramRecords<T extends ProgramRecord>(
    key: string,
    programId: string,
    normalize?: (record: T) => T,
) {
    const [all, setAll] = useState<T[]>(() => readAll(key, normalize));

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === key) setAll(readAll(key, normalize));
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [key, normalize]);

    const save = useCallback((record: T) => {
        setAll((previous) => {
            const next = previous.some((entry) => entry.id === record.id)
                ? previous.map((entry) => entry.id === record.id ? record : entry)
                : [...previous, record];
            localStorage.setItem(key, JSON.stringify(next));
            return next;
        });
    }, [key]);

    const remove = useCallback((id: string) => {
        setAll((previous) => {
            const next = previous.filter((entry) => entry.id !== id);
            localStorage.setItem(key, JSON.stringify(next));
            return next;
        });
    }, [key]);

    const records = useMemo(
        () => all.filter((entry) => entry.programId === programId),
        [all, programId],
    );
    return { records, save, remove };
}
