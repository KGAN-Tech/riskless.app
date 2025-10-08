import { api } from "./_api.client";

export const inventoryService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/inventory", params ?? {}),
  getById: (id: string, params?: Record<string, any>) =>
    api.get(`/inventory/${id}`, params ?? {}, { withAuth: true }),
  create: (data: any) => api.post("/inventory", data, { withAuth: true }),
  update: (id: string, data: Record<string, any>) =>
    api.patch(`/inventory/${id}`, data),
  remove: (id: string, data: Record<string, any>) =>
    api.put(`/inventory/${id}`, data),
};
