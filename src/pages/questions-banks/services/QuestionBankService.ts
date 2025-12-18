import ApiUtility from "../../../api/ApiUtility";
import type { QuestionBankItem } from "../types/question-bank";

const BASE = "/api/question-bank";

export const QuestionBankService = {
  list: (): Promise<QuestionBankItem[]> => ApiUtility.get(BASE),

  create: (item: QuestionBankItem) => ApiUtility.post(BASE, item),

  update: (item: QuestionBankItem) =>
    ApiUtility.put(`${BASE}/${item.id}`, item),

  remove: (id: string) => ApiUtility.delete(`${BASE}/${id}`),
};
