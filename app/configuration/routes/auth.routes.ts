import { index, route, type RouteConfigEntry } from "@react-router/dev/routes";

export const authRoutes: RouteConfigEntry[] = [
  route("/login", "./routes/_admin.login.page.tsx"),
  route("/register", "./routes/main.patient.registration.page.tsx"),
  route("/:name/login", "./routes/_login.page.tsx"),
  route("/:name/register", "./routes/patient.registration.page.tsx"),
  route(
    "/success",
    "./components/organisms/indicators/registration.success.screens.tsx"
  ),
  route(
    "/failed",
    "./components/organisms/indicators/registration.failed.screens.tsx"
  ),
];
