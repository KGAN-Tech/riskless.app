import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";

import {BillingPage} from "../pages/private/billing/billing.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Encounter" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function BillingRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
       ["admin", "super_admin"],

        <BillingPage />,
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
