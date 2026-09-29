import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildParentEventDataset } from "@/analytics/parent-event-dataset";
import type { AnalyticsDataset } from "@/analytics/types";
import type { AnalyticsFilters } from "@/components/analytics/analytics-filter-bar";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";
import { useStageHierarchyConfig } from "@/hooks/useStageHierarchyConfig";
import { useUIConfig } from "@/hooks/useUIConfig";

export type DatasetStatus = "idle" | "loading" | "ready";

/**
 * The analytics dataset for the current filters, built from this
 * facility's local records. "idle" until a stage and a period are picked
 * (so nothing large is built before it's asked for).
 */
export function useAnalyticsDataset(filters: AnalyticsFilters) {
    const { program, orgUnit, trackedEntityAttributes, dataElements, optionSets } = useMetadata();
    const uiConfig = useUIConfig();
    const stageHierarchyPairs = useStageHierarchyConfig();

    const { data: trackedEntities } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ trackedEntities: getTrackedEntitiesCollection() })
                .where(({ trackedEntities }) => eq(trackedEntities.orgUnit, orgUnit)),
        [orgUnit],
    );
    const { data: enrollments } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ enrollments: getEnrollmentsCollection() })
                .where(({ enrollments }) =>
                    and(eq(enrollments.orgUnit, orgUnit), eq(enrollments.program, filters.programId)),
                ),
        [orgUnit, filters.programId],
    );
    const { data: events } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ events: getEventsCollection() })
                .where(({ events }) =>
                    and(eq(events.orgUnit, orgUnit), eq(events.program, filters.programId)),
                ),
        [orgUnit, filters.programId],
    );

    const legalParentStageIds = useMemo(
        () =>
            stageHierarchyPairs
                .filter((p) => p.childStageId === filters.selectedStageId)
                .map((p) => p.parentStageId),
        [stageHierarchyPairs, filters.selectedStageId],
    );

    const hasRequiredFilters = Boolean(filters.selectedStageId && filters.startDate && filters.endDate);
    const emptyDataset: AnalyticsDataset = useMemo(
        () => ({ columns: [], rows: [], mainStage: program.programStages[0] }),
        [program],
    );
    const [state, setState] = useState<{ status: DatasetStatus; dataset: AnalyticsDataset }>({
        status: "idle",
        dataset: emptyDataset,
    });
    // Guards a build superseded by a newer filter change from overwriting it.
    const computeTokenRef = useRef(0);

    useEffect(() => {
        if (!hasRequiredFilters) {
            setState({ status: "idle", dataset: emptyDataset });
            return;
        }
        const token = ++computeTokenRef.current;
        setState((prev) => ({ status: "loading", dataset: prev.dataset }));
        // The build is synchronous and can be heavy; deferring it a tick
        // lets the "loading" spinner paint before the main thread blocks.
        const timer = setTimeout(() => {
            const built = buildParentEventDataset({
                metadata: { program, trackedEntityAttributes, dataElements, optionSets },
                trackedEntities,
                enrollments,
                events,
                orgUnit,
                programId: filters.programId,
                selectedStageId: filters.selectedStageId,
                legalParentStageIds,
                childStageIds: filters.childStageIds,
                selectedServiceTypes: filters.serviceTypes,
                startDate: filters.startDate,
                endDate: filters.endDate,
                uiConfig,
            });
            if (computeTokenRef.current !== token) return;
            setState({ status: "ready", dataset: built });
        }, 0);
        return () => clearTimeout(timer);
    }, [
        hasRequiredFilters,
        emptyDataset,
        dataElements,
        enrollments,
        events,
        filters,
        legalParentStageIds,
        optionSets,
        orgUnit,
        program,
        trackedEntities,
        trackedEntityAttributes,
        uiConfig,
    ]);

    return state;
}
