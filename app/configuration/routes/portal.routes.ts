import { layout, route, type RouteConfigEntry } from "@react-router/dev/routes";

export const portalRoutes: RouteConfigEntry[] = [
  layout("./components/templates/layout/portal.protected.layout.tsx", []),
  layout("./components/templates/layout/_main.interview.layout.tsx", [
    route("counter/interview", "./routes/admin.counter.interview.tsx"),
    route("counter/vitals", "./routes/admin.counter.vitals.tsx"),
    route("counter/pharmacy", "./routes/admin.counter.pharmacy.tsx"),
  ]),

  // Standalone queue display (no layout)
  route("queue/standalone", "./routes/queue.standalone.tsx"),

  // Portal
  route("portals", "./routes/_portal.route.tsx"),
  route("appointments", "./routes/_appointment.route.tsx"),
  route("registration", "./routes/_registration.route.tsx"),
  route("masterlist", "./routes/_masterlist.route.tsx"),
  route("encounters", "./routes/_encounter.route.tsx"),
  route("extractor", "./routes/_extractor.route.tsx"),
  route("counters", "./routes/_counter.route.tsx"),
  route("counters/:counterId", "./routes/_counter.view.route.tsx"),
  route("library", "./routes/_library.route.tsx"),
  route("inventory", "./routes/_inventory.route.tsx"),
  route("migration", "./routes/_migration.route.tsx"),

  route("version-control", "./routes/_version.control.route.tsx"),

  route("profile", "./routes/admin.profile.page.tsx"),

];
