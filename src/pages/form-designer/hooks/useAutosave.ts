import { useEffect, useRef } from "react";
import { FormDesignerService } from "../services/FormDesignerService";

export const useAutosave = (
  formId: string,
  getPayload: () => any,
  intervalMs = 2 * 60 * 1000
) => {
  const timer = useRef<number | null>(null);
  const lastHash = useRef<string>("");

  useEffect(() => {
    if (!formId) return;

    const tick = async () => {
      const payload = getPayload();
      const hash = JSON.stringify(payload);

      if (hash === lastHash.current) return;

      lastHash.current = hash;
      await FormDesignerService.autoSave(formId, payload);
    };

    timer.current = window.setInterval(tick, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [formId, getPayload, intervalMs]);
};
