import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";


import {AccountPage} from "../pages/private/account-ms/account.ms.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Account Management" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};  

export default function AccountRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        ["admin", "super_admin"],

        <AccountPage />,
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
