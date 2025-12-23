import React from "react";
import type { FormField } from "../types/formTypes";
import { FieldRegistry } from "../rules/fieldRegistry";

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

    const cfg = FieldRegistry[field.type];

    return (
        <div className="p-3 small">
            <h6 className="mb-3">Field Properties</h6>

            <label className="form-label">Label</label>
            <input
                className="form-control form-control-sm mb-2"
                value={field.label || ""}
                disabled={readOnly}
                onChange={(e) => onChange({ label: e.target.value })}
            />

            {cfg?.hasKey && (
                <>
                    <label className="form-label">Key</label>
                    <input
                        className="form-control form-control-sm mb-2"
                        value={field.key || ""}
                        disabled={readOnly}
                        onChange={(e) => onChange({ key: e.target.value })}
                    />
                </>
            )}

            {cfg?.hasValidation && (
                <div className="form-check mt-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={!!field.required}
                        disabled={readOnly}
                        onChange={(e) =>
                            onChange({ required: e.target.checked })
                        }
                    />
                    <label className="form-check-label">Required</label>
                </div>
            )}
        </div>
    );
};

export default FieldPropertiesPanel;
