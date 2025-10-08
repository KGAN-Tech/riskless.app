import { api } from "./_api.client";

export const personService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/person", params ?? {}, { withAuth: true }),
  get: (id: string) => api.get(`/person/${id}`, { withAuth: true }),
  update: (id: string, data: any) =>
    api.patch(`/person/${id}`, data, { withAuth: true }),
  create: (data: any) => api.post("/person", data, { withAuth: true }),
};
