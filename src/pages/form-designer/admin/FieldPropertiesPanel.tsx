/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { FormField } from "../types/formTypes";
import ClauseLibraryPanel from "./ClauseLibraryPanel";

interface Props {
    field: FormField | null;
    onChange: (patch: Partial<FormField>) => void;
    openTableDesigner?: (id?: string) => void;
}

const FieldPropertiesPanel: React.FC<Props> = ({
    field,
    onChange,
    openTableDesigner,
}) => {
    if (!field)
        return (
            <div className="p-4 text-sm text-muted">
                Select a field to edit properties.
            </div>
        );

    /* ---------- HELPERS ---------- */

    const isInputField = [
        "text",
        "textarea",
        "number",
        "select",
        "date",
        "file",
    ].includes(field.type);

    const hasOptions = ["select", "radio", "checkbox"].includes(field.type);

    const isStaticOnly = [
        "heading1",
        "subtitle",
        "static",
        "label",
    ].includes(field.type);

    const allowClauseInsert = ["text", "textarea"].includes(field.type);

    /* ---------- OPTION HANDLERS ---------- */

    const handleOptionLabelChange = (idx: number, value: string) => {
        const options = field.options ? [...field.options] : [];
        options[idx] = { ...options[idx], label: value };
        onChange({ options });
    };

    const handleAddOption = () => {
        const opts = field.options ? [...field.options] : [];
        opts.push({
            id: `${field.id}_opt_${opts.length + 1}`,
            label: `Option ${opts.length + 1}`,
            key: `option${opts.length + 1}`,
            value: `option${opts.length + 1}`,
        });
        onChange({ options: opts });
    };

    const handleDeleteOption = (idx: number) => {
        const opts = field.options ? [...field.options] : [];
        opts.splice(idx, 1);
        onChange({ options: opts });
    };

    /* ---------- RENDER ---------- */

    return (
        <div className="p-3">
            <div className="mb-3 small fw-semibold">Field Properties</div>

            {/* LABEL (MOST FIELDS) */}
            {field.type !== "divider" && (
                <>
                    <label className="form-label small">Label / Text</label>
                    <input
                        className="form-control form-control-sm mb-2"
                        value={field.label || ""}
                        onChange={(e) =>
                            onChange({ label: e.target.value })
                        }
                    />
                </>
            )}

            {/* KEY (ONLY INPUT & TABLE) */}
            {(isInputField || field.type === "table") && (
                <>
                    <label className="form-label small">Key</label>
                    <input
                        className="form-control form-control-sm mb-2"
                        value={field.key}
                        onChange={(e) =>
                            onChange({ key: e.target.value })
                        }
                    />
                </>
            )}

            {/* PLACEHOLDER */}
            {isInputField && (
                <>
                    <label className="form-label small">Placeholder</label>
                    <input
                        className="form-control form-control-sm mb-2"
                        value={field.placeholder || ""}
                        onChange={(e) =>
                            onChange({ placeholder: e.target.value })
                        }
                    />
                </>
            )}

            {/* REQUIRED */}
            {isInputField && (
                <label className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!field.required}
                        onChange={(e) =>
                            onChange({ required: e.target.checked })
                        }
                    />
                    <span className="form-check-label ms-2 small">
                        Required
                    </span>
                </label>
            )}

            {/* OPTIONS */}
            {hasOptions && (
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="small fw-semibold">Options</div>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleAddOption}
                        >
                            + Add
                        </button>
                    </div>

                    {field.options?.map((opt: any, idx: number) => (
                        <div
                            key={opt.id}
                            className="d-flex gap-2 mb-2"
                        >
                            <input
                                className="form-control form-control-sm"
                                value={opt.label}
                                onChange={(e) =>
                                    handleOptionLabelChange(
                                        idx,
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                    handleDeleteOption(idx)
                                }
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* TABLE CONFIG */}
            {field.type === "table" && (
                <div className="mt-3 p-2 border rounded bg-light">
                    <div className="small fw-semibold mb-2">
                        Table Structure
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-primary mb-2"
                        onClick={() =>
                            openTableDesigner?.(field.id)
                        }
                    >
                        Edit Table
                    </button>

                    <div className="small text-muted">
                        <strong>Columns:</strong>{" "}
                        {field.columns?.length || 0}
                        <br />
                        <strong>Rows:</strong>{" "}
                        {field.rows || 0}
                    </div>
                </div>
            )}

            {/* CLAUSE INSERTION */}
            {allowClauseInsert && (
                <div className="mt-4">
                    <div className="small fw-semibold mb-2">
                        Insert Clause
                    </div>

                    <ClauseLibraryPanel
                        onInsertClause={(clause: any) =>
                            onChange({
                                placeholder:
                                    clause.text ||
                                    clause.label ||
                                    "",
                            })
                        }
                    />
                </div>
            )}

            {/* INFO FOR STATIC TYPES */}
            {isStaticOnly && (
                <div className="mt-3 small text-muted">
                    This is a static layout element. It does not
                    collect user input.
                </div>
            )}
        </div>
    );
};

export default FieldPropertiesPanel;
