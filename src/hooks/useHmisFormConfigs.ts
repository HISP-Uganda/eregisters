import { liveQuery } from "dexie";
import { useEffect, useState } from "react";
import { db } from "../db";
import { EMPTY_FORM_CONFIG_DOC } from "../form-configs/v2-types";
import type { FormConfigDoc } from "../form-configs/v2-types";

export function useHmisFormConfigs(): FormConfigDoc {
    const [doc, setDoc] = useState<FormConfigDoc>(EMPTY_FORM_CONFIG_DOC);
    useEffect(() => {
        const obs = liveQuery(() => db.hmisFormConfigs.get("main"));
        const sub = obs.subscribe({
            next: (row) => setDoc(row?.doc ?? EMPTY_FORM_CONFIG_DOC),
        });
        return () => sub.unsubscribe();
    }, []);
    return doc;
}
