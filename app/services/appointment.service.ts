import { api } from "./_api.client";

// In your appointment.service.ts
export const appointmentService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/appointment", params ?? {}, { withAuth: true }),
  get: (id: string, params?: Record<string, any>) =>
    api.get(`/appointment/${id}`, params ?? {}, { withAuth: true }),
  patch: (id: string, data: any) =>
    api.patch(`/appointment/${id}`, data, { withAuth: true }), // Use PATCH instead of PUT
  create: (data: any) => api.post("/appointment", data, { withAuth: true }),
  exportPKRF: (id: string) =>
    api.get(`/appointment/${id}/export`, { withAuth: true }),
  import: (data: any) =>
    api.post("/appointment/import", data, { withAuth: true }),
  imports: (data: any) =>
    api.post("/appointment/uploads", data, { withAuth: true }),
};
