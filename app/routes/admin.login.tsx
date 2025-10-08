import AdminLoginPage from "@/components/pages/public/admin.login.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "FTCC | User Login" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function UserLogin() {
  return <AdminLoginPage />;
}
