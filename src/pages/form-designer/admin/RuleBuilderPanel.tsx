/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import type {
    FormField,
    VisibilityGroup,
    VisibilityCondition,
} from "../types/formTypes";

interface Props {
    field: FormField | null;
    allFields: FormField[];
    onFieldChange: (patch: Partial<FormField>) => void;
    readOnly?: boolean;
}

const RuleBuilderPanel: React.FC<Props> = ({
    field,
    allFields,
    onFieldChange,
    readOnly = false,
}) => {
    const [groups, setGroups] = useState<VisibilityGroup[]>([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGroups(field?.visibilityConditions ?? []);
    }, [field]);

    if (!field) {
        return <div className="p-3 text-muted small">Select a field to add rules</div>;
    }

    const otherFields = allFields.filter(
        (f) => f.id !== field.id && !!f.key
    );

    const sync = (next: VisibilityGroup[]) => {
        setGroups(next);
        onFieldChange({ visibilityConditions: next });
    };

    const addGroup = (logic: "AND" | "OR") =>
        sync([
            ...groups,
            {
                id: nanoid(),
                logic,
                action: "show",
                conditions: [],
            },
        ]);

    const addCondition = (groupId: string) =>
        sync(
            groups.map((g) =>
                g.id !== groupId
                    ? g
                    : {
                        ...g,
                        conditions: [
                            ...g.conditions,
                            {
                                id: nanoid(),
                                fieldKey: "",
                                operator: "equals",
                                value: "",
                            },
                        ],
                    }
            )
        );

    const updateCondition = (
        groupId: string,
        condId: string,
        patch: Partial<VisibilityCondition>
    ) =>
        sync(
            groups.map((g) =>
                g.id !== groupId
                    ? g
                    : {
                        ...g,
                        conditions: g.conditions.map((c) =>
                            c.id === condId ? { ...c, ...patch } : c
                        ),
                    }
            )
        );

    const removeCondition = (groupId: string, condId: string) =>
        sync(
            groups.map((g) =>
                g.id !== groupId
                    ? g
                    : {
                        ...g,
                        conditions: g.conditions.filter((c) => c.id !== condId),
                    }
            )
        );

    return (
        <div className="p-3">
            <div className="fw-semibold mb-2">Visibility Rules</div>

            {!readOnly && (
                <div className="mb-2">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => addGroup("AND")}>
                        + AND
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => addGroup("OR")}>
                        + OR
                    </button>
                </div>
            )}

            {groups.length === 0 && (
                <div className="text-muted small">No rules defined</div>
            )}

            {groups.map((g) => (
                <div key={g.id} className="border rounded p-2 mb-2">
                    <div className="small fw-semibold mb-2">
                        {g.logic} group → {g.action}
                    </div>

                    {g.conditions.map((c) => (
                        <div key={c.id} className="d-flex gap-2 mb-2">
                            <select
                                className="form-select form-select-sm"
                                value={c.fieldKey}
                                disabled={readOnly}
                                onChange={(e) =>
                                    updateCondition(g.id, c.id, {
                                        fieldKey: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select field</option>
                                {otherFields.map((f) => (
                                    <option key={f.id} value={f.key}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-select form-select-sm"
                                value={c.operator}
                                disabled={readOnly}
                                onChange={(e) =>
                                    updateCondition(g.id, c.id, {
                                        operator: e.target.value as any,
                                    })
                                }
                            >
                                <option value="equals">Equals</option>
                                <option value="not_equals">Not equals</option>
                                <option value="contains">Contains</option>
                            </select>

                            <input
                                className="form-control form-control-sm"
                                value={c.value ?? ""}
                                disabled={readOnly}
                                onChange={(e) =>
                                    updateCondition(g.id, c.id, {
                                        value: e.target.value,
                                    })
                                }
                            />

                            {!readOnly && (
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeCondition(g.id, c.id)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    {!readOnly && (
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => addCondition(g.id)}
                        >
                            + Condition
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RuleBuilderPanel;
