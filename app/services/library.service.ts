import { api } from "./_api.client";

export const libraryService = {
  getAll: (params?: Record<string, any>) =>
    api.getAll("/library", params ?? {}),
  import: (data: FormData) =>
    api.post("/library/import", data, { withAuth: true }),
};
