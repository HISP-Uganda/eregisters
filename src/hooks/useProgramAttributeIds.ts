import { useMemo } from "react";
import type { Program } from "@/schemas";

export function useProgramAttributeIds(program: Program): Set<string> {
    return useMemo(() => new Set(program.programTrackedEntityAttributes.map(
        ({ trackedEntityAttribute }) => trackedEntityAttribute.id,
    )), [program]);
}
