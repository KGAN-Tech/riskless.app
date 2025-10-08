import { checkSecurity } from "../utils/security.utils";
import { APP } from "./const.config";

export const isON = checkSecurity(APP.SECURITY);
