import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";

import { isAuthenticated, isRole } from "../utils/auth.helper";

import MainProtectedLayout from "../components/templates/layout/_main.protected.layout.v2.children";

import UserProtectedLayout from "../components/templates/layout/user.protected.layout.children";
import { ProfilePage } from "../pages/private/_profile/profile.page";
import FacilityPage from "../pages/private/facility/facility.page";
import RoadMSPage from "../pages/private/road/road.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Riskless | Roads" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function RoadRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["super_admin", "admin"],
        <MainProtectedLayout>
          <RoadMSPage />
        </MainProtectedLayout>,
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
