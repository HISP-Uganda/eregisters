export type HmisCellKind = "label" | "field";



export type setValue = (values: {
		dataElement: string;
		categoryOptionCombo: string;
		attributeOptionCombo: string;
		value: string;
}) => void;

export type HmisFormValues = Map<string, string>;

export type HmisRowType = "section" | "subhead" | "data" | "label";

export interface HmisCellConfig {
    key: string;
    kind: HmisCellKind;
    text?: string;
    title?: string;
    dataElement?: string;
    categoryOptionCombo?: string;
    attributeOptionCombo?: string;
    inputId?: string;
    disabled?: boolean;
    total?: boolean;
    colSpan?: number;
    rowSpan?: number;
    style?: {
        align?: string;
        background?: string;
        width?: string;
        verticalAlign?: "top" | "middle" | "bottom";
    };
}

export interface HmisRowConfig {
    key: string;
    type?: HmisRowType;
    cells: HmisCellConfig[];
}

export interface HmisColumnConfig {
    key: string;
    index: number;
    width?: number;
}

export interface HmisSectionConfig {
    key: string;
    title: string;
    columnCount: number;
    columns?: HmisColumnConfig[];
    /** Freeze the first N underlying columns during horizontal scroll. Defaults to 1. */
    frozenColumns?: number;
    rows: HmisRowConfig[];
}

export interface HmisTabConfig {
    key: string;
    label: string;
    sections: HmisSectionConfig[];
}

export type HmisEditableScope =
    | { mode: "all" }
    | { mode: "none" }
    | { mode: "allowlist"; allow: RegExp[] };

export interface HmisFormConfig {
    id: string;
    title: string;
    tabs: HmisTabConfig[];
    editableScope?: HmisEditableScope;
}
