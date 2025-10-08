import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";
import { isAuthenticated, isRole } from "../utils/auth.helper";
import PortalProtectedLayout from "../components/templates/layout/portal.protected.layout.children";
import YakapRegistrationPage from "../pages/private/registration/registration.page";
import EncounterPage from "../pages/private/encounter/encounter.page";
import UsagePage from "../pages/private/usage/usage.page";
import SecurityAlertPage from "../pages/middleware/hacking.alert.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Security Alert" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function SecurityAlertRoute() {
  return (
    <>
      <SecurityAlertPage />
    </>
  );
}
