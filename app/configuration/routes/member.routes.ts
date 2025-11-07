import { route, type RouteConfigEntry } from "@react-router/dev/routes";

export const memberRoutes: RouteConfigEntry[] = [
  route("/activity", "./routes/__activity.route.tsx"),
  route("/map", "./routes/__map.route.tsx"),
  route("/notification", "./routes/__notification.route.tsx"),
  route("/account", "./routes/__account.route.tsx"),
];
