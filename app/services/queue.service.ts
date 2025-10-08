import { api } from "./_api.client";

export const queueService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/queue", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/queue/${id}`, params ?? {}, { withAuth: true }),
  update: (id: string, data: any) =>
    api.patch(`/queue/${id}`, data, { withAuth: true }),
  create: (data: any) => api.post("/queue", data, { withAuth: true }),
  delete: (id: string) => api.delete(`/queue/${id}`, { withAuth: true }),
};
