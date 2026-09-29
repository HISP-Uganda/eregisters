import React from "react";
import { holdUnsavedWork } from "@/app-update/unsaved-work";
import { draftId, getHmisDraft, upsertHmisDraft } from "@/db/hmis-drafts";
import type { HmisFormValues } from "@/form-configs/types";
import { dataValueKey } from "./values";

const DRAFT_DEBOUNCE_MS = 500;

/**
 * The form's values, saved as a local draft half a second after the last
 * change (a synced draft goes back to draft). While a save is pending the
 * forced app update counts it as unsaved work — and can flush it — and
 * leaving the form flushes it too.
 */
export function useHmisDraft({
    initialValues,
    dataSet,
    period,
    orgUnit,
    attributeOptionCombo,
}: {
    initialValues?: HmisFormValues;
    dataSet?: string;
    period?: string;
    orgUnit?: string;
    attributeOptionCombo: string;
}) {
    const [values, setValues] = React.useState<HmisFormValues>(initialValues ?? new Map());
    const draftKey =
        dataSet && period && orgUnit && attributeOptionCombo
            ? draftId({ dataSet, period, orgUnit, attributeOptionCombo })
            : undefined;

    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestValuesRef = React.useRef<HmisFormValues>(values);
    /** Set while a save is pending: releases the unsaved-work hold. */
    const releaseUnsavedRef = React.useRef<(() => void) | null>(null);

    React.useEffect(() => {
        latestValuesRef.current = values;
    }, [values]);

    const flushDraft = React.useCallback(
        async (nextValues: HmisFormValues) => {
            if (!draftKey || !dataSet || !period || !orgUnit) return;
            const existing = await getHmisDraft(draftKey);
            await upsertHmisDraft({
                id: draftKey,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo,
                values: Object.fromEntries(nextValues),
                isVerified: existing?.isVerified ?? false,
                verifiedAt: existing?.verifiedAt,
                updatedAt: Date.now(),
                syncStatus: existing?.syncStatus === "synced" ? "draft" : existing?.syncStatus ?? "draft",
            });
        },
        [draftKey, dataSet, period, orgUnit, attributeOptionCombo],
    );

    // On leaving the form, write a still-pending save now. If an earlier save
    // is still in flight, both carry the latest values and the store's `put`
    // is last-write-wins on the same key, so either order is safe.
    React.useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
                void flushDraft(latestValuesRef.current);
            }
            releaseUnsavedRef.current?.();
            releaseUnsavedRef.current = null;
        };
        // A lifecycle effect, not a data one: runs once, on unmount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setValue = React.useCallback(
        ({ dataElement, categoryOptionCombo, value }: { dataElement: string; categoryOptionCombo: string; value: string }) => {
            setValues((previous) => {
                const next = new Map(previous).set(dataValueKey(dataElement, categoryOptionCombo, attributeOptionCombo), value);
                if (timerRef.current !== null) clearTimeout(timerRef.current);
                const saveNow = async () => {
                    if (timerRef.current !== null) {
                        clearTimeout(timerRef.current);
                        timerRef.current = null;
                    }
                    try {
                        await flushDraft(latestValuesRef.current);
                    } finally {
                        releaseUnsavedRef.current?.();
                        releaseUnsavedRef.current = null;
                    }
                };
                if (!releaseUnsavedRef.current) {
                    releaseUnsavedRef.current = holdUnsavedWork("an HMIS report draft", saveNow);
                }
                latestValuesRef.current = next;
                timerRef.current = setTimeout(() => void saveNow(), DRAFT_DEBOUNCE_MS);
                return next;
            });
        },
        [attributeOptionCombo, flushDraft],
    );

    return { values, setValue };
}
