import { liveQuery } from "dexie";
import { useEffect, useState } from "react";
import { db } from "../db";
import { emptyStageHierarchyConfig, StageHierarchyConfig } from "../schemas";

export const useStageHierarchyConfig = (): StageHierarchyConfig => {
    const [config, setConfig] = useState<StageHierarchyConfig>(
        emptyStageHierarchyConfig,
    );

    useEffect(() => {
        const obs = liveQuery(() => db.stageHierarchy.get("main"));
        const sub = obs.subscribe({
            next: (row) => setConfig(row?.config ?? emptyStageHierarchyConfig),
        });
        return () => sub.unsubscribe();
    }, []);

    return config;
};
