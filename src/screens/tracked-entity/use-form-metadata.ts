import { useMemo } from "react";
import { useMetadata } from "@/hooks/useMetadata";
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
    const teaMandatoryIds = useMemo(
        () =>
            (program?.programTrackedEntityAttributes ?? [])
                .filter((ptea) => ptea.mandatory)
                .map((ptea) => ptea.trackedEntityAttribute.id),
        [program],
    );
    const teaLabels = useMemo(() => {
        const m = new Map<string, string>();
        for (const tea of trackedEntityAttributes.values()) {
            m.set(tea.id, tea.displayFormName || tea.name);
        }
        return m;
    }, [trackedEntityAttributes]);

    return {
        mainStageDataElements,
        eventMandatoryIds,
        dataElementLabels,
        teaMandatoryIds,
        teaLabels,
    };
}
