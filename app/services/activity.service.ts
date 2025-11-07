import { api } from "./_api.client";

export const activityService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/activity", params ?? {}),
  getById: (id: string, params?: Record<string, any>) =>
    api.get(`/activity/${id}`, params ?? {}, { withAuth: true }),
  create: (data: any) => api.post("/activity", data, { withAuth: true }),
  update: (id: string, data: Record<string, any>) =>
    api.patch(`/activity/${id}`, data),
  remove: (id: string, data: Record<string, any>) =>
    api.put(`/activity/${id}`, data),
};
