import { api } from "./_api.client";

export const reportService = {
  getAll: (params?: Record<string, any>) => api.getAll("/report", params ?? {}),
  getById: (id: string, params?: Record<string, any>) =>
    api.get(`/report/${id}`, params ?? {}, { withAuth: true }),
  create: (data: any) => api.post("/report", data, { withAuth: true }),
  update: (id: string, data: Record<string, any>) =>
    api.patch(`/report/${id}`, data),
  remove: (id: string) => api.delete(`/report/${id}`),
};
