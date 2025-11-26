import { api } from "./_api.client";

export const facilityService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/facility", params ?? {}),
  getById: (id: string, params?: Record<string, any>) =>
    api.get(`/facility/${id}`, params ?? {}, { withAuth: true }),
  create: (data: any) => api.post("/facility", data, { withAuth: true }),
  update: (id: string, data: Record<string, any>) =>
    api.patch(`/facility/${id}`, data),
  remove: (id: string) => api.put(`/facility/${id}`),
};
