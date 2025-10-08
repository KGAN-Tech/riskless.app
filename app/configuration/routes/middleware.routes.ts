import { route, type RouteConfigEntry } from "@react-router/dev/routes";

export const middlewareRoutes: RouteConfigEntry[] = [
  route("/warning", "./routes/_security.alert.route.tsx"),
];
