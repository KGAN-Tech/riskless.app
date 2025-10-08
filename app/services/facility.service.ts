import { api } from "./_api.client";

export const facilityService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/facility", params ?? {}),

  get: (id: string) => api.get(`/facility/${id}`),

  create: (data: Record<string, any>) => api.post("/facility", data),

  update: (id: string, data: Record<string, any>) =>
    api.patch(`/facility/${id}`, data),

  delete: (id: string) => api.delete(`/facility/${id}`),

  import: (data: Record<string, any>) => api.post("/facility/import", data),

  export: (params?: Record<string, any>) =>
    api.get("/facility/export", params ?? {}),

  // New helper to fetch only clinics with category=clinic
  getClinics: (params?: Record<string, any>) =>
    api.getAll("/facility", { ...params, category: "clinic" }),
};
