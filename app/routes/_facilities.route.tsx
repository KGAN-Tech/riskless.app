import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import FacilitiesPage from "../pages/private/facilities/facilities.page";
import AutoExitMiddlewarePage from "../pages/middleware/auto.exit.middleware.page";
import AuthorizationMiddlewarePage from "../pages/middleware/authorization.middleware.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Facilities" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function FacilityRoute() {
  const Authenticated = isAuthenticated(
    <div>
      {isRole(
        ["super_admin"],
        <FacilitiesPage />,
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
