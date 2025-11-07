import type { MetaFunction } from "react-router";

import { RegisterPage } from "../pages/public/auth/registration.page";

export const meta: MetaFunction = () => {
  return [
    { title: "HealthLink | Login" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function UserRegistration() {
  return <RegisterPage />;
}
