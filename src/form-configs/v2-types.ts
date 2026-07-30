import type { HmisEditableScope } from "./types";

export type CellV2 = {
    kind: "label" | "field";
    text?: string;
    dataElement?: string;
    categoryOptionCombo?: string;
    attributeOptionCombo?: string;
    disabled?: boolean;
    total?: boolean;
    rowSpan?: number;
    colSpan?: number;
    style?: {
        background?: string;
        align?: "left" | "center" | "right";
        verticalAlign?: "top" | "middle" | "bottom";
    };
};

export type ColumnV2 = {
    key: string;
    title?: string;
    width?: number;
    children?: ColumnV2[];
};

export type RowV2 = {
    key: string;
    type?: "data" | "label" | "subhead";
    cells: Record<string, CellV2>;
};

export type SectionV2 = {
    key: string;
    title: string;
    frozenColumns?: number;
    columns: ColumnV2[];
    rows: RowV2[];
};

export type SectionSlot =
    | { kind: "inline"; section: SectionV2 }
    | {
          kind: "ref";
          templateId: string;
          overrides?: Partial<Pick<SectionV2, "title" | "frozenColumns">>;
      };

export type TabV2 = { key: string; label: string; sections: SectionSlot[] };

export type FormV2 = {
    id: string;
    title: string;
    editableScope?: HmisEditableScope;
    tabs: TabV2[];
};

export type FormConfigDoc = {
    version: 2;
    forms: Record<string, FormV2>;
    templates: Record<string, SectionV2>;
};

export const EMPTY_FORM_CONFIG_DOC: FormConfigDoc = {
    version: 2,
    forms: {},
    templates: {},
};
