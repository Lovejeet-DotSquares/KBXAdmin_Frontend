/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { FormDesignerService } from "../services/FormDesignerService";

export const useAutosave = (
  formId: string,
  getPayload: () => any,
  intervalMs = 2 * 60 * 1000
) => {
  const timer = useRef<number | null>(null);
  const last = useRef<string | null>(null);

  useEffect(() => {
    const tick = async () => {
      try {
        const payload = getPayload();
        const json = JSON.stringify(payload);
        if (json === last.current) return;
        last.current = json;
        await FormDesignerService.autoSave(formId, payload);
        console.log("Autosaved", formId);
      } catch (err) {
        console.warn("Autosave failed", err);
      }
    };

    tick();
    timer.current = window.setInterval(tick, intervalMs) as unknown as number;
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [formId, getPayload, intervalMs]);
};
