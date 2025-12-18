import type { FormField } from "./formTypes";

export interface DesignerColumn {
  id: string;
  width: number; // 1..12
  fields: FormField[];
}

export interface DesignerRow {
  id: string;
  columns: DesignerColumn[];
}

export interface FormLayout {
  rows: DesignerRow[];
}
