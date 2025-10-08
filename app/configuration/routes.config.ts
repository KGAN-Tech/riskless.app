import { index, type RouteConfigEntry } from "@react-router/dev/routes";
import { authRoutes } from "./routes/auth.routes";
import { adminRoutes } from "./routes/admin.routes";
import { portalRoutes } from "./routes/portal.routes";
import { memberRoutes } from "./routes/member.routes";
import { middlewareRoutes } from "./routes/middleware.routes";

export const routesConfig: RouteConfigEntry[] = [
  index("./routes/_index.tsx"),
  ...authRoutes,
  ...adminRoutes,
  ...portalRoutes,
  ...memberRoutes,
  ...middlewareRoutes,
];
