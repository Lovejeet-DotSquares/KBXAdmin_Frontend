/* ---------------- OPERATORS ---------------- */

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

/* ---------------- ACTION TYPES ---------------- */

export type RuleActionType =
  | "SHOW_FIELD"
  | "HIDE_FIELD"
  | "ENABLE_FIELD"
  | "DISABLE_FIELD"
  | "SET_VALUE"
  | "TRIGGER_CLAUSE";

/* ---------------- CONDITION ---------------- */

export interface RuleCondition {
  id: string;
  fieldKey: string; // form field key
  operator: RuleOperator;
  value?: any; // RHS value (if required)
}

/* ---------------- ACTION ---------------- */

export interface RuleAction {
  id: string;
  type: RuleActionType;

  /** Field-related actions */
  targetFieldKey?: string;

  /** Workflow / automation actions */
  targetClauseId?: string;

  /** SET_VALUE payload */
  value?: any;

  /**
   * UI-only metadata
   * Used by Rule Builder to associate action with a condition group
   * Ignored safely by rule engine
   */
  sourceGroupId?: string;
}

/* ---------------- GROUP ---------------- */

export interface RuleGroup {
  id: string;
  type: "AND" | "OR";
  conditions: RuleCondition[];

  /**
   * Nested groups
   * Enables advanced branching logic
   */
  children?: RuleGroup[];
}

/* ---------------- RULE ---------------- */

export interface RuleDefinition {
  id: string;

  /** Optional UI / admin metadata */
  name?: string;
  description?: string;

  /** Execution order (lower runs first) */
  priority?: number;

  /** Master switch */
  enabled: boolean;

  /** Root logical tree */
  rootGroup: RuleGroup;

  /** Actions executed when rootGroup evaluates to TRUE */
  actions: RuleAction[];
}
