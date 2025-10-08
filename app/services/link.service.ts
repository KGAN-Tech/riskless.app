import { api } from "./_api.client";

export const linkService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/link", params ?? {}, { withAuth: true }),
  get: (id: string) => api.get(`/link/${id}`, { withAuth: true }),
  getBySlug: (slug: string) =>
    api.get(`/link/slug/${slug}`, { withAuth: true }),
  update: (id: string, data: any) => api.put(`/link`, data, { withAuth: true }),
  create: (data: any) => api.post("/link", data, { withAuth: true }),
  exportPKRF: (id: string) => api.get(`/link/${id}/export`, { withAuth: true }),
  import: (data: any) => api.post("/link/import", data, { withAuth: true }),
  imports: (data: any) => api.post("/link/uploads", data, { withAuth: true }),
};
