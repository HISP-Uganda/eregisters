import { useCallback, useMemo, useState } from "react";
import type { ProgramRuleResult } from "../schemas";
import { computeSaveBlock, type SaveBlock } from "../utils/save-block";
import { useMetadata } from "./useMetadata";

export function useTrackedEntitySaveBlock() {
    const { program, trackedEntityAttributes } = useMetadata();
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult | null>(
        null,
    );

    const metadataMandatoryIds = useMemo(
        () =>
            (program?.programTrackedEntityAttributes ?? [])
                .filter((ptea) => ptea.mandatory)
                .map((ptea) => ptea.trackedEntityAttribute.id),
        [program],
    );

    const labels = useMemo(() => {
        const m = new Map<string, string>();
        for (const tea of trackedEntityAttributes.values()) {
            m.set(tea.id, tea.displayFormName || tea.name);
        }
        return m;
    }, [trackedEntityAttributes]);

    const saveBlockFor = useCallback(
        (values: Record<string, unknown>): SaveBlock =>
            computeSaveBlock({
                metadataMandatoryIds,
                ruleMandatoryIds: ruleResult?.mandatoryFields ?? [],
                hiddenIds: ruleResult?.hiddenFields ?? [],
                values,
                labels,
                errors: (ruleResult?.errors ?? []).map((e) => e.content),
            }),
        [metadataMandatoryIds, ruleResult, labels],
    );

    return { saveBlockFor, onRuleResult: setRuleResult };
}
