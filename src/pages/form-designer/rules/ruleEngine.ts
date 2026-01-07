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
  fields: FieldStateMap;
  formData: Record<string, any>;
  onValueChange?: (key: string, value: any) => void;
}

/* ---------------- CONDITION ---------------- */

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

/* ---------------- GROUP ---------------- */

export const evaluateGroup = (group: RuleGroup, formData: any): boolean => {
  const conds = group.conditions?.length
    ? group.type === "AND"
      ? group.conditions.every((c) => evaluateCondition(c, formData))
      : group.conditions.some((c) => evaluateCondition(c, formData))
    : true;

  const children = group.children?.length
    ? group.type === "AND"
      ? group.children.every((g) => evaluateGroup(g, formData))
      : group.children.some((g) => evaluateGroup(g, formData))
    : true;

  return group.type === "AND" ? conds && children : conds || children;
};

/* ---------------- ACTION ---------------- */

export const applyAction = (
  action: RuleAction,
  ctx: ExecutionContext
): ExecutionContext => {
  const fields = { ...ctx.fields };
  const key = action.targetFieldKey;

  if (key && !fields[key]) {
    fields[key] = { visible: true, enabled: true };
  }

  switch (action.type) {
    case "SHOW_FIELD":
      fields[key!].visible = true;
      break;

    case "HIDE_FIELD":
      fields[key!].visible = false;
      break;

    case "ENABLE_FIELD":
      fields[key!].enabled = true;
      break;

    case "DISABLE_FIELD":
      fields[key!].enabled = false;
      break;

    case "SET_VALUE":
      fields[key!].value = action.value;
      ctx.onValueChange?.(key!, action.value);
      break;

    case "TRIGGER_CLAUSE":
      // Hook for workflows / APIs
      break;
  }

  return { ...ctx, fields };
};

/* ---------------- RULE ---------------- */

export const executeRule = (
  rule: RuleDefinition,
  ctx: ExecutionContext
): ExecutionContext => {
  if (!rule.enabled) return ctx;

  const matched = evaluateGroup(rule.rootGroup, ctx.formData);
  if (!matched) return ctx;

  let updated = ctx;
  rule.actions.forEach((a) => {
    updated = applyAction(a, updated);
  });

  return updated;
};

/* ---------------- ENGINE ---------------- */

export const executeAllRules = (
  rules: RuleDefinition[],
  ctx: ExecutionContext
): ExecutionContext => {
  return rules
    .filter((r) => r.enabled)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    .reduce((acc, rule) => executeRule(rule, acc), ctx);
};
