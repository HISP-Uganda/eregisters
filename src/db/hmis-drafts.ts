import { db } from "./index";

export interface HmisDraft {
    id: string;
    dataSet: string;
    period: string;
    orgUnit: string;
    attributeOptionCombo: string;
    values: Record<string, string>;
    isVerified: boolean;
    verifiedAt?: number;
    updatedAt: number;
    syncStatus: "draft" | "pending" | "synced";
}

export function draftId(input: {
    dataSet: string;
    period: string;
    orgUnit: string;
    attributeOptionCombo: string;
}): string {
    return `${input.dataSet}_${input.period}_${input.orgUnit}_${input.attributeOptionCombo}`;
}

export function mergeDraftAndServer(
    draft: HmisDraft | undefined,
    server: Map<string, string>,
): Map<string, string> {
    const merged = new Map(server);
    if (draft) {
        for (const [k, v] of Object.entries(draft.values)) {
            merged.set(k, v);
        }
    }
    return merged;
}

export function combineIsVerified(
    local: boolean,
    server: boolean | undefined,
): boolean {
    return local || server === true;
}

export async function getHmisDraft(
    id: string,
): Promise<HmisDraft | undefined> {
    return db.hmisDrafts.get(id);
}

export async function upsertHmisDraft(row: HmisDraft): Promise<void> {
    await db.hmisDrafts.put(row);
}

export async function patchHmisDraft(
    id: string,
    patch: Partial<HmisDraft>,
): Promise<void> {
    const existing = await db.hmisDrafts.get(id);
    if (!existing) return;
    await db.hmisDrafts.put({ ...existing, ...patch });
}
