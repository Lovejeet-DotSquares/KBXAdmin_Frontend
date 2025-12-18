/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import {
  executeAllRules,
  type ExecutionContext,
  type FieldStateMap,
} from "../rules/ruleEngine";
import type { RuleDefinition } from "../types/ruleTypes";

export interface UseRuleEngineOptions {
  rules: RuleDefinition[]; // all rules in current form
  initialFieldStates?: FieldStateMap; // optional starting meta
  formData: Record<string, any>; // reactive form values (from FormRunner / form state)
}

/**
 * Hook returns:
 * - fieldStates: meta about each field (visible/enabled/value)
 * - run: function to re-evaluate rules on demand
 */
export default function useRuleEngine({
  rules,
  initialFieldStates = {},
  formData,
}: UseRuleEngineOptions) {
  const [fieldStates, setFieldStates] =
    useState<FieldStateMap>(initialFieldStates);

  const run = useCallback(
    (overrideData?: Record<string, any>) => {
      const ctx: ExecutionContext = {
        fields: { ...initialFieldStates, ...fieldStates },
        formData: overrideData ?? formData,
      };

      const updated = executeAllRules(rules, ctx);
      setFieldStates(updated.fields);
      return updated.fields;
    },
    [rules, formData, initialFieldStates, fieldStates]
  );

  // re-run whenever formData or rules change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    run();
    // intentionally depend on rules & formData; run() memoized uses those too
  }, [rules, formData, run]);

  return {
    fieldStates,
    run,
  };
}
