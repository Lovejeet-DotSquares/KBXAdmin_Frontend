import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import type { QuestionBankItem } from "../types/question-bank";

const STORAGE_KEY = "formDesigner_questionBank_v1";

const loadFromStorage = (): QuestionBankItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuestionBankItem[];
  } catch (e) {
    console.warn("Failed to load question bank", e);
    return [];
  }
};

const saveToStorage = (data: QuestionBankItem[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const useQuestionBank = () => {
  const [items, setItems] = useState<QuestionBankItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadFromStorage());
  }, []);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addQuestion = (partial: Omit<QuestionBankItem, "id">) =>
    setItems((p) => [...p, { ...partial, id: nanoid() }]);

  const updateQuestion = (id: string, patch: Partial<QuestionBankItem>) =>
    setItems((p) => p.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const deleteQuestion = (id: string) =>
    setItems((p) => p.filter((q) => q.id !== id));

  const clear = () => setItems([]);

  return { items, addQuestion, updateQuestion, deleteQuestion, clear };
};

export default useQuestionBank;
