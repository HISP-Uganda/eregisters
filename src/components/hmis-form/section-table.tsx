import { InputNumber } from "antd";
import React from "react";
import type {
    HmisCellConfig,
    HmisEditableScope,
    HmisFormValues,
    HmisRowConfig,
    HmisSectionConfig,
    setValue,
} from "../../form-configs/types";
import { cleanNumericValue, dataValueKey, isCellEditable, placeCells, RowSpanCarry } from "./values";

const STICKY_COL_WIDTH = 80;

const ROW_CLASS: Record<string, string> = {
    section: "hmis105-section-row",
    subhead: "hmis105-subhead-row",
    label: "hmis105-label-row",
};

type CellContext = {
    values: HmisFormValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
};

function cellStyle(cell: HmisCellConfig): React.CSSProperties {
    return {
        textAlign: cell.style?.align as React.CSSProperties["textAlign"],
        background: cell.style?.background,
        width: cell.style?.width,
        verticalAlign: cell.style?.verticalAlign,
    };
}

/** A number input for one data value; a disabled blank one when the cell has none. */
function FieldCell({ cell, editableScope, values, readOnly, setValue, attributeOptionCombo }: CellContext & {
    cell: HmisCellConfig;
    editableScope: HmisEditableScope | undefined;
}) {
    if (!cell.dataElement || !cell.categoryOptionCombo) {
        return <InputNumber className="hmis105-field" disabled style={{ width: "100%", textAlign: "center" }} />;
    }
    const key = dataValueKey(cell.dataElement, cell.categoryOptionCombo, attributeOptionCombo);
    return (
        <InputNumber
            className="hmis105-field"
            inputMode="numeric"
            title={cell.title ?? key}
            value={values.getOrInsert(key, "")}
            disabled={readOnly || !!cell.disabled || !isCellEditable(cell, editableScope)}
            style={{ width: "100%" }}
            onChange={(value) =>
                setValue({
                    attributeOptionCombo: cell.attributeOptionCombo!,
                    dataElement: cell.dataElement!,
                    categoryOptionCombo: cell.categoryOptionCombo!,
                    value: cleanNumericValue(value),
                })
            }
        />
    );
}

function Cell({ cell, stickyLeft, editableScope, ...context }: CellContext & {
    cell: HmisCellConfig;
    stickyLeft?: number;
    editableScope: HmisEditableScope | undefined;
}) {
    const sticky = stickyLeft !== undefined;
    const props = {
        colSpan: cell.colSpan,
        rowSpan: cell.rowSpan,
        title: cell.title,
        className: sticky ? "hmis105-sticky-col" : undefined,
    };
    if (cell.kind === "field") {
        return (
            <td {...props} style={{ ...cellStyle(cell), textAlign: "center", ...(sticky ? { left: stickyLeft } : {}) }}>
                <FieldCell cell={cell} editableScope={editableScope} {...context} />
            </td>
        );
    }
    return (
        <td {...props} style={{ ...cellStyle(cell), ...(sticky ? { left: stickyLeft } : {}) }}>
            {cell.text}
        </td>
    );
}

/** Renders the rows in order, carrying row spans from each to the next. */
function renderRows(
    rows: HmisRowConfig[],
    carry: { current: RowSpanCarry },
    frozenColumns: number,
    editableScope: HmisEditableScope | undefined,
    context: CellContext,
) {
    return rows.map((row) => {
        const { startColumns, next } = placeCells(row, carry.current);
        carry.current = next;
        return (
            <tr key={row.key} className={ROW_CLASS[row.type ?? ""] ?? "hmis105-data-row"}>
                {row.cells.map((cell, index) => {
                    const start = startColumns[index];
                    return (
                        <Cell
                            key={`${row.key}-${cell.key}-${index}`}
                            cell={cell}
                            stickyLeft={frozenColumns > 0 && start < frozenColumns ? start * STICKY_COL_WIDTH : undefined}
                            editableScope={editableScope}
                            {...context}
                        />
                    );
                })}
            </tr>
        );
    });
}

/**
 * One section of an HMIS form as a table: its title, then its leading
 * "subhead" rows as the header (always editable-agnostic), then the rest,
 * which the form's editable scope applies to. The first `frozenColumns`
 * columns stay put when scrolling sideways.
 */
export function SectionTable({ section, editableScope, ...context }: CellContext & {
    section: HmisSectionConfig;
    editableScope: HmisEditableScope | undefined;
}) {
    const frozenColumns = section.frozenColumns ?? 1;
    const firstBodyRow = section.rows.findIndex((r) => r.type !== "subhead");
    const headRows = firstBodyRow === -1 ? section.rows : section.rows.slice(0, firstBodyRow);
    const bodyRows = firstBodyRow === -1 ? [] : section.rows.slice(firstBodyRow);
    const carry = { current: new Map() as RowSpanCarry };

    return (
        <table className="hmis105-form-table">
            <thead>
                <tr className="hmis105-section-title-row">
                    <td
                        colSpan={section.columnCount}
                        className={frozenColumns > 0 ? "hmis105-sticky-col" : undefined}
                        style={frozenColumns > 0 ? { left: 0 } : undefined}
                    >
                        {section.title}
                    </td>
                </tr>
                {renderRows(headRows, carry, frozenColumns, { mode: "all" }, context)}
            </thead>
            <tbody>{renderRows(bodyRows, carry, frozenColumns, editableScope, context)}</tbody>
        </table>
    );
}
