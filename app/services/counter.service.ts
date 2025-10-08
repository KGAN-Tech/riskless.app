import { api } from "./_api.client";

export const counterService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/counter", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/counter/${id}`, params ?? {}, { withAuth: true }),
  update: (id: string, data: any) => api.patch(`/counter/${id}`, data, { withAuth: true }),
  create: (data: any) => api.post("/counter", data, { withAuth: true }),
};
