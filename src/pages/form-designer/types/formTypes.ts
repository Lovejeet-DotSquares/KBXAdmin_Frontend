import type { RuleDefinition } from "./ruleTypes";

/* ------------------------------------
 * FIELD TYPE
 * ------------------------------------ */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "hidden"
  | "date"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "toggle"
  | "yesno"
  | "file"
  | "image"
  | "signature"
  | "label"
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "numbered"
  | "pagebreak"
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
 * VALIDATION
 * ------------------------------------ */
export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | { type: "length"; min?: number; max?: number; message?: string }
  | { type: "pattern"; regex: string; message?: string }
  | {
      type: "format";
      value: "email" | "phone" | "numeric" | "url";
      message?: string;
    };

/* ------------------------------------
 * VISIBILITY
 * ------------------------------------ */
export interface VisibilityCondition {
  id: string;
  fieldKey: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty";
  value?: any;
}

export interface VisibilityGroup {
  id: string;
  logic: "AND" | "OR";
  conditions: VisibilityCondition[];
  action: "show" | "hide" | "enable" | "disable";
}

/* ------------------------------------
 * ACTIONS
 * ------------------------------------ */
export interface FieldAction {
  triggerClause?: boolean;
  actionFlowId?: string;
}

export interface TableColumn {
  id: string;
  label: string;
  fieldType: "text" | "number" | "date";
}

export interface TableRow {
  id: string;
  cells: Record<string, any>; // key = columnId
}

export interface TableConfig {
  columns: TableColumn[];
  rowsData: TableRow[];
}

/* ------------------------------------
 * NUMBERED LIST
 * ------------------------------------ */
export interface NumberedItem {
  id: string;
  text: string;
  subItems?: NumberedItem[];
}

/* ------------------------------------
 * FORM FIELD
 * ------------------------------------ */
export interface FormField {
  id: string;
  type: FieldType;

  key?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;

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
  listStyle?: "numeric" | "roman" | "alphabetic";

  validationRules?: ValidationRule[];
  visibilityConditions?: VisibilityGroup[];
  actions?: FieldAction;

  table?: TableConfig;

  accept?: string;
  multiple?: boolean;
  formula?: string;
  dependencies?: string[];
  optionsMode?: "manual" | "master";
  masterOptionsKey?: "yesno";
  /* 🎯 RULES (NEW SOURCE OF TRUTH) */
  rules?: RuleDefinition[];
  style?: {
    fontSize?: number;
    fontWeight?: "normal" | "bold" | "lighter";
    textColor?: string;
    textAlign?: "left" | "center" | "right";
    fontFamily?: string;
  };
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
