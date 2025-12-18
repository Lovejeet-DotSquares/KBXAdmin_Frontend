/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "yesno"
  | "date"
  | "file"
  | "label"
  | "static"
  | "image"
  | "button"
  | "signature"
  | "paragraph"
  | "richtext"
  | "table"
  | "heading1"
  | "heading2"
  | "heading3"
  | "subtitle"
  | "divider"
  | "numbered";
export interface FieldOption {
  id: string;
  label: string;
  key: string;
  value: string;
}

export interface FormField {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  options?: FieldOption[];
  number?: string; // Add this line for numbered field type

  // table-specific
  columns?: { id: string; key: string; label: string }[];
  rows?: number;
  rowsData?: any[];

  // numbered list items
  items?: string[];
  // rules & validation
  visibilityConditions?: any[];
  validationRules?: any[];
}

export interface ClauseItem {
  id: string;
  title: string;
  body: string;
}
