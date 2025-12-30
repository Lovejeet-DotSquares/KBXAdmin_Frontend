/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

/* ---------------- NORMALIZER ---------------- */

const normalize = (rows: any[] = []) => {
    return {
        version: "1.1",
        generatedAt: new Date().toISOString(),
        meta: {
            engine: "KBX-Form-Engine",
            mode: "designer",
        },

        rows: rows.map((r) => ({
            id: r.id,

            /* -------- ROW CONFIG -------- */
            style: {
                background: r.style?.background ?? "transparent",
                padding: r.style?.padding ?? "0",
                margin: r.style?.margin ?? "0",
                border: r.style?.border ?? "none",
            },

            hidden: r.hidden ?? false,

            responsive: {
                desktop: r.responsive?.desktop ?? true,
                tablet: r.responsive?.tablet ?? true,
                mobile: r.responsive?.mobile ?? true,
            },

            /* -------- COLUMNS -------- */
            columns: (r.columns ?? []).map((c: any) => ({
                id: c.id,

                layout: {
                    widthUnits: c.width ?? 12,
                    minWidth: c.minWidth ?? null,
                    maxWidth: c.maxWidth ?? null,
                    align: c.align ?? "left",
                },

                style: {
                    padding: c.style?.padding ?? "8px",
                    background: c.style?.background ?? "transparent",
                    border: c.style?.border ?? "none",
                },

                /* -------- FIELDS -------- */
                fields: (c.fields ?? []).map((f: any) => ({
                    id: f.id,
                    key: f.key,
                    type: f.type,
                    label: f.label,

                    value: {
                        default: f.defaultValue ?? null,
                        readonly: f.readonly ?? false,
                        disabled: f.disabled ?? false,
                        required: f.required ?? false,
                    },

                    ui: {
                        placeholder: f.placeholder ?? "",
                        helperText: f.helperText ?? "",
                        layout: f.layout ?? "stacked", // inline | stacked | fullWidth
                    },

                    style: {
                        fontSize: f.style?.fontSize ?? 14,
                        fontWeight: f.style?.fontWeight ?? "normal",
                        textColor: f.style?.textColor ?? "#000",
                        backgroundColor: f.style?.backgroundColor ?? "#fff",
                        border: f.style?.border ?? "1px solid #ced4da",
                        borderRadius: f.style?.borderRadius ?? "4px",
                        padding: f.style?.padding ?? "6px 8px",
                        margin: f.style?.margin ?? "0 0 12px 0",
                        textAlign: f.style?.textAlign ?? "left",
                        fontFamily: f.style?.fontFamily ?? "inherit",
                    },

                    options: f.options ?? [],

                    table: f.table ?? null,

                    validation: {
                        rules: f.validationRules ?? [],
                    },

                    visibility: {
                        groups: f.visibilityConditions ?? [],
                        defaultVisible: f.hidden ? false : true,
                    },

                    actions: f.actions ?? null,

                    meta: {
                        createdAt: f.meta?.createdAt ?? null,
                        updatedAt: f.meta?.updatedAt ?? null,
                        internal: f.meta?.internal ?? false,
                    },
                })),
            })),
        })),
    };
};

/* ---------------- PANEL ---------------- */

const JsonEnginePanel: React.FC<{ rows: any[] }> = ({ rows }) => {
    const json = React.useMemo(() => normalize(rows), [rows]);

    return (
        <div className="p-3">
            <div className="fw-semibold mb-2">
                JSON Engine (Full Config)
            </div>

            <pre
                className="bg-dark text-light p-3 rounded small"
                style={{
                    maxHeight: 400,
                    overflow: "auto",
                    fontSize: "12px",
                }}
            >
                {JSON.stringify(json, null, 2)}
            </pre>
        </div>
    );
};

export default JsonEnginePanel;
