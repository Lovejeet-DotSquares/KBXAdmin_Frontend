import React from "react";
import type { FormField } from "../types/formTypes";
import { FieldRegistry } from "../rules/fieldRegistry";

interface Props {
    field: FormField | null;
    onChange: (patch: Partial<FormField>) => void;
}

const FieldPropertiesPanel: React.FC<Props> = ({ field, onChange }) => {
    if (!field) {
        return <div className="p-3 text-muted small">Select a field to edit</div>;
    }

    const cfg = FieldRegistry[field.type];

    return (
        <div className="p-3 small">

            {/* ================= HEADER ================= */}
            <div className="mb-3">
                <h6 className="mb-1">Field Properties</h6>
                <div className="text-muted" style={{ fontSize: 12 }}>
                    Configure how this field behaves
                </div>
            </div>

            {/* ================= BASIC ================= */}
            <div className="mb-3">
                <label className="form-label mb-1">Label</label>
                <input
                    className="form-control form-control-sm"
                    value={field.label || ""}
                    placeholder="e.g. Full Name"
                    onChange={e => onChange({ label: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label mb-1">Help Text</label>
                <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    placeholder="Shown below the field"
                    value={field.helperText || ""}
                    onChange={e => onChange({ helperText: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label mb-1">Field Type</label>
                <input
                    className="form-control form-control-sm"
                    value={field.type}
                    disabled
                />
            </div>

            {/* ================= DATA ================= */}
            {cfg?.hasKey && (
                <div className="mb-3">
                    <label className="form-label mb-1">Field Key</label>
                    <input
                        className="form-control form-control-sm"
                        placeholder="full_name"
                        value={field.key || ""}
                        onChange={e => onChange({ key: e.target.value })}
                    />
                </div>
            )}

            {cfg?.hasPlaceholder && (
                <div className="mb-3">
                    <label className="form-label mb-1">Placeholder</label>
                    <input
                        className="form-control form-control-sm"
                        placeholder="Enter value"
                        value={field.placeholder || ""}
                        onChange={e => onChange({ placeholder: e.target.value })}
                    />
                </div>
            )}

            {cfg?.hasKey && !cfg.static && !cfg.complex && (
                <div className="mb-3">
                    <label className="form-label mb-1">Default Value</label>
                    <input
                        className="form-control form-control-sm"
                        value={field.defaultValue ?? ""}
                        onChange={e => onChange({ defaultValue: e.target.value })}
                    />
                </div>
            )}

            {/* ================= VALIDATION ================= */}
            <div className="border-top pt-3 mt-3">
                <div className="fw-semibold mb-2">Validation</div>

                {cfg?.hasValidation && (
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!field.required}
                            onChange={e => onChange({ required: e.target.checked })}
                        />
                        <label className="form-check-label">
                            Required
                        </label>
                    </div>
                )}

                {cfg?.hasMinMax && (
                    <div className="d-flex gap-2">
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="Min"
                            value={field.min ?? ""}
                            onChange={e => onChange({ min: +e.target.value })}
                        />
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="Max"
                            value={field.max ?? ""}
                            onChange={e => onChange({ max: +e.target.value })}
                        />
                    </div>
                )}

                {["text", "email", "phone"].includes(field.type) && (
                    <div className="mt-2">
                        <select
                            className="form-select form-select-sm"
                            value={field.format || "none"}
                            onChange={e =>
                                onChange({
                                    format: e.target.value as
                                        | "none"
                                        | "email"
                                        | "phone"
                                        | "numeric"
                                })
                            }
                        >
                            <option value="none">No format</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="numeric">Numeric</option>
                        </select>
                    </div>
                )}
            </div>

            {/* ================= OPTIONS ================= */}
            {cfg?.hasOptions && (
                <div className="border-top pt-3 mt-3">
                    <div className="fw-semibold mb-2">Options</div>

                    {(field.options || []).map((opt, idx) => (
                        <div key={opt.id} className="d-flex gap-2 mb-2">
                            <input
                                className="form-control form-control-sm"
                                placeholder="Label"
                                value={opt.label}
                                onChange={e => {
                                    const options = [...(field.options || [])];
                                    options[idx] = { ...opt, label: e.target.value };
                                    onChange({ options });
                                }}
                            />
                            <input
                                className="form-control form-control-sm"
                                placeholder="Value"
                                value={opt.value}
                                onChange={e => {
                                    const options = [...(field.options || [])];
                                    options[idx] = { ...opt, value: e.target.value };
                                    onChange({ options });
                                }}
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                            onChange({
                                options: [
                                    ...(field.options || []),
                                    {
                                        id: crypto.randomUUID(),
                                        label: "Option",
                                        value: "option",
                                    },
                                ],
                            })
                        }
                    >
                        + Add Option
                    </button>
                </div>
            )}

            {/* ================= NUMBERED LIST / HIERARCHY ================= */}
            {field.type === "numbered" && (
                <div className="border-top pt-3 mt-3">
                    <div className="fw-semibold mb-2">Numbered List</div>

                    <select
                        className="form-select form-select-sm mb-2"
                        value={field.listStyle || "numeric"}
                        onChange={e =>
                            onChange({
                                listStyle: e.target.value as
                                    | "numeric"
                                    | "roman"
                                    | "alphabetic"
                                    | "hierarchy"
                            })
                        }
                    >
                        <option value="numeric">1, 2, 3</option>
                        <option value="roman">I, II, III</option>
                        <option value="alphabetic">A, B, C</option>
                        <option value="hierarchy">1.1, 1.2, 1.2.1</option>
                    </select>

                    <textarea
                        className="form-control form-control-sm"
                        rows={6}
                        placeholder={
                            field.listStyle === "hierarchy"
                                ? "Use 2 spaces to indent sub-clauses\nExample:\nClause\n  Sub clause\n    Sub-sub clause"
                                : "One clause per line"
                        }
                        value={(field.items || []).join("\n")}
                        onChange={e =>
                            onChange({ items: e.target.value.split("\n") })
                        }
                    />

                    {field.listStyle === "hierarchy" && (
                        <div className="text-muted mt-1" style={{ fontSize: 11 }}>
                            Tip: Each 2-space indent creates a deeper level (1 → 1.1 → 1.1.1)
                        </div>
                    )}
                </div>
            )}

            {/* ================= VISIBILITY ================= */}
            <div className="border-top pt-3 mt-3">
                <div className="fw-semibold mb-1">Visibility</div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                    Controlled via Rule Builder (show / hide / enable / disable)
                </div>
            </div>

        </div>
    );
};

export default FieldPropertiesPanel;
