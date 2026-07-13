import { liveQuery } from "dexie";
import { useEffect, useState } from "react";
import { db } from "../db";
import { emptyUIConfig, UIConfig } from "../schemas";

export const useUIConfig = (): UIConfig => {
    const [config, setConfig] = useState<UIConfig>(emptyUIConfig);

    useEffect(() => {
        const obs = liveQuery(() => db.uiConfig.get("main"));
        const sub = obs.subscribe({
            next: (row) => setConfig(row?.config ?? emptyUIConfig),
        });
        return () => sub.unsubscribe();
    }, []);

    return config;
};
