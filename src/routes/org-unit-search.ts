export interface OrgUnitLike {
    id: string;
    name: string;
    path: string;
}

export type OrgUnitSearchIndex = Map<string, string>;

/**
 * Precompute a lowercase lineage string ("great-grand > grand > parent > self")
 * for each org unit so `matchOrgUnit` becomes a plain substring check.
 */
export function buildOrgUnitSearchIndex(
    units: OrgUnitLike[],
): OrgUnitSearchIndex {
    const byId = new Map(units.map((u) => [u.id, u]));
    return new Map(
        units.map((u) => {
            const lineage = u.path
                .split("/")
                .slice(1)
                .map((id) => byId.get(id)?.name ?? "")
                .filter(Boolean)
                .join(" > ")
                .toLowerCase();
            return [u.id, lineage];
        }),
    );
}

export function matchOrgUnit(
    index: OrgUnitSearchIndex,
    nodeId: string,
    rawInput: string,
): boolean {
    const q = rawInput.trim().toLowerCase().replace(/\s+/g, " ");
    if (!q) return true;
    const lineage = index.get(nodeId);
    if (lineage === undefined) return false;
    return lineage.includes(q);
}
