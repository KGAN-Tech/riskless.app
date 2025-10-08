import { api } from "./_api.client";

export const encounterService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/encounter", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/encounter/${id}`, params ?? {}, { withAuth: true }),
  update: (id: string, data: any) =>
    api.put(`/encounter`, data, { withAuth: true }),
  create: (data: any) => api.post("/encounter", data, { withAuth: true }),
  exportPKRF: (id: string) =>
    api.get(`/encounter/${id}/export`, { withAuth: true }),
  import: (data: any) =>
    api.post("/encounter/import", data, { withAuth: true }),
  imports: (data: any) =>
    api.post("/encounter/uploads", data, { withAuth: true }),
};
