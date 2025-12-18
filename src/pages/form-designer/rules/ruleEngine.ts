/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  RuleDefinition,
  RuleGroup,
  RuleCondition,
  RuleAction,
} from "./../types/ruleTypes";

export interface FieldState {
  visible: boolean;
  enabled: boolean;
  value?: any;
}

export type FieldStateMap = Record<string, FieldState>;

export interface ExecutionContext {
  fields: FieldStateMap; // current field meta (visible/enabled/value)
  formData: Record<string, any>; // live form values
}

/** evaluate single condition */
export const evaluateCondition = (
  cond: RuleCondition,
  formData: any
): boolean => {
  const left = formData[cond.fieldKey];
  const right = cond.value;

  switch (cond.operator) {
    case "EQ":
      return left === right;
    case "NEQ":
      return left !== right;
    case "GT":
      return left > right;
    case "GTE":
      return left >= right;
    case "LT":
      return left < right;
    case "LTE":
      return left <= right;
    case "IN":
      return Array.isArray(right) && right.includes(left);
    case "NOT_IN":
      return Array.isArray(right) && !right.includes(left);
    case "IS_EMPTY":
      return left === "" || left === null || left === undefined;
    case "NOT_EMPTY":
      return left !== "" && left !== null && left !== undefined;
    default:
      return false;
  }
};

/** Evaluate nested group (AND/OR) */
export const evaluateGroup = (group: RuleGroup, formData: any): boolean => {
  const condsOk =
    group.conditions && group.conditions.length
      ? group.type === "AND"
        ? group.conditions.every((c: any) => evaluateCondition(c, formData))
        : group.conditions.some((c: any) => evaluateCondition(c, formData))
      : group.type === "AND"
      ? true
      : false;

  const childrenOk =
    group.children && group.children.length
      ? group.type === "AND"
        ? group.children.every((child: any) => evaluateGroup(child, formData))
        : group.children.some((child: any) => evaluateGroup(child, formData))
      : group.type === "AND"
      ? true
      : false;

  return group.type === "AND" ? condsOk && childrenOk : condsOk || childrenOk;
};

/** Apply one action immutably to ctx */
export const applyAction = (
  action: RuleAction,
  ctx: ExecutionContext
): ExecutionContext => {
  const fields = { ...ctx.fields };
  const target = action.targetFieldKey;

  // ensure target exists
  if (target && !fields[target]) {
    fields[target] = { visible: true, enabled: true, value: undefined };
  }

  switch (action.type) {
    case "SHOW_FIELD":
      if (target) fields[target] = { ...fields[target], visible: true };
      break;
    case "HIDE_FIELD":
      if (target) fields[target] = { ...fields[target], visible: false };
      break;
    case "ENABLE_FIELD":
      if (target) fields[target] = { ...fields[target], enabled: true };
      break;
    case "DISABLE_FIELD":
      if (target) fields[target] = { ...fields[target], enabled: false };
      break;
    case "SET_VALUE":
      if (target) fields[target] = { ...fields[target], value: action.value };
      break;
    case "TRIGGER_CLAUSE":
      // clause triggers are domain-specific — we just record/log for now
      // Real implementation: call a workflow handler (e.g., webhook, task runner)
      // For now we do nothing to fields.
      // console.debug("Trigger clause:", action.targetClauseId);
      break;
  }

  return { ...ctx, fields };
};

/** Execute a single rule (if matches) */
export const executeRule = (
  rule: RuleDefinition,
  ctx: ExecutionContext
): ExecutionContext => {
  if (!rule.enabled) return ctx;

  const matches = evaluateGroup(rule.rootGroup, ctx.formData);

  if (!matches) return ctx;

  let newCtx = { ...ctx };
  // actions applied in order (priority of rules is handled by executeAllRules)
  rule.actions.forEach((a: any) => {
    newCtx = applyAction(a, newCtx);
  });

  return newCtx;
};

/** Execute multiple rules (sorted by priority asc) */
export const executeAllRules = (
  rules: RuleDefinition[],
  ctx: ExecutionContext
): ExecutionContext => {
  let updated = { ...ctx };

  const active = rules
    .filter((r) => r.enabled)
    .slice()
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  active.forEach((r) => {
    updated = executeRule(r, updated);
  });

  return updated;
};
