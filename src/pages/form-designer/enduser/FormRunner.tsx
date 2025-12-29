/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, Controller, useWatch } from "react-hook-form";
import type { DesignerRow } from "../hooks/useGridDesigner";
import SignatureCanvas from "react-signature-canvas";
import { Editor } from "@tinymce/tinymce-react";
import CustomMultiSelect from "../../../components/common/CustomMultiSelect";

const UNIT_PX = 60;

/* ---------------- RULE ENGINE HELPERS ---------------- */

const evaluateCondition = (value: any, operator: string, expected?: any) => {
    switch (operator) {
        case "equals": return value === expected;
        case "not_equals": return value !== expected;
        case "contains": return value?.includes?.(expected);
        case "greater_than": return value > expected;
        case "less_than": return value < expected;
        case "is_empty": return value === undefined || value === null || value === "";
        case "is_not_empty": return value !== undefined && value !== null && value !== "";
        default: return true;
    }
};

const resolveVisibility = (field: any, values: any) => {
    let visible = !field.hidden;
    let disabled = !!field.disabled;

    field.visibilityConditions?.forEach((group: any) => {
        const results = group.conditions.map((c: any) =>
            evaluateCondition(values[c.fieldKey], c.operator, c.value)
        );

        const match =
            group.logic === "AND"
                ? results.every(Boolean)
                : results.some(Boolean);

        if (match) {
            if (group.action === "hide") visible = false;
            if (group.action === "show") visible = true;
            if (group.action === "disable") disabled = true;
            if (group.action === "enable") disabled = false;
        }
    });

    return { visible, disabled };
};

/* ---------------- VALIDATION MAPPER ---------------- */

const mapValidationRules = (rules: any[] = []) => {
    const out: any = {};

    rules.forEach((r) => {
        if (r.type === "required") {
            out.required = r.message || "This field is required";
        }
        if (r.type === "min") {
            out.min = { value: r.value, message: `Minimum value is ${r.value}` };
        }
        if (r.type === "max") {
            out.max = { value: r.value, message: `Maximum value is ${r.value}` };
        }
        if (r.type === "length") {
            if (r.min !== undefined) {
                out.minLength = { value: r.min, message: `Minimum length is ${r.min}` };
            }
            if (r.max !== undefined) {
                out.maxLength = { value: r.max, message: `Maximum length is ${r.max}` };
            }
        }
        if (r.type === "pattern") {
            out.pattern = {
                value: new RegExp(r.regex),
                message: r.message || "Invalid format",
            };
        }
    });

    return out;
};

/* ---------------- DISPLAY HELPERS ---------------- */

const DISPLAY_ONLY_FIELDS = new Set([
    "heading1",
    "heading2",
    "paragraph",
    "label",
    "pagebreak",
    "numbered",
]);

const isDisplayOnly = (field: any) =>
    DISPLAY_ONLY_FIELDS.has(field.type);

const isRequired = (rules: any[] = []) =>
    rules.some((r) => r.type === "required");

/* ✅ FONT FAMILY ADDED (ONLY CHANGE) */
const getFieldStyle = (field: any) => ({
    fontSize: field.style?.fontSize
        ? `${field.style.fontSize}px`
        : undefined,
    fontWeight: field.style?.fontWeight,
    color: field.style?.textColor,
    textAlign: field.style?.textAlign,
    fontFamily:
        field.style?.fontFamily &&
            field.style.fontFamily !== "inherit"
            ? field.style.fontFamily
            : undefined,
});

/* ---------------- FORM RUNNER ---------------- */

const FormRunner = ({ rows }: { rows: DesignerRow[] }) => {
    const defaultValues = Object.fromEntries(
        rows.flatMap((r) =>
            r.columns.flatMap((c: any) =>
                c.fields
                    .filter((f: any) => f.key)
                    .map((f: any) => [f.key, f.defaultValue])
            )
        )
    );

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ defaultValues });

    const values = useWatch({ control });

    const getListStyle = (style?: string) =>
        style === "roman"
            ? "upper-roman"
            : style === "alphabetic"
                ? "lower-alpha"
                : "decimal";

    /* ---------------- FIELD RENDERER ---------------- */

    const renderField = (field: any, disabled: boolean) => {
        const name = field.key || field.id;
        const rules = mapValidationRules(field.validationRules);

        switch (field.type) {
            case "text":
            case "email":
            case "phone":
                return (
                    <input
                        type={field.type}
                        {...register(name, rules)}
                        disabled={disabled}
                        readOnly={field.readonly}
                        className="form-control"
                        style={getFieldStyle(field)}
                    />
                );

            case "number":
                return (
                    <input
                        type="number"
                        {...register(name, rules)}
                        disabled={disabled}
                        className="form-control"
                        style={getFieldStyle(field)}
                    />
                );

            case "date":
                return (
                    <input
                        type="date"
                        {...register(name, rules)}
                        disabled={disabled}
                        className="form-control"
                        style={getFieldStyle(field)}
                    />
                );

            case "select":
                return (
                    <select
                        {...register(name, rules)}
                        disabled={disabled}
                        className="form-control"
                        style={getFieldStyle(field)}
                    >
                        <option value="" disabled>
                            {field.placeholder || "Select an option"}
                        </option>
                        {field.options?.map((o: any) => (
                            <option key={o.value} value={o.value} disabled={o.disabled}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                );

            case "multiselect":
                return (
                    <Controller
                        name={name}
                        control={control}
                        defaultValue={field.defaultValue || []}
                        render={({ field: ctrl }) => (
                            <CustomMultiSelect
                                options={field.options || []}
                                value={ctrl.value || []}
                                onChange={ctrl.onChange}
                                placeholder={field.placeholder || "Select options"}
                                disabled={disabled}
                            />
                        )}
                    />
                );

            case "toggle":
            case "yesno":
                return (
                    <div className="d-flex gap-3">
                        {["yes", "no"].map((v) => (
                            <div key={v} className="form-check">
                                <input
                                    type="radio"
                                    value={v}
                                    {...register(name, rules)}
                                    disabled={disabled}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    {v.toUpperCase()}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case "file":
                return (
                    <input
                        type="file"
                        {...register(name, rules)}
                        disabled={disabled}
                        multiple={!!field.multiple}
                        accept={field.accept || "*"}
                        className="form-control"
                    />
                );

            case "html":
                return (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: ctrl }) => (
                            <Editor
                                apiKey="no-api-key"
                                value={ctrl.value || ""}
                                onEditorChange={ctrl.onChange}
                                init={{ height: 250, menubar: false }}
                            />
                        )}
                    />
                );

            case "signature":
                return (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: ctrl }) => {
                            let ref: any;
                            return (
                                <div className="border p-2">
                                    <SignatureCanvas
                                        ref={(r) => { (ref = r) }}
                                        canvasProps={{ className: "w-100", height: 150 }}
                                        onEnd={() => ctrl.onChange(ref.toDataURL())}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary mt-2"
                                        onClick={() => {
                                            ref.clear();
                                            ctrl.onChange("");
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            );
                        }}
                    />
                );

            case "image":
                return (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: ctrl }) => (
                            <div className="border p-2">
                                {ctrl.value && (
                                    <img src={ctrl.value} className="img-fluid mb-2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={disabled}
                                    onChange={(e: any) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => ctrl.onChange(reader.result);
                                        reader.readAsDataURL(file);
                                    }}
                                />
                            </div>
                        )}
                    />
                );


            /* ================= TABLE (✅ FIXED) ================= */
            case "table":
                if (!field.table?.columns?.length) {
                    return <div className="text-muted small">No table configuration</div>;
                }

                return (
                    <Controller
                        name={name}
                        control={control}
                        defaultValue={Object.fromEntries(
                            (field.table.rowsData || []).map((r: any) => [
                                r.id,
                                { ...r.cells },
                            ])
                        )}
                        render={({ field: ctrl }) => (
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        {field.table.columns.map((col: any) => (
                                            <th key={col.id}>{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {(field.table.rowsData || []).map((row: any) => (
                                        <tr key={row.id}>
                                            {field.table.columns.map((col: any) => (
                                                <td key={col.id}>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        disabled={disabled}
                                                        value={ctrl.value?.[row.id]?.[col.id] || ""}
                                                        onChange={(e) =>
                                                            ctrl.onChange({
                                                                ...ctrl.value,
                                                                [row.id]: {
                                                                    ...ctrl.value?.[row.id],
                                                                    [col.id]: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    />
                );

            case "heading1": return <h1 style={getFieldStyle(field)}>{field.label}</h1>;
            case "heading2": return <h3 style={getFieldStyle(field)}>{field.label}</h3>;
            case "paragraph": return <p style={getFieldStyle(field)}>{field.label}</p>;
            case "label": return <div style={getFieldStyle(field)}>{field.label}</div>;
            case "pagebreak": return <hr />;

            case "numbered":
                return (
                    <ol
                        style={{
                            listStyleType: getListStyle(field.listStyle),
                            ...getFieldStyle(field),
                        }}
                    >
                        {(field.items || []).map((item: any) => (
                            <li key={item.id}>
                                {item.text}
                                {item.subItems?.length > 0 && (
                                    <ol style={{ listStyleType: "lower-alpha" }}>
                                        {item.subItems.map((sub: any) => (
                                            <li key={sub.id}>{sub.text}</li>
                                        ))}
                                    </ol>
                                )}
                            </li>
                        ))}
                    </ol>
                );

            default:
                return <div className="text-danger">Unsupported field</div>;
        }
    };

    /* ---------------- RENDER ---------------- */

    return (
        <form onSubmit={handleSubmit(console.log)}>
            {rows.map((row) => (
                <div key={row.id} className="d-flex gap-3 mb-4">
                    {row.columns.map((col: any) => (
                        <div
                            key={col.id}
                            style={{
                                flex: `${col.width} 0 0`,
                                minWidth: col.width * UNIT_PX,
                            }}
                        >
                            {col.fields.map((field: any) => {
                                const { visible, disabled } =
                                    resolveVisibility(field, values);
                                if (!visible) return null;

                                return (
                                    <div key={field.id} className="mb-3">
                                        {!isDisplayOnly(field) && field.label && (
                                            <label
                                                className="form-label"
                                                style={getFieldStyle(field)}
                                            >
                                                {field.label}
                                                {isRequired(field.validationRules) && (
                                                    <span className="text-danger ms-1">*</span>
                                                )}
                                            </label>
                                        )}

                                        {renderField(field, disabled)}

                                        {!isDisplayOnly(field) &&
                                            field.key &&
                                            errors[field.key] && (
                                                <div className="text-danger small mt-1">
                                                    {errors[field.key]?.message as string}
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ))}

            <button className="btn btn-success">Submit</button>
        </form>
    );
};

export default FormRunner;
