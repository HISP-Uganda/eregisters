import { useEffect, useRef } from "react";
import {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "@/schemas";
import { clientForEditing } from "./client";

export type ClientSearch = {
    /** Open this visit on arrival. */
    event?: string;
    /** Open the client's edit form on arrival. */
    edit?: "client";
};

/**
 * Opens the visit or client form a link asked for (`?event=` or
 * `?edit=client`) — once per distinct request, and for a visit only once
 * it has loaded.
 */
export function useModalsFromSearch({
    search,
    trackedEntity,
    enrollment,
    allEnrollmentEvents,
    openVisit,
    openClient,
}: {
    search: ClientSearch;
    trackedEntity: FlattenedTrackedEntity;
    enrollment: FlattenedEnrollment;
    allEnrollmentEvents: FlattenedEvent[];
    openVisit: (visit: FlattenedEvent, enrollment: FlattenedEnrollment) => void;
    openClient: (client: FlattenedTrackedEntity, enrollment: FlattenedEnrollment) => void;
}) {
    const handledSearchRef = useRef<string | null>(null);

    useEffect(() => {
        const key = `${search.event ?? ""}|${search.edit ?? ""}`;
        if (handledSearchRef.current === key) return;
        if (!search.event && !search.edit) {
            handledSearchRef.current = key;
            return;
        }
        if (search.event) {
            const target = allEnrollmentEvents.find(
                (e) => e.event === search.event,
            );
            if (target) {
                handledSearchRef.current = key;
                openVisit(target, enrollment);
            }
        } else if (search.edit === "client") {
            handledSearchRef.current = key;
            openClient(clientForEditing(trackedEntity, enrollment), enrollment);
        }
    }, [
        search.event,
        search.edit,
        trackedEntity,
        enrollment,
        allEnrollmentEvents,
        openVisit,
        openClient,
    ]);
}
