import { useCallback, useState } from "react";
import type { ProgramRuleResult } from "@/schemas";
import { computeSaveBlock, type SaveBlock } from "@/utils/save-block";
import { useMetadata } from "./useMetadata";
import { useTrackedEntityFieldMetadata } from "./useTrackedEntityFieldMetadata";

export function useTrackedEntitySaveBlock(
    seedValues?: Record<string, unknown>,
) {
    const { program, trackedEntityAttributes } = useMetadata();
    const [ruleResult, setRuleResult] = useState<ProgramRuleResult | null>(
        null,
    );

    const { mandatoryIds: metadataMandatoryIds, labels } = useTrackedEntityFieldMetadata(
        program, trackedEntityAttributes,
    );

    const saveBlockFor = useCallback(
        (values: Record<string, unknown>): SaveBlock =>
            computeSaveBlock({
                metadataMandatoryIds,
                ruleMandatoryIds: ruleResult?.mandatoryFields ?? [],
                hiddenIds: ruleResult?.hiddenFields ?? [],
                values: { ...(seedValues ?? {}), ...values },
                labels,
                errors: (ruleResult?.errors ?? []).map((e) => e.content),
            }),
        [metadataMandatoryIds, ruleResult, labels, seedValues],
    );

    return { saveBlockFor, ruleResult, onRuleResult: setRuleResult };
}
