import type { MetaFunction } from "react-router";
import LoginPage from "../pages/public/auth/login.page";

export const meta: MetaFunction = () => {
  return [
    { title: "Riskless | Login" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function UserLogin() {
  return <LoginPage />;
}
