import { and, eq, ilike, inArray, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import { getTrackedEntitiesCollection } from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";

/** Search terms by attribute id, from the search form. */
export type ClientSearchTerms = Record<string, string> | undefined;

/** The search terms that were actually filled in. */
export function filledTerms(search: ClientSearchTerms): Record<string, string> {
    return Object.fromEntries(Object.entries(search ?? {}).filter(([, value]) => Boolean(value)));
}

/**
 * This facility's registered clients (not drafts, not deleted) whose
 * attributes contain every search term, ignoring case. No terms: none.
 */
export function useClientSearch(search: ClientSearchTerms) {
    const { orgUnit } = useMetadata();
    const trackedEntities = getTrackedEntitiesCollection();

    const { data: clients = [] } = useLiveSuspenseQuery(
        (q) => {
            if (!search || Object.keys(search).length === 0) {
                // No client matches. A constant filter like eq(1, 0) would
                // reach the on-demand loader as "no filter" and load them all.
                return q
                    .from({ trackedEntity: trackedEntities })
                    .where(({ trackedEntity }) => inArray(trackedEntity.trackedEntity, []));
            }
            let query = q.from({ trackedEntity: trackedEntities });
            for (const [attribute, term] of Object.entries(search)) {
                query = query.where(({ trackedEntity }) => ilike(trackedEntity.attributes[attribute], `%${term}%`));
            }
            return query.where(({ trackedEntity }) =>
                and(
                    eq(trackedEntity.orgUnit, orgUnit),
                    not(eq(trackedEntity.syncStatus, "draft")),
                    not(eq(trackedEntity.syncStatus, "deleted")),
                ),
            );
        },
        [search],
    );

    const terms = useMemo(() => filledTerms(search), [search]);
    return { clients, terms };
}
