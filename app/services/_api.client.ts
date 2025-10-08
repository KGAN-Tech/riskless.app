import { getToken } from "@/utils/use.token";
import { apiClient } from "../utils/api.client.utils";
import { getUserFromLocalStorage } from "../utils/auth.helper";
import { APP } from "../configuration/const.config";

const token = getToken("cookie");
const getTokenFromStorage = getUserFromLocalStorage()?.token;

const req = apiClient()
  .config({
    token: token || getTokenFromStorage,
  })
  .url(APP.HOSTING);

export const api = req.api();
