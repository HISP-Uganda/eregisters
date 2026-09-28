import type {
    FlattenedEnrollment,
    FlattenedEvent,
    FlattenedTrackedEntity,
} from "../../schemas";

/** One failed record as the errors menu lists it. */
export type FailurePreview = {
    key: string;
    typeLabel: string;
    typeColor: string;
    title: string;
    subtitle?: string;
    error: string;
};

export function shortId(id: string) {
    if (!id) return "";
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

/** An error's first line, cut to fit the menu. */
export function firstErrorLine(error?: string | null) {
    if (!error) return "";
    const line = error.split("\n")[0].trim();
    return line.length > 90 ? `${line.slice(0, 90)}…` : line;
}

/**
 * The first `max` failed records — events, then enrollments, then
 * clients — and how many more there are.
 */
export function failurePreview(
    failed: {
        events: FlattenedEvent[];
        enrollments: FlattenedEnrollment[];
        trackedEntities: FlattenedTrackedEntity[];
    },
    stageNames: Map<string, string>,
    max = 6,
): { items: FailurePreview[]; remaining: number } {
    const all: FailurePreview[] = [
        ...failed.events.map((ev) => ({
            key: `event-${ev.event}`,
            typeLabel: "EVENT",
            typeColor: "#7c3aed",
            title: stageNames.get(ev.programStage) ?? ev.programStage,
            subtitle: shortId(ev.event),
            error: firstErrorLine(ev.syncError),
        })),
        ...failed.enrollments.map((en) => ({
            key: `enrollment-${en.enrollment}`,
            typeLabel: "ENROLL",
            typeColor: "#0891b2",
            title: shortId(en.enrollment),
            subtitle: `client ${shortId(en.trackedEntity)}`,
            error: firstErrorLine(en.syncError),
        })),
        ...failed.trackedEntities.map((te) => ({
            key: `te-${te.trackedEntity}`,
            typeLabel: "CLIENT",
            typeColor: "#ea580c",
            title: shortId(te.trackedEntity),
            error: firstErrorLine(te.syncError),
        })),
    ];
    return { items: all.slice(0, max), remaining: Math.max(0, all.length - max) };
}
