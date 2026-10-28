import { useMemo } from "react";
import { useMetadata } from "@/hooks/useMetadata";
import { useTrackedEntityFieldMetadata } from "@/hooks/useTrackedEntityFieldMetadata";
import { MAIN_STAGE } from "./client";

/** The metadata the visit and client forms need: fields, labels, mandatory ids. */
export function useFormMetadata() {
    const { trackedEntityAttributes, dataElements, program } = useMetadata();
    const mainStage = program?.programStages.find((s) => s.id === MAIN_STAGE);

    const mainStageDataElements = useMemo(
        () =>
            new Set(
                mainStage?.programStageDataElements.map(
                    (psde) => psde.dataElement.id,
                ) ?? [],
            ),
        [mainStage],
    );
    const eventMandatoryIds = useMemo(
        () =>
            (mainStage?.programStageDataElements ?? [])
                .filter((psde) => psde.compulsory)
                .map((psde) => psde.dataElement.id),
        [mainStage],
    );
    const dataElementLabels = useMemo(() => {
        const m = new Map<string, string>();
        for (const de of dataElements.values()) {
            m.set(de.id, de.formName || de.name);
        }
        return m;
    }, [dataElements]);
    const { mandatoryIds: teaMandatoryIds, labels: teaLabels } = useTrackedEntityFieldMetadata(
        program, trackedEntityAttributes,
    );

    return {
        mainStageDataElements,
        eventMandatoryIds,
        dataElementLabels,
        teaMandatoryIds,
        teaLabels,
    };
}
