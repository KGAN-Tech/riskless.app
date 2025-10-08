import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import FacilitiesPage from "../pages/private/facilities/facilities.page";
import FacilityPage from "../pages/private/facility/facility.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Facility" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function FacilityRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>{isRole(["admin"], <FacilityPage />, <></>, ["hci"])()}</div>,
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
