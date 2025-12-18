// core/fieldRegistry.ts

export type FieldCategory =
    | "input"
    | "choice"
    | "media"
    | "static"
    | "layout"
    | "advanced";

export type FieldConfig = {
    category: FieldCategory;
    inputType?: string;
    static?: boolean;
    complex?: boolean;

    hasKey?: boolean;
    hasPlaceholder?: boolean;
    hasOptions?: boolean;
    hasValidation?: boolean;
    hasMinMax?: boolean;
};

export const FieldRegistry: Record<string, FieldConfig> = {
    // INPUT
    text: { category: "input", inputType: "text", hasKey: true, hasPlaceholder: true, hasValidation: true },
    textarea: { category: "input", inputType: "textarea", hasKey: true },
    number: { category: "input", inputType: "number", hasKey: true, hasMinMax: true },
    email: { category: "input", inputType: "email", hasKey: true },
    phone: { category: "input", inputType: "tel", hasKey: true },
    date: { category: "input", inputType: "date", hasKey: true },
    currency: { category: "input", inputType: "number", hasKey: true, hasMinMax: true },
    hidden: { category: "input", inputType: "hidden", hasKey: true },

    // CHOICE
    select: { category: "choice", inputType: "select", hasKey: true, hasOptions: true },
    multiselect: { category: "choice", inputType: "select", hasKey: true, hasOptions: true },
    radio: { category: "choice", inputType: "radio", hasKey: true, hasOptions: true },
    checkbox: { category: "choice", inputType: "checkbox", hasKey: true, hasOptions: true },
    toggle: { category: "choice", inputType: "checkbox", hasKey: true },
    yesno: { category: "choice", inputType: "radio", hasKey: true },


    // STATIC / LAYOUT
    heading1: { category: "layout", static: true },
    heading2: { category: "layout", static: true },
    heading3: { category: "layout", static: true },
    paragraph: { category: "static", static: true },
    label: { category: "static", static: true },
    numbered: { category: "layout", static: true },
    pagebreak: { category: "layout", static: true },

    // MEDIA / ADVANCED
    file: { category: "media", inputType: "file", hasKey: true },
    signature: { category: "media", complex: true },
    table: { category: "advanced", complex: true, hasKey: true },
    calculated: { category: "advanced", complex: true, hasKey: true },
};
