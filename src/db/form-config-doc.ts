import type { FormConfigDoc } from "../form-configs/v2-types";
import { EMPTY_FORM_CONFIG_DOC } from "../form-configs/v2-types";
import { db } from "./index";

const DS_NAMESPACE = "eregisters";
const DS_KEY = "hmis-form-configs";

export async function readServerFormConfigs(
    engine: any,
): Promise<FormConfigDoc | null> {
    try {
        const res = await engine.query({
            doc: {
                resource: `dataStore/${DS_NAMESPACE}/${DS_KEY}`,
            },
        });
        return (res.doc as FormConfigDoc) ?? null;
    } catch {
        return null;
    }
}

export async function writeServerFormConfigs(
    engine: any,
    doc: FormConfigDoc,
): Promise<void> {
    try {
        await engine.mutate({
            type: "update",
            resource: `dataStore/${DS_NAMESPACE}`,
            id: DS_KEY,
            data: doc,
        });
    } catch {
        await engine.mutate({
            type: "create",
            resource: `dataStore/${DS_NAMESPACE}`,
            data: { key: DS_KEY, value: doc },
        });
    }
    await db.hmisFormConfigs.put({ id: "main", doc });
}

export async function readLocalFormConfigs(): Promise<FormConfigDoc> {
    const row = await db.hmisFormConfigs.get("main");
    return row?.doc ?? EMPTY_FORM_CONFIG_DOC;
}

export async function writeLocalFormConfigs(doc: FormConfigDoc): Promise<void> {
    await db.hmisFormConfigs.put({ id: "main", doc });
}
