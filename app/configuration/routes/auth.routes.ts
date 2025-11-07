import { index, route, type RouteConfigEntry } from "@react-router/dev/routes";

export const authRoutes: RouteConfigEntry[] = [
  route("/login", "./routes/_login.page.tsx"),
  route("/register", "./routes/_registration.page.tsx"),
];
