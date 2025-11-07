import { api } from "./_api.client";

export const roadService = {
  getAll: (params?: Record<string, any>) => api.getAll("/road", params ?? {}),
  getById: (id: string, params?: Record<string, any>) =>
    api.get(`/road/${id}`, params ?? {}, { withAuth: true }),
  create: (data: any) => api.post("/road", data, { withAuth: true }),
  update: (id: string, data: Record<string, any>) =>
    api.patch(`/road/${id}`, data),
  remove: (id: string, data: Record<string, any>) =>
    api.put(`/road/${id}`, data),
};
