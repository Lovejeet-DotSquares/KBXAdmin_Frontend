import React from "react";
import type {
    FormField,
    ValidationRule,
    VisibilityGroup,
    FieldOption,
} from "../types/formTypes";
import { FieldRegistry } from "../rules/fieldRegistry";

declare global {
    interface Window {
        __FORM_KEYS__?: Set<string>;
    }
}

interface Props {
    field: FormField | null;
    onChange: (patch: Partial<FormField>) => void;
    readOnly?: boolean;
}

const FieldPropertiesPanel: React.FC<Props> = ({
    field,
    onChange,
    readOnly = false,
}) => {
    if (!field) {
        return <div className="p-3 text-muted small">Select a field</div>;
    }
    const updateStyle = (patch: Partial<FormField["style"]>) => {
        onChange({
            style: {
                ...(field.style || {}),
                ...patch,
            },
        });
    };

    const cfg = FieldRegistry[field.type];
    /* ---------------- VALIDATION HELPERS ---------------- */

    const updateValidationRule = (rule: ValidationRule) => {
        const others = field.validationRules?.filter(
            (r) => r.type !== rule.type
        );
        onChange({
            validationRules: [...(others || []), rule],
        });
    };

    const removeValidationRule = (type: ValidationRule["type"]) => {
        onChange({
            validationRules: field.validationRules?.filter((r) => r.type !== type),
        });
    };
    const isKeyUnique = (key: string) => {
        return !window.__FORM_KEYS__?.has(key);
    };

    /* ---------------- OPTIONS HELPERS ---------------- */

    const updateOption = (idx: number, patch: Partial<FieldOption>) => {
        const options = [...(field.options || [])];
        options[idx] = { ...options[idx], ...patch };
        onChange({ options });
    };

    const addOption = () => {
        onChange({
            options: [
                ...(field.options || []),
                {
                    id: crypto.randomUUID(),
                    label: "Option",
                    value: `option_${(field.options?.length || 0) + 1}`,
                },
            ],
        });
    };

    const removeOption = (idx: number) => {
        const options = [...(field.options || [])];
        options.splice(idx, 1);
        onChange({ options });
    };

    return (
        <div className="p-3 small">
            <h6 className="mb-3">Field Properties</h6>

            {/* ---------- LABEL ---------- */}
            <label className="form-label">Label</label>
            <input
                className="form-control form-control-sm mb-2"
                value={field.label || ""}
                disabled={readOnly}
                onChange={(e) => onChange({ label: e.target.value })}
            />
            <hr className="my-3" />
            <h6 className="small fw-bold">Text Appearance</h6>
            {/* FONT FAMILY */}
            <label className="form-label">Font Family</label>
            <select
                className="form-control form-control-sm mb-2"
                value={field.style?.fontFamily || "inherit"}
                disabled={readOnly}
                onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            >
                <option value="inherit">Default (Inherit)</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="monospace">Monospace</option>
            </select>
            {/* ---------- CUSTOM FONT (OPTIONAL) ---------- */}
            <input
                className="form-control form-control-sm mb-2"
                placeholder="Custom font-family (e.g. 'Poppins', sans-serif)"
                value={
                    field.style?.fontFamily &&
                        field.style.fontFamily !== "inherit"
                        ? field.style.fontFamily
                        : ""
                }
                disabled={readOnly}
                onChange={(e) =>
                    updateStyle({
                        fontFamily: e.target.value || "inherit",
                    })
                }
            />

            {/* ---------- FONT SIZE ---------- */}
            <label className="form-label">Font Size (px)</label>
            <input
                type="number"
                className="form-control form-control-sm mb-2"
                value={field.style?.fontSize || ""}
                disabled={readOnly}
                onChange={(e) =>
                    updateStyle({ fontSize: Number(e.target.value) })
                }
            />
            {/* FONT SIZE */}
            <label className="form-label">Font Size (px)</label>
            <input
                type="number"
                className="form-control form-control-sm mb-2"
                value={field.style?.fontSize || ""}
                disabled={readOnly}
                onChange={(e) =>
                    updateStyle({ fontSize: Number(e.target.value) })
                }
            />

            {/* FONT WEIGHT */}
            <label className="form-label">Font Weight</label>
            <select
                className="form-control form-control-sm mb-2"
                value={field.style?.fontWeight || "normal"}
                disabled={readOnly}
                onChange={(e) =>
                    updateStyle({
                        fontWeight: e.target.value as
                            | "normal"
                            | "bold"
                            | "lighter",
                    })
                }
            >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Light</option>
            </select>

            {/* TEXT COLOR */}
            <label className="form-label">Text Color</label>
            <input
                type="color"
                className="form-control form-control-sm mb-2"
                value={field.style?.textColor || "#000000"}
                disabled={readOnly}
                onChange={(e) =>
                    updateStyle({ textColor: e.target.value })
                }
            />

            {/* ALIGNMENT */}
            <label className="form-label">Text Alignment</label>
            <select
                className="form-control form-control-sm"
                value={field.style?.textAlign || "left"}
                disabled={readOnly}
                onChange={(e) =>
                    updateStyle({
                        textAlign: e.target.value as "left" | "center" | "right",
                    })
                }
            >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>

            {/* ---------- HELP TEXT ---------- */}
            <label className="form-label">Help / Description</label>
            <textarea
                className="form-control form-control-sm mb-2"
                value={field.helperText || ""}
                disabled={readOnly}
                onChange={(e) => onChange({ helperText: e.target.value })}
                placeholder="Enter legal name as per ID"
            />

            {cfg?.hasKey && (
                <>
                    <label className="form-label">Field Key</label>
                    <input
                        className={`form-control form-control-sm mb-2 ${field.key && !isKeyUnique(field.key) ? "is-invalid" : ""
                            }`}
                        value={field.key || ""}
                        disabled={readOnly}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\s+/g, "_").toLowerCase();
                            if (isKeyUnique(val)) {
                                onChange({ key: val });
                            }
                        }}
                    />
                    {!isKeyUnique(field.key || "") && (
                        <div className="invalid-feedback">
                            Key must be unique across the form
                        </div>
                    )}
                </>
            )}
            {field.type === "yesno" && (
                <>
                    <hr className="my-3" />
                    <h6 className="small fw-bold">Default Selection</h6>

                    <select
                        className="form-control form-control-sm"
                        value={field.defaultValue ?? ""}
                        disabled={readOnly}
                        onChange={(e) =>
                            onChange({
                                defaultValue:
                                    e.target.value === ""
                                        ? undefined
                                        : e.target.value,
                            })
                        }
                    >
                        <option value="">No default</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </>
            )}
            {field.type === "toggle" && (
                <>
                    <hr className="my-3" />
                    <h6 className="small fw-bold">Default State</h6>

                    <div className="form-check form-switch">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={!!field.defaultValue}
                            disabled={readOnly}
                            onChange={(e) =>
                                onChange({ defaultValue: e.target.checked })
                            }
                        />
                        <label className="form-check-label">
                            Toggle ON by default
                        </label>
                    </div>
                </>
            )}
            {/* ===================================================== */}
            {/* NUMBERED (WITH SUBCLAUSE SUPPORT) */}
            {/* ===================================================== */}
            {field.type === "numbered" && (
                <>
                    <hr className="my-3" />
                    <h6 className="small fw-bold">Numbered List</h6>

                    {/* Number Style */}
                    <label className="form-label">Number Style</label>
                    <select
                        className="form-control form-control-sm mb-3"
                        value={field.listStyle || "numeric"}
                        disabled={readOnly}
                        onChange={(e) =>
                            onChange({
                                listStyle: e.target.value as
                                    | "numeric"
                                    | "roman"
                                    | "alphabetic",
                            })
                        }
                    >
                        <option value="numeric">1, 2, 3</option>
                        <option value="roman">I, II, III</option>
                        <option value="alphabetic">A, B, C</option>
                    </select>

                    {(field.items || []).map((item, idx) => (
                        <div key={item.id} className="border rounded p-2 mb-2">

                            {/* MAIN CLAUSE */}
                            <div className="d-flex gap-1 mb-2">
                                <input
                                    className="form-control form-control-sm"
                                    value={item.text}
                                    disabled={readOnly}
                                    placeholder={`Clause ${idx + 1}`}
                                    onChange={(e) => {
                                        const items = [...(field.items || [])];
                                        items[idx] = { ...item, text: e.target.value };
                                        onChange({ items });
                                    }}
                                />

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={readOnly}
                                    onClick={() => {
                                        const items = [...(field.items || [])];
                                        items.splice(idx, 1);
                                        onChange({ items });
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* SUBCLAUSES */}
                            {(item.subItems || []).map((sub, sIdx) => (
                                <div
                                    key={sub.id}
                                    className="d-flex gap-1 ms-4 mb-1 align-items-center"
                                >
                                    <input
                                        className="form-control form-control-sm"
                                        value={sub.text}
                                        disabled={readOnly}
                                        placeholder={`Sub-clause ${idx + 1}.${sIdx + 1}`}
                                        onChange={(e) => {
                                            const items = [...(field.items || [])];
                                            const subItems = [...(item.subItems || [])];
                                            subItems[sIdx] = { ...sub, text: e.target.value };
                                            items[idx] = { ...item, subItems };
                                            onChange({ items });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        disabled={readOnly}
                                        onClick={() => {
                                            const items = [...(field.items || [])];
                                            const subItems = [...(item.subItems || [])];
                                            subItems.splice(sIdx, 1);
                                            items[idx] = { ...item, subItems };
                                            onChange({ items });
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            {/* ADD SUBCLAUSE */}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary ms-4"
                                disabled={readOnly}
                                onClick={() => {
                                    const items = [...(field.items || [])];
                                    const subItems = [...(item.subItems || [])];
                                    subItems.push({
                                        id: crypto.randomUUID(),
                                        text: "New sub-clause",
                                    });
                                    items[idx] = { ...item, subItems };
                                    onChange({ items });
                                }}
                            >
                                + Add Sub-clause
                            </button>
                        </div>
                    ))}

                    {/* ADD CLAUSE */}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary w-100"
                        disabled={readOnly}
                        onClick={() =>
                            onChange({
                                items: [
                                    ...(field.items || []),
                                    {
                                        id: crypto.randomUUID(),
                                        text: "New clause",
                                        subItems: [],
                                    },
                                ],
                            })
                        }
                    >
                        + Add Clause
                    </button>
                </>
            )}


            {/* ---------- DEFAULT VALUE ---------- */}
            {cfg?.hasDefault && (
                <>
                    <label className="form-label">Default Value</label>

                    {/* DATE */}
                    {field.type === "date" && (
                        <input
                            type="date"
                            className="form-control form-control-sm mb-2"
                            value={field.defaultValue || ""}
                            disabled={readOnly}
                            onChange={(e) =>
                                onChange({ defaultValue: e.target.value })
                            }
                        />
                    )}

                    {/* NUMBER */}
                    {field.type === "number" && (
                        <input
                            type="number"
                            className="form-control form-control-sm mb-2"
                            value={field.defaultValue ?? ""}
                            disabled={readOnly}
                            onChange={(e) =>
                                onChange({ defaultValue: Number(e.target.value) })
                            }
                        />
                    )}

                    {/* TEXT / FALLBACK */}
                    {!["date", "number"].includes(field.type) && (
                        <input
                            className="form-control form-control-sm mb-2"
                            value={field.defaultValue ?? ""}
                            disabled={readOnly}
                            onChange={(e) =>
                                onChange({ defaultValue: e.target.value })
                            }
                        />
                    )}
                </>
            )}


            {/* ---------- STATE ---------- */}
            <div className="form-check mt-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={!!field.disabled}
                    disabled={readOnly}
                    onChange={(e) => onChange({ disabled: e.target.checked })}
                />
                <label className="form-check-label">Disabled</label>
            </div>

            <div className="form-check mt-1">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={!!field.readonly}
                    disabled={readOnly}
                    onChange={(e) => onChange({ readonly: e.target.checked })}
                />
                <label className="form-check-label">Read Only</label>
            </div>

            {/* ---------- OPTIONS (SELECT / YESNO / MULTI) ---------- */}
            {/* ---------- OPTIONS ---------- */}
            {cfg?.hasOptions && (
                <>
                    <hr className="my-3" />
                    <h6 className="small fw-bold">Options</h6>

                    {/* ---- OPTIONS MODE ---- */}
                    <select
                        className="form-control form-control-sm mb-2"
                        value={field.optionsMode || "manual"}
                        disabled={readOnly}
                        onChange={(e) => {
                            const mode = e.target.value as "manual" | "master";

                            if (mode === "master") {
                                // predefined sets
                                if (field.type === "yesno") {
                                    onChange({
                                        optionsMode: "master",
                                        masterOptionsKey: "yesno",
                                        options: [
                                            { id: "yes", label: "Yes", value: "yes" },
                                            { id: "no", label: "No", value: "no" },
                                        ],
                                    });
                                }
                            } else {
                                onChange({
                                    optionsMode: "manual",
                                });
                            }
                        }}
                    >
                        <option value="manual">Manual Options</option>
                        <option value="master">Use System Options</option>
                    </select>

                    {/* ---- MANUAL OPTIONS ---- */}
                    {(field.optionsMode !== "master") && (
                        <>
                            {(field.options || []).map((opt, idx) => (
                                <div key={opt.id} className="d-flex gap-1 mb-2">
                                    <input
                                        className="form-control form-control-sm"
                                        placeholder="Label"
                                        value={opt.label}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updateOption(idx, { label: e.target.value })
                                        }
                                    />
                                    <input
                                        className="form-control form-control-sm"
                                        placeholder="Value"
                                        value={opt.value}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updateOption(idx, { value: e.target.value })
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        disabled={readOnly}
                                        onClick={() => removeOption(idx)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary w-100"
                                disabled={readOnly}
                                onClick={addOption}
                            >
                                + Add Option
                            </button>
                        </>
                    )}

                    {/* ---- MASTER OPTIONS INFO ---- */}
                    {field.optionsMode === "master" && (
                        <div className="text-muted small mt-2">
                            Using system-defined options. Editing is disabled.
                        </div>
                    )}
                </>
            )}


            {/* ---------- FILE SUPPORT ---------- */}
            {field.type === "file" && (
                <>
                    <hr className="my-3" />
                    <h6 className="small fw-bold">File Settings</h6>

                    <input
                        className="form-control form-control-sm mb-2"
                        placeholder="Accepted types (e.g. image/*,.pdf)"
                        value={field.accept || ""}
                        disabled={readOnly}
                        onChange={(e) => onChange({ accept: e.target.value })}
                    />

                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={!!field.multiple}
                            disabled={readOnly}
                            onChange={(e) => onChange({ multiple: e.target.checked })}
                        />
                        <label className="form-check-label">Allow Multiple Files</label>
                    </div>
                </>
            )}

            {/* ---------- VALIDATIONS ---------- */}
            {cfg?.hasValidation && (
                <>
                    <hr className="my-3" />
                    <h6 className="small fw-bold">Validations</h6>

                    <div className="form-check mb-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={
                                !!field.validationRules?.some((r) => r.type === "required")
                            }
                            disabled={readOnly}
                            onChange={(e) =>
                                e.target.checked
                                    ? updateValidationRule({ type: "required" })
                                    : removeValidationRule("required")
                            }
                        />
                        <label className="form-check-label">Required</label>
                    </div>

                    {field.type === "number" && (
                        <div className="d-flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="form-control form-control-sm"
                                disabled={readOnly}
                                onChange={(e) =>
                                    updateValidationRule({
                                        type: "min",
                                        value: Number(e.target.value),
                                    })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="form-control form-control-sm"
                                disabled={readOnly}
                                onChange={(e) =>
                                    updateValidationRule({
                                        type: "max",
                                        value: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                    )}

                    {field.type === "text" && (
                        <input
                            type="number"
                            placeholder="Max Length"
                            className="form-control form-control-sm"
                            disabled={readOnly}
                            onChange={(e) =>
                                updateValidationRule({
                                    type: "length",
                                    max: Number(e.target.value),
                                })
                            }
                        />
                    )}
                </>
            )}

            {/* ---------- VISIBILITY ---------- */}
            <hr className="my-3" />
            <h6 className="small fw-bold">Visibility / State Logic</h6>

            <div className="text-muted small mb-2">
                Configured via Rule Builder
            </div>

            <button
                type="button"
                className="btn btn-outline-primary btn-sm w-100"
                disabled={readOnly}
                onClick={() =>
                    onChange({
                        visibilityConditions: [
                            ...(field.visibilityConditions || []),
                            {
                                id: crypto.randomUUID(),
                                logic: "AND",
                                action: "show",
                                conditions: [],
                            } as VisibilityGroup,
                        ],
                    })
                }
            >
                + Add Visibility Rule
            </button>

            {/* ---------- ACTIONS ---------- */}
            <hr className="my-3" />
            <h6 className="small fw-bold">Actions & Workflows</h6>

            <div className="form-check mb-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={!!field.actions?.triggerClause}
                    disabled={readOnly}
                    onChange={(e) =>
                        onChange({
                            actions: {
                                ...field.actions,
                                triggerClause: e.target.checked,
                            },
                        })
                    }
                />
                <label className="form-check-label">
                    Trigger Clause Insertion
                </label>
            </div>

            <input
                className="form-control form-control-sm"
                placeholder="Action Flow ID"
                value={field.actions?.actionFlowId || ""}
                disabled={readOnly}
                onChange={(e) =>
                    onChange({
                        actions: {
                            ...field.actions,
                            actionFlowId: e.target.value,
                        },
                    })
                }
            />
        </div>
    );
};

export default FieldPropertiesPanel;
