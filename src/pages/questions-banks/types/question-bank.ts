import type { FieldType } from "../../form-designer/types/formTypes";

export interface QuestionBankItem {
  id: string;
  label: string;
  key: string;
  type: FieldType;
  description?: string;
}
