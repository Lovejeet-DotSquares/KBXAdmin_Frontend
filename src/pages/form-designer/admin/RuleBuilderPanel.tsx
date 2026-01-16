import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import type {
    RuleDefinition,
    RuleGroup,
    RuleCondition,
    RuleAction,
    RuleOperator,
} from "../types/ruleTypes";
import type { FormField } from "../types/formTypes";

interface Props {
    field: FormField | null;
    allFields: FormField[];
    onFieldChange: (patch: Partial<FormField>) => void;
}

interface UIGlobalRule {
    id: string;
    groups: RuleGroup[];
    actions: Record<string, RuleAction[]>;
}

const RuleBuilderPanel: React.FC<Props> = ({
    field,
    allFields,
    onFieldChange,
}) => {
    const [rule, setRule] = useState<UIGlobalRule | null>(null);

    /* ---------------- LOAD ---------------- */
    useEffect(() => {
        if (!field) return;

        if (!field.rules?.length) {
            setRule({ id: nanoid(), groups: [], actions: {} });
            return;
        }

        const r = field.rules[0];
        const actionsByGroup: Record<string, RuleAction[]> = {};

        r.actions.forEach((a: any) => {
            const gid = a.sourceGroupId ?? "default";
            actionsByGroup[gid] ??= [];
            actionsByGroup[gid].push(a);
        });

        setRule({
            id: r.id,
            groups: r.rootGroup.children ?? [],
            actions: actionsByGroup,
        });
    }, [field]);

    if (!field || !rule) return null;

    /* ---------------- SAVE ---------------- */
    const persist = (next: UIGlobalRule) => {
        setRule(next);

        const actions: RuleAction[] = [];
        Object.entries(next.actions).forEach(([gid, acts]) => {
            acts.forEach((a) => actions.push({ ...a, sourceGroupId: gid }));
        });

        const ruleDef: RuleDefinition = {
            id: next.id,
            enabled: true,
            priority: 10,
            rootGroup: {
                id: "ROOT",
                type: "OR",
                conditions: [],
                children: next.groups,
            },
            actions,
        };

        onFieldChange({ rules: [ruleDef] });
    };

    /* ---------------- HELPERS ---------------- */
    const getField = (key?: string) =>
        allFields.find((f) => f.key === key);

    const operatorsFor = (key?: string): RuleOperator[] => {
        const f = getField(key);
        if (!f) return ["EQ"];

        switch (f.type) {
            case "toggle":
            case "yesno":
                return ["EQ", "NEQ"];
            case "number":
            case "date":
                return ["EQ", "GT", "LT"];
            case "multiselect":
                return ["IN", "NOT_IN"];
            default:
                return ["EQ", "NEQ"];
        }
    };

    /* ---------------- VALUE INPUT ---------------- */
    const renderValueInput = (
        c: RuleCondition,
        gid: string
    ) => {
        const f = getField(c.fieldKey);
        if (!f) return null;

        if (f.type === "toggle" || f.type === "yesno") {
            return (
                <select
                    className="form-select form-select-sm"
                    value={String(c.value ?? "")}
                    onChange={(e) =>
                        updateCondition(gid, c.id, {
                            value: e.target.value === "true",
                        })
                    }
                >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            );
        }

        if (f.type === "select") {
            return (
                <select
                    className="form-select form-select-sm"
                    value={c.value ?? ""}
                    onChange={(e) =>
                        updateCondition(gid, c.id, { value: e.target.value })
                    }
                >
                    <option value="">Select</option>
                    {f.options?.map((o: any) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (f.type === "multiselect") {
            return (
                <select
                    multiple
                    className="form-select form-select-sm"
                    value={c.value ?? []}
                    onChange={(e) =>
                        updateCondition(gid, c.id, {
                            value: Array.from(e.target.selectedOptions).map(
                                (o) => o.value
                            ),
                        })
                    }
                >
                    {f.options?.map((o: any) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (f.type === "date") {
            return (
                <input
                    type="date"
                    className="form-control form-control-sm"
                    value={c.value ?? ""}
                    onChange={(e) =>
                        updateCondition(gid, c.id, { value: e.target.value })
                    }
                />
            );
        }

        if (f.type === "number") {
            return (
                <input
                    type="number"
                    className="form-control form-control-sm"
                    value={c.value ?? ""}
                    onChange={(e) =>
                        updateCondition(gid, c.id, {
                            value: Number(e.target.value),
                        })
                    }
                />
            );
        }

        return (
            <input
                className="form-control form-control-sm"
                value={c.value ?? ""}
                onChange={(e) =>
                    updateCondition(gid, c.id, { value: e.target.value })
                }
            />
        );
    };

    /* ---------------- GROUP ---------------- */
    const addGroup = () =>
        persist({
            ...rule,
            groups: [
                ...rule.groups,
                { id: nanoid(), type: "AND", conditions: [] },
            ],
        });

    const updateGroup = (gid: string, patch: Partial<RuleGroup>) =>
        persist({
            ...rule,
            groups: rule.groups.map((g) =>
                g.id === gid ? { ...g, ...patch } : g
            ),
        });

    const addCondition = (gid: string) =>
        updateGroup(gid, {
            conditions: [
                ...(rule.groups.find((g) => g.id === gid)?.conditions ?? []),
                { id: nanoid(), fieldKey: "", operator: "EQ" },
            ],
        });

    const updateCondition = (
        gid: string,
        cid: string,
        patch: Partial<RuleCondition>
    ) =>
        updateGroup(gid, {
            conditions: rule.groups
                .find((g) => g.id === gid)!
                .conditions.map((c) =>
                    c.id === cid ? { ...c, ...patch } : c
                ),
        });

    /* ---------------- ACTION ---------------- */
    const addAction = (gid: string) =>
        persist({
            ...rule,
            actions: {
                ...rule.actions,
                [gid]: [
                    ...(rule.actions[gid] ?? []),
                    {
                        id: nanoid(),
                        type: "SHOW_FIELD",
                        targetFieldKey: field.key!,
                    },
                ],
            },
        });


    const updateAction = (
        gid: string,
        aid: string,
        patch: Partial<RuleAction>
    ) =>
        persist({
            ...rule,
            actions: {
                ...rule.actions,
                [gid]: rule.actions[gid].map((a) =>
                    a.id === aid ? { ...a, ...patch } : a
                ),
            },
        });

    /* ---------------- UI ---------------- */
    return (
        <div className="p-3">
            <h6 className="mb-2">Rule Builder</h6>

            <button className="btn btn-sm btn-primary" onClick={addGroup}>
                + Add Rule
            </button>

            {rule.groups.map((g) => (
                <div key={g.id} className="border rounded p-2 mt-3">
                    <div className="d-flex gap-2 mb-2">
                        <strong>IF</strong>
                        <select
                            className="form-select form-select-sm w-auto"
                            value={g.type}
                            onChange={(e) =>
                                updateGroup(g.id, {
                                    type: e.target.value as "AND" | "OR",
                                })
                            }
                        >
                            <option value="AND">ALL</option>
                            <option value="OR">ANY</option>
                        </select>
                    </div>

                    {g.conditions.map((c) => (
                        <div key={c.id} className="d-flex gap-2 mb-2">
                            <select
                                className="form-select form-select-sm"
                                value={c.fieldKey}
                                onChange={(e) =>
                                    updateCondition(g.id, c.id, {
                                        fieldKey: e.target.value,
                                        operator: "EQ",
                                        value: undefined,
                                    })
                                }
                            >
                                <option value="">Field</option>
                                {allFields.map((f) => (
                                    <option key={f.id} value={f.key}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-select form-select-sm"
                                value={c.operator}
                                onChange={(e) =>
                                    updateCondition(g.id, c.id, {
                                        operator: e.target.value as RuleOperator,
                                    })
                                }
                            >
                                {operatorsFor(c.fieldKey).map((op) => (
                                    <option key={op} value={op}>
                                        {op}
                                    </option>
                                ))}
                            </select>

                            {renderValueInput(c, g.id)}
                        </div>
                    ))}

                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => addCondition(g.id)}
                    >
                        + Condition
                    </button>

                    <div className="border-top mt-3 pt-2">
                        <strong>THEN</strong>

                        {(rule.actions[g.id] ?? []).map((a) => (
                            <div key={a.id} className="d-flex gap-2 mt-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={a.type}
                                    onChange={(e) =>
                                        updateAction(g.id, a.id, {
                                            type: e.target.value as any,
                                        })
                                    }
                                >
                                    <option value="SHOW_FIELD">Show</option>
                                    <option value="ENABLE_FIELD">Enable</option>
                                    <option value="DISABLE_FIELD">Disable</option>
                                </select>

                            </div>
                        ))}

                        <button
                            className="btn btn-sm btn-outline-success mt-2"
                            onClick={() => addAction(g.id)}
                        >
                            + Action
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RuleBuilderPanel;
