import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";
import AppointmentPage from "../pages/private/appointments/appointment.page copy";





export const meta: MetaFunction = () => {
  return [
    { title: "Appointment" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function AppointmentRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["admin", "super_admin"],

        <PortalProtectedLayout>
          <AppointmentPage />
        </PortalProtectedLayout>,
        <></>
      )()}
    </div>,
    // render if not authenticated
    <div>
      <LoginPage />
    </div>
  );

  return (
    <>
      <Authenticated />
    </>
  );
}
