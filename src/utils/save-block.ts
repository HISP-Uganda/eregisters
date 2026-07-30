export type BlockItem = { id: string; label: string };
export type SaveBlock = { missing: BlockItem[]; errors: string[] };

function isEmpty(v: unknown): boolean {
    if (v === undefined || v === null) return true;
    if (typeof v === "string") return v.trim().length === 0;
    if (Array.isArray(v)) return v.length === 0;
    return false;
}

export function computeSaveBlock(input: {
    metadataMandatoryIds: string[];
    ruleMandatoryIds: string[];
    hiddenIds: string[];
    values: Record<string, unknown>;
    labels: Map<string, string>;
    errors: string[];
}): SaveBlock {
    const hidden = new Set(input.hiddenIds);
    const seen = new Set<string>();
    const missing: BlockItem[] = [];
    for (const id of [
        ...input.metadataMandatoryIds,
        ...input.ruleMandatoryIds,
    ]) {
        if (seen.has(id)) continue;
        seen.add(id);
        if (hidden.has(id)) continue;
        if (!isEmpty(input.values[id])) continue;
        missing.push({ id, label: input.labels.get(id) ?? id });
    }
    return { missing, errors: [...input.errors] };
}
