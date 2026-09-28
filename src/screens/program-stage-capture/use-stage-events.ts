import { and, eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import { useEffect, useMemo } from "react";
import { getEventsCollection } from "../../db/collections";
import { FlattenedEvent, ProgramStage } from "../../schemas";
import { moveEventsToVisitDate } from "./actions";
import { eventDate, eventsOffVisitDate, toRuleEvents } from "./stage";

/**
 * A visit's events of one stage, live, plus the enrollment's events for
 * program rules — and keeps the stage's events on the visit's date.
 */
export function useStageEvents(
    programStage: ProgramStage,
    visit: FlattenedEvent,
    trackedEntity: string,
) {
    const eventsCollection = getEventsCollection();

    const { data: events } = useLiveSuspenseQuery((q) =>
        q.from({ event: eventsCollection }).where(({ event }) =>
            and(
                eq(event.programStage, programStage.id),
                eq(event.parentEvent, visit.event),
                not(eq(event.syncStatus, "deleted")),
            ),
        ),
    );

    // The `visit` prop is a snapshot from a parent render; when the visit
    // date is edited and saved, the parent may not re-pass it. Read the
    // stored visit so the date below is always the latest.
    const { data: storedVisit } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ event: eventsCollection })
                .where(({ event }) => eq(event.event, visit.event))
                .findOne(),
        [visit.event],
    );

    const { data: enrollmentEvents } = useLiveSuspenseQuery(
        (q) =>
            q
                .from({ events: eventsCollection })
                .where(({ events }) =>
                    and(
                        eq(events.trackedEntity, trackedEntity),
                        not(eq(events.syncStatus, "deleted")),
                    ),
                )
                .orderBy(({ events }) => events.occurredAt, "asc"),
        [trackedEntity],
    );

    const visitDate = eventDate(storedVisit ?? visit);
    useEffect(() => {
        if (!visitDate) return;
        moveEventsToVisitDate(eventsOffVisitDate(events, visitDate), visitDate);
    }, [visitDate, events]);

    const ruleEvents = useMemo(() => toRuleEvents(enrollmentEvents), [enrollmentEvents]);

    return { events, ruleEvents };
}
