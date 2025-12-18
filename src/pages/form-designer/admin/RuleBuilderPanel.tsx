/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { FormField } from "../types/formTypes";
import { nanoid } from "nanoid";

interface Props {
    field: FormField | null;
    allFields: FormField[];
    onFieldChange: (patch: Partial<FormField>) => void;
}

const RuleBuilderPanel: React.FC<Props> = ({ field, allFields, onFieldChange }) => {
    const [localGroups, setLocalGroups] = useState<any[]>(() => field?.visibilityConditions ?? []);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setLocalGroups(field?.visibilityConditions ?? []), [field]);

    const otherFields = allFields.filter((f) => !field || f.id !== field.id);

    const sync = (groups: any[]) => {
        setLocalGroups(groups);
        onFieldChange({ visibilityConditions: groups });
    };

    if (!field) return <div className="p-3 text-muted small">Select a field to add rules</div>;

    const addGroup = (type: "AND" | "OR") => sync([...localGroups, { id: nanoid(), type, conditions: [] }]);
    const removeGroup = (id: string) => sync(localGroups.filter((g) => g.id !== id));
    const addCondition = (groupId: string) => sync(localGroups.map((g) => (g.id !== groupId ? g : { ...g, conditions: [...(g.conditions || []), { id: nanoid(), sourceFieldKey: "", operator: "equals", value: "" }] })));
    const updateCondition = (groupId: string, condId: string, patch: any) => sync(localGroups.map((g) => (g.id !== groupId ? g : { ...g, conditions: g.conditions.map((c: any) => (c.id === condId ? { ...c, ...patch } : c)) })));
    const removeCondition = (groupId: string, condId: string) => sync(localGroups.map((g) => (g.id !== groupId ? g : { ...g, conditions: g.conditions.filter((c: any) => c.id !== condId) })) as any);

    return (
        <div className="p-3">
            <div className="small fw-semibold mb-2">Visibility Rules</div>
            <div className="mb-2">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => addGroup("AND")}>+ Add AND Group</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => addGroup("OR")}>+ Add OR Group</button>
            </div>

            {localGroups.length === 0 && <div className="text-muted small">No rules yet</div>}

            <div className="d-flex flex-column gap-3">
                {localGroups.map((g) => (
                    <div key={g.id} className="p-2 border rounded">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="small fw-semibold">{g.type} group</div>
                            <div><button className="btn btn-xs btn-link text-danger" onClick={() => removeGroup(g.id)}>Remove</button></div>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            {(g.conditions || []).map((c: any) => (
                                <div key={c.id} className="d-flex gap-2 align-items-center">
                                    <select className="form-select form-select-sm" value={c.sourceFieldKey} onChange={(e) => updateCondition(g.id, c.id, { sourceFieldKey: e.target.value })}>
                                        <option value="">Select field</option>
                                        {otherFields.map((f) => <option key={f.id} value={f.key}>{f.label}</option>)}
                                    </select>

                                    <select className="form-select form-select-sm" value={c.operator} onChange={(e) => updateCondition(g.id, c.id, { operator: e.target.value })}>
                                        <option value="equals">Equals</option>
                                        <option value="notEquals">Not equals</option>
                                        <option value="contains">Contains</option>
                                    </select>

                                    <input className="form-control form-control-sm" value={c.value} onChange={(e) => updateCondition(g.id, c.id, { value: e.target.value })} />
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeCondition(g.id, c.id)}>✕</button>
                                </div>
                            ))}

                            <div><button className="btn btn-sm btn-outline-primary" onClick={() => addCondition(g.id)}>+ Add condition</button></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RuleBuilderPanel;
