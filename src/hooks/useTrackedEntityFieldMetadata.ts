import { useMemo } from "react";
import type { Program, TrackedEntityAttribute } from "@/schemas";

export function useTrackedEntityFieldMetadata(
    program: Program | undefined,
    attributes: ReadonlyMap<string, TrackedEntityAttribute>,
) {
    const mandatoryIds = useMemo(
        () => (program?.programTrackedEntityAttributes ?? [])
            .filter((attribute) => attribute.mandatory)
            .map((attribute) => attribute.trackedEntityAttribute.id),
        [program],
    );
    const labels = useMemo(() => {
        const result = new Map<string, string>();
        for (const attribute of attributes.values()) {
            result.set(attribute.id, attribute.displayFormName || attribute.name);
        }
        return result;
    }, [attributes]);
    return { mandatoryIds, labels };
}
