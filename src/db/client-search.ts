import type { FlattenedTrackedEntity } from "@/schemas";

/** Search terms by attribute id: a client matches when each attribute contains its term, ignoring case. */
export type SearchTerms = Record<string, string>;

/** One page of search results, and how many clients match in all. */
export type ClientPage = { total: number; clients: FlattenedTrackedEntity[] };

/** SQLite's LIKE folds case for ASCII letters only, so only ASCII terms can be matched in SQL. */
export function isAsciiTerm(term: string): boolean {
    return /^[\x00-\x7f]*$/.test(term);
}

/**
 * Whether `value` contains `term`, ignoring case, with `%` and `_` in the
 * term as wildcards: TanStack DB's `ilike(value, "%term%")`, and SQLite's
 * `LIKE` for ASCII terms.
 */
export function containsTerm(value: unknown, term: string): boolean {
    if (typeof value !== "string") return false;
    const pattern = term
        .toLowerCase()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/%/g, ".*")
        .replace(/_/g, ".");
    return new RegExp(`^.*${pattern}.*$`, "s").test(value.toLowerCase());
}

/** A registered client of the org unit (not a draft, not deleted) whose attributes contain every term. */
export function matchesSearch(client: FlattenedTrackedEntity, orgUnit: string, terms: SearchTerms): boolean {
    return (
        client.orgUnit === orgUnit &&
        client.syncStatus !== "draft" &&
        client.syncStatus !== "deleted" &&
        Object.entries(terms).every(([attribute, term]) => containsTerm(client.attributes[attribute], term))
    );
}

/** Result order: newest registration first, then by id, so pages don't overlap. */
export function compareClients(a: FlattenedTrackedEntity, b: FlattenedTrackedEntity): number {
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
    return a.trackedEntity < b.trackedEntity ? -1 : a.trackedEntity > b.trackedEntity ? 1 : 0;
}

/** Filters, sorts and pages clients in memory. */
export function pageInMemory(
    clients: readonly FlattenedTrackedEntity[],
    orgUnit: string,
    terms: SearchTerms,
    offset: number,
    limit: number,
): ClientPage {
    const matching = clients.filter((c) => matchesSearch(c, orgUnit, terms)).sort(compareClients);
    return { total: matching.length, clients: matching.slice(offset, offset + limit) };
}
