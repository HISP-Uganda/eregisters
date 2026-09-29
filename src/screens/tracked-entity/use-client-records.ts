import { and, eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import {
    getEnrollmentsCollection,
    getEventsCollection,
    getTrackedEntitiesCollection,
} from "@/db/collections";
import { useMetadata } from "@/hooks/useMetadata";
import { MAIN_STAGE } from "./client";

/** A client's live local records: the client, enrollment and events. */
export function useClientRecords(tei: string) {
    const { orgUnit } = useMetadata();
    const eventsCollection = getEventsCollection();

    /** This facility's main-stage visits, newest first. */
    const { data: visits } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ events: eventsCollection })
                .where(({ events }) =>
                    and(
                        eq(events.trackedEntity, tei),
                        eq(events.programStage, MAIN_STAGE),
                        eq(events.orgUnit, orgUnit),
                        not(eq(events.syncStatus, "deleted")),
                    ),
                )
                .orderBy(({ events }) => events.occurredAt, "desc"),
        [tei],
    );

    /** Every stage's events, oldest first — program rules read earlier ones. */
    const { data: allEnrollmentEvents } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ events: eventsCollection })
                .where(({ events }) =>
                    and(
                        eq(events.trackedEntity, tei),
                        not(eq(events.syncStatus, "deleted")),
                    ),
                )
                .orderBy(({ events }) => events.occurredAt, "asc"),
        [tei],
    );

    const { data: enrollment } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ enrollments: getEnrollmentsCollection() })
                .where(({ enrollments }) =>
                    and(
                        eq(enrollments.trackedEntity, tei),
                        eq(enrollments.orgUnit, orgUnit),
                    ),
                )
                .findOne(),
        [tei],
    );

    const { data: trackedEntity } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ trackedEntity: getTrackedEntitiesCollection() })
                .where(({ trackedEntity }) =>
                    and(
                        eq(trackedEntity.trackedEntity, tei),
                        eq(trackedEntity.orgUnit, orgUnit),
                    ),
                )
                .findOne(),
        [tei],
    );

    return { visits, allEnrollmentEvents, enrollment, trackedEntity };
}
