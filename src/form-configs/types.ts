export type HmisCellKind = 'label' | 'field';
export type HmisRowType = 'section' | 'subhead' | 'data' | 'label';

export interface HmisCellConfig {
  key: string;
  kind: HmisCellKind;
  text?: string;
  title?: string;
  dataElement?: string;
  categoryOptionCombo?: string;
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
