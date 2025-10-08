import { api } from "./_api.client";

export const queuingService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/queuing", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/queuing/${id}`, params ?? {}, { withAuth: true }),
  update: (id: string, data: any) =>
    api.patch(`/queuing/${id}`, data, { withAuth: true }),
  create: (data: any) => api.post("/queuing", data, { withAuth: true }),
};
