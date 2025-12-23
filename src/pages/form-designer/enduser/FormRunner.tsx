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

    if (!field.visibilityConditions?.length) {
        return { visible, disabled };
    }

    field.visibilityConditions.forEach((group: any) => {
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

const mapValidationRules = (rules: any[] = []) => {
    const out: any = {};
    rules.forEach((r) => {
        if (r.type === "required") out.required = r.message || true;
        if (r.type === "min") out.min = r.value;
        if (r.type === "max") out.max = r.value;
        if (r.type === "length") out.maxLength = r.max;
        if (r.type === "pattern") out.pattern = new RegExp(r.regex);
    });
    return out;
};

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
    const getListStyle = (style?: string) => {
        switch (style) {
            case "roman":
                return "upper-roman";
            case "alphabetic":
                return "lower-alpha";
            default:
                return "decimal";
        }
    };

    const { register, handleSubmit, control } = useForm({
        defaultValues,
    });

    const values = useWatch({ control });

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
                    />
                );

            case "number":
                return (
                    <input
                        type="number"
                        {...register(name, rules)}
                        disabled={disabled}
                        className="form-control"
                    />
                );

            case "date":
                return (
                    <input
                        type="date"
                        {...register(name)}
                        disabled={disabled}
                        className="form-control"
                    />
                );

            case "select":
                return (
                    <select
                        {...register(name, rules)}
                        disabled={disabled}
                        className="form-control"
                        defaultValue={field.defaultValue ?? ""}
                    >
                        <option value="" disabled>
                            {field.placeholder || "Select an option"}
                        </option>
                        {field.options?.map((o: any) => (
                            <option
                                key={o.value}
                                value={o.value}
                                disabled={o.disabled}
                            >
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
                        <div className="form-check">
                            <input
                                type="radio"
                                value="yes"
                                {...register(name, rules)}
                                disabled={disabled}
                                className="form-check-input"
                            />
                            <label className="form-check-label">Yes</label>
                        </div>

                        <div className="form-check">
                            <input
                                type="radio"
                                value="no"
                                {...register(name, rules)}
                                disabled={disabled}
                                className="form-check-input"
                            />
                            <label className="form-check-label">No</label>
                        </div>
                    </div>
                );

            case "file":
                return (
                    <input
                        type="file"
                        {...register(name)}
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
                                init={{
                                    height: 250,
                                    menubar: false,
                                    plugins: "lists link table code",
                                    toolbar:
                                        "undo redo | bold italic | bullist numlist | table | code",
                                }}
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
                                <div className="border p-2" style={{ pointerEvents: disabled ? "none" : "auto" }}>
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
                                {ctrl.value && <img src={ctrl.value} className="img-fluid mb-2" />}
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

            case "table":
                return (
                    <Controller
                        name={name}
                        control={control}
                        defaultValue={field.defaultValue || [[""]]}
                        render={({ field: ctrl }) => (
                            <table className="table table-bordered">
                                <tbody>
                                    {ctrl.value.map((row: any[], r: number) => (
                                        <tr key={r}>
                                            {row.map((cell: any, c: number) => (
                                                <td key={c}>
                                                    <input
                                                        className="form-control"
                                                        value={cell}
                                                        disabled={disabled}
                                                        onChange={(e) => {
                                                            const data = [...ctrl.value];
                                                            data[r][c] = e.target.value;
                                                            ctrl.onChange(data);
                                                        }}
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

            case "heading1": return <h1>{field.label}</h1>;
            case "heading2": return <h3>{field.label}</h3>;
            case "paragraph": return <p>{field.label}</p>;
            case "label": return <div>{field.label}</div>;
            case "pagebreak": return <hr />;
            case "numbered":
                return (
                    <ol style={{ listStyleType: getListStyle(field.listStyle) }}>
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

    return (
        <form onSubmit={handleSubmit(console.log)}>
            {rows.map((row) => (
                <div key={row.id} className="d-flex gap-3 mb-4">
                    {row.columns.map((col: any) => (
                        <div
                            key={col.id}
                            style={{ flex: `${col.width} 0 0`, minWidth: col.width * UNIT_PX }}
                        >
                            {col.fields.map((field: any) => {
                                const { visible, disabled } = resolveVisibility(field, values);
                                if (!visible) return null;

                                return (
                                    <div key={field.id} className="mb-3">
                                        {renderField(field, disabled)}
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
