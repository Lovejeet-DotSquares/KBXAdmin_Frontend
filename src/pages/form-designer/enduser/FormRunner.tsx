/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import type { DesignerRow } from "../hooks/useGridDesigner";
import { FieldRegistry } from "../rules/fieldRegistry";

const FormRunner = ({ rows }: { rows: DesignerRow[] }) => {
    const { register, handleSubmit } = useForm();
    const UNIT_PX = 60;
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
                                const cfg = FieldRegistry[field.type];
                                if (!cfg) return null;

                                return (
                                    <div key={field.id} className="mb-3">
                                        {!cfg.static && field.label && (
                                            <label className="form-label">{field.label}</label>
                                        )}
                                        <input
                                            {...register(field.key || field.id)}
                                            className="form-control"
                                        />
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
