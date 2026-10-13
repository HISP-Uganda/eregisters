import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClientPage } from "@/db/client-search";
import { searchClients, subscribeClientWrites } from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";

/** Search terms by attribute id, from the search form. */
export type ClientSearchTerms = Record<string, string> | undefined;

/** The search terms that were actually filled in. */
export function filledTerms(search: ClientSearchTerms): Record<string, string> {
    return Object.fromEntries(Object.entries(search ?? {}).filter(([, value]) => Boolean(value)));
}

/** The last answer to a search: its page, or that it failed. `key` names the search it answers. */
export type SearchResult = { key: string } & ({ page: ClientPage } | { failed: true });

/**
 * The result after a load of search `key` failed. A failed reload of a page
 * that is showing keeps the page; otherwise the search shows as failed.
 */
export function afterFailure(previous: SearchResult | null, key: string): SearchResult {
    return previous?.key === key && "page" in previous ? previous : { key, failed: true };
}

/** What the screen shows for search `key`, given the last result. */
export function searchState(result: SearchResult | null, key: string) {
    // Until this search's first answer arrives, keep showing the previous page.
    const loading = result?.key !== key;
    const failed = !loading && "failed" in result!;
    const page = result && "page" in result ? result.page : undefined;
    return { clients: page?.clients ?? [], total: page?.total ?? 0, loading, failed };
}

/**
 * One page of this facility's registered clients (not drafts, not deleted)
 * whose attributes contain every search term, ignoring case, newest
 * registration first. No terms: none. Only the page is loaded; it reloads
 * when clients change (a registration, a pull). `page` starts at 1.
 * `failed` says the search couldn't be run; `retry` runs it again.
 */
export function useClientSearch(search: ClientSearchTerms, page: number, pageSize: number) {
    const { orgUnit } = useMetadata();
    const terms = useMemo(() => filledTerms(search), [search]);
    const hasTerms = Object.keys(terms).length > 0;
    const [result, setResult] = useState<SearchResult | null>(null);
    const [attempt, setAttempt] = useState(0);
    const key = JSON.stringify([orgUnit, terms, page, pageSize]);

    useEffect(() => {
        if (!hasTerms) return;
        let current = true;
        const load = () => {
            searchClients(orgUnit, terms, (page - 1) * pageSize, pageSize)
                .then((next) => {
                    if (current) setResult({ key, page: next });
                })
                .catch((error) => {
                    console.warn("Client search failed", error);
                    if (current) setResult((previous) => afterFailure(previous, key));
                });
        };
        load();
        const unsubscribe = subscribeClientWrites(load);
        return () => {
            current = false;
            unsubscribe();
        };
        // `key` covers orgUnit, terms, page and pageSize.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, hasTerms, attempt]);

    const retry = useCallback(() => {
        setResult(null);
        setAttempt((n) => n + 1);
    }, []);

    if (!hasTerms) return { terms, clients: [], total: 0, loading: false, failed: false, retry };
    return { terms, ...searchState(result, key), retry };
}
