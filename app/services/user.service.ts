import { api } from "./_api.client";

export const userService = {
  getAll: (params?: Record<string, any>) => api.getAll("/user", params ?? {}),
  getById: (id: string, params?: Record<string, any>) =>
    api.get(`/user/${id}`, params ?? {}, { withAuth: true }),
  create: (data: any) => api.post("/user", data, { withAuth: true }),
  update: (id: string, data: Record<string, any>) =>
    api.patch(`/user/${id}`, data),
  remove: (id: string, data: Record<string, any>) =>
    api.put(`/user/${id}`, data),
};
