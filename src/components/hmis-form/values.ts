import type {
    HmisCellConfig,
    HmisEditableScope,
    HmisFormValues,
    HmisRowConfig,
} from "@/form-configs/types";
import { isPeriodFullyPast } from "@/utils/periods";

const SEPARATOR = "_";

/** A value's key in the form's values: data element, category option combo, attribute option combo. */
export function dataValueKey(dataElement: string, categoryOptionCombo: string, attributeOptionCombo: string) {
    return `${dataElement}${SEPARATOR}${categoryOptionCombo}${SEPARATOR}${attributeOptionCombo}`;
}

/** What a cell accepts: digits only. */
export function cleanNumericValue(raw: unknown) {
    if (raw === null || raw === undefined) return "";
    return String(raw).replace(/[^\d]/g, "");
}

/**
 * The verify button for a report: it can be used only by a verifier, on a
 * writable report whose period has fully ended. Lacking the role is explained
 * first, since waiting for the period wouldn't help.
 */
export function verifyButtonState({
    period,
    readOnly,
    isVerified,
    canVerify,
}: {
    period?: string;
    readOnly: boolean;
    isVerified: boolean;
    canVerify: boolean;
}): { label: string; disabled: boolean; title?: string } {
    const periodBlocked = !period || !isPeriodFullyPast(period);
    const disabled = readOnly || periodBlocked || !canVerify;
    if (!canVerify) {
        return {
            label: "Verifier role required",
            disabled,
            title: "Your role can't verify reports. Ask an administrator.",
        };
    }
    if (isVerified) return { label: "Verified — Re-submit to Update", disabled };
    if (!period || !periodBlocked) return { label: "Mark Report as Verified", disabled };
    return {
        label: "Waiting for period to end",
        disabled,
        title: readOnly
            ? undefined
            : "This period has not yet fully ended — verification will be enabled once the period is in the past.",
    };
}

/** A verification time as YYYY-MM-DD (as given, if it isn't a date). */
export function formatVerifiedAt(verifiedAt: string | number): string {
    const d = new Date(verifiedAt);
    if (Number.isNaN(d.getTime())) return String(verifiedAt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

/** Whether a form's editable scope lets this cell be edited (by its title). */
export function isCellEditable(cell: HmisCellConfig, scope: HmisEditableScope | undefined): boolean {
    if (!scope || scope.mode === "all") return true;
    if (scope.mode === "none") return false;
    if (typeof cell.title !== "string" || cell.title.length === 0) return false;
    return scope.allow.some((re) => re.test(cell.title!));
}

/** The values to submit: every filled-in one, split back into its ids. */
export function toDataValues(values: HmisFormValues) {
    return Array.from(values.entries())
        .filter(([, value]) => value !== "" && value != null)
        .map(([key, value]) => {
            const [dataElement, categoryOptionCombo, attributeOptionCombo] = key.split(SEPARATOR);
            return { dataElement, categoryOptionCombo, attributeOptionCombo, value };
        });
}

/**
 * Columns still covered by a cell spanning rows from above, and for how
 * many more rows (1 = this row only).
 */
export type RowSpanCarry = Map<number, number>;

/**
 * The grid column each of a row's cells starts at — skipping columns a
 * cell above still covers — and the carry for the next row. Used only to
 * decide which cells are sticky (frozen columns); the browser lays out the
 * spans itself.
 *
 * Kept as it was: a cell spanning n rows is carried over n - 2 further
 * rows, not n - 1 (a `rowSpan: 2` cell doesn't hold its column in the next
 * row), so a cell after it can be marked sticky at the wrong offset — see
 * wayfinder ticket "Split the HMIS form renderer".
 */
export function placeCells(row: HmisRowConfig, carry: RowSpanCarry): { startColumns: number[]; next: RowSpanCarry } {
    const covered = new Map(carry);
    let cursor = 0;
    const skipCovered = () => {
        while (covered.has(cursor)) cursor++;
    };
    skipCovered();
    const startColumns = row.cells.map((cell) => {
        const start = cursor;
        const span = cell.colSpan ?? 1;
        const rowSpan = cell.rowSpan ?? 1;
        for (let i = 0; i < span; i++) {
            if (rowSpan > 1) covered.set(start + i, rowSpan - 1);
        }
        cursor += span;
        skipCovered();
        return start;
    });
    const next: RowSpanCarry = new Map();
    for (const [column, remaining] of covered) {
        if (remaining > 1) next.set(column, remaining - 1);
    }
    return { startColumns, next };
}
