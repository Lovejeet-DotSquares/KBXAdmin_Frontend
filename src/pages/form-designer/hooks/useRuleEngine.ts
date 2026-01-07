import { useEffect, useRef, useState } from "react";
import { executeAllRules } from "../rules/ruleEngine";
import type { RuleDefinition } from "../types/ruleTypes";
import type { FieldStateMap } from "../rules/ruleEngine";

export const useRuleEngine = (
  rules: RuleDefinition[],
  formData: Record<string, any>,
  baseFieldState: FieldStateMap,
  onValueChange?: (key: string, value: any) => void
) => {
  const [fieldState, setFieldState] = useState<FieldStateMap>(baseFieldState);

  const baseRef = useRef(baseFieldState);

  useEffect(() => {
    baseRef.current = baseFieldState;
  }, [baseFieldState]);

  useEffect(() => {
    const ctx = {
      fields: structuredClone(baseRef.current),
      formData,
      onValueChange,
    };

    const updated = executeAllRules(rules, ctx);
    setFieldState(updated.fields);
  }, [formData, rules]);

  return fieldState;
};
