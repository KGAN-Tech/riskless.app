import type { MetaFunction } from "react-router";
import { VersionControlPage } from "../pages/private/version.control/version.control.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import AutoExitMiddlewarePage from "../pages/middleware/auto.exit.middleware.page";
import AuthorizationMiddlewarePage from "../pages/middleware/authorization.middleware.page";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";

export const meta: MetaFunction = () => {
  return [
    { title: "Version Control" },
    {
      name: "description",
      content: "Version Control system for FTCC.",
    },
  ];
};

export default function VersionControlRoute() {
  const Authenticated = isAuthenticated(
    <div>
      {isRole(
        ["super_admin"],
        <PortalProtectedLayout>
          <VersionControlPage />
        </PortalProtectedLayout>,
        <AuthorizationMiddlewarePage />
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
