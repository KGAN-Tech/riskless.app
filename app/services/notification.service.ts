import { api } from "./_api.client";

export const notificationService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/notification", params ?? {}),
  getById: (id: string, params?: Record<string, any>) =>
    api.get(`/notification/${id}`, params ?? {}, { withAuth: true }),
  create: (data: any) => api.post("/notification", data, { withAuth: true }),
  update: (id: string, data: Record<string, any>) =>
    api.patch(`/notification/${id}`, data),
  remove: (id: string, data: Record<string, any>) =>
    api.put(`/notification/${id}`, data),
};
