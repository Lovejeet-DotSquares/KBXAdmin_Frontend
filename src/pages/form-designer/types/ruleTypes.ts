export type RuleOperator =
  | "EQ"
  | "NEQ"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "IN"
  | "NOT_IN"
  | "IS_EMPTY"
  | "NOT_EMPTY";

export type RuleActionType =
  | "SHOW_FIELD"
  | "HIDE_FIELD"
  | "ENABLE_FIELD"
  | "DISABLE_FIELD"
  | "SET_VALUE"
  | "TRIGGER_CLAUSE";

export interface RuleCondition {
  id: string;
  fieldKey: string;
  operator: RuleOperator;
  value?: any;
}

export interface RuleAction {
  id: string;
  type: RuleActionType;
  targetFieldKey?: string;
  targetClauseId?: string;
  value?: any;
}

export interface RuleGroup {
  id: string;
  type: "AND" | "OR";
  conditions: RuleCondition[];
  children?: RuleGroup[];
}

export interface RuleDefinition {
  id: string;
  name?: string;
  description?: string;
  priority?: number;
  enabled: boolean;
  rootGroup: RuleGroup;
  actions: RuleAction[];
}
