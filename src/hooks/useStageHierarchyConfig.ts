import { emptyStageHierarchyConfig, StageHierarchyConfig } from "../schemas";
import { useSqliteConfigRow } from "./useSqliteConfigRow";

export const useStageHierarchyConfig = (): StageHierarchyConfig => {
    return useSqliteConfigRow<StageHierarchyConfig>(
        "stage_hierarchy",
        "main",
        emptyStageHierarchyConfig,
    );
};
