import { api } from "./_api.client";

export const fpeService = {
  getAll: (params?: Record<string, any>) => api.getAll("/fpe", params ?? {}),
  get: (id: string) => api.get(`/fpe/${id}`),
  update: (id: string, data: any) => api.put(`/fpe/${id}`, data),
  create: (data: any) => api.post("/fpe", data),
  delete: (id: string) => api.delete(`/fpe/${id}`), // optional
  exportFPE: (id: string) => api.get(`/fpe/${id}/export`),
};
