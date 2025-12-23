/* eslint-disable @typescript-eslint/no-explicit-any */

// ------------------------------------
// FIELD TYPE
// ------------------------------------
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "password"
  | "phone"
  | "url"
  | "currency"
  | "hidden"
  | "autocomplete"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "toggle"
  | "yesno"
  | "rating"
  | "slider"
  | "date"
  | "time"
  | "color"
  | "file"
  | "signature"
  | "image"
  | "label"
  | "paragraph"
  | "richtext"
  | "html"
  | "button"
  | "divider"
  | "spacer"
  | "pagebreak"
  | "alert"
  | "heading1"
  | "heading2"
  | "heading3"
  | "subtitle"
  | "numbered"
  | "table"
  | "address"
  | "repeater"
  | "calculated"
  | "conditional"
  | "captcha"
  | "map"
  | "qrcode"
  | "barcode";

// ------------------------------------
// OPTION
// ------------------------------------
export interface FieldOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

// ------------------------------------
// VALIDATION
// ------------------------------------
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

// ------------------------------------
// VISIBILITY RULES
// ------------------------------------
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
  action: "show" | "hide" | "enable" | "disable";
}

// ------------------------------------
// FORM FIELD
// ------------------------------------
export interface FormField {
  id: string;
  type: FieldType;

  key?: string;
  label?: string;

  placeholder?: string;
  helperText?: string;
  defaultValue?: any;

  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;

  format?: "none" | "email" | "phone" | "numeric" | "url";
  variant?: "standard" | "outlined" | "filled";

  options?: FieldOption[];

  min?: number;
  max?: number;
  step?: number;

  items?: string[];
  listStyle?: "numeric" | "roman" | "alphabetic" | "hierarchy";

  validationRules?: ValidationRule[];
  visibilityConditions?: VisibilityGroup[];
}

// ------------------------------------
// FORM META
// ------------------------------------
export interface FormSummary {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
  lockedBy?: string;
}
