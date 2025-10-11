import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import AdminDashboard from "./admin.dashboard";
import { isAuthenticated, isRole } from "../utils/auth.helper";

import MainProtectedLayout from "../components/templates/layout/_main.protected.layout.v2.children";

import UserProtectedLayout from "../components/templates/layout/user.protected.layout.children";
import { ProfilePage } from "../pages/private/_profile/profile.page";

export const meta: MetaFunction = () => {
  return [
    { title: "HealthLink | Login" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function UserLogin() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["super_admin", "admin"],
        <MainProtectedLayout>
          <AdminDashboard />
        </MainProtectedLayout>,
        <></>
      )()}

      {isRole(
        ["user"],
        <UserProtectedLayout>
          {" "}
          <ProfilePage />
        </UserProtectedLayout>,
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
