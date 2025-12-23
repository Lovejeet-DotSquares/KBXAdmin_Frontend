/* eslint-disable @typescript-eslint/no-explicit-any */

/* ------------------------------------
 * FIELD TYPE
 * ------------------------------------ */
export type FieldType =
  /* -------- INPUT -------- */
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "hidden"
  | "date"
  /* -------- CHOICE -------- */
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "toggle"
  | "yesno"

  /* -------- MEDIA -------- */
  | "file"
  | "image"
  | "signature"

  /* -------- STATIC CONTENT -------- */
  | "label"
  | "paragraph"

  /* -------- LAYOUT -------- */
  | "heading1"
  | "heading2"
  | "heading3"
  | "numbered"
  | "pagebreak"

  /* -------- ADVANCED -------- */
  | "table"
  | "calculated";

/* ------------------------------------
 * OPTION
 * ------------------------------------ */
export interface FieldOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

/* ------------------------------------
 * VALIDATION RULES
 * ------------------------------------ */
export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | {
      type: "length";
      min?: number;
      max?: number;
      message?: string;
    }
  | { type: "pattern"; regex: string; message?: string }
  | {
      type: "format";
      value: "email" | "phone" | "numeric" | "url";
      message?: string;
    };

/* ------------------------------------
 * VISIBILITY / STATE RULES
 * ------------------------------------ */
export type VisibilityOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than"
  | "is_empty"
  | "is_not_empty";

export interface VisibilityCondition {
  id: string;
  fieldKey: string;
  operator: VisibilityOperator;
  value?: any;
}

export interface VisibilityGroup {
  id: string;
  logic: "AND" | "OR";
  conditions: VisibilityCondition[];

  /** What to do when condition matches */
  action: "show" | "hide" | "enable" | "disable";
}

/* ------------------------------------
 * ACTION / WORKFLOW
 * ------------------------------------ */
export interface FieldAction {
  triggerClause?: boolean; // insert legal clause
  actionFlowId?: string; // workflow / automation id
  emitEvent?: string; // event name for engine
}

/* ------------------------------------
 * TABLE CONFIG
 * ------------------------------------ */
export interface TableColumn {
  id: string;
  label: string;
  key: string;
  type?: FieldType;
}

export interface TableConfig {
  columns: TableColumn[];
  allowAddRow?: boolean;
  allowDeleteRow?: boolean;
  minRows?: number;
  maxRows?: number;
}
export interface NumberedItem {
  id: string;
  text: string;
  subItems?: NumberedItem[];
}
/* ------------------------------------
 * FORM FIELD (CORE)
 * ------------------------------------ */
export interface FormField {
  id: string;
  type: FieldType;

  /* Identity */
  key?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;

  /* Defaults */
  defaultValue?: any;

  /* State */
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;

  /* Formatting */
  format?: "none" | "email" | "phone" | "numeric" | "url";
  variant?: "standard" | "outlined" | "filled";

  /* Options */
  options?: FieldOption[];

  /* Numeric / Range */
  min?: number;
  max?: number;
  step?: number;

  /* List / Content */
  items?: NumberedItem[];
  listStyle?: "numeric" | "roman" | "alphabetic" | "hierarchy";

  /* Validation */
  validationRules?: ValidationRule[];

  /* Visibility & State Logic */
  visibilityConditions?: VisibilityGroup[];

  /* Actions & Workflows */
  actions?: FieldAction;

  /* Table */
  tableConfig?: TableConfig;

  /* Calculated */
  formula?: string;
  dependencies?: string[];
  accept?: any;
  multiple?: any;
  optionsMode?: "master" | "manual";
  masterOptionsKey?: "yesno" | "boolean";
}

/* ------------------------------------
 * FORM META
 * ------------------------------------ */
export interface FormSummary {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
  lockedBy?: string;
}
