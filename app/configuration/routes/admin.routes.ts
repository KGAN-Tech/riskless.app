import { layout, route, type RouteConfigEntry } from "@react-router/dev/routes";

export const adminRoutes: RouteConfigEntry[] = [
  layout("./components/templates/layout/_main.protected.layout.v2.tsx", [
    route("dashboard", "./routes/admin.dashboard.tsx"),

    route("members", "./routes/admin.members.tsx"),
    route("member/:userId", "./routes/patient.records.tsx"),
    route("doctors", "./routes/admin.doctors.tsx"),

    route("facility", "./routes/_facility.route.tsx"),
    route("facilities", "./routes/_facilities.route.tsx"),
    route("facility/:facilityId", "./routes/_facilities.view.route.tsx"),

    route("reports", "./routes/admin.reports.tsx"),
    route("reports/maps", "./routes/admin.reports.maps.tsx"),
    route("laboratory", "./routes/admin.laboratory.tsx"),
    route("health-screening", "./routes/admin.health.screening.tsx"),
    route("medicines", "./routes/admin.medicines.tsx"),
    route("generator", "./routes/admin.generator.tsx"),
    route("generator/xml", "./routes/admin.generator.xml.tsx"),

    route("counter/front-desk", "./routes/admin.front.desk.tsx"),
    route(
      "counter/front-desk/check-in",
      "./routes/admin.front.desk.checkin.tsx"
    ),

    route("counter/front-desk/test-qr", "./routes/admin.front.desk.testqr.tsx"),
    route("counter/appointment", "./routes/admin.appointment.tsx"),

    // FIXED ROUTES
    route("accounts", "./routes/_account.ms.route.tsx"),
    route("usage", "./routes/_usage.route.tsx"),
    route("billing", "./routes/_billing.route.tsx"),
  ]),
];
