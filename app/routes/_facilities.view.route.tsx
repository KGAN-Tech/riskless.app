import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import FacilityViewPage from "../pages/private/facilities/facility.view.page";
import AuthorizationMiddlewarePage from "../pages/middleware/authorization.middleware.page";
import AutoExitMiddlewarePage from "../pages/middleware/auto.exit.middleware.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Facility | View" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function FacilityViewRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["super_admin"],
        <FacilityViewPage />,
        <AuthorizationMiddlewarePage />
      )()}
    </div>,
    // render if not authenticated
    <AutoExitMiddlewarePage />
  );

  return (
    <>
      <Authenticated />
    </>
  );
}
