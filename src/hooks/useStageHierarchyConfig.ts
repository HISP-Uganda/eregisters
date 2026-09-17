import { emptyStageHierarchyConfig, StageHierarchyConfig } from "../schemas";
import { useConfigRow } from "./useConfigRow";

export const useStageHierarchyConfig = (): StageHierarchyConfig => {
    return useConfigRow<StageHierarchyConfig>(
        "stage_hierarchy",
        "main",
        emptyStageHierarchyConfig,
    );
};
