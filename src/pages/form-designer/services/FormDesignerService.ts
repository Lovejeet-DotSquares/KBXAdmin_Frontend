/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiUtility from "./../../../api/ApiUtility";

export const FormDesignerService = {
  createForm: (title: string, schemaJson: any) =>
    ApiUtility.post("/forms/create", { title, schemaJson, user: "admin" }),

  saveDraft: (formId: string, schemaJson: any) =>
    ApiUtility.put(`/forms/${formId}`, {
      schemaJson,
      createVersion: true,
      user: "admin",
    }),

  autoSave: (formId: string, schemaJson: any) =>
    ApiUtility.post(`/forms/${formId}/autosave`, { schemaJson, user: "admin" }),

  publishForm: (formId: string) =>
    ApiUtility.post(`/forms/${formId}/publish`, {}),

  getVersions: (formId: string) => ApiUtility.get(`/forms/${formId}/versions`),
};
