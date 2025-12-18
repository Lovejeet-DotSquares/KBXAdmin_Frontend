/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import type { DesignerRow } from "../hooks/useGridDesigner";
import type { FormField } from "../types/formTypes";

interface Props {
    rows: DesignerRow[];
}

const FormRunner: React.FC<Props> = ({ rows }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: any) => {
        console.log("Submitted", data);
        alert("Form submitted. See console.");
    };

    /* ---------------- FIELD RENDERER ---------------- */

    const renderField = (field: FormField) => {
        const error = (errors as any)[field.key]?.message;

        /* ---------- STATIC / LAYOUT ---------- */

        if (field.type === "heading1") {
            return <h4 className="fw-bold mb-2">{field.label}</h4>;
        }

        if (field.type === "subtitle") {
            return <h6 className="text-muted mb-2">{field.label}</h6>;
        }

        if (field.type === "label") {
            return <div className="fw-semibold small">{field.label}</div>;
        }

        if (field.type === "static") {
            return <div className="text-muted small">{field.label}</div>;
        }

        if (field.type === "divider") {
            return <hr className="my-3" />;
        }

        if (field.type === "numbered") {
            return (
                <ol className="small ps-3">
                    {(field.items ?? []).map((i: any, idx: number) => (
                        <li key={idx}>{i}</li>
                    ))}
                </ol>
            );
        }

        if (field.type === "image") {
            return (
                <div className="border rounded p-3 text-center text-muted small">
                    Image placeholder
                </div>
            );
        }

        if (field.type === "button") {
            return (
                <button type="button" className="btn btn-primary btn-sm">
                    {field.label}
                </button>
            );
        }

        /* ---------- TABLE ---------- */

        if (field.type === "table") {
            return (
                <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                        <thead>
                            <tr>
                                {field.columns?.map((c: any) => (
                                    <th key={c.id}>{c.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(field.rowsData ?? []).map((r: any) => (
                                <tr key={r.id}>
                                    {field.columns?.map((c: any) => (
                                        <td key={c.id}>
                                            <input
                                                {...register(
                                                    `${field.key}.${r.id}.${c.id}`
                                                )}
                                                className="form-control form-control-sm"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        /* ---------- INPUT FIELDS ---------- */

        const common = register(field.key, {
            required: field.required
                ? "This field is required"
                : false,
        });

        switch (field.type) {
            case "textarea":
                return (
                    <>
                        <textarea
                            {...common}
                            className={`form-control form-control-sm ${error ? "is-invalid" : ""
                                }`}
                            placeholder={field.placeholder}
                        />
                        {error && (
                            <div className="invalid-feedback">{error}</div>
                        )}
                    </>
                );

            case "number":
                return (
                    <>
                        <input
                            {...common}
                            type="number"
                            className={`form-control form-control-sm ${error ? "is-invalid" : ""
                                }`}
                            placeholder={field.placeholder}
                        />
                        {error && (
                            <div className="invalid-feedback">{error}</div>
                        )}
                    </>
                );

            case "select":
                return (
                    <>
                        <select
                            {...common}
                            className={`form-select form-select-sm ${error ? "is-invalid" : ""
                                }`}
                        >
                            <option value="">Select...</option>
                            {field.options?.map((o) => (
                                <option key={o.id} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        {error && (
                            <div className="invalid-feedback">{error}</div>
                        )}
                    </>
                );

            case "radio":
                return (
                    <>
                        {field.options?.map((o) => (
                            <div className="form-check" key={o.id}>
                                <input
                                    {...register(field.key)}
                                    className="form-check-input"
                                    type="radio"
                                    value={o.value}
                                />
                                <label className="form-check-label small">
                                    {o.label}
                                </label>
                            </div>
                        ))}
                        {error && (
                            <div className="invalid-feedback d-block">
                                {error}
                            </div>
                        )}
                    </>
                );

            case "checkbox":
                return (
                    <>
                        {field.options?.map((o) => (
                            <div className="form-check" key={o.id}>
                                <input
                                    {...register(field.key)}
                                    className="form-check-input"
                                    type="checkbox"
                                    value={o.value}
                                />
                                <label className="form-check-label small">
                                    {o.label}
                                </label>
                            </div>
                        ))}
                    </>
                );

            case "yesno":
                return (
                    <div>
                        <div className="form-check form-check-inline">
                            <input
                                {...register(field.key)}
                                className="form-check-input"
                                type="radio"
                                value="yes"
                            />
                            <label className="form-check-label small">
                                Yes
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                {...register(field.key)}
                                className="form-check-input"
                                type="radio"
                                value="no"
                            />
                            <label className="form-check-label small">
                                No
                            </label>
                        </div>
                    </div>
                );

            case "date":
                return (
                    <input
                        {...common}
                        type="date"
                        className={`form-control form-control-sm ${error ? "is-invalid" : ""
                            }`}
                    />
                );

            case "file":
                return (
                    <input
                        {...common}
                        type="file"
                        className={`form-control form-control-sm ${error ? "is-invalid" : ""
                            }`}
                    />
                );

            default:
                return (
                    <>
                        <input
                            {...common}
                            className={`form-control form-control-sm ${error ? "is-invalid" : ""
                                }`}
                            placeholder={field.placeholder}
                        />
                        {error && (
                            <div className="invalid-feedback">{error}</div>
                        )}
                    </>
                );
        }
    };

    /* ---------------- RENDER ---------------- */

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {rows.map((row) => (
                <div key={row.id} className="mb-4">
                    <div className="row g-3">
                        {row.columns.map((col) => (
                            <div
                                key={col.id}
                                className={`col-${col.width}`}
                            >
                                {col.fields.map((f) => (
                                    <div key={f.id} className="mb-3">
                                        {![
                                            "heading1",
                                            "subtitle",
                                            "label",
                                            "static",
                                            "divider",
                                            "image",
                                            "button",
                                        ].includes(f.type) && (
                                                <label className="form-label small fw-semibold">
                                                    {f.label}
                                                    {f.required && (
                                                        <span className="text-danger ms-1">
                                                            *
                                                        </span>
                                                    )}
                                                </label>
                                            )}
                                        {renderField(f)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {rows.length > 0 && (
                <button
                    type="submit"
                    className="btn btn-success btn-sm"
                >
                    Submit
                </button>
            )}
        </form>
    );
};

export default FormRunner;
