import React, { useEffect, useRef, useState } from "react";
import type { FieldOption } from "../../pages/form-designer/types/formTypes";

interface Props {
    options: FieldOption[];
    value?: string[];
    onChange: (val: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

const CustomMultiSelect: React.FC<Props> = ({
    options,
    value = [],
    onChange,
    placeholder = "Select options",
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggleValue = (val: string) => {
        if (disabled) return;

        if (value.includes(val)) {
            onChange(value.filter(v => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    /* ---------- CLOSE ON OUTSIDE CLICK ---------- */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            {/* INPUT */}
            <div
                className="form-control"
                style={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    minHeight: 38,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 6,
                    background: disabled ? "#f8f9fa" : "#fff",
                    opacity: disabled ? 0.6 : 1,
                }}
                onClick={() => !disabled && setOpen(o => !o)}
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
            {open && !disabled && (
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
                    onClick={(e) => e.stopPropagation()}
                >
                    {options.map(opt => (
                        <label
                            key={opt.value}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 10px",
                                cursor: opt.disabled ? "not-allowed" : "pointer",
                                fontSize: 13,
                                opacity: opt.disabled ? 0.5 : 1,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(opt.value)}
                                disabled={opt.disabled}
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
