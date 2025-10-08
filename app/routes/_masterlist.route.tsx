import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";
import PortalPage from "../pages/private/portals/portal.page";
import MasterlistPage from "../pages/private/masterlist/masterlist.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Registration" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function MasterlistRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["super_admin", "admin"],
        <PortalProtectedLayout>
          <MasterlistPage />
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
