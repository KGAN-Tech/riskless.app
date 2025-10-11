import { index, route, type RouteConfigEntry } from "@react-router/dev/routes";

export const authRoutes: RouteConfigEntry[] = [
  route("/register", "./routes/_registration.page.tsx"),
];
