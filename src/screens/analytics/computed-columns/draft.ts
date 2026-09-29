import type {
    ComputedColumnDefinition,
    ComputedColumnRange,
} from "@/analytics/computed-columns";
import { findGap, findOverlappingRanges } from "@/analytics/computed-columns";

/** A computed column being written or edited, before it's saved. */
export type Draft = {
    id: string;
    name: string;
    sourceColumnKey: string | undefined;
    ranges: ComputedColumnRange[];
    fallbackLabel: string;
};

export function newRange(): ComputedColumnRange {
    return {
        id: crypto.randomUUID(),
        min: 0,
        minInclusive: true,
        max: null,
        maxInclusive: true,
        label: "",
    };
}

export function emptyDraft(): Draft {
    return {
        id: crypto.randomUUID(),
        name: "",
        sourceColumnKey: undefined,
        ranges: [newRange()],
        fallbackLabel: "Other",
    };
}

export function toDraft(definition: ComputedColumnDefinition): Draft {
    return {
        id: definition.id,
        name: definition.name,
        sourceColumnKey: definition.sourceColumnKey,
        ranges: definition.ranges,
        fallbackLabel: definition.fallbackLabel,
    };
}

const rangeName = (range: ComputedColumnRange) => range.label || range.min;

/** What's wrong with a draft, for the user — or null when it can be saved. */
export function draftError(draft: Draft): string | null {
    if (!draft.name.trim()) return "Give this computed column a name.";
    if (!draft.sourceColumnKey) return "Pick a source column.";
    if (draft.ranges.length === 0) return "Add at least one range.";
    for (const range of draft.ranges) {
        if (!range.label.trim()) return "Every range needs a display value.";
        if (range.max !== null && range.max < range.min) {
            return "A range's maximum can't be less than its minimum.";
        }
        if (range.max !== null && range.max === range.min && !(range.minInclusive && range.maxInclusive)) {
            return `Range "${range.label}" can never match anything — its bounds exclude the only value they share.`;
        }
    }
    const overlap = findOverlappingRanges(draft.ranges);
    if (overlap) {
        return `Ranges "${rangeName(overlap[0])}" and "${rangeName(overlap[1])}" overlap.`;
    }
    const gap = findGap(draft.ranges);
    if (gap) {
        return `There's a gap between "${rangeName(gap[0])}" and "${rangeName(gap[1])}" — some values would match neither and fall to the fallback. Adjust their bounds so they touch (e.g. one ends where the next begins).`;
    }
    if (!draft.fallbackLabel.trim()) return "Set a fallback value for rows outside every range.";
    return null;
}

/** The definition to save from a valid draft (see `draftError`). */
export function toDefinition(draft: Draft, programId: string): ComputedColumnDefinition {
    return {
        id: draft.id,
        programId,
        name: draft.name.trim(),
        sourceColumnKey: draft.sourceColumnKey!,
        ranges: draft.ranges,
        fallbackLabel: draft.fallbackLabel.trim(),
    };
}
