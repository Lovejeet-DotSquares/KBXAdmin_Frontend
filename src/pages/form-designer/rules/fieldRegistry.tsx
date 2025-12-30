import type { FieldType } from "../types/formTypes";

/* ------------------------------------
 * FIELD CATEGORY
 * ------------------------------------ */
export type FieldCategory =
    | "input"
    | "choice"
    | "media"
    | "static"
    | "layout"
    | "advanced";

/* ------------------------------------
 * FIELD CONFIG
 * ------------------------------------ */
export type FieldConfig = {
    category: FieldCategory;

    /** HTML input type (for runner) */
    inputType?: string;

    /** Static content (no data stored) */
    static?: boolean;

    /** Complex renderer (table, calculated, signature) */
    complex?: boolean;

    /** Can store value */
    hasKey?: boolean;

    /** UI capabilities */
    hasLabel?: boolean;
    hasPlaceholder?: boolean;
    hasHelperText?: boolean;
    hasDefault?: boolean;

    /** Validation capabilities */
    hasValidation?: boolean;
    hasMinMax?: boolean;
    hasLength?: boolean;
    hasPattern?: boolean;

    /** Options */
    hasOptions?: boolean;
};

/* ------------------------------------
 * FIELD REGISTRY
 * ------------------------------------ */
export const FieldRegistry: Record<FieldType, FieldConfig> = {
    /* ---------------- INPUT ---------------- */
    text: {
        category: "input",
        inputType: "text",
        hasKey: true,
        hasLabel: true,
        hasPlaceholder: true,
        hasHelperText: true,
        hasDefault: true,
        hasValidation: true,
        hasLength: true,
        hasPattern: true,
    },

    textarea: {
        category: "input",
        inputType: "textarea",
        hasKey: true,
        hasLabel: true,
        hasHelperText: true,
        hasDefault: true,
        hasValidation: true,
        hasLength: true,
    },

    number: {
        category: "input",
        inputType: "number",
        hasKey: true,
        hasLabel: true,
        hasHelperText: true,
        hasDefault: true,
        hasValidation: true,
        hasMinMax: true,
    },

    email: {
        category: "input",
        inputType: "email",
        hasKey: true,
        hasLabel: true,
        hasHelperText: true,
        hasDefault: true,
        hasValidation: true,
        hasPattern: true,
    },

    phone: {
        category: "input",
        inputType: "tel",
        hasKey: true,
        hasLabel: true,
        hasHelperText: true,
        hasDefault: true,
        hasValidation: true,
        hasPattern: true,
    },

    date: {
        category: "input",
        inputType: "date",
        hasKey: true,
        hasLabel: true,
        hasDefault: true,
    },
    hidden: {
        category: "input",
        inputType: "hidden",
        hasKey: true,
        hasDefault: true,
    },

    /* ---------------- CHOICE ---------------- */
    select: {
        category: "choice",
        inputType: "select",
        hasKey: true,
        hasLabel: true,
        hasOptions: true,
        hasDefault: true,
        hasValidation: true,
    },

    multiselect: {
        category: "choice",
        inputType: "select",
        hasKey: true,
        hasLabel: true,
        hasOptions: true,
        hasDefault: true,
    },

    radio: {
        category: "choice",
        inputType: "radio",
        hasKey: true,
        hasLabel: true,
        hasOptions: true,
        hasDefault: true,
    },

    checkbox: {
        category: "choice",
        inputType: "checkbox",
        hasKey: true,
        hasLabel: true,
        hasOptions: true,
        hasDefault: true,
    },

    toggle: {
        category: "choice",
        inputType: "checkbox",
        hasKey: true,
        hasLabel: true,
        hasDefault: true,
    },

    yesno: {
        category: "choice",
        inputType: "radio",
        hasKey: true,
        hasLabel: true,
        hasDefault: true,
    },

    /* ---------------- MEDIA ---------------- */
    file: {
        category: "media",
        inputType: "file",
        hasKey: true,
        hasLabel: true,
    },

    image: {
        category: "media",
        inputType: "file",
        hasKey: true,
        hasLabel: true,
    },

    signature: {
        category: "media",
        complex: true,
        hasKey: true,
        hasLabel: true,
    },

    /* ---------------- STATIC ---------------- */
    paragraph: {
        category: "static",
        static: true,
        hasLabel: true,
    },

    label: {
        category: "static",
        static: true,
        hasLabel: true,
    },

    /* ---------------- LAYOUT ---------------- */
    heading1: {
        category: "layout",
        static: true,
        hasLabel: true,
    },

    heading2: {
        category: "layout",
        static: true,
        hasLabel: true,
    },

    heading3: {
        category: "layout",
        static: true,
        hasLabel: true,
    },

    numbered: {
        category: "layout",
        static: true,
        hasLabel: true,
    },

    pagebreak: {
        category: "layout",
        static: true,
    },

    /* ---------------- ADVANCED ---------------- */
    table: {
        category: "advanced",
        complex: true,
        hasKey: true,
        hasLabel: true,
    },

    calculated: {
        category: "advanced",
        complex: true,
        hasKey: true,
        hasLabel: true,
    }
};
