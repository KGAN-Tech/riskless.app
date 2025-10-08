import { getSOCKET } from "../utils/socket.utils";
import { APP } from "./const.config";

export const SOCKET_URL = getSOCKET(APP.SOCKET);
