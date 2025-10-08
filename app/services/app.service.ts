import { api } from "./_api.client";

export const appService = {
  getAll: (params?: Record<string, any>) => api.get("/app", { params }),
};
