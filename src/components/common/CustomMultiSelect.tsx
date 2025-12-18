import React, { useState } from "react";
import type { FieldOption } from "../../pages/form-designer/types/formTypes";

interface Props {
    options: FieldOption[];
    value?: string[];
    onChange: (val: string[]) => void;
    placeholder?: string;
}

const CustomMultiSelect: React.FC<Props> = ({
    options,
    value = [],
    onChange,
    placeholder = "Select options",
}) => {
    const [open, setOpen] = useState(false);

    const toggleValue = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter(v => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            {/* INPUT */}
            <div
                className="form-control"
                style={{
                    cursor: "pointer",
                    minHeight: 38,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 6,
                }}
                onClick={() => setOpen(o => !o)}
            >
                {value.length === 0 && (
                    <span className="text-muted">{placeholder}</span>
                )}

                {value.map(v => {
                    const opt = options.find(o => o.value === v);
                    return (
                        <span
                            key={v}
                            style={{
                                background: "#eef2ff",
                                color: "#3b5bdb",
                                padding: "2px 8px",
                                borderRadius: 12,
                                fontSize: 12,
                            }}
                        >
                            {opt?.label || v}
                        </span>
                    );
                })}
            </div>

            {/* DROPDOWN */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        zIndex: 1000,
                        width: "100%",
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        marginTop: 4,
                        maxHeight: 200,
                        overflowY: "auto",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                >
                    {options.map(opt => (
                        <label
                            key={opt.value}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 10px",
                                cursor: "pointer",
                                fontSize: 13,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(opt.value)}
                                onChange={() => toggleValue(opt.value)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomMultiSelect;
