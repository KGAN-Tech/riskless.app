import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";

import ExtractorPage from "../pages/private/extractor/extractor.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Extractor" },
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
          <ExtractorPage />
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
