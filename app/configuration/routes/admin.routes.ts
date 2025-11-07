import { route, type RouteConfigEntry } from "@react-router/dev/routes";

export const adminRoutes: RouteConfigEntry[] = [
  route("/facility", "./routes/_facility.route.tsx"),
  route("/account-ms", "./routes/_account.ms.route.tsx"),
  route("/roads", "./routes/_road.route.tsx"),
  route("/report", "./routes/_report.route.tsx"),
  route("/notification-ms", "./routes/_notification.route.tsx"),
];
