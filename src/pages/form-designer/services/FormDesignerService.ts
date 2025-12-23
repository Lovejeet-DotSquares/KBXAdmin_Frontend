import ApiUtility from "../../../api/ApiUtility";

export const FormDesignerService = {
  getForms: (page = 1, pageSize = 10, search = "") =>
    ApiUtility.get("/forms", { params: { page, pageSize, search } }),

  getFormById: (formId: string) => ApiUtility.get(`/forms/${formId}`),

  createForm: (title: string) => ApiUtility.post("/forms", { title }),

  saveDraft: (formId: string, schemaJson: string) =>
    ApiUtility.put(`/forms/${formId}`, {
      schemaJson,
    }),

  autoSave: (formId: string, schemaJson: string) =>
    ApiUtility.post(`/forms/${formId}/autosave`, {
      schemaJson,
    }),

  getVersions: (formId: string) => ApiUtility.get(`/forms/${formId}/versions`),

  restoreVersion: (formId: string, versionId: string) =>
    ApiUtility.post(`/forms/${formId}/versions/${versionId}/restore`, {}),

  publishForm: (formId: string) =>
    ApiUtility.post(`/forms/${formId}/publish`, {}),

  deleteForm: (formId: string) => ApiUtility.delete(`/forms/${formId}`),
};
