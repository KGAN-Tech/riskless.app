import { index, type RouteConfigEntry } from "@react-router/dev/routes";
import { authRoutes } from "./routes/auth.routes";

import { memberRoutes } from "./routes/member.routes";

export const routesConfig: RouteConfigEntry[] = [
  index("./routes/_index.tsx"),
  ...authRoutes,

  ...memberRoutes,
];
