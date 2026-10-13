import { useEffect, useMemo, useState } from "react";
import type { ClientPage } from "@/db/client-search";
import { searchClients, subscribeClientWrites } from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";

/** Search terms by attribute id, from the search form. */
export type ClientSearchTerms = Record<string, string> | undefined;

/** The search terms that were actually filled in. */
export function filledTerms(search: ClientSearchTerms): Record<string, string> {
    return Object.fromEntries(Object.entries(search ?? {}).filter(([, value]) => Boolean(value)));
}

/**
 * One page of this facility's registered clients (not drafts, not deleted)
 * whose attributes contain every search term, ignoring case, newest
 * registration first. No terms: none. Only the page is loaded; it reloads
 * when clients change (a registration, a pull). `page` starts at 1.
 */
export function useClientSearch(search: ClientSearchTerms, page: number, pageSize: number) {
    const { orgUnit } = useMetadata();
    const terms = useMemo(() => filledTerms(search), [search]);
    const hasTerms = Object.keys(terms).length > 0;
    const [result, setResult] = useState<ClientPage & { key: string } | null>(null);
    const key = JSON.stringify([orgUnit, terms, page, pageSize]);

    useEffect(() => {
        if (!hasTerms) return;
        let current = true;
        const load = () => {
            searchClients(orgUnit, terms, (page - 1) * pageSize, pageSize)
                .then((next) => {
                    if (current) setResult({ ...next, key });
                })
                .catch((error) => console.warn("Client search failed", error));
        };
        load();
        const unsubscribe = subscribeClientWrites(load);
        return () => {
            current = false;
            unsubscribe();
        };
        // `key` covers orgUnit, terms, page and pageSize.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, hasTerms]);

    if (!hasTerms) return { terms, clients: [], total: 0, loading: false };
    // Until this search's first page arrives, keep showing the previous page.
    const loading = result?.key !== key;
    return { terms, clients: result?.clients ?? [], total: result?.total ?? 0, loading };
}
