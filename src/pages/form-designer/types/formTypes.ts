/* eslint-disable @typescript-eslint/no-explicit-any */

// ------------------------------------
// FIELD TYPE (SINGLE SOURCE OF TRUTH)
// ------------------------------------
export type FieldType =
  // ---------------- BASIC INPUTS ----------------
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

  // ---------------- OPTIONS ----------------
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "toggle"
  | "yesno"
  | "rating"
  | "slider"

  // ---------------- DATE / MEDIA ----------------
  | "date"
  | "time"
  | "color"
  | "file"
  | "signature"
  | "image"

  // ---------------- STATIC / CONTENT ----------------
  | "label"
  | "paragraph"
  | "richtext"
  | "html"
  | "button"
  | "divider"
  | "spacer"
  | "pagebreak"
  | "alert"

  // ---------------- HEADINGS ----------------
  | "heading1"
  | "heading2"
  | "heading3"
  | "subtitle"

  // ---------------- LISTS ----------------
  | "numbered"

  // ---------------- ADVANCED / COMPLEX ----------------
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
// OPTION (SELECT / RADIO / CHECKBOX)
// ------------------------------------
export interface FieldOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

// ------------------------------------
// TABLE COLUMN DEFINITION
// ------------------------------------
export interface TableColumn {
  id: string;
  key: string;
  label: string;
  type?: FieldType;
  width?: number;
  required?: boolean;
}

// ------------------------------------
// VALIDATION RULE (RULE ENGINE READY)
// ------------------------------------
export type ValidationRule =
  | {
      type: "required";
      message?: string;
    }
  | {
      type: "min";
      value: number;
      message?: string;
    }
  | {
      type: "max";
      value: number;
      message?: string;
    }
  | {
      type: "length";
      min?: number;
      max?: number;
      message?: string;
    }
  | {
      type: "pattern";
      regex: string;
      message?: string;
    }
  | {
      type: "format";
      value: "email" | "phone" | "numeric" | "url";
      message?: string;
    };

// ------------------------------------
// VISIBILITY / CONDITION RULE
// ------------------------------------
export interface VisibilityCondition {
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
  action: "show" | "hide" | "enable" | "disable";
}

// ------------------------------------
// FORM FIELD (MAIN ENTITY)
// ------------------------------------
export interface FormField {
  id: string;
  type: FieldType;

  /* ---------- KEY / LABEL ---------- */
  key?: string;
  label?: string;

  /* ---------- COMMON ---------- */
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;

  /* ---------- FORMAT (✅ ADD THIS) ---------- */
  format?: "none" | "email" | "phone" | "numeric" | "url";

  /* ---------- UI VARIANT ---------- */
  variant?: "standard" | "outlined" | "filled";

  /* ---------- OPTIONS ---------- */
  options?: FieldOption[];

  /* ---------- NUMBER / SLIDER ---------- */
  min?: number;
  max?: number;
  step?: number;

  /* ---------- NUMBERED LIST ---------- */
  items?: string[];
  listStyle?: "numeric" | "roman" | "alphabetic" | "hierarchy";

  /* ---------- VALIDATION ---------- */
  validationRules?: ValidationRule[];

  /* ---------- VISIBILITY ---------- */
  visibilityConditions?: VisibilityCondition[];
}

// ------------------------------------
// RULE / CLAUSE (LEGAL / NUMBERED LIST)
// ------------------------------------
export interface ClauseItem {
  id: string;
  title?: string;
  body: string;
}
