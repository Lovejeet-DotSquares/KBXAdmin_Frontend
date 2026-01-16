import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import type { QuestionBankItem } from "../types/question-bank";

const STORAGE_KEY = "formDesigner_questionBank_v2";

const loadFromStorage = (): QuestionBankItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveToStorage = (data: QuestionBankItem[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const useQuestionBank = () => {
  const [items, setItems] = useState<QuestionBankItem[]>([]);

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addQuestion = (
    input: Omit<QuestionBankItem, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();
    setItems((p) => [
      ...p,
      {
        ...input,
        id: nanoid(),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  };

  const updateQuestion = (id: string, patch: Partial<QuestionBankItem>) =>
    setItems((p) =>
      p.map((q) =>
        q.id === id
          ? { ...q, ...patch, updatedAt: new Date().toISOString() }
          : q
      )
    );

  const deleteQuestion = (id: string) =>
    setItems((p) => p.filter((q) => q.id !== id));

  return { items, addQuestion, updateQuestion, deleteQuestion };
};

export default useQuestionBank;
