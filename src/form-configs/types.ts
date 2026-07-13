export type HmisCellKind = "label" | "field";



export type setValue = (values: {
		dataElement: string;
		categoryOptionCombo: string;
		attributeOptionCombo: string;
		value: string;
}) => void;

export type HmisFormValues = Map<string, string>;
export interface HmisNativeFormCell {
    label?: string;
    dataElement?: string;
    categoryOptionCombo?: string;
    attributeOptionCombo?: string;
    title?: string;
    inputId?: string;
    inputName?: string;
    isTotal?: boolean;
    disabled?: boolean;
    colSpan?: number;
    rowSpan?: number;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
    background?: string;
    width?: string;
    className?: string;
}

export interface HmisNativeFormRow {
    key: string;
    className?: string;
    cells: HmisNativeFormCell[];
}

export interface HmisNativeFormSection {
    key: string;
    title: string;
    colSpan?: number;
    width?: string;
    rows: HmisNativeFormRow[];
}

export interface HmisNativeFormTab {
    key: string;
    label: string;
    sections: HmisNativeFormSection[];
}

export interface HmisNativeFormDefinition {
    id: string;
    title: string;
    tabs: HmisNativeFormTab[];
}

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
    };
}

export interface HmisRowConfig {
    key: string;
    type: HmisRowType;
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
    columns: HmisColumnConfig[];
    rows: HmisRowConfig[];
}

export interface HmisTabConfig {
    key: string;
    label: string;
    sections: HmisSectionConfig[];
}

export interface HmisFormConfig {
    id: string;
    title: string;
    tabs: HmisTabConfig[];
}
