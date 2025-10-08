import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";

import { isAuthenticated, isRole } from "../utils/auth.helper";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";
import PortalPage from "../pages/private/portals/portal.page";
import AutoExitMiddlewarePage from "../pages/middleware/auto.exit.middleware.page";
import AuthorizationMiddlewarePage from "../pages/middleware/authorization.middleware.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Registration" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function PortalRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["super_admin", "admin"],
        <PortalProtectedLayout>
          <PortalPage />
        </PortalProtectedLayout>,
        <AuthorizationMiddlewarePage />,
        ["hci", "physician", "presenter", "admin"]
      )()}
    </div>,
    <AutoExitMiddlewarePage />
  );

  return (
    <>
      <Authenticated />
    </>
  );
}
