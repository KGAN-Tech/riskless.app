import { route, type RouteConfigEntry } from "@react-router/dev/routes";

export const memberRoutes: RouteConfigEntry[] = [
  route("/activity", "./routes/__activity.route.tsx"),
  route("/map", "./routes/__map.route.tsx"),
  route("/notification", "./routes/__notification.route.tsx"),
  route("users/home", "./routes/users.home.page.tsx"),
  route("/account", "./routes/__account.route.tsx"),
  route("/medical-record/FPE", "./routes/users.fpe.page.tsx"),
  route("/consultation", "./routes/users.page.consultation.tsx"),
  route("/consultation/:consultationId/emr", "./routes/users.emr.page.tsx"),
  route("/encounter", "./routes/users.page.encounter.history.tsx"),
  route(
    "/encounter/:encounterId/emr",
    "./routes/users.encounter.view.page.tsx"
  ),
  route("/forms", "./routes/users.form.download.tsx"),
  route("/pharmacy/map", "./routes/users.pharmacy.map.tsx"),
  route("users/profile", "./routes/users.profile.page.tsx"),
  route("users/encounter", "./routes/users.encounter.page.tsx"),
  route("api/appointment", "./routes/users.appointment.page.tsx"),
];
