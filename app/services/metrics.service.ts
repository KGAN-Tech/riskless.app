import { api } from "./_api.client";

export const metricsService = {
  search: (params?: Record<string, any>) =>
    api.post("/metrics", params ?? {}, { withAuth: true }),
};
