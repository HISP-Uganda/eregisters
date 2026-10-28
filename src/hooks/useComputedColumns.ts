import {
    normalizeDefinition,
    type ComputedColumnDefinition,
} from "@/analytics/computed-columns";
import { useLocalProgramRecords } from "./useLocalProgramRecords";

const STORAGE_KEY = "eregisters.analytics.computedColumns";

/** Computed columns are personal, per-program analytics definitions. */
export function useComputedColumns(programId: string) {
    const { records: definitions, save, remove } = useLocalProgramRecords<ComputedColumnDefinition>(
        STORAGE_KEY, programId, normalizeDefinition,
    );
    return { definitions, save, remove };
}
