import { api } from "./_api.client";

export const versionControlService = {
  getAll: (params?: Record<string, any>) =>
    api.get("/version-control", { params }),

  create: (data: any) => api.post("/version-control", data, { withAuth: true }),

  update: (id: string, data: any) =>
    api.patch(`/version-control/${id}`, data, { withAuth: true }),

  getById: (id: string, params?: { fields?: string }) =>
    api.get(`/version-control/${id}`, { params }),

  softDelete: (action: "softDelete" | "restore", items: string[]) =>
    api.put("/version-control", { action, items }, { withAuth: true }),

  remove: (id: string) =>
    api.delete(`/version-control/${id}`, { withAuth: true }),

  bulkRemove: (items: string[]) =>
    api.post("/version-control/bulk-delete", { items }, { withAuth: true }),
};
