import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";

import { isAuthenticated, isRole } from "../utils/auth.helper";

import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";
import CounterPage from "../pages/private/counter/counter.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Counter" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function CounterRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["admin", "super_admin"],
        <PortalProtectedLayout>
          <CounterPage />
        </PortalProtectedLayout>,
        <LoginPage />
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
