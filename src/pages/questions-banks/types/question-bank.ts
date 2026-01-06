import type { FieldType } from "../../form-designer/types/formTypes";

export type QuestionStatus = "draft" | "active" | "archived";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface QuestionBankItem {
  id: string;
  label: string;
  key: string;
  type: FieldType;

  description?: string;

  category?: string;
  tags?: string[];

  difficulty: Difficulty;
  marks: number;

  options?: QuestionOption[]; // for select, radio, checkbox
  correctAnswer?: string | string[]; // optional (future evaluation)

  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
}
