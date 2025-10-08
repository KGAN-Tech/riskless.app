import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";

import { isAuthenticated, isRole } from "../utils/auth.helper";
import CounterViewPage from "../pages/private/counter/counter.view.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Counter" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function CounterViewRoute() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>{isRole(["admin"], <CounterViewPage />, <LoginPage />)()}</div>,
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
