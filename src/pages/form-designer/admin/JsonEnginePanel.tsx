/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const normalize = (rows: any[]) => ({
    version: "1.0",
    generatedAt: new Date().toISOString(),
    rows: rows.map((r) => ({
        id: r.id,
        columns: r.columns.map((c: any) => ({
            id: c.id,
            width: c.width,
            fields: c.fields.map((f: any) => ({
                id: f.id,
                type: f.type,
                key: f.key,
                label: f.label,
                defaultValue: f.defaultValue,
                required: f.required,
                disabled: f.disabled,
                readonly: f.readonly,
                options: f.options,
                validationRules: f.validationRules,
                visibilityConditions: f.visibilityConditions,
                actions: f.actions,
                tableConfig: f.tableConfig,
            })),
        })),
    })),
});

const JsonEnginePanel: React.FC<{ rows: any[] }> = ({ rows }) => {
    return (
        <div className="p-3">
            <div className="fw-semibold mb-2">JSON Engine</div>
            <pre className="bg-dark text-light p-2 rounded" style={{ maxHeight: 350, overflow: "auto" }}>
                {JSON.stringify(normalize(rows), null, 2)}
            </pre>
        </div>
    );
};

export default JsonEnginePanel;
