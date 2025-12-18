/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import type { DesignerRow } from "../hooks/useGridDesigner";
import type { FormField } from "../types/formTypes";
import { FieldRegistry } from "../rules/fieldRegistry";
import CustomMultiSelect from "../../../components/common/CustomMultiSelect";

/* =====================================================
   HELPERS
===================================================== */

const numberToWords = (n?: number) =>
    typeof n === "number"
        ? new Intl.NumberFormat("en-IN").format(n)
        : "";

const toRoman = (num: number): string => {
    const romans: [number, string][] = [
        [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
        [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
        [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    let result = "";
    for (const [v, s] of romans) {
        while (num >= v) {
            result += s;
            num -= v;
        }
    }
    return result;
};

const alpha = (n: number) =>
    String.fromCharCode(64 + n);

/**
 * Hierarchy numbering based on indentation
 * 2 spaces = next level
 */
const computeHierarchy = (items: string[]) => {
    const counters: number[] = [];

    return items.map(raw => {
        const indentMatch = raw.match(/^(\s*)/);
        const level = Math.floor((indentMatch?.[1].length || 0) / 2);

        counters[level] = (counters[level] || 0) + 1;
        counters.length = level + 1;

        return {
            level,
            prefix: counters.join("."),
            text: raw.trim(),
        };
    });
};

/* =====================================================
   COMPONENT
===================================================== */

const FormRunner: React.FC<{ rows: DesignerRow[] }> = ({ rows }) => {
    const { register, handleSubmit, watch } = useForm();
    const sigRefs = useRef<Record<string, SignatureCanvas | null>>({});

    /* =====================================================
       STATIC FIELDS
    ===================================================== */
    const renderStatic = (field: FormField) => {
        switch (field.type) {
            case "heading1":
                return <h1>{field.label}</h1>;

            case "heading2":
                return <h2>{field.label}</h2>;

            case "heading3":
                return <h3>{field.label}</h3>;

            case "numbered":
                if (!field.items?.length) return null;

                // ----- HIERARCHY -----
                if (field.listStyle === "hierarchy") {
                    const tree = computeHierarchy(field.items);

                    return (
                        <div>
                            {tree.map((n, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        marginLeft: n.level * 16,
                                        display: "flex",
                                        gap: 8,
                                        marginBottom: 4,
                                    }}
                                >
                                    <strong>{n.prefix}.</strong>
                                    <span>{n.text}</span>
                                </div>
                            ))}
                        </div>
                    );
                }

                // ----- FLAT LIST -----
                return (
                    <div>
                        {field.items.map((item, idx) => {
                            let prefix: string;

                            switch (field.listStyle) {
                                case "roman":
                                    prefix = toRoman(idx + 1);
                                    break;

                                case "alphabetic":
                                    prefix = alpha(idx + 1);
                                    break;

                                case "numeric":
                                default:
                                    prefix = String(idx + 1);
                            }

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        marginBottom: 4,
                                    }}
                                >
                                    <strong>{prefix}.</strong>
                                    <span>{item}</span>
                                </div>
                            );
                        })}
                    </div>
                );

            case "paragraph":
            case "label":
            default:
                return <p>{field.label}</p>;
        }
    };

    /* =====================================================
       INPUT FIELDS
    ===================================================== */
    const renderInput = (field: FormField) => {
        const cfg = FieldRegistry[field.type];
        if (!cfg || !field.key) return null;

        const common = register(field.key, { required: field.required });

        switch (field.type) {
            case "select":
                return (
                    <select {...common} className="form-select">
                        <option value="">Select</option>
                        {field.options?.map(o => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                );

            case "multiselect": {
                // eslint-disable-next-line react-hooks/incompatible-library
                const selected = watch(field.key) || [];

                return (
                    <CustomMultiSelect
                        options={field.options || []}
                        value={selected}
                        onChange={(val: any) => {
                            // react-hook-form manual update
                            (common as any).onChange({
                                target: { value: val }
                            });
                        }}
                        placeholder={field.placeholder || "Select options"}
                    />
                );
            }


            case "toggle":
                return (
                    <div className="form-check form-switch">
                        <input
                            {...common}
                            type="checkbox"
                            className="form-check-input"
                        />
                        <label className="form-check-label">
                            {field.label}
                        </label>
                    </div>
                );

            case "radio":
            case "yesno":
                return (
                    <div>
                        {field.options?.map(o => (
                            <div key={o.value} className="form-check">
                                <input
                                    {...common}
                                    type="radio"
                                    value={o.value}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    {o.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case "checkbox":
                return (
                    <div>
                        {field.options?.map(o => (
                            <div key={o.value} className="form-check">
                                <input
                                    type="checkbox"
                                    value={o.value}
                                    className="form-check-input"
                                    {...register(`${field.key}.${o.value}`)}
                                />
                                <label className="form-check-label">
                                    {o.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case "number":
            case "currency": {
                const watchedValue = watch(field.key);
                return (
                    <>
                        <input
                            {...common}
                            type="number"
                            min={field.min}
                            max={field.max}
                            className="form-control"
                        />
                        {field.variant === "filled" && (
                            <small className="text-muted">
                                {numberToWords(watchedValue)}
                            </small>
                        )}
                    </>
                );
            }

            case "file":
                return <input {...common} type="file" className="form-control" />;

            case "signature":
                return (
                    <SignatureCanvas
                        ref={r => { (sigRefs.current[field.id] = r) }}
                        penColor="black"
                        canvasProps={{ className: "border w-100", height: 150 }}
                    />
                );

            default:
                return (
                    <input
                        {...common}
                        type={cfg.inputType || "text"}
                        placeholder={field.placeholder}
                        className="form-control"
                    />
                );
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */
    return (
        <form onSubmit={handleSubmit(console.log)}>
            {rows.map(row =>
                row.columns.map(col =>
                    col.fields.map(field => {
                        const cfg = FieldRegistry[field.type];
                        if (!cfg) return null;

                        return (
                            <div key={field.id} className="mb-3">
                                {!cfg.static && field.label && (
                                    <label className="form-label">
                                        {field.label}
                                    </label>
                                )}

                                {cfg.static
                                    ? renderStatic(field)
                                    : cfg.complex && field.type !== "signature"
                                        ? (
                                            <div className="border p-3 text-muted">
                                                {field.type.toUpperCase()} COMPONENT
                                            </div>
                                        )
                                        : renderInput(field)
                                }

                                {field.helperText && (
                                    <div className="form-text">
                                        {field.helperText}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )
            )}

            <button className="btn btn-success">Submit</button>
        </form>
    );
};

export default FormRunner;
