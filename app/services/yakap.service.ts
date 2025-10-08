import { api } from "./_api.client";

export const yakapService = {
  getToken: (data: any) =>
    api.post("/yakap/getToken", data, { withAuth: true }),
  isMemberDependentRegistered: (data: any) =>
    api.post("/yakap/isMemberDependentRegistered", data, { withAuth: true }),
  extractRegistrationList: (data: any) =>
    api.post("/yakap/extractRegistrationList", data, { withAuth: true }),
};
